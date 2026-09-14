# ikrarku v0.11 Architecture

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

v0.11 is designed for a single application instance with persistent SQLite and file volumes. This is suitable for staging and controlled pilot traffic. Production multi-instance deployment requires a shared database and shared object storage. The recommended migration path is PostgreSQL + S3-compatible storage + queue worker.
