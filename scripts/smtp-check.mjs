#!/usr/bin/env node
// TC-073 — uji konfigurasi SMTP dari VPS tanpa mencetak password.
//   node scripts/smtp-check.mjs                 → hanya cek koneksi & login
//   node scripts/smtp-check.mjs alamat@email.com → juga kirim email uji
// Variabel dibaca dari environment (.env.staging dimuat oleh docker compose).
import nodemailer from "nodemailer";
const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || 587);
const secure = port === 465 || String(process.env.SMTP_SECURE) === "true";
const to = process.argv[2];
if (!host) {
  console.error("✗ SMTP_HOST kosong. Isi SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM di .env.staging.");
  process.exit(1);
}
console.log(`SMTP ${host}:${port} · TLS langsung: ${secure ? "ya" : "tidak (STARTTLS)"} · user: ${process.env.SMTP_USER ? "terisi" : "kosong"} · from: ${process.env.SMTP_FROM || "(bawaan)"}`);
console.log(`CLIENT_ORIGIN: ${process.env.CLIENT_ORIGIN || "(kosong — tautan email akan salah)"}`);
const transporter = nodemailer.createTransport({
  host, port, secure,
  auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  connectionTimeout: 15000, greetingTimeout: 15000, socketTimeout: 30000,
});
try {
  await transporter.verify();
  console.log("✓ Koneksi & login SMTP berhasil");
} catch (error) {
  console.error(`✗ SMTP gagal: ${error.code || ""} ${error.message}`);
  if (port === 587 && /wrong version|ssl/i.test(error.message)) console.error("  Petunjuk: server ini memakai TLS langsung — coba SMTP_PORT=465.");
  if (/auth|535|534/i.test(error.message)) console.error("  Petunjuk: username/password salah. Untuk Gmail wajib App Password, bukan password akun.");
  process.exit(1);
}
if (to) {
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || "ikrarku Sites <noreply@ikrarku.local>",
    to,
    subject: "Uji SMTP ikrarku",
    text: "Email uji dari scripts/smtp-check.mjs. Bila ini sampai, email aktivasi akun juga akan terkirim.",
  });
  console.log(`✓ Email uji terkirim ke ${to} (id ${info.messageId}). Cek juga folder Spam.`);
}
