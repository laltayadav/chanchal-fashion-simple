## Context

The storefront and admin surfaces fetch data from multiple APIs (`/api/products`, `/api/orders`, `/api/config`, `/api/admin/check`) and currently expose loading feedback inconsistently. Some actions only change button labels, while first-load waits are often blank until data arrives. This causes uncertainty and repeat clicks, especially on slower mobile networks.

The codebase already uses a coherent Tailwind visual language (rounded cards, stone palette, maroon accents) and should keep this consistent instead of introducing a new component library.

## Goals / Non-Goals

**Goals:**
- Provide a consistent loader pattern for first-load, action-in-progress, and refresh states across shop/cart/admin pages.
- Keep layout stable during loading to avoid jumps and preserve context.
- Reuse existing utility classes and palette for visual consistency.
- Prevent duplicate user actions while requests are active.

**Non-Goals:**
- Redesigning page structure, information architecture, or navigation.
- Changing API contracts or backend processing behavior.
- Introducing third-party loading/skeleton dependencies.

## Decisions

1. **Adopt three loading patterns only**
- Decision: Standardize on (a) section skeletons for initial data load, (b) inline button spinner+label for mutations, and (c) lightweight inline status text for background refresh.
- Rationale: Minimal mental model for users and developers, easy to apply across all current screens.
- Alternative considered: page-wide blocking overlay for all waits. Rejected because it hides context and feels heavy for small actions.

2. **Use delayed visibility for micro-loads**
- Decision: Show loader UI only when requests exceed a short threshold (about 150-200ms).
- Rationale: Prevents distracting flash/flicker for fast responses.
- Alternative considered: always show loader immediately. Rejected due to visual noise.

3. **Keep loaders local to affected regions**
- Decision: Render loaders in the card/section that is waiting rather than global page lock.
- Rationale: Preserves interactivity in unaffected regions and improves perceived responsiveness.
- Alternative considered: single top-level global loader state. Rejected because multiple independent requests exist.

4. **Disable action triggers while pending**
- Decision: While a mutation is in flight, disable its trigger and show progress affordance.
- Rationale: Prevents duplicate submissions/deletes and aligns with current button semantics.
- Alternative considered: allow repeat clicks and dedupe server-side only. Rejected due to poor UX and unnecessary network calls.

5. **Use current style tokens only**
- Decision: Use existing Tailwind classes (`rounded-2xl/3xl`, `border-stone-*`, `bg-stone-*`, `bg-amber-*`, subtle animation classes).
- Rationale: Keeps visual consistency and reduces design risk.
- Alternative considered: custom CSS animation package. Rejected as unnecessary complexity.

## Risks / Trade-offs

- [Risk] Too many animated placeholders can create noisy UI -> Mitigation: confine pulse/spinner to waiting regions and keep animation subtle.
- [Risk] Loader state race conditions on rapid filter changes -> Mitigation: bind loading state to latest request token and ignore stale responses.
- [Risk] Added state flags increase component complexity -> Mitigation: centralize small reusable loading primitives and naming conventions.
- [Trade-off] Delayed loader threshold can hide very short waits -> Mitigation: acceptable in favor of reduced flicker.

## Migration Plan

1. Add reusable loading UI primitives (section skeleton + inline spinner pattern) using current classes.
2. Apply first-load skeletons to shop and admin list/dashboard surfaces.
3. Apply inline action loaders to submit/save/delete/unlock actions.
4. Validate on mobile and desktop for no layout breakage.
5. Run tests and build; deploy with no API changes.

Rollback strategy:
- Revert only the loading-state UI patch if any visual/interaction regressions are observed; no data migration needed.

## Open Questions

- Should loading shimmer be disabled for users with reduced-motion preference (recommended yes)?
- Should we show explicit retry actions in initial-load error states as part of this same change or a follow-up?
- Do we want one globally reusable `LoadingCard` component now, or first apply locally and refactor after validation?
