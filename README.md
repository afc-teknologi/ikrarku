# ikrarku Sites CMS v0.11

Full-stack CMS untuk wedding website, template commerce, visual Canvas Builder, Customer Service, task assignment, article publishing, dan order analytics.

Data operasional disimpan melalui Express API dan SQLite. Browser `localStorage` hanya digunakan untuk session token dan preferensi UI ringan—bukan sebagai sumber utama transaksi.

## URL localhost

```text
Web / CMS : http://localhost:5173
Backend   : http://localhost:5180
Health    : http://localhost:5180/api/health
```

Port 3000 dan 4000 tidak digunakan.

## Persyaratan

- Node.js 22 LTS, minimal 22.13.0
- npm 10 atau lebih baru
- Windows 10/11, macOS, atau Linux

## Instalasi Windows

1. Ekstrak ZIP ke folder baru.
2. Jalankan `INSTALL_WINDOWS.cmd`.
3. Biarkan terminal tetap terbuka.
4. Buka `http://localhost:5173`.
5. Untuk penggunaan berikutnya jalankan `START_WINDOWS.cmd`.

Melalui terminal:

```bash
npm ci --no-audit --no-fund
npm run dev
```

## Akun awal

```text
Username : admin
Password : admin
```

Segera ubah password Admin melalui menu profil setelah login.

## Improvement v0.11

### Registrasi dan keamanan akun

- Password memiliki tombol Show/Hide.
- Registrasi User meminta password dan repeat password.
- Password minimal 8 karakter.
- User baru tidak dapat login sebelum email diverifikasi.
- Email verification dikirim melalui SMTP atau masuk ke `email_outbox`.
- Pada localhost tanpa SMTP, aplikasi menampilkan helper verification link untuk pengujian.

### Notification task dan chat

- Dashboard memeriksa task serta conversation baru secara berkala.
- Task atau chat baru memicu notifikasi suara.
- Suara dapat dimute melalui **Settings → Notification sound**.
- Preferensi mute disimpan pada akun database dan browser.

### Live Chat

- Pesan yang dikirim User tetap tampil pada widget chat setelah backend menyimpannya.
- Seluruh pesan Web/Landing/User masuk ke Customer Service Inbound Messages.
- Admin, Editor, dan Customer Service dapat membalas User dari Support Inbox.

### Create Canvas dan Create Template

- **Create Canvas** membuat halaman website dan menggunakan URL publik.
- **Create Template** membuka template-design workspace tanpa field URL.
- Template menyimpan struktur Canvas sendiri pada `templates.canvas_json`.
- Template buatan Editor masuk ke status Pending dan task Approval Admin.
- Setelah Approved, template dapat muncul pada catalog dan dipakai User.

### Article

- Landing page menampilkan Published Article dalam layout catalog card.
- Detail Article berada pada halaman penuh dengan hero lebar dan content area yang lebih nyaman dibaca.
- Draft tidak ditampilkan ke pengunjung publik.

### Checkout dan order analytics

Checkout mewajibkan:

- nama customer;
- email receipt;
- nomor telepon untuk follow-up CS.

Pengunjung juga memperoleh pilihan **Sign In** atau **Register** sebelum checkout.

Admin memperoleh menu **Orders & Revenue** dengan:

- jumlah checkout/order;
- nominal pembayaran;
- unique customer;
- daftar transaksi;
- assignment CS dan Editor;
- export CSV;
- export Excel-compatible `.xls`.

### Receipt dan email

Pembayaran yang diterima menghasilkan:

- record Order;
- task CS;
- task Editor/Web Designer;
- inbound conversation;
- PDF receipt;
- email receipt melalui SMTP atau email outbox.

## Database dan storage

Default localhost:

```text
Database : server/data/ikrarku.sqlite
Uploads  : server/uploads/
Receipts : server/receipts/
```

Path tersebut dapat diubah melalui environment:

```env
DATA_DIR=/path/to/data
UPLOAD_DIR=/path/to/uploads
RECEIPT_DIR=/path/to/receipts
DB_FILE=/path/to/data/ikrarku.sqlite
```

Database utama mencakup:

- roles dan permissions;
- users dan verification status;
- sessions;
- templates dan template canvas;
- articles;
- sounds;
- payment methods;
- orders;
- tasks;
- conversations dan messages;
- sites dan Canvas;
- RSVP dan greetings;
- media assets;
- email outbox.

## SMTP

Salin `.env.example` menjadi `.env`:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=username
SMTP_PASS=password
SMTP_FROM=ikrarku Sites <noreply@example.com>
```

Tanpa SMTP, verification dan receipt email tetap tercatat di database.

## Payment note

Payment localhost masih berupa simulasi payment accepted untuk menguji end-to-end workflow. Production wajib memakai payment gateway resmi serta webhook server-to-server.

## Staging

File yang disertakan:

```text
Dockerfile
docker-compose.staging.yml
.env.staging.example
STAGING_DEPLOYMENT.md
deploy/nginx/ikrarku-staging.conf
.github/workflows/staging-check.yml
```

Panduan lengkap tersedia pada [STAGING_DEPLOYMENT.md](STAGING_DEPLOYMENT.md).

Quick start:

```bash
cp .env.staging.example .env.staging
docker compose -f docker-compose.staging.yml build
docker compose -f docker-compose.staging.yml up -d
curl http://127.0.0.1:5180/api/health
```

## Reset database lokal

Hentikan server, lalu hapus:

```text
server/data/ikrarku.sqlite
server/data/ikrarku.sqlite-shm
server/data/ikrarku.sqlite-wal
```

Schema sistem akan dibuat ulang ketika API dijalankan.
