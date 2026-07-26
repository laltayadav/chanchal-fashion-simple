import React from 'react'
import { useCart } from './CartContext'

export default function CartDrawer() {
  const { items, remove, clear } = useCart()

  const total = items.reduce((s, i) => s + i.unitPrice * i.qty, 0)

  return (
    <div className="p-4 border-l bg-white w-80">
      <h2 className="text-lg font-semibold mb-4">Cart</h2>
      {items.length === 0 ? (
        <div className="text-gray-500">No items</div>
      ) : (
        <div>
          {items.map((it) => (
            <div key={it.productId} className="flex justify-between items-center mb-2">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-gray-500">{it.qty} × ₹{it.unitPrice}</div>
              </div>
              <div className="text-right">
                <div>₹{it.unitPrice * it.qty}</div>
                <button onClick={() => remove(it.productId)} className="text-sm text-red-600">Remove</button>
              </div>
            </div>
          ))}
          <div className="mt-4 font-semibold">Total: ₹{total}</div>
          <div className="mt-4">
            <button onClick={clear} className="px-3 py-2 bg-gray-200 rounded">Clear</button>
          </div>
        </div>
      )}
    </div>
  )
}

