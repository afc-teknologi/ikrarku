#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

if [[ ! -f .env.staging ]]; then
  echo "ERROR: .env.staging not found. Copy .env.staging.example first."
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env.staging
set +a

if [[ -z "${CLIENT_ORIGIN:-}" ]]; then
  echo "ERROR: CLIENT_ORIGIN is missing in .env.staging"
  exit 1
fi
if [[ -z "${ADMIN_BOOTSTRAP_PASSWORD:-}" || "$ADMIN_BOOTSTRAP_PASSWORD" == "CHANGE_ME_USE_A_LONG_RANDOM_PASSWORD" || "$ADMIN_BOOTSTRAP_PASSWORD" == "admin" ]]; then
  echo "ERROR: Set a strong ADMIN_BOOTSTRAP_PASSWORD in .env.staging before deployment."
  exit 1
fi

echo "[1/7] Environment preflight"
NODE_ENV=production npm run preflight

echo "[2/7] Source-level QA gates"
node scripts/qa-static.mjs
node scripts/qa-db.mjs
node scripts/qa-ux-v014.mjs

echo "[3/7] Validate Compose"
docker compose -f docker-compose.staging.yml config >/dev/null

echo "[4/7] Build Docker image"
docker compose -f docker-compose.staging.yml build

echo "[5/7] Start/update staging"
docker compose -f docker-compose.staging.yml up -d --remove-orphans

echo "[6/7] Wait for health"
for i in {1..30}; do
  cid="$(docker compose -f docker-compose.staging.yml ps -q ikrarku)"
  status="$(docker inspect -f '{{.State.Health.Status}}' "$cid" 2>/dev/null || true)"
  if [[ "$status" == "healthy" ]]; then
    break
  fi
  sleep 2
done

cid="$(docker compose -f docker-compose.staging.yml ps -q ikrarku)"
status="$(docker inspect -f '{{.State.Health.Status}}' "$cid" 2>/dev/null || true)"
if [[ "$status" != "healthy" ]]; then
  echo "ERROR: staging container did not become healthy."
  docker compose -f docker-compose.staging.yml logs --tail=200 ikrarku || true
  exit 1
fi

echo "[7/7] Smoke test"
"$ROOT/deploy/scripts/smoke-test.sh"

echo "Staging deployment complete."
