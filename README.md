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

## Build for production

```bash
npm run build
```

## Notes

- The current implementation is a functional scaffold for the storefront and admin areas.
- Product and order management are planned for the next iteration.
- Keep `.env*` files untracked. This repository ignores env files by default.
