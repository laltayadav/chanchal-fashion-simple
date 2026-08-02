## Context

The storefront product card already supports a gallery model through `product.images`, but the card renders only the first image and opens a popup viewer for deeper browsing. The popup already supports horizontal swipe navigation and next/previous controls, so the requested change is about exposing light-touch gallery browsing directly on the card without breaking zoom, click, or popup continuity.

## Goals / Non-Goals

**Goals:**
- Allow horizontal swipe on touch devices to browse product images directly inside the card.
- Keep click/tap-to-open popup behavior intact for non-swipe interactions.
- Keep popup gallery behavior unchanged except for starting at the currently visible card image.
- Confine the change to the product-card interaction layer with minimal break risk.

**Non-Goals:**
- Redesigning the popup viewer UI.
- Adding a full thumbnail strip or desktop carousel controls unless needed for regression safety.
- Changing product image storage, optimization, or upload behavior.
- Reworking cart, pricing, or broader storefront layout behavior.

## Decisions

1. **Card and popup share the same active image index**
- Decision: Use one active image index for both the card preview and popup viewer state.
- Rationale: Prevents mismatch when the user swipes on the card and then opens the popup.
- Alternative considered: separate indices for card and popup. Rejected because it creates confusing resets.

2. **Swipe must suppress tap-to-open**
- Decision: A horizontal swipe above threshold on the card cancels the tap/click open action for that gesture.
- Rationale: Avoids accidental popup opens during browsing.
- Alternative considered: allow both swipe and open on release. Rejected because it would feel broken on touch devices.

3. **Existing popup behavior stays functionally unchanged**
- Decision: Preserve current popup navigation model and only change its initial image selection to the current card image.
- Rationale: Minimizes regression risk and keeps the change localized.
- Alternative considered: redesign popup interactions in the same change. Rejected due to unnecessary scope.

4. **In-card swipe is only active for multi-image products**
- Decision: Products with one or zero images keep current simple image behavior.
- Rationale: Avoids adding gesture complexity where there is nothing to browse.
- Alternative considered: universal gesture plumbing for all cards. Rejected because it adds complexity without value.

## Risks / Trade-offs

- [Risk] Tap and swipe gesture conflict could cause accidental popup opens -> Mitigation: track gesture distance and suppress open after meaningful swipe.
- [Risk] Shared index state could regress popup initialization -> Mitigation: add tests for popup opening at current card image.
- [Risk] Touch-only behavior may leave desktop users without visible gallery cues -> Mitigation: preserve image count badge and keep click-to-open unchanged.
- [Trade-off] Minimal-scope implementation prioritizes safety over richer carousel affordances -> Mitigation: revisit dots/arrows later only if browsing discoverability is insufficient.

## Migration Plan

1. Update product card interaction state to render the current gallery image on the card.
2. Add touch gesture handling on the card image container with tap suppression after swipe.
3. Keep popup navigation logic and set popup start state from the current card image.
4. Add focused tests for swipe behavior and popup continuity.
5. Run tests and build to confirm no UI regression.

## Open Questions

- Should desktop users also get visible next/previous affordances on the card, or is touch swipe plus popup enough?
- Should the card reset back to the first image after some delay, or remain on the last browsed image?
- Do we want a subtle visual cue that the card image is swipeable on touch devices?
