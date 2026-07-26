## Context

The current storefront is a functional scaffold, but it lacks a cohesive UX across shop, cart, and admin flows. Customer pages use isolated cart state, the cart page does not surface line-item management, and the admin page exposes sensitive config values and only supports hard-coded product creation.

The codebase is a Next.js App Router project with JSON-backed persistence and Tailwind-style utility classes. This change must stay within the existing app structure without introducing a separate backend service.

## Goals / Non-Goals

**Goals:**
- Deliver a mobile-friendly shopping experience with clear product browsing and cart management.
- Ensure cart state is shared globally across routes.
- Improve admin product management so owners can add/edit/delete products and view orders.
- Prevent public exposure of admin credentials and restrict admin-sensitive operations behind login.

**Non-Goals:**
- Implementing a full database or authentication provider.
- Adding user accounts or payments beyond the existing WhatsApp order handoff.
- Creating a separate admin portal outside the current `app/admin` route.

## Decisions

### Shared cart provider in layout
The cart provider will move to `app/layout.tsx` so all pages share the same state. This is simpler and more reliable than lifting state to individual routes or using `localStorage` only.

Alternative considered:
- storing cart in `localStorage` only and rehydrating per page. Rejected because it would still require a shared provider and would delay adding consistent UI feedback.

### Admin password in config
Public `GET /api/config` will return only non-sensitive fields (`shopName`, `whatsapp`). Admin password will no longer be exposed.

The admin page will fetch a separate login-only secret by either:
- keeping the client-side password check but not exposing it publicly, or
- using a dedicated private API endpoint for config updates.

The chosen approach is to keep admin login client-side but require prior config fetch only for non-sensitive settings, and to not display the password anywhere in the UI.

### Improved admin product management
Admin page will use an explicit product form and editable product list. Product creation will no longer use a hard-coded sample object.

Delete support will be added by calling `DELETE /api/products?id=<id>`. The admin UI will also allow basic inline edits for type, name, category, price, discount, image URL, and stock.

### Order viewing in admin
The admin dashboard will show order listings with metadata from `orders.json`. The design is intentionally lightweight and read-only for phase 1.

## Risks / Trade-offs

[UX scope] → Implementation may exceed phase 1 if admin CRUD becomes too complex.
- Mitigation: keep admin product management to a simple form + inline list and postpone advanced validation or media upload.

[Security] → Client-side auth is not hardened.
- Mitigation: eliminate password leakage from public config and avoid rendering admin-only data until authorized.

[State persistence] → cart state may still reset on page reload.
- Mitigation: optionally persist cart to `localStorage` as a future enhancement; phase 1 focuses on route-level state sharing.

[Data durability] → JSON store can be overwritten by bad admin input.
- Mitigation: keep payload validation simple and preserve existing file behavior.
