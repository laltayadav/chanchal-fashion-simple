## Why

The storefront needs stronger technical SEO and trust posture to improve Google discoverability, indexing quality, and buyer confidence for an e-commerce journey. At the same time, security controls must be tightened to reduce XSS, clickjacking, mixed-content, and secret-exposure risks before growth traffic increases.

## What Changes

- Add production-grade indexing assets with dynamic `sitemap.xml` generation and a robust `robots.txt` policy for product and core pages.
- Implement metadata hardening for key routes: canonical URLs, dynamic title/description, and Open Graph tags for home, product, category-style listing, and static pages.
- Add schema.org JSON-LD support for commerce entities on product pages (`Product`, `Offer`, `AggregateRating`) and site-level organization identity (`Organization`).
- Ensure all product and marketing images expose meaningful dynamic `alt` text and avoid empty/low-quality alternatives.
- Add footer navigation and route structure for critical legal/trust pages: Return/Refund Policy, Shipping Policy, Privacy Policy, Terms of Service, and Contact Us.
- Add/upgrade server-side form validation and sanitization for contact flows to reduce spam and prevent reflected/stored XSS vectors.
- Introduce strict HTTP response security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options) and enforce HTTPS-only external resource loading.
- Audit runtime boundaries so secrets and sensitive credentials remain server-only and are never exposed in client bundles.

## Capabilities

### New Capabilities
- `seo-indexing-foundation`: Dynamic sitemap/robots generation plus route-level metadata and canonicalization for indexable storefront pages.
- `structured-data-commerce`: JSON-LD generation for product commerce entities and organization identity to improve rich-result eligibility.
- `trust-and-legal-surface`: Accessible legal/contact pages and footer linkage to improve trust and compliance signals.
- `security-headers-and-secret-boundary`: Enforced HTTP security headers, HTTPS external dependency hygiene, and server/client secret boundary validation.
- `secure-contact-input-handling`: Contact form server-side validation, sanitization, and anti-spam guardrails.

### Modified Capabilities
- None.

## Impact

- Affected app routes and metadata configuration in `app/` (layout/page metadata, sitemap/robots routes, legal pages, contact flows).
- Affected UI components in `components/` for footer and image `alt` handling.
- Affected API endpoints in `api/` for form handling and sanitization.
- Affected runtime/server config (`next.config.js`, middleware or route handlers, deployment headers strategy) for security headers and HTTPS policy.
- Potential dependency additions for sanitization/validation and schema generation utilities.