#!/usr/bin/env bash
set -euo pipefail
BACKUP_DIR="${1:-./backups}"
STAMP="$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR/$STAMP"
DEST="$(realpath "$BACKUP_DIR/$STAMP")"

for spec in   "ikrarku_staging_data:data"   "ikrarku_staging_uploads:uploads"   "ikrarku_staging_receipts:receipts"; do
  volume="${spec%%:*}"
  folder="${spec##*:}"
  docker run --rm -v "$volume:/source:ro" -v "$DEST:/backup" alpine     sh -c "cd /source && tar czf /backup/${folder}.tar.gz ."
done

sha256sum "$DEST"/*.tar.gz > "$DEST/SHA256SUMS"
echo "Backup created: $DEST"
