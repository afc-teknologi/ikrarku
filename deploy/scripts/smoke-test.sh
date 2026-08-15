#!/usr/bin/env bash
set -euo pipefail
BASE_URL="${1:-http://127.0.0.1:5180}"

echo "Checking $BASE_URL/api/health"
health="$(curl -fsS "$BASE_URL/api/health")"
echo "$health"
echo "$health" | grep -q '"ok":true'

echo "Checking frontend shell"
curl -fsSI "$BASE_URL/" | head -n 1

echo "Checking public bootstrap"
curl -fsS "$BASE_URL/api/public/bootstrap" >/dev/null

echo "Smoke test PASS"
