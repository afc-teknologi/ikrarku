# Panduan Lengkap ikrarku Sites

Tiga pekerjaan dalam satu dokumen, ditulis untuk diikuti berurutan:

| Bagian | Isi | Perlu akses apa |
|---|---|---|
| **[I. Deploy ke dev.ikrarku.id](#bagian-i--deploy-ke-devikrarkuid)** | dari laptop sampai perubahan terlihat di situs | SSH ke VPS |
| **[II. Slug Jurnal](#bagian-ii--slug-jurnal-agar-artikel-terbaca-mesin-pencari)** | agar artikel punya URL sendiri dan terbaca mesin pencari | login CMS sebagai Administrator |
| **[III. Pembayaran Mayar](#bagian-iii--pembayaran-mayar)** | menyambungkan payment gateway | dashboard Mayar (atau bantuan pemegang akun) |

Bagian I dan II bisa dikerjakan sendiri hari ini. Bagian III sebagian
bergantung pihak lain.

---

# BAGIAN I — Deploy ke dev.ikrarku.id

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

> `docker`, `nginx`, dan `dig` memang tidak ada di laptop Anda. Itu normal,
> bukan yang perlu dipasang.
>
> Sebaliknya, **`npm` tidak ada di VPS** dan juga tidak perlu dipasang.
> Semua `npm run ...` dijalankan di laptop.

## I.0 — Pastikan kode sudah benar-benar sampai di VPS

Kerjakan ini **sebelum** menyalahkan konfigurasi. Sebagian besar "fitur
tidak jalan" sebenarnya "kode belum sampai".

### Apakah berkasnya ada di disk VPS?

```bash
cd /opt/ikrarku
ls scripts/mayar-check.mjs scripts/article-slugs.mjs
grep -c 'app.get("/robots.txt"' server/index.mjs
```

| Hasil | Artinya |
|---|---|
| `No such file` / `0` | **kode belum sampai.** Salin patch terbaru ke repo lokal, commit, push, lalu `git pull` di VPS |
| semua ada / `1` | kode sudah di disk — lanjut ke pemeriksaan berikut |

### Apakah yang berjalan memang kode itu?

```bash
curl -s -o /dev/null -w '%{content_type}\n' https://dev.ikrarku.id/robots.txt
```

| Hasil | Artinya |
|---|---|
| `text/plain` | container sudah memakai kode terbaru |
| `text/html` | **container masih image lama.** Build ulang (I.2) |

> Pemeriksaan ini tajam karena `/robots.txt` dilayani tanpa syarat
> `NODE_ENV`. Kalau yang keluar HTML, itu berarti permintaan jatuh ke
> catch-all SPA — satu-satunya penjelasan: rutenya belum ada di kode yang
> sedang berjalan.

Gejala-gejala berikut semuanya berakar pada hal yang sama, jadi jangan
diperbaiki satu per satu:

- `Cannot find module '/app/scripts/...'`
- `/robots.txt` dan `/sitemap.xml` mengembalikan halaman HTML
- halaman artikel memakai judul & deskripsi umum situs
- `npm run mayar:check` tidak dikenali

- [ ] I.0 selesai: berkas ada di disk **dan** `content_type` = `text/plain`

## I.1 — Di laptop

```bash
cd /path/ke/ikrarku
git status
```

Jalankan gerbang mutu:

```bash
npm run check
```

Lalu suite pengujian:

```bash
npm run qa:integration    # 35/35
npm run qa:db             # 38/38
npm run qa:layout         # 29/29
npm run preflight         # "Preflight passed."
```

> **`npm run qa:static` dan `npm run qa:wysiwyg` memang merah** (19/32 dan
> 9/27) dan sudah begitu sejak lama, bahkan pada commit bersih. Keduanya
> script lama berbasis pencocokan string ke format sumber yang sudah
> berubah. **Abaikan** — bukan gerbang rilis.

Kalau semua hijau:

```bash
git add -A
git commit -m "deskripsi singkat"
git push origin <branch>
```

- [ ] I.1 selesai

## I.2 — Di VPS

```bash
ssh root@srv1890813
cd /opt/ikrarku
```

### Backup dulu — selalu

```bash
./deploy/scripts/backup-staging.sh
ls -la backups/ | tail -3
```

> Deploy menyentuh database. Backup adalah satu-satunya jalan pulang.

### Ambil kode terbaru

```bash
git pull
```

### Periksa konfigurasi

```bash
nano .env.staging
```

Berkas yang dibaca compose adalah **`.env.staging`**, bukan `.env`.

```env
CLIENT_ORIGIN=https://dev.ikrarku.id
PUBLIC_BASE_URL=https://dev.ikrarku.id
PAYMENT_MODE=simulation
```

| Baris | Kenapa penting |
|---|---|
| `CLIENT_ORIGIN` | harus **sama persis** dengan alamat di browser, termasuk `https://`. Beda sedikit → CORS gagal. |
| `PUBLIC_BASE_URL` | dipakai canonical, `og:url`, dan `sitemap.xml`. Menunjuk `localhost` → halaman tidak terindeks. |
| `PAYMENT_MODE` | biarkan `simulation` sampai Bagian III tuntas. |

> `.env.staging` dan database SQLite ada di `.gitignore`. **`git pull` tidak
> bisa menimpanya**, dan push dari laptop tidak bisa mereset konfigurasi
> payment gateway Anda.

### Build dan jalankan

```bash
docker compose -f docker-compose.staging.yml up -d --build --remove-orphans
docker compose -f docker-compose.staging.yml ps
```

> **Wajib pakai `-f docker-compose.staging.yml`.** Tanpa itu Docker menjawab
> `no configuration file provided: not found`, karena berkasnya memang tidak
> bernama `docker-compose.yml`.
>
> Agar tidak mengetik berulang, sekali saja:
> ```bash
> echo "alias dc='docker compose -f /opt/ikrarku/docker-compose.staging.yml'" >> ~/.bashrc
> source ~/.bashrc
> # sesudah itu: dc up -d --build · dc ps · dc logs -f
> ```

- [ ] I.2 selesai, container `healthy`

## I.3 — Verifikasi

```bash
curl http://127.0.0.1:5180/api/health     # memuat "ok":true
./deploy/scripts/smoke-test.sh            # berakhir "Smoke test PASS"
curl -I https://dev.ikrarku.id            # HTTP/2 200
```

Lalu buka `https://dev.ikrarku.id` dan **hard refresh**:

| Sistem | Tombol |
|---|---|
| Windows / Linux | `Ctrl` + `Shift` + `R` |
| macOS | `Cmd` + `Shift` + `R` |

> Tanpa hard refresh, browser menampilkan bundle JavaScript lama dari cache
> dan Anda akan mengira deploy-nya gagal. Ini penyebab kebingungan paling
> sering.

- [ ] I.3 selesai

## I.4 — Kalau ada yang salah

### `no configuration file provided: not found`

Kurang `-f docker-compose.staging.yml`. Lihat I.2.

### `npm: command not found` di VPS

Wajar — VPS tidak memasang Node. Untuk menjalankan perkakas di folder
`scripts/`, pinjam Node sebentar dari image resmi:

```bash
docker run --rm -v /opt/ikrarku:/app -w /app node:22-bookworm-slim \
  node scripts/<nama-skrip>.mjs
```

Container dihapus otomatis setelah selesai; tidak ada yang terpasang di host.

### Container tidak mau `healthy`

```bash
docker compose -f docker-compose.staging.yml logs --tail=200 ikrarku
```

| Pesan | Penyebab |
|---|---|
| `ADMIN_BOOTSTRAP_PASSWORD wajib di-set` | baris itu kosong di `.env.staging` |
| `EADDRINUSE` | port 5180 masih dipakai container lama |
| error SQLite | database rusak → pulihkan dari backup |

### `502 Bad Gateway`

```bash
docker compose -f docker-compose.staging.yml ps
sudo nginx -t && sudo systemctl reload nginx
```

### Perlu mundur ke versi sebelumnya

```bash
git log --oneline -5
git checkout <hash>
docker compose -f docker-compose.staging.yml up -d --build --remove-orphans
```

Kalau datanya yang bermasalah:

```bash
./deploy/scripts/restore-staging.sh backups/<tanggal-jam>
```

---

# BAGIAN II — Slug Jurnal (agar artikel terbaca mesin pencari)

## II.1 — Apa yang sebenarnya terjadi

Kabar baik: **setiap artikel sudah punya slug sejak dibuat.** Kolomnya ada
di database sejak awal (`slug TEXT UNIQUE NOT NULL`) dan terisi otomatis.

Yang dulu tidak ada adalah **route**-nya. Membuka artikel tidak mengubah URL
sama sekali, jadi tidak bisa di-share, tidak bisa di-bookmark, dan tidak bisa
dirayapi mesin pencari.

Itu sudah diperbaiki. Sekarang setiap artikel punya alamat sendiri:

```
https://dev.ikrarku.id/jurnal/<slug>
```

Masalah yang tersisa ada pada **isi slugnya**, karena dibuat otomatis:

| Gejala | Contoh nyata di database Anda |
|---|---|
| terbentuk dari paragraf isi, bukan judul | slug sepanjang **730 karakter** |
| berakhiran angka acak karena judul kembar | `lorem-ipsum-93074` |
| masih judul contoh | `lorem-ipsum` |

## II.2 — Audit slug yang ada

Database ada di volume Docker, bukan di folder repo, jadi perintahnya
memasang volume itu:

```bash
docker run --rm \
  -v ikrarku_staging_data:/app/data \
  -v /opt/ikrarku/scripts:/app/scripts \
  -w /app node:22-bookworm-slim \
  node scripts/article-slugs.mjs
```

**Skrip ini hanya membaca.** Tidak pernah mengubah apa pun.

Keluarannya menandai tiap artikel, menyebut masalahnya, dan mengusulkan
slug pengganti.

- [ ] II.2 selesai, sudah tahu artikel mana yang perlu dibenahi

## II.3 — Perbaiki judul dulu, baru slug

Ini urutan yang benar, dan sering terbalik.

Kelima artikel Anda berjudul **"Lorem Ipsum"**. Selama judulnya masih itu,
slug sebagus apa pun tidak menolong: mesin pencari membaca judul, dan
pembaca memutuskan mau klik atau tidak dari judul. Mengganti
`lorem-ipsum-93074` menjadi `lorem-ipsum-3` hanya memindahkan masalah.

Untuk tiap artikel, di CMS:

1. Masuk workspace sebagai **Administrator**
2. Menu **Articles** → klik artikelnya
3. **Judul** → ganti dengan judul sungguhan yang deskriptif
   - buruk: `Lorem Ipsum`
   - baik: `5 Tren Dekorasi Pernikahan 2027`
4. **Permalink** → sesuaikan slugnya
   - pendek, huruf kecil, dipisah tanda hubung
   - ideal di bawah 60 karakter
   - contoh: `tren-dekorasi-pernikahan-2027`
5. **Excerpt** → isi 1–2 kalimat. **Ini yang dipakai sebagai meta
   description** di hasil pencarian dan pratinjau WhatsApp. Kalau kosong,
   tampilannya hambar.
6. **Cover image** → pasang. Tanpa cover, kartu share tampil tanpa gambar.
7. Simpan

> **Mengubah slug = mengubah URL publik.** Untuk artikel yang sudah tersebar
> atau sudah terindeks, tautan lamanya akan mati. Artikel uji coba seperti
> "Lorem Ipsum" aman diubah.

- [ ] II.3 selesai untuk semua artikel

## II.4 — Verifikasi

Setelah deploy dan artikel dibenahi:

```bash
curl -s https://dev.ikrarku.id/robots.txt
curl -s https://dev.ikrarku.id/sitemap.xml | head -20
# ganti lorem-ipsum dengan slug artikel Anda yang sebenarnya.
# JANGAN mengetik tanda < > — bash membacanya sebagai redirect berkas.
curl -s https://dev.ikrarku.id/jurnal/lorem-ipsum | grep -E 'og:|canonical|<title>'
```

Yang diharapkan pada perintah ketiga:

- `<title>` berisi **judul artikel**, bukan judul umum situs
- muncul `og:title`, `og:description`, `og:image`, dan `canonical`

> Injeksi meta ini **hanya aktif** saat `NODE_ENV=production` dengan folder
> `dist/` — keduanya terpenuhi di dalam container, tapi **tidak** saat
> `npm run dev`. Jadi fitur ini memang tidak bisa diuji di laptop.

Lalu di browser:

- [ ] Buka `/jurnal`, klik satu artikel → URL berubah jadi `/jurnal/<slug>`
- [ ] Tekan tombol **Back** → kembali ke daftar, bukan keluar dari situs
- [ ] Salin URL artikel, buka di tab baru → langsung terbuka di artikel itu
- [ ] Kirim URL-nya ke WhatsApp → pratinjau menampilkan judul & gambar artikel

## II.5 — Google Search Console

**Putuskan dulu:** kalau `dev.ikrarku.id` memang staging, **jangan**
didaftarkan. Nanti yang terindeks staging, bukan produksi — dan keduanya
akan bersaing di hasil pencarian.

Kalau memang ini situs publiknya:

1. Buka Google Search Console → tambahkan properti domain
2. Verifikasi kepemilikan (biasanya lewat DNS TXT)
3. Menu **Sitemaps** → kirim `https://dev.ikrarku.id/sitemap.xml`
4. Uji satu artikel di **Rich Results Test** → JSON-LD `Article` harus terbaca

Pratinjau tautan bisa diuji di Facebook Sharing Debugger dan X Card Validator.

---

# BAGIAN III — Pembayaran Mayar

## III.0 — Istilah yang akan muncul

| Istilah | Artinya |
|---|---|
| **Mayar** | layanan yang menerima uang dari pelanggan (QRIS, transfer, e-wallet) lalu memberi tahu sistem kita |
| **API key** | kata sandi panjang agar sistem kita boleh bicara dengan Mayar. **Rahasia.** |
| **Webhook** | panggilan balik dari Mayar: *"order ini sudah dibayar"* |
| **Sandbox** | mode latihan, uang tidak nyata |
| **Produksi** | mode sungguhan, uang nyata |

### Alur uangnya

```
Pelanggan klik "Bayar"
   │
   ├─► Sistem kita minta Mayar membuatkan tagihan   ← butuh API KEY
   │
   ├─► Pelanggan dibawa ke halaman Mayar, lalu membayar
   │
   └─► Mayar memberi tahu sistem kita                ← butuh WEBHOOK
          │
          └─► Order berubah: Pending ──► Paid
```

**Kalau webhook tidak disiapkan, uang tetap masuk ke Mayar tapi order macet
di `Pending` selamanya** — pelanggan sudah bayar, sistem menganggap belum.

## III.1 — Posisi Anda

Bisa login ke dashboard Mayar?

- **Bisa** → kerjakan semuanya sendiri.
- **Tidak, hanya dititipi API key** → Anda tetap bisa mengerjakan III.2–III.4.
  Langkah III.5 wajib dibantu pemegang akun.

## III.2 — Isi konfigurasi

```bash
ssh root@srv1890813
cd /opt/ikrarku
nano .env.staging
```

```env
PAYMENT_MODE=simulation

MAYAR_API_KEY=<JWT utuh>
MAYAR_API_BASE=https://api.mayar.id/hl/v1
MAYAR_WEBHOOK_TOKEN=<token karangan Anda>
MAYAR_INVOICE_EXPIRY_HOURS=24

CLIENT_ORIGIN=https://dev.ikrarku.id
```

> **Biarkan `PAYMENT_MODE=simulation` dulu.** Alur pemesanan tetap bisa
> diuji penuh tanpa risiko order nyata macet. Baru diganti di III.6.

### Tentang API key

Bentuknya JWT — **panjang, tiga bagian dipisah titik**:

```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtcmNfMTIzIiwi...  .Xk9fL2p...
└──── bagian 1 ────┘ └──────── bagian 2 ────────┘ └─ bagian 3 ─┘
```

Kalau yang Anda terima sependek `eyJhbGciOiJSU`, itu **terpotong** — baru
potongan awal bagian 1. Minta ulang.

> **Key harus "Read & Write".** Membuat tagihan itu operasi tulis; key
> *Read Only* hanya boleh membaca. Kalau salah, semuanya tampak normal
> sampai pelanggan menekan Bayar — baru di situ gagal.

### Tentang token webhook

Token ini **Anda yang karang sendiri**, bukan dari Mayar:

```bash
openssl rand -hex 24
```

> Mayar **tidak menandatangani** panggilan webhook-nya. Token inilah
> satu-satunya pengaman. Jangan memakai kata yang mudah ditebak.

Simpan, lalu:

```bash
docker compose -f docker-compose.staging.yml up -d --build
```

- [ ] III.2 selesai

## III.3 — Cek key tanpa menyentuh uang

```bash
cd /opt/ikrarku
docker run --rm -v /opt/ikrarku:/app -w /app node:22-bookworm-slim \
  node scripts/mayar-check.mjs
```

Tidak membuat transaksi apa pun. API key tidak dicetak ke layar.
Skrip membaca `.env.staging` otomatis.

Penanda: `OK` beres · `CEK` perhatikan · `GAGAL` harus dibereskan.

Yang diperiksa:

| Bagian | Menjawab |
|---|---|
| 2 | key ini milik akun & domain mana |
| 3b | **key ini produksi atau sandbox** — key yang sama dicoba ke ketiga domain Mayar |
| 4 | key Read & Write atau Read Only, **dan apakah endpoint V1 masih hidup** |
| 5 | webhook terjangkau & token cocok |

> `Tidak satu pun domain Mayar terjangkau` = masalah jaringan, **bukan**
> bukti key salah. Pastikan dijalankan di VPS.
>
> `Cannot find module` = berkasnya belum ada di VPS. Jalankan `git pull`.

- [ ] III.3 selesai, semua `GAGAL` dibereskan

## III.4 — Cek metode pembayaran di CMS

- [ ] Workspace → **Payment Settings** → minimal satu metode **aktif**

> Endpoint pembayaran menolak order bila metodenya tidak aktif, terlepas
> dari konfigurasi Mayar. Bawaannya QRIS dan GoPay sudah aktif.

## III.5 — Daftarkan webhook di dashboard Mayar

**Langkah paling sering terlewat, akibatnya paling fatal.**

Alamat yang didaftarkan harus **lengkap dengan `?token=`**:

```
https://dev.ikrarku.id/api/webhooks/mayar?token=<MAYAR_WEBHOOK_TOKEN>
```

### Kalau Anda tidak punya akses dashboard

Kirim ini ke pemegang akun:

> Halo, saya sedang menyambungkan ikrarku Sites ke Mayar. Ada 4 hal yang
> hanya bisa dilakukan dari dashboard — mohon bantuannya:
>
> **1.** API key dengan permission **Read & Write**. Key sebelumnya
> kemungkinan Read Only, padahal membuat tagihan butuh izin tulis. Mohon
> kirim nilai **utuhnya** (panjang, tiga bagian dipisah titik).
>
> **2.** Konfirmasi key ini untuk akun **produksi** atau **sandbox**. Saya
> minta sandbox dulu untuk uji coba.
>
> **3.** Daftarkan alamat webhook ini, persis termasuk `?token=`:
> ```
> https://dev.ikrarku.id/api/webhooks/mayar?token=<TOKEN_SAYA_KIRIM_TERPISAH>
> ```
> Tanpa ini, pembayaran yang masuk tidak akan pernah terkonfirmasi di
> sistem kami.
>
> **4.** Konfirmasi domain. Key Mayar terikat domain; domain kami
> `dev.ikrarku.id`. Kalau key dibuat untuk domain lain, mohon dibuatkan
> key baru.
>
> Satu pertanyaan untuk support Mayar: **apakah API V1 masih aktif untuk
> akun kami?** Dokumentasi menyebut V1 dihentikan 1 Oktober 2026.

Kirim nilai token lewat jalur terpisah dari chat biasa. Jangan pernah
mengirim balik API key lewat kanal yang sama.

- [ ] III.5 selesai

## III.6 — Nyalakan dan uji

```bash
nano .env.staging       # PAYMENT_MODE=mayar
docker compose -f docker-compose.staging.yml up -d --build
```

Lalu **transaksi uji di sandbox, nominal kecil**:

1. Buka situs sebagai pelanggan biasa
2. Buat pesanan, klik **Bayar** → harus pindah ke halaman Mayar
3. Selesaikan pembayaran
4. Workspace → **Orders** → **status harus berubah `Pending` → `Paid`**

> Integrasi uang tidak layak dipercaya hanya karena pengecekan hijau.
> Langkah ini satu-satunya bukti nyata. **Jangan dilewati.**

- [ ] III.6 selesai, status jadi `Paid`

## III.7 — Kalau macet di `Pending`

```bash
docker compose -f docker-compose.staging.yml logs --tail=100 ikrarku | grep -i mayar
```

| Yang terlihat | Artinya | Lakukan |
|---|---|---|
| **tidak ada tulisan apa pun** | Mayar tidak pernah menghubungi kita | webhook belum didaftarkan → III.5 |
| `401` | token tidak cocok | samakan `?token=` dengan `.env.staging` |
| `503` | sistem belum siap | `PAYMENT_MODE` belum `mayar` → III.6 |
| `Payment amount mismatch` | nominal tidak sama | nominal tagihan ≠ nominal order |
| `order tidak cocok` | order tidak ditemukan | salin log, laporkan |

## III.8 — Naik ke produksi

Hanya setelah III.6 berhasil di sandbox.

- [ ] Ganti ke API key **produksi**
- [ ] Sesuaikan `MAYAR_API_BASE` (pastikan lewat `mayar-check`)
- [ ] Daftarkan ulang webhook di dashboard **produksi**
- [ ] `mayar-check` sekali lagi
- [ ] Satu transaksi nyata nominal kecil, lalu refund

## III.9 — Risiko yang belum terjawab: V1 vs V2

Kode ini memakai `/hl/v1/invoice/create`. Dua tanda versi itu usang:

1. Dokumentasi Mayar menyebut **V1 dihentikan 1 Oktober 2026** — sudah lewat
2. CLI resmi Mayar seluruh endpoint-nya sudah `/hl/v2/`

Migrasi ke V2 **belum dikerjakan**: kontrak `invoice/create` versi V2 belum
tersedia, dan menebak-nebak pada alur uang bukan pilihan yang bisa
dipertanggungjawabkan.

- [ ] Lihat hasil `mayar-check` bagian 4
- [ ] Tanyakan ke support Mayar apakah V1 masih aktif
- [ ] Bila sudah harus V2, siapkan dokumentasinya

---

# Ringkasan perintah harian

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
# https://dev.ikrarku.id lalu Ctrl+Shift+R
```

# Kesalahan paling sering

**Deploy**

0. **Menduga kode sudah sampai padahal belum.** Satu akar ini memunculkan
   banyak gejala sekaligus: modul tidak ketemu, `/robots.txt` mengembalikan
   HTML, meta artikel masih umum. Cek dulu dengan I.0 sebelum membetulkan
   gejalanya satu per satu.
1. Lupa **hard refresh** — perubahan sudah naik, browser menampilkan cache lama
2. Lupa `-f docker-compose.staging.yml` — `no configuration file provided`
3. Mencoba `npm run ...` di VPS — Node hanya ada di dalam container
4. Push tanpa `npm run check` — build gagal di VPS, buang waktu
5. Lupa backup sebelum deploy yang menyentuh database
6. Panik melihat `qa:static` merah — memang sudah merah sejak lama

**Jurnal**

7. Mengganti slug tapi **judulnya masih "Lorem Ipsum"** — memindahkan masalah
8. **Excerpt kosong** — itu yang jadi meta description
9. Mendaftarkan **staging** ke Search Console

**Mayar**

10. **API key terpotong** saat disalin
11. **Key Read Only** — gagal baru saat pelanggan menekan Bayar
12. Webhook **tanpa `?token=`**, atau tidak didaftarkan sama sekali
13. `CLIENT_ORIGIN` masih `localhost`
14. Langsung produksi **tanpa uji sandbox**

**Shell**

15. Mengetik placeholder apa adanya — `curl .../jurnal/<slug>` membuat bash
    menjawab `syntax error near unexpected token`, karena `<` dibaca sebagai
    redirect berkas. Ganti dulu dengan nilai sebenarnya, tanpa tanda `< >`.

# Keamanan

- Jangan mengirim API key lewat chat grup atau dokumen bersama
- Jangan memasukkan API key ke kode yang di-push ke GitHub
- `.env.staging` sudah dikecualikan dari Git
- Kalau key terlanjur tersebar, minta pemegang akun **mencabut dan
  membuat ulang**

# Dokumen terkait

- [PANDUAN_DEPLOY_DEV.md](PANDUAN_DEPLOY_DEV.md) — deploy, lebih rinci
- [PANDUAN_MAYAR_PEMULA.md](PANDUAN_MAYAR_PEMULA.md) — Mayar, lebih rinci
- [DEPLOY_MAYAR.md](DEPLOY_MAYAR.md) — Mayar, rujukan ringkas
- [STAGING_DEPLOYMENT.md](STAGING_DEPLOYMENT.md) — arsitektur, Nginx, backup
