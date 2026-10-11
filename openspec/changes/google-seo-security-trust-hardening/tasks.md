# On hold — consolidation notice

Do not execute these tasks in parallel with `seo-and-customer-trust-baseline`. SEO/trust work is tracked in that focused change. Security headers and contact-input hardening are deferred and must be proposed separately with their own integration and regression plan.

## 1. SEO Indexing Foundation

- [ ] 1.1 Add `app/sitemap.ts` to generate canonical product, home, and legal URLs from existing data sources.
- [ ] 1.2 Add `app/robots.ts` with allow/disallow rules (public crawl allowed, admin/internal routes disallowed) and sitemap reference.
- [ ] 1.3 Implement shared metadata helpers in `lib/` for canonical URL, dynamic title/description, and Open Graph defaults.
- [ ] 1.4 Integrate `generateMetadata` for main storefront routes (home, product detail, listing/category-style, legal pages).
- [ ] 1.5 Update product and listing image rendering to always output meaningful dynamic `alt` text.
- [ ] 1.6 Add tests for sitemap URL set, robots policy output, and metadata field presence on key routes.

## 2. Structured Data Commerce

- [ ] 2.1 Create typed JSON-LD builders for `Product` and nested `Offer` using product/domain data.
- [ ] 2.2 Add conditional `AggregateRating` support with omission fallback when trusted rating data is unavailable.
- [ ] 2.3 Inject product JSON-LD into product detail page templates in server-rendered output.
- [ ] 2.4 Inject site-level `Organization` JSON-LD in the global layout.
- [ ] 2.5 Add tests/assertions to verify valid JSON-LD structure and required fields.

## 3. Trust and Legal Surface

- [ ] 3.1 Create public routes/pages for Return/Refund, Shipping, Privacy, Terms, and Contact Us.
- [ ] 3.2 Add accessible footer links to all required trust/legal pages across storefront layouts.
- [ ] 3.3 Add clear contact details and support-response expectations on Contact Us page.
- [ ] 3.4 Add route tests to verify legal pages are reachable and return successful responses.

## 4. Contact Security and Input Hygiene

- [ ] 4.1 Implement server-side schema validation for contact form payloads in API handlers.
- [ ] 4.2 Add sanitization/normalization (trim, encode/remove unsafe markup) before storage/forwarding.
- [ ] 4.3 Add anti-spam controls (e.g., simple rate limiting and/or honeypot validation) enforced server-side.
- [ ] 4.4 Add negative tests for malformed payloads, script injection attempts, and spam-threshold behavior.

## 5. Security Headers and Secret Boundary

- [ ] 5.1 Configure strict HTTP response headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options) in runtime/server config.
- [ ] 5.2 Audit and update all external resource URLs to HTTPS-only references.
- [ ] 5.3 Verify server/client module boundaries so secret-bearing modules are never imported by client components.
- [ ] 5.4 Add automated checks/tests for required security headers and mixed-content regressions.

## 6. Verification and Rollout

- [ ] 6.1 Run full test suite and targeted SEO/security tests; resolve regressions.
- [ ] 6.2 Validate generated metadata/schema output using representative product and legal routes.
- [ ] 6.3 Perform staging smoke checks for CSP-compatible third-party integrations and critical user flows.
- [ ] 6.4 Prepare deployment checklist and rollback notes for header policy and metadata changes.