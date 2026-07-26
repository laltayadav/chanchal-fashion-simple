# Fix runtime issues and simplify Phase 1 UX

Short proposal: Fix malformed data and image serving so the dev server runs reliably, and apply small mobile-first UX improvements for Phase 1 (WhatsApp ordering).

Why
- Developer experience currently blocked by malformed JSON and image serving issues that cause runtime errors on dev.
- The storefront is mobile-first and must keep Phase 1 simple: product listing, add-to-cart, send order via WhatsApp.

What I'll change
- Repair `data/products.json` to valid JSON with example products and `inStock: true`.
- Serve generated images from `public/uploads/` so internal uploads are directly available.
- Fix `ProductCard` to support both public URLs and internal upload paths.
- Update admin side to create usable sample products with image URL and stock state.
- Ensure cart submission opens WhatsApp with the configured shop number or shows a clear warning.

Acceptance criteria
- `npm run dev` starts cleanly and the live app loads on the actual listening port.
- Shop page shows sample products as in-stock and images load without 404.
- Admin can create a product, and it appears in the shop.
- Cart submission hits `/api/orders` and constructs a valid WhatsApp URL when config is set.
