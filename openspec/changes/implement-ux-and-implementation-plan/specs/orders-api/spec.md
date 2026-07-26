## ADDED Requirements

### Requirement: Orders API (create)
The system SHALL expose `app/api/orders/route.ts` with a POST endpoint that validates incoming order payloads (name, phone, items, total) and appends the order with a timestamp to `data/orders.json`.

#### Scenario: Create order
- **WHEN** POST with valid order payload
- **THEN** the order is appended to `data/orders.json` and the API returns success with order id and timestamp
