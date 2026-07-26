"use client"

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Order, Product } from '../lib/types'

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    fetch('/api/products').then((r) => r.json()).then(setProducts)
    fetch('/api/orders').then((r) => r.json()).then(setOrders)
  }, [])

  const lowStockCount = useMemo(() => products.filter((p) => p.inStock === false).length, [products])
  const latestOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
  }, [orders])

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-stone-500">Products</div>
          <div className="text-3xl font-semibold text-stone-900">{products.length}</div>
          <Link href="/admin/products" className="mt-3 inline-block text-sm font-semibold text-amber-800 hover:text-amber-700">Manage products</Link>
        </div>
        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-stone-500">Orders</div>
          <div className="text-3xl font-semibold text-stone-900">{orders.length}</div>
          <Link href="/admin/orders" className="mt-3 inline-block text-sm font-semibold text-amber-800 hover:text-amber-700">Open order history</Link>
        </div>
        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-stone-500">Out of stock</div>
          <div className="text-3xl font-semibold text-stone-900">{lowStockCount}</div>
          <Link href="/admin/settings" className="mt-3 inline-block text-sm font-semibold text-amber-800 hover:text-amber-700">Update settings</Link>
        </div>
      </section>

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-amber-800 hover:text-amber-700">View all orders</Link>
        </div>
        {latestOrders.length === 0 ? (
          <div className="text-stone-500">No orders have been placed yet.</div>
        ) : (
          <div className="space-y-3">
            {latestOrders.map((order) => (
              <Link key={order.id} href={`/admin/orders/${order.id}`} className="block rounded-2xl border border-stone-200 bg-stone-50 p-4 hover:bg-stone-100">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-semibold">{order.name}</div>
                    <div className="text-sm text-stone-600">{order.phone}</div>
                  </div>
                  <div className="text-sm text-stone-500">{new Date(order.timestamp).toLocaleString()}</div>
                </div>
                <div className="mt-2 text-sm text-stone-700">Total: ₹{order.total}</div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
