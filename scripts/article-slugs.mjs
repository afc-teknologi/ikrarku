#!/usr/bin/env node
/**
 * Audit slug artikel Jurnal — HANYA MEMBACA, tidak pernah menulis.
 *
 * Setiap artikel sudah punya slug sejak dibuat (kolomnya UNIQUE NOT NULL),
 * tetapi slug yang dihasilkan otomatis sering tidak layak jadi URL publik:
 *
 *   - terbentuk dari paragraf isi, bukan judul, sehingga panjangnya ratusan
 *     karakter;
 *   - berakhiran angka acak karena judulnya kembar (`judul-93074`);
 *   - masih memakai judul contoh (`lorem-ipsum`).
 *
 * Skrip ini menandai semuanya dan mengusulkan pengganti. Perbaikannya
 * dilakukan lewat CMS (Articles -> buka artikel -> ubah Permalink), BUKAN
 * oleh skrip ini: jalur CMS sudah menormalkan slug dan memeriksa keunikan,
 * dan tidak berisiko menulis ke database yang sedang dipakai aplikasi.
 *
 * Pemakaian:
 *   node scripts/article-slugs.mjs
 *   node scripts/article-slugs.mjs --db /app/data/ikrarku.sqlite
 *
 * Di VPS (database ada di volume Docker, bukan di folder repo):
 *   docker run --rm \
 *     -v ikrarku_staging_data:/app/data \
 *     -v /opt/ikrarku/scripts:/app/scripts \
 *     -w /app node:22-bookworm-slim \
 *     node scripts/article-slugs.mjs
 */
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const argValue = (name) => {
  const index = argv.indexOf(`--${name}`);
  return index >= 0 ? argv[index + 1] : undefined;
};

const candidates = [
  argValue("db"),
  process.env.DB_FILE,
  "/app/data/ikrarku.sqlite",
  path.resolve(process.cwd(), "server/data/ikrarku.sqlite"),
].filter(Boolean);

const dbPath = candidates.find((candidate) => fs.existsSync(candidate));
if (!dbPath) {
  console.error("Database tidak ditemukan. Dicoba:");
  for (const candidate of candidates) console.error(`  - ${candidate}`);
  console.error("\nTunjuk manual dengan --db <path>.");
  process.exit(1);
}

/** Aturan yang sama dengan yang dipakai server saat membuat slug. */
const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Batas wajar slug. Google tidak punya batas keras, tapi slug panjang
 *  terpotong di hasil pencarian dan menyulitkan dibagikan. */
const MAX_SLUG = 60;

const db = new DatabaseSync(dbPath, { readOnly: true });
const rows = db
  .prepare(
    `SELECT id, title, slug, status, excerpt, cover_url,
            COALESCE(published_at, created_at) AS date
       FROM articles
      ORDER BY COALESCE(published_at, created_at) DESC`,
  )
  .all();

console.log(`\nDatabase : ${dbPath}`);
console.log(`Artikel  : ${rows.length}\n`);

if (!rows.length) {
  console.log("Belum ada artikel.");
  process.exit(0);
}

/** Usulan slug dari judul, dipotong di batas kata agar tetap terbaca. */
function suggest(title, taken) {
  let base = slugify(title);
  if (!base) base = "artikel";
  if (base.length > MAX_SLUG) {
    base = base.slice(0, MAX_SLUG);
    const lastDash = base.lastIndexOf("-");
    if (lastDash > 20) base = base.slice(0, lastDash);
  }
  let value = base;
  let n = 2;
  while (taken.has(value)) value = `${base}-${n++}`;
  return value;
}

const taken = new Set(rows.map((row) => row.slug));
// Judul yang muncul lebih dari sekali: slug-nya tidak akan pernah rapi
// sebelum judulnya dibedakan.
const titleCounts = new Map();
for (const row of rows) {
  const key = row.title.trim().toLowerCase();
  titleCounts.set(key, (titleCounts.get(key) || 0) + 1);
}
const duplicateTitles = new Set(
  [...titleCounts.entries()].filter(([, count]) => count > 1).map(([key]) => key),
);
let problems = 0;
const actions = [];

for (const row of rows) {
  const issues = [];
  if (row.slug.length > MAX_SLUG)
    issues.push(`terlalu panjang (${row.slug.length} karakter)`);
  if (/-\d{4,}$/.test(row.slug))
    issues.push("berakhiran angka acak (judul kembar saat dibuat)");
  if (slugify(row.title) && !row.slug.startsWith(slugify(row.title).slice(0, 12)))
    issues.push("tidak mencerminkan judul");
  if (/^(lorem|ipsum|test|untitled|artikel)(-|$)/.test(row.slug))
    issues.push("masih memakai judul contoh");

  const contentIssues = [];
  if (!row.excerpt || row.excerpt.length < 50)
    contentIssues.push("excerpt kosong/terlalu pendek (dipakai meta description)");
  if (!row.cover_url)
    contentIssues.push("tanpa cover (kartu share tampil tanpa gambar)");

  const flagged = issues.length || contentIssues.length;
  if (flagged) problems += 1;

  console.log(`${flagged ? "PERLU DICEK" : "OK        "}  ${row.title}`);
  console.log(`              status : ${row.status}`);
  console.log(
    `              slug   : ${row.slug.length > 70 ? `${row.slug.slice(0, 67)}...` : row.slug}`,
  );
  for (const issue of issues) console.log(`              ! ${issue}`);
  for (const issue of contentIssues) console.log(`              - ${issue}`);
  if (issues.length) {
    taken.delete(row.slug);
    const proposed = suggest(row.title, taken);
    taken.add(proposed);
    // Slug yang baik diturunkan dari judul yang baik. Kalau judulnya sendiri
    // placeholder atau kembar dengan artikel lain, mengganti slug saja cuma
    // memindahkan masalah: `lorem-ipsum-3` tidak lebih berguna bagi pembaca
    // maupun mesin pencari daripada `lorem-ipsum-93074`.
    const titleIsPlaceholder = /^(lorem|ipsum|test|untitled|artikel)(\s|$)/i.test(
      row.title.trim(),
    );
    const titleIsDuplicate = duplicateTitles.has(row.title.trim().toLowerCase());
    if (titleIsPlaceholder || titleIsDuplicate) {
      console.log(
        `              usul   : GANTI JUDULNYA DULU — ${
          titleIsPlaceholder ? "judul masih contoh" : "judul kembar dengan artikel lain"
        }`,
      );
      console.log(
        "                       slug akan ikut rapi setelah judulnya benar",
      );
      actions.push({ title: row.title, from: row.slug, to: null });
    } else {
      console.log(`              usul   : ${proposed}`);
      actions.push({ title: row.title, from: row.slug, to: proposed });
    }
  }
  console.log("");
}

if (actions.length) {
  console.log("─".repeat(70));
  console.log("Usulan perubahan slug:\n");
  for (const action of actions) {
    console.log(`  ${action.title}`);
    console.log(`    dari : ${action.from.slice(0, 60)}${action.from.length > 60 ? "..." : ""}`);
    console.log(
      action.to
        ? `    jadi : ${action.to}\n`
        : `    jadi : ganti judul artikelnya dulu\n`,
    );
  }
  const needTitleFirst = actions.filter((action) => !action.to).length;
  if (needTitleFirst)
    console.log(
      `${needTitleFirst} artikel perlu JUDUL baru lebih dulu. Slug yang diturunkan\n` +
        "dari judul placeholder atau judul kembar tidak akan membantu SEO\n" +
        "sebanyak apa pun diubah.\n",
    );
  console.log("Cara menerapkan — lewat CMS, bukan skrip ini:");
  console.log("  1. Masuk workspace sebagai Administrator");
  console.log("  2. Menu Articles -> klik artikelnya");
  console.log("  3. Perbaiki Judul bila perlu, lalu kolom Permalink, lalu Simpan");
  console.log("");
  console.log("Jalur CMS sudah menormalkan slug dan memeriksa keunikan, dan");
  console.log("tidak menulis langsung ke database yang sedang dipakai aplikasi.");
  console.log("");
  console.log("PERHATIAN: mengubah slug = mengubah URL publik. Untuk artikel");
  console.log("yang sudah tersebar atau terindeks, tautan lamanya akan mati.");
  console.log("Artikel uji coba aman diubah.");
}

console.log("─".repeat(70));
console.log(
  problems
    ? `${problems} dari ${rows.length} artikel perlu dicek.`
    : `Semua ${rows.length} artikel sudah rapi.`,
);
console.log("");
