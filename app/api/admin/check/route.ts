import { NextResponse } from 'next/server'
import { getConfig } from '../../../../lib/db'

export async function POST(req: Request) {
  const body = await req.json()
  const password = String(body.password || '')
  const cfg = await getConfig()
  const secret = cfg.adminPassword || 'admin'

  if (password === secret) {
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'invalid password' }, { status: 401 })
}
