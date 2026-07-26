## Tasks

### 1. Public header and navigation

- [x] Remove the `Admin` link from `components/SiteHeader.tsx`.
- [x] Keep the public header focused on `Shop`, `Cart`, and `Cart: X items`.
- [x] Ensure the header remains responsive on mobile and desktop.

### 2. Dedicated admin layout

- [x] Update `app/admin/layout.tsx` to include a compact admin header and consistent content width.
- [x] Remove any shop-specific AppShell wrapper from the admin route display.
- [x] Add a small admin title section at the top of `/admin`.

### 3. Simplify admin branding

- [x] Reduce repeated branding inside `app/admin/page.tsx`.
- [x] Use a concise page title such as `Admin` or `Dashboard`.
- [x] Keep the admin identity minimal, e.g. `Chanchal • Admin`.

### 4. Admin product form improvements

- [x] Update `components/AdminProductForm.tsx` to support image upload preview.
- [x] Add an explicit `Upload image` CTA and a fallback `Image URL` field.
- [x] Show the selected image preview or a placeholder within the form.
- [x] Keep the existing product fields for type, name, category, price, discount, and stock.

### 5. Admin product and order page layout

- [x] Align admin content to the same grid and padding used by public pages.
- [x] Place settings and product management side by side on desktop.
- [x] Place the order list below with clear metadata and timestamp formatting.

### 6. Maintain existing customer flow

- [x] Keep `/` and `/cart` behavior intact.
- [x] Preserve the WhatsApp order handoff and cart count updates.
- [x] Ensure the public shop still renders product cards clearly.

### 7. Validation and polish

- [x] Review `/admin` in browser and confirm the admin route looks distinct from the customer header.
- [x] Confirm the page alignment and top spacing match the shop experiences.
- [x] Test the admin image preview flow.
- [x] Verify the cart count and navigation remain customer-only.
