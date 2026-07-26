"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Order } from '../lib/types'

export function AdminOrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    fetch('/api/orders').then((r) => r.json()).then(setOrders)
  }, [])

  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Orders</h2>
      {orders.length === 0 ? (
        <div className="text-stone-500">No orders have been placed yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/admin/orders/${order.id}`} className="block rounded-3xl border border-stone-200 bg-stone-50 p-4 hover:bg-stone-100">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-semibold">{order.name}</div>
                  <div className="text-sm text-stone-600">{order.phone}</div>
                </div>
                <div className="text-sm text-stone-500">{new Date(order.timestamp).toLocaleString()}</div>
              </div>
              <div className="mt-3 text-sm text-stone-700">Total: ₹{order.total}</div>
              <div className="mt-2 text-sm text-stone-600">Address: {order.address?.trim() || 'Address not provided'}</div>
              {order.note ? <div className="mt-2 text-sm text-stone-600">Note: {order.note}</div> : null}
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
