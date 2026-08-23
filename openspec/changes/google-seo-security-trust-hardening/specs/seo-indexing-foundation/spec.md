## ADDED Requirements

### Requirement: Dynamic sitemap generation
The system SHALL expose a dynamic XML sitemap endpoint that includes all canonical, indexable storefront URLs including home, product detail pages, and legal/trust pages.

#### Scenario: Sitemap request returns canonical URLs
- **WHEN** a crawler requests the sitemap endpoint
- **THEN** the response includes only HTTPS canonical URLs for indexable pages

### Requirement: Robots policy for controlled crawling
The system SHALL expose a robots policy that allows crawling of public storefront routes, disallows sensitive/internal routes, and references the canonical sitemap URL.

#### Scenario: Robots response includes allow/disallow and sitemap
- **WHEN** a crawler requests the robots endpoint
- **THEN** the response includes route rules and a sitemap reference for discovery

### Requirement: Route metadata completeness
The system SHALL provide dynamic, route-aware metadata including title, meta description, canonical URL, and Open Graph fields for home, product, listing/category-style, and legal pages.

#### Scenario: Product route emits dynamic metadata
- **WHEN** a product detail route is rendered
- **THEN** metadata fields are populated from product and site context without empty title/description

### Requirement: Image alt text quality
The system SHALL provide meaningful dynamic alt text for user-visible product and catalog images using product context.

#### Scenario: Product card image has descriptive alt
- **WHEN** a product image is rendered in a listing or detail view
- **THEN** the image alt text describes the product and avoids blank or placeholder values
