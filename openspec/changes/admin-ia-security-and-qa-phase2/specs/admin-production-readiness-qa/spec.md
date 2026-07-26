## ADDED Requirements

### Requirement: Critical admin and shop actions SHALL have automated verification
The system SHALL provide automated tests for core action paths including admin authentication, config updates, product CRUD, and order placement/visibility.

#### Scenario: Validate admin auth behavior
- **WHEN** the automated test suite runs admin authentication tests
- **THEN** it verifies successful login, failed login, and protected-route rejection behavior

#### Scenario: Validate config update behavior
- **WHEN** the automated test suite runs config tests
- **THEN** it verifies valid updates succeed and invalid payloads are rejected

#### Scenario: Validate product CRUD behavior
- **WHEN** the automated test suite runs product-management tests
- **THEN** it verifies product create, edit, and delete behavior including persistence effects

#### Scenario: Validate order flow behavior
- **WHEN** the automated test suite runs order-flow tests
- **THEN** it verifies add-to-cart, order submission persistence, and admin order visibility

### Requirement: Production readiness SHALL require build-and-test gate
The system SHALL define production readiness as requiring successful build execution and successful completion of required action tests.

#### Scenario: Enforce release gate
- **WHEN** a release candidate is evaluated for production readiness
- **THEN** the candidate is considered ready only if build and required tests pass
