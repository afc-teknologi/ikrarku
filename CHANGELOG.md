## 0.16.0

- Fixed Buka Undangan text-color mismatch between Canvas Editor and Preview.
- Unified cover content position/width semantics across Editor and public renderer.
- Fixed right-aligned cover title being forced toward center by editor-only margins.
- Changed website design preview to use actual Canvas 01 only.
- Hid/contextualized dead Feature Width / Box Style controls for special features.
- Added v0.16 WYSIWYG source-contract QA.

# Changelog

## v0.14.0

- Role-based UX hardening from the v0.13 UX QA workbook.
- Added Customer My Project/order timeline and meaningful website-readiness checklist.
- Added Web Designer Undo/Redo, autosave, true Discard and Revision History.
- Added Administrator Audit Trail, safe role deletion and Article search.
- Added CS search, queue filters, unread state, SLA indicator, status workflow and richer order context.
- Removed public implementation/debug jargon and frontend demo account/customer fallback datasets.
- Added current-password reauthentication, resend verification and secure staging bootstrap password gate.
- Added v0.14 UX and expanded SQLite QA contracts.

## v0.13.0

- Corrected Website Design hierarchy so one applied template/design is represented by one card.
- Removed redundant active-client badge from Template & Canvas.

## v0.12.0

- QA/security hardening for RBAC, order access, public chat, uploads, payment safety and assignment flows.

## v0.11.0

- Fixed Live Chat so the sender-side message remains visible after API persistence.
- Separated Create Canvas and Create Template journeys.
- Removed URL configuration from Template Design workspace.
- Persisted Template Canvas structures in `templates.canvas_json`.
- Added Admin approval task refresh for pending Editor templates.
- Added database-backed sound notification preference for incoming tasks and chats.
- Added Show/Hide password controls.
- Added repeat-password validation and email verification before User login.
- Added verification email outbox and localhost verification helper.
- Redesigned landing Articles into catalog cards.
- Redesigned Article detail into a wide dedicated page.
- Required customer email and phone during checkout.
- Added Sign In and Register paths from checkout.
- Added Admin Orders & Revenue dashboard with quantity, nominal, customer, and assignment data.
- Added CSV and Excel-compatible order export.
- Added environment-configurable database, upload, and receipt paths.
- Added Docker multi-stage build, Compose volumes/healthcheck, Nginx sample, CI check, and staging deployment guide.

## v0.10.0

- Routed public and authenticated chat into the Customer Service inbound database.
- Added outbound User messaging for Admin, Editor, and Customer Service.
- Added centralized Template Approval tasks with Approve/Reject feedback and email notification.
- Added Published/Pending/Rejected template workflow display.
- Moved List Undangan into a dedicated Site Pages screen and removed Guest Book navigation.
- Added Canvas drag-and-drop ordering in Page Structure and the visual Canvas area.
- Added public website routes at `localhost:5173/<slug>` backed by SQLite.
- Expanded editable Buka Undangan copy and styling controls.
- Fixed Use Template so it creates new Canvas sections and opens the editor.
- Added custom-role permissions for template approval and outbound messaging.

## v0.9.0

- Migrated browser-only prototype data to Express API and SQLite.
- Added authentication, sessions, role permissions, templates, Article CMS, orders, tasks, conversations, media upload, PDF receipts, and email outbox.

## 0.15.0
- Canva/Figma UX benchmark hardening release.
- Reworked public landing into creation-first visual journey.
- Actual saved website-design mini preview.
- Feature object alignment and width controls.
- Feature Library search and duplicate.
- Fixed Greetings gradient rendering contract.
- Deep Buka Undangan icon/button/layout/transition controls.
- Added reduced-motion behavior and edge UX QA suite.
