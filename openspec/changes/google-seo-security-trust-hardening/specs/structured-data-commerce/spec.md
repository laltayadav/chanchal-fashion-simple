## ADDED Requirements

### Requirement: Product JSON-LD on detail pages
The system SHALL embed valid schema.org `Product` JSON-LD on product detail pages with required identifiers and descriptive fields.

#### Scenario: Product page renders Product schema
- **WHEN** a product detail page is requested
- **THEN** the HTML includes a JSON-LD script containing `@type: Product` with product name, image, and description fields

### Requirement: Offer JSON-LD for purchasable products
The system SHALL include schema.org `Offer` data for each purchasable product reflecting currency, price, and availability status.

#### Scenario: In-stock product includes Offer availability
- **WHEN** a purchasable product page is rendered
- **THEN** the JSON-LD includes an `Offer` object with valid price/currency and an in-stock availability value

### Requirement: Aggregate rating governance
The system SHALL include schema.org `AggregateRating` only when a valid rating source exists and SHALL omit fabricated or unverifiable values.

#### Scenario: Missing rating source omits AggregateRating
- **WHEN** no trusted rating data is available for a product
- **THEN** the JSON-LD output excludes `AggregateRating`

### Requirement: Organization identity schema
The system SHALL expose site-level schema.org `Organization` JSON-LD with brand identity and contactable presence fields.

#### Scenario: Global layout includes Organization schema
- **WHEN** the storefront layout is rendered
- **THEN** the page output includes a JSON-LD script containing `@type: Organization` and canonical site identity values
