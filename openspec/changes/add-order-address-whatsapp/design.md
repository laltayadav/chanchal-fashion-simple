## Context

The checkout flow currently captures name, phone, and note, and then creates an order plus WhatsApp handoff message. Address is missing as a dedicated field, which leads to incomplete fulfillment context in both stored orders and customer-to-shop message handoff.

Address data spans multiple layers (checkout form, API validation, order persistence, and WhatsApp formatter), so this change is cross-cutting but narrow in scope.

## Goals / Non-Goals

**Goals:**
- Add an address input above note in checkout UI.
- Persist address in order records and order API payload contracts.
- Include address in WhatsApp handoff text with clear labeling.
- Keep backward compatibility with existing orders that have no address.

**Non-Goals:**
- Implementing address autocomplete or geocoding.
- Multi-address management or customer profile storage.
- Shipping-rate calculation or address verification services.

## Decisions

1. Field placement and UX
- Decision: Add address text box directly above note field.
- Rationale: Preserves existing flow and aligns with user request while keeping low cognitive load.
- Alternative considered: place after note; rejected for reduced visibility.

2. Data model
- Decision: Add optional `address` string to order schema and API payload.
- Rationale: Supports existing orders without migration blockers and keeps payload simple.
- Alternative considered: required structured address object; rejected for extra complexity now.

3. Validation behavior
- Decision: Treat address as required for new submissions in checkout UI and API validation.
- Rationale: Request intent is to pass address in WhatsApp reliably; required validation ensures presence.
- Alternative considered: optional address; rejected due to inconsistent handoff completeness.

4. WhatsApp message formatting
- Decision: Add explicit `Address:` line before note line in handoff payload.
- Rationale: Improves readability and avoids operator confusion.
- Alternative considered: append address into note; rejected because it mixes distinct data.

## Risks / Trade-offs

- [Risk] Existing tests and fixtures may fail due to new required field.
  - Mitigation: update tests and fixtures with clear required-address cases.

- [Risk] Long addresses may reduce WhatsApp message readability.
  - Mitigation: keep line-based format and rely on natural wrapping.

- [Risk] Legacy orders missing address may display blank fields in admin.
  - Mitigation: add fallback display such as `Address not provided` for old records.

## Migration Plan

1. Extend order type and API payload parsing to include `address`.
2. Update checkout form with required address input above note.
3. Update WhatsApp message builder to include address line.
4. Update tests for order submit + WhatsApp handoff expectations.
5. Ensure admin order views safely render old records without address.

Rollback strategy:
- UI rollback: hide address input and revert submit payload.
- API rollback: ignore address field while keeping optional schema compatibility.
- Data rollback: address is additive; previous consumers can ignore it.

## Open Questions

- Should multiline addresses be allowed as-is, or normalized to a single line in WhatsApp text?
- Should address maximum length be enforced now to control message size?
