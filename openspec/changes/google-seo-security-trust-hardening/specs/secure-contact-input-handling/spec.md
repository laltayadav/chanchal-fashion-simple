## ADDED Requirements

### Requirement: Server-side contact validation
The system SHALL validate all contact form submissions on the server against a defined input schema and reject malformed payloads.

#### Scenario: Invalid payload is rejected
- **WHEN** a submission has missing required fields or invalid formats
- **THEN** the server responds with a validation error and does not process the message

### Requirement: Input sanitization and normalization
The system SHALL sanitize and normalize contact input fields to reduce XSS and injection risk before storage or forwarding.

#### Scenario: Script-like input is neutralized
- **WHEN** a submission includes HTML or script-like content
- **THEN** unsafe markup is removed or neutralized before downstream handling

### Requirement: Anti-spam guardrails
The system SHALL enforce at least one server-verifiable anti-spam guardrail for contact submissions.

#### Scenario: Bot-like rapid submissions are throttled
- **WHEN** repeated submissions exceed configured thresholds
- **THEN** the server blocks or rate-limits further submissions for the threshold window
