# ikrarku Sites v0.15 — Staging Deployment Guide

This package is the UX-hardened staging release based on the v0.13 Role-Based UX QA baseline.

## Architecture

```text
Browser
  |
HTTPS / staging.ikrarku.id
  |
Nginx reverse proxy
  |
127.0.0.1:5180
  |
Docker container: ikrarku
  |- React/Vite production bundle
  |- Express API /api
  |- SQLite /app/data/ikrarku.sqlite
  |- Uploads /app/uploads
  `- Receipts /app/receipts
```

The staging profile intentionally remains single-instance.

## Minimum host

- Ubuntu 24.04 LTS or equivalent supported Linux.
- 2 vCPU / 4 GB RAM / 30 GB SSD.
- Docker Engine + Compose plugin.
- Host Nginx.
- DNS for `staging.ikrarku.id`.
- SMTP sandbox/transactional provider.

## Configure environment

```bash
cp .env.staging.example .env.staging
nano .env.staging
```

Required before deploy:

```env
CLIENT_ORIGIN=https://staging.ikrarku.id
ADMIN_BOOTSTRAP_USERNAME=admin
ADMIN_BOOTSTRAP_EMAIL=admin@staging.ikrarku.id
ADMIN_BOOTSTRAP_PASSWORD=<LONG_RANDOM_PASSWORD>
PAYMENT_MODE=simulation
```

Do not leave `ADMIN_BOOTSTRAP_PASSWORD` as the placeholder or `admin`; the preflight will reject it.

Configure SMTP to close email-verification and receipt-delivery acceptance testing.

## Deploy

Recommended:

```bash
chmod +x deploy/scripts/*.sh
./deploy/scripts/deploy-staging.sh
```

The deployment performs:

1. Production environment preflight.
2. Static, database and UX contract QA.
3. Docker Compose config validation.
4. Docker image build from v0.15 source.
5. Container update.
6. Health wait.
7. Smoke test.

## Manual deployment

```bash
docker compose -f docker-compose.staging.yml build
docker compose -f docker-compose.staging.yml up -d --remove-orphans
docker compose -f docker-compose.staging.yml ps
curl http://127.0.0.1:5180/api/health
```

Expected health response includes `ok: true` and `database: sqlite`.

## Reverse proxy / TLS

Use `deploy/nginx/ikrarku-staging.conf`, then provision TLS using your infrastructure standard. Browser origin must exactly match `CLIENT_ORIGIN`.

## Backup / restore

```bash
./deploy/scripts/backup-staging.sh
./deploy/scripts/restore-staging.sh <backup-archive>
```

Always perform a restore drill before production migration.

## Staging boundaries

- Payment remains simulation-only.
- SQLite is appropriate for this single-instance staging profile.
- SMTP, browser/device testing, TLS, QR scanning, and real human role-based usability testing require the deployed environment.
