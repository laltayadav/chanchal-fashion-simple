## 1. Product schema and data model updates

- [x] 1.1 Extend product type definitions with optional `size`, `createdAt`, and `updatedAt` fields.
- [x] 1.2 Update product seed/sample data shape expectations to support new metadata fields.
- [x] 1.3 Add helper utilities for parsing/formatting recency metadata and relative age labels.

## 2. Product API recency and size persistence

- [x] 2.1 Update product create API flow to persist `size`, `createdAt`, and `updatedAt` values.
- [x] 2.2 Update product edit API flow to persist `size`, preserve `createdAt`, and refresh `updatedAt`.
- [x] 2.3 Add backward-compatible handling for legacy products missing timestamp metadata.

## 3. Admin product management UX updates

- [x] 3.1 Add `size` text input to admin product form create/edit flow.
- [x] 3.2 Update admin product list sorting to newest activity first (`updatedAt` then `createdAt` fallback).
- [x] 3.3 Display size metadata in admin product list with secondary typography.
- [x] 3.4 Display absolute added/updated datetime and relative age labels in admin product list.

## 4. Storefront product card metadata updates

- [x] 4.1 Show product `size` metadata in storefront product card as smaller secondary text.
- [x] 4.2 Add configurable or explicit recency sort behavior for storefront product listing.
- [x] 4.3 Ensure existing storefront filters and category/type grouping continue to work with new fields.

## 5. Automated verification and documentation

- [x] 5.1 Expand product API tests to validate size persistence and timestamp lifecycle behavior.
- [x] 5.2 Add UI-oriented assertions for admin recency rendering and size display where applicable.
- [x] 5.3 Verify build and test commands pass after metadata changes.
- [x] 5.4 Update README/docs with product metadata semantics and sorting behavior guidance.
