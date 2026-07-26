import Link from 'next/link'
import React from 'react'
import { useCart } from './CartContext'

export default function CartDrawer() {
  const { items, remove, updateQty, clear } = useCart()

  const total = items.reduce((s, i) => s + i.unitPrice * i.qty, 0)

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm xl:w-80">
      <h2 className="text-lg font-semibold mb-4">Cart summary</h2>
      {items.length === 0 ? (
        <div className="text-gray-500">Your cart is empty.</div>
      ) : (
        <div className="space-y-4">
          {items.map((it) => (
            <div key={it.productId} className="border-b pb-3 last:border-b-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-gray-500">₹{it.unitPrice} × {it.qty}</div>
                </div>
                <button onClick={() => remove(it.productId)} className="text-sm text-red-600">Remove</button>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <button onClick={() => updateQty(it.productId, it.qty - 1)} className="h-8 w-8 rounded-full border border-stone-300 text-stone-700">−</button>
                <span className="min-w-[2rem] text-center">{it.qty}</span>
                <button onClick={() => updateQty(it.productId, it.qty + 1)} className="h-8 w-8 rounded-full border border-stone-300 text-stone-700">+</button>
              </div>
              <div className="mt-2 text-sm font-semibold">Subtotal: ₹{it.unitPrice * it.qty}</div>
            </div>
          ))}
          <div className="pt-2 text-base font-semibold">Total: ₹{total}</div>
          <button onClick={clear} className="w-full rounded-full bg-stone-100 px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-200">Clear cart</button>
          <Link href="/cart" className="block w-full rounded-full bg-amber-900 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-amber-800">Proceed to WhatsApp order</Link>
        </div>
      )}
    </div>
  )
}

