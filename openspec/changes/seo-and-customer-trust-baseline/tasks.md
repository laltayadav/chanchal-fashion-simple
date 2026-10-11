## 1. Crawl and Index Foundations

- [x] 1.1 Record existing public/admin/API routes, navigation destinations, and CRUD test baseline; do not rename or repurpose them.
- [x] 1.2 Add robots configuration that allows public storefront crawling and excludes admin/private routes without changing access controls.
- [x] 1.3 Add sitemap generation for canonical public URLs only; preserve existing routes and include no admin/API URLs.
- [x] 1.4 Add search engine verification metadata wiring through environment configuration; never commit verification tokens.

## 2. Structured Data Baseline

- [x] 2.1 Add Organization and WebSite JSON-LD using owner-verified business identity only.
- [x] 2.2 Do not emit Product/AggregateRating rich-result markup for listing cards; defer until product detail routes and trusted rating data are separately approved.
- [x] 2.3 Validate schema output and ensure it does not change storefront behavior.

## 3. Trust Content and UX Signals

- [ ] 3.1 Obtain owner-approved factual contact, service-area, shipping, cancellation, returns/exchange, refund, privacy, and terms content before publishing; do not invent missing policies.
- [x] 3.1a Record contact/help, service-area, shipping, cancellation, returns/exchange, refund, privacy, and terms fields as `[PENDING OWNER INPUT]` in change documentation only; ensure they are absent from app routes, runtime content, metadata, structured data, sitemap, and storefront UI.
- [ ] 3.2 Create additive public trust pages only after their content is approved; do not publish placeholder pages.
- [ ] 3.3 Add footer links without replacing or re-targeting existing storefront navigation.
- [ ] 3.4 Add concise trust cues only if they do not modify checkout, order submission, or order CRUD.

## 4. Search Operations and Validation

- [x] 4.1 Document owner-run Search Console verification and sitemap submission; keep account credentials outside the repository.
- [x] 4.2 Run post-deploy checks for robots, sitemap, canonical URLs, and schema validity.
- [x] 4.3 Run full `npm run test` and `npm run build`.
- [x] 4.4 Verify existing product CRUD, order CRUD, admin settings/config writes, core route responses, and navigation targets; any regression blocks release.
- [x] 4.5 Document indexing/trust rollout status, verified business-content inputs, and rollback steps.
