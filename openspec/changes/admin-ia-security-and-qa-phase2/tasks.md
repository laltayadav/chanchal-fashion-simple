## 1. Admin information architecture

- [x] 1.1 Add route-level admin navigation for overview, products, orders, and settings in the shared admin layout.
- [x] 1.2 Refactor the current mixed admin dashboard so product management is no longer coupled with settings and orders on one page.
- [x] 1.3 Implement dedicated products route behavior for list, add, edit, and delete actions.
- [x] 1.4 Implement dedicated orders route behavior for order history and order-detail views.

## 2. Config and admin security hardening

- [x] 2.1 Introduce hashed admin credential storage and remove plaintext password persistence behavior.
- [x] 2.2 Update admin authentication flow to verify submitted passwords against stored hashes.
- [x] 2.3 Add schema validation and field allowlist enforcement for config update payloads.
- [x] 2.4 Split general settings updates from sensitive security updates in UI and API contracts.
- [x] 2.5 Add migration handling for existing plaintext admin password values and verify post-migration login behavior.

## 3. Automated QA and release gate

- [x] 3.1 Add test tooling and scripts to run automated checks in local and CI workflows.
- [x] 3.2 Implement automated tests for admin auth success/failure and protected endpoint authorization.
- [x] 3.3 Implement automated tests for config validation and allowlisted update behavior.
- [x] 3.4 Implement automated tests for product create, edit, and delete flows including persistence side effects.
- [x] 3.5 Implement automated tests for order placement flow and admin order visibility.
- [x] 3.6 Add and document release gate criteria requiring successful build and required test pass before production readiness.

## 4. Verification and documentation

- [x] 4.1 Run build and full test suite, capture results, and resolve failures.
- [x] 4.2 Update local setup and engineering docs to reflect admin route structure, credential handling, and test commands.
- [x] 4.3 Perform manual smoke verification on desktop and narrow mobile viewport for the updated admin workflows.
