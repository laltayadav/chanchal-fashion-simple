## ADDED Requirements

### Requirement: Admin credential storage SHALL be non-plaintext
The system SHALL store admin credentials using a secure one-way password hash and SHALL NOT persist plaintext admin passwords in configuration data.

#### Scenario: Persist updated admin credential
- **WHEN** an authenticated admin submits a new admin password through the security update flow
- **THEN** the system stores only a hashed representation of the password with required verification metadata
- **AND** the persisted data does not include the plaintext password value

### Requirement: Admin authentication SHALL verify hashed credentials
The system SHALL authenticate admin login attempts by verifying submitted passwords against stored hashed credentials.

#### Scenario: Successful login with valid password
- **WHEN** a login request provides the correct admin password
- **THEN** the system verifies the hash match and grants admin session access

#### Scenario: Failed login with invalid password
- **WHEN** a login request provides an incorrect admin password
- **THEN** the system rejects authentication and preserves lockout protections

### Requirement: Config updates SHALL be schema-validated and allowlisted
The system SHALL validate config update payloads against a defined schema and SHALL only accept explicitly allowlisted fields.

#### Scenario: Reject non-allowlisted config field
- **WHEN** an authenticated admin submits a config update payload containing unknown or non-allowlisted fields
- **THEN** the system rejects the request with a validation error and does not persist the payload

#### Scenario: Accept valid shop profile fields
- **WHEN** an authenticated admin submits a config update payload containing only valid shop profile fields
- **THEN** the system validates and persists only those allowlisted fields
