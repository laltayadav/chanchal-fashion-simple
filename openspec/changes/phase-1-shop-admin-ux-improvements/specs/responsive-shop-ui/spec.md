## ADDED Requirements

### Requirement: Responsive storefront layout
The system SHALL render the shop page with a responsive layout that works well on mobile, tablet, and desktop screens.

#### Scenario: Shop page on mobile
- **WHEN** a user opens the shop page on a narrow viewport
- **THEN** products display in a single column with adequate spacing and the header remains visible

#### Scenario: Shop page on desktop
- **WHEN** a user opens the shop page on a wider viewport
- **THEN** products display in a multi-column grid with consistent spacing

### Requirement: Visible cart navigation
The system SHALL display a visible cart link or count in the global header so users can access the cart from any page.

#### Scenario: Cart count in header
- **WHEN** a user adds an item to the cart
- **THEN** the global header updates to show the cart item count

### Requirement: Improved product card clarity
The system SHALL show product images, name, type, category, and clear pricing on every product card.

#### Scenario: Product card rendering
- **WHEN** a user views the shop page
- **THEN** each product card displays an image or placeholder, name, type/category, and price
