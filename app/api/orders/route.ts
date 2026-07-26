import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getOrders, saveOrders } from '../../../lib/db'
import { Order } from '../../../lib/types'

export async function GET() {
  const orders = await getOrders()
  return NextResponse.json(orders)
}

export async function POST(req: Request) {
  const body = await req.json()
  const required = ['items', 'total', 'name', 'phone']
  for (const r of required) {
    if (!Object.prototype.hasOwnProperty.call(body, r)) {
      return NextResponse.json({ error: `${r} is required` }, { status: 400 })
    }
  }
  const orders = await getOrders()
  const id = uuidv4()
  const order: Order = {
    id,
    items: body.items,
    total: Number(body.total),
    name: body.name,
    phone: body.phone,
    note: body.note,
    timestamp: new Date().toISOString(),
    status: 'new'
  }
  orders.push(order)
  await saveOrders(orders)
  return NextResponse.json({ id: order.id, timestamp: order.timestamp }, { status: 201 })
}
