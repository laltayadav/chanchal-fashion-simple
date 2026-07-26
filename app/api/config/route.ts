import { NextRequest, NextResponse } from 'next/server'
import { getConfig, saveConfig } from '../../../lib/db'
import { requireAdmin } from '../../../lib/admin-guard'

const ALLOWED_CONFIG_FIELDS = ['shopName', 'whatsapp'] as const
type AllowedConfigField = (typeof ALLOWED_CONFIG_FIELDS)[number]

function parseConfigPayload(body: unknown) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Invalid payload' }
  }

  const payload = body as Record<string, unknown>
  const unknownKeys = Object.keys(payload).filter((k) => !ALLOWED_CONFIG_FIELDS.includes(k as AllowedConfigField))
  if (unknownKeys.length > 0) {
    return { error: `Unsupported fields: ${unknownKeys.join(', ')}` }
  }

  const result: Record<string, string> = {}
  for (const key of ALLOWED_CONFIG_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(payload, key)) continue
    const value = payload[key]
    if (typeof value !== 'string') {
      return { error: `${key} must be a string` }
    }
    result[key] = value.trim()
  }

  return { data: result }
}

export async function GET() {
  const cfg = await getConfig()
  const publicConfig = {
    shopName: cfg.shopName,
    whatsapp: cfg.whatsapp
  }
  return NextResponse.json(publicConfig)
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  const body = await req.json()
  const parsed = parseConfigPayload(body)
  if (parsed.error) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const existing = await getConfig()
  const merged = { ...existing }
  if (parsed.data) {
    for (const [key, value] of Object.entries(parsed.data)) {
      ;(merged as Record<string, unknown>)[key] = value
    }
  }

  await saveConfig(merged)
  return NextResponse.json({ ok: true })
}

