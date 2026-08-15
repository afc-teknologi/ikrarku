# Release Manifest — ikrarku v0.15 Staging

**Release:** 0.15.0  
**Purpose:** Canva/Figma UX hardening staging candidate  
**Source baseline:** v0.14 UX Hardened Staging  
**QA baseline:** `QA/ikrarku_v0.14_Canva_Figma_UX_QA.xlsx`

## Product areas changed

- Public Landing Page
- Templates → Website Design preview
- Canvas Feature Library UX
- Generic Feature object alignment
- Greetings gradient rendering
- Buka Undangan visual controls and opening transitions
- Sound fixed-player positioning
- Public responsive/reduced-motion behavior

## Data / database migration

No schema migration is required for v0.15. New Feature properties are optional JSON fields in existing Canvas/template JSON payloads, preserving compatibility with v0.14 data.

## Deployment

Use `docker-compose.staging.yml` or `deploy/scripts/deploy-staging.sh`. A fresh source build is required.
