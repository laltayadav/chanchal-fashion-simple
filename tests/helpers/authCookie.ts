import { ADMIN_SESSION_COOKIE, buildAdminSessionCookies } from '../../lib/admin-auth'

export function adminCookieHeader() {
  const token = buildAdminSessionCookies(false).session
  return `${ADMIN_SESSION_COOKIE}=${token}`
}
