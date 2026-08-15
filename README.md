# ikrarku Sites CMS v0.16 — WYSIWYG Consistency Staging

v0.16 hardens the visual contract between Canvas Editor, Live Preview, website design preview and the published invitation. It follows the Canva/Figma UX hardening delivered in v0.15 and addresses Product QA feedback on Buka Undangan color/alignment/width and template preview fidelity.

## Main v0.16 changes

- Buka Undangan Editor/Preview text-color parity
- right/left/center cover content positioning is consistent
- Feature Width for Buka Undangan controls the content block, not the full-screen cover background
- special-feature dead controls removed/contextualized
- website template card uses actual Canvas 01 only
- template quick preview reuses actual saved-design preview
- WYSIWYG regression script added

## QA

```bash
npm run qa:static
npm run qa:db
npm run qa:ux
npm run qa:edge
npm run qa:wysiwyg
```

See `STAGING_VALIDATION_REPORT_v0.16.md`, `WYSIWYG_QA_MATRIX_v0.16.md`, and `RELEASE_NOTES_v0.16.md`.
