## Why

The storefront has a good visual baseline but lacks key crawl/index and trust signals that strongly affect Google discoverability and customer confidence before placing an order. A focused baseline upgrade can improve search visibility and conversion trust without major product or infrastructure changes.

## What Changes

- Add crawl and indexing essentials: `robots.txt`, `sitemap.xml`, canonical coverage validation, and Search Console verification support.
- Add structured data baseline (Organization, Website, and Product listing-level schema) to improve search understanding.
- Add customer trust content baseline: contact/help, shipping policy, returns/exchange policy, privacy policy, terms page.
- Add lightweight storefront trust strip and order-journey messaging using existing design language.
- Add operational checklist for Google Search Console submission and post-release indexing verification.

## Capabilities

### New Capabilities
- `seo-indexing-baseline`: Crawlability and indexability foundations including robots, sitemap, and search verification support.
- `structured-data-baseline`: JSON-LD implementation for Organization/Website/Product discovery context.
- `trust-content-baseline`: Customer-facing policy/contact/trust messaging that improves confidence and legitimacy.

### Modified Capabilities
- None.

## Impact

- Affected app metadata and routing: root metadata handling, new sitemap/robots routes/files, optional verification tags.
- Affected storefront UI: small trust messaging additions near shop/cart flows.
- Affected docs/ops: Search Console verification and URL submission checklist.
- No payment, catalog, or order API contract changes expected.
- No new external runtime dependencies expected.
