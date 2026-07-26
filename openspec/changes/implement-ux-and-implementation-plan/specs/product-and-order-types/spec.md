## ADDED Requirements

### Requirement: Project-wide TypeScript interfaces for Product and Order
The system SHALL define `Product` and `Order` TypeScript interfaces in `lib/types.ts` matching the UX data model in `docs/UX_AND_IMPLEMENTATION_PLAN.md`.

#### Scenario: Import types
- **WHEN** a module imports `Product` or `Order` from `lib/types`
- **THEN** the compiler recognizes the shapes and typing is enforced across the codebase
