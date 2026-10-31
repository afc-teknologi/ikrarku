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
15 2 * * * bash /opt/ikrarku/deploy/scripts/backup-production.sh /opt/ikrarku/backups/production >> /var/log/ikrarku-backup.log 2>&1
```

## D. Rapikan data di https://ikrarku.id (login Admin)

Akun tim memakai password yang sama dengan staging.

1. Settings → ganti password Admin; minta CS dan Web Designer mengganti password juga.
2. Templates & Approval → Unpublish template yang disebut "tanpa desain canvas".
3. Templates & Approval → Ubah harga semua template Published.
4. Payment Methods → aktifkan metode yang dipakai.
5. Transaksi uji Rp 10.000 sampai halaman Payment Received, lalu kembalikan harga.

## E. Update berikutnya

```bash
cd /opt/ikrarku && git pull
bash deploy/scripts/deploy-production.sh          # production
docker compose -f docker-compose.staging.yml up -d --build   # staging
```

Uji di staging dulu, baru production. `prod-seed-from-staging.mjs` hanya untuk
peluncuran pertama: database production yang sudah ada ditolak kecuali `--force`,
dan `--force` menghapus semua order production.

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
