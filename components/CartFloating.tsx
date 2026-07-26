"use client"

import Link from 'next/link'
import React from 'react'
import { useCart } from './CartContext'

type Props = { onOpen?: () => void }

export default function CartFloating({ onOpen }: Props) {
  const { items } = useCart()
  const total = items.reduce((s, i) => s + i.unitPrice * i.qty, 0)

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[min(980px,92%)] -translate-x-1/2 rounded-2xl bg-white p-3 shadow-lg xl:hidden">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{items.length} item{items.length===1? '': 's'} • ₹{total}</div>
        <div className="flex gap-2">
          <button onClick={() => onOpen && onOpen()} className="rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-white">View cart</button>
        </div>
      </div>
    </div>
  )
}
