## 0.18.0 — 10 November 2026 (QA 14: TC-303 s/d TC-329 + revisi WhatsApp)

Sumber: UPDATE_QA_IKRARKU.ID_14 (sheet Master Test Cases, Status Fail, kolom Update Web Dev kosong), Highlight Report QA 8 Nov, revisi WhatsApp SSBug1–5, contoh "Invoice — A4 1".

**Revisi WhatsApp**
- SSBug1 / TC-327: customer dengan satu pembelian kini melihat **satu card** di Template & Canvas. Canvas tanpa pemilik (canvas awal "Main Canvas", salinan, canvas tambahan tim) digabung ke design order, bukan card "Applied Template · <template lain>". Label card customer: "Template dibeli". Tombol Copy & Delete tidak tersedia untuk customer (menyebabkan design ganda / undangan kosong).
- SSBug2: kartu "ikrarku Signature" di sidebar customer disembunyikan (`SHOW_SIGNATURE_UPSELL`).
- SSBug3: List Undangan customer dikelola per **undangan yang dibeli**; dropdown nama canvas internal ("Main Canvas (salinan)", "New Canvas") tidak lagi tampil. Daftar tamu lama tetap terbaca.
- SSBug4: Wedding Dashboard customer menampilkan pratinjau undangan asli (bukan sketsa dengan teks contoh "Chyntia & Rian"), statistik per undangan, dan info "nama template · URL · jumlah canvas".
- SSBug5: (1) gambar ornamen tidak lagi `loading="lazy"` — dulu baru dimuat setelah halaman digulir; (2) setelah "Buka Undangan" diklik, canvas cover tidak tampil lagi — tamu langsung masuk ke canvas berikutnya; (3) ornamen bergerak-saat-gulir pada canvas setinggi layar tampil sejak awal.
- Invoice pembayaran mengikuti desain "Invoice — A4 1" (logo, nomor INV/Order/Receipt, tabel layanan, detail pembayaran + stempel PAID, total, ucapan terima kasih, pita footer). Font Cormorant Garamond & DM Sans (OFL) ada di `server/assets/fonts`. Invoice lama dibuat ulang otomatis saat diunduh (nomor tidak berubah). Nomor WhatsApp CS di footer dari `CS_WHATSAPP`.

**QA 14 — bug**
- TC-303: template yang dibayar kini disalin ke website customer walau website sudah berisi canvas awal kosong (dulu dilewati → canvas kosongan). Daftar tamu di canvas awal dipindahkan, tidak hilang.
- TC-305: spasi & baris baru pesan staff ↔ customer tetap terjaga (live chat, inbox, catatan internal, email).
- TC-308: background HD/Full HD (sampai 25 MB) diterima; di atas 8 MB dikompres otomatis di browser (sisi terpanjang 2560 px).
- TC-310: font header memuat bobot 700; font script satu bobot ditebalkan sintetis di dalam undangan.
- TC-313: Gambar sample / Thumbnail dari Web Designer langsung dipakai (dulu masuk draft revisi yang menunggu approval sehingga "tidak tampil"); Thumbnail & Gambar sample tidak saling menimpa; file > 2 MB dikompres otomatis.
- TC-316: kolom Hex di setiap color picker menyimpan saat klik di luar / Enter; "Warna yang digunakan" (16 warna terakhir) di setiap picker.
- TC-317: gambar background, layer, dan ornamen di-decode dulu (maks. 2,5 dtk) sebelum animasi berjalan; ornamen tidak lazy-load.
- TC-327: lihat SSBug1.

**QA 14 — fitur**
- TC-304: mention `@Nama` di catatan internal (tiket & inbox) dengan saran nama; staff yang disebut menerima email.
- TC-306: email order baru ke Web Designer sudah ada sejak 0.17.1 (IKR-08); uji kirim menunggu SMTP.
- TC-307: urutan lapisan ornamen — Paling depan / Maju / Mundur / Paling belakang — tanpa hapus & upload ulang.
- TC-311: Administrator dapat menghapus template (dengan konfirmasi). Template yang pernah dipesan diarsipkan (`Archived`) sehingga order, invoice, dan website customer tetap utuh.
- TC-312: katalog 4 kolom di desktop lebar, tetap 2 kolom di ponsel kecil.
- TC-314: layout Our Gallery "Lingkaran 2 Foto".
- TC-315: smart snapping — objek posisi bebas menempel di tengah kolom (horizontal & vertikal) dengan garis bantu; tahan Alt untuk menonaktifkan.
- TC-318: label "New" (template ≤ `NEW_TEMPLATE_DAYS` hari, bawaan 14) dan "Diskon X%" (harga coret diisi Administrator di kartu Templates & Approval).
- TC-319: saat customer menyimpan perubahan atas versi buatan tim, versi tim disimpan sebagai titik pulih "Versi tim sebelum diubah customer" (selalu tampil di Revisions).
- TC-320: preview yang dilihat customer diberi watermark DRAFT sampai task Web Designer pada ordernya Done. Undangan publik tidak terpengaruh.
- TC-321: gradien transparan (memudar ke bawah/atas/kiri/kanan/semua tepi) pada Image & Our Gallery.
- TC-322: lightbox Our Gallery — klik foto, geser kanan-kiri (tombol, panah keyboard, swipe), efek hover.
- TC-323/325: beranda customer — sambutan, countdown hari pernikahan, kartu tim (CS & Web Designer, Chat dengan tim, WhatsApp CS).
- TC-324: form checkout wajib tanggal & jam pernikahan; order lama dapat mengisinya dari dashboard.
- TC-326: template pesan WhatsApp "Undangan digital" & "Reminder RSVP" di List Undangan (bisa diedit, `{nama}` & `{link}` terisi otomatis); kolom No. WhatsApp saat menambah tamu.
- TC-329: sisi visual ala Serein — 4 gaya nama CPP & CPW / teks pengantar dan gambar layer 2.

**Butuh konfirmasi QA**: TC-309 (perilaku padding yang diharapkan), TC-328 (lokasi & bukti shadow pemisah).

**Konfigurasi baru (opsional)**: `CS_WHATSAPP`, `NEW_TEMPLATE_DAYS`. Kolom DB baru dibuat otomatis: `orders.wedding_date`, `orders.wedding_time`, `templates.original_price`, `sites.last_saved_by`.

**Uji otomatis**: qa-integration 41/41, qa-layout 139/139, qa-db 38/38.

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

**Revisi 8 November (layout & konfigurasi)**
- Kartu Templates & Approval: info template selebar kartu, chip status di baris sendiri (wrap), peringatan nama contoh jadi kotak catatan; tombol aksi dua kolom di ponsel.
- Workspace responsif: di layar ≤ 900 px sidebar menjadi laci (tertutup bawaan, ada latar gelap, tertutup setelah memilih menu); filter status bisa digeser ke samping.
- Dokumentasi: langkah ganti akun Google SMTP & API Mayar (PANDUAN_DEPLOY_PRODUCTION bagian I).

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
