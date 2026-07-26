import { NextRequest, NextResponse } from 'next/server'
import { getConfig, saveConfig } from '../../../../lib/db'
import { requireAdmin } from '../../../../lib/admin-guard'
import { hashAdminPassword, normalizeConfigSecrets } from '../../../../lib/admin-password'

const MIN_PASSWORD_LENGTH = 12

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  const body = await req.json().catch(() => null)
  const password = typeof body?.adminPassword === 'string' ? body.adminPassword.trim() : ''
  if (!password) {
    return NextResponse.json({ error: 'adminPassword is required' }, { status: 400 })
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json({ error: `adminPassword must be at least ${MIN_PASSWORD_LENGTH} characters` }, { status: 400 })
  }

  const existing = normalizeConfigSecrets(await getConfig())
  const nextConfig = {
    ...existing,
    adminPasswordHash: hashAdminPassword(password),
  }
  delete nextConfig.adminPassword

  await saveConfig(nextConfig)
  return NextResponse.json({ ok: true })
}
