# Chanchal Fashion Simple

A simple Next.js storefront for Chanchal Fashion with a JSON-backed data layer for products, orders, and config.

## Prerequisites

- Node.js 20.x or later
- npm

## Environment variables

`ADMIN_SESSION_SECRET` is required for admin auth token signing and verification.

- Minimum length: 32 characters
- Use a long random value (recommended: 48+ random bytes)

Generate one quickly:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Development (`.env.local`):

```bash
ADMIN_SESSION_SECRET=replace-with-a-long-random-secret-at-least-32-chars
```

Production:

- Set `ADMIN_SESSION_SECRET` in your hosting platform or server environment.
- Do not commit production secrets to the repository.
- Rotate the secret if it is ever exposed (rotation invalidates existing admin session cookies).

## Admin password troubleshooting

Admin login uses a hashed password stored in `data/config.json` as `adminPasswordHash`.
If an old plain password no longer works, reset the admin password by writing a new hash.

1. Run this command from the project root (replace `ReplaceWithStrongPass123!`):

```bash
node -e "const fs=require('fs');const crypto=require('crypto');const p='data/config.json';const cfg=JSON.parse(fs.readFileSync(p,'utf8'));const newPass='ReplaceWithStrongPass123!';const salt=crypto.randomBytes(16).toString('base64url');const hash=crypto.scryptSync(newPass,salt,64).toString('base64url');cfg.adminPasswordHash=`scrypt$${salt}$${hash}`;delete cfg.adminPassword;fs.writeFileSync(p,JSON.stringify(cfg,null,2)+'\n');console.log('Admin password reset.');"
```

2. Restart the app:

```bash
npm run dev
```

3. Log in again at `/admin` with the new password.

Notes:

- Password updates through the admin security API require at least 12 characters.
- If login still fails, clear localhost cookies and retry.

## Run locally

1. Install dependencies
   ```bash
   npm install
   ```

2. Start the development server
   ```bash
   npm run dev
   ```

3. Open the app
   - Visit http://localhost:3000
   - The home page shows the storefront shell
   - Visit /cart for the cart placeholder
   - Visit /admin for the admin dashboard

## Project structure

- app/ — Next.js App Router pages and API routes
- components/ — reusable UI components
- lib/ — helper modules for JSON data and image handling
- data/ — seed JSON files for products, orders, and config

## Product metadata

Products support additional merchandising and audit metadata:

- `size` (optional free text): examples include `Free Size`, `38 inch`, `XL`
- `createdAt` (optional ISO timestamp): set when product is created
- `updatedAt` (optional ISO timestamp): refreshed when product is updated

Admin product lists prioritize newest activity using `updatedAt` with `createdAt` fallback.
Storefront provides an explicit sort option (`Featured` or `Newest`) while preserving existing type/category filters.

## Product image upload best practices

The app optimizes uploaded images with `sharp` and stores them as WebP at about 1000px width. To get consistent card and zoom views, prepare source photos with a consistent portrait composition.

Recommended criteria:

- Aspect ratio: `3:4` portrait (for example `1200x1600`)
- Minimum quality size: `1000px` on the shortest side before upload
- File type: original `JPG`, `PNG`, or `WebP` (avoid screenshots and re-shared compressed images)
- Subject framing: keep product centered with small top/bottom breathing room
- Lighting/background: even lighting and clean, non-distracting background

Why this matters:

- Product cards use a fixed portrait frame to keep the grid aligned.
- The zoom view shows the full image without forced crop.
- If source images mix very different aspect ratios/framing, card and zoom can look inconsistent.

## Order handoff semantics

- Checkout requires `name`, `phone`, and `address` before order submission.
- Address is stored in order records for admin history/detail views.
- WhatsApp handoff message includes `Address:` before the `Note:` line.
- Legacy orders without address remain readable in admin with a safe fallback label.

## Build for production

```bash
npm run build
```

## Automated tests

```bash
npm run test
```

Test coverage currently includes:

- Admin auth (success/failure), protected endpoint authorization
- Config validation and allowlist behavior
- Dedicated admin security password update flow
- Product API create/edit/delete behavior
- Order placement persistence and admin order visibility
- Order address validation/persistence and WhatsApp message formatting

## Admin route map

- `/admin` - Overview dashboard
- `/admin/products` - Product management (add/edit/delete)
- `/admin/orders` - Order history
- `/admin/orders/[id]` - Order detail
- `/admin/settings` - Shop settings and admin password updates

## Release gate

Production readiness requires all of the following:

1. `npm run test` passes
2. `npm run build` passes
3. Manual admin smoke check on desktop and narrow mobile viewport

## Production runbooks

- Day-0 Fly.io launch checklist: `docs/FLYIO_DAY0_LAUNCH_CHECKLIST.md`
- 5-minute manual backup SOP: `docs/MANUAL_BACKUP_SOP_5_MIN.md`

## Fly data persistence

By default, Fly app container files are ephemeral across deploys/restarts.
This project persists runtime data by mounting volumes and pointing env vars to them.

- Product/order/config/admin-auth JSON data: `DATA_DIR=/data`
- Uploaded images: `UPLOADS_DIR=/app/public/uploads`

Before first deploy with mounts, create both volumes in the same region as `primary_region`:

```bash
fly volumes create app_data --region sin --size 1
fly volumes create uploads_data --region sin --size 3
```

Then deploy:

```bash
fly deploy
```

Notes:

- On first boot with a new `DATA_DIR` volume, bundled `data/*.json` files are auto-seeded once.
- Fly volumes are attached per machine and are not shared across multiple running machines.
   If you need multi-instance writes, use an external database (for example Postgres/Turso).

## Notes

- The current implementation is a functional scaffold for the storefront and admin areas.
- Product and order management are now available in dedicated admin routes.
- Keep `.env*` files untracked. This repository ignores env files by default.
