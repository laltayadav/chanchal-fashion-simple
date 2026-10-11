## ADDED Requirements

### Requirement: Admin can update limited homepage content
The admin settings experience SHALL allow an authenticated administrator to manage up to five ordered landing-page hero images, set the required master headline and supporting text, and optionally override either text field on later slides, while keeping the template and call-to-action destination fixed.

#### Scenario: Authenticated admin saves homepage content
- **WHEN** an authenticated administrator saves up to five ordered hero images, required master copy, and optional per-slide copy
- **THEN** the values are validated and persisted using the existing runtime configuration and upload-storage patterns

#### Scenario: Admin changes hero image order
- **WHEN** an authenticated administrator moves, removes, or adds a hero image and saves homepage content
- **THEN** the landing page uses the saved image order and keeps each slide's optional copy associated with its image

#### Scenario: Admin omits copy for a later slide
- **WHEN** an authenticated administrator leaves a later slide's title or description override blank
- **THEN** that slide inherits the corresponding required master field independently

#### Scenario: Unauthenticated user attempts to update homepage content
- **WHEN** a request without valid admin authorization attempts to change homepage settings
- **THEN** the update is rejected and no homepage configuration is changed

#### Scenario: Admin does not configure a custom link
- **WHEN** homepage content is saved
- **THEN** the call-to-action destination remains the fixed internal `/shop` route

### Requirement: Existing runtime configuration remains compatible
The system SHALL read existing production configuration that lacks homepage fields and SHALL provide safe landing-page defaults without requiring a migration or reset.

#### Scenario: Existing configuration has no homepage fields
- **WHEN** the application reads a valid pre-existing runtime configuration
- **THEN** the application continues to serve the storefront using default homepage content and does not fail because new fields are absent

#### Scenario: Homepage configuration is publicly read
- **WHEN** a public storefront route requests configuration needed to render the landing page
- **THEN** only public homepage content is returned and admin secrets remain excluded
