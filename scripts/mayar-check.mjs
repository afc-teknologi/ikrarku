#!/usr/bin/env node
/**
 * Preflight Mayar — menjawab empat pertanyaan tanpa membuat transaksi apa pun.
 *
 *   1. Apakah MAYAR_API_KEY valid dan untuk akun/domain yang benar?
 *   2. Apakah key-nya Read & Write, atau Read Only? Membuat invoice adalah
 *      POST; key Read Only akan ditolak saat pelanggan menekan Bayar — bukan
 *      saat konfigurasi, sehingga mudah lolos sampai produksi.
 *   3. Apakah endpoint V1 yang dipakai server ini masih hidup untuk akun Anda?
 *      Dokumentasi Mayar menyebut V1 dihentikan 1 Oktober 2026, dan CLI resmi
 *      mereka sudah memakai /hl/v2/.
 *   4. Apakah URL webhook sudah bisa dijangkau dari internet beserta tokennya?
 *
 * Tidak ada invoice yang dibuat. Probe V1 sengaja mengirim body kosong:
 * kalau path-nya hidup server menjawab 400 (validasi), kalau sudah mati
 * menjawab 404/410. Keduanya tidak menghasilkan transaksi.
 *
 * Pemakaian, di folder repo pada VPS:
 *   node scripts/mayar-check.mjs
 *   node scripts/mayar-check.mjs --webhook https://dev.ikrarku.id
 *
 * API key TIDAK pernah dicetak.
 */
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const argValue = (name) => {
  const index = argv.indexOf(`--${name}`);
  return index >= 0 ? argv[index + 1] : undefined;
};
/** --env-file <berkas> untuk menunjuk berkas env secara eksplisit. */
function argEnvFile() {
  return argValue("env-file");
}

// --- muat berkas env tanpa dependency, supaya bisa dijalankan apa adanya ----
// Di VPS, docker-compose.staging.yml membaca `.env.staging`, bukan `.env`.
// Keduanya dicoba agar skrip ini jalan di laptop maupun di server tanpa
// perlu --env-file. Variabel yang sudah ada di environment tidak ditimpa.
const envCandidates = [
  argEnvFile(),
  ".env.staging",
  ".env",
].filter(Boolean);
let loadedEnvFile = null;
for (const candidate of envCandidates) {
  const envPath = path.resolve(process.cwd(), candidate);
  if (!fs.existsSync(envPath)) continue;
  loadedEnvFile = candidate;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const match = /^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (match && process.env[match[1]] === undefined)
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
  break;
}


const KEY = process.env.MAYAR_API_KEY || "";
const BASE = (process.env.MAYAR_API_BASE || "https://api.mayar.id/hl/v1")
  .replace(/\/+$/, "");
const ORIGIN = BASE.replace(/\/hl\/v\d+$/, "");
const WEBHOOK_BASE = (
  argValue("webhook") ||
  process.env.PUBLIC_BASE_URL ||
  process.env.CLIENT_ORIGIN ||
  ""
).replace(/\/+$/, "");

let problems = 0;
const ok = (message) => console.log(`  OK    ${message}`);
const warn = (message) => {
  console.log(`  CEK   ${message}`);
};
const bad = (message) => {
  problems += 1;
  console.log(`  GAGAL ${message}`);
};
const section = (title) => console.log(`\n${title}`);

// --- 1. variabel lingkungan ------------------------------------------------
section("1. Variabel lingkungan");
console.log(
  loadedEnvFile
    ? `  INFO  Membaca ${loadedEnvFile}`
    : "  INFO  Tidak ada berkas .env/.env.staging di folder ini; memakai environment proses.",
);
if (process.env.PAYMENT_MODE !== "mayar")
  warn(
    `PAYMENT_MODE=${process.env.PAYMENT_MODE || "(kosong)"} — gateway belum aktif. Set ke "mayar" saat siap.`,
  );
else ok("PAYMENT_MODE=mayar");

if (!KEY) bad("MAYAR_API_KEY kosong.");
else ok(`MAYAR_API_KEY terisi (${KEY.length} karakter).`);

if (!process.env.MAYAR_WEBHOOK_TOKEN)
  bad(
    "MAYAR_WEBHOOK_TOKEN kosong — endpoint webhook akan menolak semua panggilan dengan 503.",
  );
else ok("MAYAR_WEBHOOK_TOKEN terisi.");

console.log(`  INFO  Base URL: ${BASE}`);
if (/mayar\.io/.test(BASE))
  warn("Base sandbox terdeteksi (.io). Key produksi tidak berlaku di sini.");

// --- 2. isi API key (lokal, tanpa jaringan) --------------------------------
section("2. Isi API key (dibaca lokal, tidak dikirim ke mana pun)");
const parts = KEY.split(".");
if (parts.length !== 3) {
  if (KEY) warn("Key bukan JWT tiga-bagian. Lewati pembacaan isi.");
} else {
  try {
    const claims = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    // Hanya cetak field yang tidak sensitif dan berguna untuk diagnosis.
    for (const field of [
      "sub",
      "name",
      "email",
      "role",
      "scope",
      "permission",
      "type",
      "env",
      "domain",
      "subdomain",
      "website",
      "merchantId",
      "iss",
    ])
      if (claims[field] !== undefined)
        console.log(`  INFO  ${field}: ${JSON.stringify(claims[field])}`);
    if (claims.exp) {
      const expiry = new Date(claims.exp * 1000);
      if (expiry.getTime() < Date.now())
        bad(`Key sudah kedaluwarsa pada ${expiry.toISOString()}.`);
      else ok(`Key berlaku sampai ${expiry.toISOString()}.`);
    }
    // Key Mayar terikat domain; kalau domain di key berbeda dengan domain
    // deploy, link pembayaran yang dikembalikan akan memakai domain lain.
    const bound = claims.domain || claims.subdomain || claims.website;
    if (bound && WEBHOOK_BASE && !WEBHOOK_BASE.includes(String(bound)))
      warn(
        `Key terikat domain "${bound}" sedangkan deploy di "${WEBHOOK_BASE}". Mayar mewajibkan key baru bila domain berubah.`,
      );
  } catch {
    warn("Isi key tidak bisa dibaca sebagai JSON. Lewati.");
  }
}

// --- 3. panggilan jaringan -------------------------------------------------
const callMayar = async (method, url, body) => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(15000),
    });
    let payload = null;
    try {
      payload = await response.json();
    } catch {
      /* respons bukan JSON */
    }
    return { status: response.status, payload };
  } catch (error) {
    return { status: 0, error: error.message };
  }
};

if (KEY) {
  section("3. Autentikasi (GET /hl/v2/balances — endpoint cek kredensial)");
  const auth = await callMayar("GET", `${ORIGIN}/hl/v2/balances`);
  if (auth.status === 0)
    bad(
      `Tidak bisa menghubungi ${ORIGIN}: ${auth.error}. Ini masalah jaringan/firewall, bukan key. Jalankan skrip ini DI VPS.`,
    );
  else if (auth.status === 200) ok("Key diterima. Autentikasi berhasil.");
  else if (auth.status === 401 || auth.status === 403)
    bad(
      `Key ditolak (${auth.status}) pada ${ORIGIN}. Lihat hasil deteksi environment di bawah.`,
    );
  else
    warn(
      `Status tak terduga ${auth.status}: ${JSON.stringify(auth.payload)?.slice(0, 200)}`,
    );

  // Key produksi dan sandbox berasal dari akun yang berbeda dan hanya berlaku
  // di domainnya masing-masing. Tanpa akses dashboard, mencoba key yang sama
  // ke kedua domain adalah satu-satunya cara mengetahui ini key yang mana.
  section("3b. Key ini untuk environment yang mana?");
  const environments = [
    ["Produksi", "https://api.mayar.id"],
    ["Sandbox (dokumentasi)", "https://api.mayar.io"],
    ["Sandbox (dipakai CLI resmi)", "https://api.mayar.club"],
  ];
  const accepted = [];
  let reachable = 0;
  for (const [label, origin] of environments) {
    const probe = await callMayar("GET", `${origin}/hl/v2/balances`);
    if (probe.status !== 0) reachable += 1;
    if (probe.status === 200) {
      accepted.push([label, origin]);
      ok(`${label} (${origin}) menerima key ini.`);
    } else if (probe.status === 401 || probe.status === 403)
      console.log(`  INFO  ${label} (${origin}) menolak key (${probe.status}).`);
    else if (probe.status === 0)
      console.log(`  INFO  ${label} (${origin}) tidak terjangkau.`);
    else console.log(`  INFO  ${label} (${origin}) menjawab ${probe.status}.`);
  }
  // Jaringan terblokir bukan bukti key-nya salah; keduanya harus dibedakan,
  // kalau tidak skrip ini justru menyesatkan.
  if (!reachable)
    bad(
      "Tidak satu pun domain Mayar terjangkau dari sini — ini masalah jaringan, BUKAN bukti key salah. Jalankan ulang di VPS.",
    );
  else if (!accepted.length)
    bad(
      "Tidak ada environment yang menerima key ini. Key salah, terpotong, kedaluwarsa, atau sudah dicabut.",
    );
  else if (!accepted.some(([, origin]) => BASE.startsWith(origin)))
    bad(
      `MAYAR_API_BASE menunjuk ${ORIGIN}, padahal key ini berlaku di ${accepted
        .map(([, origin]) => origin)
        .join(", ")}. Sesuaikan MAYAR_API_BASE.`,
    );
  else ok("MAYAR_API_BASE sudah cocok dengan environment key.");

  section("4. Apakah endpoint V1 masih hidup untuk akun ini?");
  console.log(
    "  INFO  Mengirim body kosong ke /hl/v1/invoice/create. Tidak ada invoice yang dibuat.",
  );
  const v1 = await callMayar("POST", `${ORIGIN}/hl/v1/invoice/create`, {});
  if (v1.status === 0)
    bad(`Tidak bisa menghubungi ${ORIGIN}: ${v1.error}. Jalankan di VPS.`);
  else if (v1.status === 404 || v1.status === 410)
    bad(
      `V1 sudah tidak tersedia (${v1.status}). Server ini memakai /hl/v1 — payload invoice perlu dimigrasi ke V2.`,
    );
  else if (v1.status === 400 || v1.status === 422)
    ok(
      `V1 masih hidup (${v1.status} = validasi payload, bukan path hilang).`,
    );
  else if (v1.status === 401 || v1.status === 403)
    bad(
      `Ditolak (${v1.status}). Kemungkinan besar key ini Read Only — membuat invoice adalah POST dan butuh Read & Write.`,
    );
  else
    warn(
      `Status ${v1.status}: ${JSON.stringify(v1.payload)?.slice(0, 200)}`,
    );
}

// --- 5. webhook ------------------------------------------------------------
section("5. Webhook");
if (!WEBHOOK_BASE)
  warn(
    "Tidak tahu URL publik. Jalankan dengan --webhook https://domain-anda untuk mengecek.",
  );
else {
  const token = process.env.MAYAR_WEBHOOK_TOKEN || "";
  const url = `${WEBHOOK_BASE}/api/webhooks/mayar?token=${encodeURIComponent(token)}`;
  console.log(`  INFO  Mendaftarkan URL ini di dashboard Mayar:`);
  console.log(
    `        ${WEBHOOK_BASE}/api/webhooks/mayar?token=<MAYAR_WEBHOOK_TOKEN>`,
  );
  if (/localhost|127\.0\.0\.1/.test(WEBHOOK_BASE))
    bad(
      "URL webhook menunjuk localhost. Mayar tidak akan pernah bisa menjangkaunya, dan order akan menggantung di Pending.",
    );
  // Event yang tidak dikenal akan diabaikan server dengan 200 {ignored}.
  // Ini membuktikan token benar tanpa mengubah data apa pun.
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "preflight.check" }),
      signal: AbortSignal.timeout(15000),
    });
    const payload = await response.json().catch(() => null);
    if (response.status === 200 && payload?.ignored)
      ok("Endpoint webhook bisa dijangkau dan token cocok.");
    else if (response.status === 401)
      bad("Token webhook tidak cocok dengan MAYAR_WEBHOOK_TOKEN di server.");
    else if (response.status === 503)
      bad(
        "Server menjawab 503: PAYMENT_MODE belum 'mayar' atau MAYAR_WEBHOOK_TOKEN kosong di sisi server.",
      );
    else
      warn(
        `Status ${response.status}: ${JSON.stringify(payload)?.slice(0, 200)}`,
      );
  } catch (error) {
    warn(`Endpoint webhook tidak bisa dijangkau dari sini: ${error.message}`);
  }
}

section(
  problems
    ? `Selesai — ${problems} masalah perlu dibereskan sebelum go-live.`
    : "Selesai — tidak ada masalah yang terdeteksi.",
);
console.log(
  "Langkah terakhir yang tidak bisa diotomatiskan: lakukan satu transaksi\n" +
    "nyata bernominal kecil di sandbox dan pastikan order berpindah\n" +
    "Pending -> Paid. Integrasi uang tidak layak dipercaya sebelum itu.\n",
);
process.exit(problems ? 1 : 0);
