import { NextRequest, NextResponse } from 'next/server'
import { getConfig, saveConfig } from '../../../lib/db'
import { requireAdmin } from '../../../lib/admin-guard'

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
  const existing = await getConfig()
  const merged = { ...existing, ...body }
  // If client intentionally sent an empty string for adminPassword, keep existing.
  if (body.hasOwnProperty('adminPassword') && (body.adminPassword === '' || body.adminPassword === null)) {
    // restore existing password
    merged.adminPassword = existing.adminPassword
  }
  await saveConfig(merged)
  return NextResponse.json({ ok: true })
}

