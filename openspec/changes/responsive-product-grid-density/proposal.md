## Why

The storefront currently collapses product cards to a single column at extra-large breakpoints, which reduces browse speed and makes desktop and tablet layouts feel underutilized. We need a predictable responsive grid policy so mobile remains readable while larger screens present more products per view.

## What Changes

- Define responsive storefront requirements so product density scales by breakpoint: 1 column on mobile, increasing columns on tablet and desktop.
- Define behavior for product grid when desktop cart summary/sidebar is visible, ensuring card density remains practical.
- Add acceptance scenarios that validate spacing and consistency of the grid across mobile, tablet, desktop, and wide desktop ranges.

## Capabilities

### New Capabilities
- `responsive-product-grid-density`: Responsive rules and acceptance criteria for storefront product columns across breakpoints.

### Modified Capabilities
- None.

## Impact

- Affected UX/spec surface: shop layout responsiveness and desktop catalog density.
- Expected implementation touchpoints: app/page.tsx layout classes, possible cart/sidebar breakpoint interplay, and responsive UI tests.
- No external API or dependency changes are expected.
