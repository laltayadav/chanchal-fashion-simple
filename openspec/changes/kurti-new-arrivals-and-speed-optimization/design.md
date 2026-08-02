## Context

The current storefront supports type-based browsing for `All`, `Saree`, `Blouse`, and `Set`, with recency sorting via `createdAt`/`updatedAt`. Admin product workflows already support create/edit/delete with image upload, reordering, and deletion. Product images are upload-backed (internal `uploads/`) or remote URL-backed and are displayed through existing product card and gallery logic.

The requested change introduces a new catalog type (`Kurti`) and a merchandising layer (`New Arrivals`) with both automatic window logic and manual per-product control. The owner also needs explicit visual cues in admin to avoid missing expiry actions.

In parallel, the site must load faster with minimal, non-breaking changes and no expensive infrastructure migration. Existing image lifecycle behaviors must remain stable.

## Goals / Non-Goals

**Goals:**
- Introduce `Kurti` as a first-class product type across storefront and admin.
- Add `New Arrivals` eligibility based on `createdAt` with default 30-day window.
- Support manual per-product `new until` override while preserving automatic fallback behavior.
- Show owner-facing red attention highlights for expiring/expired new-arrival states in admin list and edit flows.
- Add shop-level setting for default new-arrival window.
- Improve perceived and actual storefront load speed using minimal, low-risk changes.
- Preserve existing image upload/edit/delete/view and mixed-source image compatibility.

**Non-Goals:**
- Replacing JSON persistence with external database.
- Replatforming image storage/CDN provider in this change.
- Redesigning core information architecture or checkout flow.
- Introducing paid performance services as a hard dependency.

## Decisions

1. **Separate product type from merchandising state**
- Decision: Keep `type` as product taxonomy (`Saree | Blouse | Set | Kurti`) and model `New Arrivals` as a separate state.
- Rationale: Prevents semantic overload and allows any type to participate in new-arrival campaigns.
- Alternative considered: Add `New Arrivals` as a pseudo-type. Rejected because it conflicts with type filtering semantics and data reporting.

2. **Automatic eligibility uses `createdAt` only**
- Decision: Base automatic new-arrival status on `createdAt` and configured window days.
- Rationale: Matches business expectation that “new” means newly launched, not newly edited.
- Alternative considered: `updatedAt` refresh. Rejected per owner rule and to avoid accidental re-promotion.

3. **Manual override uses per-product expiry date**
- Decision: Add per-product manual `new until` value that overrides automatic date when present.
- Rationale: Gives admin campaign-level control without changing global defaults.
- Alternative considered: boolean-only manual toggle. Rejected because it lacks explicit expiry control.

4. **Out-of-stock products may remain visible in New Arrivals**
- Decision: New-arrival filtering does not exclude out-of-stock items by default.
- Rationale: Aligns with owner preference to preserve discovery and demand signaling.
- Alternative considered: auto-hide out-of-stock. Rejected as contradictory to requirement.

5. **Performance changes prioritized for low break risk**
- Decision: Apply incremental optimizations that do not alter image ownership/path contracts.
- Rationale: Existing image lifecycle is operationally critical and must remain stable.
- Alternative considered: broad image pipeline rewrite/CDN migration. Deferred due to migration risk.

6. **Regression-first safety net for image workflows**
- Decision: Add focused test coverage for create/edit/delete/view image scenarios and cart/order continuity before and after optimization changes.
- Rationale: Prevents accidental regressions in the most fragile operational paths.

## Risks / Trade-offs

- **[Risk] Data backfill gaps for legacy products without timestamps** -> **Mitigation:** define deterministic fallback behavior and admin visibility indicators for missing `createdAt`.
- **[Risk] Manual and automatic new-arrival logic conflicts** -> **Mitigation:** enforce explicit precedence rule (manual date override, else automatic window) and test matrix.
- **[Risk] UI complexity increases in admin form/list** -> **Mitigation:** keep controls concise, with clear labels and red-only attention cues for actionable states.
- **[Risk] Performance gains may be limited if image payload remains large** -> **Mitigation:** sequence optimizations from safest/highest ROI first and validate with measurable before/after checks.
- **[Trade-off] Avoiding major infra shifts keeps cost low but limits peak optimization ceiling** -> **Mitigation:** capture deferred advanced options for a later phase if needed.

## Migration Plan

1. Extend product/config schema in backward-compatible manner.
2. Add storefront/admin UI support for Kurti and New Arrivals controls.
3. Add/adjust tests for new rules and image safety behaviors.
4. Roll out minimal performance optimizations behind existing behavior contracts.
5. Validate regression checklist: image CRUD, gallery rendering, cart/order flow.
6. Monitor production latency and image load behavior; rollback by disabling new fields usage if required.

## Open Questions

- What threshold should trigger red warning for “expiring soon” (e.g., <= 3 days)?
- Should admin have a quick filter for “currently in New Arrivals” and “expired overrides”?
- Should global window changes apply retroactively to products without manual override only (recommended) or all products?
