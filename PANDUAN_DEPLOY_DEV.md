# Panduan Deploy ke dev.ikrarku.id

Langkah demi langkah dari laptop sampai perubahan terlihat di
`https://dev.ikrarku.id`. Ditulis untuk dijalankan berulang kali tanpa
berpikir panjang.

**Perkiraan waktu:** 10–15 menit, sebagian besar menunggu Docker build.

---

## Peta singkat

```
LAPTOP                            GITHUB              VPS (srv1890813)
──────                            ──────              ────────────────
1. ubah kode
2. npm run check        ──┐
3. commit + push          └──►  repo  ──►  4. git pull
                                            5. docker compose build
                                            6. docker compose up -d
                                            7. cek health
                                                  │
                                                  ▼
                                          https://dev.ikrarku.id
```

Build **tidak** dilakukan di laptop. Laptop hanya memastikan kode sehat lalu
mendorongnya ke GitHub; VPS yang membangun dan menjalankan.

> Karena itu `docker`, `nginx`, dan `dig` memang tidak ada di laptop Anda.
> Itu normal, bukan yang perlu dipasang.

---

## BAGIAN A — Di laptop

### A1. Pastikan berada di branch yang benar

```bash
cd /path/ke/ikrarku
git status
git branch --show-current
```

Pastikan tidak ada berkas tertinggal yang tidak Anda kenali.

### A2. Jalankan gerbang mutu

```bash
npm run check
```

Ini menjalankan lint, TypeScript, build Vite, dan pemeriksaan sintaks server.
**Harus lolos semua.** Kalau gagal di sini, jangan push — perbaiki dulu.

Lalu jalankan suite pengujian:

```bash
npm run qa:integration    # harus 35/35
npm run qa:db             # harus 38/38
npm run qa:layout         # harus 29/29
npm run preflight         # harus "Preflight passed."
```

> **Catatan.** `npm run qa:static` dan `npm run qa:wysiwyg` memang **merah**
> (19/32 dan 9/27) dan sudah begitu sejak lama, bahkan pada commit bersih.
> Keduanya script lama berbasis pencocokan string ke format sumber yang sudah
> berubah. **Abaikan** — bukan gerbang rilis.

- [ ] A2 selesai, empat perintah di atas hijau

### A3. Commit dan push

```bash
git add -A
git commit -m "deskripsi singkat perubahan"
git push origin <nama-branch>
```

Kalau bekerja di branch selain `main`, buat Pull Request dan merge lebih
dulu bila itu memang alur tim Anda.

- [ ] A3 selesai, perubahan sudah ada di GitHub

---

## BAGIAN B — Di VPS

### B1. Masuk ke server

```bash
ssh root@srv1890813
cd /opt/ikrarku
```

### B2. Backup dulu — selalu

```bash
./deploy/scripts/backup-staging.sh
```

Perintah ini mengarsipkan tiga volume Docker: database, uploads, dan
receipts. Hasilnya di folder `backups/<tanggal-jam>/` lengkap dengan
checksum.

> **Jangan dilewati.** Deploy menyentuh database. Backup adalah satu-satunya
> jalan pulang kalau ada yang salah.

Pastikan arsipnya benar-benar jadi:

```bash
ls -la backups/ | tail -3
```

- [ ] B2 selesai, backup terbentuk

### B3. Ambil kode terbaru

```bash
git pull
```

Kalau muncul konflik atau penolakan, berarti ada perubahan yang dibuat
langsung di VPS. Jangan dipaksa — periksa dulu:

```bash
git status
git diff
```

### B4. Periksa konfigurasi

```bash
nano .env.staging
```

File yang dibaca compose adalah **`.env.staging`**, bukan `.env`.

Pastikan baris berikut sudah benar:

```env
CLIENT_ORIGIN=https://dev.ikrarku.id
PUBLIC_BASE_URL=https://dev.ikrarku.id
PAYMENT_MODE=simulation
```

| Baris | Kenapa penting |
|---|---|
| `CLIENT_ORIGIN` | harus **sama persis** dengan alamat yang dibuka di browser, termasuk `https://`. Beda sedikit → CORS gagal dan aplikasi tidak bisa memanggil API-nya sendiri. |
| `PUBLIC_BASE_URL` | dipakai untuk canonical, `og:url`, dan `sitemap.xml` halaman Jurnal. Kalau menunjuk `localhost`, halaman tidak akan terindeks. |
| `PAYMENT_MODE` | biarkan `simulation` sampai Mayar benar-benar siap (lihat [PANDUAN_MAYAR_PEMULA.md](PANDUAN_MAYAR_PEMULA.md)). |

> `.env.staging` ada di `.gitignore`. `git pull` **tidak akan** menimpanya.
> Begitu juga database SQLite. Push dari laptop tidak bisa mereset
> konfigurasi payment gateway Anda.

### B5. Build dan jalankan

**Jalur manual — ini yang dipakai bila VPS tidak memasang Node:**

```bash
docker compose -f docker-compose.staging.yml build
docker compose -f docker-compose.staging.yml up -d --remove-orphans
docker compose -f docker-compose.staging.yml ps
```

Perhatikan `-f docker-compose.staging.yml`. Tanpa itu Docker menjawab
`no configuration file provided: not found`, karena berkasnya memang tidak
bernama `docker-compose.yml`.

**Jalur otomatis — hanya bila VPS punya Node:**

```bash
./deploy/scripts/deploy-staging.sh
```

Script ini menjalankan: preflight → suite QA → validasi compose → build →
update container → tunggu sampai sehat → smoke test. Langkah preflight dan
QA memerlukan Node di host; kalau `node` tidak terpasang, pakai jalur manual
di atas. Suite QA-nya toh sudah Anda jalankan di laptop pada Bagian A2.

Build memakan beberapa menit. Wajar.

- [ ] B5 selesai, container berstatus `healthy`

---

## BAGIAN C — Verifikasi

### C1. Health check dari dalam VPS

```bash
curl http://127.0.0.1:5180/api/health
```

Harus memuat `"ok":true` dan `"database":"sqlite"`.

### C2. Smoke test

```bash
./deploy/scripts/smoke-test.sh
```

Harus berakhir dengan `Smoke test PASS`.

### C3. Dari luar, lewat domain

```bash
curl -I https://dev.ikrarku.id
```

Harus `HTTP/2 200`. Kalau `502 Bad Gateway`, container belum hidup atau
Nginx menunjuk port yang salah.

### C4. Cek di browser

Buka `https://dev.ikrarku.id`, lalu **hard refresh**:

| Sistem | Tombol |
|---|---|
| Windows / Linux | `Ctrl` + `Shift` + `R` |
| macOS | `Cmd` + `Shift` + `R` |

> Tanpa hard refresh, browser menampilkan bundle JavaScript lama dari cache
> dan Anda akan mengira deploy-nya gagal. Ini penyebab kebingungan paling
> sering.

- [ ] C4 selesai, perubahan terlihat

---

## BAGIAN D — Bila fitur SEO Jurnal ikut di-deploy

Injeksi meta untuk `/jurnal/<slug>` **hanya aktif** saat `NODE_ENV=production`
dan folder `dist/` ada — keduanya terpenuhi di dalam container, tapi **tidak**
saat `npm run dev`. Jadi fitur ini memang tidak bisa diuji di laptop.

Verifikasi setelah deploy:

```bash
curl -s https://dev.ikrarku.id/robots.txt
curl -s https://dev.ikrarku.id/sitemap.xml | head -20
# ganti lorem-ipsum dengan slug artikel Anda yang sebenarnya.
# JANGAN mengetik tanda < > — bash membacanya sebagai redirect berkas.
curl -s https://dev.ikrarku.id/jurnal/lorem-ipsum | grep -E 'og:|canonical|<title>'
```

Yang diharapkan: `<title>` berisi judul artikel, bukan judul umum situs, dan
muncul `og:title`, `og:description`, `og:image`, serta `canonical`.

> **Keputusan yang perlu Anda ambil.** Kalau `dev.ikrarku.id` memang staging,
> **jangan** didaftarkan ke Google Search Console — nanti yang terindeks
> staging, bukan produksi. Pertimbangkan memblokirnya lewat `robots.txt`
> atau batasi aksesnya.

---

## Kalau ada yang salah

### `no configuration file provided: not found`

```
root@srv1890813:/opt/ikrarku# docker compose up -d --build
no configuration file provided: not found
```

Berkas compose di repo ini bernama **`docker-compose.staging.yml`**, bukan
`docker-compose.yml`, jadi Docker tidak menemukannya otomatis. Sebutkan
namanya dengan `-f`:

```bash
docker compose -f docker-compose.staging.yml up -d --build
```

Kalau tetap gagal, pastikan Anda memang berada di folder repo:

```bash
pwd                      # harus /opt/ikrarku
ls docker-compose.staging.yml package.json
git remote -v
```

Agar tidak perlu mengetik `-f` setiap kali, buat alias satu kali:

```bash
echo "alias dc='docker compose -f /opt/ikrarku/docker-compose.staging.yml'" >> ~/.bashrc
source ~/.bashrc
# sesudah itu cukup: dc up -d --build   ·   dc logs -f   ·   dc ps
```

### `npm: command not found` di VPS

```
root@srv1890813:/opt/ikrarku# npm run mayar:check
Command 'npm' not found
```

**Ini wajar — dan jangan dipasang.** VPS sengaja hanya menjalankan Docker;
Node hidup di dalam container. Memasang Node di host justru menambah versi
kedua yang bisa berbeda dengan yang dipakai aplikasi.

Pinjam Node sebentar dari image resmi — tidak memasang apa pun, tidak
perlu rebuild:

```bash
cd /opt/ikrarku
docker run --rm -v /opt/ikrarku:/app -w /app node:22-bookworm-slim \
  node scripts/<nama-skrip>.mjs
```

Container dihapus otomatis setelah selesai.

### `Cannot find module '/app/scripts/...'` saat `docker compose exec`

```
Error: Cannot find module '/app/scripts/mayar-check.mjs'
```

Container yang berjalan memakai **image lama**. Runtime image sebelumnya
hanya menyalin `dist/` dan `server/`; `scripts/` baru ikut setelah
perubahan `Dockerfile`. Dua pilihan:

```bash
# cepat — tanpa rebuild
docker run --rm -v /opt/ikrarku:/app -w /app node:22-bookworm-slim \
  node scripts/mayar-check.mjs

# permanen — setelah Dockerfile terbaru terpasang
git pull
docker compose -f docker-compose.staging.yml up -d --build
```

Pastikan dulu berkasnya memang ada di VPS:

```bash
ls scripts/mayar-check.mjs
```

> Konsekuensi lain: **seluruh `npm run ...` memang hanya untuk laptop.**
> `npm run check`, `qa:integration`, dan kawan-kawan dijalankan sebelum push,
> bukan di VPS. Satu-satunya pengecualian adalah
> `./deploy/scripts/deploy-staging.sh`, yang butuh Node di host — kalau Node
> tidak ada, pakai jalur manual pada B5.

### Container tidak mau `healthy`

```bash
docker compose -f docker-compose.staging.yml logs --tail=200 ikrarku
```

| Pesan di log | Penyebab |
|---|---|
| `ADMIN_BOOTSTRAP_PASSWORD wajib di-set` | baris itu kosong di `.env.staging` |
| `EADDRINUSE` | port 5180 masih dipakai container lama |
| error SQLite | database rusak → pulihkan dari backup |

### `502 Bad Gateway` di browser

```bash
docker compose -f docker-compose.staging.yml ps     # container hidup?
sudo nginx -t                                        # konfigurasi Nginx valid?
sudo systemctl reload nginx
```

### Halaman tampil lama padahal sudah deploy

1. Hard refresh (C4)
2. Coba jendela samaran / incognito
3. Pastikan build benar-benar terbaru:
   ```bash
   docker compose -f docker-compose.staging.yml images
   ```

### Perlu kembali ke versi sebelumnya

```bash
git log --oneline -5           # cari commit yang masih baik
git checkout <hash-commit>
docker compose -f docker-compose.staging.yml up -d --build --remove-orphans
```

Kalau data yang bermasalah, bukan kode:

```bash
./deploy/scripts/restore-staging.sh backups/<tanggal-jam>
```

---

## Ringkasan perintah

Setelah terbiasa, ini saja yang dipakai sehari-hari:

```bash
# — di laptop —
npm run check && npm run qa:integration
git add -A && git commit -m "..." && git push

# — di VPS —
ssh root@srv1890813
cd /opt/ikrarku
./deploy/scripts/backup-staging.sh
git pull
docker compose -f docker-compose.staging.yml up -d --build --remove-orphans
docker compose -f docker-compose.staging.yml ps

# — di browser —
# buka https://dev.ikrarku.id lalu Ctrl+Shift+R
```

---

## Tujuh kesalahan paling sering

1. **Lupa hard refresh** — perubahan sudah naik, browser menampilkan cache lama
2. **Push tanpa `npm run check`** — build baru gagal di VPS, buang waktu
3. **Lupa backup** sebelum deploy yang menyentuh database
4. **`CLIENT_ORIGIN` tidak sama persis** dengan alamat di browser — CORS gagal
5. **Panik melihat `qa:static` merah** — memang sudah merah sejak lama, bukan
   karena perubahan Anda
6. **Lupa `-f docker-compose.staging.yml`** — Docker menjawab
   `no configuration file provided`
7. **Mencoba `npm run ...` di VPS** — Node hanya ada di dalam container;
   seluruh `npm run` dijalankan di laptop

---

## Dokumen terkait

- [PANDUAN_MAYAR_PEMULA.md](PANDUAN_MAYAR_PEMULA.md) — menyambungkan pembayaran
- [DEPLOY_MAYAR.md](DEPLOY_MAYAR.md) — rujukan ringkas Mayar
- [STAGING_DEPLOYMENT.md](STAGING_DEPLOYMENT.md) — arsitektur, Nginx, backup/restore
