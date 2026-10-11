## ADDED Requirements

### Requirement: Global brand structured data
The system SHALL include valid Organization and WebSite structured data on public storefront pages using only owner-verified facts that are consistent with visible site content.

#### Scenario: Organization and website schema present
- **WHEN** a public storefront page is rendered
- **THEN** machine-readable Organization and WebSite JSON-LD blocks are present and valid

### Requirement: Product rich-result markup is deferred until product pages exist
The system SHALL NOT describe catalog-listing cards as dedicated Product rich-result landing pages in this baseline. Product/Offer markup MAY be added in a separate change after indexable product detail routes and valid product data are available.

#### Scenario: Catalog listing is rendered
- **WHEN** product cards are rendered on the shop listing
- **THEN** the site does not emit misleading Product rich-result markup for those cards

#### Scenario: No trusted rating source exists
- **WHEN** the site has no verified customer rating data
- **THEN** structured data omits AggregateRating and review claims
