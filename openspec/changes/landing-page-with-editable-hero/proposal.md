## Why

The storefront currently opens directly to the product catalog, leaving no dedicated brand landing experience. A lightweight, admin-editable home page can introduce the shop while keeping product discovery and ordering familiar and available at a clear, stable `/shop` URL.

## What Changes

- **BREAKING URL behavior:** Make `/` the brand landing page and move the existing product browsing experience to `/shop`.
- Preserve the existing catalog behavior, product details, filters, cart, WhatsApp checkout, admin routes, and API contracts.
- Add a fixed, responsive landing-page template with up to five ordered hero images, a slowly rotating slideshow with clickable indicators, editable master headline/supporting text, and a prominent link that always targets `/shop`.
- Allow admins to manage the ordered images and optional per-slide headline/supporting-text overrides through the existing protected settings experience; slides without an override inherit the master copy.
- If no landing image is configured, render a deliberate branded visual fallback while keeping the headline and shop link visible.
- Keep existing production JSON configuration valid through defaults for newly introduced optional settings, and store uploaded imagery using existing persistent upload storage.
- Keep the first/master slide's headline and supporting text required, with later slides inheriting each missing text field independently from the master.
- Update storefront navigation and page metadata for the home and shop routes.
- Verify responsive behavior and existing customer/admin flows before release, with a documented rollback path.

## Capabilities

### New Capabilities
- `storefront-landing-page`: Defines the public landing page, fixed navigation to the existing catalog at `/shop`, and safe no-image presentation.
- `admin-homepage-content`: Defines the small protected admin surface for managing ordered landing images, master copy, and optional per-slide text.

### Modified Capabilities

## Impact

- Affected routes and UI: `app/page.tsx`, new `/shop` route, storefront navigation, and admin settings.
- Affected configuration: public config read and admin-protected config update, with backward-compatible defaults for existing runtime JSON.
- Affected media: existing image upload and persistent runtime storage are reused.
- Affected verification: route behavior, image fallback, admin authorization/config validation, existing product/cart/WhatsApp order flow, responsive smoke checks, automated tests, and production build.
- No new infrastructure or runtime dependency is intended.
