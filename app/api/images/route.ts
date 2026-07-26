import { NextRequest, NextResponse } from 'next/server'
import { deleteProductImage } from '../../../lib/images'
import { requireAdmin } from '../../../lib/admin-guard'

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAdmin(req)
    if (auth) return auth

    const body = await req.json()
    if (!body?.path) return NextResponse.json({ error: 'path required' }, { status: 400 })
    let p: string = body.path
    if (typeof p !== 'string') return NextResponse.json({ error: 'invalid path' }, { status: 400 })
    // normalize leading slash
    if (p.startsWith('/')) p = p.slice(1)
    // only allow deleting from uploads/
    if (!p.startsWith('uploads/')) return NextResponse.json({ error: 'only uploads may be deleted' }, { status: 400 })
    await deleteProductImage(p)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
