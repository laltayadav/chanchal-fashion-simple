## Context

The storefront already has baseline metadata and Open Graph support, but it lacks several high-impact discoverability and trust primitives: crawl/index endpoints, structured data, and explicit trust content pages. The business model is lightweight (catalog + WhatsApp order), so improvements should stay simple, low-risk, and infrastructure-light.

## Goals / Non-Goals

**Goals:**
- Improve Google crawlability/indexability with minimum robust changes.
- Improve search understanding using structured data baseline.
- Improve customer confidence via visible trust content and messaging.
- Keep implementation low-risk, with no backend contract changes.

**Non-Goals:**
- Rebuilding checkout or adding payment gateway trust systems.
- Large SEO content program, blog, or multi-language expansion.
- Dependence on third-party SEO plugins or paid tooling.

## Decisions

1. **Use Next.js native SEO route conventions**
- Decision: implement sitemap and robots through Next.js app routes/metadata APIs.
- Rationale: built-in, maintainable, and avoids custom server logic.
- Alternative: static file-only approach. Rejected because dynamic product URL inclusion is easier via route generation.

2. **Prioritize foundational JSON-LD first**
- Decision: add Organization and WebSite JSON-LD globally, then Product-related JSON-LD for listing data.
- Rationale: highest impact for understanding brand/site with modest complexity.
- Alternative: broad schema rollout (FAQ, Breadcrumb, Review) in one pass. Rejected due to risk of invalid/partial markup.

3. **Ship trust pages with concise, truthful baseline content**
- Decision: add Contact/Help, Shipping, Returns/Exchange, Privacy, Terms pages with clear practical details.
- Rationale: trust improves when expectations are explicit; simple pages are enough to start.
- Alternative: wait for legal perfection before publishing. Rejected because absence of trust pages is worse for users and search quality.

4. **Use existing visual language for trust messaging**
- Decision: small trust strip and order-journey hints use current Tailwind styles and spacing.
- Rationale: no visual churn, faster rollout.
- Alternative: new trust badge component library. Rejected as unnecessary scope.

## Risks / Trade-offs

- [Risk] Incorrect structured data can reduce rich result eligibility -> Mitigation: validate JSON-LD with Google Rich Results Test before release.
- [Risk] Policy pages with vague claims can reduce trust -> Mitigation: keep content specific and aligned with real operations.
- [Risk] Sitemaps including non-canonical/admin paths can hurt crawl quality -> Mitigation: include only public canonical routes and exclude admin/auth paths in robots.
- [Trade-off] Minimal baseline may not produce immediate ranking uplift -> Mitigation: pair with Search Console monitoring and iterative content expansion later.

## Migration Plan

1. Add sitemap and robots generation for public routes only.
2. Add global Organization/WebSite JSON-LD and page-level Product context where applicable.
3. Add trust pages and link them from visible footer/trust sections.
4. Add Search Console verification config support and submit sitemap.
5. Validate crawl and rich result health after deploy; iterate on warnings.

Rollback strategy:
- Revert SEO/trust UI and metadata additions if regressions occur; no data migrations required.

## Open Questions

- Which city/region/service area should be explicitly declared in trust pages and structured data?
- Do we want a customer-facing returns window commitment (for example, 3 or 7 days) now?
- Should product detail routes be introduced now for stronger search landing pages, or keep list-only indexing baseline first?
