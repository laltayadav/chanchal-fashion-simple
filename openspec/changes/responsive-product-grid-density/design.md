## Context

The storefront currently supports a responsive shell but the product card grid does not scale consistently across breakpoints. In practice, product cards collapse to a single column at extra-large widths while a desktop cart sidebar is visible. This creates low information density for tablet and desktop shoppers and conflicts with the intended multi-column desktop browsing experience.

Constraints:
- Keep mobile readability as a priority.
- Preserve desktop cart discoverability behavior.
- Avoid API/data-model changes; this is a UI-layout behavior refinement.

## Goals / Non-Goals

**Goals:**
- Establish a clear breakpoint policy for product columns that guarantees 1 column on mobile and increased columns on larger screens.
- Ensure the grid remains visually stable when cart summary/sidebar regions appear on wide layouts.
- Provide testable acceptance conditions for mobile, tablet, desktop, and wide desktop.

**Non-Goals:**
- Redesigning product card internals (typography, pricing layout, CTA style).
- Changing cart business logic, checkout flow, or order APIs.
- Introducing virtualization, pagination, or backend-driven layout rules.

## Decisions

1. Define explicit breakpoint-based column targets.
- Decision: Use deterministic column counts by viewport class (mobile, tablet, desktop, wide desktop), with mobile fixed at 1.
- Rationale: Predictable behavior simplifies QA and prevents accidental regressions from ad hoc class changes.
- Alternative considered: Auto-fill/minmax layout with dynamic card widths.
- Why not chosen: More adaptive, but less deterministic for acceptance testing and can produce inconsistent card count transitions.

2. Treat cart sidebar visibility as a layout constraint, not a separate mode.
- Decision: Product grid column targets must remain practical when sidebar is present, with optional wider-screen escalation to preserve browse density.
- Rationale: Sidebar and product density compete for horizontal space; handling them together avoids contradictory breakpoint rules.
- Alternative considered: Disable sidebar at desktop and rely only on floating cart.
- Why not chosen: Reduces persistent cart awareness for desktop users.

3. Validate density via scenario-driven UI checks.
- Decision: Encode expectations in OpenSpec scenarios per viewport tier and include spacing consistency assertions.
- Rationale: This behavior has regressed before due to class-level overrides; scenario checks provide durable guardrails.
- Alternative considered: Rely on visual/manual QA only.
- Why not chosen: Manual-only verification is slower and regression-prone.

## Risks / Trade-offs

- [Risk] Column increases can reduce card readability on some mid-size screens.
  - Mitigation: Keep tablet baseline at 2 columns and only increase at desktop/wide desktop breakpoints.

- [Risk] Sidebar plus multi-column grid can feel cramped if container width is constrained.
  - Mitigation: Tie wider column counts to sufficiently wide breakpoints and preserve card spacing tokens.

- [Trade-off] Deterministic breakpoints are less fluid than fully responsive auto-fit.
  - Mitigation: Revisit with telemetry if catalog count or card design changes substantially.

## Migration Plan

1. Add/approve spec requirements for responsive product grid density.
2. Update storefront grid classes and related responsive layout classes in a single implementation change.
3. Execute viewport-based UI verification for mobile, tablet, desktop, and wide desktop.
4. Roll back by restoring previous class mapping if unexpected card overflow or clipping appears.

## Open Questions

- Should wide desktop target 3 columns or 4 when sidebar is hidden?
- Should sidebar activation threshold move to a wider breakpoint to prioritize product density?
- Do we want explicit visual regression snapshots for each viewport tier in CI?
