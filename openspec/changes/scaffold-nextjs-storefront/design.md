# Design: Next.js storefront foundation

## Architecture
- Use Next.js App Router with TypeScript.
- Keep UI in app/ routes and reusable components under components/.
- Use JSON files in data/ for products, orders, and config.
- Provide a simple helper layer in lib/ for reading and writing data and managing image files.

## Data model
- products.json: array of products.
- orders.json: array of orders.
- config.json: shop metadata and admin password.

## Routes
- /: storefront home page.
- /cart: cart placeholder.
- /admin: admin dashboard.
- /admin/products: product management placeholder.
- /admin/orders: order management placeholder.
- /api/products, /api/orders, /api/config: API route placeholders.
