## Context

The current data layer uses a single default repo data directory as both the local runtime location and the seed source for mounted runtime storage. On Fly, production uses `DATA_DIR=/data` backed by a volume, but if a runtime file is missing the app can copy the bundled repo JSON into production storage. That is survivable for curated seed products, but unsafe for orders and operational state.

## Goals / Non-Goals

**Goals:**
- Separate seed data from runtime-managed data responsibilities.
- Ensure production order data is never initialized from repo-tracked JSON.
- Support local-only JSON workflows that are safe to keep out of git.
- Make production startup behavior explicit when runtime storage is missing or incomplete.
- Preserve current low-complexity JSON persistence model.

**Non-Goals:**
- Replacing JSON storage with a database.
- Changing core product/order APIs beyond storage safety behavior.
- Introducing paid infrastructure or external data services.
- Migrating historical production data as part of this change.

## Decisions

1. **Separate seed and runtime directories**
- Decision: Treat repo-tracked JSON as seed/bootstrap content only, and runtime JSON as a distinct storage concern.
- Rationale: Prevents local edits in tracked files from being treated as live production data.
- Alternative considered: continue dual-use repo `data/` behavior. Rejected because it keeps fallback behavior unsafe.

2. **Orders are runtime-only data**
- Decision: `orders.json` SHALL initialize empty when missing and SHALL never be copied from bundled repo seed files.
- Rationale: Orders are business records, not bootstrap data.
- Alternative considered: allowing optional seeded orders for demos. Rejected because it creates production contamination risk.

3. **Production-safe fallback behavior**
- Decision: Production runtime SHALL prefer mounted data and surface an explicit warning or safe initialization path rather than silently copying unsafe repo state.
- Rationale: Silent fallback is convenient in dev but dangerous in prod.
- Alternative considered: identical fallback semantics across all environments. Rejected due to operational risk.

4. **Local development uses private runtime data directory**
- Decision: Document and support a local-only runtime directory pattern that is not committed to git.
- Rationale: Lets the owner manage private test products/orders without risking deployment bleed-through.
- Alternative considered: keeping all local runtime data inside tracked `data/`. Rejected because it invites accidental pushes.

## Risks / Trade-offs

- [Risk] Stricter startup rules may expose misconfigured environments earlier -> Mitigation: document expected env values and add clear operator-facing guidance.
- [Risk] Seed/runtime split adds a small amount of setup complexity for local development -> Mitigation: provide a simple documented `.local-data` workflow.
- [Risk] Existing assumptions around seeded product bootstrap may need adjustment -> Mitigation: keep product seeding supported, but only through explicit seed files.
- [Trade-off] Safer production behavior reduces silent recovery convenience -> Mitigation: prefer explicit bootstrap and backup procedures over hidden fallback.

## Migration Plan

1. Define the runtime vs seed JSON ownership rules in specs.
2. Update data-layer bootstrap logic to distinguish seedable files from runtime-only files.
3. Update local setup/runbook guidance for a local-only runtime data directory.
4. Add regression tests for missing-file boot behavior in local and production-like paths.
5. Validate with test/build and a production-confidence check before rollout.
6. Rollback path: restore prior bootstrap behavior if operational issues appear, while preserving volume backups.

## Open Questions

- Should production fail hard when the mounted data directory is unavailable, or warn and create only empty runtime files?
- Which files besides `orders.json` should be forbidden from repo seeding in production-like environments?
- Should sample products remain in the repo, or move entirely into explicit seed fixtures outside the default runtime path?
