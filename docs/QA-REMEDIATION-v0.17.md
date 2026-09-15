# Ikrarku — revisi QA dan UX v0.17.0

Tanggal: 14 September 2026. Basis: afc-teknologi/ikrarku, commit `2d8f173af937d3f4454bad3f6278bf33639b2548` (v0.16.0).

Revisi ini dikerjakan pada salinan lokal source repository. Belum di-push, dibuatkan PR, atau di-deploy karena koneksi GitHub hanya memiliki izin baca (`push: false`). Tidak ada perubahan pada database produksi. API provider pembayaran tetap ditunda sesuai permintaan.

## Ringkasan implementasi

- Auth dan otorisasi objek diperketat; signup user+site memakai transaksi.
- Pemrosesan pembayaran dipisahkan dari status pembayaran, mendukung retry dan notifikasi berulang; receipt tidak lagi menjadi file publik tanpa token.
- Recovery autosave tersedia untuk site, client, dan template; save editor menunggu hasil API sebelum menghapus dirty state atau keluar.
- Revisi template Published disimpan sebagai draft approval, menjaga versi publik sebelumnya.
- Landing page memakai komponen tersendiri dengan hero, katalog, filter, panduan, fitur, FAQ, artikel, navigasi mobile, dan reduced motion.
- Web Designer mendapat docking 3×3, offset bertanda, area column/canvas, ukuran, rotasi, layer, opacity, visibility per perangkat, override mobile dan kontrol timing animasi. Ornamen gambar/icon/text pada area canvas dapat tampil di opening cover.
- Thumbnail menggunakan renderer undangan yang sama, dalam konteks tanpa autoplay audio/video. Chart dashboard di-load terpisah.

## Pemetaan ke PDF QA v0.16.0

“Tes API” berarti request HTTP ke server Express sebenarnya dengan database SQLite sementara. “Perlu browser” berarti perubahan sudah ditulis tetapi interaksi/hasil visual belum diverifikasi langsung.

| ID | Perbaikan | Bukti dan batas verifikasi |
| --- | --- | --- |
| QA-01 | Respons production tidak mengembalikan URL reset/verifikasi development | Tes API reset production lulus; email SMTP nyata belum diuji |
| QA-02 | Chat anonim tidak memperoleh token percakapan lama hanya berdasarkan email | Tes isolasi token lulus |
| QA-03 | Middleware memeriksa active/email_verified; penonaktifan mencabut sesi | Tes sesi nonaktif lulus |
| QA-04 | Designer tidak dapat mengganti assignment designer lain | Tes assignment dan akses site lulus |
| QA-05 | Mutasi task dan percakapan memeriksa assignment objek | Tes CS/editor dan pengguna lain lulus |
| QA-06 | Signup menormalisasi input dan mentransaksikan user+site | Tes konflik slug tanpa orphan serta verifikasi login lulus |
| QA-07 | Kedua jalur pengubahan role menjaga minimal satu admin aktif | Tes demosi admin terakhir lulus; permission admin `*` dipertahankan |
| QA-08 | Webhook memerlukan mode/token, event dibatasi dan nominal/currency divalidasi | Tes payload sintetis lulus; belum merupakan sertifikasi integrasi provider |
| QA-09 | Paid dan fulfillment terpisah; receipt/task/email dapat diproses ulang tanpa duplikasi pada satu proses server | Tes kegagalan receipt, retry, replay dan request serentak lulus; UI retry ditambahkan |
| QA-10 | Paid order membuat assignment; guest order diklaim sesudah verifikasi email | Tes akun tanpa assignment sebelumnya lulus; assignment lama dipertahankan |
| QA-11 | Publish memeriksa template berbayar untuk user pemilik site | Tes unpaid ditolak dan paid diterima; semua sourceTemplateId yang dinyatakan diperiksa |
| QA-12 | Email baru menjadi pending sampai diverifikasi; order dibaca berdasarkan user_id | Tes email utama tetap, isolasi order dan guest claim lulus; UI memakai email dari respons server |
| QA-13 | Endpoint recovery/discard draft dan dialog pemulihan editor | Tes persistensi draft, pemisahan dari published dan akses silang lulus; dialog/reload perlu browser |
| QA-14 | Save & Leave menunggu API; kegagalan tidak membersihkan history/dirty | Build/type-check lulus; interaksi slow-network dan gagal save perlu browser |
| QA-15 | Draft revisi template terpisah dari live; approve/reject eksplisit | Tes live tidak berubah, reject menjaga live, approve mempublikasikan revisi lulus |
| QA-16 | Own-site save/publish memerlukan permission canvas | Tes CS ditolak lulus |
| QA-17 | GET greetings publik dan pemuatan saat halaman dibuka | Tes persistensi baca ulang lulus; penampilan setelah reload perlu browser |
| QA-18 | Ringkasan Canvas 01 diganti renderer undangan untuk thumbnail | Build lulus, autoplay dibatasi; kesetaraan visual desktop/mobile perlu browser |

Otorisasi template adalah pemeriksaan entitlement atas identitas template yang disimpan/dikirim, bukan DRM terhadap penyalinan ulang konten JSON. Multi-instance payment processing dengan shared database/worker belum diuji; workflow yang diuji memakai satu proses Express dan SQLite.

## Hasil verifikasi lokal

- `npm run qa`: lulus (preflight, schema DB, integration HTTP, layout, lint, TypeScript, build, syntax server).
- Schema DB: **38/38** pemeriksaan lulus.
- Integration HTTP: **27 skenario** lulus; Node melaporkan **28/28** karena menghitung parent test.
- Layout: **5/5** lulus untuk sudut, pusat/offset, mobile inheritance, input ekstrem dan motion.
- Lint: tidak ada error; **4 warning dependency React hooks** tersisa pada alur lama (load protected data, polling, keyboard history, read conversation).
- Build produksi lulus. Chunk utama masih sekitar **539 kB sebelum gzip / 147 kB gzip**; chart terpisah sekitar 353 kB / 103 kB gzip. Ini ukuran bundle, bukan pengukuran Core Web Vitals.
- Browser lokal **belum dijalankan**: browser yang tersedia menolak localhost dengan `ERR_BLOCKED_BY_CLIENT`. Tidak ada klaim screenshot terverifikasi, skor Lighthouse, atau hasil uji Safari/mobile nyata.
- `qa:browser` dan workflow CI ditambahkan, tetapi **belum dijalankan**. Test browser mencakup landing dan komponen docking; belum mencakup semua perjalanan end-to-end persona.
- Docker build, deployment, email SMTP nyata, dan pembayaran provider nyata **belum diuji**.

Script QA lama berbasis pencarian teks source tetap tersedia melalui `qa:legacy` serta perintah aslinya. Script tersebut mengasumsikan bentuk source v0.16 dan beberapa sebelumnya sudah gagal. Karena renderer/refactor berubah, script tersebut tidak dipakai sebagai gate v0.17; gate baru memakai route nyata, pemeriksaan schema, perhitungan layout, lint dan build. Ini bukan klaim seluruh assertion lama telah lulus.

## QC persona yang masih harus dijalankan di staging

| Persona | Langkah | Hasil yang harus terlihat |
| --- | --- | --- |
| Customer | Signup → verifikasi → login; request reset dengan SMTP aktif | Token hanya diterima lewat email; akun nonaktif tetap ditolak |
| Customer | Checkout guest → registrasi dengan email sama → verifikasi | Order milik akun dan assignment muncul; akun lain tidak dapat mengakses |
| Customer | Ucapan → refresh halaman undangan | Ucapan tersimpan tetap ditampilkan |
| Web Designer | Masukkan image, posisi bebas, scope canvas, dock top-left lalu top-right | Gambar berada di sisi yang dipilih dalam editor dan preview/published |
| Web Designer | Atur mobile berbeda, kembali desktop, reset mobile | Desktop tidak berubah; reset mengembalikan inheritance |
| Web Designer | Rotasi/layer/opacity; drag dan resize pada zoom editor | Kontrol, gerakan pointer dan hasil publish konsisten |
| Web Designer | Ganti animasi/durasi/delay/easing; aktifkan reduced motion OS | Efek mengikuti konfigurasi dan preferensi reduced motion |
| Web Designer | Edit → tunggu autosave → reload → pulihkan/buang | Pilihan recovery benar; published tidak tertimpa oleh autosave |
| Web Designer | Putuskan jaringan lalu Save & Leave | Tetap di editor, error terlihat, dirty state tidak hilang; bisa retry |
| CS | Buka inbox/task miliknya; coba objek CS/designer lain | Objek yang tidak ditugaskan ditolak; tidak bisa publish canvas |
| Administrator | Review draft revisi; reject lalu approve; retry fulfillment | Live stabil sebelum approve; retry tidak menggandakan task |
| Semua | 320/390/768/1440 px, keyboard, Safari iOS/Chrome Android | Tidak overflow; menu/CTA/form dapat digunakan; fokus terlihat |

## Struktur dan sisa utang kode

Landing, kontrol designer, perhitungan layout, chart, dan policy backend dipisahkan ke modul. Source yang diubah diformat agar tidak lagi berupa blok JSX/route satu baris. Namun `App.tsx` dan `server/index.mjs` masih besar dan memuat banyak tanggung jawab; revisi ini belum memisahkan seluruh domain menjadi modul. Empat warning hooks dan pengurangan bundle lanjutan masih menjadi pekerjaan refactor berikutnya. Semua fitur canvas juga belum diklaim telah lolos QC visual.

## Penerapan dan rollback

Gunakan petunjuk `APPLY.md` pada paket patch. Sebelum menjalankan versi baru terhadap data nyata, buat backup konsisten database SQLite beserta direktori upload/receipt. Migration bersifat tambahan (kolom/tabel) dan berjalan pada startup. Recovery data setelah transaksi bisnis baru memerlukan strategi backup; mengembalikan source saja tidak mengembalikan data. Siapkan SMTP untuk alur verifikasi nyata. Jangan mengaktifkan gateway sampai skema webhook dan sandbox provider diverifikasi.
