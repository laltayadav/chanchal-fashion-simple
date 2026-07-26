## ADDED Requirements

### Requirement: Admin order listing
The system SHALL allow an authorized admin to view saved orders with metadata including timestamp, customer name, phone, total, and note.

#### Scenario: View order history
- **WHEN** an admin opens the admin dashboard after logging in
- **THEN** the page shows a list of orders with date/time, customer name, phone, total, and note

### Requirement: Order metadata preservation
The system SHALL save order metadata when an order is placed through the cart flow.

#### Scenario: Order metadata saved
- **WHEN** a user submits an order from the cart page
- **THEN** the order is stored in `orders.json` with timestamp, items, total, customer name, phone, and note
