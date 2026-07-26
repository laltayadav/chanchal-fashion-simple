## Why

The admin page is currently protected by a simple password gate, which is fine for basic friction but not strong enough for a real owner-only workflow. This change adds phase-1 hardening without external services so the admin area is harder to discover, harder to brute-force, and more convenient on trusted devices.

## What Changes

- Add a stronger admin access flow built around password authentication plus a trusted-device option.
- Add short-lived admin sessions so the admin page re-locks after inactivity or expiration.
- Add failed-attempt lockout to slow down repeated password guessing.
- Keep the admin route hidden from customer-facing navigation and public flows.
- Preserve the current no-external-service constraint for phase 1.

## Capabilities

### New Capabilities
- `admin-access-hardening`: secure phase-1 admin access with password gate, trusted device persistence, session timeout, and lockout protection.

### Modified Capabilities

## Impact

- Admin page authentication and session handling.
- Admin route protection for `/admin` and related admin pages/API calls.
- Cookie/session behavior for trusted-device and timeout state.
- No new external dependencies or third-party auth services required.
