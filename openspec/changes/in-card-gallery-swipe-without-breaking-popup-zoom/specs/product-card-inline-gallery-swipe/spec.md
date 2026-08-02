## ADDED Requirements

### Requirement: Product cards SHALL support inline swipe browsing for multi-image products
The storefront SHALL allow customers to horizontally browse a product card’s image gallery directly on the card when the product has more than one image.

#### Scenario: Swipe changes visible card image
- **WHEN** a customer performs a horizontal swipe on a product card with multiple images
- **THEN** the card updates to show the next or previous gallery image without opening the popup viewer

#### Scenario: Single-image products do not activate swipe browsing
- **WHEN** a product has fewer than two images
- **THEN** the card keeps the existing non-gallery image behavior without swipe navigation

### Requirement: Inline swipe SHALL not break popup zoom behavior
The storefront SHALL preserve the existing popup zoom flow and SHALL prevent swipe gestures from accidentally triggering popup open.

#### Scenario: Swipe gesture does not open popup
- **WHEN** a customer completes a qualifying horizontal swipe on the card image
- **THEN** the popup viewer does not open as part of that gesture

#### Scenario: Tap still opens popup
- **WHEN** a customer taps or clicks the card image without a qualifying swipe gesture
- **THEN** the popup viewer opens using the existing zoom interaction

### Requirement: Popup viewer SHALL open at the currently visible card image
The popup viewer SHALL use the image currently visible on the card as its starting image so card browsing and popup browsing stay aligned.

#### Scenario: Popup opens at swiped-to image
- **WHEN** a customer swipes to a later gallery image on the card and then opens the popup viewer
- **THEN** the popup starts on that same image instead of resetting to the first image
