## Why

Customers can currently swipe between gallery images only after opening the popup viewer, which adds friction for quick browsing on touch devices. The shop needs in-card swipe browsing for multi-image products while preserving the existing popup zoom behavior and avoiding gesture conflicts.

## What Changes

- Add in-card horizontal swipe support for product cards that have multiple images.
- Make the card image display the currently selected gallery image instead of always showing only the first image.
- Preserve tap/click behavior for opening the popup viewer without letting swipe gestures accidentally trigger it.
- Keep the popup viewer’s existing swipe, arrow, and close interactions working as they do today.
- Open the popup viewer at the image currently visible on the card so card and popup state stay in sync.
- Add regression coverage for gesture handling and existing popup behavior.

## Capabilities

### New Capabilities
- `product-card-inline-gallery-swipe`: Defines in-card swipe browsing behavior and popup continuity for multi-image product cards.

### Modified Capabilities
- None.

## Impact

- Affected UI: product card image interaction on storefront grid.
- Affected UX logic: swipe-versus-tap gesture handling and popup starting image state.
- Affected tests: product card interaction coverage for multi-image products.
- No backend, API, or persistence changes required.
