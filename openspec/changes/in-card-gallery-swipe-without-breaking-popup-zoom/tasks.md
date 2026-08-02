## 1. Card Interaction State

- [x] 1.1 Update product card rendering to display the active gallery image instead of always the first image.
- [x] 1.2 Share or synchronize the active image index between inline card browsing and popup viewer start state.
- [x] 1.3 Keep single-image cards on the current simple behavior path.

## 2. Swipe and Popup Gesture Safety

- [x] 2.1 Add inline touch swipe handling on multi-image product cards.
- [x] 2.2 Prevent swipe gestures from triggering popup open while preserving tap/click-to-open behavior.
- [x] 2.3 Preserve the popup viewer’s current navigation and close interactions.

## 3. Validation

- [x] 3.1 Add focused regression tests for inline swipe, tap-to-open, and popup start-image continuity.
- [x] 3.2 Run `npm run test` and `npm run build` after the interaction change.
- [ ] 3.3 Manually verify swipe behavior on a touch-capable viewport and confirm existing popup zoom still works.
