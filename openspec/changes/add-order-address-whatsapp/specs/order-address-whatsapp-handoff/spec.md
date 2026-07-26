## ADDED Requirements

### Requirement: WhatsApp handoff SHALL include address line
The system SHALL include customer address in the generated WhatsApp order message payload.

#### Scenario: WhatsApp message includes labeled address
- **WHEN** checkout successfully creates an order and generates WhatsApp handoff text
- **THEN** the message includes a labeled `Address:` line containing submitted address data

### Requirement: Legacy orders without address SHALL remain readable
The system SHALL support rendering or formatting legacy order records that do not contain address.

#### Scenario: Graceful handling of old order records
- **WHEN** admin views a previously stored order without an address value
- **THEN** the UI displays a safe fallback instead of failing render or crashing
