## ADDED Requirements

### Requirement: Product records SHALL support a flexible size text attribute
The system SHALL support an optional free-text `size` field on product records for values such as "Free Size", "38 inch", "XL", and "XXXL".

#### Scenario: Persist product size on create
- **WHEN** an authenticated admin creates a product with a size value
- **THEN** the system persists the provided size text with the product record

#### Scenario: Persist product size on update
- **WHEN** an authenticated admin updates a product size value
- **THEN** the system persists the latest size text with the product record

### Requirement: Admin interfaces SHALL expose product size metadata
The system SHALL include size input and display size metadata in admin product management interfaces.

#### Scenario: Admin can enter size in product form
- **WHEN** an admin edits or creates a product in admin form
- **THEN** the form includes a size text input field

#### Scenario: Admin list shows size as secondary text
- **WHEN** an admin views the product list
- **THEN** each product item shows size value as secondary metadata when size exists

### Requirement: Storefront product card SHALL display size as secondary metadata
The system SHALL display product size in storefront product cards using smaller secondary typography.

#### Scenario: Display size on storefront product card
- **WHEN** a storefront product card is rendered for a product with size
- **THEN** the card shows the size value near product name/category metadata in smaller text style
