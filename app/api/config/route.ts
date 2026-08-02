import { NextRequest, NextResponse } from 'next/server'
import { getConfig, saveConfig } from '../../../lib/db'
import { requireAdmin } from '../../../lib/admin-guard'
import { normalizeAndValidateWhatsappNumber } from '../../../lib/whatsapp-number'
import { DEFAULT_NEW_ARRIVAL_WINDOW_DAYS } from '../../../lib/product-recency'

const ALLOWED_CONFIG_FIELDS = ['shopName', 'whatsapp', 'newArrivalWindowDays'] as const
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

  const result: Record<string, string | number> = {}
  for (const key of ALLOWED_CONFIG_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(payload, key)) continue
    const value = payload[key]

    if (key === 'newArrivalWindowDays') {
      const parsed = Number(value)
      if (!Number.isFinite(parsed)) {
        return { error: 'newArrivalWindowDays must be a number' }
      }
      const normalized = Math.trunc(parsed)
      if (normalized < 1 || normalized > 365) {
        return { error: 'newArrivalWindowDays must be between 1 and 365' }
      }
      result[key] = normalized
      continue
    }

    if (typeof value !== 'string') {
      return { error: `${key} must be a string` }
    }

    if (key === 'whatsapp') {
      const parsed = normalizeAndValidateWhatsappNumber(value)
      if (parsed.error) {
        return { error: parsed.error }
      }
      result[key] = parsed.normalized
      continue
    }

    result[key] = value.trim()
  }

  return { data: result }
}

export async function GET() {
  const cfg = await getConfig()
  const parsedWhatsapp = normalizeAndValidateWhatsappNumber(cfg.whatsapp || '')
  const normalizedWindow = Number(cfg.newArrivalWindowDays)
  const publicConfig = {
    shopName: cfg.shopName,
    whatsapp: parsedWhatsapp.normalized,
    newArrivalWindowDays: Number.isFinite(normalizedWindow) ? Math.max(1, Math.min(365, Math.trunc(normalizedWindow))) : DEFAULT_NEW_ARRIVAL_WINDOW_DAYS,
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

