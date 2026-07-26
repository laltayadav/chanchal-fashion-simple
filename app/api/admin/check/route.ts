import { NextResponse } from 'next/server'
import { getConfig } from '../../../../lib/db'
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_TRUST_COOKIE,
  ADMIN_SESSION_TTL_MS,
  ADMIN_TRUST_TTL_MS,
  buildAdminSessionCookies,
  clearAdminLockout,
  isAdminLockedOut,
  recordFailedAdminAttempt,
} from '../../../../lib/admin-auth'

export async function POST(req: Request) {
  const body = await req.json()
  const password = String(body.password || '')
  const rememberDevice = Boolean(body.rememberDevice)
  const cfg = await getConfig()
  const secret = cfg.adminPassword || 'admin'

  if (await isAdminLockedOut()) {
    return NextResponse.json({ error: 'admin temporarily locked' }, { status: 423 })
  }

  if (password === secret) {
    await clearAdminLockout()
    const response = NextResponse.json({ ok: true })
    const tokens = buildAdminSessionCookies(rememberDevice)
    response.cookies.set(ADMIN_SESSION_COOKIE, tokens.session, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: Math.floor(ADMIN_SESSION_TTL_MS / 1000),
    })
    if (tokens.trust) {
      response.cookies.set(ADMIN_TRUST_COOKIE, tokens.trust, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: Math.floor(ADMIN_TRUST_TTL_MS / 1000),
      })
    }
    return response
  }

  const result = await recordFailedAdminAttempt()
  if (result.locked) {
    return NextResponse.json({ error: 'admin temporarily locked' }, { status: 423 })
  }

  return NextResponse.json({ error: 'invalid password' }, { status: 401 })
}
