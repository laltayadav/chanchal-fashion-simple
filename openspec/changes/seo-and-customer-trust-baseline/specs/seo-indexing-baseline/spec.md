## ADDED Requirements

### Requirement: Public crawl and index baseline
The system SHALL expose public crawl/index artifacts for search engines, including a valid robots directive and a sitemap that lists only indexable storefront pages.

#### Scenario: Robots excludes non-public areas
- **WHEN** a crawler requests the site's robots configuration
- **THEN** admin and non-public routes are disallowed while public storefront routes are allowed

#### Scenario: Sitemap contains public canonical URLs
- **WHEN** a crawler requests the sitemap
- **THEN** the sitemap returns canonical URLs for public pages and excludes admin-only paths

#### Scenario: SEO routes are additive
- **WHEN** robots, sitemap, metadata, or verification support is introduced
- **THEN** existing storefront, admin, and API route paths and their navigation destinations remain unchanged

#### Scenario: Existing navigation is preserved
- **WHEN** public SEO or trust links are added
- **THEN** existing home, shop, cart, and admin navigation links retain their current destinations and behavior

### Requirement: Search verification readiness
The system SHALL support search engine site verification metadata without requiring code rewrites for each verification cycle.

#### Scenario: Verification token configuration
- **WHEN** a valid verification token is configured in environment settings
- **THEN** the site exposes verification metadata in the expected format for search engine ownership checks
