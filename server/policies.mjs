// Object-level authorization and atomic data changes shared by route handlers.
export function createPolicies(db) {
  const fail = (status, message) => {
    throw Object.assign(new Error(message), { status });
  };
  const admin = (user) => user?.permissions?.includes("*");
  const transaction = (fn) => {
    db.exec("BEGIN IMMEDIATE");
    try {
      const result = fn();
      db.exec("COMMIT");
      return result;
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  };
  function requireAdminRemaining(row, roleId, active) {
    if (
      row.role_id === "role_admin" &&
      row.active &&
      (roleId !== "role_admin" || !active) &&
      db
        .prepare(
          "SELECT COUNT(*) n FROM users WHERE role_id='role_admin' AND active=1",
        )
        .get().n <= 1
    )
      fail(400, "Minimal satu Administrator aktif harus dipertahankan");
  }
  function requireTask(user, id) {
    const row = db.prepare("SELECT * FROM tasks WHERE id=?").get(id);
    if (!row) fail(404, "Task tidak ditemukan");
    if (
      !admin(user) &&
      row.assigned_user_id !== user.id &&
      !(row.assigned_user_id === null && row.assigned_role_id === user.roleId)
    )
      fail(403, "Task bukan assignment Anda");
    return row;
  }
  function requireConversation(user, id) {
    const row = db.prepare("SELECT * FROM conversations WHERE id=?").get(id);
    if (!row) fail(404, "Conversation tidak ditemukan");
    const assignedEditor = db
      .prepare(
        "SELECT 1 FROM site_assignments a JOIN users u ON u.id=a.user_id WHERE a.editor_id=? AND lower(u.email)=lower(?)",
      )
      .get(user.id, row.customer_email);
    if (!admin(user) && row.assigned_cs_id !== user.id && !assignedEditor)
      fail(403, "Conversation bukan assignment Anda");
    return row;
  }
  function requireTemplate(user, id) {
    const row = db.prepare("SELECT * FROM templates WHERE id=?").get(id);
    if (!row) fail(404, "Template tidak ditemukan");
    if (!admin(user) && row.created_by !== user.id)
      fail(403, "Template bukan milik Anda");
    return row;
  }
  function claimGuestOrders(userId) {
    const user = db
      .prepare(
        "SELECT * FROM users WHERE id=? AND active=1 AND email_verified=1",
      )
      .get(userId);
    if (!user) return;
    db.prepare(
      "UPDATE orders SET user_id=? WHERE user_id IS NULL AND lower(email)=lower(?)",
    ).run(userId, user.email);
    const order = db
      .prepare(
        "SELECT * FROM orders WHERE user_id=? AND payment_status='Paid' AND assigned_editor_id IS NOT NULL ORDER BY paid_at DESC LIMIT 1",
      )
      .get(userId);
    if (order) assignPaidSite(order, userId);
  }
  function assignPaidSite(order, userId) {
    // Preserve existing deliberate assignment; new customers inherit their paid order's designer.
    db.prepare(
      `INSERT INTO site_assignments(id,user_id,editor_id,assigned_by,created_at,updated_at) VALUES(?,?,?,?,?,?) ON CONFLICT(user_id) DO NOTHING`,
    ).run(
      "order_" + order.id,
      userId,
      order.assigned_editor_id,
      order.assigned_editor_id,
      new Date().toISOString(),
      new Date().toISOString(),
    );
  }
  function requireEntitlement(actor, userId, templateId, sections) {
    if (!Array.isArray(sections)) fail(400, "Canvas harus berupa array");
    if (
      !sections.every(
        (s) =>
          s &&
          typeof s.id === "string" &&
          Array.isArray(s.columns) &&
          s.columns.every((c) => Array.isArray(c.features)),
      )
    )
      fail(400, "Struktur canvas tidak valid");
    const ids = new Set(
      [templateId, ...sections.map((s) => s.sourceTemplateId)].filter(Boolean),
    );
    if (admin(actor)) return;
    for (const id of ids) {
      const template = db.prepare("SELECT * FROM templates WHERE id=?").get(id);
      if (!template) fail(404, "Template tidak ditemukan");
      if (
        template.price > 0 &&
        !db
          .prepare(
            "SELECT 1 FROM orders WHERE user_id=? AND template_id=? AND payment_status='Paid'",
          )
          .get(userId, id)
      )
        fail(403, "Template berbayar belum dimiliki customer");
    }
  }
  function siteDraft(userId) {
    const r = db
      .prepare("SELECT * FROM site_autosaves WHERE user_id=?")
      .get(userId);
    return r
      ? {
          sections: JSON.parse(r.canvas_json),
          title: r.title,
          slug: r.slug,
          templateId: r.template_id,
          updatedAt: r.updated_at,
        }
      : null;
  }
  return {
    transaction,
    requireAdminRemaining,
    requireTask,
    requireConversation,
    requireTemplate,
    requireEntitlement,
    claimGuestOrders,
    assignPaidSite,
    siteDraft,
  };
}
