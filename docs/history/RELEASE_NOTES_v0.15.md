# ikrarku Sites v0.15 — Canva/Figma UX Hardening

v0.15 is the staging update produced from `ikrarku_v0.14_Canva_Figma_UX_QA.xlsx`.

## P0 improvements implemented

- Creation-first landing page with richer design inspiration, editor-oriented visual storytelling, and responsive public layout.
- Actual saved Website Design preview: one design card now mini-renders its saved Canvas/Column/Feature structure instead of relying on a generic preset thumbnail.
- Feature Library object alignment for left / center / right / stretch plus feature width control.
- Feature Library search and feature duplicate action.
- Gradient rendering contract improved for Greetings and special surfaces.
- Greetings supports aligned inner content and a deliberate empty state.
- Buka Undangan upgraded with editable icon, icon size/position, button radius, border, colors, padding, whole-content alignment, vertical alignment, and opening transition options.
- Opening transitions include Fade, Slide Up/Down/Left/Right, Zoom, Curtain, Split Reveal and Dissolve, with duration/easing controls.
- Reduced-motion CSS fallback added for landing and invitation transitions.
- Public cover no longer contains the old built-in `cover-reference.png` background.
- Fixed sound player uses Feature alignment as left / center / right player position.

## UX benchmark direction

The update follows interaction principles identified in the QA benchmark: visual/direct editing, object-level alignment, immediately visible style changes, actual preview parity, progressive controls, and controllable animation. The goal is not to visually clone Canva or Figma, but to reach a similarly understandable editing mental model for ikrarku workflows.

## Remaining UAT gates

Human device/browser UX validation, contrast checks on arbitrary user media, large-project stress testing, and full staging deployment tests remain part of the staging/UAT acceptance process.
