# Chanchal — UX & Implementation Plan

Brand: **Chanchal** · Tagline: **"Weave Your Own Story"**

This document consolidates the product/navigation UX and gives step-by-step instructions written to be handed directly to GitHub Copilot (Chat or inline) for implementation. Pairs with `ARCHITECTURE.md` (infra/hosting) and `LOCAL_SETUP.md` (local dev setup) already in this repo.

---

## 1. Navigation structure

**Customer-facing nav — two items only:**
```
[ Shop ]   [ Cart ]
```
No "Admin" tab, ever, anywhere in customer-visible UI.

**Inside Shop, a segmented control for top-level category:**
```
[ All ]  [ Saree ]  [ Blouse ]  [ Set ]
```

**Within Saree or Blouse, a secondary filter row for subcategory**, generated dynamically from whatever categories exist in the data (don't hardcode the list):
```
Saree  → [ All ] [ Silk ] [ Chiffon ] [ Cotton ] [ Georgette ] ...
Blouse → [ All ] [ Designer ] [ Cotton ] [ Padded ] ...
```
"All" and "Set" don't show a subcategory row — Set is a small, curated collection, doesn't need further filtering at this scale.

## 2. Product data model

```ts
type ProductType = 'Saree' | 'Blouse' | 'Set'

interface Product {
  id: string
  type: ProductType
  name: string
  category: string        // free text subcategory: "Silk", "Chiffon", "Designer", etc.
   size?: string           // flexible text: "Free Size", "38 inch", "XL", etc.
  price: number
  discountPrice?: number  // omit or 0 = no discount
  image: string
  includes?: string       // Set only, e.g. "Saree + Matching Blouse"
  inStock: boolean        // default true — add now, don't retrofit later
   createdAt?: string      // ISO timestamp when product was first created
   updatedAt?: string      // ISO timestamp when product was last updated
}
```

Keep it flat and free-text for `category` rather than a fixed enum — the owner will invent new subcategories over time (e.g. "Handloom," "Bridal") and shouldn't need a code change to add one. The filter chips derive their options from whatever's actually in the data.

## 3. Admin access — hidden from customers, reachable by the owner only

Two entry points, no visible link anywhere in customer UI:

1. **Direct route:** in the Next.js version, `/admin` simply isn't linked from any customer-facing nav or page. Knowing the URL is the access control at this stage (fine for Phase 1; add real auth in Phase 2 if needed).
2. **Discoverability for the owner:** tapping the shop name/logo 5 times within ~2.5 seconds opens the admin password gate — same pattern used in the reference artifact. Optional but nice for mobile use where typing `/admin` is more friction.

Password gate stays as already built (`ADMIN_PASSWORD` env var) — this isn't meant to be bank-grade security, just enough friction that a browsing customer never stumbles into it.

## 4. Page-by-page spec

### Shop (`/`)
- Header: brand name + tagline
- Main type tabs: All / Saree / Blouse / Set
- Subcategory chips (Saree/Blouse only), horizontally scrollable
- Product grid, 2 columns on mobile, more on wider screens
- Each card: image, category label (or "Saree + Blouse" for Sets), name, price (with strikethrough original if discounted), "Add to Order" button
- Sticky bottom cart bar once cart has ≥1 item, tapping it opens Cart
- Out-of-stock products: show a visible "Out of Stock" badge on the card, disable the Add button — don't hide the product (customers still browse for later)

### Cart (`/cart`)
- Line items with qty controls, remove button
- Order total
- Name + phone (required), note (optional, for blouse size / delivery address / set customization)
- "Send Order via WhatsApp" — saves order to `orders.json` first, then opens `wa.me` link pre-filled to the shop's WhatsApp number

### Admin (`/admin`, not linked anywhere)
- Password gate
- Settings: shop name, WhatsApp number, admin password
- Add/Edit Product form: **Type** dropdown (Saree/Blouse/Set) first, then Name, Category, Price, Discount Price, Image upload, **In Stock** toggle
- Catalog list: shows type + category + stock status per item, edit/delete actions
- Orders list: name, phone, items, total, timestamp, New/Fulfilled toggle

## 5. Instructions for GitHub Copilot

Paste this section (or the whole file) into Copilot Chat as project context, then work through it in order.

```
Project: Chanchal — a saree/blouse e-commerce catalog site (no payment gateway yet).
Stack: Next.js (App Router) + TypeScript + Tailwind CSS + lowdb (JSON file storage) + sharp (image processing).
Reference: this repo already contains ARCHITECTURE.md, LOCAL_SETUP.md, and a static HTML prototype
(sari-shop.html) that demonstrates the exact UX and interaction patterns to replicate — read it first
for interaction details (nav structure, cart flow, admin form fields) before writing components.

Task order:
1. Implement lib/db.ts — lowdb wrapper with typed helpers for products.json, orders.json, config.json.
2. Implement lib/images.ts — saveProductImage() (resize to 1000px wide, convert to WebP via sharp,
   save to data/images/) and deleteProductImage() (called on product update/delete to prevent orphaned files).
3. Define the Product and Order TypeScript interfaces per the data model in this document
   (section "2. Product data model").
4. Build components/ProductCard.tsx — matches the visual style in sari-shop.html
   (maroon/gold/cream palette, Cormorant Garamond for names, Karla for body text),
   plus an out-of-stock disabled state.
5. Build the Shop page (app/page.tsx) with:
   - Main type tabs: All / Saree / Blouse / Set
   - Subcategory filter chips, shown only for Saree/Blouse, options derived dynamically
     from distinct `category` values present in the currently-typed product list
   - Responsive product grid
6. Build components/CartDrawer.tsx and app/cart/page.tsx — cart state can be React Context
   or lifted state, no need for a state management library at this scale.
   Order submission: POST to api/orders, then open a wa.me link with the order pre-filled.
7. Build app/api/orders/route.ts (POST creates an order in orders.json) and
   app/api/products/route.ts (GET/POST/PUT/DELETE, calling lib/images.ts on image changes).
8. Build app/admin/page.tsx — NOT linked from any customer nav component.
   Password-gated (compare against process.env.ADMIN_PASSWORD).
   Include: settings form, add/edit product form (Type dropdown first, then Name/Category/
   Price/Discount/Image upload/In Stock toggle), product list with edit/delete,
   orders list with status toggle.
9. Do not add any visible "Admin" link, button, or nav item anywhere in customer-facing
   components. Access is by direct URL only for now.

Constraints:
- No database — all persistence through lib/db.ts and lowdb.
- No payment integration yet — cart submission ends at the WhatsApp handoff.
- Match the existing visual language (colors, fonts, spacing) from sari-shop.html rather
  than introducing a new design system.
```

## 7. Design system correction (read this before touching the Tailwind build)

The Copilot build so far uses generic Tailwind defaults — white rounded cards for every section, three separate cart indicators, inconsistent image crops. It doesn't match the prototype's design system. Fix by applying `tailwind.config.js` (in this repo) and the rules below.

**Tokens** — use `tailwind.config.js` as-is. Colors: `maroon` `#5C1A2B`, `maroon-deep` `#3E1220`, `gold` `#C6963A`, `gold-soft` `#E4C88A`, `cream` `#FBF5EA`, `ink` `#2A1B1F`, `teal` `#1F4B47`. Fonts: Cormorant Garamond (serif — product names, headings), Karla (sans — everything else).

**Specific fixes for what's currently wrong:**

1. **One cart indicator, not three.** Drop the "Cart: 0 items" pill, the "0 items in cart" bar, and the separate "View cart" button — keep only the `Cart` nav item showing a count badge, plus a sticky bottom bar that appears *only when the cart has items* (see prototype `.fab-cart`). Redundant state indicators read as unfinished, not thorough.

2. **Not everything is a white rounded card.** Give sections distinct roles: header is a solid `bg-maroon` band with `text-gold-soft`/`text-white`, not a white card. The hero text block doesn't need its own bordered card — it can sit directly on the cream background. Reserve the white card treatment (`bg-white rounded-card border border-maroon/10`) for product cards and cart line items specifically — that's what makes cards read as "things," not decoration on everything.

3. **Segmented tabs, not another card.** The All/Saree/Blouse/Set control should look like a pill-track segmented control (`bg-gold-soft/30 rounded-chip p-1`, active tab `bg-maroon text-white rounded-chip`) — not a bordered box sitting among other bordered boxes.

4. **Consistent image crop.** Every product image: `aspect-[3/4] object-cover w-full`. Right now crops are inconsistent (some show faces, some show fabric only) — pick the aspect ratio once, apply everywhere, let `object-cover` handle framing.

5. **Typography hierarchy that actually varies.** Right now most text looks the same weight/size. Apply:
   - Brand name: `font-serif text-3xl font-bold`
   - Eyebrow label ("CHANCHAL FASHION" small caps): `font-sans text-xs tracking-widest uppercase text-gold`
   - Product name: `font-serif text-lg font-semibold text-maroon-deep`
   - Category label: `font-sans text-[10px] tracking-wide uppercase text-ink/50`
   - Price: `font-sans font-bold text-teal`, strikethrough original in `text-ink/40 line-through text-sm`

6. **Cut the duplicate subtitle.** "Handpicked saris, delivered with care" and "Browse curated saree, blouse and set collections" are saying the same thing twice — keep the tagline ("Weave Your Own Story") as the one line under the brand name, drop the rest of the hero block entirely. The product grid can start right after the nav; it doesn't need a hero pitch on a page the customer is already on to buy.

7. **One border-radius scale.** Use `rounded-card` (6px) for cards/images, `rounded-chip` (full pill) only for filter chips and status badges. Nothing else gets rounded — the current build rounds everything the same amount, which flattens the whole hierarchy.

## 8. What's deliberately deferred
- Linking Set products to their component Saree/Blouse by ID (Phase 1 just stores a free-text `includes` description — revisit if the catalog grows large enough that manual re-typing becomes error-prone)
- WhatsApp Cloud API auto-send, payments — see `ARCHITECTURE.md` Phase 2/3
