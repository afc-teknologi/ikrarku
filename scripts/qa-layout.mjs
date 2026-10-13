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
  // Rotasi (TC-186) ikut dirangkai di properti transform yang sama.
  assert.match(
    appCss,
    /\.section-decoration>svg[^}]*transform:rotate\(var\(--deco-rotate,0deg\)\) scaleX\(var\(--deco-flip,1\)\)/,
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
  // dan read-modify-write menimpa override Mobile dengan isi Desktop.
  assert.match(appTsx, /resolveSection\(rawSelectedSection, previewMode\)/);
  assert.match(appTsx, /resolveFeature\(raw, previewMode\)/);
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
  assert.match(appTsx, /Canvas Editor sengaja tidak memuat ChatWidget/);
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
