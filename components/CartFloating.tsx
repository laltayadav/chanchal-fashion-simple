"use client"

import Link from 'next/link'
import React from 'react'
import { useCart } from './CartContext'

type Props = { onOpen?: () => void }

export default function CartFloating({ onOpen }: Props) {
  const { items } = useCart()
  const total = items.reduce((s, i) => s + i.unitPrice * i.qty, 0)

  if (items.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-40 md:hidden">
      <button onClick={() => onOpen && onOpen()} className="rounded-chip border border-maroon/20 bg-white px-4 py-2 text-sm font-semibold text-maroon shadow-lg">
        {items.length} item{items.length===1? '': 's'} • ₹{total}
      </button>
    </div>
  )
}
