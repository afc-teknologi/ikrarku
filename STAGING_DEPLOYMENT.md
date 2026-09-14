# ikrarku Sites — Staging Deployment Guide

Dokumen ini menyiapkan v0.11 untuk satu environment staging berbasis Docker. Frontend hasil build dan Express API disajikan dari satu container. Data SQLite, upload, dan receipt memakai persistent volume terpisah.

## 1. Arsitektur staging

```text
Internet / VPN
      │
Reverse proxy + TLS
      │
      └── ikrarku container :5180
            ├── React/Vite static build
            ├── Express API /api
            ├── SQLite /app/data/ikrarku.sqlite
            ├── Upload /app/uploads
            └── Receipt /app/receipts
```

Komponen:

- Node.js 22 LTS
- React + Vite
- Express 5
- SQLite melalui `node:sqlite`
- Docker multi-stage build
- Docker Compose persistent volumes
- SMTP opsional untuk email verification dan receipt
- Reverse proxy Nginx atau load balancer untuk HTTPS

## 2. Minimum infrastructure

Untuk staging internal awal:

- 2 vCPU
- 4 GB RAM
- 30 GB SSD
- Ubuntu 24.04 LTS atau server Linux yang mendukung Docker
- Docker Engine dan Docker Compose plugin
- DNS `staging.ikrarku.id`
- SMTP sandbox/transactional email account

## 3. Environment preparation

Salin konfigurasi:

```bash
cp .env.staging.example .env.staging
```

Isi minimal:

```env
CLIENT_ORIGIN=https://staging.ikrarku.id
SMTP_HOST=smtp-provider.example
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-user
SMTP_PASS=your-password
SMTP_FROM=ikrarku Staging <noreply@staging.ikrarku.id>
```

Jangan commit `.env.staging` ke Git.

## 4. Build dan run

```bash
docker compose -f docker-compose.staging.yml build --no-cache
docker compose -f docker-compose.staging.yml up -d
```

Pemeriksaan:

```bash
docker compose -f docker-compose.staging.yml ps
curl http://127.0.0.1:5180/api/health
```

Expected response:

```json
{"ok":true,"database":"sqlite"}
```

## 5. Reverse proxy

Contoh Nginx tersedia di:

```text
deploy/nginx/ikrarku-staging.conf
```

Salin ke `/etc/nginx/sites-available/`, aktifkan, lalu pasang sertifikat TLS melalui kebijakan infrastructure Anda. Pastikan `CLIENT_ORIGIN` sama dengan URL browser staging.

## 6. First-run checklist

1. Buka `https://staging.ikrarku.id`.
2. Login awal dengan `admin / admin`.
3. Segera ubah password Admin.
4. Buat minimal satu role/account Editor dan Customer Service.
5. Konfigurasikan Payment Methods.
6. Uji registrasi dan email verification.
7. Uji create template → approval → published catalog.
8. Uji checkout dengan email dan nomor telepon.
9. Uji receipt PDF dan email outbox/SMTP.
10. Uji notifikasi task/chat dan opsi mute.
11. Uji export Orders CSV dan Excel.

## 7. Data persistence dan backup

Persistent volume:

- `ikrarku_data`
- `ikrarku_uploads`
- `ikrarku_receipts`

Backup aman paling sederhana untuk staging:

```bash
docker compose -f docker-compose.staging.yml stop ikrarku
docker run --rm \
  -v ikrarku_data:/data \
  -v "$PWD/backups:/backup" \
  alpine sh -c 'cp -a /data /backup/data-$(date +%Y%m%d-%H%M%S)'
docker compose -f docker-compose.staging.yml start ikrarku
```

Backup upload dan receipt dengan pola yang sama. Restore harus diuji secara berkala, bukan hanya membuat file backup.

## 8. Email verification

- Production/staging dengan SMTP: link verification dikirim melalui email.
- Tanpa SMTP: email disimpan ke tabel `email_outbox`; helper link hanya muncul di non-production.
- Pastikan URL pada email menggunakan `CLIENT_ORIGIN` staging.

## 9. Payment boundary

Checkout v0.11 masih memakai simulasi payment accepted untuk menguji journey, task assignment, receipt, dan CS inbound. Sebelum production, ganti dengan gateway resmi dan lakukan validasi status melalui webhook server-to-server. Jangan mempercayai status pembayaran dari browser.

## 10. Scaling path

SQLite sesuai untuk satu instance staging dan validasi workflow. Untuk production multi-instance atau traffic/transaksi paralel yang lebih tinggi, siapkan migrasi repository/data-access layer ke PostgreSQL, object storage S3-compatible, queue worker, dan managed email/payment services.

Rekomendasi production evolution:

```text
React CDN
    │
API replicas
    ├── PostgreSQL
    ├── Redis/Queue
    ├── Object Storage
    ├── SMTP/Transactional Email
    └── Payment Gateway Webhook
```

## 11. Security checklist sebelum public staging

- Ganti password Admin awal.
- Batasi staging melalui VPN, allowlist, atau Basic Auth bila belum siap publik.
- HTTPS wajib.
- Simpan SMTP/payment credential sebagai secret.
- Terapkan backup dan restore test.
- Tambahkan rate limiting pada login, signup, chat, dan checkout.
- Tambahkan CSRF strategy bila autentikasi dipindah ke cookie.
- Review file upload MIME type dan lakukan malware scanning untuk production.
- Jangan memakai simulated payment pada production.

## 12. CI check

Workflow contoh:

```text
.github/workflows/staging-check.yml
```

Workflow menjalankan dependency install, lint, TypeScript/Vite build, server syntax check, dan Docker build.
