## Why

The current catalog behavior defaults new products to "Include in New Arrivals = Yes" and does not reliably show newly added products first for customers. This causes merchandising noise and hides true launch chronology, which increases manual cleanup and customer confusion.

## What Changes

- Change product creation defaults so `newArrivalEnabled` is `false` unless explicitly set to `true` by admin.
- Keep existing manual `newArrivalUntil` behavior and createdAt-based new-arrival eligibility logic unchanged.
- Change customer-facing catalog default ordering to newest-added-first (createdAt descending).
- Ensure customer-facing default order does not promote edited legacy products above newly added products.
- Keep admin operational ordering behavior explicit and independent from customer-facing default ordering.
- Add regression tests covering new-arrival default and customer ordering behavior.

## Capabilities

### New Capabilities
- `catalog-defaults-and-customer-ordering`: Defines default new-arrival inclusion policy and default customer catalog ordering behavior.

### Modified Capabilities
- None.

## Impact

- Affected UI: admin product form defaults and storefront product listing default sort behavior.
- Affected API: product creation default for `newArrivalEnabled`.
- Affected utility logic: customer-facing product ordering source of truth.
- Affected tests: product API CRUD and recency/order helper tests.
- No infrastructure or deployment model changes required.
