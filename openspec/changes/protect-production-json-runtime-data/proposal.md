## Why

The app currently allows missing runtime JSON files on a mounted data directory to be seeded from repo-tracked files, which creates a path for local products or orders to become production data during first boot, empty-volume recovery, or misconfiguration. This is especially risky for orders, which should always remain runtime-owned data rather than bundled seed content.

## What Changes

- Separate bundled seed data from runtime-managed JSON data.
- Prevent production order data from ever being initialized from repo-tracked JSON.
- Add explicit runtime behavior rules for local development, seeded bootstrap data, and production mounted data.
- Add production guardrails so missing runtime storage does not silently fall back to unsafe repo state.
- Document the supported local-only workflow for private products/orders that must not be pushed to production.
- Add regression coverage for first-boot seeding and production-safe fallback behavior.

## Capabilities

### New Capabilities
- `runtime-json-data-safety`: Defines how seed data, local runtime data, and production runtime data are separated and protected.

### Modified Capabilities
- None.

## Impact

- Affected code: runtime JSON loading and bootstrap behavior in the data layer.
- Affected operations: Fly volume bootstrap, local development data setup, and deploy safety checks.
- Affected documentation: local setup and backup/runbook guidance for JSON ownership.
- Affected tests: bootstrapping behavior, missing-file handling, and production-safe order initialization.
