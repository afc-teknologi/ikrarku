// Menyiapkan database PRODUCTION dari salinan database STAGING.
//
//   node scripts/prod-seed-from-staging.mjs <staging.sqlite> <production.sqlite> [--force]
//
// Yang DIBAWA ke production (hasil kerja tim di staging):
//   template + revisi/draft, sound library, artikel, metode pembayaran,
//   pengaturan platform, role, dan akun tim (Admin, CS, Web Designer).
// Yang DIBUANG (data uji staging):
//   order, tiket order, live chat, komisi, website customer, RSVP, ucapan,
//   email outbox, sesi login, audit log, dan seluruh akun Customer (role User)
//   beserta media miliknya.
//
// Database staging hanya dibaca (disalin lewat VACUUM INTO), tidak diubah.
// Tujuan yang sudah ada ditolak kecuali --force, supaya production yang sudah
// berisi order sungguhan tidak tertimpa tanpa sengaja.
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const [src, dst] = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const force = process.argv.includes("--force");
if (!src || !dst) {
  console.error("Pakai: node scripts/prod-seed-from-staging.mjs <staging.sqlite> <production.sqlite> [--force]");
  process.exit(1);
}
if (!fs.existsSync(src)) {
  console.error(`✗ Database staging tidak ditemukan: ${src}`);
  process.exit(1);
}
if (fs.existsSync(dst)) {
  if (!force) {
    console.error(`✗ ${dst} sudah ada. Production yang sudah berjalan tidak ditimpa. Tambahkan --force bila memang ingin mengulang dari staging.`);
    process.exit(1);
  }
  for (const suffix of ["", "-wal", "-shm"]) fs.rmSync(dst + suffix, { force: true });
}
fs.mkdirSync(path.dirname(dst), { recursive: true });

const source = new DatabaseSync(src, { readOnly: true });
source.exec(`VACUUM INTO '${dst.replace(/'/g, "''")}'`);
source.close();

const db = new DatabaseSync(dst);
db.exec("PRAGMA foreign_keys=ON");
const tables = new Set(
  db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map((row) => row.name),
);
const count = (table, where = "") =>
  tables.has(table) ? db.prepare(`SELECT COUNT(*) n FROM ${table} ${where}`).get().n : 0;
const wipe = (table, where = "") => {
  if (!tables.has(table)) return 0;
  return Number(db.prepare(`DELETE FROM ${table} ${where}`).run().changes);
};

const customerFilter =
  "WHERE role_id IN (SELECT id FROM roles WHERE name='User')";
const removed = {};
db.exec("BEGIN");
try {
  for (const table of [
    "template_commissions",
    "rsvp_responses",
    "greetings",
    "conversation_reads",
    "messages",
    "conversations",
  ])
    removed[table] = wipe(table);
  removed.tasks = wipe("tasks", "WHERE order_id IS NOT NULL");
  removed.orders = wipe("orders");
  for (const table of ["site_autosaves", "site_revisions", "site_assignments", "sites"])
    removed[table] = wipe(table);
  removed.media_customer = wipe(
    "media_assets",
    `WHERE owner_user_id IN (SELECT id FROM users ${customerFilter})`,
  );
  removed.customers = wipe("users", customerFilter);
  for (const table of ["email_outbox", "sessions", "audit_logs"]) removed[table] = wipe(table);
  db.exec("COMMIT");
} catch (error) {
  db.exec("ROLLBACK");
  db.close();
  fs.rmSync(dst, { force: true });
  console.error("✗ Gagal membersihkan data uji:", error.message);
  process.exit(1);
}
db.exec("VACUUM");

const templates = db
  .prepare("SELECT status, COUNT(*) n, SUM(CASE WHEN price>0 THEN 1 ELSE 0 END) priced FROM templates GROUP BY status")
  .all();
const staff = db
  .prepare("SELECT r.name role, COUNT(*) n FROM users u JOIN roles r ON r.id=u.role_id WHERE u.active=1 GROUP BY r.name")
  .all();
const noCanvas = db
  .prepare("SELECT name FROM templates WHERE status='Published' AND (canvas_json IS NULL OR canvas_json IN ('','[]'))")
  .all()
  .map((row) => row.name);
const noPrice = db
  .prepare("SELECT name FROM templates WHERE status='Published' AND NOT (price>0)")
  .all()
  .map((row) => row.name);
db.close();

if (typeof process.getuid === "function" && process.getuid() === 0) {
  // Container aplikasi berjalan sebagai user `node` (uid 1000).
  for (const suffix of ["", "-wal", "-shm"])
    if (fs.existsSync(dst + suffix)) fs.chownSync(dst + suffix, 1000, 1000);
  fs.chownSync(path.dirname(dst), 1000, 1000);
}

console.log("✓ Database production siap:", dst);
console.log("  Data uji dibuang:", JSON.stringify(removed));
console.log("  Template per status:", templates.map((t) => `${t.status} ${t.n} (berharga ${t.priced})`).join(", "));
console.log("  Akun tim aktif:", staff.map((s) => `${s.role} ${s.n}`).join(", "));
if (noCanvas.length) console.log("  ! Published tanpa desain canvas (sebaiknya Unpublish):", noCanvas.join(", "));
if (noPrice.length) console.log("  ! Published tanpa harga (checkout akan ditolak):", noPrice.join(", "));
