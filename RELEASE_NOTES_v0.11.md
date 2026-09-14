# Release Notes — v0.11

## Recommended test order

1. Login as `admin / admin` and change the password.
2. Create one Editor and one Customer Service account.
3. Register a new User; confirm that login is blocked before email verification.
4. Verify the User through SMTP or the localhost helper link.
5. Create a Template as Editor and confirm the Admin Approval task appears.
6. Approve the Template and confirm it appears in the catalog.
7. Open checkout; confirm email and phone are mandatory.
8. Complete simulated payment and verify:
   - Order record;
   - CS task;
   - Editor task;
   - inbound conversation;
   - PDF receipt;
   - email outbox record.
9. Open Orders & Revenue and export CSV and Excel.
10. Send a Live Chat message and confirm it remains visible for the User and appears in CS Inbox.
11. Create a new task/chat and validate sound notification plus mute setting.
12. Create and publish an Article; validate catalog card and wide Article page.

## Known boundary

The payment flow is still a staging/local simulation. It is not a production payment confirmation mechanism.
