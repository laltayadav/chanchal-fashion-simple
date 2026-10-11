## Context

The current `app/page.tsx` is a client-rendered product catalog, and `SiteHeader` labels `/` as Shop. The shop, cart, and checkout are working production functionality. Admin settings and public configuration already use a JSON-backed config API with an explicit update allowlist. Product uploads are converted to WebP and stored through `saveProductImage` in the configured uploads directory, which maps to persistent Fly storage in production.

This change creates a landing page without rebuilding commerce flows or requiring a content-management system. Existing runtime config files will not contain homepage fields initially, so all new content must have safe defaults.

## Goals / Non-Goals

**Goals:**
- Serve a branded landing page at `/` and preserve the current catalog experience at `/shop`.
- Let an authenticated admin upload, remove, and reorder up to five hero images and edit a headline and supporting text.
- Let the admin optionally override the headline and supporting text on each later slide; independently inherit either field from the master slide when that override is blank.
- Rotate multiple hero images automatically every six seconds, with clickable slide indicators.
- Keep the call to action fixed to `/shop`; render an intentional branded fallback when no image exists.
- Preserve current product, cart, checkout, admin, and API behavior.
- Reuse existing JSON config, upload conversion, and persistent storage conventions.

**Non-Goals:**
- Build a page builder, featured-product editor, or configurable CTA destination.
- Change order data, product schemas, checkout, WhatsApp behavior, or authentication.
- Redesign the existing shop or comprehensively implement the separate SEO/trust proposal.

## Decisions

1. **Move the existing catalog route, not its implementation.** Relocate the current shop page to `app/shop/page.tsx`, updating relative imports only, and create a new `app/page.tsx` for the landing page. Keep the existing `ShopInner` behavior and `AppShell` intact. This gives `/shop` the exact current filtering/cart experience. Keeping the catalog at `/` and using a separate landing URL was rejected because the agreed entry experience is the landing page.

2. **Render landing content from server-side config.** Read public-safe fields via `getConfig()` in the server page so the hero and copy are present in the initial response; do not make the landing page wait for a client-side config fetch. Add backward-compatible defaults when fields are missing or blank. Keep secrets excluded from public config responses.

3. **Extend the existing admin settings and protected config allowlist.** Add only headline, supporting text, and management for an ordered set of up to five hero images to the current settings form. Preserve the existing single-image config field for backward compatibility. The CTA remains a fixed internal `/shop` link. Validate new fields server-side and require existing admin authorization for writes.

4. **Keep master copy and slide overrides distinct.** The existing homepage title and description remain the required master copy (using safe defaults when legacy config has none). Each ordered slide may optionally override either field. Resolve title and description independently: use a nonblank slide override for that field, otherwise use the master value. Store slide content with the slide/image identity so reordering images does not detach copy from its image.

5. **Reuse image processing and persistent uploads.** Convert selected images to base64 in the admin UI and send them through the protected config update flow; on the server, pass decoded bytes through `saveProductImage` and persist only resulting upload paths. Validate payload type and reject invalid/oversized input consistently with the existing upload conventions. Do not store base64 image data in JSON. Do not delete a previous image as part of replacement unless it can be proven unreferenced, to avoid removing a file still used by a product.

6. **Use a static branded fallback and route-specific metadata.** When there is no valid configured hero image, retain the fixed layout, default headline/supporting copy, and CTA against a maroon/cream treatment. Give `/` and `/shop` distinct titles, descriptions, and canonical URLs using the configured metadata base.

7. **Keep slide motion slow and accessible.** Rotate every six seconds, expose clickable indicators for direct selection, and disable automatic motion when the visitor prefers reduced motion.

8. **Treat route migration as a compatibility-sensitive release.** Update the visible Shop navigation to `/shop`; preserve all other routes. Validate direct navigation to `/` and `/shop`, and check cart, order submission, and admin settings. Rollback is the prior deployment; no data migration is required because new config properties are optional.

## Risks / Trade-offs

- [Existing links to `/` will now open the landing page rather than the catalog] → Make Shop navigation and the landing CTA prominent and direct both to `/shop`; preserve catalog content and ordering behavior unchanged.
- [Existing runtime configs lack new fields] → Apply defaults on read and make admin updates merge only allowlisted fields.
- [An upload or config update can fail] → Report errors in admin and avoid changing the persisted image reference until image processing succeeds.
- [Replacing uploaded hero images can leave unreferenced files] → Prefer safe retention over deleting an asset that might also be referenced by a product; assess cleanup separately if storage usage becomes material.
- [Client-side image conversion can create large request bodies] → Reuse existing product upload conventions, apply a bounded file size in the admin UI and server validation, and test error feedback.

## Migration Plan

1. Deploy the route move, config defaults, admin editor, and landing page together.
2. Verify `/`, `/shop`, product browsing, cart, WhatsApp order submission, admin settings, and uploaded image retrieval in staging/production.
3. Existing deployments need no config migration; without an uploaded hero image they show the branded fallback.
4. If a critical regression occurs, roll back to the previous deployment. Runtime config fields are additive and ignored by the prior application version.

## Open Questions

None. The route behavior, limited editable fields, no-image fallback, and production-compatibility expectations were confirmed during exploration.
