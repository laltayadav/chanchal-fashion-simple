import { createHmac, timingSafeEqual } from 'crypto'
import { getAdminAuthState, saveAdminAuthState } from './db'

export const ADMIN_SESSION_COOKIE = 'chanchal_admin_session'
export const ADMIN_TRUST_COOKIE = 'chanchal_admin_trust'
export const MIN_ADMIN_SESSION_SECRET_LENGTH = 32
export const ADMIN_LOCK_THRESHOLD = 5
export const ADMIN_LOCK_WINDOW_MS = 10 * 60 * 1000
export const ADMIN_SESSION_TTL_MS = 60 * 60 * 1000
export const ADMIN_TRUST_TTL_MS = 30 * 24 * 60 * 60 * 1000

function getAdminTokenSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.length < MIN_ADMIN_SESSION_SECRET_LENGTH) {
    throw new Error(
      `ADMIN_SESSION_SECRET must be set and at least ${MIN_ADMIN_SESSION_SECRET_LENGTH} characters long.`
    )
  }
  return secret
}

export type CookieLike = {
  get(name: string): { value: string } | undefined
}

export type AdminTokenKind = 'session' | 'trust'

export interface AdminTokenPayload {
  kind: AdminTokenKind
  exp: number
  issuedAt: number
}

function toBase64Url(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url')
}

function fromBase64Url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function sign(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url')
}

function safeEqual(left: string, right: string) {
  const leftBytes = new Uint8Array(Buffer.from(left, 'utf8'))
  const rightBytes = new Uint8Array(Buffer.from(right, 'utf8'))
  if (leftBytes.length !== rightBytes.length) return false
  return timingSafeEqual(leftBytes, rightBytes)
}

export function createAdminToken(kind: AdminTokenKind, ttlMs: number, secret: string) {
  const payload: AdminTokenPayload = {
    kind,
    issuedAt: Date.now(),
    exp: Date.now() + ttlMs,
  }
  const encoded = toBase64Url(JSON.stringify(payload))
  const signature = sign(encoded, secret)
  return `${encoded}.${signature}`
}

export function verifyAdminToken(token: string | undefined, expectedKind: AdminTokenKind, secret: string) {
  if (!token) return null
  const [encoded, signature] = token.split('.')
  if (!encoded || !signature) return null
  const expectedSignature = sign(encoded, secret)
  if (!safeEqual(signature, expectedSignature)) return null
  try {
    const payload = JSON.parse(fromBase64Url(encoded)) as AdminTokenPayload
    if (payload.kind !== expectedKind) return null
    if (!payload.exp || payload.exp <= Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export async function isAdminAuthenticated(cookieStore: CookieLike) {
  const secret = getAdminTokenSecret()
  const sessionToken = verifyAdminToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value, 'session', secret)
  if (sessionToken) return true
  const trustToken = verifyAdminToken(cookieStore.get(ADMIN_TRUST_COOKIE)?.value, 'trust', secret)
  return Boolean(trustToken)
}

export async function getAdminState() {
  return getAdminAuthState()
}

export async function recordFailedAdminAttempt() {
  const state = await getAdminAuthState()
  const now = Date.now()
  const lockUntil = state.lockUntil && state.lockUntil > now ? state.lockUntil : null
  if (lockUntil) {
    return { state, locked: true, lockUntil }
  }

  const attempts = (state.failedAttempts || 0) + 1
  const updatedState = {
    failedAttempts: attempts,
    lockUntil: attempts >= ADMIN_LOCK_THRESHOLD ? now + ADMIN_LOCK_WINDOW_MS : null,
    lastFailedAt: new Date(now).toISOString(),
  }
  await saveAdminAuthState(updatedState)
  return { state: updatedState, locked: Boolean(updatedState.lockUntil), lockUntil: updatedState.lockUntil || null }
}

export async function clearAdminLockout() {
  await saveAdminAuthState({ failedAttempts: 0, lockUntil: null, lastFailedAt: null })
}

export async function isAdminLockedOut() {
  const state = await getAdminAuthState()
  if (!state.lockUntil) return false
  if (state.lockUntil <= Date.now()) {
    await clearAdminLockout()
    return false
  }
  return true
}

export function getAdminLockoutInfo() {
  return getAdminAuthState().then((state) => {
    if (!state.lockUntil || state.lockUntil <= Date.now()) return null
    return { lockUntil: state.lockUntil }
  })
}

export function buildAdminSessionCookies(rememberDevice: boolean) {
  const secret = getAdminTokenSecret()
  const session = createAdminToken('session', ADMIN_SESSION_TTL_MS, secret)
  const trust = rememberDevice ? createAdminToken('trust', ADMIN_TRUST_TTL_MS, secret) : null

  return {
    session,
    trust,
  }
}

export async function getAdminAuthFromRequest(cookieStore: CookieLike) {
  return isAdminAuthenticated(cookieStore)
}
