## ADDED Requirements

### Requirement: Checkout SHALL collect customer address above note
The system SHALL present an address text input above the note field in checkout flow.

#### Scenario: Address input placement and availability
- **WHEN** a customer opens the checkout form
- **THEN** the form shows an address text input above the note input

### Requirement: Order submission SHALL require and persist address
The system SHALL require address for new order submissions and persist it in the order record.

#### Scenario: Reject order without address
- **WHEN** a customer submits checkout without an address value
- **THEN** the system rejects the submission with a validation error

#### Scenario: Persist order with address
- **WHEN** a customer submits checkout with a valid address value
- **THEN** the created order record includes the submitted address
