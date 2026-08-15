# Release Manifest — ikrarku v0.16 Staging

**Release:** 0.16.0  
**Purpose:** WYSIWYG consistency hardening after Product QA feedback  
**Database migration:** none  

## Deployment behavior

- React/Vite frontend
- Express API
- SQLite staging persistence
- Existing Docker/Compose, Nginx, backup/restore and staging healthcheck remain unchanged
- Fresh dependency install and frontend build required on staging runner/server

## Release gates

Run:

```bash
npm ci --no-audit --no-fund
npm run qa
```

The QA command includes static, database, UX regression, edge and v0.16 WYSIWYG contract checks.
