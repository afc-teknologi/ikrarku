## 0.17.1 — 8 November 2026 (MoM 2 Nov + QC tambahan)

Persiapan beta testing ke user asli (W2 November).

**Prioritas MoM 2 November**
- IKR-01 (P0): `/workspace` dan halaman workspace lain tanpa login kini dialihkan ke halaman login. Dulu tampil kerangka Customer Workspace kosong; data tidak pernah bocor — 33 endpoint GET terautentikasi diuji dan semuanya menolak 401.
- IKR-02/03: website customer yang diisi dari template yang dibeli kini diberi penanda order & template, sehingga Template & Canvas menampilkan **satu card** per pembelian (dulu card "Sedang disiapkan" plus 1–2 card duplikat). Data lama ikut dirapikan saat ditampilkan.
- IKR-02: dashboard customer yang design-nya belum siap menampilkan "Design Anda sedang disiapkan" + nama template & no. order (dulu "Tambahkan Canvas dari menu Templates").
- IKR-02/04: nama contoh bawaan cover diganti netral ("Mempelai Wanita & Pria"); kartu Templates & Approval memberi label peringatan bila template masih memuat nama contoh ("Chyntia & Rian", "Aurelia & Reynard").
- IKR-05: catatan internal pada tiket dikirim lewat email ke CS / Web Designer lain yang ditugaskan pada order yang sama (handoff).
- IKR-08: CS dan Web Designer menerima email "Order baru untuk Anda" saat order dibayar, saat antrean dibagikan, dan saat Administrator reassign. Customer menerima email saat tiket berstatus In Progress dan Waiting Customer (dulu hanya live chat).
- IKR-09: pengirim email mendukung `SMTP_REPLY_TO`; preflight memperingatkan bila `SMTP_FROM` masih alamat developer / domain lokal.
- IKR-11: Orders (Administrator) — batas bayar, tombol **Cek ke Mayar**, dan **Hanguskan** untuk order belum bayar.

**QC tambahan 8 November**
- Favicon memakai ikon ikrarku (dipotong dari logo): `favicon.ico`, `favicon.png`, `apple-touch-icon.png`. Ikon Vite ungu dihapus.
- Password dari email akun otomatis bisa dipakai terus. Dialog login pertama kini opsional ("Tetap pakai password dari email"); email akun menjelaskan password tetap berlaku.
- Order yang tidak dibayar dalam 1x24 jam **hangus otomatis** (seperti marketplace). My Order menampilkan batas bayar + sisa waktu; order hangus berlabel "Hangus" dengan tombol Pesan ulang. Order Mayar dicek ke Mayar sebelum dihanguskan; pembayaran yang tetap masuk setelah hangus tetap diproses lunas. Atur lewat `ORDER_PAYMENT_HOURS` (bawaan 24).

**Pengujian**: qa:integration 40/40, qa:layout 137/137, qa:db 38/38, qa-browser 2/2, TypeScript + build lolos, oxlint 0 error.

## 0.16.0

- Fixed Buka Undangan text-color mismatch between Canvas Editor and Preview.
- Unified cover content position/width semantics across Editor and public renderer.
- Fixed right-aligned cover title being forced toward center by editor-only margins.
- Changed website design preview to use actual Canvas 01 only.
- Hid/contextualized dead Feature Width / Box Style controls for special features.
- Added v0.16 WYSIWYG source-contract QA.

# Changelog

## v0.14.0

- Role-based UX hardening from the v0.13 UX QA workbook.
- Added Customer My Project/order timeline and meaningful website-readiness checklist.
- Added Web Designer Undo/Redo, autosave, true Discard and Revision History.
- Added Administrator Audit Trail, safe role deletion and Article search.
- Added CS search, queue filters, unread state, SLA indicator, status workflow and richer order context.
- Removed public implementation/debug jargon and frontend demo account/customer fallback datasets.
- Added current-password reauthentication, resend verification and secure staging bootstrap password gate.
- Added v0.14 UX and expanded SQLite QA contracts.

## v0.13.0

- Corrected Website Design hierarchy so one applied template/design is represented by one card.
- Removed redundant active-client badge from Template & Canvas.

## v0.12.0

- QA/security hardening for RBAC, order access, public chat, uploads, payment safety and assignment flows.

## v0.11.0

- Fixed Live Chat so the sender-side message remains visible after API persistence.
- Separated Create Canvas and Create Template journeys.
- Removed URL configuration from Template Design workspace.
- Persisted Template Canvas structures in `templates.canvas_json`.
- Added Admin approval task refresh for pending Editor templates.
- Added database-backed sound notification preference for incoming tasks and chats.
- Added Show/Hide password controls.
- Added repeat-password validation and email verification before User login.
- Added verification email outbox and localhost verification helper.
- Redesigned landing Articles into catalog cards.
- Redesigned Article detail into a wide dedicated page.
- Required customer email and phone during checkout.
- Added Sign In and Register paths from checkout.
- Added Admin Orders & Revenue dashboard with quantity, nominal, customer, and assignment data.
- Added CSV and Excel-compatible order export.
- Added environment-configurable database, upload, and receipt paths.
- Added Docker multi-stage build, Compose volumes/healthcheck, Nginx sample, CI check, and staging deployment guide.

## v0.10.0

- Routed public and authenticated chat into the Customer Service inbound database.
- Added outbound User messaging for Admin, Editor, and Customer Service.
- Added centralized Template Approval tasks with Approve/Reject feedback and email notification.
- Added Published/Pending/Rejected template workflow display.
- Moved List Undangan into a dedicated Site Pages screen and removed Guest Book navigation.
- Added Canvas drag-and-drop ordering in Page Structure and the visual Canvas area.
- Added public website routes at `localhost:5173/<slug>` backed by SQLite.
- Expanded editable Buka Undangan copy and styling controls.
- Fixed Use Template so it creates new Canvas sections and opens the editor.
- Added custom-role permissions for template approval and outbound messaging.

## v0.9.0

- Migrated browser-only prototype data to Express API and SQLite.
- Added authentication, sessions, role permissions, templates, Article CMS, orders, tasks, conversations, media upload, PDF receipts, and email outbox.

## 0.15.0
- Canva/Figma UX benchmark hardening release.
- Reworked public landing into creation-first visual journey.
- Actual saved website-design mini preview.
- Feature object alignment and width controls.
- Feature Library search and duplicate.
- Fixed Greetings gradient rendering contract.
- Deep Buka Undangan icon/button/layout/transition controls.
- Added reduced-motion behavior and edge UX QA suite.
