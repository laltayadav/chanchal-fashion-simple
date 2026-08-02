## Context

The shop currently supports New Arrivals through createdAt-window logic and manual overrides, while recency utilities also include updatedAt for sorting contexts. Admin form and API creation paths currently interpret missing `newArrivalEnabled` as enabled, which makes "Yes" the effective default. The requested behavior is to make default inclusion "No" and show newly added products first for customers.

## Goals / Non-Goals

**Goals:**
- Make default `newArrivalEnabled` for newly created products false unless explicitly set true.
- Set customer-facing default ordering to newly added first using createdAt descending.
- Avoid regressions in existing manual new-arrival override behavior.
- Keep behavior explicit between customer-facing ordering and admin operational views.

**Non-Goals:**
- Redesigning New Arrivals browse UX controls.
- Changing out-of-stock visibility policy in New Arrivals.
- Introducing a new persistence layer or search index.
- Reworking admin list sorting unless needed for consistency.

## Decisions

1. **Creation default for new-arrival inclusion is explicit false**
- Decision: In both UI and API create paths, default `newArrivalEnabled` to `false` when value is absent.
- Rationale: Aligns with owner policy and prevents accidental campaign inclusion.
- Alternative considered: UI-only default change. Rejected because API callers could still create products with implicit true.

2. **Customer default order is createdAt-descending**
- Decision: Customer storefront default list order SHALL be newest-added-first using createdAt descending.
- Rationale: "Newly added" is a creation-time concept, not edit-time activity.
- Alternative considered: updatedAt-first recency. Rejected because edits can incorrectly bump old items.

3. **Ordering context separation**
- Decision: Keep admin ordering allowed to remain activity-oriented if desired, while customer default must remain creation-oriented.
- Rationale: Admin workflows benefit from recently touched visibility; customer merchandising needs launch chronology.
- Alternative considered: one global ordering rule for all surfaces. Rejected due to conflicting needs.

4. **Compatibility fallback for missing timestamps**
- Decision: Preserve deterministic fallback for records lacking valid createdAt.
- Rationale: Existing legacy/sample data may be incomplete.
- Alternative considered: hard requirement for timestamps. Rejected due to migration overhead.

## Risks / Trade-offs

- [Risk] Existing integration paths may assume implicit `newArrivalEnabled=true` on create -> Mitigation: update API tests to assert false default and verify explicit true still works.
- [Risk] Customer ordering shift may alter merchandising expectations for edited products -> Mitigation: document behavior in spec and keep optional explicit sort controls available.
- [Risk] Records with malformed or missing createdAt may sort unexpectedly -> Mitigation: retain deterministic fallback behavior and normalize where possible.
- [Trade-off] Separate admin/customer ordering policies increase conceptual complexity -> Mitigation: codify in specs and tests to prevent drift.

## Migration Plan

1. Update product creation defaults (admin form state and products POST route default handling).
2. Update customer default ordering logic to createdAt-descending behavior.
3. Keep manual new-arrival override flow unchanged.
4. Add/adjust tests for default create behavior and ordering semantics.
5. Run test/build confidence checks before release.
6. Rollback path: restore prior defaults and ordering in isolated commits if unforeseen regression appears.

## Open Questions

- Should admin list default stay activity-based (`updatedAt`) or also move to createdAt-first for consistency?
- Should customer "Featured" label be renamed if it now effectively shows newest-by-default?
- Do we need a one-time data normalization step for products missing `createdAt` in production data?
