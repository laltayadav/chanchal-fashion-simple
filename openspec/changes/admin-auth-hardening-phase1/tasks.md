## 1. Auth Session Foundation

- [x] 1.1 Add signed HTTP-only admin session and trusted-device token helpers.
- [x] 1.2 Define session lifetime, trusted-device lifetime, and lockout window constants.
- [x] 1.3 Add server-side lockout tracking that records failed attempts and expiry.

## 2. Admin Gate Flow

- [x] 2.1 Update the admin login flow to create a short-lived session after password verification.
- [x] 2.2 Add a "remember this device" option that issues a trusted-device token.
- [x] 2.3 Show clear but generic error states for wrong password and temporary lockout.

## 3. Server Protection

- [x] 3.1 Require a valid admin session before rendering admin pages.
- [x] 3.2 Require the same auth check for admin-only API routes and write actions.
- [x] 3.3 Preserve public customer flows while keeping admin routes unlinked from the customer UI.

## 4. Verification

- [x] 4.1 Verify that a valid session unlocks admin access and expires on timeout.
- [x] 4.2 Verify that trusted-device restoration works in a fresh browser session.
- [x] 4.3 Verify that repeated failed attempts trigger lockout and recover after the window expires.
