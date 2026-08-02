## 1. Crawl and Index Foundations

- [ ] 1.1 Add robots configuration that allows public storefront crawling and disallows admin/private routes.
- [ ] 1.2 Add sitemap generation for canonical public URLs.
- [ ] 1.3 Add search engine verification metadata wiring through environment configuration.

## 2. Structured Data Baseline

- [ ] 2.1 Add global Organization and WebSite JSON-LD on public pages.
- [ ] 2.2 Add product-level JSON-LD context for storefront catalog items.
- [ ] 2.3 Validate schema output using rich-results/schema validation checks.

## 3. Trust Content and UX Signals

- [ ] 3.1 Create public trust pages: Contact/Help, Shipping, Returns/Exchange, Privacy, Terms.
- [ ] 3.2 Add visible links to trust pages from public storefront layout/footer.
- [ ] 3.3 Add concise trust strip / order journey cues in shop or cart flow using existing styles.

## 4. Search Operations and Validation

- [ ] 4.1 Submit sitemap in Google Search Console and verify ownership using configured token.
- [ ] 4.2 Run post-deploy checks for robots, sitemap, canonical URLs, and schema validity.
- [ ] 4.3 Run `npm run test` and `npm run build`; document baseline indexing/trust rollout status.
