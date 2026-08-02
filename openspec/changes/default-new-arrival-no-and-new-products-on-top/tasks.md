## 1. New-Arrival Default Policy

- [x] 1.1 Update admin product creation flow so omitted `newArrivalEnabled` defaults to `false`.
- [x] 1.2 Update products create API contract to default omitted `newArrivalEnabled` to `false`.
- [x] 1.3 Verify explicit `newArrivalEnabled=true` and `newArrivalEnabled=false` both persist correctly.

## 2. Customer Ordering Behavior

- [x] 2.1 Implement storefront default ordering as createdAt-descending (newly added first).
- [x] 2.2 Ensure updatedAt changes do not affect default customer ranking precedence.
- [x] 2.3 Preserve deterministic fallback ordering for products missing/invalid createdAt.

## 3. Regression and Verification

- [x] 3.1 Add/adjust tests for product creation default new-arrival behavior.
- [x] 3.2 Add/adjust tests for customer default ordering semantics (createdAt-first, updatedAt ignored for default ranking).
- [x] 3.3 Run `npm run test` and `npm run build` and document any follow-up fixes before rollout.
