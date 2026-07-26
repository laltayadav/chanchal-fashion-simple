## ADDED Requirements

### Requirement: Admin product creation
The system SHALL allow an authorized admin to add new products with fields for type, name, category, price, discount price, image URL, and stock state.

#### Scenario: Create product from admin
- **WHEN** an admin submits a new product form with valid values
- **THEN** the product is saved and appears in the product list

### Requirement: Admin product editing
The system SHALL allow an authorized admin to edit existing product details.

#### Scenario: Edit product details
- **WHEN** an admin updates a product field and saves changes
- **THEN** the product data is updated in `products.json`

### Requirement: Admin product deletion
The system SHALL allow an authorized admin to delete a product.

#### Scenario: Delete product from admin
- **WHEN** an admin deletes a product
- **THEN** the product is removed from `products.json` and is no longer visible in the shop
