## 1. Shared Loading Patterns

- [x] 1.1 Add a reusable section skeleton/loader pattern using existing Tailwind classes (rounded cards, stone palette, subtle animation).
- [x] 1.2 Add a reusable inline action loader pattern (spinner + label) for pending button actions.
- [x] 1.3 Add a small loader visibility threshold utility/state pattern to avoid flicker on very fast responses.

## 2. Storefront Loading States

- [x] 2.1 Add initial-load skeleton state to the shop listing section while `/api/products` and `/api/config` are pending.
- [x] 2.2 Keep filter and layout structure stable during loading and data swap.
- [x] 2.3 Ensure cart order submission button shows pending feedback and prevents duplicate submits while request is active.

## 3. Admin Loading States

- [x] 3.1 Add first-load skeleton state to admin dashboard product/order summary sections.
- [x] 3.2 Add first-load skeleton state to admin products list and admin orders list.
- [x] 3.3 Apply inline pending feedback/disabled state consistency to admin unlock, save, and delete actions.

## 4. Quality Validation

- [x] 4.1 Verify loader behavior on mobile and desktop for no layout jump and clear wait feedback.
- [x] 4.2 Validate reduced flicker behavior with fast API responses and visible loader behavior with slower responses.
- [x] 4.3 Run `npm run test` and `npm run build`, then resolve any regressions.
