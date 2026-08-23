## Context

The store runs on Next.js App Router with product/catalog UX, admin APIs, and JSON-backed data files. Current requirements emphasize reliability and UX, but SEO indexing coverage, structured data quality, legal trust surface, and security header posture need explicit hardening for production growth. The change spans `app/`, `components/`, `api/`, and deployment/runtime config, which makes it cross-cutting and sensitive to regressions in crawling and checkout trust.

## Goals / Non-Goals

**Goals:**
- Provide a deterministic SEO baseline for Google crawling via dynamic `sitemap.xml` and robust `robots.txt` generation.
- Standardize metadata (title, description, canonical, Open Graph) for home, product, category-like, and legal pages.
- Add schema.org JSON-LD for product commerce entities and organization identity to improve rich result eligibility.
- Improve trust signals through footer-linked legal pages and secure contact handling.
- Enforce strict security headers and secret-boundary checks to reduce common web exploitation risks.

**Non-Goals:**
- Full international SEO rollout (`hreflang`, region/language segmentation).
- Payment gateway re-architecture or PCI compliance automation.
- Replacing the existing data storage model (`data/*.json`) in this phase.
- Building a full anti-abuse platform; only pragmatic spam/XSS controls are in scope.

## Decisions

1. Use Next.js metadata route handlers for indexing assets.
- Decision: Implement `app/sitemap.ts` and `app/robots.ts` as source-of-truth generators.
- Rationale: Keeps indexing assets versioned with application routes and product data; avoids stale static files.
- Alternative considered: static files in `public/`. Rejected because product URLs and updates are dynamic.

2. Centralize metadata composition in server-safe helpers.
- Decision: Add reusable helper(s) in `lib/` for canonical URL construction and metadata defaults consumed by route `generateMetadata`.
- Rationale: Prevents drift in title/description/OG formatting and simplifies testing.
- Alternative considered: per-page ad hoc metadata objects. Rejected due to duplication and inconsistency risk.

3. Generate JSON-LD server-side in page templates.
- Decision: Build typed JSON-LD objects in server components for `Product`, `Offer`, `AggregateRating`, and layout-level `Organization` script blocks.
- Rationale: Ensures crawl-visible markup at first render and preserves type-safe data mapping.
- Alternative considered: client-side injection after hydration. Rejected because crawler execution variability can reduce reliability.

4. Treat legal/trust pages as first-class static routes.
- Decision: Implement route pages under `app/` and expose through a persistent footer/nav component.
- Rationale: Improves crawl depth, user trust, and policy discoverability without backend complexity.
- Alternative considered: single generic CMS-like policy page. Rejected due to weaker IA and less explicit trust signaling.

5. Harden contact input through server-side schema validation + sanitization.
- Decision: Validate payloads in API route handlers (schema-based), normalize/trim strings, strip dangerous markup, and reject invalid inputs with safe errors.
- Rationale: Prevents client-bypass of validation and limits XSS/spam attack surface.
- Alternative considered: client-only form validation. Rejected as insufficient for security.

6. Apply defense-in-depth HTTP headers at app edge/runtime.
- Decision: Configure CSP, HSTS, X-Frame-Options, X-Content-Type-Options (and complementary policies) via `next.config.js` headers or middleware strategy compatible with deployment.
- Rationale: Provides broad mitigation against XSS, clickjacking, MIME confusion, and downgrade attacks.
- Alternative considered: relying only on hosting defaults. Rejected due to inconsistent platform defaults and weak explicit guarantees.

7. Enforce secret-boundary hygiene in code organization.
- Decision: Keep secret-bearing values server-only and audit import paths so client components never import secret-dependent modules.
- Rationale: Prevents accidental exposure through bundle leakage.
- Alternative considered: relying on developer convention only. Rejected due to regression risk without explicit checks.

## Risks / Trade-offs

- [Overly strict CSP may break third-party integrations] -> Start with reportable allowlist, validate critical flows (analytics/payment), then tighten incrementally.
- [Metadata generation can increase maintenance overhead] -> Encapsulate in shared helper APIs and route-level tests.
- [Schema data quality issues may create invalid rich result markup] -> Add validation tests for required JSON-LD fields and fallbacks.
- [HSTS can lock HTTPS behavior for long periods] -> Roll out with safe max-age progression and confirm domain/TLS stability first.
- [Policy pages may become stale if not maintained] -> Document ownership and include checklist in content update SOP.

## Migration Plan

1. Add helper utilities for canonical/metadata and JSON-LD generation behind non-breaking defaults.
2. Implement indexing assets (`sitemap.ts`, `robots.ts`) and validate generated URLs.
3. Add metadata and JSON-LD integration on key page templates.
4. Add legal/contact routes and footer links without removing existing navigation.
5. Harden contact API validation/sanitization and add tests for invalid/malicious payloads.
6. Apply security headers in staging, test all external resources and key user journeys.
7. Deploy progressively; monitor search console, header compliance scans, and runtime errors.
8. Rollback strategy: revert header policy/metadata modules and disable strict policies if critical path regressions occur.

## Open Questions

- Which exact canonical host should be authoritative in all environments (`https://chanchalfashion.com` vs `www` variant)?
- Is there a verified business rating source to support `AggregateRating` without policy risk?
- Which third-party origins are required for CSP allowlists (analytics, payment, CDN, fonts)?
- Should `noindex` be explicitly applied to admin and internal utility routes in metadata and robots policy?
