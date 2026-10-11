## Why

The storefront has a good visual baseline but lacks key crawl/index and trust signals that help Google understand public pages and customers understand the business before ordering. A focused, additive baseline can improve discoverability without changing existing shopping, admin, or data-management behavior.

## What Changes

- Add crawl and indexing essentials: `robots.txt`, `sitemap.xml`, canonical coverage validation, and Search Console verification support.
- Add truthful Organization and WebSite structured data. Defer Product rich-result markup until indexable product detail URLs exist.
- Track pending owner-input fields for contact/help, shipping, cancellation, returns/exchange, refunds, privacy, and terms in change artifacts only.
- Add public trust pages, footer links, and lightweight storefront trust messaging only after the corresponding factual content is owner-approved.
- Add operational checklist for Google Search Console submission and post-release indexing verification.
- Preserve all existing product/order/admin CRUD operations, API contracts, routes, and navigation behavior as a release-blocking compatibility requirement.
- Keep the work additive and staged; require test, build, CRUD, and navigation checks before release.

## Scope Boundaries

- Do not rename, remove, or repurpose existing public, admin, or API routes or change existing navigation destinations.
- Do not change product, order, configuration, authentication, or upload CRUD behavior or schemas for SEO.
- Do not add product detail pages, contact-form submission endpoints, anti-spam behavior, security-header policy, or ratings in this baseline; propose those separately when requirements and data are confirmed.
- Publish only verified business identity, contact, shipping, and return information. Missing facts must be confirmed with the owner rather than invented.
- Keep pending placeholders out of application code, runtime content, public routes, metadata, structured data, visible storefront UI, and sitemap. Do not publish empty or placeholder trust pages.
- Google Search Console account access and sitemap submission remain an owner-operated deployment step; tokens must not be committed.

## Release Gate

The change is not release-ready unless the existing product and order CRUD tests pass, admin settings/configuration still load and save, existing routes and navigation destinations remain unchanged, and the production build succeeds. Additive SEO/trust routes and metadata must not interfere with these flows.

## Capabilities

### New Capabilities
- `seo-indexing-baseline`: Crawlability and indexability foundations including robots, sitemap, and search verification support.
- `structured-data-baseline`: JSON-LD implementation for truthful Organization and WebSite identity; Product rich-result markup is deferred until product detail routes exist.
- `trust-content-baseline`: Customer-facing policy/contact/trust messaging that improves confidence and legitimacy.

### Modified Capabilities
- None.

## Impact

- Affected app metadata and routing: root metadata handling, new sitemap/robots routes/files, optional verification tags.
- Affected storefront UI: additive footer links and small trust messaging that preserve current navigation destinations and order flows.
- Affected docs/ops: Search Console verification and URL submission checklist.
- No product/order/admin CRUD, API contract, data schema, or existing route changes expected.
- No new external runtime dependencies expected.
