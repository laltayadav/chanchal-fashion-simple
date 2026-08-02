## 1. Seed and Runtime Separation

- [x] 1.1 Define the runtime JSON ownership policy in the data layer: seed/bootstrap files versus mutable runtime files.
- [x] 1.2 Introduce explicit handling for production-like mounted runtime directories versus local default development directories.
- [x] 1.3 Ensure `orders.json` missing-file initialization uses empty state rather than bundled repo seed content.

## 2. Local and Production Safety Behavior

- [x] 2.1 Add a supported local-only runtime data directory workflow that keeps private JSON out of git-tracked repo state.
- [x] 2.2 Add production-safe warning or initialization behavior for missing mounted runtime files.
- [x] 2.3 Keep product/bootstrap seeding explicit and scoped only to allowed seed files.

## 3. Regression Coverage and Release Safety

- [x] 3.1 Add tests covering first-boot behavior for products, orders, and config across local and mounted runtime paths.
- [x] 3.2 Update docs/runbooks for local setup, backup expectations, and production data ownership.
- [x] 3.3 Run test, build, and production push confidence checks before rollout.
