## ADDED Requirements

### Requirement: Product records SHALL persist creation and update timestamps
The system SHALL store `createdAt` and `updatedAt` metadata on product records to represent lifecycle events.

#### Scenario: Create product persists initial lifecycle metadata
- **WHEN** an authenticated admin creates a new product
- **THEN** the persisted product includes non-empty `createdAt` and `updatedAt` timestamp values
- **AND** `createdAt` and `updatedAt` are set to the same creation-time value

#### Scenario: Update product persists modification metadata
- **WHEN** an authenticated admin updates an existing product
- **THEN** the persisted product keeps its original `createdAt` value
- **AND** updates `updatedAt` to the current modification time

### Requirement: Admin product list SHALL prioritize newest activity
The system SHALL order admin product list data by most recent product activity using `updatedAt` first and `createdAt` fallback when needed.

#### Scenario: Sort admin list by latest update
- **WHEN** admin product list data contains products with different `updatedAt` values
- **THEN** products with more recent `updatedAt` values appear before older ones

#### Scenario: Fallback sort for legacy records
- **WHEN** a product record does not contain `updatedAt`
- **THEN** the system uses `createdAt` if present for ordering
- **AND** applies deterministic fallback ordering when both values are unavailable

### Requirement: Admin product list SHALL display absolute and relative recency metadata
The system SHALL display both absolute datetime and relative age for product added and updated metadata in admin product list rows/cards.

#### Scenario: Show added and updated timestamps in admin list
- **WHEN** an admin views products in the admin product list
- **THEN** each list item shows added datetime and updated datetime values
- **AND** each value includes a relative age label such as days or hours ago
