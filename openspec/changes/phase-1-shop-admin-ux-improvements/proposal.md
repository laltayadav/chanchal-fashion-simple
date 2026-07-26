## Why

The storefront currently exposes incomplete and inconsistent UX flows for customers and admins. Important phase-1 behaviors are missing or insecure: cart state is not shared across pages, the admin password is exposed in public config, product management is limited, and mobile usability is poor.

## What Changes

- Improve the customer storefront UI with a responsive layout, visible cart/cart-count, and better filters.
- Unify cart state across the shop and cart pages so customers can add items on the shop page and manage them in `/cart`.
- Enhance the cart page with item quantity controls, remove buttons, order summary, and WhatsApp order handoff.
- Harden admin security by removing admin password from public config and requiring proper login before admin features load.
- Build real admin product management UI with add, edit, and delete support instead of only creating default sample products.
- Add admin order visibility with order metadata so the store owner can see when items were ordered and by whom.

## Capabilities

### New Capabilities
- `responsive-shop-ui`: Customer storefront layout and product card improvements for mobile and desktop.
- `shared-cart-state`: Global cart provider and shared cart experience between shop and cart pages.
- `secure-admin-access`: Admin login security and public config hardening.
- `admin-product-management`: Admin product CRUD UI and delete capability.
- `admin-order-viewing`: Admin order listing with order details and metadata.

### Modified Capabilities
- `cart-and-order-flow`: existing order flow requirements updated to include item removal, quantity controls, and a visible cart summary.

## Impact

- `app/layout.tsx`: add shared cart provider and global header/navigation.
- `app/page.tsx`, `app/cart/page.tsx`: update cart wiring and responsive UI.
- `app/admin/page.tsx`: refactor admin auth, product form, and order list.
- `app/api/config/route.ts`: remove exposed admin password from public GET.
- `app/api/products/route.ts`: support product delete and administration semantics.
- `data/config.json`, `data/products.json`, `data/orders.json`: may need seed updates.
- `components/CartContext.tsx`, `components/CartDrawer.tsx`, `components/ProductCard.tsx`, `components/SiteHeader.tsx`: UI/behavior updates.
