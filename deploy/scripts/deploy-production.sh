#!/usr/bin/env bash
# Deploy / update ikrarku.id (production). Hanya butuh Docker di host.
#   ./deploy/scripts/deploy-production.sh
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
COMPOSE="docker compose -f docker-compose.production.yml"

if [[ ! -f .env.production ]]; then
  echo "ERROR: .env.production tidak ada. Salin dari .env.production.example lalu isi."
  exit 1
fi
# Dibaca baris per baris, TIDAK di-`source`: nilai berisi spasi, < > atau
# karakter khusus (password, placeholder) membuat bash error, padahal Docker
# membaca berkas env apa adanya.
envval() { grep -E "^$1=" .env.production | tail -n 1 | cut -d= -f2- | sed -e 's/\r$//' -e 's/^"\(.*\)"$/\1/' -e "s/^'\(.*\)'$/\1/"; }
CLIENT_ORIGIN="$(envval CLIENT_ORIGIN)"
ADMIN_BOOTSTRAP_PASSWORD="$(envval ADMIN_BOOTSTRAP_PASSWORD)"
PAYMENT_MODE="$(envval PAYMENT_MODE)"
MAYAR_API_KEY="$(envval MAYAR_API_KEY)"
MAYAR_WEBHOOK_TOKEN="$(envval MAYAR_WEBHOOK_TOKEN)"
SMTP_HOST="$(envval SMTP_HOST)"
SMTP_PASS="$(envval SMTP_PASS)"
placeholders="$(grep -E '^[A-Z_]+=(<[^>]*>|.*ISI_|.*CHANGE_ME)' .env.production | cut -d= -f1 | tr '\n' ' ' || true)"
if [[ -n "$placeholders" ]]; then
  echo "ERROR: masih placeholder di .env.production: $placeholders"; exit 1
fi

[[ "${CLIENT_ORIGIN:-}" == "https://ikrarku.id" ]] || { echo "ERROR: CLIENT_ORIGIN harus https://ikrarku.id"; exit 1; }
if [[ ${#ADMIN_BOOTSTRAP_PASSWORD} -lt 12 ]]; then
  echo "ERROR: ADMIN_BOOTSTRAP_PASSWORD minimal 12 karakter."; exit 1
fi
if [[ "${PAYMENT_MODE:-}" != "mayar" || -z "${MAYAR_API_KEY:-}" || -z "${MAYAR_WEBHOOK_TOKEN:-}" ]]; then
  echo "ERROR: Production wajib PAYMENT_MODE=mayar dengan MAYAR_API_KEY dan MAYAR_WEBHOOK_TOKEN terisi."; exit 1
fi
if [[ -z "${SMTP_HOST:-}" || -z "${SMTP_PASS:-}" ]]; then
  echo "ERROR: SMTP belum lengkap. Customer tidak akan menerima receipt & info akun."; exit 1
fi

echo "[1/6] Backup production sebelum update"
if docker volume inspect ikrarku_production_data >/dev/null 2>&1; then
  bash "$ROOT/deploy/scripts/backup-production.sh" "$ROOT/backups/production"
else
  echo "  (belum ada volume production — deploy pertama)"
fi

echo "[2/6] Validasi Compose"
$COMPOSE config >/dev/null

echo "[3/6] Build image"
$COMPOSE build

echo "[4/6] Preflight di dalam image"
$COMPOSE run --rm --no-deps ikrarku node scripts/preflight.mjs

echo "[5/6] Start/update production"
$COMPOSE up -d --remove-orphans
for _ in {1..30}; do
  cid="$($COMPOSE ps -q ikrarku)"
  status="$(docker inspect -f '{{.State.Health.Status}}' "$cid" 2>/dev/null || true)"
  [[ "$status" == "healthy" ]] && break
  sleep 2
done
if [[ "$status" != "healthy" ]]; then
  echo "ERROR: container production tidak sehat."
  $COMPOSE logs --tail=200 ikrarku || true
  exit 1
fi

echo "[6/6] Smoke test"
bash "$ROOT/deploy/scripts/smoke-test.sh" http://127.0.0.1:5181
echo "Production deployment selesai: https://ikrarku.id"
