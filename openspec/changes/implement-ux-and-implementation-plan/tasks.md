## 1. Data Layer

- [x] 1.1 Add `lowdb` dependency and types to `package.json` if missing
- [x] 1.2 Implement `lib/db.ts` with typed helpers: `getProducts()`, `saveProducts()`, `getOrders()`, `saveOrders()`, `getConfig()`, `saveConfig()`
- [x] 1.3 Add initial JSON files under `data/`: `products.json`, `orders.json`, `config.json` (empty arrays/objects as appropriate)

## 2. Types and Utilities

- [x] 2.1 Create `lib/types.ts` with `Product` and `Order` interfaces per UX plan
- [x] 2.2 Implement `lib/images.ts` with `saveProductImage()` and `deleteProductImage()` using `sharp`

## 3. API Routes

- [x] 3.1 Implement `app/api/products/route.ts` (GET/POST/PUT/DELETE); integrate `lib/images.ts` for image handling
- [x] 3.2 Implement `app/api/orders/route.ts` (POST) to validate and persist orders

## 4. Components

- [x] 4.1 Implement `components/ProductCard.tsx` matching the spec
- [x] 4.2 Implement `components/CartDrawer.tsx` and cart context/provider

## 5. Pages

 - [x] 5.1 Build `app/page.tsx` (Shop) with type tabs and dynamic subcategory chips
 - [x] 5.2 Build `app/cart/page.tsx` with order form and WhatsApp handoff

## 6. Admin

- [x] 6.1 Build `app/admin/page.tsx` with password gate, settings, product add/edit form, catalog list, and orders list

## 7. QA and Cleanup

- [ ] 7.1 Test form flows: create product (with image), edit product, delete product
- [ ] 7.2 Test order flow: add to cart, submit order, check `data/orders.json` and WhatsApp link
- [ ] 7.3 Run `npm run build` and fix any TypeScript or runtime errors
