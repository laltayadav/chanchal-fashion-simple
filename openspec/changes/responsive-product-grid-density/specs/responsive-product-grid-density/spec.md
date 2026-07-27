## ADDED Requirements

### Requirement: Mobile-first single-column storefront grid
The system SHALL render storefront product cards in exactly one column on mobile viewports.

#### Scenario: Shop page on mobile viewport
- **WHEN** a user opens the shop page on a narrow/mobile viewport
- **THEN** product cards render in a single column with consistent vertical spacing

### Requirement: Increased product density on tablet and desktop
The system SHALL increase storefront product columns above mobile, with at least two columns on tablet and at least two columns on desktop-class widths.

#### Scenario: Shop page on tablet viewport
- **WHEN** a user opens the shop page on a tablet viewport
- **THEN** product cards render in two or more columns with consistent card spacing

#### Scenario: Shop page on desktop viewport
- **WHEN** a user opens the shop page on a desktop viewport
- **THEN** product cards render in a multi-column grid (minimum two columns)

### Requirement: Grid density remains practical with desktop cart region
The system SHALL preserve practical product grid density when a desktop cart summary/sidebar region is displayed.

#### Scenario: Desktop cart region visible
- **WHEN** the desktop cart summary/sidebar is visible alongside the product list
- **THEN** the product list still renders a multi-column grid and does not collapse to a single column
