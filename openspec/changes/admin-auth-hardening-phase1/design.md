## Context

The current admin area uses a simple password gate and relies on the page/UI boundary for most protection. That is sufficient for casual access control, but it leaves the admin flow vulnerable to repeated guessing, tab persistence, and accidental exposure on shared devices. Phase 1 must improve security without introducing an external auth service, because the storefront is intentionally small and the owner needs a low-friction setup.

## Goals / Non-Goals

**Goals:**
- Protect admin pages and admin actions with a server-validated session.
- Support a trusted-device option so the owner does not need to re-enter the password constantly on the same device.
- Add a short-lived session timeout so the admin surface re-locks automatically.
- Add temporary lockout after repeated failed attempts to reduce brute-force risk.
- Keep the solution self-contained and compatible with the current Next.js + JSON-file architecture.

**Non-Goals:**
- External OTP delivery by email, SMS, or WhatsApp.
- Full account management, multi-user roles, or enterprise-grade identity federation.
- Perfect protection against a determined attacker with filesystem or server access.
- Replacing the current admin data model or product/order storage.

## Decisions

1. **Use signed HTTP-only cookies for admin session state**
   - The admin gate should issue a server-signed session cookie after successful password entry.
   - HTTP-only cookies reduce exposure to client-side script access and fit the current Next.js app well.
   - Alternative considered: localStorage. Rejected because it is easier to tamper with and less appropriate for auth state.

2. **Separate short-lived session from trusted-device token**
   - The admin session should expire relatively quickly, while a trusted-device cookie can last longer and restore the session on the same browser.
   - This lets the owner stay logged in on personal devices without forcing a permanent session.
   - Alternative considered: one long-lived cookie only. Rejected because it weakens timeout behavior and increases risk on shared devices.

3. **Enforce authorization on the server, not only in the admin page UI**
   - Admin pages and admin API routes should both validate the cookie before exposing sensitive data or allowing changes.
   - UI gating alone is insufficient because direct requests to API routes would still be possible.
   - Alternative considered: client-only gate with hidden route. Rejected because it does not protect the underlying data/actions.

4. **Keep lockout state server-side and lightweight**
   - Failed attempts should increment a server-side counter with an expiry window, enough to trigger short temporary lockouts.
   - The implementation should stay compatible with JSON-file persistence or a minimal server store.
   - Alternative considered: purely in-memory lockout only. Rejected because it resets on server restart and is weaker across requests.

5. **Avoid introducing external OTP in phase 1**
   - The owner asked for a no-external-service path first, so the auth hardening should stop at password, trusted device, timeout, and lockout.
   - OTP can remain a later enhancement if the store wants stronger second-factor protection.
   - Alternative considered: adding email/SMS OTP now. Rejected because it adds operational dependency and configuration overhead.

## Risks / Trade-offs

- **Signed cookies can still be stolen on compromised devices** → Use HTTP-only, SameSite cookies, short session duration, and a manual revoke/reset path.
- **Lockout may frustrate the owner after repeated typos** → Keep lockout windows short and messages generic but recoverable.
- **JSON-file persistence for lockouts is simpler but less robust than a DB** → Accept for phase 1; revisit if admin usage grows or multiple instances appear.
- **Trusted-device persistence increases convenience but slightly weakens shared-device safety** → Make it opt-in and limited to a long-lived but revocable cookie.

## Migration Plan

1. Add the server-side admin session and trusted-device cookie flow.
2. Update the admin page and admin API routes to require validation of the new auth state.
3. Preserve the current password gate behavior as the fallback for unauthenticated sessions.
4. Add lockout state and session expiry handling.
5. Test the admin flow on a personal device and a private/incognito session to confirm the re-lock behavior.
6. If needed, provide a manual reset path for clearing trusted-device or lockout state during development and maintenance.

## Open Questions

- What exact timeout window should be used for the short-lived admin session?
- What should the trusted-device lifetime be for phase 1?
- Should lockout be keyed by browser session, IP, or both?
- Do we want a manual admin logout control in the UI as part of the same change?
