## ADDED Requirements

### Requirement: Shared cart state across pages
The system SHALL provide a shared cart state that is accessible from both the shop page and the cart page.

#### Scenario: Add item on shop page then view cart
- **WHEN** a user adds a product to the cart on the shop page
- **THEN** the cart page shows that product without requiring a page refresh

#### Scenario: Cart page line item controls
- **WHEN** a user opens the cart page after adding items
- **THEN** the cart page shows the current cart items and allows the user to remove items

### Requirement: Cart summary and order total
The system SHALL calculate and display the cart total on the cart page and in any cart summary components.

#### Scenario: Total updates correctly
- **WHEN** a user adds or removes items from the cart
- **THEN** the displayed total updates to reflect the current cart contents
