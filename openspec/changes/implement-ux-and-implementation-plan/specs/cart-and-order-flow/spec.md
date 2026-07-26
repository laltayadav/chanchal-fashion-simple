## ADDED Requirements

### Requirement: Cart state and WhatsApp handoff
The system SHALL implement cart state (React Context or lifted state) with a Cart page and a CartDrawer component. Submitting an order SHALL save it to `orders.json` and then open a `wa.me` link prefilled with the order text.

#### Scenario: Submit order
- **WHEN** user submits order with name and phone
- **THEN** the order is persisted to `data/orders.json` and user is redirected to the `wa.me` link with the order content
