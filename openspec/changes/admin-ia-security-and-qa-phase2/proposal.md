## Why

The admin experience currently combines settings, product management, and order history in a single workflow, which increases cognitive load and makes role-specific tasks harder to complete reliably. At the same time, config and admin password handling still rely on plaintext storage and permissive updates, and there is no automated production-readiness test gate for core shop and admin actions.

## What Changes

- Reorganize admin UX into focused sections/pages for Orders, Products, and Settings, with clear navigation and task boundaries.
- Move product add/edit/delete flows into dedicated product management pages instead of a mixed dashboard composition.
- Move order history and order detail workflows into a dedicated Orders section.
- Introduce secure admin credential handling by replacing plaintext password storage with a hashed-password model and controlled update flow.
- Add strict validation and field allowlists for configuration updates to prevent unintended writes.
- Add automated tests that cover critical actions from product management through order placement and admin verification.
- Define release gates that require successful build and test execution before production readiness claims.

## Capabilities

### New Capabilities
- `admin-information-architecture`: Defines navigation and route-level separation for admin overview, products, orders, and settings workflows.
- `admin-config-security-hardening`: Defines secure credential storage and validated configuration update behavior.
- `admin-production-readiness-qa`: Defines required automated and manual verification for CRUD, ordering, and admin action flows.

### Modified Capabilities
- None.

## Impact

- Affected UI and routes under app/admin and components that currently mix settings/products/orders in one page.
- Affected APIs for admin config and authentication, including config update contracts and password verification behavior.
- Affected data model for persisted admin credential fields in data/config.json (or equivalent config/auth store).
- Affected project tooling by adding test scripts, test dependencies, and CI/build validation checkpoints.
