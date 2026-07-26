## ADDED Requirements

### Requirement: Password-gated Admin UI
The system SHALL provide a server-side password gate for `/admin` that compares a submitted password against `process.env.ADMIN_PASSWORD`. The UI SHALL provide settings (shop name, WhatsApp number, admin password), add/edit product form (Type first), product list (edit/delete), and orders list with New/Fulfilled toggle.

#### Scenario: Admin password gate
- **WHEN** a user attempts to access `/admin` and is not authenticated
- **THEN** they are shown a password input and only allowed into admin pages if the password matches `process.env.ADMIN_PASSWORD`
