## ADDED Requirements

### Requirement: Hide admin password from public config
The system SHALL exclude the admin password from the public `GET /api/config` response.

#### Scenario: Public config fetch
- **WHEN** a non-admin client requests `/api/config`
- **THEN** the response includes only shop name and WhatsApp data and does not include `adminPassword`

### Requirement: Admin authentication gate
The system SHALL require admin authentication before rendering admin-specific product or order management UI.

#### Scenario: Unauthorized admin access
- **WHEN** a user visits `/admin` without logging in
- **THEN** the page shows a login prompt and does not display admin product or order data

#### Scenario: Successful admin login
- **WHEN** an admin enters the correct password
- **THEN** the page unlocks and displays admin settings, products, and orders
