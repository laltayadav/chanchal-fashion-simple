## Why

The storefront needs richer merchandising without increasing operational complexity: a new `Kurti` type, clear `New Arrivals` behavior, and admin controls for expiration visibility. At the same time, the image-heavy catalog must load faster with minimal, non-breaking changes and low infrastructure cost.

## What Changes

- Add `Kurti` as a first-class product type in storefront filters, admin product forms, and product data validation paths.
- Introduce `New Arrivals` as a merchandising state layered on top of existing product types (not a separate type).
- Define `New Arrivals` eligibility rules:
  - Default window is 30 days.
  - Eligibility uses `createdAt` only (not `updatedAt`).
  - Out-of-stock products may still appear in `New Arrivals`.
  - Support manual per-product expiry date override.
- Add admin visibility and control for `New Arrivals`:
  - Display `new until` in product list and product edit form.
  - Highlight expiring/expired attention states in red so owner can act quickly.
  - Add shop-level setting for default `New Arrivals` window (default 30).
- Apply minimal, non-breaking performance improvements focused on image-heavy catalog loading:
  - Preserve existing image upload/edit/delete/view flows and paths.
  - Reduce initial image payload and improve first-render loading behavior.
  - Keep compatibility for existing internal upload paths and external image URLs.
- Add regression coverage for product/image CRUD, gallery/view behavior, and cart/order flow to ensure no breakage during optimization.

## Capabilities

### New Capabilities
- `kurti-type-and-new-arrivals`: Adds `Kurti` type and `New Arrivals` merchandising rules with admin controls and visibility.
- `catalog-performance-safe-optimization`: Improves storefront loading speed (especially images) using minimal, non-breaking changes while preserving existing media workflows.

### Modified Capabilities
- None.

## Impact

- Affected UI: shop filters and product cards, admin products list/edit form, admin settings.
- Affected backend contracts: product data shape and config allowlist handling for new arrivals settings.
- Affected utilities: product recency/new-arrivals eligibility helpers and image display behavior.
- Affected tests: product API/UI behavior, image lifecycle flows, and order flow regression checks.
- Operational impact: maintain current low-cost Fly deployment model; avoid introducing external paid services in this change.
