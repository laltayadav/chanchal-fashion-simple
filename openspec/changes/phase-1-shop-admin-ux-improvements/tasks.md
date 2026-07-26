## 1. Foundation

- [x] 1.1 Move the shared `CartProvider` into `app/layout.tsx` so cart state is available across all pages.
- [x] 1.2 Add a global header/navigation component that includes Home, Cart, and Admin links plus a visible cart count.

## 2. Customer storefront improvements

- [x] 2.1 Update `app/page.tsx` to use a responsive product grid and better mobile spacing.
- [x] 2.2 Improve `ProductCard` to show image placeholders, clear pricing, and an add-to-cart action.
- [x] 2.3 Render the cart summary or drawer on the shop page so users can see current items.

## 3. Cart flow and order submission

- [x] 3.1 Update `app/cart/page.tsx` to display cart line items, quantity/remove controls, and the current total.
- [x] 3.2 Ensure orders are posted to `/api/orders` with timestamp, customer name, phone, note, items, and total.
- [x] 3.3 Keep the WhatsApp order handoff intact and show a helpful message when WhatsApp is not configured.

## 4. Admin security and config

- [x] 4.1 Change `app/api/config/route.ts` so public GET responses exclude `adminPassword`.
- [x] 4.2 Refactor `app/admin/page.tsx` so the admin page fetches only non-sensitive config before login.
- [x] 4.3 Keep the admin password input hidden and never display the secret in the UI.

## 5. Admin product management

- [x] 5.1 Add an admin product form for type, name, category, price, discount price, image URL, and stock.
- [x] 5.2 Implement admin edit and save behavior for existing products.
- [x] 5.3 Add delete support for admin products using `DELETE /api/products?id=<id>`.

## 6. Admin order viewing

- [x] 6.1 Render a list of saved orders in the admin dashboard after login.
- [x] 6.2 Display order metadata: timestamp, customer name, phone, total, and note.

## 7. Review and polish

- [x] 7.1 Verify the full flow in the browser: browse products, add to cart, remove items, place an order, and view orders as admin.
- [x] 7.2 Validate the mobile experience on narrow viewports and confirm the UI is usable on phones.
- [x] 7.3 Update seed data if necessary so the shop loads with meaningful sample products.
