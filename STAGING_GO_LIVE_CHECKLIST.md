# ikrarku v0.15 — Staging Go-Live Checklist

## Configuration gate

- [ ] `.env.staging` exists and is not committed.
- [ ] `CLIENT_ORIGIN` matches the HTTPS staging origin.
- [ ] `ADMIN_BOOTSTRAP_PASSWORD` is a long random value, not `admin` or the placeholder.
- [ ] SMTP sandbox/transactional credentials configured.
- [ ] `PAYMENT_MODE=simulation` confirmed for staging.
- [ ] Docker persistent volumes for DB/uploads/receipts confirmed.

## Automated release gate

- [ ] `npm run preflight` PASS.
- [ ] `npm run qa:static` PASS.
- [ ] `npm run qa:db` PASS.
- [ ] `npm run qa:ux` PASS.
- [ ] `npm run qa:edge` PASS.
- [ ] TypeScript build PASS.
- [ ] Vite production build PASS.
- [ ] Server syntax PASS.
- [ ] Docker image build PASS on connected staging runner.
- [ ] Container healthcheck PASS.
- [ ] Smoke test PASS.

## Viewer acceptance

- [ ] Landing has no DB/SQLite/localhost implementation jargon.
- [ ] Actual template preview works on desktop and mobile.
- [ ] Guest checkout requires only useful customer/order data.
- [ ] Sign In/Register returns to the selected checkout journey.
- [ ] Public invitation, Buka Undangan, Sound, Gallery, Location, RSVP and Live Chat tested on mobile.
- [ ] Keyboard/focus/reduced-motion acceptance tested.

## Customer acceptance

- [ ] Role language says Customer.
- [ ] Registration + verification + resend verification works.
- [ ] Refresh keeps authenticated context.
- [ ] Dashboard readiness reflects real setup criteria.
- [ ] My Project shows order/payment/team/tasks/receipt.
- [ ] Settings tabs all work.
- [ ] Account email/password change requires current password.
- [ ] Editor Undo/Redo, autosave, Revisions and true Discard tested.
- [ ] Public URL uniqueness and publish path tested.

## Web Designer acceptance

- [ ] Role language says Web Designer.
- [ ] Assigned Customer context remains clear while editing.
- [ ] Create Template has no public URL.
- [ ] Submit → Pending → Administrator Approval works.
- [ ] Rejected feedback is visible and editable/resubmittable.
- [ ] Undo/Redo, autosave, revision restore and save/reload tested.
- [ ] Assigned-client messaging scope verified.

## Administrator acceptance

- [ ] Secure bootstrap account works; no default credential hint is visible.
- [ ] Users and roles can be created/updated safely.
- [ ] In-use role deletion is blocked; unused role deletion asks confirmation.
- [ ] Audit Trail records high-impact operations.
- [ ] Template Approval workflow works end to end.
- [ ] Article search + Draft/Publish works.
- [ ] Orders & Revenue totals and exports match DB.
- [ ] Payment Method configuration tested.

## Customer Service acceptance

- [ ] Search filters by customer/email/phone/order/template.
- [ ] Needs Reply / Unread / Open / Pending / Resolved views work.
- [ ] Unread is cleared when conversation is opened.
- [ ] SLA indicator is visible for customer messages awaiting reply.
- [ ] Conversation status can be changed in context.
- [ ] Customer, order, payment, Web Designer, CS and task context is visible.
- [ ] Reply failure preserves text for retry.
- [ ] Notification sound and mute behavior tested.

## Environment-only acceptance

- [ ] Chrome / Edge / Firefox desktop.
- [ ] Safari macOS.
- [ ] Chrome Android.
- [ ] Safari iPhone.
- [ ] Physical QR scan.
- [ ] SMTP verification and receipt delivery.
- [ ] Docker restart/recreate persistence.
- [ ] Backup + restore drill.
- [ ] Basic performance measurements.

## Sign-off

- [ ] Role-based UX UAT completed with representative users.
- [ ] No open Critical/P0 staging defect.
- [ ] Product/UAT approval.

## v0.15 Canva/Figma UX acceptance

- [ ] Landing hero communicates creative outcome before internal operations.
- [ ] Inspiration rail and template cards remain usable at 375/390 px and desktop.
- [ ] Website Design card preview changes after saved Canvas content/color/media changes.
- [ ] Feature Library search returns expected feature and handles no-result state.
- [ ] Feature Duplicate creates a new unique feature ID.
- [ ] Feature alignment Left / Center / Right / Stretch tested on Text, Form, Image, Video, Gallery, Event, Greetings, Quote, Gift, Buka Undangan, Countdown and Location.
- [ ] Feature Width works together with alignment without overflow.
- [ ] Gradient regression executed for all Feature types; Greetings gradient is visibly represented.
- [ ] Buka Undangan has no built-in background image when media is None.
- [ ] Buka Undangan icon picker / no-icon / icon size / icon position tested.
- [ ] Buka Undangan button radius / border / background / text color / padding tested.
- [ ] Buka Undangan content Left / Center / Right and vertical Top / Middle / Bottom tested.
- [ ] Fade / Slide Up / Slide Down / Slide Left / Slide Right / Zoom / Curtain / Split / Dissolve tested.
- [ ] Opening duration/easing changes are visible and do not cause double-open state.
- [ ] OS Reduce Motion simplifies landing and Buka Undangan animation.
