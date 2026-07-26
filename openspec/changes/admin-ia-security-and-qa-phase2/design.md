## Context

The current admin area exposes all major workflows in a single page-level composition, which couples navigation, settings, product CRUD, and order history into one stateful component. This structure complicates incremental feature additions, impairs usability on smaller screens, and makes testing harder because multiple concerns are entangled in one render tree.

Security posture has improved in cookie/session handling, but admin credential persistence still relies on plaintext config values and broad config object merging. This leaves avoidable risk in secret exposure and unintended config writes.

The project currently lacks first-party automated tests and test scripts for critical shop and admin actions. Production-readiness claims therefore depend on manual verification and are not repeatable in CI.

## Goals / Non-Goals

**Goals:**
- Separate admin workflows into route-focused pages for overview, products, orders, and settings.
- Isolate product add/edit/delete into dedicated product management views.
- Isolate order history and order detail into dedicated order views.
- Replace plaintext admin password storage with hashed credential storage and verification.
- Enforce schema validation and explicit field allowlists for configuration updates.
- Introduce automated verification for critical flows and define release gates.

**Non-Goals:**
- Introducing multi-role RBAC beyond current single-admin model.
- Replacing JSON persistence with a database in this phase.
- Redesigning storefront UX unrelated to admin management.
- Building full analytics/reporting features for admin overview.

## Decisions

1. Route-first admin information architecture
- Decision: Implement admin sections as route-level boundaries under app/admin.
- Rationale: Reduces cognitive load, improves maintainability, and supports independent page-level testing.
- Alternatives considered:
  - Keep single page with tab state only: simpler initially but keeps coupling and larger client state.
  - Modal-heavy workflow transitions: reduces navigability and deep-linking for specific admin tasks.

2. Split security settings from general shop settings
- Decision: Keep shop profile settings and admin security controls as separate logical groups and update handlers.
- Rationale: Prevents accidental secret edits and clarifies intent of sensitive actions.
- Alternatives considered:
  - Continue single payload update: minimal code changes but weak separation of concerns.

3. Hashed admin credential persistence
- Decision: Persist hashed admin password with salt/work-factor metadata and verify via secure hash compare.
- Rationale: Eliminates plaintext secret at rest and aligns with baseline security practice.
- Alternatives considered:
  - Plaintext with stronger transport only: does not address at-rest compromise risk.

4. Strict config update contract
- Decision: Validate payloads using a schema and allowlist only approved keys.
- Rationale: Prevents over-posting and accidental config drift from broad merge behavior.
- Alternatives considered:
  - Manual per-field checks only: possible but brittle and harder to evolve.

5. Test gate as release criterion
- Decision: Add automated tests for auth, config, product CRUD, and order flow; require build plus test pass.
- Rationale: Makes production readiness measurable and repeatable.
- Alternatives considered:
  - Manual regression checklist only: useful but insufficient for reliable release confidence.

## Risks / Trade-offs

- [Risk] Route split may temporarily duplicate data-fetch logic across pages.
  - Mitigation: Extract shared admin data hooks/utilities and centralize fetch contracts.

- [Risk] Hash migration can break existing admin login if migration handling is incomplete.
  - Mitigation: Add one-time compatibility flow and explicit migration test cases.

- [Risk] New test tooling increases setup time and CI duration.
  - Mitigation: Start with focused smoke and API tests; expand coverage iteratively.

- [Risk] JSON-based persistence remains single-writer oriented.
  - Mitigation: Document operational limits and defer DB migration to a separate change.

## Migration Plan

1. Introduce hashed credential fields and verification support while preserving current login path compatibility during transition.
2. Migrate existing plaintext admin password to hash format through controlled update flow.
3. Split admin UI into route-level pages and move current mixed dashboard behaviors to dedicated sections.
4. Enable schema-validated config writes and remove permissive merge behavior.
5. Add automated tests and scripts, then enforce build-and-test gate in release checklist.
6. Remove temporary compatibility paths once migrated state is verified.

Rollback strategy:
- UI rollback: route split can be reverted by restoring existing dashboard composition.
- Security rollback: maintain backup of pre-migration config and guarded fallback only during migration window.
- Test tooling rollback: tests can be disabled temporarily, but release gate should remain documented as unmet.

## Open Questions

- Should admin security settings use a dedicated API endpoint separate from general config updates?
- Which test stack should be adopted first for fastest confidence gains in this codebase (API-first vs E2E-first)?
- Should order detail pages include editable status in this phase or remain read-focused initially?
