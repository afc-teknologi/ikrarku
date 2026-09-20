# Tindak Lanjut Audit QA & QC v0.16.0 — Status pada v0.17.0

Audit dibuat terhadap snapshot `main` v0.16.0 (`2d8f173`). Kode yang diperiksa di sini adalah
v0.17.0 ditambah batch perbaikan QA fungsional (TC-072..TC-137). Setiap temuan diverifikasi
ulang langsung di kode terkini, bukan diasumsikan masih terbuka.

**Ringkasan: 17 dari 18 temuan sudah tertutup sebelum sesi ini. 1 temuan masih terbuka dan
diperbaiki sekarang (QA-03).**

---

## Status per temuan

| ID | Tingkat | Status | Bukti di kode v0.17.0 |
|---|---|---|---|
| QA-01 | Kritis | Sudah tertutup | `devResetUrl` dan `devVerificationUrl` kini dijaga `NODE_ENV !== "production"` saja, tanpa fallback saat SMTP kosong |
| QA-02 | Kritis | Sudah tertutup | `createOrFindConversation` punya flag `trusted`; endpoint `/api/public/chat` tidak meneruskannya, jadi tidak ada lagi lookup conversation berdasar email |
| QA-03 | Tinggi | **Diperbaiki di sesi ini** | lihat bagian di bawah |
| QA-04 | Tinggi | Sudah tertutup | `/api/clients/:id/assignment` menolak reassign oleh non-admin bila customer sudah punya editor |
| QA-05 | Tinggi | Sudah tertutup | `policy.requireTask` pada `PATCH /api/tasks/:id`; `policy.requireConversation` pada tiga endpoint mutasi conversation |
| QA-06 | Tinggi | Sudah tertutup | Signup dibungkus `policy.transaction`, user + site ditulis atomik |
| QA-07 | Tinggi | Sudah tertutup | `policy.requireAdminRemaining` dipanggil pada perubahan role dan penonaktifan akun |
| QA-08 | Kritis | Sudah tertutup | Webhook wajib `MAYAR_WEBHOOK_TOKEN` (`timingSafeEqual`), status exact-match pada allowlist, plus verifikasi amount dan currency |
| QA-09 | Tinggi | Sudah tertutup | `fulfillmentJobs` membuat proses idempotent; `payment_status` dan `fulfillment_status` dipisah sehingga retry melanjutkan langkah yang gagal |
| QA-10 | Tinggi | Sudah tertutup | `policy.assignPaidSite` dipanggil dari `fulfillPaidOrder` sehingga assignment order ikut menulis `site_assignments` |
| QA-11 | Tinggi | Sudah tertutup | `policy.requireEntitlement` pada `PUT /api/site` |
| QA-12 | Tinggi | Sudah tertutup | `GET /api/me/orders` memfilter `o.user_id=?`; `policy.claimGuestOrders` menautkan guest order setelah login |
| QA-13 | Tinggi | Sudah tertutup | `GET /api/site/autosave` mengembalikan draft; frontend punya dialog "Pulihkan draft terakhir?" |
| QA-14 | Tinggi | Sudah tertutup | `saveAndMaybeLeave` menunggu `await saveSite()` sebelum membersihkan baseline/history dan sebelum pindah halaman |
| QA-15 | Tinggi | Sudah tertutup | Tabel `template_drafts`; editor non-admin yang mengubah template Published menulis ke draft dan membuat task Approval, versi live tidak berubah sampai di-approve |
| QA-16 | Tinggi | Sudah tertutup | `PUT /api/site` memakai `permit("canvas.manage.own")` |
| QA-17 | Sedang | Sudah tertutup | `GET /api/public/sites/:slug/greetings` tersedia dan dipanggil `PublicWeddingPage` saat halaman dibuka |
| QA-18 | Sedang | Sudah tertutup | `WebsiteTemplatePreview` merender `WeddingCanvas` asli yang di-scale dalam `ThumbnailContext`, bukan renderer ringkasan |

---

## QA-03 — Session akun nonaktif tetap diterima

**Kondisi yang masih ada.** Middleware `auth()` memeriksa keberadaan session, masa berlaku,
dan idle timeout, tetapi tidak pernah membaca ulang `users.active` maupun `users.email_verified`.
Pemeriksaan itu hanya ada di `POST /api/auth/login`. Akibatnya menonaktifkan akun hanya
menghalangi login berikutnya; session yang sudah berjalan tetap dapat memakai seluruh API
sampai token kedaluwarsa (7 hari) atau idle timeout tercapai.

**Perbaikan.** `auth()` kini memeriksa status akun pada setiap request. Bila akun dinonaktifkan
atau verifikasi email dicabut, seluruh session milik user tersebut dihapus dan request ditolak:

- `403 { code: "account_disabled" }` untuk akun nonaktif
- `403 { code: "email_unverified" }` untuk verifikasi email yang dicabut

Sisi client (`src/api.ts`) membersihkan token pada kedua kode tersebut, sama seperti penanganan
`idle_timeout`, sehingga pengguna langsung diarahkan kembali ke halaman login.

File yang berubah: `server/index.mjs`, `src/api.ts`.

---

## Tes perilaku baru

Audit menyebut bahwa tes yang ada masih berupa pencocokan teks pada source dan perlu diubah
menjadi pemeriksaan perilaku. Ditambahkan `scripts/qa-access.mjs`: harness yang menjalankan
server sungguhan pada port sementara dengan SQLite sekali pakai, lalu menguji gate akses
lewat HTTP.

```bash
node scripts/qa-access.mjs
```

Hasil saat ini **10/10 passed**, mencakup:

- QA-01 — `forgot-password` pada `NODE_ENV=production` tanpa SMTP tidak mengembalikan tautan reset
- QA-03 — akun yang dinonaktifkan langsung ditolak; session lama tetap dicabut meski akun
  diaktifkan kembali; verifikasi email yang dicabut juga menghentikan session
- QA-08 — webhook menolak konfirmasi selama belum dikonfigurasi
- QA-12 — daftar order hanya berisi milik akun yang login
- QA-16 — CS tanpa permission canvas ditolak saat publish site

---

## Status harness lama

| Harness | Hasil sekarang | Baseline v0.17.0 tanpa patch | Kesimpulan |
|---|---|---|---|
| `qa-db.mjs` | 38/38 | 38/38 | Aman |
| `qa-static.mjs` | 19/32 | 19/32 | Tidak ada regresi dari batch ini |
| `qa-edge-v016.mjs` | 10/15 | 10/15 | Tidak ada regresi dari batch ini |
| `qa-ux-v016.mjs` | 30/45 | 30/45 | Tidak ada regresi dari batch ini |
| `qa-integration.mjs` | lulus | lulus | Aman |

Penurunan dari angka audit (31/32 dan 44/45) **sudah terjadi pada v0.17.0 sebelum batch QA
fungsional saya**, dan saya verifikasi dengan menjalankan harness yang sama pada zip v0.17.0
yang belum dipatch — hasilnya identik, 19/32, 10/15, dan 30/45.

Penyebabnya sesuai dugaan audit: tes ini mencocokkan teks pada source, sementara v0.17.0
melakukan tiga hal yang mengubah bentuk teks tanpa mengubah perilaku:

1. `App.tsx` diformat ulang dengan Prettier, sehingga pola satu-baris yang dicari tidak lagi cocok
2. Versi naik ke 0.17.0, sementara tes mengunci string `0.16`
3. Landing page didesain ulang, sehingga pola hero/rail lama tidak ditemukan

Ini bukan 13 bug baru. Tetapi selama harness belum diperbarui, angka-angka ini tidak bisa
dipakai sebagai gate rilis. Saran: perlakukan `qa-static`, `qa-edge`, dan `qa-ux` sebagai
kandidat untuk ditulis ulang menjadi pemeriksaan perilaku seperti `qa-access.mjs`, dan sementara
itu jangan jadikan angkanya sebagai syarat lulus.

---

## Validasi yang sudah dijalankan

- `node --check server/index.mjs` — lolos
- `tsc -b` — 0 error
- `oxlint src/` — 0 error, 4 warning `react-hooks/exhaustive-deps` yang sudah ada sebelum batch ini
- `vite build` — sukses
- `node scripts/qa-access.mjs` — 10/10
- `node scripts/qa-db.mjs` — 38/38
- `node scripts/qa-integration.mjs` — lulus

## Yang belum divalidasi

- Pengujian browser desktop/mobile. Seluruh temuan visual dan interaksi drag pada batch
  TC-107..TC-137 masih perlu diperiksa manual.
- Gate audit "retest dengan dua Customer, dua Editor, dua CS" belum dijalankan sebagai skenario
  lengkap. `qa-access.mjs` baru menutup sebagian gate akses; skenario Editor A vs Editor B dan
  CS A vs CS B sebaiknya ditambahkan ke harness yang sama.
- Temuan hanya layak diubah dari Open menjadi Closed setelah tim melakukan retest sendiri.
  Dokumen ini adalah hasil pemeriksaan kode dan tes otomatis, bukan pengganti retest.
