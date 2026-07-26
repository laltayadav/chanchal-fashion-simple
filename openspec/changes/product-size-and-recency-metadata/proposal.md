## Why

Product records currently do not include created/updated timestamps or a dedicated size attribute, which limits admin visibility for recent changes and reduces product-detail clarity in both admin and storefront views. Adding these metadata fields now improves merchandising control, operational auditing, and customer context without introducing complex domain modeling.

## What Changes

- Add product metadata fields for `createdAt`, `updatedAt`, and a flexible `size` text value.
- Persist and maintain product recency timestamps through product create and update API flows.
- Sort admin product listings by newest activity (latest updated products first, then created fallback).
- Display absolute and relative recency metadata in admin product list rows/cards (for example, "added 2 days ago", "updated 5 hours ago").
- Display `size` in admin product list and storefront product cards using secondary typography.
- Introduce optional storefront recency sort behavior as a configurable/defaulted strategy.

## Capabilities

### New Capabilities
- `product-recency-metadata`: Defines timestamp persistence and recency-aware product ordering/display behavior.
- `product-size-attribute`: Defines a flexible size text field and corresponding admin/storefront presentation requirements.

### Modified Capabilities
- None.

## Impact

- Affected product typing and data model contracts in shared type definitions.
- Affected product API create/update behavior and serialization in products route handlers.
- Affected admin products UI list/form rendering and sort logic.
- Affected storefront product card metadata rendering and optional sort behavior.
- Affected product tests and seed data assumptions where product shape is asserted.
