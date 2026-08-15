# UX QA Implementation Matrix — v0.15

| QA feedback | v0.15 implementation | Status |
|---|---|---|
| Research based on Canva/Figma UX | QA benchmark translated into targeted UX contracts and editor changes | Implemented |
| Canva-like landing | Creation-first hero, inspiration rail, creative capabilities, simplified public content | Implemented |
| Canva-like Canvas usability | Object alignment, width, search, duplicate, existing undo/redo/autosave/revisions retained | Improved |
| Gradient not visible in Greetings | Gradient-aware translucent Greetings surfaces + full regression contract | Fixed |
| Edge cases | v0.14 QA workbook included in staging package; v0.15 targeted UX test added | Covered for source contract; human UAT still required |
| Website template preview not representative | Actual saved Canvas/Column/Feature mini-render used in website design card | Fixed |
| Align whole Feature Library | Feature object alignment Left/Center/Right/Stretch + Feature Width | Implemented |
| Buka Undangan customization | Icon, button style, content alignment, vertical placement, 9 opening transitions, duration/easing | Implemented |

## Special rendering rules

- `Content alignment` affects text/content inside a feature.
- `Feature alignment` affects the feature object within its Column.
- Gradient is rendered on the feature surface; widgets with inner cards must use transparent/translucent surfaces so the selected gradient remains visible.
- Sound is a fixed public object; Feature alignment maps to fixed player left/center/right.
- Buka Undangan uses the feature background gradient and optional image; no image is injected by default.
