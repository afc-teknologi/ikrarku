# ikrarku Sites v0.16 — WYSIWYG Consistency Hardening

v0.16 is a targeted staging release produced from Product QA feedback on v0.15 screenshots. The release focuses on consistency between Canvas Editor, Live Preview, website design-card preview, and the published invitation.

## Fixed

- Buka Undangan text color now uses the same feature state in Editor and Live/Public Preview.
- New Buka Undangan defaults to white text; the legacy generic green default is migrated to white while custom theme colors remain intact.
- Cover title no longer remains visually centered because of editor-only auto margins.
- Buka Undangan object alignment and width now have a defined meaning: they position and size the **cover content block**, while the cover background remains full Canvas.
- Editor and public cover use the same content-placement helper.
- Sound no longer exposes a dead Feature Width control; its alignment maps to fixed-player position.
- Full-width Gallery disables irrelevant object-position controls until Full Width is disabled.
- Generic Box Style is contextualized for Buka Undangan and Sound; duplicate Box Style controls were removed from Advanced.
- `Template pada website` now previews **Canvas 01 only**, using actual saved first-section design data, feature colors, gradient, background, content, alignment and width.
- Template quick preview reuses the actual saved preview renderer when template canvas data is available.

## QA hardening

Added `scripts/qa-wysiwyg-v016.mjs` to guard the WYSIWYG contract and prevent regressions in cover color, alignment, width and design preview behavior.

No database schema migration is required. The release only changes frontend rendering/default hydration behavior and source-level QA contracts.
