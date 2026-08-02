"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { InlineSpinner, SectionSkeleton } from './LoadingStates'
import { Order } from '../lib/types'
import { useDelayedFlag } from '../lib/useDelayedFlag'

export function AdminOrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const showInitialLoader = useDelayedFlag(loadingInitial)

  useEffect(() => {
    let cancelled = false

    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        setOrders(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (cancelled) return
        setOrders([])
      })
      .finally(() => {
        if (cancelled) return
        setLoadingInitial(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function deleteOrder(id: string) {
    if (!confirm('Delete this order? This cannot be undone.')) return
    setDeletingId(id)
    setMessage('')
    const res = await fetch(`/api/orders?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    setDeletingId(null)
    if (!res.ok) {
      setMessage('Could not delete order. Please try again.')
      return
    }
    setOrders((prev) => prev.filter((order) => order.id !== id))
    setMessage('Order deleted.')
  }

  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Orders</h2>
      {message ? <div className="mb-4 text-sm text-stone-700">{message}</div> : null}
      {showInitialLoader ? (
        <SectionSkeleton lines={4} className="border-0 bg-transparent p-0 shadow-none" />
      ) : orders.length === 0 ? (
        <div className="text-stone-500">No orders have been placed yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-3xl border border-stone-200 bg-stone-50 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <Link href={`/admin/orders/${order.id}`} className="block hover:opacity-90">
                  <div className="font-semibold">{order.name}</div>
                  <div className="text-sm text-stone-600">{order.phone}</div>
                  <div className="mt-3 text-sm text-stone-700">Total: ₹{order.total}</div>
                  <div className="mt-2 text-sm text-stone-600">Address: {order.address?.trim() || 'Address not provided'}</div>
                  {order.note ? <div className="mt-2 text-sm text-stone-600">Note: {order.note}</div> : null}
                </Link>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-stone-500">{new Date(order.timestamp).toLocaleString()}</div>
                  <button
                    type="button"
                    onClick={() => deleteOrder(order.id)}
                    disabled={deletingId === order.id}
                    className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                  >
                    {deletingId === order.id ? (
                      <span className="inline-flex items-center gap-1">
                        <InlineSpinner />
                        Deleting…
                      </span>
                    ) : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
