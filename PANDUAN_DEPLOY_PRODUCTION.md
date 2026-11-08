# Panduan Deploy Production — ikrarku.id

Production = kode terakhir yang sudah lolos di staging (dev.ikrarku.id), berjalan
di VPS yang sama sebagai container terpisah:

| | Staging | Production |
|---|---|---|
| Domain | dev.ikrarku.id | ikrarku.id (+ www → ikrarku.id) |
| Compose | `docker-compose.staging.yml` | `docker-compose.production.yml` |
| Env | `.env.staging` | `.env.production` |
| Port lokal | 127.0.0.1:5180 | 127.0.0.1:5181 |
| Volume | `ikrarku_staging_*` | `ikrarku_production_*` |
| Pembayaran | Mayar (cek status aktif) | Mayar (webhook + cek status aktif) |

Data production disalin sekali dari staging lewat
`scripts/prod-seed-from-staging.mjs`: template, sound library, artikel,
metode pembayaran, dan akun tim ikut; order, chat, website customer, RSVP,
email outbox, dan akun Customer uji dibuang.

---

## A. Sebelum mulai

1. DNS ikrarku.id → IP VPS. Di panel domain buat/ubah:
   - `A  @    <IP VPS>`
   - `A  www  <IP VPS>` (atau `CNAME www ikrarku.id`)

   Cek dari VPS: `getent hosts ikrarku.id www.ikrarku.id` harus menampilkan IP VPS.
   Mengubah DNS menggantikan apa pun yang sekarang tampil di ikrarku.id.
2. Mayar: satu akun Mayar hanya punya satu URL webhook. Arahkan ke production
   (langkah C7). Staging tetap jalan karena status bayar juga dicek aktif ke Mayar.

## B. Di laptop

```bash
cd /c/ikrarku
npm run check && npm run qa:layout && npm run qa:integration
git add -A
git commit -m "Production ikrarku.id: compose, env, nginx, seed dari staging"
git push origin main
```

## C. Di VPS

```bash
ssh root@srv1890813
cd /opt/ikrarku
git pull
```

### C1. Backup staging

```bash
bash deploy/scripts/backup-staging.sh ./backups/staging
```

### C2. Buat `.env.production`

```bash
cp .env.production.example .env.production
grep -E '^(MAYAR_API_KEY|SMTP_)' .env.staging   # salin nilainya ke .env.production
openssl rand -hex 24                           # token webhook BARU
nano .env.production
```

Isi semua `<...>`. `MAYAR_API_KEY` dan `SMTP_*` sama dengan staging;
`MAYAR_WEBHOOK_TOKEN` pakai token baru; `ADMIN_BOOTSTRAP_PASSWORD` panjang & acak.
Jangan kirim isi file ini ke chat.

### C3. Build image production

```bash
docker compose -f docker-compose.production.yml build
docker compose -f docker-compose.production.yml create
```

`create` membuat volume production tanpa menyalakan aplikasi.

### C4. Salin data dari staging

```bash
docker compose -f docker-compose.staging.yml stop ikrarku

docker run --rm --user root \
  -v ikrarku_staging_data:/src \
  -v ikrarku_production_data:/dst \
  ikrarku-sites:production \
  node scripts/prod-seed-from-staging.mjs /src/ikrarku.sqlite /dst/ikrarku.sqlite

docker run --rm \
  -v ikrarku_staging_uploads:/src:ro \
  -v ikrarku_production_uploads:/dst \
  alpine sh -c "cp -a /src/. /dst/ && chown -R 1000:1000 /dst"

docker compose -f docker-compose.staging.yml start ikrarku
```

Hasil yang benar: `✓ Database production siap`, daftar template per status,
dan akun tim aktif. Baris `!` menyebut template Published tanpa desain atau
tanpa harga — rapikan di langkah D.

### C5. Nyalakan production

```bash
bash deploy/scripts/deploy-production.sh
```

Skrip menolak jalan bila Mayar/SMTP/CLIENT_ORIGIN belum benar, membuat backup,
build, preflight, menyalakan container, lalu smoke test di 127.0.0.1:5181.
Akhirnya: `Production deployment selesai: https://ikrarku.id`.

### C6. Nginx + HTTPS

```bash
cp deploy/nginx/ikrarku-production.conf /etc/nginx/sites-available/ikrarku-production
ln -sf /etc/nginx/sites-available/ikrarku-production /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d ikrarku.id -d www.ikrarku.id
curl -fsS https://ikrarku.id/api/health
```

### C7. Mayar & email

1. Dashboard Mayar → Integrasi → Webhook:
   `https://ikrarku.id/api/webhooks/mayar?token=<MAYAR_WEBHOOK_TOKEN production>`
2. Cek dari VPS:

```bash
docker compose -f docker-compose.production.yml exec ikrarku node scripts/mayar-check.mjs --webhook https://ikrarku.id
docker compose -f docker-compose.production.yml exec ikrarku node scripts/smtp-check.mjs developer@afarcoteknologi.com
```

### C8. Backup harian

```bash
crontab -e
# tambahkan:
15 2 * * * bash /opt/ikrarku-production/deploy/scripts/backup-production.sh /opt/ikrarku-production/backups/production >> /var/log/ikrarku-backup.log 2>&1
```

## D. Rapikan data di https://ikrarku.id (login Admin)

Akun tim memakai password yang sama dengan staging.

1. Settings → ganti password Admin; minta CS dan Web Designer mengganti password juga.
2. Templates & Approval → Unpublish template yang disebut "tanpa desain canvas".
3. Templates & Approval → Ubah harga semua template Published.
4. Payment Methods → aktifkan metode yang dipakai.
5. Transaksi uji Rp 10.000 sampai halaman Payment Received, lalu kembalikan harga.

## E. Branch & update berikutnya

| Branch GitHub | Server | Folder di VPS | Deploy |
|---|---|---|---|
| `staging` | dev.ikrarku.id | `/opt/ikrarku` | `docker compose -f docker-compose.staging.yml up -d --build` |
| `production` | ikrarku.id | `/opt/ikrarku-production` | `bash deploy/scripts/deploy-production.sh` |

Semua pekerjaan baru masuk ke `staging`. Setelah lolos uji di dev.ikrarku.id,
naikkan ke production lewat Pull Request `staging → production` di GitHub.
`deploy-production.sh` menolak jalan bila foldernya bukan branch `production`
atau masih tertinggal dari GitHub.

```bash
# staging
cd /opt/ikrarku && git pull
docker compose -f docker-compose.staging.yml up -d --build

# production (setelah PR staging → production di-merge)
cd /opt/ikrarku-production && git pull
bash deploy/scripts/deploy-production.sh
```

`prod-seed-from-staging.mjs` hanya untuk peluncuran pertama: database production
yang sudah ada ditolak kecuali `--force`, dan `--force` menghapus semua order production.

## G. Email pengirim (MoM 2 Nov IKR-09)

Email ke customer dan tim (receipt, info akun, order baru, catatan internal)
dikirim dengan identitas di `SMTP_FROM`. Jangan memakai alamat developer.

1. Tentukan alamat resmi, mis. `hello@ikrarku.id` atau `noreply@ikrarku.id`.
2. Gmail / Google Workspace hanya mengizinkan alamat akun SMTP itu sendiri
   atau alias yang sudah diverifikasi:
   - login ke akun `SMTP_USER` → Gmail → Settings → **Accounts** →
     **Send mail as** → *Add another email address* → verifikasi; atau
   - buat user Workspace baru untuk alamat resmi, lalu pakai App Password-nya
     sebagai `SMTP_USER`/`SMTP_PASS`.
3. Isi di `.env.production` (dan `.env.staging` bila perlu):

```bash
SMTP_FROM="ikrarku <hello@ikrarku.id>"
SMTP_REPLY_TO=hello@ikrarku.id   # opsional: balasan customer masuk ke sini
```

4. Deploy ulang (`bash deploy/scripts/deploy-production.sh`). Preflight
   menampilkan `PERINGATAN: SMTP_FROM ... bukan identitas bisnis` bila masih
   alamat developer / domain lokal.
5. Uji: `docker compose -f docker-compose.production.yml exec ikrarku node scripts/smtp-check.mjs <email-anda>`
   lalu cek pengirim di inbox.

## H. Order hangus 1x24 jam (QC 8 Nov)

Order yang belum dibayar hangus otomatis setelah `ORDER_PAYMENT_HOURS` jam
(bawaan 24, sama dengan masa berlaku invoice Mayar `MAYAR_INVOICE_EXPIRY_HOURS`).
Server mengecek setiap 5 menit (`ORDER_EXPIRY_CHECK_MS`). Tidak perlu
mengubah `.env` bila 24 jam sudah sesuai; bila diubah, samakan kedua nilai.

## I. Ganti akun Google (SMTP) dan API Mayar

Dipakai saat akun Google pengirim email diganti atau Mayar memberi API key /
akun baru. Kerjakan di **staging dulu**, baru production. Jangan menempel
password atau API key ke chat / dokumen bersama.

### I.1 Siapkan App Password Google (akun pengirim baru)

1. Login ke akun Google baru → **myaccount.google.com → Security**.
2. Aktifkan **2-Step Verification** (wajib untuk App Password).
3. Buka **myaccount.google.com/apppasswords** → buat app "ikrarku" → salin
   16 karakter yang muncul **tanpa spasi**. Password akun Google biasa
   **tidak** bisa dipakai untuk SMTP.
4. Bila pengirim memakai alamat lain dari akun ini (mis. `hello@ikrarku.id`),
   daftarkan dulu di Gmail → Settings → Accounts → **Send mail as** (bagian G).

### I.2 Siapkan data Mayar baru

1. Dashboard Mayar → **Integrasi → API Key** → salin API key (JWT utuh,
   diawali `eyJ`), pastikan izinnya **Read & Write**.
2. Bila **akun Mayar ikut berganti**, buat token webhook baru:
   `openssl rand -hex 24` (simpan, dipakai di I.3 dan I.5).

### I.3 Ubah `.env` di VPS

```bash
ssh root@srv1890813
cd /opt/ikrarku                       # staging; production: /opt/ikrarku-production
cp .env.staging .env.staging.bak-$(date +%Y%m%d)   # production: .env.production
nano .env.staging                     # production: nano .env.production
```

Ganti hanya baris berikut (nilai tanpa tanda kutip kecuali `SMTP_FROM`):

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=akun.baru@domain.com
SMTP_PASS=16karakterapppassword
SMTP_FROM="ikrarku <akun.baru@domain.com>"   # atau alias Send mail as
SMTP_REPLY_TO=akun.baru@domain.com            # opsional

MAYAR_API_KEY=eyJ...                           # API key baru, utuh satu baris
MAYAR_WEBHOOK_TOKEN=...                        # hanya bila akun Mayar berganti
# MAYAR_API_BASE tetap https://api.mayar.id/hl/v1 kecuali Mayar
# menyatakan akun Anda wajib V2 (lihat I.6)
```

Simpan: `Ctrl+O`, `Enter`, `Ctrl+X`. Cek tidak ada spasi/CR tersisa:
`grep -nE '^(SMTP|MAYAR)_' .env.staging | cut -c1-40`.

### I.4 Terapkan (container dibuat ulang agar membaca `.env` baru)

```bash
# staging
docker compose -f docker-compose.staging.yml up -d --force-recreate

# production
cd /opt/ikrarku-production && bash deploy/scripts/deploy-production.sh
```

Restart biasa (`restart`) **tidak** membaca ulang `.env`.

### I.5 Uji

```bash
# staging (production: ganti file compose ke docker-compose.production.yml)
C="docker compose -f docker-compose.staging.yml exec ikrarku"
$C node scripts/smtp-check.mjs email-anda@gmail.com
$C node scripts/mayar-check.mjs --webhook https://dev.ikrarku.id   # production: https://ikrarku.id
```

Hasil yang benar:

- `smtp-check`: login berhasil dan email uji masuk inbox dengan nama
  pengirim yang benar. `535 Username and Password not accepted` = App
  Password salah / 2-Step Verification belum aktif.
- `mayar-check`: key valid & **Read & Write**, bagian webhook `200`.
  `401` = API key salah/terpotong.

Bila akun Mayar berganti, daftarkan ulang URL webhook di dashboard Mayar
yang **baru** (Integrasi → Webhook):
`https://ikrarku.id/api/webhooks/mayar?token=<MAYAR_WEBHOOK_TOKEN baru>`
(staging: `https://dev.ikrarku.id/...`). Satu akun Mayar hanya punya satu URL
webhook — arahkan ke production; staging tetap jalan lewat cek status aktif.

Terakhir, transaksi uji nominal kecil sampai halaman **Payment Received**
dan email receipt masuk.

### I.6 Catatan Mayar V1 → V2

Server masih memakai endpoint `/hl/v1` (kontrak `invoice/create` V2 belum
tersedia untuk kita). Bila perubahan dari Mayar berarti **V1 dimatikan**
(`mayar-check` bagian V1 menjawab `404`/`410`), pembayaran akan gagal di
tombol Bayar: kirimkan dokumentasi `invoice/create` V2 dari Mayar ke tim
developer untuk migrasi kode — jangan sekadar mengganti `MAYAR_API_BASE`.

### I.7 Rollback cepat

```bash
cp .env.staging.bak-YYYYMMDD .env.staging
docker compose -f docker-compose.staging.yml up -d --force-recreate
```

## F. Rollback

```bash
docker compose -f docker-compose.production.yml down      # volume tetap aman
ls backups/production                                     # pilih folder backup
```

Restore volume dari backup:

```bash
B=/opt/ikrarku/backups/production/<STAMP>
docker run --rm -v ikrarku_production_data:/dst -v $B:/b alpine sh -c "rm -rf /dst/* && tar xzf /b/data.tar.gz -C /dst"
docker compose -f docker-compose.production.yml up -d
```
