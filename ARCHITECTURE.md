# ikrarku v0.15 Staging Architecture

## Application boundary

```text
React/Vite Client
      │ Bearer session
      ▼
Express API
      ├── Authentication and email verification
      ├── Role and permission authorization
      ├── Template and Canvas CMS
      ├── Article CMS
      ├── Checkout, order, task, and assignment workflow
      ├── Customer Service conversations
      ├── PDF receipt and email outbox
      └── Media upload
             │
             ├── SQLite
             ├── Upload directory
             └── Receipt directory
```

## Main domains

### Identity and access

- `roles`
- `users`
- `sessions`
- permission checks through API middleware
- email verification status stored on User

### Content

- `templates` including price, approval status, and `canvas_json`
- `articles` with Draft/Published state
- `sounds`
- `media_assets`

### Website

- `sites`
- Canvas JSON stored per site
- public URL resolved by slug
- RSVP and greetings stored relationally

### Commerce and service delivery

- `payment_methods`
- `orders`
- `tasks`
- automatic CS and Editor assignment
- `conversations` and `messages`
- `email_outbox`
- generated PDF receipt

## Role workflow

```text
Visitor
  ├── reads catalog and articles
  ├── registers and verifies email
  └── orders a template

User
  ├── manages website Canvas
  ├── sends chat
  └── monitors RSVP

Editor
  ├── creates Template Design
  ├── submits price and description
  ├── receives assigned build task
  └── manages User Canvas when authorized

Customer Service
  ├── receives inbound chat/order
  ├── replies through Support Inbox
  └── updates service task status

Admin / Superadmin
  ├── manages roles and permissions
  ├── approves/rejects templates
  ├── configures payment methods
  ├── manages articles and sound catalog
  └── monitors Orders & Revenue
```

## Staging boundary

v0.15 staging is designed for a single application instance with persistent SQLite and file volumes. This is suitable for staging and controlled pilot traffic. Production multi-instance deployment requires a shared database and shared object storage. The recommended migration path is PostgreSQL + S3-compatible storage + queue worker.


## v0.15 recovery and operations additions

- `conversation_reads`: per-agent unread state for support operations.
- `audit_logs`: high-impact operational audit events.
- `site_autosaves` / `template_autosaves`: latest draft recovery state.
- `site_revisions` / `template_revisions`: manual-save revision history.
- `orders.user_id`: direct Customer/order ownership while retaining email linkage for guest checkout.

The staging application remains single-instance SQLite. Horizontal production scaling still requires shared database/object storage and production-grade payment/email integration.
