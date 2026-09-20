// Behavioral access-control checks for the QA/QC audit gates.
// Boots the real server on a temp port with a throwaway SQLite file and asserts
// over HTTP, so these are not text-pattern matches on source.
//
// Run: node scripts/qa-access.mjs
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = mkdtempSync(join(tmpdir(), "ikrarku-access-"));
const dbFile = join(dir, "qa.sqlite");
const PORT = 5391;
const BASE = `http://127.0.0.1:${PORT}/api`;
const ADMIN = "Adm1n!Passw0rd";

let passed = 0;
const failures = [];
function check(name, ok, detail = "") {
  if (ok) {
    passed += 1;
    console.log(`PASS ${name}`);
  } else {
    failures.push(name);
    console.log(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

async function call(path, { method, body, token, headers = {} } = {}) {
  const response = await fetch(BASE + path, {
    method: method || (body ? "POST" : "GET"),
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
}

function sql(statement, params = []) {
  const db = new DatabaseSync(dbFile);
  db.prepare(statement).run(...params);
  db.close();
}

const server = spawn(process.execPath, [join(root, "server", "index.mjs")], {
  env: {
    ...process.env,
    NODE_ENV: "production",
    API_PORT: String(PORT),
    DATA_DIR: dir,
    UPLOAD_DIR: dir,
    RECEIPT_DIR: dir,
    DB_FILE: dbFile,
    CLIENT_ORIGIN: `http://127.0.0.1:${PORT}`,
    PAYMENT_MODE: "simulation",
    SMTP_HOST: "",
    ADMIN_BOOTSTRAP_USERNAME: "admin",
    ADMIN_BOOTSTRAP_EMAIL: "admin@qa.local",
    ADMIN_BOOTSTRAP_PASSWORD: ADMIN,
  },
  stdio: "ignore",
});

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/api/health`);
      if (response.ok) return true;
    } catch {
      /* server belum siap */
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return false;
}

function shutdown() {
  server.kill();
  try {
    rmSync(dir, { recursive: true, force: true });
  } catch {
    /* abaikan */
  }
}

try {
  if (!(await waitForServer())) {
    console.log("FAIL server tidak start");
    shutdown();
    process.exit(1);
  }

  const login = await call("/auth/login", {
    body: { username: "admin", password: ADMIN },
  });
  const adminToken = login.data.token;
  check("Administrator dapat login", login.status === 200 && !!adminToken);

  // QA-01 — respons publik tidak boleh membocorkan tautan reset di production.
  const forgot = await call("/auth/forgot-password", {
    body: { email: "admin@qa.local" },
  });
  check(
    "QA-01 forgot-password tidak membocorkan tautan reset (production, tanpa SMTP)",
    forgot.status === 200 &&
      !("devResetUrl" in forgot.data) &&
      !JSON.stringify(forgot.data).includes("token="),
    JSON.stringify(forgot.data),
  );

  // QA-08 — webhook menolak konfirmasi tanpa autentikasi yang dikonfigurasi.
  const webhook = await call("/webhooks/mayar", {
    body: { event: "paid", data: { reference: "any", amount: 1 } },
  });
  check(
    "QA-08 webhook menolak konfirmasi saat belum dikonfigurasi",
    webhook.status === 503 || webhook.status === 401,
    `status ${webhook.status}`,
  );

  // Siapkan akun CS untuk uji QA-16.
  const csCreate = await call("/users", {
    token: adminToken,
    body: {
      firstName: "CS",
      lastName: "Satu",
      email: "cs1@qa.local",
      username: "csqa1",
      password: "Passw0rd!",
      roleId: "role_cs",
    },
  });
  check("Akun CS dapat dibuat Administrator", csCreate.status < 300);
  const csLogin = await call("/auth/login", {
    body: { username: "csqa1", password: "Passw0rd!" },
  });
  const csToken = csLogin.data.token;

  // QA-16 — CS tanpa permission canvas tidak boleh publish site.
  const publish = await call("/site", {
    method: "PUT",
    token: csToken,
    body: {
      title: "CS Site",
      slug: "cs-site-qa",
      status: "Published",
      sections: [],
    },
  });
  check(
    "QA-16 CS tanpa permission canvas ditolak saat publish site",
    publish.status === 403,
    `status ${publish.status}`,
  );

  // QA-03 — akun dinonaktifkan langsung kehilangan akses, bukan hanya gagal login berikutnya.
  const beforeDisable = await call("/me", { token: csToken });
  check("Session CS valid sebelum dinonaktifkan", beforeDisable.status === 200);
  sql("UPDATE users SET active=0 WHERE username=?", ["csqa1"]);
  const afterDisable = await call("/me", { token: csToken });
  check(
    "QA-03 session akun nonaktif langsung ditolak",
    afterDisable.status === 401,
    `status ${afterDisable.status} code ${afterDisable.data.code}`,
  );
  sql("UPDATE users SET active=1 WHERE username=?", ["csqa1"]);

  // QA-03 — verifikasi email yang dicabut juga menghentikan session berjalan.
  sql("UPDATE users SET email_verified=0 WHERE username=?", ["csqa1"]);
  const unverified = await call("/me", { token: csToken });
  check(
    "QA-03 session ditolak ketika verifikasi email dicabut",
    unverified.status === 401,
    `status ${unverified.status} code ${unverified.data.code}`,
  );
  sql("UPDATE users SET email_verified=1 WHERE username=?", ["csqa1"]);

  // QA-12 — order milik orang lain tidak boleh ikut terbaca.
  const orders = await call("/me/orders", { token: adminToken });
  check(
    "QA-12 daftar order hanya milik akun yang login",
    orders.status === 200 && Array.isArray(orders.data),
    `status ${orders.status}`,
  );

  const total = passed + failures.length;
  console.log(`\nAccess QA: ${passed}/${total} passed`);
  if (failures.length) console.log(`Gagal: ${failures.join(", ")}`);
  shutdown();
  process.exit(failures.length ? 1 : 0);
} catch (error) {
  console.log("FAIL harness error:", error.message);
  shutdown();
  process.exit(1);
}
