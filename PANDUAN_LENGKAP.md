# Panduan Lengkap ikrarku Sites

Empat pekerjaan dalam satu dokumen, ditulis untuk diikuti berurutan:

| Bagian | Isi | Perlu akses apa |
|---|---|---|
| **[I. Deploy ke dev.ikrarku.id](#bagian-i--deploy-ke-devikrarkuid)** | dari laptop sampai perubahan terlihat di situs | SSH ke VPS |
| **[II. Slug Jurnal](#bagian-ii--slug-jurnal-agar-artikel-terbaca-mesin-pencari)** | agar artikel punya URL sendiri dan terbaca mesin pencari | login CMS sebagai Administrator |
| **[III. Pembayaran Mayar](#bagian-iii--pembayaran-mayar)** | menyambungkan payment gateway | dashboard Mayar (atau bantuan pemegang akun) |
| **[IV. Retest QA di editor](#bagian-iv--retest-qa-di-editor)** | memastikan perbaikan QA terakhir benar-benar jalan | login sebagai Web Designer |

Bagian I, II, dan IV bisa dikerjakan sendiri hari ini. Bagian III sebagian
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
npm run qa:integration    # 39/39
npm run qa:db             # 38/38
npm run qa:layout         # 112/112
npm run preflight         # "Preflight passed."
```

> Angka `qa:layout` naik setiap kali ada perbaikan QA baru: 29 → 34 → 36 →
> 37 → 39 → 42 → 53 → 59 → 62 → 63 → 70 → 71 → 72 → 75 → 76 → 77 → 78 → 79 → 80 → 81 → 82 → 83 → 84 → 103 → 104 → 105 → **110**. Kalau yang keluar lebih kecil dari angka di atas, berarti
> repo lokal Anda belum memuat perbaikan terakhir — bukan testnya yang
> hilang.

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

Itu sudah diperbaiki. Sekarang ada **dua alamat yang sengaja berbeda**:

| Halaman | Alamat |
|---|---|
| daftar jurnal (menu di header) | `https://dev.ikrarku.id/jurnal` |
| satu artikel | `https://dev.ikrarku.id/articles/<slug>` |

> Alamat artikel dulu `/jurnal/<slug>`, lalu dipindah ke `/articles/<slug>`.
> Alamat lamanya **tidak dimatikan**: server mengalihkannya **301** ke alamat
> baru, jadi tautan yang sudah tersebar atau terindeks tetap sampai dan nilai
> SEO-nya ikut pindah. Jangan menghapus pengalihan itu.

Masalah yang tersisa ada pada **isi slugnya**, karena dibuat otomatis:

| Gejala | Contoh nyata di database Anda |
|---|---|
| terbentuk dari paragraf isi, bukan judul | `8-tips-…` (67 karakter), `10-pertanyaan-…` (71 karakter) |
| judul hanya satu huruf, slugnya ikut | `l`, `t` |
| berakhiran angka acak karena judul kembar | `t-10004` |

Batas wajar slug adalah **60 karakter**. Lebih dari itu terpotong di hasil
pencarian dan menyulitkan saat dibagikan.

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

Dua artikel Anda berjudul satu huruf saja (`l` dan `t`). Selama judulnya
masih begitu, slug sebagus apa pun tidak menolong: mesin pencari membaca
judul, dan pembaca memutuskan mau klik atau tidak dari judul. Mengganti
`t-10004` menjadi `t-2` hanya memindahkan masalah — karena itu
`article-slugs.mjs` sengaja **menolak mengusulkan slug** untuk artikel
semacam ini dan menjawab `GANTI JUDULNYA DULU`.

Untuk tiap artikel, di CMS:

1. Masuk workspace sebagai **Administrator**
2. Menu **Articles** → klik artikelnya
3. **Judul** → ganti dengan judul sungguhan yang deskriptif
   - buruk: `t`, `l`, `Lorem Ipsum`
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

> **Mengubah slug = mengubah URL publik.** Pengalihan 301 yang ada hanya
> memindahkan **prefiks** (`/jurnal/x` → `/articles/x`); ia tidak tahu kalau
> slug `x` Anda ganti jadi `y`. Jadi untuk artikel yang sudah tersebar atau
> terindeks, mengganti slug tetap mematikan tautan lamanya. Artikel uji coba
> (`l`, `t`) aman diubah; dua artikel yang sudah terbit pikirkan dulu.

- [ ] II.3 selesai untuk semua artikel

## II.4 — Verifikasi

Setelah deploy dan artikel dibenahi:

```bash
# Simpan slugnya sekali, supaya tidak salah ketik di tiga perintah berikut.
# JANGAN mengetik tanda < > — bash membacanya sebagai redirect berkas.
SLUG=10-pertanyaan-tentang-wedding-website-yang-sering-ditanyakan-membuatnya

curl -s https://dev.ikrarku.id/robots.txt
curl -s https://dev.ikrarku.id/sitemap.xml | head -20
curl -s "https://dev.ikrarku.id/articles/$SLUG" | grep -E 'og:|canonical|<title>'
curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' \
  "https://dev.ikrarku.id/jurnal/$SLUG"
```

Yang diharapkan:

| Perintah | Hasil benar |
|---|---|
| `robots.txt` | teks biasa, memuat baris `Sitemap:` |
| `sitemap.xml` | `/jurnal` sebagai halaman daftar, artikel di `/articles/<slug>` |
| `/articles/$SLUG` | `<title>` berisi **judul artikel** (bukan judul umum situs), ada `og:title`, `og:description`, `og:image`, `canonical` |
| `/jurnal/$SLUG` | **`301`** menuju `/articles/<slug>` — bukan `200`, bukan `404` |

> Kalau alamat lama menjawab `200` dan bukan `301`, berarti container masih
> memakai image lama. Ulangi I.0.

> Injeksi meta ini **hanya aktif** saat `NODE_ENV=production` dengan folder
> `dist/` — keduanya terpenuhi di dalam container, tapi **tidak** saat
> `npm run dev`. Jadi fitur ini memang tidak bisa diuji di laptop.

Lalu di browser:

- [ ] Buka `/jurnal` → daftar artikel tampil, alamatnya tetap `/jurnal`
- [ ] Klik satu artikel → alamat berubah jadi `/articles/<slug>`
- [ ] Tekan **Back** → kembali ke daftar **dan alamatnya kembali ke `/jurnal`**
- [ ] Dari landing page, klik kartu artikel → `/articles/<slug>`; tekan Back →
      kembali ke landing **dan alamatnya kembali ke `/`**
- [ ] Salin alamat artikel, buka di tab baru → langsung terbuka di artikel itu
- [ ] Tempel alamat **lama** (`/jurnal/<slug>`) di tab baru → otomatis pindah
      ke `/articles/<slug>`
- [ ] Kirim alamatnya ke WhatsApp → pratinjau menampilkan judul & gambar artikel

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

### Hasil pemeriksaan terakhir — 13 Oktober 2026

Sudah dijalankan di VPS dengan key pengganti. Yang sudah pasti, jangan
diturunkan ulang:

| Temuan | Nilai |
|---|---|
| Pemilik key | `hello@afarcoteknologi.com`, role `developer` |
| Lingkungan | **produksi** — `api.mayar.id` menerima, `.io` dan `.club` menolak `401` |
| Izin | **Read & Write** — klaim `scope` berbunyi `{"read":true,"write":true}`, dan `GET /hl/v2/balances` diterima |
| Endpoint V1 | **masih hidup** — body kosong dijawab `400` (validasi payload), bukan `404` |

> Key pertama (Read Only) sudah diganti. Catatan lama bahwa key tidak bisa
> membuat tagihan **sudah tidak berlaku**.

**Tidak ada key sandbox.** Key yang ada untuk produksi, dan `api.mayar.io`
maupun `api.mayar.club` menolaknya. Artinya transaksi uji di III.6 memakai
**uang sungguhan** — lihat peringatan di sana sebelum menjalankannya.

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

### Pastikan container benar-benar memakai nilai yang baru

`up -d --build` dengan seluruh layer `CACHED` menghasilkan image yang sama,
dan Compose bisa memilih **tidak** membuat ulang container — sehingga
`.env.staging` yang baru Anda sunting tidak ikut terbaca. Jangan dikira
sudah berlaku; buktikan:

Cara paling tegas: bandingkan **sidik jari** tokennya, bukan tokennya. Nilai
rahasianya tidak pernah tercetak ke layar.

```bash
# nilai yang sedang dipakai container
docker compose -f docker-compose.staging.yml exec ikrarku \
  sh -c 'echo "mode=$PAYMENT_MODE"; printf %s "$MAYAR_WEBHOOK_TOKEN" | md5sum'

# nilai yang ada di berkas
grep '^MAYAR_WEBHOOK_TOKEN=' .env.staging | cut -d= -f2- | tr -d '\r\n' | md5sum
```

| Hasil | Artinya |
|---|---|
| kedua md5 **sama** | container sudah memakai berkas yang sekarang |
| kedua md5 **beda** | container masih memakai nilai lama → paksa buat ulang |

```bash
docker compose -f docker-compose.staging.yml up -d --force-recreate
```

> **Jangan pakai `${MAYAR_WEBHOOK_TOKEN:0:6}`.** `sh` di dalam image itu
> dash, dan potongan substring `${VAR:0:n}` adalah sintaks bash — dash
> menjawab `Bad substitution` dan barisnya tidak tercetak sama sekali.
> Kalau tetap ingin melihat potongan awalnya:
> ```bash
> docker compose -f docker-compose.staging.yml exec ikrarku \
>   sh -c 'printf %s "$MAYAR_WEBHOOK_TOKEN" | cut -c1-6'
> ```

> **`tr -d '\r\n'` pada perintah berkas itu penting, bukan hiasan.** Kalau
> `.env.staging` pernah disunting di Windows, barisnya berakhiran CRLF dan
> token yang terbaca punya `\r` menggantung di ujung. Mata tidak bisa
> melihatnya, tetapi `md5sum`-nya berbeda — dan inilah salah satu penyebab
> `401` yang paling sulit ditemukan.

> Inilah yang membuat `mayar-check` bagian 5 menjawab `401`: skrip membaca
> **berkas**, server memakai **nilai yang sedang berjalan**. Selama keduanya
> berbeda, tokennya tidak akan pernah cocok.

### Transaksi uji

> **Tidak ada sandbox.** Key yang ada untuk **produksi** (lihat III.3), jadi
> transaksi uji ini memakai **uang sungguhan**. Pakai nominal terkecil yang
> diterima, lakukan dari akun Anda sendiri, dan **refund segera** setelah
> status berubah. Jangan memakai kartu atau rekening pelanggan.

1. Buka situs sebagai pelanggan biasa
2. Buat pesanan, klik **Bayar** → harus pindah ke halaman Mayar
3. Selesaikan pembayaran
4. Workspace → **Orders** → **status harus berubah `Pending` → `Paid`**
5. Refund transaksi itu dari dashboard Mayar

> Integrasi uang tidak layak dipercaya hanya karena pengecekan hijau.
> Langkah ini satu-satunya bukti nyata. **Jangan dilewati.**

- [ ] III.6 selesai, status jadi `Paid`, dan transaksinya sudah di-refund

## III.7a — Kalau tombol Bayar menjawab `502`

Ini **bukan** masalah webhook. Order belum sempat sampai ke Mayar sama
sekali — yang gagal adalah pembuatan tagihannya.

`502` punya dua penyebab yang sangat berbeda, dan keduanya terlihat sama di
Console browser. Bedakan dulu, jangan menebak:

| Dari mana | Cara mengenali | Artinya |
|---|---|---|
| **Aplikasi kita** | DevTools → **Network** → klik permintaan `pay` → tab **Response** berisi **JSON** `{"error":"..."}` | Mayar menolak membuat tagihan. Pesan penolakannya ada di situ. |
| **Nginx** | tab Response berisi **halaman HTML** Nginx, dan tombol sempat lama "Memproses pembayaran…" | permintaan menggantung sampai `proxy_read_timeout` Nginx habis |

> **Tombol macet di "Memproses pembayaran…" lalu 502 setelah sekitar satu
> menit** adalah pola tersendiri: Mayar tidak menjawab sama sekali. Sejak
> Oktober 2026 panggilan ke Mayar dibatasi 15 detik (`MAYAR_TIMEOUT_MS`),
> jadi yang menyerah lebih dulu adalah aplikasi — balasannya **504** dengan
> baris `TIDAK MENJAWAB` di log. Kalau Anda masih melihat 502 setelah
> menunggu lama, kode itu belum terpasang.

> Console hanya menulis "Bad Gateway" untuk keduanya. Tab **Response** itulah
> yang menjawab, bukan Console.

Lalu lihat log — sejak Oktober 2026 alasan penolakan Mayar dicatat di sana:

```bash
docker compose -f docker-compose.staging.yml logs --tail=200 ikrarku | grep '\[mayar\]'
```

| Baris log | Artinya | Lakukan |
|---|---|---|
| `invoice/create GAGAL · HTTP 400 · <pesan>` | payload ditolak Mayar | baca pesannya — biasanya nominal di bawah minimum, atau email/nomor telepon kosong |
| `invoice/create GAGAL · HTTP 401` | key ditolak | jalankan `mayar-check`, key diganti/dicabut |
| `invoice/create GAGAL · HTTP 404` | **V1 sudah dicabut** | lihat III.9 |
| `invoice/create OK tapi tanpa payment URL` | Mayar menerima, bentuk responsnya berubah | daftar nama field ikut tercatat — kirimkan ke support Mayar |
| `invoice/create TIDAK MENJAWAB · lewat 15000 ms` | Mayar diam | jaringan keluar container diblokir, atau Mayar sedang bermasalah — uji dari container yang sama, lihat di bawah |
| `pembayaran gagal · FetchError/TimeoutError` | tidak sampai ke Mayar | periksa jaringan keluar VPS |
| **tidak ada baris `[mayar]` sama sekali** | permintaan tidak pernah masuk ke Node | 502-nya dari Nginx → container mati, `docker compose ... ps` |

> Kalau log benar-benar kosong padahal Response berisi JSON, berarti container
> masih memakai image lama yang belum punya pencatatan ini. Build ulang.

### Pastikan `server/index.mjs` yang baru benar-benar ikut terbangun

`git pull` yang hanya membawa berkas di `scripts/` **tidak** mengubah
`server/`, dan pada build berikutnya Docker akan menulis
`CACHED [runtime] COPY server ./server`. Artinya pencatatan `[mayar]` tidak
ikut masuk ke image, dan log akan tetap kosong berapa kali pun dicoba.

```bash
# apakah kode yang BERJALAN sudah punya pencatatan itu?
docker compose -f docker-compose.staging.yml exec ikrarku \
  grep -c '\[mayar\]' server/index.mjs
```

`0` berarti belum. Commit dan push `server/index.mjs` dari laptop lebih
dulu, baru `git pull` dan build ulang di VPS.

### Uji jaringan keluar dari container yang sama

`mayar-check` berjalan di container `docker run` terpisah, yang jaringannya
belum tentu sama dengan container aplikasi. Uji dari dalam container yang
sebenarnya:

```bash
docker compose -f docker-compose.staging.yml exec ikrarku \
  node -e "fetch('https://api.mayar.id/hl/v2/balances',{signal:AbortSignal.timeout(10000)}).then(r=>console.log('status',r.status)).catch(e=>console.log('GAGAL',e.name,e.message))"
```

`status 401` sudah cukup — artinya jaringannya tembus. `GAGAL TimeoutError`
berarti container aplikasi tidak bisa keluar ke internet, dan itulah
penyebab tombolnya menggantung.

## III.7b — Kalau macet di `Pending`

Ini baru soal webhook: tagihan berhasil dibuat, pelanggan sudah membayar,
tetapi order tidak berubah status.

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

## III.9 — V1 vs V2: sudah terjawab, tapi belum selesai

Kode ini memakai `/hl/v1/invoice/create`. Dua tanda versi itu usang:

1. Dokumentasi Mayar menyebut **V1 dihentikan 1 Oktober 2026** — sudah lewat
2. CLI resmi Mayar seluruh endpoint-nya sudah `/hl/v2/`

**Pemeriksaan 13 Oktober 2026 menjawabnya: V1 masih hidup untuk akun ini.**
Dikirim body kosong ke `/hl/v1/invoice/create`, dijawab `400` — itu jawaban
validasi payload, yang hanya mungkin muncul kalau endpoint-nya ada. Kalau
sudah dimatikan, jawabannya `404`.

Jadi tidak ada yang mendesak hari ini. Yang perlu diingat: ini **jeda, bukan
jaminan**. Tanggal penghentian sudah lewat, artinya V1 sekarang berjalan atas
kebijakan Mayar, bukan atas dukungan resmi — dan bisa dicabut tanpa
pemberitahuan ke kita.

Migrasi ke V2 tetap **belum dikerjakan**: kontrak `invoice/create` versi V2
belum tersedia, dan menebak-nebak pada alur uang bukan pilihan yang bisa
dipertanggungjawabkan.

- [x] Lihat hasil `mayar-check` bagian 4 → V1 hidup (`400`, bukan `404`)
- [ ] Tetap tanyakan ke support Mayar: **sampai kapan** V1 dijamin untuk akun
      kami, dan apakah ada tanggal cabut yang sudah ditetapkan
- [ ] Minta dokumentasi `invoice/create` versi V2 sekarang, selagi belum
      mendesak — bukan nanti saat pembayaran sudah mati
- [ ] Jalankan `mayar-check` berkala; bagian 4 akan berubah jadi `404` pada
      hari V1 dicabut, dan itu peringatan paling dini yang kita punya

---

# BAGIAN IV — Retest QA di editor

Suite otomatis (`qa:layout` 39/39) hanya memeriksa **kontrak kode**: bahwa
baris yang memperbaiki sesuatu masih ada dan tidak tertukar lagi. Ia tidak
bisa melihat layar. Jadi setelah deploy, tujuh hal berikut tetap harus
dilihat dengan mata.

Kerjakan setelah I.3 selesai, **dan setelah hard refresh**. Login sebagai
**Web Designer**, buka satu template di Canvas Editor.

## IV.1 — Alamat artikel & tombol Back

Sudah dirinci di [II.4](#ii4--verifikasi). Kerjakan dari sana.

- [ ] IV.1 selesai

## IV.2 — Edit dari card "Template pada website"

1. Menu **Templates & Approval**
2. Bagian **WEBSITE DESIGN → Template pada website**
3. Klik **Edit** pada salah satu card

| Yang benar | Yang salah |
|---|---|
| chip atas berbunyi `Template Design · URL tidak diperlukan` | muncul kolom `ikrarku.id/___` meminta slug |

> Template tidak punya URL publik. Kalau kolom slug muncul, berarti editor
> terbuka dalam mode "site" — tanda perbaikannya belum terpasang.

- [ ] IV.2 selesai

## IV.3 — Satu card per template

Masih di **Template pada website**, pada template yang punya beberapa canvas:

| Yang benar | Yang salah |
|---|---|
| **satu card** mewakili template itu, isinya `N Canvas di dalam design` | satu card per canvas, sebagian berlabel `Custom Design` |

Uji juga canvas baru: buka Canvas Editor → tombol **+** pada Page Structure
→ kembali ke Templates.

- [ ] Canvas yang baru dibuat **ikut masuk card yang sama**, tidak memecah
      diri jadi card `Custom Design` baru
- [ ] IV.3 selesai

## IV.4 — Tinggi kotak preview pada card

Perhatikan gambar pratinjau di tiap card.

| Yang benar | Yang salah |
|---|---|
| kotaknya setinggi isi canvas | ada area kosong lebar di bawah gambar |

> Card bercover (Canvas 1) memang tetap tinggi — cover sengaja dipaksa
> setinggi satu layar. Yang diperiksa di sini canvas biasa.

- [ ] IV.4 selesai

## IV.5 — Heading 2 & Supporting Text 2 di cover

1. Pilih feature **cover** (Buka Undangan)
2. Tab **Content** → aktifkan **Tampilkan Heading 2** dan **Tampilkan
   Supporting Text 2**, isi teksnya
3. Klik **Preview**

| Yang benar | Yang salah |
|---|---|
| kedua teks tampil di preview, di antara kalimat pengundang dan tombol | tampil saat mengedit, hilang saat dipreview |

- [ ] Ubah juga **ukuran** dan **warna** keduanya → ikut berubah di preview
- [ ] IV.5 selesai

## IV.6 — Animasi Layer Background

Ini yang paling sering tampak "tidak berfungsi" padahal sebenarnya tiga hal
berbeda. Uji berurutan.

1. Pilih canvas, tab **Style** → **Layer 2 dan seterusnya** → **Tambah
   layer**, unggah sebuah gambar
2. Tab **Advanced** → **Animasi Layer Background**
3. Efek **Melayang**, **Durasi siklus 3s**

> Mulai dari 3s, **bukan 20s**. Slider itu durasi: makin ke kanan makin
> **lambat**. Pada 20s dengan efek Bergoyang (rotasi ±3°), gerakannya nyaris
> tidak terlihat walaupun berjalan normal.

| Yang benar | Yang salah |
|---|---|
| layer dan background utama bergerak perlahan | diam total |
| tepi canvas tetap rapat saat layer bergeser | muncul celah di tepi |
| skala layer tetap seperti yang disetel | layer tiba-tiba kembali 100% |

- [ ] Panel **Layer 2 dan seterusnya** menampilkan baris
      `Animasi aktif: Melayang · 3s — Berlaku untuk Layer 1 dan seluruh
      layer di bawah ini sekaligus`
- [ ] IV.6 selesai

## IV.7 — Animasi pada canvas selain Canvas 1

Ini kasus yang dulu membuat IV.6 tetap terlihat gagal walau mekanismenya
sudah benar.

1. Buka **Canvas 2** (atau canvas mana pun selain yang pertama)
2. Tab **Advanced** → **Animasi Layer Background** → **Melayang**, **3s**

| Yang benar | Yang salah |
|---|---|
| canvas itu ikut bergerak | hanya Canvas 1 yang bergerak, canvas ini diam padahal panelnya sudah "Melayang" |

> Penyebab lamanya: saat **Background global** aktif, nilai animasi diambil
> paksa dari Canvas 1. Pilihan di canvas lain tersimpan dan tampil di panel,
> tapi tidak pernah dipakai. Sekarang nilai canvas menang bila diisi, dan
> nilai Canvas 1 jadi cadangan.

- [ ] IV.7 selesai

## IV.8 — Kalau semuanya diam

Satu kemungkinan terakhir yang bukan bug aplikasi:

| Sistem | Periksa |
|---|---|
| Windows | Settings → Accessibility → Visual effects → **Animation effects** harus **On** |
| macOS | System Settings → Accessibility → Display → **Reduce motion** harus **off** |

Kalau mati, browser melaporkan `prefers-reduced-motion: reduce` dan seluruh
animasi loop dimatikan **dengan sengaja** oleh stylesheet.

## IV.9 — Retest QA 15 Oktober 2026

Satu baris per temuan. Kolom kanan adalah gejala lama — kalau masih
terlihat, perbaikannya belum terpasang (ulangi I.0).

| Temuan | Cara uji | Benar | Gejala lama |
|---|---|---|---|
| **A4** musik | Preview → putar musik → pindah ke tab lain → kembali | diam selama di tab lain, lanjut dari detik yang sama | tetap berbunyi di belakang |
| **QC** preview blank | Templates & Approval → **Template pada website** | card menampilkan cover/isi canvas | kotak krem kosong |
| **QC** pita abu | card yang sama | tidak ada tulisan besar "… - Preview Canvas 01" | pita abu besar di bawah gambar |
| **TC-205** | ornamen gambar di **Kiri atas**, ukuran berapa pun | menempel rapat di pojok | sisa celah kecil |
| **TC-221** | mode **Mobile**, ubah ukuran ornamen 120 → 400 | tetap di pojok | makin besar makin ke tengah |
| **TC-206** | ornamen → **Geser X / Geser Y** | bergeser halus dari titik tambat | tidak ada kontrol |
| **TC-209** | ikon **duplikat** di kepala ornamen | salinan lengkap muncul tepat di bawahnya | tidak ada |
| **TC-210** | **Posisi** → Atas/Bawah tengah, Kiri/Kanan tengah | menempel di tengah sisi | hanya 4 pojok |
| **TC-214** | rapikan ornamen di Desktop → pindah **Mobile** → ubah ornamen → kembali Desktop | Desktop tidak berubah | Desktop ikut rusak |
| **TC-214** | di mode Mobile, tambah fitur baru | muncul di Mobile saja + pesan "Ditambahkan khusus Mobile" | ikut muncul di Desktop |
| **TC-204** | upload background di **Main Canvas** (yang berisi Buka Undangan) → Preview → buka undangan | tidak ada slide background kosong | slide berisi background saja |
| **TC-197** | Page Structure → **Background tetap** ON → Preview → scroll | background diam, isi bergulir di atasnya | background ikut bergulir |
| **TC-216** | Preview Desktop di layar lebar | selebar canvas editor, kiri-kanan kosong; header menyebut lebarnya | dibentangkan selebar layar |
| **Credit** | tulis ucapan → pilih lagu | ucapan tetap; judul lagu tampil di baris lagu | ucapan tertimpa judul lagu |
| **Credit** | **Upload Sound** dari fitur Credit | lagu tersimpan & bisa diputar | tidak terjadi apa-apa |
| **VN 6** | Templates & Approval | filter "Published & Pending" aktif; nama pengaju tampil; 8 kartu per halaman | semua status bercampur, tanpa halaman |
| **VN 6** | Takedown satu template | kartu hilang dari tampilan bawaan, ada di filter **Takedown** | kartu tetap di daftar |
| **VN 7** | lihat sidebar sebagai Admin | kelompok Desain → Layanan → Administrasi | urutan campur |

> **Background tetap** memakai `position: sticky`, bukan
> `background-attachment: fixed` seperti sebelumnya — yang terakhir itu
> tidak bekerja di Safari iOS dan sengaja dimatikan di Preview. Uji juga di
> **HP sungguhan**; justru di sanalah versi lama gagal.

> **TC-214 — sengaja tidak dipisah total** (keputusan 15 Oktober). Struktur
> canvas tetap satu; yang dipisah per device adalah ornamen, layer, teks,
> dan background. Fitur yang ditambah dari mode Mobile lahir tersembunyi di
> Desktop; munculkan lewat tab **Style → Sembunyikan di desktop**.

### Lanjutan 15 Oktober — item yang sebelumnya belum dikerjakan

| Temuan | Cara uji | Benar | Gejala lama |
|---|---|---|---|
| **Gambar** ukuran teks | fitur Image/Video/Gallery → tab **Style** | ada ukuran header & supporting | tidak ada |
| **Lokasi** tombol | fitur Location → **Ikon** & label; fitur Event → tombol lokasi | teks & ikon (Pin/Navigasi/Peta/Link/tanpa ikon) berubah | selalu "Buka Google Maps" + pin |
| **Credited by** | fitur Credit → ukuran teks, warna teks/latar/border | berubah sesuai pilihan | warna & ukuran tetap |
| **Galeri** non-grid | Carousel/Filmstrip/Slideshow → **Tampilkan gambar utuh**, atau **Titik fokus** per gambar | gambar utuh / bagian penting tidak terpotong | selalu terpotong di tengah |
| **Undo** | edit judul → klik di luar → tunggu "Autosaved" → **Undo sekali** | judul langsung kembali | undo pertama "tidak terjadi apa-apa" |
| **MoM A3** label | lihat header editor, topbar, sidebar | "Template · diedit oleh *nama akun*", email akun | "Template workspace · no public URL", "ikrarku Workspace" |
| **QC #2** preview berat | Templates & Approval → Preview → Buka Undangan → scroll | scroll mulus, tidak tersendat tiap ±10 detik | tersendat; latar belakang buram |
| **Serein** | Page Structure → **Tata letak desktop: Kolom** → Preview Desktop | isi versi Mobile di kolom ±430 px, background memenuhi layar dan diam | isi selalu selebar layar |
| **MoM A7** harga | login Web Designer → buat template | tidak ada isian harga ("Ditetapkan Administrator") | Web Designer menentukan harga |
| **MoM A7** harga | Admin → Templates & Approval → **Tetapkan/Ubah harga** di kartu | harga tersimpan saat itu juga; approve tanpa harga ditolak | harus lewat editor/approval |
| **MoM A6** akun | Admin/CS → Orders → order lunas tanpa akun → **Buat akun customer** | akun dibuat; tautan buat password (72 jam) masuk chat & email; **Salin tautan** | customer harus daftar sendiri |
| **MoM A8** round-robin | 11 order lunas dengan 2 Web Designer | masing-masing maks 5 aktif; order ke-11 berstatus "Paid - Antre Web Designer"; begitu satu task Done, langsung ditugaskan | pembuat template selalu didahulukan, tanpa batas |
| **MoM A9** notifikasi | Web Designer simpan website customer → login customer | banner "*nama* (Web Designer) sedang membantu mengedit…"; satu pesan chat (maks sekali per 6 jam) | customer tidak tahu |

> **Tata letak Kolom**: di mode Desktop + Kolom, editor menampilkan dan
> **mengedit versi Mobile** (ada banner pengingat). Background di luar kolom
> = gambar khusus yang diunggah di panel itu, atau background Canvas 1 versi
> Desktop bila tidak ada.

> **A8 — batas bisa diubah** lewat `EDITOR_ACTIVE_ORDER_LIMIT` di `.env`
> (bawaan 5). Customer yang sudah punya Web Designer tetap ke orang yang sama
> selama kuotanya belum penuh.

> **A6 — staff tidak pernah memegang password.** Yang dikirim hanya tautan
> sekali pakai; customer membuat password sendiri.

### QA 17 Oktober — file UPDATE_QA_IKRARKU.ID_9 (TC-204 s/d TC-221)

Ke-18 TC berstatus Fail sudah diisi **Done · 17/10/2026** di kolom
*Update Web Dev*. Yang baru di batch ini:

| TC | Cara uji | Benar | Gejala lama |
|---|---|---|---|
| **TC-216/217** | canvas dengan layer & ornamen → bandingkan editor dengan Preview (Desktop & Mobile) | posisi layer & ornamen bawah sama | di editor canvas lebih tinggi ±19 px per fitur, layer bergeser |
| **TC-217** | sedang di mode **Mobile** → klik Preview | Preview langsung tampil Mobile | selalu terbuka Desktop |
| **TC-218** | mode Mobile → upload foto > 1 MB, lalu pilih foto yang sama lagi | dikompres otomatis & tersimpan; pilihan berulang tetap diproses | ditolak, lalu pilihan berikutnya tidak bereaksi sama sekali |
| **TC-219** | 8–10 perubahan → Undo satu per satu → Redo | tiap Undo mundur tepat satu langkah; angka di tombol Undo = langkah tersedia (maks 30) | kadang melompat/macet, batas tidak jelas |
| **TC-208** | Event/Location → **Ukuran tombol**, **Ukuran ikon** | tombol & ikon membesar/mengecil | tidak ada |
| **TC-212** | Wedding Gift → **Tampilan logo bank** | bentuk, ukuran, posisi, warna berubah | logo selalu kapsul hijau |
| **TC-213** | Credit → **Elemen musik** & **Gaya teks credit** | ikon/ukuran/warna musik & gaya teks berubah | default |

> **TC-216/217 — satu perbedaan yang memang disengaja:** fitur *Buka
> Undangan* yang diletakkan **di canvas yang sama** dengan fitur lain tampil
> di editor, tetapi di Preview menjadi layar pembuka terpisah. Letakkan
> Buka Undangan di canvas sendiri (Main Canvas) agar tinggi canvas lain
> identik.


### QA 21 Oktober — file UPDATE_QA_IKRARKU.ID_10 (TC-212 s/d TC-246)

Ke-27 TC berstatus Fail sudah diisi **Done · 21/10/2026**. TC-212, 216, 225,
dan 227 sudah selesai di batch sebelumnya (logo bank, preview, round-robin
A8, harga admin A7); sisanya baru:

| TC | Cara uji | Benar |
|---|---|---|
| **TC-245** | checkout template **tanpa daftar** → bayar | akun dibuat otomatis; email "Akun ikrarku Anda sudah siap" berisi username + password sementara; login pertama wajib membuat password baru |
| **TC-232** | kirim 5+ ucapan di undangan | semua tampil (scroll atau per halaman), yang lama tidak hilang |
| **TC-222** | My Order | billing tampil vertikal |
| **TC-223/224** | login customer → editor & Templates | tombol **Hubungi Support** membuka chat; katalog template lain di dashboard |
| **TC-226** | catatan internal dari Web Designer, dibuka CS | nama & role pengirim di setiap catatan |
| **TC-228** | Save The Date → Ukuran kotak waktu | kotak & angka ikut membesar/mengecil |
| **TC-229/230** | Gallery → tinggi/jarak gambar; Gallery Layout Style | tinggi bisa otomatis/tetap; Carousel & Filmstrip ada di picker |
| **TC-231** | Style → Transparansi warna/gambar background & kotak putih | transparansi berubah per fitur & per canvas |
| **TC-233** | Typography → Font heading / Font teks | font berganti (Google Fonts dimuat otomatis) |
| **TC-234** | Credit → *Tempel di paling bawah* | credit di akhir undangan tanpa ruang kosong |
| **TC-235** | Feature Library → **Live Streaming** | tautan YouTube diputar di undangan; IG/Zoom/Meet jadi tombol *Tonton Live* |
| **TC-236** | Save The Date/Event → tanggal acara | tombol Google Calendar & unduh .ics |
| **TC-237** | Buka Undangan → Style → **Mode button: Button slide** | tamu menggeser tombol untuk membuka |
| **TC-238** | Icon → Teks pendamping | teks di bawah/samping icon, ukuran bisa diatur |
| **TC-239** | pilih fitur → Advanced → **Live Motion Elemen (Layer 2)** | image, kotak putih, header, text bergerak terpisah |
| **TC-240/241** | Wedding Gift → *Box alamat pengiriman kado*, *Mode tampilan: Ringkas* | hanya header, teks, tombol **Lihat Rekening**; diklik → rekening + alamat kado (bisa disalin) |
| **TC-242** | Page Structure → Tata letak desktop **Kolom** → Rasio **70/30** | sisi 70% berisi warna/gambar, header, supporting text, slideshow *Our Image* otomatis, atau video |
| **TC-243** | pilih canvas → Style → **Layer 1 (default)** | tombol *Upload Video Layer 1* |
| **TC-244** | Preview Desktop di layar kecil & besar | selebar layar laptop, tanpa ruang abu-abu: tata letak Kolom/70-30 dirender apa adanya; desain penuh diskalakan pas lebar layar |
| **TC-246** | landing page → tombol **ID / EN** | seluruh teks landing berganti bahasa; pilihan diingat |

> **TC-245 menggantikan alur lama "daftar dulu sebelum bayar" (TC-072).**
> Tombol A6 di Orders tetap ada untuk mengirim ulang tautan buat password.
> **TC-237** ditafsirkan sebagai tombol *geser untuk membuka* pada Buka
> Undangan. **TC-242:** kolom isi minimal 360 px, jadi pada layar/preview
> sempit rasionya mendekati 62/38.
>
> **Revisi 21 Okt (Live Preview):** Mobile tidak lagi menampilkan pita putih
> di atas saat di-scroll — penyebabnya padding 22 px di kontainer gulir yang
> membuat background tetap menempel 22 px di bawah tepi atas.

### Revisi 22 Oktober — color picker, 70/30, bottom navigation

| Fitur | Cara uji | Benar |
|---|---|---|
| **Color picker** (semua) | pilih warna → klik ↺ | swatch kembali ke *Tidak ada warna* (kotak-kotak, garis merah). Warna isian punya tombol ⦸ *Tanpa warna (transparan)* |
| **70/30** | Tata letak Kolom → Rasio 70/30 | Posisi kolom hanya Kanan/Kiri; *Isi sisi visual* hanya muncul di 70/30; upload slideshow/video mengosongkan Warna background desktop |
| **Bottom navigation** | Page Structure → *Bottom navigation bar* → centang column/feature (maks 5), pilih style | bar tampil di undangan (Mobile saja / Mobile & Desktop), klik menu menggulir ke column-nya, menu aktif mengikuti scroll |
| **Ikon menu sendiri** | pada menu yang dicentang → *Upload ikon* (PNG/JPG/WebP, maks 512 KB) | ikon hasil upload menggantikan ikon bawaan; *Pakai ikon bawaan* mengembalikannya |

> Warna teks fitur yang sama dengan bawaan tidak lagi disimpan, jadi picker-nya
> tampil *Tidak ada warna*; tampilan undangan tidak berubah.

### Revisi 24 Oktober — header landing, preview template, sampul template

| Fitur | Cara uji | Benar |
|---|---|---|
| **Header landing** | buka landing (desktop & HP) | pilihan **ID/EN**, tombol **Masuk** berbingkai, dan **Temukan desain** satu baris sejajar logo & menu. Di HP pilihan bahasa ada di dalam menu ☰ dengan tombol 48 px |
| **Preview template (landing)** | Temukan desain → pilih template → Preview → Desktop | selebar layar, tanpa ruang kosong kiri-kanan |
| **Safe Preview (ikon mata)** | Templates → arahkan ke kartu → ikon mata | sama dengan Template Preview: dialog di tengah, Desktop/Mobile, bisa di-scroll |
| **Sampul tanpa gambar sample** | template baru tanpa upload *Gambar sample* | sampul warna aksen (kategori, nama, harga) + label *Belum ada gambar sample*, bukan foto contoh |
| **Preview: layar Buka Undangan** | Preview Desktop di laptop | layar pembuka setinggi kotak preview, tanpa sisa latar abu-abu di bawahnya. Di layar rendah (mis. 1366×768) isi cover yang diperbesar bisa digulir di dalam kotak |
| **Preview tidak gerak-gerak** | buka Template Preview / Live Preview, diamkan beberapa detik | skala tetap, tidak ada scrollbar horizontal dan tidak bergantian membesar-mengecil |
| **Drag & drop feature** | Page Structure → tarik ikon ⋮⋮ feature ke atas feature lain / ke column lain; atau tarik blok di canvas | garis hijau menandai posisi; feature pindah ke posisi itu (bukan selalu ke paling bawah) |
| **Button slide di kolom sempit** | Buka Undangan mode Button slide + tata letak 70/30 → Preview | slider utuh di dalam kolom (maks 320 px), bisa digeser sampai ujung |
| **Kartu desain publik** | Buka `/` atau `/desain`, lihat kartu template tanpa sample image | tidak ada label "Canvas 01 · actual saved preview"; canvas memenuhi kartu 4:5 |
| **Cover Buka Undangan di tata letak Kolom / 70/30** | Edit judul & background cover (tersimpan sebagai versi Mobile) → Preview Desktop | Preview & undangan live menampilkan isi yang sama dengan editor, bukan nilai bawaan |

> Gambar contoh Chyntia & Rian dulu dipasang otomatis ke **semua** template
> tanpa gambar setiap server start. Kini hanya untuk tiga template contoh
> bawaan; template lain yang terlanjur memakainya dibersihkan otomatis saat
> deploy berikutnya.

### QA 26 Oktober — file UPDATE_QA_IKRARKU.ID_11 (TC-247 s/d TC-277)

| TC | Cara uji | Benar |
|---|---|---|
| **TC-247 / 251 / 261 / 271** | tata letak 70/30 → bandingkan canvas editor dengan Live Preview | sisi 30% ditata selebar Mobile (390 px) lalu diskalakan: tinggi section, crop layer, dan ukuran ornamen sama persis di editor, preview, dan Mobile |
| **TC-248** | kolom lebar tetap (px), posisi kanan/kiri | kolom menempel ke pojok layar, tanpa sisa background di sisi luar |
| **TC-249** | Page Structure → Isi sisi visual | font, ukuran, warna header & supporting text, header bold |
| **TC-250 / 272** | ornamen + layer di canvas Buka Undangan → Preview | ornamen & layer tampil di layar cover; fitur yang disembunyikan untuk device aktif tetap terlihat transparan di canvas editor (label *Disembunyikan di …*) |
| **TC-252** | ornamen *Atas tengah* yang lebih lebar dari kolom | tetap tepat di tengah |
| **TC-253** | Buka Undangan → Style | *Ukuran teks button*; default lebih kecil; editor = preview |
| **TC-254** | Background tetap aktif → Canvas 1 → layer | sakelar *Ikut Background tetap* (default mati: bingkai tidak dobel) |
| **TC-255** | duplicate canvas berlayer | layer & ornamen salinan ber-id baru; layer yang ikut backdrop tidak disalin |
| **TC-256 / 268** | layer → Padding/Margin, Transparansi dalam bingkai | gambar tidak terpotong; bagian dalam bingkai transparan |
| **TC-257 / 258 / 262** | Advanced → padding 0 / *Tempel antar fitur* | isi menempel ke tepi; fitur menyatu atas-bawah |
| **TC-259** | Save The Date → *Header kecil* | bisa disembunyikan, diganti teks, warna, ukuran |
| **TC-260** | ikon pensil di samping nama template (topbar) → Save | nama template berubah |
| **TC-263 / 264** | Wedding Gift ringkas | *Jarak tombol dari teks*; teks tombol tepat di tengah |
| **TC-265..267 / 276** | Greetings → Style → *Kolom Ucapan*; tombol **B Header** | font, ukuran, latar kotak ucapan; header bisa bold |
| **TC-269 / 273** | Credit di canvas terakhir berlayer → Preview | credit di dalam canvas terakhir, di atas layer-nya, tanpa space kosong |
| **TC-270** | Templates → Preview → Mobile, Background tetap | background tetap diam saat digulir |
| **TC-274 / 275** | Text → *Titik peletakan*; **B Header** / **B Teks** | atas/tengah/bawah canvas; bold header & teks terpisah |
| **TC-277** | halaman detail template → *Bagikan Template* | link `/templates?t=<id>` disalin/dibagikan dan membuka template itu langsung |

### Revisi 27 Oktober — layar Buka Undangan = canvas editor

| Fitur | Cara uji | Benar |
|---|---|---|
| **Layar cover** | edit canvas cover (layer, ornamen, teks) → Preview / Preview Template / undangan live | tampilan sama dengan canvas editor: teks di atas layer, urutan lapisan & posisi sama. Tombol membuka undangan |
| **Tanpa ruang kosong** | Preview → buka undangan → gulir sampai bawah | canvas terakhir langsung berakhir di dasar; player musik melayang di atas canvas, tidak menambah ruang |
| **Revisi template live** | Web Designer edit template Published (mis. tambah ornamen) → Save Template Draft | kartu menampilkan *Revisi menunggu approval*; landing masih versi lama sampai Administrator klik **Approve revisi** di kartu (atau di Tasks & Tickets) |

### QA 29 Oktober — file UPDATE_QA_IKRARKU.ID_12 (pending)

| TC / fitur | Cara uji | Benar |
|---|---|---|
| **Pembayaran Mayar semua template** | checkout beberapa template berbeda, nomor HP format apa pun (+62 / 62 / 08, dengan spasi atau tanda hubung) | semua diarahkan ke halaman Mayar. Bila Mayar menolak, alasannya tampil tetap di halaman checkout dan tercatat di log `[mayar]` |
| **Akad & Resepsi** | fitur Event → Content → *Isi contoh Akad & Resepsi* / *Tambah acara* | tiap acara: nama, tanggal, jam, tempat, alamat, tombol Simpan Tanggal & Navigasi Map; tata letak bertumpuk atau berdampingan, garis pemisah |
| **TC-250** | Web Designer edit template Published → Save → Admin *Approve revisi* | ornamen tampil di preview publik setelah revisi disetujui |
| **TC-270** | Templates & Approval / Tasks / Safe Preview → Mobile → scroll | background tetap menempel penuh dari atas, tanpa pita kosong |
| **TC-274** | Text → Content atau Style → *Posisi teks di section* | teks pindah ke atas/tengah/bawah section; fitur lain di kolom tetap |
| **TC-073** | isi SMTP di `.env.staging` → `node scripts/smtp-check.mjs email@anda` → sign up | email verifikasi masuk; email yang tertahan sebelum SMTP diisi dikirim ulang saat server menyala |
| **TC-157** | Tasks & Tickets → kartu tiket → *Diskusi internal CS & Web Designer* | catatan terlihat di tiket CS, tiket Web Designer, dan Support Inbox; tidak terlihat customer |
| **TC-167** | checkout tanpa bayar | order hanya ada di Orders & Revenue; tiket baru muncul setelah lunas |
| **TC-169** | ubah status tiket → Save Status | pesan otomatis di live chat customer; status Done juga mengirim email (butuh SMTP) |
| **Status bayar Mayar otomatis** | bayar lewat link email Mayar → buka My Order | status jadi *Lunas* tanpa menunggu webhook: dicek ke Mayar saat My Order dibuka, tiap 20 detik, lewat tombol *Cek status pembayaran*, dan oleh server tiap 2 menit (`MAYAR_RECONCILE_MS`). Order belum lunas menampilkan catatan "Belum dibayar? Silakan cek email …" |
---

# Ringkasan perintah harian

```bash
# — di laptop —
npm run check && npm run qa:integration && npm run qa:layout
git add -A && git commit -m "..." && git push

# — di VPS —
ssh root@srv1890813
cd /opt/ikrarku
./deploy/scripts/backup-staging.sh
git pull
docker compose -f docker-compose.staging.yml up -d --build --remove-orphans
docker compose -f docker-compose.staging.yml ps

# — bukti kode baru benar-benar jalan —
curl -s -o /dev/null -w '%{content_type}\n' https://dev.ikrarku.id/robots.txt
#   text/plain  = kode terbaru sudah jalan
#   text/html   = container masih image lama, ulangi build

# — di browser —
# https://dev.ikrarku.id lalu Ctrl+Shift+R, lalu Bagian IV
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

7. Mengganti slug tapi **judulnya masih satu huruf** — memindahkan masalah
8. **Excerpt kosong** — itu yang jadi meta description
9. Mendaftarkan **staging** ke Search Console
10. Menghapus pengalihan `/jurnal/<slug>` karena dikira sisa kode lama —
    itu yang menjaga tautan lama tetap hidup
11. Mencari artikel di `/jurnal/<slug>`. Daftar di `/jurnal`, artikel di
    `/articles/<slug>` — dua alamat yang sengaja berbeda

**Mayar**

12. **API key terpotong** saat disalin
13. **Key Read Only** — gagal baru saat pelanggan menekan Bayar
14. Webhook **tanpa `?token=`**, atau tidak didaftarkan sama sekali
15. `CLIENT_ORIGIN` masih `localhost`
16. Menyunting `.env.staging` lalu mengira nilainya langsung berlaku.
    `up -d --build` dengan layer `CACHED` bisa tidak membuat ulang
    container — buktikan dengan `exec`, lihat III.6
17. Mengira transaksi uji aman karena "ini staging". Key-nya **produksi**,
    uangnya **nyata** — nominal terkecil, lalu refund
18. Membaca `502` di Console lalu langsung menyalahkan Nginx. Aplikasi ini
    **juga** menjawab `502` saat Mayar menolak tagihan. Yang membedakan ada
    di tab **Response**: JSON berarti aplikasi, HTML berarti Nginx —
    lihat III.7a

**Editor**

19. Menyetel **Durasi siklus 20s** lalu menyimpulkan animasinya rusak.
    Slider itu durasi: makin ke kanan makin **lambat**. Mulai dari 3s.
20. Menyetel animasi di **Canvas 2+** saat Background global aktif, pada
    versi sebelum perbaikan — nilainya tersimpan tapi diambil paksa dari
    Canvas 1
21. Menyimpulkan animasi rusak padahal **Reduce motion** menyala di sistem

**Shell**

22. Memakai `${VAR:0:6}` di dalam `docker compose exec ... sh -c`. `sh` di
    image itu **dash**, bukan bash: jawabannya `Bad substitution` dan
    barisnya hilang tanpa jejak. Pakai `cut -c1-6` atau `md5sum`.
23. Mengetik placeholder apa adanya — `curl .../articles/<slug>` membuat
    bash menjawab `syntax error near unexpected token`, karena `<` dibaca
    sebagai redirect berkas. Ganti dulu dengan nilai sebenarnya, tanpa
    tanda `< >`.

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
- [docs/Laporan_Retest_QA_TC186-TC203.docx](docs/Laporan_Retest_QA_TC186-TC203.docx) — hasil retest 18 test case, untuk QA
- [docs/Laporan_Teknis_Developer_TC186-TC203.docx](docs/Laporan_Teknis_Developer_TC186-TC203.docx) — akar masalah & utang teknis, untuk developer
- [docs/Laporan_Retest_Lanjutan_4_Temuan.docx](docs/Laporan_Retest_Lanjutan_4_Temuan.docx) — empat temuan lanjutan, dasar Bagian IV
