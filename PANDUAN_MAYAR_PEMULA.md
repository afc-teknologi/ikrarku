# Panduan Mayar untuk Pemula

Panduan langkah demi langkah menyambungkan pembayaran Mayar ke ikrarku Sites.
Ditulis untuk yang baru pertama kali melakukannya.

Versi ringkas untuk yang sudah paham: [DEPLOY_MAYAR.md](DEPLOY_MAYAR.md).

**Perkiraan waktu:** 30 menit kerja Anda, ditambah menunggu balasan pemegang
akun Mayar.

---

## Sebelum mulai: 6 istilah yang akan sering muncul

| Istilah | Artinya |
|---|---|
| **Mayar** | Layanan pihak ketiga yang menerima uang dari pelanggan (QRIS, transfer, e-wallet), lalu memberi tahu sistem kita bahwa pembayaran sudah masuk. |
| **API key** | Kata sandi panjang agar sistem kita boleh bicara dengan Mayar. Bentuknya seperti `eyJhbGci...` sepanjang ratusan karakter. **Rahasia** — diperlakukan seperti password. |
| **Webhook** | Panggilan balik dari Mayar ke sistem kita, isinya: *"Order ini sudah dibayar."* Tanpa ini, kita tidak akan pernah tahu pelanggan sudah bayar. |
| **Sandbox** | Mode latihan. Uangnya tidak nyata. Selalu uji di sini dulu. |
| **Produksi** | Mode sungguhan. Uangnya nyata. |
| **`.env.staging`** | File berisi pengaturan rahasia di server. Tidak ikut masuk GitHub. Nama ini dipakai oleh `docker-compose.staging.yml`. |

### Alur uangnya seperti ini

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

Dua panah bertanda itu yang harus disiapkan. **Kalau webhook tidak
disiapkan, uang tetap masuk ke Mayar tapi order akan macet di `Pending`
selamanya** — pelanggan sudah bayar, sistem menganggap belum.

---

## LANGKAH 1 — Pahami posisi Anda sekarang

Jawab satu pertanyaan: **apakah Anda bisa login ke dashboard Mayar?**

- **Bisa** → kerjakan semua langkah di bawah sendiri.
- **Tidak bisa, hanya dititipi API key** → Anda tetap bisa mengerjakan
  Langkah 2–5. Langkah 6 wajib dibantu pemegang akun.

> Situasi "hanya dititipi key" itu normal dan tidak menghalangi Anda memulai.

---

## LANGKAH 2 — Siapkan file `.env.staging` di server

Masuk ke server lewat SSH:

```bash
ssh root@srv1890813
cd /opt/ikrarku
```

Buka file pengaturan. Di VPS, compose memakai `.env.staging` (bukan `.env`):

```bash
nano .env.staging
```

Pastikan baris-baris berikut ada. Kalau belum ada, tambahkan di baris baru:

```env
PAYMENT_MODE=simulation

MAYAR_API_KEY=
MAYAR_API_BASE=https://api.mayar.id/hl/v1
MAYAR_WEBHOOK_TOKEN=
MAYAR_INVOICE_EXPIRY_HOURS=24

CLIENT_ORIGIN=https://dev.ikrarku.id
PUBLIC_BASE_URL=https://dev.ikrarku.id
```

Penjelasan tiap baris:

| Baris | Diisi apa |
|---|---|
| `PAYMENT_MODE` | **Biarkan `simulation` dulu.** Baru diganti `mayar` di Langkah 8. |
| `MAYAR_API_KEY` | Kosongkan dulu, diisi di Langkah 3. |
| `MAYAR_API_BASE` | Alamat server Mayar. Biarkan dulu, mungkin berubah di Langkah 5. |
| `MAYAR_WEBHOOK_TOKEN` | Diisi di Langkah 4. |
| `MAYAR_INVOICE_EXPIRY_HOURS` | Tagihan hangus setelah sekian jam. 24 sudah wajar. |
| `CLIENT_ORIGIN` | Alamat situs Anda. **Tidak boleh `localhost`.** |
| `PUBLIC_BASE_URL` | Sama dengan di atas. |

Simpan: tekan `Ctrl+O`, `Enter`, lalu `Ctrl+X`.

> **Kenapa `simulation` dulu?** Supaya alur pemesanan tetap bisa dites tanpa
> risiko ada order nyata yang macet. Tidak ada yang rusak selama mode ini.

- [ ] Langkah 2 selesai

---

## LANGKAH 3 — Dapatkan API key yang utuh

### Kalau Anda punya akses dashboard

1. Buka `web.mayar.id/api-keys` (produksi) atau `web.mayar.io/api-keys` (sandbox)
2. Buat key baru
3. Pilih permission **Read & Write** — **bukan** Read Only
4. Salin nilainya

> **Kenapa harus Read & Write?** Membuat tagihan itu operasi "tulis".
> Key *Read Only* hanya boleh membaca. Kalau salah pilih, semuanya akan
> tampak normal sampai pelanggan menekan tombol Bayar — baru di situ gagal.

### Kalau Anda hanya dititipi key

Minta nilai **utuhnya**. API key Mayar itu panjang sekali dan punya **tiga
bagian dipisah titik**:

```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtcmNfMTIzIiwibmFtZSI6...  .Xk9fL2p...
└──── bagian 1 ────┘ └──────────── bagian 2 ────────────┘ └─ bagian 3 ─┘
```

Kalau yang Anda terima cuma sependek `eyJhbGciOiJSU`, itu **terpotong** —
baru potongan awal bagian 1, belum ada isinya. Minta ulang.

### Masukkan ke `.env.staging`

```bash
nano .env.staging
```

Isi barisnya, tanpa tanda kutip:

```env
MAYAR_API_KEY=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOi...
```

- [ ] Langkah 3 selesai

---

## LANGKAH 4 — Buat token webhook

Token ini **Anda yang karang sendiri**, bukan dari Mayar. Fungsinya memastikan
yang menghubungi sistem kita benar-benar Mayar, bukan orang iseng.

Buat yang acak dan panjang:

```bash
openssl rand -hex 24
```

Akan keluar seperti:

```
7f3a9c2e4b8d1f60a5c7e9b2d4f6a8c0e2b4d6f8a0c2e4b6
```

Salin, lalu masukkan ke `.env.staging`:

```env
MAYAR_WEBHOOK_TOKEN=7f3a9c2e4b8d1f60a5c7e9b2d4f6a8c0e2b4d6f8a0c2e4b6
```

> Jangan memakai kata yang mudah ditebak seperti `rahasia123`. Mayar **tidak
> menandatangani** panggilan webhook-nya, jadi token ini satu-satunya
> pengaman.

Simpan file, lalu jalankan ulang aplikasi:

```bash
docker compose up -d --build
```

- [ ] Langkah 4 selesai

---

## LANGKAH 5 — Cek key Anda (tanpa menyentuh uang)

Ini bagian yang menghemat banyak waktu. Jalankan **di server**:

```bash
cd /opt/ikrarku
npm run mayar:check
```

Perintah ini **tidak membuat transaksi apa pun**. API key Anda tidak dicetak
ke layar.

### Membaca hasilnya

Ada tiga penanda:

| Penanda | Artinya |
|---|---|
| `OK` | beres |
| `CEK` | perlu diperhatikan, belum tentu masalah |
| `GAGAL` | harus dibereskan |

### Yang akan diperiksa

**Bagian 2 — isi key.** Menampilkan key ini milik akun siapa dan terikat
domain apa. Kalau domainnya berbeda dengan `dev.ikrarku.id`, akan muncul
peringatan — Mayar mewajibkan key baru bila domain berubah.

**Bagian 3b — key ini produksi atau sandbox?** Key yang sama dicoba ke tiga
alamat Mayar. Yang menjawab berhasil, itulah environment key Anda.

> Berguna sekali kalau Anda tidak tahu key titipan itu untuk apa. Kalau
> hasilnya bilang `MAYAR_API_BASE` tidak cocok, sesuaikan baris itu di
> `.env.staging` mengikuti saran yang ditampilkan.

**Bagian 4 — apakah key bisa membuat tagihan?** Kalau muncul:

```
GAGAL Ditolak (403). Kemungkinan besar key ini Read Only
```

artinya key-nya tidak boleh menulis. Harus minta key Read & Write.

**Bagian 5 — webhook.** Memastikan alamat webhook bisa dijangkau dan
tokennya cocok.

### Kalau semua bilang "tidak terjangkau"

```
GAGAL Tidak satu pun domain Mayar terjangkau dari sini — ini masalah
      jaringan, BUKAN bukti key salah.
```

Berarti Anda menjalankannya bukan di server, atau firewall memblokir.
Jalankan ulang di dalam VPS.

- [ ] Langkah 5 selesai, semua `GAGAL` sudah dibereskan

---

## LANGKAH 6 — Daftarkan webhook di dashboard Mayar

**Ini langkah yang paling sering terlewat, dan akibatnya paling fatal.**

Di dashboard Mayar, isi alamat webhook **lengkap dengan `?token=`**:

```
https://dev.ikrarku.id/api/webhooks/mayar?token=7f3a9c2e4b8d1f60a5c7e9b2d4f6a8c0e2b4d6f8a0c2e4b6
```

Ganti bagian setelah `token=` dengan nilai dari Langkah 4.

> Tanpa `?token=`, sistem kita akan menolak semua panggilan Mayar.
> Tanpa didaftarkan sama sekali, pembayaran yang masuk tidak akan pernah
> terkonfirmasi — **order macet di `Pending` meskipun pelanggan sudah bayar.**

Sekalian pastikan di dashboard: metode pembayaran (QRIS / transfer /
e-wallet) sudah **aktif**.

### Kalau Anda tidak punya akses dashboard

Kirim pesan ini ke pemegang akun Mayar:

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

Kirim nilai `MAYAR_WEBHOOK_TOKEN` lewat jalur terpisah dari chat biasa.
Jangan pernah mengirim balik API key lewat kanal yang sama.

- [ ] Langkah 6 selesai

---

## LANGKAH 7 — Nyalakan mode Mayar

Baru dikerjakan setelah Langkah 5 bersih dan Langkah 6 selesai.

```bash
nano .env.staging
```

Ubah satu baris:

```env
PAYMENT_MODE=mayar
```

Simpan, lalu:

```bash
docker compose up -d --build
```

Jalankan pengecekan sekali lagi:

```bash
npm run mayar:check
```

- [ ] Langkah 7 selesai

---

## LANGKAH 8 — Transaksi uji (jangan dilewati)

Pakai **sandbox** dan nominal kecil.

1. Buka situs seperti pelanggan biasa
2. Buat pesanan baru
3. Klik **Bayar** → harus pindah ke halaman pembayaran Mayar
4. Selesaikan pembayaran
5. Buka workspace → menu **Orders**
6. **Pastikan status berubah dari `Pending` menjadi `Paid`**

Kalau sudah `Paid`, integrasi Anda benar-benar bekerja.

> Integrasi uang tidak layak dipercaya hanya karena pengecekan hijau.
> Langkah ini satu-satunya bukti nyata.

- [ ] Langkah 8 selesai, status jadi `Paid`

---

## Kalau macet di `Pending`

Lihat catatan sistem:

```bash
docker compose logs --tail=100 api | grep -i mayar
```

Cocokkan dengan tabel berikut:

| Yang terlihat | Artinya | Lakukan |
|---|---|---|
| **tidak ada tulisan apa pun** | Mayar tidak pernah menghubungi kita | Webhook belum didaftarkan, atau alamatnya salah. Ulangi Langkah 6. |
| `401` | token tidak cocok | Nilai `?token=` di dashboard berbeda dengan `MAYAR_WEBHOOK_TOKEN` di `.env.staging`. Samakan. |
| `503` | sistem belum siap | `PAYMENT_MODE` belum `mayar`, atau `MAYAR_WEBHOOK_TOKEN` kosong. Ulangi Langkah 7. |
| `Payment amount mismatch` | nominal tidak sama | Nominal tagihan Mayar berbeda dengan nominal order. |
| `order tidak cocok` | order tidak ditemukan | Salin isi catatan log, laporkan untuk ditelusuri. |

---

## Naik ke produksi

Hanya setelah Langkah 8 berhasil di sandbox.

- [ ] Ganti `MAYAR_API_KEY` dengan key **produksi**
- [ ] Sesuaikan `MAYAR_API_BASE` (jalankan `npm run mayar:check` untuk memastikan)
- [ ] Daftarkan ulang webhook di dashboard **produksi**
- [ ] `npm run mayar:check` sekali lagi
- [ ] Satu transaksi nyata nominal kecil, lalu refund

---

## Satu hal yang masih perlu dipastikan

Sistem ini memakai Mayar API **versi 1**. Ada dua tanda versi itu sudah usang:

1. Dokumentasi Mayar menyebut **V1 dihentikan 1 Oktober 2026** — sudah lewat
2. Aplikasi resmi Mayar sendiri sudah memakai **V2**

`npm run mayar:check` bagian 4 akan memberi tahu apakah V1 masih hidup untuk
akun Anda. Kalau hasilnya `404` atau `410`, **berhenti dulu** — perlu
penyesuaian kode ke V2, dan dokumentasi V2-nya harus diminta ke Mayar.

---

## Yang paling sering salah

1. **API key terpotong saat disalin** — harus panjang, tiga bagian dipisah titik
2. **Key Read Only** — baru ketahuan saat pelanggan menekan Bayar
3. **Webhook didaftarkan tanpa `?token=`** — semua panggilan ditolak
4. **Webhook tidak didaftarkan sama sekali** — order macet `Pending` selamanya
5. **`CLIENT_ORIGIN` masih `localhost`** — Mayar tidak bisa menghubungi kita
6. **Tertukar `.id` dan `.io`** — produksi dan sandbox itu dua akun berbeda
7. **Langsung produksi tanpa uji sandbox**

---

## Catatan keamanan

- **Jangan** mengirim API key lewat chat grup, atau menempelkannya ke
  dokumen bersama
- **Jangan** memasukkan API key ke dalam kode yang di-push ke GitHub
- File `.env.staging` sudah dikecualikan dari Git — isinya aman dari push
- Kalau key terlanjur tersebar, minta pemegang akun **mencabut dan
  membuat ulang**

---

## Kalau masih tersangkut

Siapkan tiga hal ini saat bertanya:

1. Output lengkap `npm run mayar:check` (aman dibagikan — key tidak dicetak)
2. Potongan log: `docker compose logs --tail=50 api | grep -i mayar`
3. Langkah ke berapa Anda berhenti

Referensi lengkap: [DEPLOY_MAYAR.md](DEPLOY_MAYAR.md)
