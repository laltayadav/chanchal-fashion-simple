## Why

The storefront currently exposes admin access to customers and repeats branding in ways that weaken both the public UX and the admin experience. The admin dashboard should be a separate, streamlined owner interface, not a visible option on the customer navigation.

The admin product flow is also too brittle: image updates are handled only by raw URLs, admin content is misaligned with the public layout, and the shop brand is repeated unnecessarily.

## What Changes

- Remove the public `Admin` navigation item so customers only see Shop and Cart.
- Treat `/admin` as a direct entry point, not a customer-facing page.
- Create a dedicated admin layout that aligns with the site width and removes the public AppShell header.
- Simplify the public header branding to a single top-level identity and preserve the cart count.
- Make the admin interface leaner: use a small brand badge, a clear admin page title, and a focused dashboard card.
- Replace raw image-URL admin workflows with an image management UI that supports upload preview and a URL fallback.
- Align the admin dashboard content to the same column grid and top padding as the shop pages.

## Capabilities

### New Capabilities

- `admin-hidden-entry`
  - Hide admin entry from the public navigation.
  - Require direct `/admin` access for admin owners.

- `admin-dedicated-layout`
  - Use a separate layout for `/admin` that does not inherit the shop hero header.
  - Align admin content consistently with public page width and gutters.

- `admin-image-management`
  - Provide admin-friendly image upload and preview.
  - Preserve URL fallback for externally hosted images.

- `admin-brand-minimalism`
  - Reduce repeated branding on admin pages.
  - Show only necessary identity elements.

### Modified Capabilities

- `shop-hero-branding`
  - Keep the public header concise and unbranded except for the shop identity.
  - Avoid repeating the header identity inside the admin dashboard.

- `admin-product-management`
  - Add edit, save, and delete support with a more intuitive form.
  - Improve product image handling in the admin form.

## Impact

- `components/SiteHeader.tsx`
  - Remove `Admin` link.
  - Keep Shop / Cart and cart count only.

- `app/admin/layout.tsx`
  - Add dedicated admin page structure and alignment.
  - Remove public AppShell-style wrapper for admin routes.

- `app/admin/page.tsx`
  - Use a focused admin landing screen with login, dashboard card, and product/order management sections.
  - Reduce repeated branding and align top content.

- `components/AdminProductForm.tsx`
  - Add image upload preview and URL fallback.
  - Simplify admin form layout for better usability.

- `app/layout.tsx` and `components/AppShell.tsx`
  - Keep public and admin content visually separated.

- `components/ProductCard.tsx`, `app/page.tsx`, `app/cart/page.tsx`
  - Maintain public shop clarity and preserve cart count behavior.

## Non-Goals

- Adding a full file-hosted media storage service.
- Building a separate admin portal outside the existing `/admin` route.
- Replacing the current WhatsApp order workflow.
