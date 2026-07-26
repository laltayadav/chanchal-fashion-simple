import { NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE, ADMIN_TRUST_COOKIE } from '../../../../lib/admin-auth'

export async function POST() {
  const response = NextResponse.json({ ok: true })

  // Expire both cookies immediately to end admin access in this browser.
  response.cookies.set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  })

  response.cookies.set(ADMIN_TRUST_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  })

  return response
}
