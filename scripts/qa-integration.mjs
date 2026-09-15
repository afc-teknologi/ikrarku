import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import net from "node:net";

test("QA remediation: real HTTP routes, isolated SQLite, no external email/payment", async (t) => {
  const dir = mkdtempSync(path.join(os.tmpdir(), "ikrarku-qa-"));
  const port = await new Promise((resolve) => {
    const s = net.createServer();
    s.listen(0, "127.0.0.1", () => {
      const p = s.address().port;
      s.close(() => resolve(p));
    });
  });
  const env = {
    ...process.env,
    NODE_ENV: "production",
    API_PORT: String(port),
    DATA_DIR: dir,
    DB_FILE: path.join(dir, "qa.sqlite"),
    UPLOAD_DIR: path.join(dir, "uploads"),
    RECEIPT_DIR: path.join(dir, "receipts"),
    ADMIN_BOOTSTRAP_PASSWORD: "Audit-fixture-123",
    ADMIN_BOOTSTRAP_EMAIL: "admin@example.test",
    STAFF_BOOTSTRAP_PASSWORD: "Audit-fixture-123",
    SMTP_HOST: "",
    PAYMENT_MODE: "mayar",
    MAYAR_WEBHOOK_TOKEN: "local-test-webhook-only",
  };
  const child = spawn(process.execPath, ["server/index.mjs"], {
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let logs = "";
  child.stderr.on("data", (d) => (logs += d));
  child.stdout.on("data", (d) => (logs += d));
  let db;
  t.after(() => {
    db?.close();
    child.kill();
    rmSync(dir, { recursive: true, force: true });
  });
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(base + "/api/health")).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 30));
    if (i === 99) throw new Error(logs);
  }
  db = new DatabaseSync(env.DB_FILE);
  const call = async (method, url, body, token, headers = {}) => {
    const response = await fetch(base + "/api" + url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return {
      status: response.status,
      data: await response.json().catch(() => null),
    };
  };
  const login = async (username) => {
    const r = await call("POST", "/auth/login", {
      username,
      password: "Audit-fixture-123",
    });
    assert.equal(r.status, 200, JSON.stringify(r.data));
    return r.data;
  };
  const admin = await login("admin"),
    editor = await login("editor"),
    cs = await login("cs");
  const createUser = async (username, roleId) => {
    const r = await call(
      "POST",
      "/users",
      {
        firstName: username,
        email: username + "@example.test",
        username,
        password: "Audit-fixture-123",
        roleId,
      },
      admin.token,
    );
    assert.equal(r.status, 201);
    return login(username);
  };
  const editor2 = await createUser("editor2", "role_editor"),
    cs2 = await createUser("cs2", "role_cs"),
    customer = await createUser("customer", "role_user"),
    other = await createUser("other", "role_user");
  let order, template, conversation;
  await t.test(
    "QA-01 production reset never returns development token",
    async () => {
      const r = await call("POST", "/auth/forgot-password", {
        email: "admin@example.test",
      });
      assert.equal(r.status, 200);
      assert.equal(r.data.devResetUrl, undefined);
    },
  );
  await t.test("QA-03 disabled session is rejected", async () => {
    db.prepare("UPDATE users SET active=0 WHERE id=?").run(other.user.id);
    assert.equal(
      (await call("GET", "/me", undefined, other.token)).status,
      401,
    );
    db.prepare("UPDATE users SET active=1 WHERE id=?").run(other.user.id);
  });
  await t.test("QA-06 signup conflict creates no orphan user", async () => {
    const r = await call("POST", "/auth/signup", {
      firstName: "Conflict",
      username: "customer",
      email: "new@example.test",
      password: "Audit-fixture-123",
      passwordConfirm: "Audit-fixture-123",
    });
    assert.equal(r.status, 409);
    assert.equal(
      db.prepare("SELECT id FROM users WHERE email=?").get("new@example.test"),
      undefined,
    );
  });
  await t.test(
    "Signup verifies email before login and normalizes input",
    async () => {
      const r = await call("POST", "/auth/signup", {
        firstName: "New",
        username: "new-customer",
        email: "New@Example.test",
        password: "Audit-fixture-123",
        passwordConfirm: "Audit-fixture-123",
      });
      assert.equal(r.status, 201);
      assert.equal(r.data.devVerificationUrl, undefined);
      assert.equal(
        (
          await call("POST", "/auth/login", {
            username: "new-customer",
            password: "Audit-fixture-123",
          })
        ).status,
        403,
      );
      const row = db
        .prepare("SELECT * FROM users WHERE email='new@example.test'")
        .get();
      assert.equal(
        (
          await call("POST", "/auth/verify-email", {
            token: row.verification_token,
          })
        ).status,
        200,
      );
      await login("new-customer");
    },
  );
  await t.test(
    "QA-02 anonymous email cannot obtain old chat token",
    async () => {
      const a = await call("POST", "/public/chat", {
        email: "customer@example.test",
        body: "Private conversation",
      });
      conversation = a.data;
      const b = await call("POST", "/public/chat", {
        email: "customer@example.test",
        body: "Another browser",
      });
      assert.notEqual(a.data.conversationToken, b.data.conversationToken);
      const msgs = await call(
        "GET",
        "/public/chat?token=" + b.data.conversationToken,
      );
      assert.equal(msgs.data.messages.length, 1);
    },
  );
  await t.test("QA-05 assigned CS may reply, other CS may not", async () => {
    db.prepare("UPDATE conversations SET assigned_cs_id=? WHERE id=?").run(
      cs.user.id,
      conversation.conversationId,
    );
    assert.equal(
      (
        await call(
          "POST",
          `/conversations/${conversation.conversationId}/messages`,
          { body: "Assigned response" },
          cs.token,
        )
      ).status,
      201,
    );
    assert.equal(
      (
        await call(
          "POST",
          `/conversations/${conversation.conversationId}/messages`,
          { body: "Forbidden" },
          cs2.token,
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await call(
          "PATCH",
          `/conversations/${conversation.conversationId}`,
          { status: "Resolved" },
          cs2.token,
        )
      ).status,
      403,
    );
  });
  await t.test("QA-04 editor cannot replace another assignment", async () => {
    assert.equal(
      (
        await call(
          "PUT",
          `/clients/${customer.user.id}/assignment`,
          { editorId: editor.user.id },
          admin.token,
        )
      ).status,
      200,
    );
    assert.equal(
      (
        await call(
          "PUT",
          `/clients/${customer.user.id}/assignment`,
          {},
          editor2.token,
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await call(
          "GET",
          `/clients/${customer.user.id}/site`,
          undefined,
          editor2.token,
        )
      ).status,
      403,
    );
  });
  await t.test(
    "QA-07 last admin cannot be demoted via either update route",
    async () => {
      assert.equal(
        (
          await call(
            "PATCH",
            `/users/${admin.user.id}/role`,
            { roleId: "role_user" },
            admin.token,
          )
        ).status,
        400,
      );
      assert.equal(
        (
          await call(
            "PATCH",
            `/users/${admin.user.id}`,
            { roleId: "role_user" },
            admin.token,
          )
        ).status,
        400,
      );
    },
  );
  await t.test("QA-16 CS cannot publish a canvas", async () => {
    assert.equal(
      (
        await call(
          "PUT",
          "/site",
          { slug: "cs-site", sections: [], status: "Published" },
          cs.token,
        )
      ).status,
      403,
    );
  });
  await t.test(
    "QA-12 pending email cannot claim another customer orders",
    async () => {
      const r = await call(
        "PATCH",
        "/me",
        {
          email: "guest-owner@example.test",
          currentPassword: "Audit-fixture-123",
        },
        other.token,
      );
      assert.equal(r.status, 200);
      assert.equal(r.data.emailVerificationRequired, true);
      assert.equal(
        (await call("GET", "/me", undefined, other.token)).data.user.email,
        "other@example.test",
      );
    },
  );
  await t.test("Template approval creates a paid template", async () => {
    const r = await call(
      "POST",
      "/templates",
      { name: "QA Template", price: 100000, canvasJson: [] },
      editor.token,
    );
    assert.equal(r.status, 201);
    template = r.data;
    assert.equal(
      (
        await call(
          "POST",
          `/templates/${template.id}/review`,
          { decision: "approved" },
          admin.token,
        )
      ).status,
      200,
    );
  });
  await t.test(
    "QA-15 draft revision does not change published version",
    async () => {
      const r = await call(
        "PATCH",
        `/templates/${template.id}`,
        { name: "Revised draft" },
        editor.token,
      );
      assert.equal(r.status, 200);
      assert.equal(r.data.pendingReview, true);
      const pub = await call("GET", "/public/bootstrap");
      assert.equal(
        pub.data.templates.find((x) => x.id === template.id).name,
        "QA Template",
      );
      const workspace = await call("GET", "/templates", undefined, admin.token);
      assert.equal(
        workspace.data.find((x) => x.id === template.id).name,
        "Revised draft",
      );
    },
  );
  await t.test(
    "QA-15 rejecting revision keeps published template live",
    async () => {
      assert.equal(
        (
          await call(
            "POST",
            `/templates/${template.id}/review`,
            { decision: "rejected" },
            admin.token,
          )
        ).status,
        200,
      );
      const pub = await call("GET", "/public/bootstrap");
      assert.equal(
        pub.data.templates.find((x) => x.id === template.id).name,
        "QA Template",
      );
    },
  );
  await t.test("QA-11 unpaid template cannot be published", async () => {
    assert.equal(
      (
        await call(
          "PUT",
          "/site",
          {
            slug: "customer",
            templateId: template.id,
            sections: [],
            status: "Published",
          },
          customer.token,
        )
      ).status,
      403,
    );
  });
  await t.test(
    "QA-13 autosave loads independently from published site",
    async () => {
      const sections = [
        { id: "section", columns: [{ id: "column", features: [] }] },
      ];
      assert.equal(
        (
          await call(
            "PUT",
            "/site/autosave",
            { slug: "customer", title: "Autosave only", sections },
            customer.token,
          )
        ).status,
        200,
      );
      assert.equal(
        (await call("GET", "/site/autosave", undefined, customer.token)).data
          .title,
        "Autosave only",
      );
      assert.notEqual(
        (await call("GET", "/site", undefined, customer.token)).data.title,
        "Autosave only",
      );
      assert.equal(
        (
          await call(
            "GET",
            `/clients/${customer.user.id}/site/autosave`,
            undefined,
            editor2.token,
          )
        ).status,
        403,
      );
    },
  );
  await t.test(
    "Order amount is server-derived; foreign payer rejected",
    async () => {
      const r = await call(
        "POST",
        "/orders",
        {
          customerName: "Customer",
          email: "customer@example.test",
          phone: "08123456789",
          templateId: template.id,
          amount: 1,
        },
        customer.token,
      );
      assert.equal(r.status, 201);
      order = r.data;
      assert.equal(order.amount, 100000);
      assert.equal(
        (
          await call(
            "POST",
            `/orders/${order.id}/pay`,
            { paymentMethod: "QRIS" },
            other.token,
          )
        ).status,
        403,
      );
    },
  );
  const webhook = (body, token = "local-test-webhook-only") =>
    call("POST", "/webhooks/mayar", body, undefined, {
      "x-mayar-token": token,
    });
  await t.test(
    "QA-08 webhook rejects missing token, unpaid, testing and wrong amount",
    async () => {
      assert.equal(
        (await webhook({ event: "paid", reference: order.id }, "")).status,
        401,
      );
      assert.equal(
        (await webhook({ event: "unpaid", reference: order.id })).data.ignored,
        "unpaid",
      );
      assert.equal(
        (await webhook({ event: "testing", reference: order.id })).data.ignored,
        "testing",
      );
      assert.equal(
        (
          await webhook({
            event: "paid",
            reference: order.id,
            amount: 1,
            currency: "IDR",
          })
        ).status,
        400,
      );
      assert.equal(
        db.prepare("SELECT payment_status FROM orders WHERE id=?").get(order.id)
          .payment_status,
        "Pending",
      );
    },
  );
  await t.test(
    "QA-09 receipt failure retains paid order and supports retry",
    async () => {
      const receiptName =
        "RCPT-" +
        new Date().getFullYear() +
        "-" +
        order.orderNo.split("-").at(-1) +
        ".pdf";
      const conflict = path.join(dir, "receipts", receiptName);
      mkdirSync(conflict);
      assert.equal(
        (
          await webhook({
            event: "paid",
            reference: order.id,
            amount: 100000,
            currency: "IDR",
          })
        ).status,
        500,
      );
      assert.equal(
        db
          .prepare("SELECT fulfillment_status FROM orders WHERE id=?")
          .get(order.id).fulfillment_status,
        "Failed",
      );
      rmSync(conflict, { recursive: true });
      assert.equal(
        (
          await call(
            "POST",
            `/orders/${order.id}/retry-fulfillment`,
            {},
            admin.token,
          )
        ).status,
        200,
      );
    },
  );
  await t.test(
    "QA-09 repeated webhook creates no duplicate tasks",
    async () => {
      assert.equal(
        (
          await webhook({
            event: "paid",
            reference: order.id,
            amount: 100000,
            currency: "IDR",
          })
        ).status,
        200,
      );
      assert.equal(
        db
          .prepare("SELECT COUNT(*) n FROM tasks WHERE order_id=?")
          .get(order.id).n,
        2,
      );
    },
  );
  await t.test("QA-10 paid order gives assigned editor access", async () => {
    const assigned = db
      .prepare("SELECT assigned_editor_id FROM orders WHERE id=?")
      .get(order.id).assigned_editor_id;
    assert.equal(assigned, editor.user.id);
    assert.equal(
      (
        await call(
          "GET",
          `/clients/${customer.user.id}/site`,
          undefined,
          editor.token,
        )
      ).status,
      200,
    );
  });
  await t.test("QA-05 CS cannot update editor task", async () => {
    const task = db
      .prepare(
        "SELECT id FROM tasks WHERE order_id=? AND assigned_role_id='role_editor'",
      )
      .get(order.id);
    assert.equal(
      (await call("PATCH", `/tasks/${task.id}`, { status: "Done" }, cs.token))
        .status,
      403,
    );
    assert.equal(
      (
        await call(
          "PATCH",
          `/tasks/${task.id}`,
          { status: "Done" },
          editor.token,
        )
      ).status,
      200,
    );
  });
  await t.test(
    "QA-11 paid template can now publish; draft is cleared",
    async () => {
      assert.equal(
        (
          await call(
            "PUT",
            "/site",
            {
              title: "Wedding",
              slug: "customer",
              templateId: template.id,
              sections: [],
              status: "Published",
            },
            customer.token,
          )
        ).status,
        200,
      );
      assert.equal(
        (await call("GET", "/site/autosave", undefined, customer.token)).data,
        null,
      );
    },
  );
  await t.test(
    "QA-17 public greetings persist across independent reads",
    async () => {
      assert.equal(
        (
          await call("POST", "/public/sites/customer/greetings", {
            name: "Guest",
            message: "Congratulations",
          })
        ).status,
        201,
      );
      const r = await call("GET", "/public/sites/customer/greetings");
      assert.equal(r.status, 200);
      assert.equal(r.data[0].message, "Congratulations");
    },
  );
  await t.test(
    "Receipt is private without authorization or access token",
    async () => {
      assert.equal(
        (await fetch(base + `/api/receipts/${order.id}`)).status,
        403,
      );
      assert.equal(
        (
          await fetch(
            base + `/api/receipts/${order.id}?token=${order.guestToken}`,
          )
        ).status,
        200,
      );
    },
  );
  await t.test("Customer cannot read another owned order", async () => {
    assert.equal(
      (await call("GET", `/orders/${order.id}`, undefined, other.token)).status,
      403,
    );
    assert.equal(
      (await call("GET", "/me/orders", undefined, other.token)).data.length,
      0,
    );
  });
  await t.test(
    "Paid guest checkout is claimed only after email verification and creates site assignment",
    async () => {
      const guest = await call("POST", "/orders", {
        customerName: "Guest",
        email: "guestpaid@example.test",
        phone: "08123456789",
        templateId: template.id,
      });
      assert.equal(guest.status, 201);
      const notifications = await Promise.all(
        [1, 2].map(() =>
          webhook({
            event: "paid",
            reference: guest.data.id,
            amount: 100000,
            currency: "IDR",
          }),
        ),
      );
      assert.deepEqual(
        notifications.map((r) => r.status),
        [200, 200],
      );
      assert.equal(
        db
          .prepare("SELECT COUNT(*) n FROM tasks WHERE order_id=?")
          .get(guest.data.id).n,
        2,
      );
      const signup = await call("POST", "/auth/signup", {
        firstName: "Guest",
        lastName: "Paid",
        username: "guestpaid",
        email: "guestpaid@example.test",
        password: "Audit-fixture-123",
        passwordConfirm: "Audit-fixture-123",
      });
      assert.equal(signup.status, 201);
      assert.equal(
        db.prepare("SELECT user_id FROM orders WHERE id=?").get(guest.data.id)
          .user_id,
        null,
      );
      const user = db
        .prepare("SELECT * FROM users WHERE username='guestpaid'")
        .get();
      assert.equal(
        (
          await call("POST", "/auth/verify-email", {
            token: user.verification_token,
          })
        ).status,
        200,
      );
      const paid = db
        .prepare("SELECT * FROM orders WHERE id=?")
        .get(guest.data.id);
      assert.equal(paid.user_id, user.id);
      const assignment = db
        .prepare("SELECT editor_id FROM site_assignments WHERE user_id=?")
        .get(user.id);
      assert.equal(assignment.editor_id, paid.assigned_editor_id);
      const owner = await login("guestpaid");
      assert.equal(
        (await call("GET", "/me/orders", undefined, owner.token)).data.length,
        1,
      );
    },
  );
  await t.test(
    "Approval publishes pending content atomically from the reviewer's perspective",
    async () => {
      assert.equal(
        (
          await call(
            "PATCH",
            `/templates/${template.id}`,
            {
              name: "Approved revision",
              canvasJson: [
                { id: "revision", columns: [{ id: "column", features: [] }] },
              ],
            },
            editor.token,
          )
        ).status,
        200,
      );
      assert.equal(
        (
          await call(
            "POST",
            `/templates/${template.id}/review`,
            { decision: "approved" },
            admin.token,
          )
        ).status,
        200,
      );
      const live = (await call("GET", "/public/bootstrap")).data.templates.find(
        (item) => item.id === template.id,
      );
      assert.equal(live.name, "Approved revision");
      assert.equal(live.canvasSections[0].id, "revision");
    },
  );
});
