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
  t.after(async () => {
    db?.close();
    // Tunggu server benar-benar berhenti sebelum menghapus folder sementara.
    // child.kill() hanya mengirim sinyal; di Windows handle file SQLite masih
    // dipegang proses anak saat rmSync dipanggil, sehingga teardown gagal
    // dengan EPERM dan menandai seluruh suite sebagai failed padahal semua
    // assertion-nya lolos.
    if (child.exitCode === null && child.signalCode === null) {
      await new Promise((resolve) => {
        const done = () => resolve();
        child.once("exit", done);
        child.kill();
        // Jangan menggantung kalau proses sudah mati lebih dulu.
        setTimeout(done, 3000).unref?.();
      });
    }
    try {
      // maxRetries menutup sisa jeda pelepasan handle di Windows.
      rmSync(dir, {
        recursive: true,
        force: true,
        maxRetries: 10,
        retryDelay: 100,
      });
    } catch (error) {
      // Folder sementara bukan bagian dari yang diuji; OS akan membersihkan
      // %TEMP% sendiri. Jangan jatuhkan hasil tes karenanya.
      console.warn(
        `[qa-integration] folder sementara tidak dapat dihapus (${error.code}): ${dir}`,
      );
    }
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
  // Catatan internal: koordinasi staff pada satu tiket, tidak boleh pernah
  // sampai ke customer lewat widget chat maupun email.
  await t.test(
    "QA-05c internal notes stay inside the staff inbox",
    async () => {
      const publicBefore = (
        await call(
          "GET",
          "/public/chat?token=" + conversation.conversationToken,
        )
      ).data.messages.length;
      const mailBefore = Number(
        db
          .prepare(
            "SELECT COUNT(*) n FROM email_outbox WHERE subject='Balasan baru dari ikrarku'",
          )
          .get().n,
      );
      assert.equal(
        (
          await call(
            "POST",
            `/conversations/${conversation.conversationId}/messages`,
            { body: "Minta WD cek revisi cover dulu", visibility: "internal" },
            cs.token,
          )
        ).status,
        201,
      );
      const stored = db
        .prepare(
          "SELECT visibility FROM messages WHERE conversation_id=? ORDER BY created_at DESC LIMIT 1",
        )
        .get(conversation.conversationId);
      assert.equal(stored.visibility, "internal");

      // Widget customer tidak melihat catatan itu.
      const publicAfter = (
        await call(
          "GET",
          "/public/chat?token=" + conversation.conversationToken,
        )
      ).data.messages.length;
      assert.equal(
        publicAfter,
        publicBefore,
        "catatan internal tidak boleh muncul di widget chat customer",
      );

      // Tidak ada email balasan yang terkirim untuk catatan internal.
      assert.equal(
        Number(
          db
            .prepare(
              "SELECT COUNT(*) n FROM email_outbox WHERE subject='Balasan baru dari ikrarku'",
            )
            .get().n,
        ),
        mailBefore,
        "catatan internal tidak boleh memicu email ke customer",
      );

      // Staff tetap melihatnya pada inbox.
      const inbox = await call("GET", "/conversations", undefined, cs.token);
      const thread = inbox.data.find(
        (item) => item.id === conversation.conversationId,
      );
      assert.ok(
        (thread?.messages || []).some(
          (message) => message.visibility === "internal",
        ),
        "staff harus tetap melihat catatan internal",
      );

      // Balasan publik tetap berperilaku seperti semula.
      assert.equal(
        (
          await call(
            "POST",
            `/conversations/${conversation.conversationId}/messages`,
            { body: "Balasan normal ke customer" },
            cs.token,
          )
        ).status,
        201,
      );
      assert.equal(
        (
          await call(
            "GET",
            "/public/chat?token=" + conversation.conversationToken,
          )
        ).data.messages.length,
        publicBefore + 1,
      );
    },
  );
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
  // Payload Mayar yang SEBENARNYA: token lewat query (Mayar tidak mengirim
  // header rahasia dan tidak menandatangani body), order dicocokkan lewat
  // data.transactionId, dan tidak ada field currency.
  await t.test(
    "QA-20 webhook menerima bentuk payload Mayar yang sebenarnya",
    async () => {
      const probe = await call("POST", "/orders", {
        customerName: "Pembayar Mayar",
        email: "mayar-webhook@example.test",
        phone: "081234567891",
        templateId: template.id,
      });
      assert.equal(probe.status, 201);
      const probeId = probe.data.id;
      const amount = Number(
        db.prepare("SELECT amount FROM orders WHERE id=?").get(probeId).amount,
      );
      // Mayar menyimpan transactionId-nya sendiri; kita simpan di gateway_ref.
      db.prepare("UPDATE orders SET gateway_ref=? WHERE id=?").run(
        "mayar-trx-0001",
        probeId,
      );

      // Token lewat query string, bukan header.
      const viaQuery = async (body, token = "local-test-webhook-only") => {
        const response = await fetch(
          `${base}/api/webhooks/mayar?token=${encodeURIComponent(token)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          },
        );
        return {
          status: response.status,
          data: await response.json().catch(() => null),
        };
      };

      // Token salah tetap ditolak.
      assert.equal(
        (await viaQuery({ event: "payment.received" }, "salah")).status,
        401,
      );

      const payload = {
        event: "payment.received",
        data: {
          id: "mayar-inv-0001",
          transactionId: "mayar-trx-0001",
          status: "SUCCESS",
          transactionStatus: "created",
          customerEmail: "mayar-webhook@example.test",
          amount,
          // Sengaja TANPA currency — payload Mayar memang tidak memuatnya.
        },
      };
      assert.equal(
        (await viaQuery(payload)).status,
        200,
        "webhook Mayar yang sah harus diterima",
      );
      assert.equal(
        db
          .prepare("SELECT payment_status FROM orders WHERE id=?")
          .get(probeId).payment_status,
        "Paid",
      );

      // Mayar mengirim ulang sampai menerima 2xx: handler harus idempoten.
      const replay = await viaQuery(payload);
      assert.equal(replay.status, 200);
      assert.equal(replay.data.already, true);

      // Nominal yang tidak cocok tetap ditolak.
      const other = await call("POST", "/orders", {
        customerName: "Nominal Beda",
        email: "mayar-amount@example.test",
        phone: "081234567892",
        templateId: template.id,
      });
      db.prepare("UPDATE orders SET gateway_ref=? WHERE id=?").run(
        "mayar-trx-0002",
        other.data.id,
      );
      assert.equal(
        (
          await viaQuery({
            event: "payment.received",
            data: { transactionId: "mayar-trx-0002", amount: 1 },
          })
        ).status,
        400,
      );
      assert.equal(
        db
          .prepare("SELECT payment_status FROM orders WHERE id=?")
          .get(other.data.id).payment_status,
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
  // Notifikasi progres otomatis: perubahan status task harus sampai ke customer
  // lewat live chat, dan status Done juga mengantre email penyelesaian.
  await t.test(
    "QA-05b task status change notifies the customer and queues a Done email",
    async () => {
      const task = db
        .prepare(
          "SELECT id,status FROM tasks WHERE order_id=? AND assigned_role_id='role_editor'",
        )
        .get(order.id);
      // Test sebelumnya sudah menyentuh task ini, jadi hitung dari baseline.
      const countMail = () =>
        Number(
          db
            .prepare(
              "SELECT COUNT(*) n FROM email_outbox WHERE to_email=? AND subject LIKE 'Pekerjaan selesai%'",
            )
            .get("customer@example.test").n,
        );
      const countMessages = (like) =>
        Number(
          db
            .prepare(
              `SELECT COUNT(*) n FROM messages m JOIN conversations c ON c.id=m.conversation_id WHERE c.order_id=? AND m.body LIKE ?`,
            )
            .get(order.id, like).n,
        );
      const mailBefore = countMail();
      const progressBefore = countMessages("%sudah dimulai%");
      const doneBefore = countMessages("%sudah selesai dikerjakan%");
      // QA-05 sudah menyetel task ini menjadi Done; kembalikan dulu agar
      // perubahan status berikutnya benar-benar berupa transisi.
      assert.equal(
        (
          await call(
            "PATCH",
            `/tasks/${task.id}`,
            { status: "In Progress" },
            editor.token,
          )
        ).status,
        200,
      );
      assert.equal(
        countMessages("%sudah dimulai%") - progressBefore,
        1,
        "status In Progress harus menulis satu pesan ke conversation customer",
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
      assert.equal(
        countMail() - mailBefore,
        1,
        "status Done harus mengantre email penyelesaian ke customer",
      );
      assert.equal(countMessages("%sudah selesai dikerjakan%") - doneBefore, 1);

      // Menyimpan ulang tanpa mengubah status tidak boleh membanjiri live chat
      // atau mengirim email penyelesaian untuk kedua kalinya.
      await call(
        "PATCH",
        `/tasks/${task.id}`,
        { status: "Done" },
        editor.token,
      );
      assert.equal(countMessages("%sudah selesai dikerjakan%") - doneBefore, 1);
      assert.equal(countMail() - mailBefore, 1);

      // "Waiting Customer" tersedia pada dropdown Tasks & Tickets; dulu ditolak
      // server dengan 400 karena tidak termasuk daftar status yang sah.
      const waitingBefore = countMessages("%menunggu konfirmasi atau materi%");
      assert.equal(
        (
          await call(
            "PATCH",
            `/tasks/${task.id}`,
            { status: "Waiting Customer" },
            editor.token,
          )
        ).status,
        200,
      );
      assert.equal(
        countMessages("%menunggu konfirmasi atau materi%") - waitingBefore,
        1,
        "status Waiting Customer harus mengirim pesan ke customer",
      );
    },
  );
  // QA TC-167 — order yang belum dibayar tidak boleh memenuhi Tasks & Tickets.
  await t.test(
    "QA-16 unpaid orders never surface in Tasks & Tickets",
    async () => {
      const created = await call("POST", "/orders", {
        customerName: "Belum Bayar",
        email: "belum-bayar@example.test",
        phone: "081234567890",
        templateId: template.id,
      });
      assert.equal(created.status, 201);
      const unpaidId = created.data.id;
      // Tanam task untuk order yang belum bayar; endpoint harus tetap menyaringnya.
      db.prepare(
        "INSERT INTO tasks(id,order_id,title,description,status,priority,assigned_role_id,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)",
      ).run(
        "task_unpaid_probe",
        unpaidId,
        "Onboarding order belum bayar",
        "Seharusnya tidak tampil",
        "Open",
        "High",
        "role_cs",
        new Date().toISOString(),
        new Date().toISOString(),
      );
      assert.equal(
        db.prepare("SELECT payment_status FROM orders WHERE id=?").get(unpaidId)
          .payment_status,
        "Pending",
      );
      for (const actor of [admin, cs, editor]) {
        const list = await call("GET", "/tasks", undefined, actor.token);
        assert.equal(list.status, 200);
        assert.ok(
          !list.data.some((task) => task.order_id === unpaidId),
          "task dari order yang belum bayar tidak boleh tampil di Tasks & Tickets",
        );
      }
      // Task dari order yang sudah dibayar tetap tampil.
      const paidList = await call("GET", "/tasks", undefined, admin.token);
      assert.ok(
        paidList.data.some((task) => task.order_id === order.id),
        "task dari order yang sudah bayar harus tetap tampil",
      );
    },
  );

  // QA TC-151 — badge rekomendasi hanya untuk template yang sudah publish,
  // dan hanya Administrator yang boleh mengaturnya.
  await t.test(
    "QA-17 recommended badge is admin-only and publish-gated",
    async () => {
      assert.equal(
        (
          await call(
            "POST",
            `/templates/${template.id}/recommend`,
            { recommended: true },
            editor.token,
          )
        ).status,
        403,
      );
      const ok = await call(
        "POST",
        `/templates/${template.id}/recommend`,
        { recommended: true },
        admin.token,
      );
      assert.equal(ok.status, 200);
      assert.equal(ok.data.recommended, true);
      assert.equal(
        Number(
          db
            .prepare("SELECT recommended FROM templates WHERE id=?")
            .get(template.id).recommended,
        ),
        1,
      );
      const off = await call(
        "POST",
        `/templates/${template.id}/recommend`,
        { recommended: false },
        admin.token,
      );
      assert.equal(off.data.recommended, false);
    },
  );

  // QA TC-173 & TC-174 — takedown dan hapus artikel dari Articles CMS.
  await t.test("QA-18 article takedown and delete", async () => {
    const created = await call(
      "POST",
      "/articles",
      {
        title: "Artikel QA",
        slug: "artikel-qa-" + Date.now(),
        category: "Tips",
        excerpt: "Ringkasan",
        content: "Isi artikel",
        status: "Published",
      },
      admin.token,
    );
    assert.equal(created.status, 201);
    const articleId = created.data.id;
    // Takedown = tarik dari publikasi, datanya tetap ada.
    const down = await call(
      "PATCH",
      `/articles/${articleId}`,
      { status: "Draft" },
      admin.token,
    );
    assert.equal(down.status, 200);
    assert.equal(down.data.status, "Draft");
    assert.ok(
      db.prepare("SELECT id FROM articles WHERE id=?").get(articleId),
      "takedown tidak boleh menghapus artikel",
    );
    // Web Designer tidak boleh menghapus artikel.
    assert.equal(
      (await call("DELETE", `/articles/${articleId}`, undefined, editor.token))
        .status,
      403,
    );
    assert.equal(
      (await call("DELETE", `/articles/${articleId}`, undefined, admin.token))
        .status,
      200,
    );
    assert.equal(
      db.prepare("SELECT id FROM articles WHERE id=?").get(articleId),
      undefined,
    );
  });

  // QA TC-183 — email verifikasi memakai kerangka ber-branding, bukan HTML polos.
  await t.test("QA-19 verification email uses the branded layout", async () => {
    const email = `branded-${Date.now()}@example.test`;
    assert.equal(
      (
        await call("POST", "/auth/signup", {
          firstName: "Branded",
          lastName: "Tester",
          email,
          username: `branded${Date.now()}`,
          password: "Audit-fixture-123",
          passwordConfirm: "Audit-fixture-123",
        })
      ).status,
      201,
    );
    const mail = db
      .prepare(
        "SELECT html FROM email_outbox WHERE to_email=? ORDER BY created_at DESC LIMIT 1",
      )
      .get(email);
    assert.ok(mail, "email verifikasi harus masuk outbox");
    assert.match(mail.html, /<!doctype html>/i);
    assert.match(mail.html, /ikrarku/);
    assert.match(mail.html, /Verifikasi Email/);
    assert.ok(
      mail.html.includes("verify-email?token="),
      "email harus memuat tautan verifikasi",
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
