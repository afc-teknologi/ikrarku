import { useEffect, useId, useRef, useState } from "react";
import { Bell, ClipboardList, MessageCircle, ReceiptText } from "lucide-react";
import { useT } from "../i18n";
import type { StaffNotice } from "../staffNotices";

const icons = { chat: MessageCircle, order: ReceiptText, task: ClipboardList };
const label = { chat: ["Chat", "Chat"], order: ["Order", "Order"], task: ["Tugas", "Task"] } as const;
const noticeKey = (notice: StaffNotice) => `${notice.kind}:${notice.id}`;

export default function StaffNoticeMenu({ accountId, items, onSelect }: {
  accountId: string;
  items: StaffNotice[];
  onSelect: (notice: StaffNotice) => void;
}) {
  const t = useT();
  const id = useId();
  const storageKey = `ikrarku.staff-notices:${accountId}`;
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(saved) ? saved.filter(value => typeof value === "string") : [];
    } catch {
      return [];
    }
  });
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const seenKeys = new Set(seen);
  const isUnread = (notice: StaffNotice) => notice.unread ?? !seenKeys.has(noticeKey(notice));
  const latest = [...items].sort((a, b) =>
    Number(isUnread(b)) - Number(isUnread(a)) || Date.parse(b.date) - Date.parse(a.date),
  );
  const unread = latest.filter(isUnread).length;
  const title = t("Notifikasi", "Notifications");
  const select = (notice: StaffNotice) => {
    if (notice.kind !== "chat" && isUnread(notice)) {
      const next = [...seen, noticeKey(notice)];
      setSeen(next);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* The state stays available during this visit. */
      }
    }
    setOpen(false);
    onSelect(notice);
  };

  return (
    <div className="staff-notice-wrap" ref={root}>
      <button type="button" className="icon-btn staff-notice-trigger" ref={trigger}
        aria-label={unread ? `${title} (${unread})` : title} aria-expanded={open} aria-controls={id}
        title={title} onClick={() => setOpen(value => !value)}>
        <Bell size={18} aria-hidden="true" />
        {unread > 0 && <span className="notification-badge" aria-hidden="true">{unread > 99 ? "99+" : unread}</span>}
      </button>
      {open && (
        <section className="staff-notice-panel" id={id} aria-label={title}>
          <header>
            <strong>{title}</strong>
            {unread > 0 && <small>{t(`${unread} belum dibaca`, `${unread} unread`)}</small>}
          </header>
          {latest.length ? (
            <ul>
              {latest.map(notice => {
                const Icon = icons[notice.kind];
                const isNew = isUnread(notice);
                return (
                  <li key={noticeKey(notice)}>
                    <button type="button" data-unread={isNew || undefined} onClick={() => select(notice)}>
                      <Icon size={17} aria-hidden="true" />
                      <span>
                        <small>{t(label[notice.kind][0], label[notice.kind][1])}{isNew ? t(" · Baru", " · New") : ""}</small>
                        <strong>{notice.title}</strong>
                        <span>{notice.detail}</span>
                      </span>
                      <time dateTime={notice.date}>{new Date(notice.date).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</time>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : <p>{t("Belum ada aktivitas.", "No activity yet.")}</p>}
        </section>
      )}
    </div>
  );
}
