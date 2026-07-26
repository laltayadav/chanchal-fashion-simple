## ADDED Requirements

### Requirement: Admin routes SHALL separate operational workflows
The system SHALL provide route-level admin sections for overview, products, orders, and settings so each workflow is independently navigable and testable.

#### Scenario: Navigate from admin shell to route sections
- **WHEN** an authenticated admin opens the admin area
- **THEN** the UI shows navigation targets for overview, products, orders, and settings
- **AND** each target resolves to a dedicated route section

### Requirement: Product management SHALL run in dedicated pages
The system SHALL support product add, edit, and delete actions from dedicated product-management routes rather than a single mixed dashboard context.

#### Scenario: Create product from products section
- **WHEN** an authenticated admin opens the products section and submits a valid new product form
- **THEN** the system persists the product and returns the admin to a products context with updated data

#### Scenario: Edit product from products section
- **WHEN** an authenticated admin updates an existing product from the products section
- **THEN** the system persists the changes and reflects updated product details in products views

#### Scenario: Delete product from products section
- **WHEN** an authenticated admin confirms deletion of an existing product from the products section
- **THEN** the system deletes the product and removes it from products views

### Requirement: Order history SHALL be isolated to orders routes
The system SHALL expose order history and order-detail management in dedicated orders routes.

#### Scenario: View order history in orders section
- **WHEN** an authenticated admin opens the orders section
- **THEN** the system displays persisted orders with key metadata for operational review

#### Scenario: Open order detail from orders section
- **WHEN** an authenticated admin selects an order in the orders section
- **THEN** the system displays a dedicated view for that order's details
