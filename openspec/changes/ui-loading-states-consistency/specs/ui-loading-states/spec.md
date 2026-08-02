## ADDED Requirements

### Requirement: Consistent initial-load feedback for API-backed sections
The system SHALL display a visible loading placeholder for each API-backed section during first-load waits, using existing project styling tokens and without replacing surrounding layout structure.

#### Scenario: Shop list first load
- **WHEN** the shop page is waiting for products or configuration APIs on initial render
- **THEN** the product section shows a skeleton/loader state until data or an error state is available

#### Scenario: Admin list first load
- **WHEN** admin dashboard, products list, or orders list is waiting for its first API response
- **THEN** each waiting section shows an in-context skeleton/loader card instead of blank content

### Requirement: Consistent action-in-progress feedback for mutations
The system SHALL show inline loading feedback and disable duplicate triggers for API mutation actions (submit, save, delete, unlock) until the request resolves.

#### Scenario: Order submission in progress
- **WHEN** a user submits an order from cart while the API call is in progress
- **THEN** the submit trigger is disabled and displays an inline progress indicator

#### Scenario: Admin mutation in progress
- **WHEN** admin performs save/delete/unlock actions and the request is pending
- **THEN** the corresponding action control is disabled and shows a loader affordance until completion

### Requirement: Loading behavior SHALL avoid flicker and layout jump
The system SHALL apply loading visibility and rendering rules that minimize flicker and preserve layout stability across mobile and desktop.

#### Scenario: Fast API response
- **WHEN** an API response resolves faster than the configured loader threshold
- **THEN** a transient loader flash is avoided and final content appears without visible flicker

#### Scenario: Slow API response
- **WHEN** an API response exceeds the loader threshold
- **THEN** loader placeholders appear in fixed layout regions and content swap-in does not cause major layout shift

### Requirement: Loading visuals SHALL reuse existing design language
The system SHALL implement loaders using the existing Tailwind/CSS visual vocabulary already present in the project (stone/maroon palette, rounded cards, subtle motion).

#### Scenario: Visual consistency check
- **WHEN** loader components are rendered in storefront or admin
- **THEN** their shapes, colors, spacing, and typography align with surrounding UI styles without introducing a new design system dependency
