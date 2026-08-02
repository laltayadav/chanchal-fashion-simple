## ADDED Requirements

### Requirement: Storefront SHALL support Kurti as a first-class product type
The system SHALL include `Kurti` in the product type taxonomy and SHALL allow users to filter catalog products by `Kurti` alongside existing product types.

#### Scenario: Kurti appears in storefront type filters
- **WHEN** a customer opens the shop page
- **THEN** the type filter row includes `Kurti` in addition to existing type options

#### Scenario: Kurti filter narrows visible products
- **WHEN** a customer selects `Kurti` in type filters
- **THEN** only products with `type = Kurti` are shown in the grid before category filtering

### Requirement: New Arrivals SHALL be modeled independently from product type
The system SHALL treat `New Arrivals` as a merchandising state independent of product type, and products in `New Arrivals` SHALL continue to belong to their original predefined type.

#### Scenario: New-arrival product retains underlying type
- **WHEN** a product is eligible for `New Arrivals`
- **THEN** the product still retains its original type (`Saree`, `Blouse`, `Set`, or `Kurti`)

### Requirement: Automatic New Arrivals eligibility SHALL use createdAt with configurable 30-day default
The system SHALL compute automatic new-arrival eligibility from `createdAt` only, using a configurable default window of 30 days when no manual override is present.

#### Scenario: Product is included within default window
- **WHEN** a product has `createdAt` within the configured new-arrival window
- **THEN** the product is treated as an active new arrival if no manual override exists

#### Scenario: Product ages out after window
- **WHEN** a product `createdAt` is older than the configured new-arrival window
- **THEN** the product is no longer treated as an active new arrival unless manual override keeps it active

#### Scenario: updatedAt does not refresh new-arrival status
- **WHEN** a product is edited and `updatedAt` changes but `createdAt` is older than window
- **THEN** automatic new-arrival eligibility remains based on original `createdAt` and does not reactivate from `updatedAt`

### Requirement: Manual new-arrival expiry override SHALL be supported per product
The system SHALL allow admin to set a manual `new until` date per product, and this manual value SHALL override automatic window eligibility while present.

#### Scenario: Manual override extends visibility beyond automatic window
- **WHEN** a product has manual `new until` date in the future
- **THEN** the product is treated as active new arrival even if automatic createdAt window has elapsed

#### Scenario: Manual override expiry deactivates new-arrival status
- **WHEN** current time passes product manual `new until` date
- **THEN** the product is no longer treated as active new arrival unless automatic window still applies and manual override is cleared

### Requirement: New Arrivals SHALL permit out-of-stock products
The system SHALL allow out-of-stock products to appear in new-arrivals views and filters.

#### Scenario: Out-of-stock item remains visible in new arrivals
- **WHEN** a product is out of stock and is otherwise eligible for new arrivals
- **THEN** the product appears in new-arrivals results with its stock state unchanged

### Requirement: Admin SHALL display actionable New Arrivals status in product list and edit form
The admin product list and edit form SHALL show `new until` visibility details and SHALL use red highlight cues for expiring or expired attention states.

#### Scenario: Admin sees red warning for expiring or expired new-arrival state
- **WHEN** a product new-arrival override is expired or near expiry threshold
- **THEN** admin list and edit views show red-highlight attention state for that product

#### Scenario: Admin can edit manual new-arrival expiry from product form
- **WHEN** admin opens product edit form
- **THEN** the form shows current new-arrival expiry context and allows updating or clearing the manual `new until` value

### Requirement: Admin settings SHALL expose global new-arrival window
The admin settings experience SHALL include a configurable `new-arrival window days` field with default value of 30.

#### Scenario: Admin updates global new-arrival window
- **WHEN** admin saves a new global window value
- **THEN** automatic createdAt-based eligibility uses the updated value for products without manual override
