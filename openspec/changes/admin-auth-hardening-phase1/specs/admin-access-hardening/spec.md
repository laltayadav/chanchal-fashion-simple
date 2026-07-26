## ADDED Requirements

### Requirement: Admin session is issued after password verification
The system SHALL require a valid admin password before granting access to admin pages and SHALL issue a server-validated admin session after successful authentication.

#### Scenario: Successful password login
- **WHEN** a user submits the correct admin password on the admin gate
- **THEN** the system SHALL create a valid admin session and allow access to admin pages until the session expires

#### Scenario: Incorrect password
- **WHEN** a user submits an incorrect admin password
- **THEN** the system SHALL deny access and SHALL not create an admin session

### Requirement: Trusted device can restore admin access
The system SHALL support an opt-in trusted-device mechanism that restores admin access on the same browser/device without re-entering the password until the trusted-device token expires or is revoked.

#### Scenario: Trusted device opt-in
- **WHEN** an admin successfully logs in and chooses to trust the device
- **THEN** the system SHALL store a trusted-device token that can restore a valid admin session on future visits

#### Scenario: Trusted device restoration
- **WHEN** a returning browser presents a valid trusted-device token
- **THEN** the system SHALL restore admin access without showing the password gate

### Requirement: Admin session expires after inactivity or timeout
The system SHALL expire the admin session after a configurable timeout and SHALL require re-authentication after expiration.

#### Scenario: Session expires
- **WHEN** the admin session lifetime has elapsed
- **THEN** the system SHALL revoke the session and require the password gate again

#### Scenario: Session remains active before timeout
- **WHEN** the session is still within its allowed lifetime
- **THEN** the system SHALL continue to allow admin access

### Requirement: Repeated failed logins trigger lockout
The system SHALL temporarily lock the admin gate after a configurable number of failed password attempts within a defined window.

#### Scenario: Lockout threshold reached
- **WHEN** a user exceeds the allowed number of failed password attempts
- **THEN** the system SHALL temporarily lock the admin gate and reject further attempts until the lockout expires

#### Scenario: Lockout expires
- **WHEN** the lockout window has elapsed
- **THEN** the system SHALL allow password attempts again

### Requirement: Admin APIs SHALL enforce authentication
The system SHALL require a valid admin session or trusted-device-restored session before allowing admin-only operations through API routes.

#### Scenario: Unauthorized admin API call
- **WHEN** a client calls an admin-only API route without a valid admin session
- **THEN** the system SHALL reject the request with an unauthorized response

#### Scenario: Authorized admin API call
- **WHEN** a client calls an admin-only API route with a valid admin session
- **THEN** the system SHALL allow the request to proceed
