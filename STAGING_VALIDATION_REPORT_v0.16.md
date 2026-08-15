# Staging Validation Report — ikrarku v0.16

## QA result

| Check | Result |
|---|---|
| Static application/security QA | 32 / 32 PASS |
| SQLite/schema QA | 38 / 38 PASS |
| Canva/Figma UX regression QA | 45 / 45 PASS |
| Edge-source QA | 15 / 15 PASS |
| v0.16 WYSIWYG contract QA | 27 / 27 PASS |
| Node backend syntax | PASS |
| TSX syntax transpile diagnostics | 0 |
| Package lock public registry check | PASS |

## Fix validation scope

1. Buka Undangan text color uses feature state in both Editor and public renderer.
2. Cover content position and width share one placement helper.
3. Editor-only title auto-margin no longer defeats right alignment.
4. Feature Width for Buka Undangan is defined as content-block width; background remains full Canvas.
5. Dead width/box controls are hidden or contextualized for special renderers.
6. Website design card uses only Canvas 01 and reads actual saved values.
7. Template quick preview reuses actual saved preview renderer.

## Build note

A fresh `npm ci` could not complete inside the artifact sandbox because DNS resolution to `registry.npmjs.org` returned `EAI_AGAIN`. The package intentionally excludes stale `dist` and incomplete `node_modules`. The staging deployment pipeline must run a fresh install/build on a network-enabled runner/server.
