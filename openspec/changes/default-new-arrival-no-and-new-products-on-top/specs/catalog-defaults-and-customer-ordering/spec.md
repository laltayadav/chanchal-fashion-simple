## ADDED Requirements

### Requirement: New products SHALL default to excluded from New Arrivals
The system SHALL default `newArrivalEnabled` to `false` for newly created products when the create payload does not explicitly provide a value.

#### Scenario: Admin creates product without setting new-arrival flag
- **WHEN** admin creates a product and `newArrivalEnabled` is omitted
- **THEN** the stored product has `newArrivalEnabled = false`

#### Scenario: Admin explicitly enables new-arrival inclusion
- **WHEN** admin creates a product and sets `newArrivalEnabled = true`
- **THEN** the stored product has `newArrivalEnabled = true`

### Requirement: Customer catalog default ordering SHALL prioritize newly added products
The storefront default product listing SHALL order products by creation timestamp descending so newly added products appear first to customers.

#### Scenario: Newer created product appears above older product
- **WHEN** two products have valid `createdAt` timestamps and one is newer
- **THEN** the newer `createdAt` product appears earlier in default customer listing

#### Scenario: Editing older product does not move it above newly added product
- **WHEN** an older product receives a newer `updatedAt` value than a newly added product
- **THEN** default customer listing order remains based on `createdAt` and does not promote the edited older product above the newer-created product

### Requirement: Customer default ordering SHALL remain deterministic for incomplete timestamps
The storefront default listing SHALL apply deterministic fallback behavior for products missing or carrying invalid `createdAt` values.

#### Scenario: Missing createdAt values do not cause unstable ordering
- **WHEN** multiple products in listing have missing or invalid `createdAt`
- **THEN** the system uses a deterministic fallback tie-breaker so list order remains stable across requests
