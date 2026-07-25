# Chanchal Fashion Simple

A simple Next.js storefront for Chanchal Fashion with a JSON-backed data layer for products, orders, and config.

## Prerequisites

- Node.js 20.x or later
- npm

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
