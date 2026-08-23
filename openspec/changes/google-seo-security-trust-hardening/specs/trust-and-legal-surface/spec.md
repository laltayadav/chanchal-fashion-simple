## ADDED Requirements

### Requirement: Legal policy route coverage
The system SHALL provide dedicated public routes for Return/Refund Policy, Shipping Policy, Privacy Policy, Terms of Service, and Contact Us.

#### Scenario: Legal page routes are reachable
- **WHEN** a user or crawler navigates to each legal path
- **THEN** the server returns a successful response with accessible policy content

### Requirement: Footer trust navigation
The system SHALL display persistent, accessible footer links to all required legal and contact pages on storefront pages.

#### Scenario: Footer contains complete legal links
- **WHEN** a user views a storefront page with footer navigation
- **THEN** all required legal/contact links are present and keyboard accessible

### Requirement: Contact page trust details
The system SHALL present clear contact information and response expectations on the Contact Us page.

#### Scenario: Contact page communicates support expectations
- **WHEN** a user opens the contact route
- **THEN** the page includes contact channel details and a clear support expectation statement
