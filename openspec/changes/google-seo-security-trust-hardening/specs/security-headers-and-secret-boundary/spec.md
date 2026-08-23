## ADDED Requirements

### Requirement: Security header baseline
The system SHALL attach HTTP security headers on storefront responses including Content-Security-Policy, Strict-Transport-Security, X-Frame-Options, and X-Content-Type-Options.

#### Scenario: Public page response includes required headers
- **WHEN** a client requests a public storefront page
- **THEN** the response contains the required security header set

### Requirement: HTTPS-only external dependencies
The system SHALL load external scripts, fonts, and integration endpoints only over HTTPS and SHALL block mixed-content references.

#### Scenario: External resource URLs are secure
- **WHEN** the page includes external dependencies
- **THEN** each external URL uses the HTTPS scheme

### Requirement: Client bundle secret exclusion
The system SHALL prevent sensitive server credentials, API keys, and secret tokens from being exposed to client-side bundles or public runtime objects.

#### Scenario: Secret-bearing modules remain server-only
- **WHEN** the client bundle is built for storefront pages
- **THEN** secret-bearing server modules are not imported into client components
