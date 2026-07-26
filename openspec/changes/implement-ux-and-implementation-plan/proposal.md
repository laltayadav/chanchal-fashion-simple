## Why

The project needs a focused implementation of the Chanchal storefront UX and server-side helpers so the static prototype's interactions are available in the Next.js app. This enables the owner to manage products, accept WhatsApp-based orders, and let customers browse a small curated catalog without a payment gateway (Phase 1).

## What Changes

- Implement typed data access and JSON persistence for products, orders, and config.
- Add image handling utilities (resize + WebP) and integrate them with product APIs.
- Define Product and Order TypeScript interfaces and use them across the app.
- Build customer-facing pages/components: Shop page, ProductCard, CartDrawer, Cart page.
- Implement API routes: products (CRUD) and orders (create + persist).
- Add a password-gated Admin UI (`/admin`) for managing settings, products, and orders (not linked in customer navigation).

## Capabilities

### New Capabilities
- `products-data-access`: Typed lowdb-backed persistence and helpers for `products.json`, `orders.json`, and `config.json`.
- `product-images`: Image upload/processing utilities (resize to 1000px, convert to WebP, save under `data/images/`).
- `product-and-order-types`: Project-wide TypeScript interfaces for `Product` and `Order` matching the UX data model.
- `product-card-component`: Reusable `ProductCard` component with out-of-stock handling and price/discount display.
- `shop-and-filters`: Shop page with main type tabs and dynamic subcategory chips derived from product data.
- `cart-and-order-flow`: Cart state, CartDrawer, Cart page, and WhatsApp handoff (save order then open `wa.me` link).
- `products-api`: `app/api/products/route.ts` (GET/POST/PUT/DELETE) integrated with `product-images`.
- `orders-api`: `app/api/orders/route.ts` (POST creates order in `orders.json`).
- `admin-ui`: Password-gated admin page with settings, product add/edit (image upload), catalog list, and orders list.

### Modified Capabilities
- None (this change introduces new functionality; it does not modify existing spec-level requirements).

## Impact

- Adds `lib/db.ts` and `lib/images.ts` and new API routes under `app/api/`.
- Adds multiple components under `components/` and pages under `app/` (Shop, Cart, Admin).
- Adds persisted JSON files under `data/` and images under `data/images/`.
- No external DB or payment integration; communicates via WhatsApp link only.
