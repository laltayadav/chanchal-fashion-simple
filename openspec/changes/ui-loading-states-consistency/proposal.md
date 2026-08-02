## Why

The UI currently has inconsistent feedback during API waits: some screens silently wait, others only change button text, and initial data loads often have no visible loading state. This creates uncertainty for users and increases accidental repeat actions.

## What Changes

- Introduce a unified loading-state behavior across storefront and admin API-driven views.
- Add first-load skeleton/loader blocks for data-fetching sections (shop grid, admin dashboard metrics, admin products list, admin orders list).
- Add consistent inline action loaders for mutation actions (save/delete/submit/unlock) while disabling repeat clicks.
- Define standard loader timing rules to avoid flicker and layout shift.
- Reuse existing Tailwind visual language (stone/maroon palette, rounded cards, subtle motion), without introducing a new styling framework.

## Capabilities

### New Capabilities
- `ui-loading-states`: Defines consistent loading UX patterns and behavior for initial load, action-in-progress states, and refresh states across customer and admin surfaces.

### Modified Capabilities
- None.

## Impact

- Affected UI code: shop page, cart page, admin login/dashboard/products/orders components.
- Affected UX behavior: API fetch and mutation feedback during server-side and client-side wait periods.
- No API contract changes expected.
- No new runtime dependencies expected (use existing Tailwind/CSS utilities).
