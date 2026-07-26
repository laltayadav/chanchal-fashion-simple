import { NextResponse } from 'next/server'
import { getConfig, saveConfig } from '../../../lib/db'

export async function GET() {
  const cfg = await getConfig()
  return NextResponse.json(cfg)
}

export async function PUT(req: Request) {
  const body = await req.json()
  await saveConfig(body)
  return NextResponse.json({ ok: true })
}

