## 0.22.2 — 26 November 2026

- Google Tag Manager (GTM-NK3X2QVQ) yang dipasang langsung di server kini masuk kode `index.html`, aktif hanya di ikrarku.id (dev.ikrarku.id & localhost tidak terlacak).
- `.gitignore`: folder `backups/` dan cadangan `.env*.bak*` di VPS tidak lagi muncul di `git status`.

## 0.22.1 — 24 November 2026 (QC 24 Nov, di atas branch production)

- QC3: form Ubah akun & Tambah akun di Admin Console tidak lagi diisi otomatis browser dengan email/password Admin yang sedang login (autocomplete dimatikan, password memakai new-password). Sebelumnya password user bisa tergantikan password Admin tanpa disadari.
- QC4: verifikasi email hanya berlaku untuk akun customer. Akun tim (CS, Web Designer, Admin) yang email-nya diganti Admin tetap bisa login.
- QC5: foto kartu katalog memenuhi kartu (object-fit cover). Disarankan thumbnail rasio 3:2 (mis. 1500x1000 px).
- Tes integrasi baru untuk ganti email/password akun tim oleh Admin (43/43).

## 0.22.0 — 23 November 2026 (QA 16 · TC-365–TC-407 · Paket v1.3)

**Paket layanan (TnC Paket / Panduan Internal Tim v1.3)**
- Paket per template: Free · Basic · Advanced (isi & edit mandiri, panduan CS lewat Live Chat) dan Premium · Custom (didampingi Web Designer). Admin memilih paket di Templates & Approval → "Ubah harga & paket". Template lama tanpa paket ditebak dari harga (≤ Rp79rb Basic, ≤ Rp150rb Advanced, lebih dari itu Premium).
- Order Free/Basic/Advanced: tidak ada penugasan Web Designer (status "Paid - Mandiri"), CS tetap ditugaskan untuk panduan; halaman sukses, email receipt, tahapan di My Order dan rincian paket di halaman template mengikuti paket.
- Notifikasi email operasional ke OPS_NOTIFY_EMAIL (bawaan hello@afarcoteknologi.com) + CS yang di-assign: order baru, order lunas, dan chat customer (maks. 1 email per percakapan per 15 menit).
- Opsional: SITE_BASIC_AUTH=user:password mengunci seluruh situs (untuk dev.ikrarku.id) dengan login browser; webhook pembayaran tetap terbuka.
- Kontak footer/invoice: WhatsApp 081322065391, hello@afarcoteknologi.com, @ikrarkuid sebagai bawaan bila .env kosong atau masih berisi contoh.

**Canvas Editor**
- TC-365 "Tempel antar fitur" tidak lagi mengunci posisi Tengah/Bawah; opsi "Lepas dari Tempel antar fitur" per fitur.
- TC-366 Garis tepi kotak fitur: tebal, warna, gaya (penuh/putus-putus/titik/ganda), ikut border radius.
- TC-367/368 Tambah Layer: tombol Duplikat dan urutan Paling depan/Maju/Mundur/Paling belakang.
- TC-369 Italic & Underline terpisah untuk Header dan Teks.
- TC-371 Animasi Masuk Canvas (10 efek, scroll-trigger atau saat dibuka, durasi, delay, easing, putar ulang) + 6 loop baru (Ken Burns, berputar, memantul, berayun, bercahaya, detak jantung).
- TC-372 Inspector kanan tidak melebar (input warna & grid 2 kolom menyusut).
- TC-373 Upload gambar: kompres otomatis dengan batas jelas (foto 2 MB, background fitur/layer 4 MB, background canvas 8 MB, file asli ≤ 25 MB) dan toast merah yang tidak hilang sebelum terbaca.
- TC-374 Slot background terpisah Desktop 16:9 dan Mobile 9:16.
- TC-375 Bentuk bingkai satu sumber untuk tab Content & Style; Pintu/Arch proporsional (3:4) di lebar 100%.
- TC-376 Reset warna tidak pernah menghasilkan isi/gradien kosong.
- TC-377 Ornamen bisa di-drag & di-resize langsung di canvas (pilih canvas-nya); seleksi teks biru tidak ikut tersapu saat menggeser slider.
- TC-378 Teks tanpa warna pilihan otomatis terang di canvas gelap.
- TC-379 Navbar undangan: tampil/transparan/sembunyikan, menu, warna, logo; tata letak desktop per canvas (Kolom).
- TC-380 Ikon custom per acara (Event) dan simbol penghubung antar 2 kolom (&, ♥, +, ×, dan).
- TC-382/390/391/392 Sisi visual 70%: ukuran & posisi teks ikut lebar area (sama di semua layar), posisi X/Y teks, posisi kustom layer 2, header/teks tambahan, italic/underline/bold.
- TC-384 Rotasi foto Image & Gallery (kiri/kanan 90° + sudut halus).
- TC-397/398 Site Pages: panel kanan mengikuti halaman; RSVP Confirmation bisa diatur (judul, field WhatsApp/pesan, batas jumlah tamu, tombol); ikon tidak menimpa judul.
- TC-399 Editor di layar sempit: Page Structure & Inspector menjadi laci yang tertutup otomatis.

**Dashboard, Web Designer, Admin**
- TC-381 Web Designer tidak lagi mendapat 403 berulang dari /api/cs/metrics.
- TC-385 Kartu katalog mobile rata kiri & sejajar; label paket.
- TC-389 Admin bisa approve template gratis / Rp0.
- TC-393/396 Kartu ringkasan, daftar "Customer saya" dan dropdown Canvas Editor memakai sumber yang sama (order yang ditugaskan); label Bahasa Indonesia; jarak dropdown–tombol Buka Canvas.
- TC-394 Kategori "Romantic" di modal Create Template (satu daftar kategori).
- TC-395/402/403 Mobile: tanpa scroll horizontal, kartu Tasks 1 kolom, header Support Inbox tidak bertabrakan, tombol Live Chat ringkas & disembunyikan di Support Inbox.
- TC-400/401 Komisi Saya: kolom tidak terpotong, label tidak duplikat, filter status/bulan, ekspor CSV, rekening penerima (konfirmasi password) dan pengajuan penarikan yang diproses Admin.
- TC-404 Lampiran gambar/PDF (≤ 10 MB) pada balasan Support Inbox; tautan di chat bisa diklik.
- TC-405 Artikel bantuan batas upload diperbarui; istilah "Canvas Editor".
- TC-406 Settings untuk staff hanya menampilkan Umum, Notifikasi, Keamanan akun.
- TC-407 Field "Password saat ini" selalu tampil di Pengaturan Akun (wajib saat email/password berubah).

## 0.21.1 — 22 November 2026 (QC)

- Editor: semua keterangan di kanan judul grup ("Eyebrow · Label · Nama", "Editable", "Viewer interaction", dll.) memakai gaya chip kecil yang sama dengan "Enter = baris baru".
- Thumbnail & Gambar sample template tidak lagi "pecah": dulu file di atas 2 MB dikompres keras di browser (PNG diubah ke WebP lossy kualitas sampai 0,55 dan resolusinya diturunkan). Kini sampai 6 MB diunggah apa adanya (format & resolusi asli); di atas 6 MB baru dikompres dengan kualitas tinggi (0,92 → 0,78) pada resolusi penuh dulu, maksimal sisi 2560 px. Kompresi gambar lain (background, galeri, ornamen) ikut memakai urutan kualitas baru ini.

## 0.21.0 — 22 November 2026 (QC WhatsApp)

- **Template gratis (Rp0).** Admin → Templates & Approval → Ubah harga → centang "Gratis (tanpa pembayaran)". Customer memesan seperti biasa; di langkah 2 cukup klik **Aktifkan Template Gratis** — order langsung aktif (status Paid, metode FREE), CS & Web Designer dialokasikan, tanpa payment gateway. Harga 0 tanpa centang tetap berarti "belum ditetapkan". Katalog & ringkasan menampilkan "Gratis".
- **Buka Undangan → langsung ke canvas yang diinginkan.** Opsi baru di fitur Cover: "Setelah dibuka, mulai dari" (canvas setelah cover / lewati 1 / lewati 2 canvas) untuk template yang canvas pembukanya mirip cover.
- Footer: tautan "Masuk ke dashboard" dihapus; akun sosial menampilkan handle (mis. @ikrarkuid).
- Checkout: catatan "Dipakai untuk hitung mundur…" diberi jarak dari kolom tanggal/jam.
- Editor: petunjuk "Enter = baris baru" dibuat kecil (chip).
- Ornamen: tombol upload diberi nama "Upload gambar ornamen" (PNG transparan didukung).
- Upload gagal kini memberi pesan yang tepat: timeout 2 menit, koneksi terputus, file terlalu besar (413), atau server sibuk (502/504). Dulu memakai pesan autosave "disimpan sementara di perangkat" padahal file tidak tersimpan.

## 0.20.0 — 22 November 2026

- **Entrance Effect kini benar-benar berbeda satu sama lain.** Aturan timing editor memaksakan durasi 700 ms dan easing ease-out (`!important`) ke semua animasi fitur, sehingga Bounce, Elastic, Slide Spring, dsb. terasa sama. Timing khusus (Style → Timing animasi) kini hanya berlaku bila diisi, dan ada tombol "Reset timing".
- **Animasi berulang (Looping) tidak lagi menelan efek masuk.** Dulu loop menimpa Entrance Effect sejak awal (efek masuk tak terlihat) dan loop sendiri hanya jalan sekali. Kini efek masuk jalan dulu, loop menyusul dan berulang terus.
- **Transition berfungsi.** Dulu sebagian hanya CSS transition yang tidak pernah terpicu, sebagian saling menimpa dengan Entrance. Kini Transition menganimasikan isi fitur bersamaan dengan Entrance (20 pilihan).
- **Kecepatan animasi: Slow / Medium / Fast** (tab Advanced) untuk Entrance Effect dan Transition. Live Motion Preview ikut diputar ulang.
- Fitur yang sangat tinggi tetap muncul saat digulir (sebelumnya bisa tidak pernah mencapai ambang 16% terlihat).

## 0.19.6 — 21 November 2026

- Lagu undangan: jeda lalu putar lagi kini **melanjutkan** dari posisi terakhir (dulu tombol jeda menghentikan lagu sehingga diputar ulang dari awal). Berlaku untuk tombol lagu melayang, tombol lagu di Credit, dan fitur Sound.
- Tombol lagu di Credit kini mengendalikan pemutar utama undangan (satu lagu yang sama), tidak lagi membuat pemutar kedua yang bisa berbunyi bersamaan.
- Lagu yang dijeda tamu tidak ikut hidup lagi saat tamu kembali dari tab lain.

## 0.19.5 — 21 November 2026

- "Kotak timbul" di undangan: fitur dengan posisi bebas (drag) membawa bayangan penanda editor ke undangan yang tayang. Bayangan kini hanya muncul di editor saat fitur dipilih.
- Desktop (selain tata letak Kolom/Serein): tombol lagu kini **sejajar** dengan menu icon di pojok kiri. Di ponsel atau bila menu menutupi pojok, tombol tetap naik di atas menu. Berlaku juga di kotak preview (memperhitungkan zoom).

## 0.19.4 — 20 November 2026

- Tombol lagu: posisi horizontal kini pengaturan sendiri ("Sisi horizontal": Kiri/Tengah/Kanan di Posisi Player). Lagu dari fitur Credit dulu ikut perataan teks credit (sering tengah); kini bawaan **pojok kiri**, tepat di atas menu bawah. Pengaturan Posisi Player juga muncul di Credit yang berisi lagu.

## 0.19.3 — 20 November 2026

- Mobile: bila menu bawah (bottom navigation) aktif, tombol lagu di posisi bawah kini naik di atas menu dan tidak tertutup lagi.

## 0.19.2 — 20 November 2026

- Tata letak Kolom (Serein): cover kembali tampil **di dalam kolom** sebagai bawaan, seperti Serein. Cover layar penuh merentang desain Mobile selebar layar sehingga lengkung/ornamen berukuran ponsel tampak raksasa. Layar penuh tetap tersedia per template di "Tampilan cover" (desain Desktop atau desain Mobile). Juga memperbaiki pilihan "desain Desktop" yang sebelumnya tidak aktif.
- Ornamen menutupi tulisan: perubahan TC-341 (0.19.0) membuat semua ornamen "Di depan isi" — lapisan bawaan — naik ke atas isi fitur. Kini lapisan lama kembali di belakang isi; lapisan baru **"Paling depan (menutupi isi)"** (juga tombol Urutan lapisan → Paling depan) dipakai bila ornamen memang harus di atas kartu fitur.
- Preview template Mobile: bayangan di sekeliling bingkai ponsel dihapus.

## 0.19.1 — 20 November 2026

- Tata letak Kolom (Serein): cover layar penuh sebelumnya memakai desain **Desktop** cover. Pada template Kolom yang diedit hanya versi Mobile, desain Desktop kosong sehingga cover tampil polos (teks putih di atas latar krem). Kini cover layar penuh memakai desain cover **Mobile**, mengisi seluruh tinggi layar, dengan isi dibatasi 560 px di tengah. Opsi "Tampilan cover": Layar penuh (desain Mobile, bawaan) / Layar penuh (desain Desktop) / Langsung di dalam kolom.

## 0.19.0 — 17 November 2026 (QA 15: TC-330 s/d TC-363)

Sumber: UPDATE_QA_IKRARKU.ID_15 (sheet Master Test Cases, Status Fail, kolom Update Web Dev kosong) dan Highlight Report QA 15 Nov 2026.

**Editor (Web Designer)**
- TC-330: Tata letak desktop **Kolom** — cover (slide pertama) kini tampil full layout Desktop; kolom ala Serein baru muncul setelah **Buka Undangan**. Opsi "Tampilan cover" di panel Tata letak desktop (bawaan: full layout; "Langsung di dalam kolom" = cara lama). Musik tidak terputus saat berpindah.
- TC-331: **Format tanggal** otomatis untuk Save The Date dan Event: "12 Desember 2026", "Sabtu, 12 Desember 2026", "Sabtu 12 Des", "12/12/2026", "12 . 12 . 2026", "12-12-2026", plus ukuran & warna. Diambil dari Tanggal & waktu acara (atau Tanggal & jam tiap acara pada Event).
- TC-332: **Slideshow Layer 1** — tambah beberapa foto (bisa pilih sekaligus); foto Layer 1 menjadi slide pertama, berganti otomatis (2–20 detik, transisi Fade / Fade + zoom / Geser).
- TC-333: teks pada fitur Icon punya **font**, warna, dan tebal sendiri.
- TC-334: **Bentuk bingkai foto** untuk Image & Gallery: kotak, pintu/arch, pintu oval, oval, lingkaran, daun (2 arah), diamond, heksagon, hati, scallop.
- TC-335: ukuran teks **nama pemilik rekening** dan nomor rekening (Wedding Gift).
- TC-336: Guest Form — font heading dan font teks (label, isian, tombol) kini terpisah.
- TC-337 (urgent): geser ornamen dulu hanya ±200 px sehingga di canvas tinggi (banyak fitur) ornamen tidak bisa mencapai tengah/bawah. Kini Geser X ±1200 px dan Geser Y ±4000 px lewat slider, angka bisa diketik langsung, plus tombol panah per 10 px dan **Reset posisi**.
- TC-338: ukuran ornamen dulu maks 420 px; kini slider sampai 1600 px dan bisa diketik sampai 3000 px.
- TC-339: **Posisi vertikal kolom** (Atas/Tengah/Bawah) untuk Column layout 2/3/4 — kolom pendek rata terhadap kolom lain dan blok kolom diletakkan di dalam canvas.
- TC-340: **Geser manual atas-bawah** untuk blok kolom (panel canvas) dan untuk tiap fitur (tab Style). Keterangan baru: Atas/Tengah/Bawah butuh canvas lebih tinggi dari isinya.
- TC-341: ornamen "Di depan isi" kini benar-benar di atas isi fitur (mis. kartu Event berwarna). Dulu lapisan kolom (z-index 5) menutupi ornamen (z-index 4).
- TC-342: ikon fitur Event bisa diganti (kalender, hati, cincin, kilau, jam) atau **dihapus**, plus ukuran & warna.
- TC-343: tombol **Simpan Tanggal** punya pengaturan sendiri: bentuk (rounded/pill/kotak/outline), warna tombol, warna teks, ukuran teks, sudut, ikon kalender on/off. Di editor tombol tetap terlihat walau tanggal belum diisi. Kosong = ikut gaya tombol lokasi (perilaku lama).
- TC-344: sudah diperbaiki di 0.18.3 (QA menguji sebelum update). Hapus background sekali lagi lalu simpan.
- TC-345: sisi 70% tata letak 70:30 punya **Ornamen** dengan pengaturan sama seperti canvas.
- Highlight: **warna teks button slide** (bottom navigation) — warna teks dan warna teks aktif.

**Halaman publik & bahasa (EN)**
- TC-346–353, TC-362: satu pilihan bahasa ID/EN untuk seluruh situs (`src/i18n.ts`): landing, jurnal, login, daftar, lupa password, katalog, detail template, checkout, dashboard customer. Tombol ID/EN di tiap halaman.
- Artikel jurnal punya versi EN (judul, ringkasan, isi) di Articles CMS; artikel tanpa versi EN diberi label "ID" dan catatan.
- Tautan di dalam artikel: "Baca juga: <judul>" mengarah ke artikel yang benar; tautan ke beranda/ikrarku.id menjadi relatif; tautan luar dibuka di tab baru.
- TC-354: footer landing lengkap — navigasi, FAQ, Kebijakan Privasi, Syarat & Ketentuan, kontak & media sosial (dari `.env`). Halaman baru `/kebijakan-privasi`, `/syarat-ketentuan`, `/faq`.
- `/login` dan `/signup` bisa dibuka langsung; Back browser dari Lupa Password kembali ke halaman sebelumnya; alamat tidak lagi tertimpa "/" saat halaman artikel dimuat.

**Dashboard customer**
- TC-352/359: URL per menu (`/workspace/my-orders`, `/workspace/settings`, …) dan judul tab per halaman; Back/Forward berfungsi.
- TC-355: sidebar menutup/membuka otomatis saat lebar layar melewati 900 px; tidak ada geser horizontal di 390 px.
- TC-356–361, 363: label menu berbahasa customer, status website Terbit/Draf yang sebenarnya, kesiapan website, tahapan pesanan (4 langkah) di My Order, "Selesai" = semua tahapan selesai, sapaan sesuai jam (pagi/siang/sore/malam), tombol Pratinjau & Salin link di card template.
- TC-358: gambar versi device yang tampil dimuat lebih dulu saat preview dibuka.

## 0.18.3 — 16 November 2026 (background Mobile terhapus muncul lagi)

- **Background yang dihapus muncul lagi setelah save + refresh.** Pada template dengan Tata letak desktop **Kolom** (mis. Blue Flowers), editor mode Desktop sebenarnya mengedit versi Mobile. Saat "Hapus background image", nilai dikosongkan di versi Mobile sebagai `undefined` — nilai ini hilang ketika disimpan (JSON), sehingga setelah save + refresh versi Mobile kembali mewarisi background Desktop dan gambar lama tampil lagi di Preview. Kini penghapusan di versi Mobile disimpan sebagai `null` ("dihapus") dan dibaca kembali sebagai kosong. Berlaku untuk semua pengaturan canvas/fitur yang dikosongkan di Mobile.
- Template yang sudah terlanjur disimpan perlu dihapus background-nya sekali lagi lalu disimpan setelah update ini.

## 0.18.2 — 15 November 2026 (card design Template & Canvas)

- **Customer: card hilang setelah Save.** Tombol kembali (←) di editor customer membuka halaman Tasks & Tickets (tidak ada di menu customer), sehingga card di Template & Canvas tampak hilang sampai customer pindah menu. Editor customer kini kembali ke Template & Canvas; hanya Admin/Web Designer yang mengelola website customer yang kembali ke Tasks.
- **Admin/Web Designer: 3 card untuk 1 pesanan.** Canvas tanpa penanda template (starter "Main Canvas", canvas tambahan) tampil sebagai card "Custom Design" sendiri-sendiri, padahal customer hanya melihat satu card. Canvas tersebut kini digabung ke design template sehingga tampilan staff = tampilan customer. Salinan hasil Copy tetap card sendiri.
- **Banner pada preview card (actual-render-viewport).** Template yang ditata Mobile (Tata letak desktop: Kolom) atau background-nya hanya diisi di versi Mobile tampil sebagai kotak krem kosong. Card kini merender versi Mobile untuk template seperti itu, memilih cover dari canvas template (bukan starter), dan tidak menyisakan pita kosong di atas banner. Label "Applied Template · <nama>" tidak lagi terpecah dua baris.
- **RSVP Confirmation customer.** Filter "Canvas" menampilkan nama canvas internal (Main Canvas, New Canvas (salinan), …). Customer kini memfilter per undangan yang dibeli (sama dengan List Undangan); bila hanya satu undangan, filter tidak ditampilkan. Kolom CSV menjadi "undangan".
- **Panel kanan editor bisa digeser horizontal.** Pasangan kontrol (mis. Text color + Background, Heading + Supporting) lebih lebar dari panel. Kini pasangan yang tidak muat turun ke bawah dan kolom Hex menyempit; panel tidak lagi punya scroll horizontal.
- **Ornamen bergambar dipratinjau dua kali.** Kotak pratinjau ornamen dan thumbnail kontrol "Upload gambar layer" sama-sama menampilkan gambar. Kotak pratinjau kini hanya untuk bentuk bawaan; ornamen bergambar cukup satu thumbnail.

## 0.18.1 — 15 November 2026 (perbaikan editor, TC-309, TC-328)

- **Bug edit canvas template** (video 15 Nov): zoom area kerja editor bolak-balik 44% ↔ 46% karena scrollbar area kerja muncul/hilang mengikuti tinggi canvas; isi canvas tampak dobel dan berkedip. Lebar area kerja kini stabil (`scrollbar-gutter: stable`) dan kenaikan zoom < 3% diabaikan.
- **TC-309**: saat ukuran font fitur yang punya background (warna, gradien, atau gambar) diubah, tinggi kotak dikunci pada tinggi saat itu — hanya teks yang membesar, background tidak ikut membesar/ter-zoom. Panel Style menampilkan keterangan "Tinggi kotak dikunci …px" dengan tombol **Tinggi otomatis** untuk melepasnya.
- **TC-328** (shadow antar canvas, template D Adat Jawa 01): setiap canvas punya lapisan gradien tipis (`.canvas-section:after`, putih 3% → hitam 2%). Di atas Background tetap, bawah canvas jadi sedikit lebih gelap dan atas canvas berikutnya lebih terang — tampak sebagai garis/bayangan di tiap batas canvas saat digulir. Lapisan itu dihapus; warna antar canvas kini rata.
- **TC-328 (ornamen terpotong)**: ornamen gambar yang digeser keluar batas atas/bawah canvas tanpa opsi "Boleh keluar dari batas canvas" kini dipudarkan di garis potongnya (tidak lagi terpotong lurus). Editor menampilkan keterangan pada ornamen yang terpotong.
- **Sidebar kiri editor**: panel "Tata letak desktop" (mode Kolom) melebar melewati sidebar sehingga muncul scroll horizontal dan kontrol terpotong. Panel kini mengikuti lebar sidebar; select dan tombol upload ikut menyesuaikan.

## 0.18.0 — 10 November 2026 (QA 14: TC-303 s/d TC-329 + revisi WhatsApp)

Sumber: UPDATE_QA_IKRARKU.ID_14 (sheet Master Test Cases, Status Fail, kolom Update Web Dev kosong), Highlight Report QA 8 Nov, revisi WhatsApp SSBug1–5, contoh "Invoice — A4 1".

**Revisi WhatsApp**
- SSBug1 / TC-327: customer dengan satu pembelian kini melihat **satu card** di Template & Canvas. Canvas tanpa pemilik (canvas awal "Main Canvas", salinan, canvas tambahan tim) digabung ke design order, bukan card "Applied Template · <template lain>". Label card customer: "Template dibeli". Tombol Copy & Delete tidak tersedia untuk customer (menyebabkan design ganda / undangan kosong).
- SSBug2: kartu "ikrarku Signature" di sidebar customer disembunyikan (`SHOW_SIGNATURE_UPSELL`).
- SSBug3: List Undangan customer dikelola per **undangan yang dibeli**; dropdown nama canvas internal ("Main Canvas (salinan)", "New Canvas") tidak lagi tampil. Daftar tamu lama tetap terbaca.
- SSBug4: Wedding Dashboard customer menampilkan pratinjau undangan asli (bukan sketsa dengan teks contoh "Chyntia & Rian"), statistik per undangan, dan info "nama template · URL · jumlah canvas".
- SSBug5: (1) gambar ornamen tidak lagi `loading="lazy"` — dulu baru dimuat setelah halaman digulir; (2) setelah "Buka Undangan" diklik, canvas cover tidak tampil lagi — tamu langsung masuk ke canvas berikutnya; (3) ornamen bergerak-saat-gulir pada canvas setinggi layar tampil sejak awal.
- Invoice pembayaran mengikuti desain "Invoice — A4 1" (logo, nomor INV/Order/Receipt, tabel layanan, detail pembayaran + stempel PAID, total, ucapan terima kasih, pita footer). Font Cormorant Garamond & DM Sans (OFL) ada di `server/assets/fonts`. Invoice lama dibuat ulang otomatis saat diunduh (nomor tidak berubah). Nomor WhatsApp CS di footer dari `CS_WHATSAPP`.

**QA 14 — bug**
- TC-303: template yang dibayar kini disalin ke website customer walau website sudah berisi canvas awal kosong (dulu dilewati → canvas kosongan). Daftar tamu di canvas awal dipindahkan, tidak hilang.
- TC-305: spasi & baris baru pesan staff ↔ customer tetap terjaga (live chat, inbox, catatan internal, email).
- TC-308: background HD/Full HD (sampai 25 MB) diterima; di atas 8 MB dikompres otomatis di browser (sisi terpanjang 2560 px).
- TC-310: font header memuat bobot 700; font script satu bobot ditebalkan sintetis di dalam undangan.
- TC-313: Gambar sample / Thumbnail dari Web Designer langsung dipakai (dulu masuk draft revisi yang menunggu approval sehingga "tidak tampil"); Thumbnail & Gambar sample tidak saling menimpa; file > 2 MB dikompres otomatis.
- TC-316: kolom Hex di setiap color picker menyimpan saat klik di luar / Enter; "Warna yang digunakan" (16 warna terakhir) di setiap picker.
- TC-317: gambar background, layer, dan ornamen di-decode dulu (maks. 2,5 dtk) sebelum animasi berjalan; ornamen tidak lazy-load.
- TC-327: lihat SSBug1.

**QA 14 — fitur**
- TC-304: mention `@Nama` di catatan internal (tiket & inbox) dengan saran nama; staff yang disebut menerima email.
- TC-306: email order baru ke Web Designer sudah ada sejak 0.17.1 (IKR-08); uji kirim menunggu SMTP.
- TC-307: urutan lapisan ornamen — Paling depan / Maju / Mundur / Paling belakang — tanpa hapus & upload ulang.
- TC-311: Administrator dapat menghapus template (dengan konfirmasi). Template yang pernah dipesan diarsipkan (`Archived`) sehingga order, invoice, dan website customer tetap utuh.
- TC-312: katalog 4 kolom di desktop lebar, tetap 2 kolom di ponsel kecil.
- TC-314: layout Our Gallery "Lingkaran 2 Foto".
- TC-315: smart snapping — objek posisi bebas menempel di tengah kolom (horizontal & vertikal) dengan garis bantu; tahan Alt untuk menonaktifkan.
- TC-318: label "New" (template ≤ `NEW_TEMPLATE_DAYS` hari, bawaan 14) dan "Diskon X%" (harga coret diisi Administrator di kartu Templates & Approval).
- TC-319: saat customer menyimpan perubahan atas versi buatan tim, versi tim disimpan sebagai titik pulih "Versi tim sebelum diubah customer" (selalu tampil di Revisions).
- TC-320: preview yang dilihat customer diberi watermark DRAFT sampai task Web Designer pada ordernya Done. Undangan publik tidak terpengaruh.
- TC-321: gradien transparan (memudar ke bawah/atas/kiri/kanan/semua tepi) pada Image & Our Gallery.
- TC-322: lightbox Our Gallery — klik foto, geser kanan-kiri (tombol, panah keyboard, swipe), efek hover.
- TC-323/325: beranda customer — sambutan, countdown hari pernikahan, kartu tim (CS & Web Designer, Chat dengan tim, WhatsApp CS).
- TC-324: form checkout wajib tanggal & jam pernikahan; order lama dapat mengisinya dari dashboard.
- TC-326: template pesan WhatsApp "Undangan digital" & "Reminder RSVP" di List Undangan (bisa diedit, `{nama}` & `{link}` terisi otomatis); kolom No. WhatsApp saat menambah tamu.
- TC-329: sisi visual ala Serein — 4 gaya nama CPP & CPW / teks pengantar dan gambar layer 2.

**Butuh konfirmasi QA**: TC-309 (perilaku padding yang diharapkan), TC-328 (lokasi & bukti shadow pemisah).

**Konfigurasi baru (opsional)**: `CS_WHATSAPP`, `NEW_TEMPLATE_DAYS`. Kolom DB baru dibuat otomatis: `orders.wedding_date`, `orders.wedding_time`, `templates.original_price`, `sites.last_saved_by`.

**Uji otomatis**: qa-integration 41/41, qa-layout 139/139, qa-db 38/38.

## 0.17.1 — 8 November 2026 (MoM 2 Nov + QC tambahan)

Persiapan beta testing ke user asli (W2 November).

**Prioritas MoM 2 November**
- IKR-01 (P0): `/workspace` dan halaman workspace lain tanpa login kini dialihkan ke halaman login. Dulu tampil kerangka Customer Workspace kosong; data tidak pernah bocor — 33 endpoint GET terautentikasi diuji dan semuanya menolak 401.
- IKR-02/03: website customer yang diisi dari template yang dibeli kini diberi penanda order & template, sehingga Template & Canvas menampilkan **satu card** per pembelian (dulu card "Sedang disiapkan" plus 1–2 card duplikat). Data lama ikut dirapikan saat ditampilkan.
- IKR-02: dashboard customer yang design-nya belum siap menampilkan "Design Anda sedang disiapkan" + nama template & no. order (dulu "Tambahkan Canvas dari menu Templates").
- IKR-02/04: nama contoh bawaan cover diganti netral ("Mempelai Wanita & Pria"); kartu Templates & Approval memberi label peringatan bila template masih memuat nama contoh ("Chyntia & Rian", "Aurelia & Reynard").
- IKR-05: catatan internal pada tiket dikirim lewat email ke CS / Web Designer lain yang ditugaskan pada order yang sama (handoff).
- IKR-08: CS dan Web Designer menerima email "Order baru untuk Anda" saat order dibayar, saat antrean dibagikan, dan saat Administrator reassign. Customer menerima email saat tiket berstatus In Progress dan Waiting Customer (dulu hanya live chat).
- IKR-09: pengirim email mendukung `SMTP_REPLY_TO`; preflight memperingatkan bila `SMTP_FROM` masih alamat developer / domain lokal.
- IKR-11: Orders (Administrator) — batas bayar, tombol **Cek ke Mayar**, dan **Hanguskan** untuk order belum bayar.

**QC tambahan 8 November**
- Favicon memakai ikon ikrarku (dipotong dari logo): `favicon.ico`, `favicon.png`, `apple-touch-icon.png`. Ikon Vite ungu dihapus.
- Password dari email akun otomatis bisa dipakai terus. Dialog login pertama kini opsional ("Tetap pakai password dari email"); email akun menjelaskan password tetap berlaku.
- Order yang tidak dibayar dalam 1x24 jam **hangus otomatis** (seperti marketplace). My Order menampilkan batas bayar + sisa waktu; order hangus berlabel "Hangus" dengan tombol Pesan ulang. Order Mayar dicek ke Mayar sebelum dihanguskan; pembayaran yang tetap masuk setelah hangus tetap diproses lunas. Atur lewat `ORDER_PAYMENT_HOURS` (bawaan 24).

**Revisi 8 November (layout & konfigurasi)**
- Kartu Templates & Approval: info template selebar kartu, chip status di baris sendiri (wrap), peringatan nama contoh jadi kotak catatan; tombol aksi dua kolom di ponsel.
- Workspace responsif: di layar ≤ 900 px sidebar menjadi laci (tertutup bawaan, ada latar gelap, tertutup setelah memilih menu); filter status bisa digeser ke samping.
- Dokumentasi: langkah ganti akun Google SMTP & API Mayar (PANDUAN_DEPLOY_PRODUCTION bagian I).

**Pengujian**: qa:integration 40/40, qa:layout 137/137, qa:db 38/38, qa-browser 2/2, TypeScript + build lolos, oxlint 0 error.

## 0.16.0

- Fixed Buka Undangan text-color mismatch between Canvas Editor and Preview.
- Unified cover content position/width semantics across Editor and public renderer.
- Fixed right-aligned cover title being forced toward center by editor-only margins.
- Changed website design preview to use actual Canvas 01 only.
- Hid/contextualized dead Feature Width / Box Style controls for special features.
- Added v0.16 WYSIWYG source-contract QA.

# Changelog

## v0.14.0

- Role-based UX hardening from the v0.13 UX QA workbook.
- Added Customer My Project/order timeline and meaningful website-readiness checklist.
- Added Web Designer Undo/Redo, autosave, true Discard and Revision History.
- Added Administrator Audit Trail, safe role deletion and Article search.
- Added CS search, queue filters, unread state, SLA indicator, status workflow and richer order context.
- Removed public implementation/debug jargon and frontend demo account/customer fallback datasets.
- Added current-password reauthentication, resend verification and secure staging bootstrap password gate.
- Added v0.14 UX and expanded SQLite QA contracts.

## v0.13.0

- Corrected Website Design hierarchy so one applied template/design is represented by one card.
- Removed redundant active-client badge from Template & Canvas.

## v0.12.0

- QA/security hardening for RBAC, order access, public chat, uploads, payment safety and assignment flows.

## v0.11.0

- Fixed Live Chat so the sender-side message remains visible after API persistence.
- Separated Create Canvas and Create Template journeys.
- Removed URL configuration from Template Design workspace.
- Persisted Template Canvas structures in `templates.canvas_json`.
- Added Admin approval task refresh for pending Editor templates.
- Added database-backed sound notification preference for incoming tasks and chats.
- Added Show/Hide password controls.
- Added repeat-password validation and email verification before User login.
- Added verification email outbox and localhost verification helper.
- Redesigned landing Articles into catalog cards.
- Redesigned Article detail into a wide dedicated page.
- Required customer email and phone during checkout.
- Added Sign In and Register paths from checkout.
- Added Admin Orders & Revenue dashboard with quantity, nominal, customer, and assignment data.
- Added CSV and Excel-compatible order export.
- Added environment-configurable database, upload, and receipt paths.
- Added Docker multi-stage build, Compose volumes/healthcheck, Nginx sample, CI check, and staging deployment guide.

## v0.10.0

- Routed public and authenticated chat into the Customer Service inbound database.
- Added outbound User messaging for Admin, Editor, and Customer Service.
- Added centralized Template Approval tasks with Approve/Reject feedback and email notification.
- Added Published/Pending/Rejected template workflow display.
- Moved List Undangan into a dedicated Site Pages screen and removed Guest Book navigation.
- Added Canvas drag-and-drop ordering in Page Structure and the visual Canvas area.
- Added public website routes at `localhost:5173/<slug>` backed by SQLite.
- Expanded editable Buka Undangan copy and styling controls.
- Fixed Use Template so it creates new Canvas sections and opens the editor.
- Added custom-role permissions for template approval and outbound messaging.

## v0.9.0

- Migrated browser-only prototype data to Express API and SQLite.
- Added authentication, sessions, role permissions, templates, Article CMS, orders, tasks, conversations, media upload, PDF receipts, and email outbox.

## 0.15.0
- Canva/Figma UX benchmark hardening release.
- Reworked public landing into creation-first visual journey.
- Actual saved website-design mini preview.
- Feature object alignment and width controls.
- Feature Library search and duplicate.
- Fixed Greetings gradient rendering contract.
- Deep Buka Undangan icon/button/layout/transition controls.
- Added reduced-motion behavior and edge UX QA suite.
