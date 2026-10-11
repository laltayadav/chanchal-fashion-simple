## Context

The storefront already has baseline metadata and Open Graph support, but it lacks several high-impact discoverability and trust primitives: crawl/index endpoints, structured data, and explicit trust content pages. The business model is lightweight (catalog + WhatsApp order), so improvements should stay simple, low-risk, and infrastructure-light.

## Goals / Non-Goals

**Goals:**
- Improve Google crawlability/indexability with minimum robust changes.
- Improve search understanding using structured data baseline.
- Improve customer confidence via visible trust content and messaging.
- Keep implementation low-risk, with no backend contract changes.
- Preserve every existing product/order/admin CRUD operation, public/admin/API route, and navigation destination.
- Make SEO/trust additions additive, testable, and reversible.

**Non-Goals:**
- Rebuilding checkout or adding payment gateway trust systems.
- Large SEO content program, blog, or multi-language expansion.
- Dependence on third-party SEO plugins or paid tooling.
- Changing or removing existing routes/navigation, or modifying product/order/config/auth/upload CRUD.
- Product detail pages and Product rich-result markup in this baseline; decide separately because the current catalog has no individual product routes.
- Contact form submission/rate-limiting and global CSP/security-header rollout; these are separate security work with distinct integration risks.
- Publishing unverified business claims, service areas, contact details, return windows, or ratings.

## Decisions

1. **Use Next.js native SEO route conventions**
- Decision: implement sitemap and robots through Next.js app routes/metadata APIs.
- Rationale: built-in, maintainable, and avoids custom server logic.
- Alternative: static file-only approach. Rejected because dynamic product URL inclusion is easier via route generation.

2. **Prioritize truthful foundational JSON-LD**
- Decision: add Organization and WebSite JSON-LD using only verified business information. Defer Product rich-result JSON-LD until individual product pages exist; do not fabricate AggregateRating.
- Rationale: schema must represent visible, accurate page content. The current shop is a listing route, not a product detail page.
- Alternative: emit Product/Offer markup for every listing card. Rejected for this baseline because it can describe a listing as if it were a dedicated product landing page and increases validation risk.

3. **Stage trust content until the owner confirms the facts**
- Decision: record pending contact/help, shipping, cancellation, returns/exchange, refunds, privacy, and terms inputs in this change's artifacts only. Do not add app routes, visible placeholders, links, or trust claims until the relevant facts are owner-approved.
- Rationale: the owner has not supplied the business policies yet; unpublished placeholders make the missing inputs actionable without misleading customers or exposing incomplete pages.
- Alternative: publish placeholder or generic policy pages. Rejected because customers could interpret them as actual business commitments.

4. **Use existing visual language for trust messaging**
- Decision: small trust strip and order-journey hints use current Tailwind styles and spacing.
- Rationale: no visual churn, faster rollout.
- Alternative: new trust badge component library. Rejected as unnecessary scope.

5. **Protect existing CRUD and navigation as release gates**
- Decision: leave existing route paths and link destinations unchanged; add trust links only in an additive footer area. Do not modify admin navigation or CRUD APIs for this SEO baseline.
- Rationale: search foundations should not risk established customer purchase or admin-management flows.
- Verification: run product and order CRUD tests, check settings/config saves, assert route/link destinations, smoke-test key pages and APIs, and build before release. Any failure blocks rollout.

6. **Require owner-confirmed business content**
- Decision: legal, contact, shipping, cancellation, return, exchange, refund, and trust messaging use only owner-confirmed facts. Pending placeholders exist only in OpenSpec artifacts and are never runtime or public content.
- Rationale: inaccurate policies harm customer trust and can create avoidable business risk.
- Verification: content sign-off is a prerequisite to creating/publishing each relevant policy page or trust cue; confirm pending placeholders do not appear in app routes, metadata, structured data, sitemap, or storefront UI.

Pending owner-input placeholders (documentation only; each value remains `[PENDING OWNER INPUT]`):
- Contact/help: public contact channel and details, support availability, response expectations, and service area.
- Shipping: destination coverage, charges, delivery estimates, and order dispatch process.
- Cancellation: eligibility, timing, and how a customer requests cancellation.
- Returns/exchange: eligibility, time window, item condition, process, and shipping responsibility.
- Refunds: eligibility, method, and processing timeframe.
- Privacy: customer information collected, purposes, storage/retention, sharing, and customer contact process.
- Terms: order confirmation, pricing/payment, availability, delivery, cancellations, and dispute handling.

7. **Keep Search Console operations owner-controlled**
- Decision: support an environment-configured verification token and document sitemap submission; do not require repository access to a Google account.
- Rationale: credentials remain private and the owner retains account control.

## Risks / Trade-offs

- [Risk] Incorrect structured data can reduce rich result eligibility -> Mitigation: validate JSON-LD with Google Rich Results Test before release.
- [Risk] Placeholder or generic policy pages could be mistaken for real business commitments -> Mitigation: keep placeholders in OpenSpec artifacts only and gate app pages/links on owner approval.
- [Risk] Sitemaps including non-canonical/admin paths can hurt crawl quality -> Mitigation: include only public canonical routes and exclude admin/auth paths in robots.
- [Trade-off] Minimal baseline may not produce immediate ranking uplift -> Mitigation: pair with Search Console monitoring and iterative content expansion later.
- [Risk] SEO changes could accidentally disrupt existing CRUD/navigation -> Mitigation: make compatibility checks release-blocking; preserve route paths, link targets, and API contracts.
- [Risk] Incorrect legal/business details could mislead customers -> Mitigation: gate publication on owner confirmation; do not invent missing terms.

## Migration Plan

1. Record the existing route, navigation, API, and CRUD behavior as the baseline; run existing tests before changes.
2. Add robots/sitemap and metadata coverage for public canonical routes without changing current routes or link destinations.
3. Add Organization/WebSite JSON-LD using verified content only. Defer Product rich-result markup until product detail routes are separately approved.
4. Keep trust inputs as non-public placeholders until the owner approves them. Only then add the approved trust pages and additive footer links; do not introduce or alter order/contact submission behavior.
5. Add Search Console verification support without committing tokens; owner submits the sitemap after deployment.
6. Run full tests, production build, route/API smoke tests, and explicit product/order/admin CRUD and navigation regression checks. Block release on any failure.
7. Validate robots, sitemap, canonical, and JSON-LD output after deployment and monitor Search Console.

Rollback strategy:
- Revert SEO/trust UI and metadata additions if regressions occur; no data migrations required.

## Open Questions

- What verified business address/service area, contact channel, and response expectations may be published?
- What are the actual shipping, cancellation, return/exchange, and refund rules? Do not publish policy pages until confirmed.
- Should product detail routes and Product rich-result markup be a separate follow-up?
