#!/usr/bin/env bash
set -euo pipefail
if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <backup-directory>"
  exit 1
fi

BACKUP_DIR="$(realpath "$1")"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

sha256sum -c "$BACKUP_DIR/SHA256SUMS"
docker compose -f docker-compose.staging.yml down

for spec in   "ikrarku_staging_data:data"   "ikrarku_staging_uploads:uploads"   "ikrarku_staging_receipts:receipts"; do
  volume="${spec%%:*}"
  folder="${spec##*:}"
  docker volume create "$volume" >/dev/null
  docker run --rm -v "$volume:/target" -v "$BACKUP_DIR:/backup:ro" alpine     sh -c "find /target -mindepth 1 -maxdepth 1 -exec rm -rf {} +; cd /target && tar xzf /backup/${folder}.tar.gz"
done

docker compose -f docker-compose.staging.yml up -d
"$ROOT/deploy/scripts/smoke-test.sh"
echo "Restore complete."
