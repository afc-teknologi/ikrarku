export type StaffNotice = {
  kind: "chat" | "order" | "task";
  id: string;
  target: string;
  title: string;
  detail: string;
  date: string;
  unread?: boolean;
};

export function chatNotices(conversations: any[]): StaffNotice[] {
  return conversations.flatMap(conversation => {
    const message = conversation.messages?.findLast(
      (item: any) => item.sender_type === "customer",
    );
    if (!message || conversation.status === "Resolved") return [];
    return [{
      kind: "chat",
      id: message.id,
      target: conversation.id,
      title: conversation.customer_name || "Pengunjung",
      detail: message.body || "Pesan masuk",
      date: message.created_at,
      unread: Number(conversation.unreadCount) > 0,
    }];
  });
}

export function taskNotices(tasks: any[], includeOrders: boolean): StaffNotice[] {
  const seenOrders = new Set<string>();
  return tasks.flatMap(task => {
    if (["Done", "Cancelled", "Approved", "Rejected"].includes(task.status)) return [];
    if (task.order_id) {
      if (!includeOrders || seenOrders.has(task.order_id)) return [];
      seenOrders.add(task.order_id);
    }
    return [{
      kind: task.order_id ? "order" : "task",
      id: task.order_id || task.id,
      target: task.id,
      title: task.order_no || task.title,
      detail: task.customer_name || task.template_name || task.title,
      date: task.created_at,
    }];
  });
}

export function orderNotices(rows: Record<string, any>[]): StaffNotice[] {
  return rows.filter(row => row.payment_status === "Paid").map(row => ({
    kind: "order",
    id: row.id,
    target: row.id,
    title: row.order_no,
    detail: [row.customer_name, row.template_name].filter(Boolean).join(" · "),
    date: row.paid_at || row.created_at,
  }));
}

export function observeStaffNotices(previous: Set<string> | undefined, notices: StaffNotice[]) {
  const ids = new Set(notices.map(notice => notice.id));
  const fresh = previous
    ? notices.filter(notice => !previous.has(notice.id) && notice.unread !== false)
    : [];
  return { ids, fresh };
}
