import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdminPageAccess } from '../../../../lib/admin-page-auth'
import { getOrders } from '../../../../lib/db'

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPageAccess()
  const { id } = await params
  const orders = await getOrders()
  const order = orders.find((item) => item.id === id)

  if (!order) {
    notFound()
  }

  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Order details</h2>
        <Link href="/admin/orders" className="text-sm font-semibold text-amber-800 hover:text-amber-700">Back to orders</Link>
      </div>

      <div className="grid gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:grid-cols-2">
        <div>
          <div className="text-xs uppercase tracking-wide text-stone-500">Customer</div>
          <div className="font-semibold text-stone-900">{order.name}</div>
          <div className="text-sm text-stone-700">{order.phone}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-stone-500">Placed at</div>
          <div className="text-sm text-stone-900">{new Date(order.timestamp).toLocaleString()}</div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
        <div className="mb-2 font-semibold text-stone-900">Items</div>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={`${item.productId}-${item.name}`} className="flex items-center justify-between text-sm">
              <div>{item.name} x {item.qty}</div>
              <div>₹{item.unitPrice * item.qty}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-sm text-stone-800">Total: ₹{order.total}</div>
      <div className="mt-2 text-sm text-stone-700">Address: {order.address?.trim() || 'Address not provided'}</div>
      {order.note ? <div className="mt-2 text-sm text-stone-600">Note: {order.note}</div> : null}
    </section>
  )
}
