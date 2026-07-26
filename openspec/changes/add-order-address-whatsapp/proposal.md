## Why

Order handoff currently captures name, phone, and note, but does not capture customer address as a first-class field. Adding an address field above note improves order clarity for delivery workflows and ensures WhatsApp order messages contain complete fulfillment information.

## What Changes

- Add a dedicated address text input above the note field in the cart checkout form.
- Persist order address in API payloads and order storage schema.
- Include address in generated WhatsApp handoff message content.
- Validate address as part of order submission requirements.
- Update UI text and documentation to reflect new order input semantics.

## Capabilities

### New Capabilities
- `order-address-capture`: Defines checkout form behavior and persistence for customer address.
- `order-address-whatsapp-handoff`: Defines WhatsApp message composition rules to include captured address.

### Modified Capabilities
- None.

## Impact

- Affected cart checkout UI and order submission flow.
- Affected orders API request validation and order record schema.
- Affected WhatsApp handoff message formatting logic.
- Affected tests and sample order fixtures that assert order shape and message content.
