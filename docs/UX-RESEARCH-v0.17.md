# Riset dan keputusan UX

Riset publik pada 14 September 2026, sebelum implementasi. Rekomendasi di bawah adalah adaptasi pola, bukan salinan desain/asset atau hasil pengujian pengguna.

| Referensi | Temuan | Penerapan pada Ikrarku |
| --- | --- | --- |
| [Joy — Wedding Website](https://withjoy.com/wedding-website/) | Penawaran wedding website, template dan pengelolaan tamu/RSVP ditempatkan dalam perjalanan yang mudah dipahami | Hero dengan tindakan utama, katalog desain, panduan tiga langkah, fitur undangan, FAQ |
| [Wix Studio — Positioning elements](https://support.wix.com/en/article/studio-editor-positioning-elements) | Posisi elemen, docking, margin dan perilaku responsif memberi designer kendali sekaligus menjaga hubungan dengan container | Pilihan scope column/canvas, docking 3×3, offset, mobile override dan reset inheritance |

## Landing page

Arah visual editorial: hijau tua, cream, headline serif, ruang putih dan ilustrasi botanical SVG. Identitas logo existing dipertahankan. Katalog memakai data backend, harga asli dan filter kategori. Template tanpa canvas diberi penanda ilustrasi gaya; tidak ada angka pelanggan/testimoni yang dibuat-buat. Artikel hanya ditampilkan bila Published.

CTA utama membawa pengunjung ke desain; CTA pendamping menjelaskan cara membuat undangan. Navigasi mobile memiliki label, expanded state dan Escape. FAQ menggunakan elemen details/summary, fokus terlihat dan skip link. Breakpoint mengubah grid menjadi satu kolom pada layar kecil.

Motion reveal memakai IntersectionObserver dan mengikuti prefers-reduced-motion. Ilustrasi tidak memakai animasi loop yang terus berjalan. Thumbnail tidak memulai playback audio/video. Chart dashboard dipisah secara lazy untuk mengurangi JavaScript awal, tetapi App utama masih perlu pemisahan lebih lanjut.

## Canvas untuk Web Designer

Flow layout tetap tersedia untuk konten yang perlu mengalir; posisi bebas digunakan bila designer mengaktifkannya. Sudut dan pusat dapat dipilih, dilanjutkan offset X dalam persen dan Y dalam pixel termasuk nilai negatif. Area posisi bisa column atau seluruh canvas. Mobile mewarisi desktop sampai override dibuat. UI menyediakan reset override.

Kontrol tambahan: lebar/tinggi, rotasi, layer, opacity, tampil/sembunyi per perangkat, durasi/delay/easing/repeat animasi. Cover dan sound memakai kontrol khususnya sendiri, sehingga kontrol posisi generik yang tidak berlaku disembunyikan. Ornamen image/icon/text dengan scope canvas turut ditampilkan pada opening cover; elemen interaktif tetap perlu diperiksa pada alur undangan terbuka.

Pola ini memberi fleksibilitas yang diminta untuk menempatkan gambar di sudut canvas. Desain bebas masih bisa menghasilkan overlap bila designer memilih ukuran/offset ekstrem; periksa desktop dan mobile sebelum publish. Belum ada klaim peningkatan conversion rate, Core Web Vitals atau kesetaraan visual semua fitur tanpa pengujian browser dan pengguna nyata.
