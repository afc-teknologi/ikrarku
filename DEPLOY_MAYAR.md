# ikrarku Sites — Checklist Integrasi Payment Gateway Mayar

Panduan menyambungkan ikrarku Sites ke [mayar.id](https://mayar.id).
Dibuat 11 Oktober 2026.

> Baru pertama kali menyambungkan payment gateway? Mulai dari
> [PANDUAN_MAYAR_PEMULA.md](PANDUAN_MAYAR_PEMULA.md) — langkah demi langkah
> dengan penjelasan istilah. Dokumen ini versi ringkasnya.

Kerjakan berurutan: **A → B → C → D**. Bagian **E** berisi risiko yang belum
terjawab dan harus dipastikan ke pihak Mayar sebelum produksi.

Alat bantu: `mayar:check` (lihat Bagian C1) memeriksa sebagian besar
poin di bawah secara otomatis, tanpa membuat transaksi apa pun.

---

## BAGIAN 0 — Kalau Anda tidak punya akses dashboard Mayar

Situasi yang umum: Anda hanya dititipi API key (mis. lewat file workspace
Altair `.agq`), sementara akun Mayar dipegang pihak lain.

### Yang TETAP bisa Anda kerjakan sendiri

| Bisa | Caranya |
|---|---|
| Memastikan key valid atau tidak | `mayar:check` |
| Tahu key ini **produksi atau sandbox** | `mayar:check` bagian 3b mencoba key yang sama ke ketiga domain Mayar |
| Tahu key **Read Only atau Read & Write** | `mayar:check` bagian 4 |
| Tahu key terikat **akun/domain mana** | `mayar:check` bagian 2, dibaca dari isi JWT |
| Tahu **V1 masih hidup atau tidak** | `mayar:check` bagian 4 |
| Seluruh Bagian B (konfigurasi VPS) | lihat di bawah |

Jalankan preflight lebih dulu — hasilnya menentukan apa yang perlu Anda
minta, sehingga tidak bolak-balik.

### Yang MUSTAHIL tanpa akses dashboard

1. **Membuat API key Read & Write** (A2)
2. **Mendaftarkan URL webhook** (A5) — tanpa ini pembayaran tidak akan
   pernah terkonfirmasi, dan order menggantung `Pending` selamanya
3. **Mengaktifkan metode pembayaran** (A4)

Ketiganya adalah penghambat keras. Tidak ada jalan memutar dari sisi kode.

### Permintaan siap kirim ke pemegang akun Mayar

> Halo, saya sedang menyambungkan ikrarku Sites ke Mayar. Ada 4 hal yang
> hanya bisa dilakukan dari dashboard Mayar — mohon bantuannya:
>
> **1. API key dengan permission "Read & Write"**
> Key yang saya terima sebelumnya dipakai untuk query baca, jadi
> kemungkinan Read Only. Membuat invoice itu POST, jadi butuh Read & Write.
> Mohon kirim **nilai key utuh** (JWT, panjang, 3 bagian dipisah titik) —
> yang saya terima kemarin terpotong.
>
> **2. Konfirmasi environment**
> Key ini untuk akun produksi (`web.mayar.id`) atau sandbox
> (`web.mayar.io`)? Kalau memungkinkan, saya minta **key sandbox dulu**
> untuk uji coba, baru produksi setelah lolos.
>
> **3. Daftarkan URL webhook** — persis seperti ini, termasuk `?token=`:
> ```
> https://dev.ikrarku.id/api/webhooks/mayar?token=<TOKEN_DARI_SAYA>
> ```
> Token-nya saya yang tentukan dan akan saya kirim terpisah. Tanpa webhook
> ini, pembayaran yang masuk tidak akan pernah terkonfirmasi di sistem kami.
>
> **4. Konfirmasi domain**
> Key Mayar terikat domain. Domain kami `dev.ikrarku.id`. Kalau key dibuat
> untuk domain lain, mohon dibuatkan key baru untuk domain ini.
>
> Satu lagi, tolong ditanyakan ke support Mayar: **apakah API V1 masih
> aktif untuk akun kami?** Dokumentasi menyebut V1 dihentikan 1 Oktober
> 2026 dan CLI resmi Mayar sudah memakai V2. Kalau sudah harus V2, kami
> perlu dokumentasi `invoice/create` versi V2.

Kirim `MAYAR_WEBHOOK_TOKEN` lewat jalur terpisah dari chat biasa, dan
jangan pernah mengirim balik API key lewat kanal yang sama.

### Sambil menunggu

- Kerjakan **Bagian B** (konfigurasi `.env.staging` di VPS) sampai selesai
- Biarkan `PAYMENT_MODE=simulation` supaya alur order tetap bisa di-QA
- Baru ubah ke `mayar` setelah keempat permintaan di atas dipenuhi

---

## BAGIAN A — Di dashboard Mayar

> Seluruh bagian ini memerlukan akses dashboard Mayar. Kalau Anda tidak
> punya, lihat **Bagian 0**.

### A1. Tentukan dulu: produksi atau sandbox?

Keduanya **akun terpisah**, bukan sekadar beda key.

| | Produksi | Sandbox |
|---|---|---|
| Login & buat key | `web.mayar.id/api-keys` | `web.mayar.io/api-keys` |
| Base URL | `https://api.mayar.id/hl/v1` | `https://api.mayar.io/hl/v1` |

> **Perhatian.** Key produksi **tidak berlaku** di sandbox, dan sebaliknya.
>
> CLI resmi Mayar (`mayarid/mayar-cli`) memakai domain sandbox
> `*.mayar.club`, berbeda dari yang tertulis di dokumentasi.
> **Konfirmasikan ke support Mayar** mana yang berlaku untuk akun Anda.

### A2. Buat API key — wajib "Read & Write"

- [ ] Buka halaman API Keys sesuai A1
- [ ] Buat key baru
- [ ] **Permission: Read & Write** — bukan Read Only

> **Kenapa ini yang paling sering salah.** Membuat invoice adalah **POST**.
> Key *Read Only* hanya boleh GET. Kalau salah pilih, konfigurasi akan
> terlihat baik-baik saja dan baru gagal **saat pelanggan menekan tombol
> Bayar** — bukan saat setup.

> Key yang beredar di tim lewat file Altair biasanya dipakai untuk query
> baca seperti `getPaymentLinkPageDev`. Besar kemungkinan Read Only.
> Jangan diasumsikan bisa dipakai; lebih aman membuat key sendiri.

### A3. Pastikan domain key cocok

- [ ] Key dibuat untuk domain yang sama dengan tempat deploy
      (`dev.ikrarku.id` atau domain produksi)

> Mayar **mengikat key ke domain**. Dokumentasi menyatakan perubahan domain
> atau subdomain **mewajibkan key baru**, dan link pembayaran yang
> dikembalikan ikut berubah mengikuti domain tersebut.

### A4. Aktifkan metode pembayaran

- [ ] QRIS / Virtual Account / e-wallet yang ingin dipakai sudah aktif

### A5. Daftarkan webhook

- [ ] URL webhook diisi **lengkap dengan token di query string**:

```
https://dev.ikrarku.id/api/webhooks/mayar?token=ISI_SAMA_DENGAN_MAYAR_WEBHOOK_TOKEN
```

> Token ini **Anda yang tentukan sendiri**, bukan diberikan Mayar.
>
> Mayar **tidak menandatangani** body webhook dan tidak mengirim header
> rahasia apa pun. Token di query string inilah satu-satunya pengaman
> endpoint ini — jangan dikosongkan, dan jangan memakai nilai yang mudah
> ditebak.

---

## BAGIAN B — Di VPS

### B1. Isi `.env.staging`

```env
PAYMENT_MODE=mayar
MAYAR_API_KEY=<JWT utuh dari A2>
MAYAR_API_BASE=https://api.mayar.id/hl/v1
MAYAR_WEBHOOK_TOKEN=<token rahasia Anda, samakan dengan A5>
MAYAR_INVOICE_EXPIRY_HOURS=24

CLIENT_ORIGIN=https://dev.ikrarku.id
PUBLIC_BASE_URL=https://dev.ikrarku.id
```

### B2. Periksa satu per satu

| Variabel | Yang sering salah |
|---|---|
| `MAYAR_API_KEY` | **terpotong saat copy.** JWT itu panjang — ratusan karakter, tiga bagian dipisah titik. Potongan pendek seperti `eyJhbGciOiJSU` itu baru bagian header-nya saja. |
| `MAYAR_API_BASE` | tertukar `.id` (produksi) dengan `.io` (sandbox) |
| `MAYAR_WEBHOOK_TOKEN` | berbeda dengan yang didaftarkan di A5 → webhook ditolak `401` |
| `CLIENT_ORIGIN` | masih `localhost` → Mayar tidak bisa menjangkau webhook, dan order **menggantung `Pending` selamanya** |

> `.env.staging` ada di `.gitignore`. Push ke GitHub **tidak** akan menghapus atau
> menimpa konfigurasi ini. Tabel `payment_methods` juga ada di SQLite yang
> gitignored.

### B3. Restart

```bash
cd /opt/ikrarku
docker compose -f docker-compose.staging.yml up -d --build
```

Perubahan `.env.staging` sisi server tidak memerlukan rebuild frontend.

---

## BAGIAN C — Verifikasi sebelum menyentuh uang

### C1. Jalankan preflight

```bash
cd /opt/ikrarku
docker run --rm -v /opt/ikrarku:/app -w /app node:22-bookworm-slim \
  node scripts/mayar-check.mjs
```

Cara ini tidak memerlukan rebuild dan tidak memasang apa pun di host.
Bila image sudah memuat `scripts/`, `docker compose -f
docker-compose.staging.yml exec ikrarku node scripts/mayar-check.mjs`
juga bisa dipakai.

Tidak membuat transaksi apa pun. API key tidak pernah dicetak.

| # | Pertanyaan | Arti hasilnya |
|---|---|---|
| 1 | Key valid? untuk akun & domain mana? | JWT dibaca secara lokal. Domain tidak cocok → peringatan |
| 1b | **Key ini produksi atau sandbox?** | key yang sama dicoba ke `api.mayar.id`, `api.mayar.io`, dan `api.mayar.club` — yang menjawab `200` itulah environment-nya |
| 2 | Read & Write atau Read Only? | ditandai lewat respons POST |
| 3 | **Endpoint V1 masih hidup?** | `400`/`422` = hidup (sekadar gagal validasi) · `404`/`410` = **sudah mati** |
| 4 | Webhook terjangkau & token cocok? | lewat event tak dikenal yang dijawab `200 {ignored}` |

Probe nomor 3 mengirim **body kosong** ke `/hl/v1/invoice/create`. Tidak ada
invoice yang terbuat, apa pun hasilnya.

> Kalau nomor 3 menjawab `404`/`410`, **berhenti dulu** — V1 sudah dimatikan
> untuk akun Anda. Lihat Bagian E.

Skrip ini harus dijalankan **di VPS**. Dari jaringan lain, kegagalan koneksi
ke `api.mayar.id` berarti masalah firewall, bukan masalah key.

### C2. Cek metode pembayaran di CMS ikrarku

- [ ] Buka **Payment Settings** di workspace
- [ ] Minimal satu metode (QRIS / GoPay / dll) berstatus **aktif**

> Endpoint pembayaran menolak order bila metode yang dipilih tidak
> `enabled`, terlepas dari konfigurasi di sisi Mayar. Secara bawaan QRIS dan
> GoPay sudah aktif.

### C3. Transaksi uji — langkah yang tidak bisa dilewati

- [ ] Buat order baru lewat alur normal (**sandbox**, nominal kecil)
- [ ] Klik Bayar → harus diarahkan ke halaman pembayaran Mayar
- [ ] Selesaikan pembayaran
- [ ] **Pastikan order berpindah `Pending` → `Paid`**

Kalau macet di `Pending`:

```bash
docker compose logs --tail=100 api | grep -i mayar
```

| Gejala di log | Penyebab |
|---|---|
| tidak ada log sama sekali | Mayar tidak pernah memanggil → URL webhook salah atau tidak publik |
| `401` | token di A5 tidak sama dengan `MAYAR_WEBHOOK_TOKEN` |
| `503` | `PAYMENT_MODE` belum `mayar`, atau token kosong di sisi server |
| `Mayar webhook: order tidak cocok` | `transactionId` tidak ditemukan — catat payload-nya dan laporkan |
| `Payment amount mismatch` | nominal invoice tidak sama dengan nominal order |

---

## BAGIAN D — Naik ke produksi

Baru dikerjakan setelah C3 benar-benar hijau.

- [ ] Ganti key sandbox dengan key **produksi** (A2, akun `mayar.id`)
- [ ] `MAYAR_API_BASE` → `https://api.mayar.id/hl/v1`
- [ ] Daftarkan ulang webhook di dashboard **produksi** (A5)
- [ ] `mayar:check` sekali lagi
- [ ] Satu transaksi nyata bernominal kecil, lalu refund

---

## BAGIAN E — Risiko yang belum terjawab: V1 vs V2

Kode saat ini memakai `/hl/v1/invoice/create`. Dua sinyal bahwa versi itu
sudah usang:

1. Halaman pengantar dokumentasi Mayar menyebut **API V1 dihentikan
   1 Oktober 2026** dan menyarankan migrasi ke V2. Tanggal itu sudah lewat.
2. CLI resmi Mayar (`mayarid/mayar-cli`) **seluruh** endpoint-nya memakai
   `/hl/v2/` — `/hl/v2/balances`, `/hl/v2/invoices/{id}/…`,
   `/hl/v2/payment-links/…`, `/hl/v2/webhooks/update`.

Migrasi ke V2 **belum dikerjakan**: kontrak `invoice/create` versi V2 belum
tersedia, dan menebak-nebak pada alur uang bukan pilihan yang bisa
dipertanggungjawabkan.

**Yang perlu dilakukan:**

- [ ] Jalankan `mayar:check`, lihat hasil pemeriksaan nomor 3
- [ ] Tanyakan ke support Mayar: *"Apakah API V1 masih aktif untuk akun kami?
      Kalau tidak, di mana dokumentasi `invoice/create` versi V2?"*
- [ ] Bila sudah harus V2, siapkan dokumentasinya untuk penyesuaian payload

---

## Enam kesalahan paling sering

1. Key **Read Only** — gagal baru saat pelanggan menekan Bayar
2. Key dibuat untuk **domain lain** — Mayar mewajibkan key baru
3. Tertukar **`.id` (produksi)** dengan **`.io` (sandbox)**
4. Webhook didaftarkan **tanpa `?token=`** — ditolak `401`
5. `CLIENT_ORIGIN` masih **localhost** — order menggantung `Pending`
6. Langsung ke produksi **tanpa transaksi uji di sandbox**

---

## Catatan teknis untuk developer

### Apa yang berubah pada Oktober 2026

Integrasi sebelumnya tidak pernah bisa menyelesaikan satu pembayaran pun.
Tidak terdeteksi karena `PAYMENT_MODE` selama ini `simulation`. Webhook
punya tiga penghalang independen:

| Kode lama | Kenyataan | Akibat |
|---|---|---|
| hanya membaca header `x-mayar-token` | Mayar tidak menandatangani body dan tidak mengirim header rahasia | selalu `401` |
| mewajibkan field `reference` | payload Mayar memuat `transactionId`/`id`, bukan `reference` | selalu `400` |
| membandingkan `currency` | payload Mayar tidak memuat `currency` | selalu `400` |

Payload `invoice/create` juga tidak sesuai kontrak: `amount`, `webhookUrl`,
dan `reference` bukan field invoice Mayar. Nominal harus lewat
`items[].rate`, `expiredAt` wajib, dan URL webhook diatur di dashboard.

Semuanya sudah diperbaiki, dan handler dibuat **idempoten** karena Mayar
mengirim ulang webhook sampai menerima `2xx`.

### Letak kode

| Bagian | Lokasi |
|---|---|
| Buat invoice | `createMayarInvoice()` di `server/index.mjs` |
| Terima konfirmasi | `POST /api/webhooks/mayar` |
| Pemenuhan order | `fulfillPaidOrder()` |
| Saklar mode | `PAYMENT_MODE` (`mayar` / `simulation`) |
| Preflight | `scripts/mayar-check.mjs` |
| Test | `QA-20` di `scripts/qa-integration.mjs` |

`QA-20` memakai bentuk payload Mayar yang sebenarnya — token lewat query,
pencocokan via `transactionId`, tanpa `currency` — dan telah diverifikasi
gagal pada kode lama serta lulus pada kode baru.

### Yang belum teruji

Integrasi ini **belum pernah diuji terhadap API Mayar sungguhan** karena
tidak tersedia kredensial saat pengerjaan. Yang teruji adalah kontrak
webhook terhadap bentuk payload Mayar. Bagian C3 tidak bisa dilewati.

---

## Sumber

- [Mayar — Introduction](https://docs.mayar.id/api-reference/introduction)
- [Mayar — Create Invoice](https://docs.mayar.id/api-reference/invoice/create)
- [mayarid/mayar-cli](https://github.com/mayarid/mayar-cli)
