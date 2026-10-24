import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { designerStyle } from "../src/components/designerLayout.ts";

test("Image docks to either top corner with explicit inset and width", () => {
  for (const anchorX of ["left", "right"]) {
    const css = designerStyle({
      freePosition: true,
      anchorX,
      anchorY: "top",
      posX: 0,
      posY: 0,
      boxWidth: 20,
    });
    assert.equal(css[`--d-${anchorX}`], "0%");
    assert.equal(css[`--d-${anchorX === "left" ? "right" : "left"}`], "auto");
    assert.equal(css["--d-top"], "0px");
    assert.equal(css["--d-width"], "20%");
  }
});
test("Center docking accepts signed offsets; bottom docking preserves inset", () => {
  const center = designerStyle({
    freePosition: true,
    anchorX: "center",
    anchorY: "center",
    posX: -5,
    posY: 20,
  });
  assert.equal(center["--d-left"], "calc(50% + -5%)");
  assert.equal(center["--d-top"], "calc(50% + 20px)");
  assert.equal(center["--d-translate"], "-50% -50%");
  const bottom = designerStyle({
    freePosition: true,
    anchorY: "bottom",
    posY: 40,
  });
  assert.equal(bottom["--d-top"], "auto");
  assert.equal(bottom["--d-bottom"], "40px");
});
test("Mobile inherits desktop and can override independently without mutating stored data", () => {
  const feature = {
    freePosition: true,
    anchorX: "right",
    posX: 2,
    boxWidth: 25,
    mobileLayout: { anchorX: "left", boxWidth: 45 },
  };
  const snapshot = structuredClone(feature),
    css = designerStyle(feature);
  assert.equal(css["--d-right"], "2%");
  assert.equal(css["--m-left"], "2%");
  assert.equal(css["--d-width"], "25%");
  assert.equal(css["--m-width"], "45%");
  assert.deepEqual(feature, snapshot);
  assert.equal(
    designerStyle({ ...feature, mobileLayout: undefined })["--m-right"],
    "2%",
  );
});
test("Nonfinite and out-of-range persisted values produce bounded valid CSS", () => {
  const css = designerStyle({
    freePosition: true,
    posX: NaN,
    posY: Infinity,
    rotation: 700,
    boxWidth: 0,
    opacity: 250,
    layer: -3,
    motionDuration: 0,
    motionRepeat: 100,
  });
  assert.equal(css["--d-left"], "5%");
  assert.equal(css["--d-top"], "12px");
  assert.equal(css["--d-rotate"], "180deg");
  assert.equal(css["--d-width"], "5%");
  assert.equal(css["--designer-opacity"], 1);
  assert.equal(css["--designer-layer"], 0);
  assert.equal(css["--motion-duration"], "100ms");
  assert.equal(css["--motion-repeat"], 10);
});
test("Flow layout has no absolute positioning variables and keeps custom motion", () => {
  const css = designerStyle({
    freePosition: false,
    motionDuration: 1200,
    motionDelay: 300,
    motionRepeat: 2,
    motionEasing: "linear",
    opacity: 55,
  });
  assert.equal(css["--d-left"], undefined);
  assert.equal(css["--motion-duration"], "1200ms");
  assert.equal(css["--motion-delay"], "300ms");
  assert.equal(css["--motion-easing"], "linear");
  assert.equal(css["--designer-opacity"], 0.55);
});

// ---------------------------------------------------------------------------
// Revisi QA 10 Okt 2026 — kontrak CSS/TSX yang mudah hilang saat refactor.
// Dibaca dari sumber langsung: ketiga bug di bawah lolos typecheck, jadi hanya
// assertion eksplisit yang mencegahnya kembali.
// ---------------------------------------------------------------------------
const appTsx = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
const appCss = readFileSync(new URL("../src/App.css", import.meta.url), "utf8");
const apiTs = readFileSync(new URL("../src/api.ts", import.meta.url), "utf8");

/** Ambil blok deklarasi untuk selector persis (tanpa regex multi-baris rapuh). */
// Komentar dibuang dulu; kalau tidak, teks komentar ikut terbawa ke dalam
// bagian selector dan perbandingan persisnya selalu gagal.
const cssNoComments = appCss.replace(/\/\*[\s\S]*?\*\//g, "");
const declarationsFor = (selector) =>
  cssNoComments
    .split("}")
    .map((block) => block.split("{"))
    .filter(([head]) => head.split(",").some((s) => s.trim() === selector))
    .map(([, body]) => (body || "").trim());

test("Warna per Elemen Buka Undangan tidak dikunci !important", () => {
  // color:inherit!important pada stylesheet mengalahkan inline style, sehingga
  // titleColor/bodyColor tidak pernah terpakai pada cover.
  for (const selector of [
    ".cover-content>h1",
    ".cover-content>small",
    ".cover-content>span",
    ".cover-feature-editor",
  ])
    for (const body of declarationsFor(selector))
      assert.equal(
        /color\s*:\s*inherit\s*!important/.test(body),
        false,
        `${selector} masih memaksa color:inherit!important`,
      );
  assert.match(appTsx, /active\.titleColor\s*\?\s*\{\s*color:\s*active\.titleColor/);
  assert.match(appTsx, /active\.bodyColor\s*\?\s*\{\s*color:\s*active\.bodyColor/);
});

test("Ornamen pojok tetap di atas semua background layer, di bawah konten", () => {
  const decoration = declarationsFor(".section-decoration").join(";");
  const zIndex = Number(/z-index\s*:\s*(-?\d+)/.exec(decoration)?.[1]);
  // Layer dibatasi 3 oleh Math.min(1 + layerIndex, 3); konten memakai 5.
  assert.ok(zIndex > 3 && zIndex < 5, `z-index ornamen = ${zIndex}`);
  assert.match(appTsx, /zIndex:\s*Math\.min\(1 \+ layerIndex, 3\)/);
});

test("Flip & skala ornamen dipasang pada anak, bukan pada elemen beranimasi", () => {
  // Keyframes .loop-* menganimasikan transform pada .section-decoration dan
  // mengalahkan transform apa pun di elemen yang sama.
  assert.match(appTsx, /"--deco-flip":\s*decoration\.flip \? -1 : 1/);
  assert.equal(
    /transform:\s*decoration\.flip/.test(appTsx),
    false,
    "flip ornamen kembali dipasang inline pada elemen beranimasi",
  );
  // Rotasi (TC-186) ikut dirangkai di properti transform yang sama. Sejak
  // TC-221 rangkaian itu didahului penambat pojok & skala, jadi yang dikunci
  // adalah urutan ujungnya: rotasi lalu cermin, keduanya di elemen anak.
  assert.match(
    appCss,
    /\.section-decoration>svg[^}]*transform:[^;}]*rotate\(var\(--deco-rotate,0deg\)\) scaleX\(var\(--deco-flip,1\)\)/,
  );
});

test("Preview tidak memakai background terkunci viewport", () => {
  // background-attachment:fixed memakai ukuran layar, bukan kotak preview,
  // sehingga isinya terpotong makin banyak di layar lebar.
  assert.match(
    appTsx,
    /allowFixedBackground\s*=\s*!thumbnail && !editable && !previewSurface/,
  );
});

test("Full-bleed 100vw dinetralkan di dalam shell preview", () => {
  for (const shell of [
    ".preview-full-stage",
    ".actual-template-preview-shell",
    ".template-dialog-actual-preview.live",
  ])
    assert.ok(
      appCss.includes(`${shell} .gallery-grid.full-width`),
      `${shell} belum menetralkan gallery full-width`,
    );
});

test("Inspector membaca nilai device yang sedang aktif", () => {
  // Tanpa ini setiap kontrol menampilkan angka Desktop walau mode Mobile aktif,
  // editDevice = previewMode, kecuali Desktop + tata letak Kolom (isi Mobile).
  // dan read-modify-write menimpa override Mobile dengan isi Desktop.
  assert.match(appTsx, /resolveSection\(rawSelectedSection, editDevice\)/);
  assert.match(appTsx, /resolveFeature\(raw, editDevice\)/);
});

test("Ornamen & layer ditulis dari state terbaru, bukan array tertangkap", () => {
  assert.match(appTsx, /const updateSectionLive = \(/);
  assert.match(appTsx, /decorations: produce\(current\.decorations \|\| \[\]\)/);
  assert.match(
    appTsx,
    /backgroundLayers: produce\(current\.backgroundLayers \|\| \[\]\)/,
  );
});

test("History undo dikelompokkan agar slider tidak membekukan editor", () => {
  assert.match(appTsx, /HISTORY_COALESCE_MS/);
  assert.match(
    appTsx,
    /now - lastHistoryAtRef\.current > HISTORY_COALESCE_MS/,
  );
});

test("Catatan internal memakai bubble kontras, bukan hijau tua", () => {
  const bubble = declarationsFor(".cs-message.internal-note p").join(";");
  assert.match(bubble, /background:#fdf1d9/);
  assert.match(bubble, /color:#43340e/);
});

test("Canvas Editor tidak memuat Live Chat maupun disc backsound", () => {
  assert.match(appTsx, /soundFeature && !editable \?/);
  // TC-223 — tidak ada tombol melayang; panel chat hanya saat customer
  // menekan "Hubungi Support".
  assert.match(appTsx, /Canvas Editor sengaja tidak memuat tombol Live Chat yang melayang/);
  assert.match(appTsx, /\{role === "User" && chatWidgetOpen && \(\n\s*<ChatWidget/);
});

// ---------------------------------------------------------------------------
// QA UPDATE_QA_IKRARKU.ID_7 — TC-186..TC-203.
// Hanya TC yang baru pada batch ini; sisanya sudah dikunci di blok sebelumnya.
// ---------------------------------------------------------------------------

test("TC-186 ornamen punya kontrol rotasi dan dipakai saat render", () => {
  assert.match(appTsx, /rotation\?: number; \/\/ TC-186/);
  assert.match(appTsx, /patch\(item\.id, \{ rotation: Number\(event\.target\.value\) \}\)/);
  assert.match(appTsx, /"--deco-rotate":\s*`\$\{decoration\.rotation \?\? 0\}deg`/);
});

test("TC-193 ukuran eyebrow / label tamu / nama tamu bisa diatur", () => {
  for (const field of [
    "eyebrowFontSize",
    "guestLabelFontSize",
    "guestNameFontSize",
  ])
    assert.match(appTsx, new RegExp(`${field}\\?: number`), `${field} belum ada`);
  // Dipasang di renderer live DAN editor, supaya WYSIWYG.
  assert.match(appTsx, /active\.eyebrowFontSize\s*\?\s*\{ fontSize: active\.eyebrowFontSize \}/);
  assert.match(appTsx, /feature\.eyebrowFontSize\s*\n?\s*\?\s*\{ fontSize: feature\.eyebrowFontSize \}/);
  // Live sebelumnya tidak memakai bodyFontSize sama sekali.
  assert.match(appTsx, /active\.bodyFontSize\s*\n?\s*\?\s*\{ fontSize: active\.bodyFontSize \}/);
});

test("TC-194 upload background memberi konfirmasi dan bisa dihapus", () => {
  assert.match(appTsx, /backgroundName\?: string/);
  assert.match(appTsx, /className="background-media-card"/);
  // Tanpa reset, memilih berkas yang sama setelah dihapus tidak memicu onChange.
  assert.match(appTsx, /event\.target\.value = "";\s*\n\s*void uploadBackground\(file\)/);
  // Hapus harus ikut membuang rasio, kalau tidak tinggi canvas tetap terkunci.
  assert.match(appTsx, /backgroundAspect: undefined,\s*\n\s*backgroundFollowAspect: false/);
});

test("TC-197 Background Utama canvas digambar di atas background global", () => {
  assert.match(
    appTsx,
    /backgroundLayers: \[\s*\n\s*\.\.\.\(source\.backgroundLayers \|\| \[\]\),\s*\n\s*\.\.\.\(section\.backgroundLayers \|\| \[\]\),/,
  );
});

test("TC-198 posisi player backsound dapat diatur di dalam canvas", () => {
  assert.match(appTsx, /soundVerticalAlign\?: "top" \| "center" \| "bottom"/);
  assert.match(appTsx, /"--sound-offset-x"/);
  assert.match(appTsx, /sound-vpos-\$\{feature\.soundVerticalAlign \|\| "bottom"\}/);
  assert.match(appCss, /\.fixed-sound-disc\.sound-vpos-top\{top:var\(--sound-offset-y,22px\)/);
});

test("TC-199 Line spacing tahan terhadap desain lama tanpa lineHeight", () => {
  // `feature.lineHeight.toFixed(2)` melempar TypeError pada data lama dan
  // membuat seluruh inspector berhenti dirender.
  // Dicari di kode saja; komentar penjelas di bawah ini juga menyebut pola itu.
  const appTsxCode = appTsx
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
  assert.equal(
    /feature\.lineHeight\.toFixed/.test(appTsxCode),
    false,
    "pembacaan lineHeight kembali tanpa pengaman",
  );
  assert.match(appTsx, /lineHeight: feature\.lineHeight \?\? defaultFeatureStyle\.lineHeight/);
  // Cover mengunci line-height:1.05 di CSS, jadi nilainya dipasang inline.
  assert.match(appTsx, /lineHeight: active\.lineHeight \?\? undefined/);
});

test("TC-200 durasi siklus tidak menghapus efek background", () => {
  // Patch dari LoopEffectControls hanya berisi satu kunci; menyalin keduanya
  // menulis `undefined` dan mereset efek ke "Tidak Ada".
  assert.match(
    appTsx,
    /patch\.loopEffect !== undefined\s*\n?\s*\?\s*\{ backgroundLoopEffect: patch\.loopEffect \}/,
  );
  assert.match(
    appTsx,
    /patch\.loopSpeed !== undefined\s*\n?\s*\?\s*\{ backgroundLoopSpeed: patch\.loopSpeed \}/,
  );
});

test("TC-202 isi blok mengikuti tinggi bebas, bukan menahannya", () => {
  assert.match(appTsx, /data-fixed-height=\{\s*\n?\s*feature\.freePosition && feature\.boxHeight \? "true" : undefined/);
  assert.match(
    appCss,
    /\.feature-block\[data-fixed-height\] \.image-feature[^}]*height:100%!important/,
  );
  // Minimum height adalah kontrol mati saat rasio background aktif.
  assert.match(appTsx, /section\.backgroundFollowAspect && section\.backgroundAspect \? \(/);
});

// ---------------------------------------------------------------------------
// SEO Jurnal ikrarku — artikel punya URL sendiri dan meta yang bisa dirayapi.
// ---------------------------------------------------------------------------
const serverMjs = readFileSync(
  new URL("../server/index.mjs", import.meta.url),
  "utf8",
);
const landingCss = readFileSync(new URL("../src/components/LandingPage.css", import.meta.url), "utf8");
const landingTsx = readFileSync(
  new URL("../src/components/LandingPage.tsx", import.meta.url),
  "utf8",
);

test("SEO: artikel punya URL /articles/<slug> dan deep link dua segmen", () => {
  // Parser lama hanya menangani SATU segmen, jadi alamat artikel yang punya
  // dua segmen jatuh ke lookup public site lalu 404.
  assert.match(
    appTsx,
    /pathParts\[0\] === ARTICLE_PATH_SEGMENT \|\| pathParts\[0\] === "jurnal"/,
  );
  // Satu sumber kebenaran untuk ruas pertama; dipakai juga oleh og:url sisi
  // klien, dan harus sama dengan ARTICLE_PATH_PREFIX di server.
  assert.match(appTsx, /const ARTICLE_PATH_SEGMENT = "articles"/);
  assert.match(
    appTsx,
    /const articleHref = \(slug: string\) =>\n\s*`\/\$\{ARTICLE_PATH_SEGMENT\}\/\$\{encodeURIComponent\(slug\)\}`/,
  );
  // Daftar jurnalnya TETAP /jurnal — dua alamat yang sengaja berbeda.
  assert.match(appTsx, /journal: "\/jurnal",/);
  assert.match(appTsx, /const \[articleSlug, setArticleSlug\] = useState<string \| null>\(null\)/);
  // Reader tidak boleh kembali ke useState lokal: itu membuat URL tidak berubah.
  assert.equal(
    /const \[article, setArticle\] = useState<ArticleItem \| null>\(null\)/.test(appTsx),
    false,
    "ArticleReaderPage kembali dikendalikan state lokal; URL tidak akan berubah",
  );
});

test("SEO: kartu jurnal adalah anchor, bukan button", () => {
  // Crawler mengikuti <a href>. Sebuah <button> tidak terlihat sebagai tautan,
  // dan pengguna tidak bisa klik-tengah atau menyalin alamatnya.
  assert.match(landingTsx, /href=\{`\/articles\/\$\{encodeURIComponent\(article\.slug\)\}`\}/);
  assert.match(landingTsx, /className="ikr-journal-card"\s*\n\s*href=/);
  // Tautan daftar pada navigasi tetap menunjuk /jurnal.
  assert.match(landingTsx, /href="\/jurnal"/);
});

test("SEO: server menyuntikkan meta per artikel ke HTML mentah", () => {
  // Crawler pratinjau tautan (WhatsApp, Facebook, X, LinkedIn) tidak
  // menjalankan JavaScript, jadi meta sisi klien saja tidak cukup.
  assert.match(serverMjs, /app\.get\(`\$\{ARTICLE_PATH_PREFIX\}\/:slug`/);
  assert.match(serverMjs, /const ARTICLE_PATH_PREFIX = "\/articles"/);
  for (const tag of [
    "og:title",
    "og:description",
    "og:image",
    "og:url",
    "article:published_time",
    "twitter:card",
  ])
    assert.ok(
      serverMjs.includes(tag),
      `meta ${tag} hilang dari injeksi server`,
    );
  assert.match(serverMjs, /rel="canonical"/);
  assert.match(serverMjs, /application\/ld\+json/);
  // Hanya artikel terbit yang boleh bocor ke meta.
  assert.match(serverMjs, /WHERE a\.slug=\? AND a\.status='Published'/);
  // Judul & excerpt ditulis pengguna: wajib di-escape sebelum masuk atribut.
  assert.match(serverMjs, /content="\$\{escapeHtml\(summary\)\}"/);
  // Rute spesifik harus terdaftar SEBELUM catch-all, karena Express
  // mencocokkan sesuai urutan pendaftaran.
  assert.ok(
    serverMjs.indexOf("app.get(`${ARTICLE_PATH_PREFIX}/:slug`") <
      serverMjs.indexOf("app.use(express.static(DIST_DIR))"),
    "rute artikel terdaftar setelah catch-all dan tidak akan pernah cocok",
  );
});

test("SEO: alamat lama /jurnal/<slug> dialihkan 301, bukan dimatikan", () => {
  // Tautan yang sudah tersebar atau terindeks harus tetap sampai. 301
  // memindahkan nilai SEO-nya ke alamat baru; 404 membuangnya.
  assert.match(
    serverMjs,
    /app\.get\(`\$\{LEGACY_ARTICLE_PATH_PREFIX\}\/:slug`, \(req, res\) =>\n\s*res\.redirect\(301, articlePath\(req\.params\.slug\)\)/,
  );
  assert.match(serverMjs, /const LEGACY_ARTICLE_PATH_PREFIX = "\/jurnal"/);
  // Redirect harus lebih dulu daripada rute barunya agar urutan Express benar.
  assert.ok(
    serverMjs.indexOf("app.get(`${LEGACY_ARTICLE_PATH_PREFIX}/:slug`") <
      serverMjs.indexOf("app.get(`${ARTICLE_PATH_PREFIX}/:slug`"),
  );
  // Klien tetap menerima alamat lama kalau proxy belum mengalihkan.
  assert.match(appTsx, /parts\[0\] === ARTICLE_PATH_SEGMENT \|\| parts\[0\] === "jurnal"/);
});

test("SEO: canonical, og:url, dan sitemap memakai satu bentuk alamat", () => {
  // Alamat yang berbeda antara ketiganya membuat crawler melihat dua
  // halaman berbeda dengan isi sama.
  assert.match(serverMjs, /const url = `\$\{PUBLIC_BASE_URL\}\$\{articlePath\(article\.slug\)\}`/);
  assert.match(serverMjs, /`\$\{PUBLIC_BASE_URL\}\$\{articlePath\(row\.slug\)\}`/);
  assert.match(appTsx, /const url = `\$\{origin\}\/articles\/\$\{encodeURIComponent\(article\.slug\)\}`/);
  // Daftar jurnal tetap ikut sitemap pada alamatnya sendiri.
  assert.match(serverMjs, /\["\/jurnal", "0\.8"\]/);
});

test("SEO: robots.txt & sitemap.xml tersedia", () => {
  assert.match(serverMjs, /app\.get\("\/robots\.txt"/);
  assert.match(serverMjs, /app\.get\("\/sitemap\.xml"/);
  assert.match(serverMjs, /WHERE status='Published' ORDER BY/);
});

test("SEO: PATCH artikel menormalkan slug dan menjaga tanggal terbit", () => {
  // Slug ikut URL publik, jadi tidak boleh menerima spasi/huruf besar, dan
  // bentrok UNIQUE dulu melempar 500.
  assert.match(serverMjs, /if \(!nextSlug\) nextSlug = row\.slug;/);
  assert.match(serverMjs, /SELECT 1 FROM articles WHERE slug=\? AND id<>\?/);
  // published_at dulu di-null-kan saat artikel dikembalikan ke Draft.
  assert.match(
    serverMjs,
    /next\.status === "Published" \? row\.published_at \|\| now\(\) : row\.published_at/,
  );
});

test("SEO: tanggal artikel tidak lagi ISO mentah", () => {
  assert.match(appTsx, /function formatArticleDate\(value: string\)/);
  assert.match(appTsx, /<time dateTime=\{article\.date\}>/);
});

// =====================================================================
// Retest lanjutan — empat temuan QA setelah TC-186..TC-203 dinyatakan Pass.
// =====================================================================

test("Retest-1: menutup artikel dari landing membersihkan URL artikel", () => {
  // appPaths hanya memuat ruas pertama, sehingga pathname artikel yang punya
  // dua ruas tidak pernah dikenali sebagai milik aplikasi dan URL tetap
  // menunjuk artikel padahal daftar/landing yang tampil. Kedua prefiks
  // (baru dan lama) harus dikenali.
  assert.match(
    appTsx,
    /const isArticlePathname = new RegExp\(\n\s*`\^\/\(\$\{ARTICLE_PATH_SEGMENT\}\|jurnal\)\/\[\^\/\]\+\/\?\$`,\n\s*\)\.test\(window\.location\.pathname\)/,
  );
  assert.match(
    appTsx,
    /\(appPaths\.has\(window\.location\.pathname\) \|\| isArticlePathname\)/,
  );
  // Membuka artikel dari landing harus menambah entri history, supaya Back
  // browser menutup artikel dan tidak melempar pengguna keluar situs.
  const landingBranch = appTsx.slice(
    appTsx.indexOf('if (view === "landing") {'),
  );
  const articleUrlBlock = landingBranch.slice(
    0,
    landingBranch.indexOf("return;"),
  );
  assert.match(articleUrlBlock, /window\.history\.pushState\(/);
  assert.equal(
    /window\.history\.replaceState\(window\.history\.state, "", articleUrl\)/.test(
      articleUrlBlock,
    ),
    false,
    "URL artikel dari landing kembali memakai replaceState; Back akan keluar dari situs",
  );
});

test("Retest-2a: Edit dari card Website Design tidak memaksa mode site", () => {
  // Card "Template pada website" dibentuk dari `sections` yang sedang dimuat,
  // termasuk saat yang dibuka adalah template milik Web Designer sendiri.
  // Memaksa mode "site" memunculkan kolom slug untuk sesuatu tanpa URL publik.
  assert.match(
    appTsx,
    /setEditorMode\(siteOwnerUserId \? "site" : "template"\);\n\s*sessionStorage\.setItem\("ikrarku-edit-canvas"/,
  );
  // Simpan dalam mode template menulis ke selectedTemplate, jadi card wajib
  // mengirim template miliknya sendiri.
  assert.match(appTsx, /editCanvas\(design\.sections\[0\]\.id, design\.template\)/);
  assert.match(
    appTsx,
    /editCanvas: \(sectionId: string, template\?: Template\) => void;/,
  );
});

test("Retest-2b: tinggi kotak preview mengikuti tinggi canvas, bukan rasio tetap", () => {
  assert.match(appTsx, /const \[contentHeight, setContentHeight\] = useState\(0\)/);
  assert.match(
    appTsx,
    /Math\.min\(Math\.round\(\(contentHeight \* width\) \/ 800\), maxViewportHeight\)/,
  );
  assert.match(
    appTsx,
    /className="actual-render-viewport" style=\{\{ height: viewportHeight \}\}/,
  );
  assert.equal(
    /className="actual-render-viewport" style=\{\{ height: width \* 1\.25 \}\}/.test(
      appTsx,
    ),
    false,
    "kotak preview kembali memakai rasio tetap 4:5 dan menyisakan area kosong",
  );
});

test("Retest-3: Heading 2 & Supporting Text 2 ikut dirender cover live", () => {
  // Di editor cover lewat FeatureBlock (punya secondaryTexts); di live &
  // preview lewat InvitationCover, yang dulu tidak merender keduanya.
  const cover = appTsx.slice(
    appTsx.indexOf("function InvitationCover({"),
    appTsx.indexOf("function FeatureBlock({"),
  );
  assert.ok(cover.length > 0, "InvitationCover tidak ditemukan");
  assert.match(cover, /active\.showTitle2 \|\| active\.showBody2/);
  assert.match(cover, /\{active\.title2\}/);
  assert.match(cover, /\{active\.body2\}/);
  // Ukuran & warna per-elemen harus sama dengan jalur editor.
  for (const field of [
    "title2FontSize",
    "body2FontSize",
    "title2Color",
    "body2Color",
  ])
    assert.ok(cover.includes(field), `cover live tidak memakai ${field}`);
  // Kelasnya sama dengan editor supaya tampilannya tidak berbeda.
  assert.match(cover, /editable-title editable-title-2/);
  assert.match(cover, /editable-body editable-body-2/);
});

test("Retest-4: Animasi Layer Background benar-benar menggerakkan layer", () => {
  // Kelas loop-* dulu hanya pada background utama, padahal keterangan
  // kontrolnya menjanjikan layer tumpang tindih juga bergerak.
  assert.match(
    appTsx,
    /className=\{`background-extra-layer [^`]*loop-\$\{backgroundLoop \|\| "none"\}`\}/,
  );
  // Slider "Durasi siklus" dulu tidak dipasang ke mana pun.
  assert.match(appTsx, /"--loop-speed": `\$\{section\.backgroundLoopSpeed \|\| 6\}s`/);
  // Skala & opacity layer dipasang inline; animasi mengalahkan inline style,
  // jadi nilainya harus ikut lewat custom property.
  assert.match(appTsx, /"--layer-scale": \(layer\.scale \?\? 100\) \/ 100/);
  assert.match(appTsx, /"--layer-opacity": \(layer\.opacity \?\? 100\) \/ 100/);
  for (const name of [
    "layerLoopFade",
    "layerLoopFloat",
    "layerLoopSway",
    "layerLoopPulse",
    "layerLoopDrift",
  ])
    assert.ok(
      appCss.includes(`@keyframes ${name}`),
      `keyframes ${name} hilang; skala/opacity layer akan direset saat animasi`,
    );
  assert.match(appCss, /@keyframes layerLoopFloat\{[^}]*scale\(var\(--layer-scale,1\)\)/);
  assert.match(appCss, /@keyframes layerLoopFade\{0%,100%\{opacity:var\(--layer-opacity,1\)\}/);
  // Transform yang dianimasikan mematahkan background-attachment:fixed.
  assert.match(
    appTsx,
    /const backgroundLoopMovesLayer = backgroundLoop\n?\s*\? \["float", "sway", "pulse", "drift"\]\.includes\(backgroundLoop\)/,
  );
  assert.match(
    appTsx,
    /layer\.fixed &&\n\s*allowFixedBackground &&\n\s*!backgroundLoopMovesLayer/,
  );
  // Editor harus menyatakan layer mana yang terkena efek.
  assert.match(
    appTsx,
    /Berlaku untuk Layer 1 dan seluruh layer di bawah ini sekaligus\./,
  );
  assert.match(appCss, /\.layout-help\.is-muted\{/);
});

test("Retest-5: Template workspace tampil sebagai SATU card, bukan satu per canvas", () => {
  // Canvas yang ditambahkan lewat tombol + di Template workspace dulu tidak
  // membawa penanda grup apa pun, sehingga buildWebsiteDesignGroups jatuh ke
  // kunci `custom-${section.id}` dan setiap canvas jadi card "Custom Design"
  // sendiri-sendiri.
  assert.match(appTsx, /singleGroup = false,\n\) \{\n\s*if \(singleGroup\)/);
  assert.match(
    appTsx,
    /buildWebsiteDesignGroups\(\n\s*sections,\n\s*templateCatalog,\n\s*selectedTemplate,\n\s*editorMode === "template",\n\s*\)/,
  );
  // Penandaan saat canvas dibuat, supaya grup tetap utuh setelah disimpan
  // dan dibuka lagi.
  assert.match(
    appTsx,
    /templateInstanceId:\n\s*anchor\?\.templateInstanceId \|\| `template-\$\{selectedTemplate\.id\}`/,
  );
  assert.match(
    appTsx,
    /sourceTemplateId: anchor\?\.sourceTemplateId \|\| selectedTemplate\.id/,
  );
  // Penanda ini tidak boleh bocor ke instance customer.
  const builder = appTsx.slice(
    appTsx.indexOf("function buildSectionsFromTemplate"),
    appTsx.indexOf("function buildTemplateSections"),
  );
  assert.match(builder, /const templateInstanceId = uid\("template-instance"\)/);
  assert.match(builder, /sourceTemplateId: template\.id/);
});

test("Retest-6: layer yang bergerak tidak menyingkap tepi canvas", () => {
  // .background-extra-layer memenuhi section persis (inset:0). Begitu
  // digeser/diputar, tepi section terlihat sebagai celah.
  assert.match(
    appCss,
    /\.background-extra-layer\.loop-float,\n\.background-extra-layer\.loop-sway,\n\.background-extra-layer\.loop-drift\{inset:-16px\}/,
  );
  // Arah slider durasi harus terbaca: 20s adalah paling LAMBAT, dan dulu
  // dikira "paling banyak" lalu efeknya disangka tidak berfungsi.
  assert.match(appTsx, /2s · paling cepat/);
  assert.match(appTsx, /20s · paling lambat/);
  assert.match(appCss, /label\.range-field>\.range-scale\{/);
});

test("Retest-7: background global tidak menimpa animasi layer milik canvas", () => {
  // applyGlobalBackground() dulu selalu memakai backgroundLoopEffect Canvas 1.
  // Efek yang dipilih di Canvas 2+ tersimpan dan tampil di panel Advanced,
  // tetapi renderer membacanya dari Canvas 1 yang biasanya "Tidak ada" —
  // kontrolnya terlihat sama sekali tidak berfungsi. Pola yang sama dengan
  // TC-195/196: sisi tulis benar, sisi baca salah.
  const fn = appTsx.slice(
    appTsx.indexOf("function applyGlobalBackground("),
    appTsx.indexOf("// QA TC-141 — preset bentuk button"),
  );
  assert.ok(fn.length > 0, "applyGlobalBackground tidak ditemukan");
  assert.match(
    fn,
    /backgroundLoopEffect:\n\s*section\.backgroundLoopEffect && section\.backgroundLoopEffect !== "none"\n\s*\? section\.backgroundLoopEffect\n\s*: source\.backgroundLoopEffect/,
  );
  assert.match(
    fn,
    /backgroundLoopSpeed:\n\s*section\.backgroundLoopEffect && section\.backgroundLoopEffect !== "none"\n\s*\? section\.backgroundLoopSpeed\n\s*: source\.backgroundLoopSpeed/,
  );
  // Nilai global tetap jadi cadangan, bukan dibuang.
  assert.ok(
    fn.includes("source.backgroundLoopEffect"),
    "animasi global hilang sebagai fallback",
  );
  // Layer canvas ini memang digabung, bukan dibuang — dasar kenapa canvas
  // ini berhak punya animasinya sendiri.
  assert.match(
    fn,
    /backgroundLayers: \[\n\s*\.\.\.\(source\.backgroundLayers \|\| \[\]\),\n\s*\.\.\.\(section\.backgroundLayers \|\| \[\]\),\n\s*\]/,
  );
});

test("Mayar: kegagalan membuat invoice meninggalkan jejak di log", () => {
  // 502 di browser punya DUA penyebab yang sangat berbeda — Nginx saat
  // upstream mati, dan aplikasi sendiri saat Mayar menolak. Tanpa log,
  // keduanya tidak bisa dibedakan dan alasan penolakan Mayar hilang.
  assert.match(
    serverMjs,
    /console\.error\(\n\s*`\[mayar\] invoice\/create GAGAL · order=\$\{order\.order_no\} · HTTP \$\{response\.status\} · \$\{reason\}`/,
  );
  // Respons diterima tapi bentuknya tidak dikenali: nama field dicatat agar
  // perubahan kontrak (V1 -> V2) langsung terlihat.
  assert.match(serverMjs, /invoice\/create OK tapi tanpa payment URL/);
  assert.match(serverMjs, /field teratas: \[\$\{Object\.keys\(data \|\| \{\}\)\.join\(", "\)\}\]/);
  // Gagal jaringan (DNS/timeout/TLS) tidak lewat cabang di atas.
  assert.match(serverMjs, /\[mayar\] pembayaran gagal · order=\$\{order\.order_no\}/);
  // Rahasia tidak boleh ikut tercatat.
  const logLines = serverMjs
    .split("\n")
    .filter((line) => line.includes("[mayar]"));
  assert.ok(logLines.length >= 3, "jejak log Mayar berkurang");
  for (const line of logLines)
    assert.equal(
      /MAYAR_API_KEY|\bkey\b|Bearer/.test(line),
      false,
      `baris log berisiko membocorkan kredensial: ${line.trim()}`,
    );
});

test("Mayar: panggilan invoice punya batas waktu, tidak menggantung", () => {
  // Tanpa batas waktu, fetch ke Mayar bisa menunggu selamanya: tombol Bayar
  // tetap "Memproses pembayaran…", Nginx menyerah sendiri setelah
  // proxy_read_timeout dan membalas 502 — sementara proses kita masih
  // menunggu, sehingga TIDAK ADA baris log sama sekali. Gejalanya sama
  // persis dengan Mayar menolak, padahal penyebabnya berbeda.
  const fn = serverMjs.slice(
    serverMjs.indexOf("async function createMayarInvoice("),
    serverMjs.indexOf("app.post(\n  \"/api/orders/:id/pay\""),
  );
  assert.ok(fn.length > 0, "createMayarInvoice tidak ditemukan");
  assert.match(fn, /signal: AbortSignal\.timeout\(timeoutMs\)/);
  assert.match(
    fn,
    /const timeoutMs = Number\(process\.env\.MAYAR_TIMEOUT_MS \|\| 15000\)/,
  );
  // Harus lebih pendek daripada proxy_read_timeout Nginx (bawaan 60 detik),
  // supaya yang menyerah lebih dulu adalah kita dan alasannya tercatat.
  const fallback = Number(/MAYAR_TIMEOUT_MS \|\| (\d+)/.exec(fn)?.[1]);
  assert.ok(
    fallback > 0 && fallback < 60000,
    `batas waktu ${fallback} ms tidak lebih pendek dari timeout Nginx`,
  );
  // Timeout harus dikenali dan dicatat, bukan jatuh ke pesan umum.
  assert.match(fn, /error\.name === "TimeoutError" \|\| error\.name === "AbortError"/);
  assert.match(fn, /\[mayar\] invoice\/create TIDAK MENJAWAB · order=\$\{order\.order_no\}/);
  // 504 membedakannya dari 502 "Mayar menolak" pada tab Network.
  assert.match(fn, /\{ status: 504 \}/);
});

test("Mayar: extraData tidak dikirim — Mayar menolaknya dengan 400", () => {
  // Mayar menjawab "extraData Validation Error" untuk SELURUH permintaan,
  // jadi setiap tombol Bayar berakhir 502. Field itu tidak menanggung apa
  // pun: pencocokan order memakai transactionId dari respons create yang
  // disimpan di orders.gateway_ref.
  const fn = serverMjs.slice(
    serverMjs.indexOf("async function createMayarInvoice("),
    serverMjs.indexOf("app.post(\n  \"/api/orders/:id/pay\""),
  );
  assert.ok(fn.length > 0, "createMayarInvoice tidak ditemukan");
  assert.equal(
    /^\s*extraData:/m.test(fn),
    false,
    "extraData dikirim lagi ke Mayar; permintaannya akan ditolak 400",
  );
  // Alasannya harus tetap tertulis, supaya tidak dipasang ulang "karena
  // kelihatannya hilang".
  assert.match(fn, /extraData.*SENGAJA TIDAK DIKIRIM/s);
  // gateway_ref tetap jalur pencocokan utamanya.
  assert.match(serverMjs, /gateway_ref=\?/);
});

// =====================================================================
// QA 15 Oktober 2026 — MoM A4, Titip QC, TC-205/206/209/210/214/221, Credit
// =====================================================================

test("A4: musik dijeda saat tab disembunyikan dan dilanjutkan saat kembali", () => {
  // Semua pemutaran lewat createSoundPlayback; aturannya dipasang sekali di sana.
  assert.match(appTsx, /const activeSounds = new Set<SoundHandle>\(\)/);
  assert.match(
    appTsx,
    /document\.addEventListener\("visibilitychange", \(\) =>\n\s*document\.hidden \? pauseAll\(\) : resumeAll\(\),/,
  );
  assert.match(appTsx, /window\.addEventListener\("pagehide", pauseAll\)/);
  // Hanya yang tadi berbunyi yang dilanjutkan; yang dimatikan tamu tidak.
  assert.match(appTsx, /for \(const sound of pausedByVisibility\)\n\s*if \(activeSounds\.has\(sound\)\) sound\.resume\(\)/);
  // stop() harus melepas pemutar dari kedua daftar, kalau tidak resumeAll
  // akan menghidupkan lagi musik yang sudah dihentikan.
  assert.match(appTsx, /activeSounds\.delete\(handle\);\n\s*pausedByVisibility\.delete\(handle\);/);
  // Interval preset dulu memanggil context.resume() terus-menerus dan
  // menghidupkan lagi suara yang baru dijeda.
  assert.match(appTsx, /if \(stopped \|\| paused\) return;/);
});

test("QC: pratinjau card memilih section yang benar-benar tampil", () => {
  assert.match(appTsx, /const section = pickPreviewSection\(sections\);/);
  const fn = appTsx.slice(
    appTsx.indexOf("function pickPreviewSection("),
    appTsx.indexOf("function WebsiteTemplatePreview("),
  );
  assert.ok(fn.length > 0);
  // Cover lebih dulu, lalu section pertama yang berisi.
  assert.match(fn, /sections\.find\(hasCover\) \|\| sections\.find\(hasVisibleContent\) \|\| sections\[0\]/);
  // Background global ikut terbawa saat section dirender sendirian.
  assert.match(fn, /applyGlobalBackground\(chosen, globalSource\)/);
  // .sr-only dipakai tetapi dulu tidak pernah didefinisikan.
  assert.match(appCss, /\.sr-only\{position:absolute!important;width:1px!important/);
  // Pratinjau statis: animasi loop dimatikan di dalam card.
  assert.match(appCss, /\.actual-render-content \.background-extra-layer,/);
});

test("TC-205/221: ornamen menempel ke tambatannya berapa pun ukurannya", () => {
  // Penyusutan mobile dulu berporos di tengah gambar -> celah = ukuran x 0,2.
  assert.match(
    appCss,
    /translate\(calc\(var\(--deco-pin-x\) \* \(1 - var\(--deco-scale\)\) \* 50%\),calc\(var\(--deco-pin-y\) \* \(1 - var\(--deco-scale\)\) \* 50%\)\) scale\(var\(--deco-scale\)\)/,
  );
  // Skala mobile kini hanya mengganti variabel, tidak menulis ulang transform
  // tanpa penambat.
  assert.equal(
    /\.section-decoration>img\{transform:scale\(\.6/.test(appCss),
    false,
    "transform mobile ditulis ulang tanpa penambat pojok",
  );
  assert.match(appCss, /\.wedding-site\.device-mobile \.section-decoration\{--deco-scale:\.6\}/);
  // Kotak persegi + object-fit:contain menaruh gambar di tengah kotak.
  assert.match(appCss, /\.section-decoration img\{width:100%;height:auto;display:block\}/);
  assert.match(appTsx, /height: decoration\.imageUrl \? undefined : decoration\.size,/);
});

test("TC-206/209/210: geser, duplikat, dan posisi tengah sisi untuk ornamen", () => {
  for (const corner of ["top-center", "bottom-center", "middle-left", "middle-right"]) {
    assert.ok(appTsx.includes(`| "${corner}"`), `tipe DecorCorner tanpa ${corner}`);
    assert.ok(appTsx.includes(`<option value="${corner}">`), `opsi ${corner} tidak ada di editor`);
    assert.ok(appCss.includes(`.section-decoration.corner-${corner}{`), `CSS ${corner} tidak ada`);
  }
  // Posisi tengah TIDAK boleh memakai translate(-50%) pada span: span
  // menjalankan keyframes loop-* yang menganimasikan transform.
  assert.match(appCss, /\.section-decoration\.corner-top-center\{top:0;left:0;right:0;margin-inline:auto;/);
  assert.match(appTsx, /"--deco-dx": `\$\{decoration\.offsetX \?\? 0\}px`/);
  assert.match(appCss, /transform:translate\(var\(--deco-dx,0px\),var\(--deco-dy,0px\)\)/);
  assert.match(appTsx, /const copy = \{ \.\.\.current\[at\], id: uid\("decor"\) \};/);
});

test("TC-214: ornamen, layer, toggle sembunyi, dan musik mengikuti aturan device", () => {
  // Ornamen & layer dulu selalu ditulis ke nilai dasar.
  assert.match(
    appTsx,
    /applyDevicePatch\(\n\s*section,\n\s*producePatch\(resolveSection\(section, device\)\),\n\s*device,\n\s*\)/,
  );
  // Sumber background global dipakai dalam versi device aktif.
  assert.match(appTsx, /\? resolveSection\(sections\[0\], device\)/);
  // Toggle sembunyi menentukan device mana yang menampilkan: harus dibaca
  // keduanya, jadi selalu ditulis ke nilai dasar.
  assert.match(appTsx, /const \{ hideDesktop, hideMobile, \.\.\.rest \} = patch;/);
  // Musik satu untuk seluruh undangan.
  assert.match(appTsx, /for \(const key of SHARED_SOUND_KEYS\)/);
  // Fitur baru dari mode Mobile lahir tersembunyi di Desktop.
  assert.match(appTsx, /\? \{ \.\.\.makeFeature\(type\), hideDesktop: true \}/);
});

test("Credit: memilih musik tidak lagi menimpa ucapan, upload dari Credit berfungsi", () => {
  assert.match(
    appTsx,
    /\.\.\.\(feature\.type === "credit"\n\s*\? \{ creditSongTitle: item\.name \}\n\s*: \{ title: item\.name, body: item\.description \}\)/,
  );
  assert.match(
    appTsx,
    /\(selectedFeature\.type !== "sound" && selectedFeature\.type !== "credit"\)/,
  );
});

test("TC-204: section yang hanya berisi cover tidak muncul lagi sebagai slide kosong", () => {
  // Background di section cover milik layar cover. Aturan hasOwnBackdrop dulu
  // merendernya lagi setelah undangan dibuka sebagai slide berisi background.
  assert.match(appTsx, /const isCoverOnly =\n\s*!hasContentFeatures &&/);
  assert.match(appTsx, /\(hasOwnBackdrop && !isCoverOnly\) \|\|/);
});

test("TC-197: Background tetap memakai satu lapisan sticky, bukan attachment:fixed", () => {
  assert.match(appTsx, /const fixedBackdrop = !thumbnail \? globalBackgroundSource : null;/);
  assert.match(appTsx, /<FixedBackdrop\n\s*source=\{fixedBackdrop\}/);
  // Section tidak melukis ulang background bersama.
  assert.match(appTsx, /\? withoutSharedBackdrop\(\n\s*resolveSection\(rawSection, device\),/);
  // Layer Canvas 1 sudah masuk backdrop; tidak boleh tampil dua kali.
  assert.match(appTsx, /backgroundLayers: isSource \? \[\] : section\.backgroundLayers,/);
  assert.match(appCss, /\.site-fixed-backdrop\{position:sticky;top:0;/);
  // overflow:hidden bawaan .wedding-site mematahkan sticky. Terukur: dengan
  // hidden backdrop tergulir -440 px; dengan clip menempel di 0 px.
  assert.match(appCss, /\.wedding-site\.has-fixed-backdrop\{overflow:visible;overflow:clip\}/);
  // Pengukuran tinggi diulang setelah cover dibuka (root baru terpasang).
  assert.match(appTsx, /\}, \[fixedBackdrop, opened, previewZoom\]\);/);
  assert.match(appTsx, /<strong>Background tetap<\/strong>/);
});

test("TC-216: preview Desktop selebar canvas desain, tidak selebar layar", () => {
  assert.match(appTsx, /const DESKTOP_DESIGN_WIDTH = 1050;/);
  // Batas itu harus sama dengan batas atas canvas editor.
  assert.match(appCss, /\.canvas-frame\.desktop\{width:min\(1050px,/);
  assert.match(appTsx, /document\.querySelector\("\.canvas-frame\.desktop"\)/);
  for (const selector of [
    ".preview-full-stage.desktop .preview-content",
    ".actual-template-preview-shell.device-desktop>.wedding-site",
    ".template-dialog-actual-preview.live.device-desktop>.wedding-site",
  ])
    assert.ok(appCss.includes(selector), `${selector} tidak dibatasi lebarnya`);
  assert.match(appCss, /width:min\(var\(--design-width,1050px\),100%\);margin-inline:auto/);
});

test("VN 6: Templates & Approval — filter bawaan, nama pengaju, 8 per halaman", () => {
  const fn = appTsx.slice(
    appTsx.indexOf("function TemplateApprovalManager("),
    appTsx.indexOf("{takedownTarget && (", appTsx.indexOf("function TemplateApprovalManager(")),
  );
  assert.ok(fn.length > 0);
  // Bawaan hanya Published & Pending; ditolak & takedown tetap bisa dibuka.
  assert.match(fn, /\["active", "Published & Pending", \["Published", "Pending"\]\]/);
  assert.match(fn, /useState<FilterKey>\("active"\)/);
  assert.match(fn, /\["rejected", "Ditolak", \["Rejected"\]\]/);
  assert.match(fn, /\["takedown", "Takedown", \["Takedown"\]\]/);
  assert.match(fn, /\["all", "Semua \(riwayat\)", null\]/);
  // Admin melihat siapa yang mengajukan.
  assert.match(fn, /Diajukan oleh\{" "\}\n\s*<b>\{template\.createdByName \|\| template\.createdBy\}<\/b>/);
  // Dua baris empat kolom.
  assert.match(fn, /const PAGE_SIZE = 8;/);
  assert.match(fn, /\{pageItems\.map\(\(template\) => \(/);
  assert.match(appCss, /\.template-status-grid\{grid-template-columns:repeat\(4,minmax\(0,1fr\)\)\}/);
});

test("VN 7: sidebar — desain di atas, layanan di tengah, konfigurasi admin di bawah", () => {
  const fn = appTsx.slice(
    appTsx.indexOf("function Sidebar("),
    appTsx.indexOf("function Topbar("),
  );
  assert.ok(fn.length > 0);
  const at = (needle) => {
    const index = fn.indexOf(needle);
    assert.ok(index >= 0, `${needle} tidak ditemukan di Sidebar`);
    return index;
  };
  // Templates & Approval naik tepat sesudah dashboard.
  assert.ok(at('"dashboard",') < at('"templates",'));
  assert.ok(at('"templates",') < at('["cs-dashboard"'));
  // Layanan sebelum konfigurasi admin.
  assert.ok(at('["tasks"') < at('["users"'));
  assert.ok(at('"customer-service",') < at('["roles"'));
  // Konfigurasi admin sebelum menu akun.
  assert.ok(at('["audit-log"') < at('["help"'));
  assert.match(fn, /const groupOrder: MenuGroup\[\] = \["design", "service", "admin", "account"\];/);
  assert.match(appCss, /\.sidebar nav \.sidebar-group-label\{/);
});

test("QA 15 Okt: undo — blur tanpa perubahan tidak membuat entri riwayat", () => {
  // Setiap commit teks contentEditable wajib membandingkan nilai lama.
  const blurs = appTsx.match(/onBlur=\{\(event\) => \{[\s\S]*?\}\}/g) || [];
  const commits = blurs.filter((b) => /onUpdate\(|patchItem\(/.test(b));
  assert.ok(commits.length >= 8, `hanya ${commits.length} commit blur`);
  for (const b of commits) assert.match(b, /if \(\s*next !==/, b.slice(0, 120));
  // Tidak boleh tersisa pola lama: blur langsung memanggil onUpdate/patchItem.
  assert.doesNotMatch(appTsx, /onBlur=\{\(event\) =>\s*(onUpdate|patchItem)\(/);
  // Ctrl/Cmd+Z di field yang sedang diedit dibiarkan ke browser.
  assert.match(appTsx, /active\.isContentEditable \|\|\n\s*\["INPUT", "TEXTAREA", "SELECT"\]\.includes\(active\.tagName\)/);
});

test("QA 15 Okt: tipografi gambar/galeri, tombol lokasi, credit, fokus galeri", () => {
  assert.match(appTsx, /const typographyTypes: FeatureType\[\] = \[\s*\.\.\.textTypes,[\s\S]*?"image",[\s\S]*?"gallery",/);
  assert.match(appTsx, /typographyTypes\.includes\(feature\.type\)/);
  assert.match(appTsx, /mapButtonIcon\?: "map-pin" \| "navigation" \| "map" \| "external" \| "none"/);
  assert.match(appTsx, /variant="event"/);
  assert.match(appTsx, /creditFontSize\?: number/);
  assert.match(appTsx, /galleryOffsets\?: \{ x: number; y: number \}\[\]/);
  assert.match(appTsx, /function galleryImageStyle\(/);
  assert.match(appCss, /\.gallery-focus/);
});

test("MoM A3: label menampilkan data akun, bukan 'workspace' generik", () => {
  assert.doesNotMatch(appTsx, /ikrarku Workspace|"Website workspace"|Template workspace · no public URL|\$\{displayRole\(role\)\} workspace/);
  assert.match(appTsx, /editorName=\{currentAccount\?\.name \|\| displayRole\(role\)\}/);
  assert.match(appTsx, /\{editorName \? ` · diedit oleh \$\{editorName\}` : ""\}/);
  assert.match(appTsx, /title="Akun yang sedang masuk">\n\s*<span \/>\n\s*\{currentAccount\?\.email \|\| displayRole\(role\)\}/);
});

test("QC #2: preview penuh ringan — tanpa blur latar, canvas dimemo", () => {
  assert.match(appCss, /\.dialog-overlay\.template-quick-preview\{backdrop-filter:none;/);
  assert.match(appTsx, /const TemplateLivePreview = memo\(function TemplateLivePreview\(/);
  // Tidak ada lagi hydrateSections() langsung di JSX preview penuh.
  assert.doesNotMatch(appTsx, /sections=\{hydrateSections\((previewTemplate|preview|template)\.canvasSections\)\}/);
  // Revisi 24 Okt: Safe Preview memakai preview penuh yang sama (3 dialog).
  assert.equal((appTsx.match(/<TemplateLivePreview template=/g) || []).length, 3);
});

test("Serein: tata letak desktop Kolom — isi Mobile di kolom sempit, backdrop penuh", () => {
  assert.match(appTsx, /desktopLayout\?: "full" \| "column";/);
  const wrap = appTsx.slice(appTsx.indexOf("function WeddingCanvas(props"), appTsx.indexOf("function WeddingCanvasBody("));
  assert.ok(wrap.length > 0);
  assert.match(wrap, /device === "desktop" &&\n\s*!thumbnail &&/);
  assert.match(wrap, /<DeviceContext value="mobile">\n\s*<WeddingCanvasBody \{\.\.\.props\} \/>/);
  assert.match(wrap, /source=\{desktopColumnBackdrop\(first\)\}/);
  // Di editor, mode Desktop + Kolom menulis ke Mobile (yang tampil).
  assert.match(appTsx, /previewMode === "desktop" && desktopColumn \? "mobile" : previewMode;/);
  assert.match(appTsx, /applyDevicePatch\(section, patch, editDevice\)/);
  assert.match(appCss, /\.desktop-column\{position:relative;z-index:1;width:min\(var\(--desktop-column-w,430px\),100%\)/);
  // Sticky butuh kontainer gulir yang sebenarnya: canvas-frame tidak boleh hidden.
  assert.match(appCss, /\.canvas-frame\{overflow:clip\}/);
});

test("MoM A7/A6/A9: UI harga admin, buat akun customer, banner tim membantu", () => {
  // A7 — Web Designer tidak mengisi harga; admin mengubahnya dari kartu.
  assert.match(appTsx, /useState\(canSetPrice \? 499000 : 0\)/);
  assert.match(appTsx, /<input value="Ditetapkan Administrator" disabled readOnly \/>/);
  assert.match(appTsx, /<TemplatePriceControl\n\s*price=\{template\.price \|\| 0\}/);
  assert.match(apiTs, /setTemplatePrice: \(id: string, price: number\) =>/);
  // A6 — tombol di Orders untuk order lunas tanpa akun.
  assert.match(appTsx, /row\.payment_status === "Paid" &&\n\s*!row\.user_id &&/);
  assert.match(apiTs, /createOrderCustomerAccount: \(id: string\) =>/);
  // A9 — banner di dashboard customer.
  assert.match(appTsx, /className="team-edit-banner" role="status"/);
  assert.match(appTsx, /setTeamEdit\(site\?\.teamEdit \|\| null\)/);
});

test("QA 17 Okt TC-216/217: canvas editor setinggi preview; preview buka di mode aktif", () => {
  // Label fitur di editor tidak boleh memakan tempat (dulu +19 px per fitur).
  assert.match(appCss, /\.feature-block>\.feature-handle\{position:absolute\}/);
  assert.match(appTsx, /document\.querySelector\("\.canvas-frame\.mobile"\) \? "mobile" : "desktop"/);
  assert.match(appTsx, /return measured \|\| lastDesktopCanvasWidth \|\| DESKTOP_DESIGN_WIDTH;/);
});

test("QA 17 Okt TC-208/212/213: ukuran tombol lokasi, logo bank, elemen musik credit", () => {
  assert.match(appTsx, /mapButtonFontSize\?: number;/);
  assert.match(appTsx, /size=\{feature\.mapButtonIconSize \|\| 14\}/);
  assert.match(appTsx, /function bankLogoStyle\(feature: Feature\)/);
  assert.match(appTsx, /style=\{bankLogoStyle\(feature\)\}/);
  assert.match(appTsx, /className="bank-logo-style"/);
  assert.match(appTsx, /creditMusicIcon\?: "disc" \| "note" \| "none";/);
  assert.match(appTsx, /text-\$\{feature\.creditTextStyle \|\| "normal"\}/);
});

test("QA 17 Okt TC-218/219: upload tidak macet; undo dari state terbaru, batas jelas", () => {
  // Semua input file dikosongkan saat dibuka, jadi berkas yang sama tetap diproses.
  const inputs = appTsx.match(/type="file"[\s\S]{0,1500}?\/>/g) || [];
  assert.ok(inputs.length >= 14);
  for (const block of inputs)
    assert.ok(
      /onClick=\{resetFileInput\}|value = ""/.test(block),
      `input file tanpa reset: ${block.slice(0, 80)}`,
    );
  assert.match(appTsx, /async function shrinkImageToLimit\(file: File, maxBytes: number\)/);
  assert.match(appTsx, /if \(type === "image"\) file = await shrinkImageToLimit\(file, limit\);/);
  // Undo: snapshot dari ref state terbaru, batas 30 dan jumlahnya tampil.
  assert.match(appTsx, /const HISTORY_LIMIT = 30;/);
  assert.match(appTsx, /const previous = sectionsRef\.current;/);
  assert.match(appTsx, /historyRef\.current\.push\(structuredClone\(previous\)\);/);
  assert.match(appTsx, /className="history-count"/);
});

test("Wedding Gift: logo bank bisa diupload per rekening dan diatur ukurannya", () => {
  assert.match(appTsx, /logoUrl\?: string;\n\s*logoKey\?: string;/);
  assert.match(appTsx, /bankLogoImageHeight\?: number;/);
  assert.match(appTsx, /className="bank-logo-img"/);
  assert.match(appTsx, /height: feature\.bankLogoImageHeight \|\| 28,/);
  assert.match(appTsx, /uploadLogo=\{uploadGiftLogo\}/);
  // SVG ditolak (bisa memuat skrip saat URL-nya dibuka langsung).
  assert.match(appTsx, /\["image\/png", "image\/jpeg", "image\/webp"\]\.includes\(file\.type\)/);
});

// ---------------------------------------------------------------------------
// QA UPDATE_QA_IKRARKU.ID_10 — TC-212..TC-246 (21 Okt).
// ---------------------------------------------------------------------------

test("QA10 TC-232: semua ucapan tampil (scroll/halaman), tidak dipotong", () => {
  assert.match(appTsx, /greetingsDisplay\?: "scroll" \| "paged";/);
  assert.match(appTsx, /className="greeting-pages"/);
  assert.doesNotMatch(appTsx, /greetings\.slice\(0, compact \? 3 : 8\)/);
  assert.match(serverMjs, /LIMIT 1000/);
});

test("QA10 TC-245: checkout tanpa daftar, login pertama wajib ganti password", () => {
  assert.match(serverMjs, /ensureColumn\("users", ?"must_change_password"/);
  assert.match(serverMjs, /"\/api\/auth\/first-password"/);
  assert.match(serverMjs, /function createCustomerUser\(order, tempPassword = null\)/);
  assert.match(apiTs, /firstPassword: \(password: string, passwordConfirm: string\)/);
  assert.match(appTsx, /function FirstPasswordDialog\(/);
});

test("QA10 TC-222/223/224: billing vertikal, Hubungi Support di editor, upsell template", () => {
  assert.match(appTsx, /<dl className="billing-list">/);
  assert.match(appTsx, /onContactSupport\?: \(\) => void;/);
  assert.match(appTsx, /className="support-help-card"/);
  assert.match(appTsx, /className="upsell-catalog"/);
});

test("QA10 TC-228..TC-238: countdown, kalender, galeri, transparansi, font, credit, icon", () => {
  assert.match(appTsx, /"--cd-scale"/);
  assert.match(appTsx, /function CalendarButtons\(/);
  assert.match(appTsx, /ctz=Asia\/Jakarta/);
  assert.match(appTsx, /function galleryBoxProps\(/);
  assert.match(appTsx, /function withAlpha\(/);
  assert.match(appTsx, /boxOpacity\?: number;/);
  assert.match(appTsx, /function FontSelect\(/);
  assert.match(appTsx, /className="site-credit-footer"/);
  assert.match(appTsx, /iconTextPosition\?:/);
});

test("QA10 TC-235/237/240/241: live streaming, button slide, alamat kado, gift ringkas", () => {
  assert.match(appTsx, /\| "live-stream";/);
  assert.match(appTsx, /type: "live-stream",\n\s*label: "Live Streaming"/);
  assert.match(appTsx, /function liveStreamInfo\(/);
  assert.match(appTsx, /https:\/\/www\.youtube\.com\/embed\//);
  assert.match(appTsx, /coverButtonMode\?: "click" \| "slide";/);
  assert.match(appTsx, /active\.coverButtonMode === "slide" \? \(\n\s*<SlideToOpen/);
  assert.match(appTsx, /function GiftAddressCard\(/);
  assert.match(appTsx, /<GiftReveal feature=\{feature\} editable=\{editable\} \/>/);
  assert.match(appTsx, /feature\.giftRevealLabel \|\| "Lihat Rekening"/);
});

test("QA10 TC-239/242/243/244: live motion elemen, 70/30, video layer 1, preview skala", () => {
  assert.match(appTsx, /elementMotion\?: Partial<Record<ElementMotionTarget, LoopEffect>>;/);
  assert.match(appTsx, /<ElementMotionControls feature=\{feature\} update=\{update\} \/>/);
  assert.match(appCss, /\.feature-block\.lm-title-float \.editable-title\{animation:loopFloat/);
  assert.match(appTsx, /desktopColumnRatio\?: "fixed" \| "70-30";/);
  assert.match(appTsx, /<DesktopSidePanel first=\{first\} \/>/);
  assert.match(appTsx, /Upload Video Layer 1/);
  // Revisi 21 Okt: selebar layar — Kolom/70-30 tanpa skala, desain penuh diskalakan.
  assert.match(appTsx, /const columnLayout = usesDesktopColumn\(sections\);/);
  assert.match(appTsx, /mode === "desktop" && !columnLayout,/);
  assert.match(appTsx, /Math\.min\(maxZoom, Math\.max\(0\.35, available \/ designWidth\)\)/);
  assert.match(appCss, /\.preview-full-stage\.desktop\.full-bleed \.preview-content\{width:100%!important;zoom:1/);
  // Pita putih Mobile: kontainer gulir tanpa padding vertikal.
  assert.match(appCss, /\.preview-full-stage\.mobile\{padding:0 22px\}/);
  assert.match(appCss, /zoom:var\(--preview-zoom,1\)/);
});

test("QA10 TC-226/246: nama pengirim catatan internal, landing ID/EN", () => {
  assert.match(serverMjs, /sender_name, r\.name sender_role FROM messages m/);
  assert.match(appTsx, /className="cs-message-sender"/);
  assert.match(landingTsx, /className={`ikr-lang \${variant}`} role="group"/);
  assert.match(landingTsx, /heroLines: \["A promise\.", "A story\.", "An invitation\."\]/);
});

test("Revisi 21 Okt: tombol Simpan Tanggal tidak ikut grid kotak hitung mundur", () => {
  assert.match(appCss, /\.countdown-feature>\.calendar-buttons\{display:flex;grid-template-columns:none;/);
  assert.match(appCss, /\.calendar-button\{white-space:nowrap;flex:0 0 auto\}/);
});

test("Revisi 21 Okt: kartu ucapan rata kiri; email password sementara rapi", () => {
  assert.match(appCss, /\.greeting-list article>div:last-child\{flex:1;text-align:left\}/);
  assert.match(appCss, /\.greetings-widget\.align-center \.greeting-list article>div:last-child\{text-align:center\}/);
  assert.match(serverMjs, /<code style="font-size:16px;background:#eef4f1;/);
});

test("Revisi 22 Okt: color picker Tidak ada warna + Reset di semua tempat", () => {
  assert.match(appTsx, /function ColorInput\(/);
  // Hanya ColorInput yang memakai input warna native.
  assert.equal((appTsx.match(/type="color"/g) || []).length, 1);
  assert.match(appTsx, /aria-label="Reset warna"/);
  assert.match(appTsx, /"Tidak ada warna"/);
  assert.match(appCss, /\.color-none-mark\{/);
});

test("Revisi 22 Okt: 70/30 tanpa posisi Tengah; Isi sisi visual hanya untuk 70/30", () => {
  assert.match(appTsx, /\{first\.desktopColumnRatio !== "70-30" && \(\n\s*<option value="center">Tengah<\/option>/);
  assert.match(appTsx, /\{first\.desktopColumnRatio === "70-30" && \(\n\s*<DesktopSideEditor/);
  assert.match(appTsx, /update\(\{ desktopSideSlides: next, desktopBackdropColor: undefined \}\)/);
});

test("Revisi 22 Okt: bottom navigation bar per column dengan 6 style", () => {
  assert.match(appTsx, /function BottomNavBar\(/);
  assert.match(appTsx, /function BottomNavPanel\(/);
  for (const style of ["classic", "floating-pill", "center-raised", "notch-dot", "active-square", "icon-only"])
    assert.match(appCss, new RegExp(`\\.bottom-nav\\.style-${style}\\{`));
  assert.match(appTsx, /<BottomNavBar config=\{bottomNav\} rootRef=\{revealRootRef\} \/>/);
});

test("Revisi 22 Okt: ikon bottom navigation bisa diupload per menu", () => {
  assert.match(appTsx, /iconUrl\?: string;\n\s*iconKey\?: string;\n\};/);
  assert.match(appTsx, /const uploadNavIcon = async \(file: File \| undefined\)/);
  assert.match(appTsx, /uploadToServer\(file, "nav-icon"\)/);
  assert.match(appTsx, /className="bottom-nav-img"/);
  assert.match(appTsx, /uploadIcon=\{uploadNavIcon\}/);
});

test("Revisi 24 Okt: header landing, preview template penuh, sampul tanpa gambar sample", () => {
  // 1. Bahasa, Masuk, CTA satu baris sejajar logo & menu; di ponsel bahasa
  //    pindah ke menu dengan target 48 px (web.dev: ±48 px, jarak 8 px).
  assert.match(landingTsx, /\{langSwitch\("ikr-lang-header"\)\}/);
  assert.match(landingTsx, /\{langSwitch\("ikr-lang-menu"\)\}/);
  assert.match(landingCss, /\.ikr-lang button\{font-size:12px;font-weight:700;letter-spacing:\.5px;min-width:40px;min-height:34px;/);
  assert.match(landingCss, /\.ikr-lang-menu button\{min-width:56px;min-height:48px;/);
  // 2 & 4. Preview template (landing, Safe Preview, review) selebar kotak preview.
  assert.match(appTsx, /function FitDesktop\(/);
  assert.match(appTsx, /<FitDesktop device=\{journeyDevice\} sections=\{journeySections\}>/);
  assert.match(appTsx, /<FitDesktop device=\{device\} sections=\{sections\}>/);
  assert.match(appTsx, /ref=\{safePreviewStageRef\}/);
  assert.doesNotMatch(appTsx, /<span>SAFE PREVIEW<\/span>/);
  // 3. Gambar referensi hanya untuk template contoh; lainnya sampul aksen.
  assert.match(serverMjs, /AND id IN \$\{builtins\} AND preset IN/);
  assert.match(serverMjs, /SET \$\{column\}=NULL WHERE \$\{column\} IN \$\{refs\} AND id NOT IN \$\{builtins\}/);
  assert.match(appTsx, /function TemplateCoverArt\(/);
});

test("Revisi 24 Okt: Buka Undangan di preview setinggi kotak preview, tanpa sisa abu-abu", () => {
  assert.match(appCss, /\.template-dialog-actual-preview\.live\{container-type:size\}/);
  assert.match(appCss, /\.invitation-locked\{height:calc\(100cqh \/ var\(--preview-zoom,1\)\)\}/);
  assert.match(appCss, /\{min-height:calc\(100cqh \/ var\(--preview-zoom,1\)\)\}/);
  assert.match(appTsx, /"--preview-zoom": zoom,\n\s*\} as React\.CSSProperties\)/);
});

test("Revisi 24 Okt: status di kartu My Order setinggi teks", () => {
  assert.match(appCss, /\.project-order-card>header\{align-items:flex-start\}/);
  assert.match(appCss, /\.project-order-card>header>\.status\{align-self:flex-start;/);
});
