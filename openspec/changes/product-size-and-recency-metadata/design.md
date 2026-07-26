## Context

The current product schema supports catalog essentials (name, type, category, pricing, stock) but does not include lifecycle metadata for when a product was created or last changed. Admin users therefore cannot quickly identify recently changed items, and recency-based operational sorting is not possible.

The product schema also lacks a dedicated size field. Today, size-like information is either omitted or mixed into free text fields, which weakens consistency in admin data entry and storefront communication.

The project already has centralized product mutation paths and UI surfaces for product cards and admin product lists, making this a low-friction extension if requirements are clearly defined.

## Goals / Non-Goals

**Goals:**
- Add `createdAt` and `updatedAt` metadata to product records with deterministic API behavior.
- Ensure admin product lists can sort and display recency metadata (absolute + relative time).
- Add a flexible `size` text field that supports values like "Free Size", "38 inch", "XL", "XXXL".
- Display size as secondary metadata in both admin list and storefront product cards.
- Preserve backward compatibility for products that do not yet have metadata fields.

**Non-Goals:**
- Introducing full inventory variants or multi-size stock matrix logic.
- Enforcing controlled vocabularies for sizes in this phase.
- Implementing advanced merchandising ranking beyond optional/explicit sort options.
- Changing persistence backend away from JSON files.

## Decisions

1. Timestamp semantics
- Decision: Set `createdAt` and `updatedAt` during product creation; update only `updatedAt` on product edits.
- Rationale: Aligns with common audit semantics and supports operational sorting.
- Alternatives considered:
  - Derive recency from file timestamps: brittle and not portable across environments.
  - Only one `timestamp` field: loses distinction between creation and modification.

2. Backward compatibility strategy
- Decision: Treat missing legacy timestamps as null-equivalent and fall back to stable ID/name ordering when needed.
- Rationale: Prevents migration blockers and avoids forced destructive rewrites.
- Alternatives considered:
  - Hard migration requiring all existing records rewritten up front.

3. Size modeling approach
- Decision: Use single optional free-text `size` field now.
- Rationale: Fastest path for mixed real-world size expressions and owner flexibility.
- Alternatives considered:
  - Structured size token list from day one (`sizeDisplay` + `sizeTokens`): more robust but higher complexity.

4. Admin recency display format
- Decision: Show both absolute local datetime and relative age for added/updated metadata.
- Rationale: Operationally useful for both precision and scanning.
- Alternatives considered:
  - Relative only: ambiguous for auditing.
  - Absolute only: slower to scan for freshness.

5. Storefront sort posture
- Decision: Support recency-aware sort path, but avoid forcing universal newest-first unless explicitly selected or configured.
- Rationale: Keeps merchandising flexibility and avoids accidental conversion impact.
- Alternatives considered:
  - Always newest-first: simple but can disrupt curated catalog order.

## Risks / Trade-offs

- [Risk] Free-text size can become inconsistent ("XL" vs "Extra Large").
  - Mitigation: Document formatting guidance and consider structured size tokens in a follow-up change.

- [Risk] Relative time labels can vary by locale/timezone assumptions.
  - Mitigation: Use a single formatting utility and explicit local-time rendering.

- [Risk] Legacy records without timestamps may appear clustered or misordered initially.
  - Mitigation: Define deterministic fallback sorting and optionally run a one-time metadata backfill.

- [Risk] Additional metadata fields require test updates across API and UI snapshots.
  - Mitigation: Expand existing product tests with explicit timestamp and size assertions.

## Migration Plan

1. Extend product type/schema and API serialization to support `size`, `createdAt`, and `updatedAt`.
2. Update create/update handlers to populate and maintain timestamp fields.
3. Update admin product list rendering to show size and recency metadata with newest-first behavior.
4. Update storefront product card rendering to include size metadata and optional recency sort behavior.
5. Update tests and seed fixtures for new product shape assumptions.
6. Optionally execute one-time legacy backfill for existing products lacking timestamps.

Rollback strategy:
- UI rollback: hide new metadata fields while retaining persisted values.
- API rollback: preserve stored fields but stop writing new metadata in mutation path.
- Data rollback: existing schema additions are additive and can be ignored by prior UI.

## Open Questions

- Should storefront expose recency sort as explicit user control or only as admin-configured default?
- Should size be required for selected product types (for example blouse) in a later phase?
- Do we want a lightweight normalization hint list for common size values during admin entry?
