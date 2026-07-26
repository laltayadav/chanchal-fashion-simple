## 1. Order schema and API contract

- [x] 1.1 Extend shared order type with `address` field support.
- [x] 1.2 Update order creation API validation to require address for new submissions.
- [x] 1.3 Persist submitted address in order records and keep backward-compatible reads for legacy orders.

## 2. Checkout form UX

- [x] 2.1 Add address textbox above note field in checkout UI.
- [x] 2.2 Wire address value into order submission payload.
- [x] 2.3 Add required-field messaging and submission guard for missing address.

## 3. WhatsApp handoff formatting

- [x] 3.1 Update WhatsApp message builder to include a labeled `Address:` line.
- [x] 3.2 Ensure address appears before note in the outgoing message layout.
- [x] 3.3 Validate long or multiline address formatting remains readable in handoff text.

## 4. Admin and regression handling

- [x] 4.1 Update admin order display to show address when present.
- [x] 4.2 Add fallback rendering for legacy orders without address.
- [x] 4.3 Verify order history and detail views remain stable after schema change.

## 5. Testing and documentation

- [x] 5.1 Add/update tests for order API address validation and persistence.
- [x] 5.2 Add/update tests for WhatsApp handoff content including address line.
- [x] 5.3 Update docs to describe required address input and message composition behavior.
- [x] 5.4 Run test/build checks and resolve any regressions.
