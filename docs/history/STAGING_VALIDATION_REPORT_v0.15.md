# Staging Validation Report — ikrarku v0.15

## Release scope

v0.15 implements the P0 Product/UX findings from `QA/ikrarku_v0.14_Canva_Figma_UX_QA.xlsx`, especially landing-page experience, actual template preview, Feature alignment, gradient behavior, and Buka Undangan customization.

## Validation executed in artifact environment

| Validation | Result |
|---|---:|
| Preflight / Node version / public npm lock registry | PASS |
| Server JavaScript syntax | PASS |
| TypeScript/TSX syntax transpile | PASS |
| TypeScript source contract check with local dependency stubs | PASS |
| Static security/regression QA | 32 / 32 PASS |
| SQLite schema/data contract QA | 38 / 38 PASS |
| v0.15 targeted UX source-contract QA | 45 / 45 PASS |
| v0.15 edge-source QA | 15 / 15 PASS |
| Internal registry references in package-lock | 0 |

## Dependency/build boundary

A fresh `npm ci` was attempted in the artifact environment, but the sandbox DNS returned `EAI_AGAIN` for `registry.npmjs.org`. Because dependencies could not be fully restored in this isolated environment, a fresh Vite production bundle was **not falsely marked as passed** here.

The package intentionally does **not** ship the stale v0.14 `dist/`. The provided Dockerfile and staging deployment script run a fresh `npm ci` and `npm run build` in the connected staging environment. This prevents deploying old browser assets with new source code.

## Mandatory staging acceptance

Before UAT sign-off on the staging host:

1. `npm ci --no-audit --no-fund`
2. `npm run qa`
3. Docker image build
4. `/api/health` smoke test
5. Browser/device UX tests from the QA workbook
6. Manual gradient regression on all Feature Library items
7. Manual Buka Undangan transition/keyboard/reduced-motion test
8. Verify actual Website Design card preview after editing and saving a template

## Release position

**Source QA / DB / security / targeted UX contracts: PASS**  
**Fresh dependency build: pending connected staging environment due artifact-environment DNS restriction**
