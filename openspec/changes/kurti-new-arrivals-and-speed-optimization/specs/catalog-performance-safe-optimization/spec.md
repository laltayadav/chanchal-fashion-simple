## ADDED Requirements

### Requirement: Catalog optimization SHALL preserve existing image lifecycle contracts
Performance changes SHALL NOT break existing image create/edit/delete/view flows for both uploaded `uploads/...` images and external image URLs.

#### Scenario: Uploaded image flow remains functional after optimization
- **WHEN** admin creates, edits, reorders, or deletes product images using existing upload workflow
- **THEN** all operations succeed and storefront/admin continue rendering resulting images correctly

#### Scenario: External image URLs remain functional after optimization
- **WHEN** a product uses external image URLs
- **THEN** storefront and admin render those URLs correctly with no regression in display behavior

### Requirement: Performance improvements SHALL prioritize minimal non-breaking changes
The system SHALL apply incremental catalog performance optimizations that do not require architecture migration, external paid services, or breaking API contracts.

#### Scenario: Optimization rollout keeps public API compatibility
- **WHEN** optimization changes are deployed
- **THEN** existing API request/response contracts used by storefront and admin remain compatible

### Requirement: Catalog image delivery SHALL reduce initial render cost
The system SHALL reduce initial catalog render payload and improve image loading behavior while preserving visual correctness.

#### Scenario: Initial catalog render requests fewer heavy image bytes
- **WHEN** a customer loads the shop page on a typical mobile viewport
- **THEN** above-the-fold image loading behavior is optimized to reduce initial transfer and improve time-to-usable rendering

### Requirement: Regression coverage SHALL include image and order critical paths
The test suite SHALL include regression scenarios for product image lifecycle and order flow so speed changes cannot silently break core operations.

#### Scenario: Regression suite validates image lifecycle critical paths
- **WHEN** regression tests are executed after optimization changes
- **THEN** tests cover product image create/edit/delete/view paths and pass

#### Scenario: Regression suite validates ordering continuity
- **WHEN** regression tests are executed after optimization changes
- **THEN** cart totals, order submission, and WhatsApp handoff behavior remain correct
