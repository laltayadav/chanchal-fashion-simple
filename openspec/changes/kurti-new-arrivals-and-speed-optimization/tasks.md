## 1. Product and Config Model Updates

- [x] 1.1 Extend product type model to include `Kurti` and add new-arrival fields needed for automatic/manual eligibility.
- [x] 1.2 Extend config model and config API allowlist to support `newArrivalWindowDays` with default 30.
- [x] 1.3 Define deterministic eligibility helper logic: manual `new until` override first, otherwise `createdAt` + window days.

## 2. Storefront Kurti and New Arrivals UX

- [x] 2.1 Add `Kurti` to storefront type filter options and keep current type/category filtering behavior intact.
- [x] 2.2 Add global `New Arrivals` browse control independent of type and keep type filters functional within that scope.
- [x] 2.3 Ensure out-of-stock products remain visible in new-arrivals views with existing stock UI behavior.

## 3. Admin Controls and Visibility

- [x] 3.1 Add admin settings input for global new-arrival window days and persist through config API.
- [x] 3.2 Add product-form fields for manual new-arrival control (`enabled`/`new until`) and preserve existing image workflows.
- [x] 3.3 Show `new until` state in admin product list with red highlight for expiring/expired attention states.

## 4. Performance Optimization (Minimal and Non-Breaking)

- [x] 4.1 Improve product card image loading behavior to reduce initial render cost without changing existing image path contracts.
- [x] 4.2 Introduce safe image payload optimizations for catalog/listing contexts while preserving gallery/detail behavior.
- [x] 4.3 Keep compatibility for both uploaded internal paths and external URLs after performance changes.

## 5. Regression Tests and Validation

- [x] 5.1 Add tests for Kurti filtering and new-arrivals eligibility (createdAt-only, 30-day default, manual override, out-of-stock inclusion).
- [x] 5.2 Add/extend admin tests for new-arrival window settings and red-highlight visibility conditions.
- [x] 5.3 Add/extend image lifecycle regression tests covering create/edit/reorder/delete/view for uploaded and external images.
- [x] 5.4 Re-run order/cart regression checks to confirm WhatsApp handoff and totals remain correct after optimization changes.

## 6. Release Safety and Verification

- [x] 6.1 Execute end-to-end manual verification checklist for product CRUD, image gallery/view, storefront browsing, and admin updates.
- [x] 6.2 Run full test suite and production build; resolve regressions before rollout.
- [x] 6.3 Document before/after load metrics and confirm no breaking behavior in production deployment.
