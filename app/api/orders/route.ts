import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getOrders, saveOrders } from '../../../lib/db'
import { Order } from '../../../lib/types'
import { requireAdmin } from '../../../lib/admin-guard'

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  const orders = await getOrders()
  return NextResponse.json(orders)
}

export async function POST(req: Request) {
  const body = await req.json()
  const required = ['items', 'total', 'name', 'phone', 'address']
  for (const r of required) {
    if (!Object.prototype.hasOwnProperty.call(body, r)) {
      return NextResponse.json({ error: `${r} is required` }, { status: 400 })
    }
  }

  const name = String(body.name ?? '').trim()
  const phone = String(body.phone ?? '').trim()
  const address = String(body.address ?? '').trim()
  if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 })
  if (!phone) return NextResponse.json({ error: 'phone is required' }, { status: 400 })
  if (!address) return NextResponse.json({ error: 'address is required' }, { status: 400 })

  const orders = await getOrders()
  const id = uuidv4()
  const order: Order = {
    id,
    items: body.items,
    total: Number(body.total),
    name,
    phone,
    address,
    note: body.note,
    timestamp: new Date().toISOString(),
    status: 'new'
  }
  orders.push(order)
  await saveOrders(orders)
  return NextResponse.json({ id: order.id, timestamp: order.timestamp }, { status: 201 })
}
