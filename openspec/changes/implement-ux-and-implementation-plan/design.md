## Context

The repository contains a working static prototype (`docs/sari-shop.html`) and high-level UX instructions in `docs/UX_AND_IMPLEMENTATION_PLAN.md`. The Next.js app uses the App Router and Tailwind; persistence is file-based JSON under `data/` per the project's architecture. This design documents the Phase 1 choices for implementing storefront features without external services.

## Goals / Non-Goals

**Goals:**
- Provide typed, low-complexity persistence for products, orders, and config via `lib/db.ts`.
- Provide robust image resizing and WebP conversion using `sharp` in `lib/images.ts`.
- Implement customer UX (Shop, Cart) and admin UX (password-gated `/admin`) matching the prototype.

**Non-Goals:**
- Production-grade authentication or external DBs.
- Payment gateway integration or WhatsApp Cloud API back-end send.

## Decisions

- Data layer: use `lowdb` with JSON files under `data/`. Rationale: simple, file-backed persistence matches existing repo and reduces infra.
- Images: use `sharp` to resize to max 1000px width and convert to WebP. Save to `data/images/<uuid>.webp` and store path on product.
- Types: define `Product` and `Order` in a single file `types.ts` under `lib/` and import where needed.
- APIs: Next.js App Router `route.ts` handlers under `app/api/products` and `app/api/orders`. Use `lib/db.ts` for persistence; `lib/images.ts` for handling uploaded images.
- Admin entry: password gate checks `process.env.ADMIN_PASSWORD` on server-side; UI lives at `/admin` and isn't linked from header.

## Risks / Trade-offs

- Risk: concurrent writes to JSON files could cause races under heavy use. Mitigation: low expected traffic in Phase 1; use atomic file writes via `fs.writeFileSync` and keep operations small. If concurrency grows, migrate to a small DB.
- Risk: large image uploads blocking serverless function memory/time. Mitigation: reject images beyond a sensible size (e.g., 5MB) and resize in a streaming manner.

## Migration Plan

- Deploy by merging changes and updating environment with `ADMIN_PASSWORD` and `SHOP_WHATSAPP` vars.
- Rollback: revert commit and restore previous `data/` snapshot if needed.

## Open Questions

- Should `includes` for Set products be free text or linked to product IDs now? (Decision: keep free text for Phase 1.)
- Confirm WhatsApp number formatting for `wa.me` links (E.164 without + recommended).
