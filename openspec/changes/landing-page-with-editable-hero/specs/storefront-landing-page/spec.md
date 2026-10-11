## ADDED Requirements

### Requirement: Home route introduces the shop
The storefront SHALL render a lightweight brand landing page at `/` and SHALL make the existing product-browsing experience available at `/shop` without changing its shopping and ordering behavior.

#### Scenario: Visitor opens the home route
- **WHEN** a visitor navigates to `/`
- **THEN** the page presents the brand landing experience and a prominent link to `/shop`

#### Scenario: Visitor opens the catalog route
- **WHEN** a visitor navigates to `/shop`
- **THEN** the existing product catalog, filters, product cards, and cart experience are available

#### Scenario: Visitor follows storefront shop navigation
- **WHEN** a visitor activates the Shop navigation link or the landing-page call to action
- **THEN** the visitor is taken to `/shop`

### Requirement: Landing page uses a fixed, lightweight template
The landing page SHALL use up to five ordered responsive hero images when configured, a required master headline and supporting text, and a fixed call to action targeting `/shop`. Each slide MAY override its headline and supporting text independently; a missing or blank override SHALL inherit that field from the master slide. When multiple images are configured, the page SHALL advance slowly and provide clickable circular indicators without exposing layout or destination editing.

#### Scenario: Multiple landing images are configured
- **WHEN** the landing page has multiple configured hero images
- **THEN** it displays them in the configured order, advances every six seconds, and provides clickable indicators for direct selection alongside the fixed `/shop` call to action

#### Scenario: Slide copy overrides master copy
- **WHEN** a slide has a nonblank title or description override
- **THEN** that slide displays the provided field and uses the master value for any field without an override

#### Scenario: Slide copy is blank or omitted
- **WHEN** a slide title or description is blank or omitted
- **THEN** the slide inherits that field independently from the master slide

#### Scenario: One landing image is configured
- **WHEN** the landing page has exactly one configured hero image
- **THEN** it displays the image without automatic rotation or slide indicators

#### Scenario: Visitor prefers reduced motion
- **WHEN** the visitor has enabled the reduced-motion preference
- **THEN** the landing page does not automatically rotate hero images

#### Scenario: Landing image is not configured
- **WHEN** no hero image has been configured
- **THEN** the page displays a deliberate branded visual fallback without a broken image or empty image frame, while keeping the headline and `/shop` call to action visible

#### Scenario: Optional copy is not configured
- **WHEN** the headline or supporting text is unset or blank
- **THEN** the page uses readable default copy rather than displaying empty text

### Requirement: Landing route metadata identifies the home page
The home and catalog routes SHALL expose appropriate page titles and descriptions, and SHALL use canonical URLs consistent with their distinct `/` and `/shop` routes.

#### Scenario: Search metadata is generated for both routes
- **WHEN** a crawler or browser requests metadata for `/` or `/shop`
- **THEN** each route has an appropriate title, description, and canonical URL for that route
