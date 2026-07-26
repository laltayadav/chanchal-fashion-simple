import React, { createContext, useContext, useState } from 'react'
import { OrderItem, Product } from '../lib/types'

type Cart = {
  items: OrderItem[]
  add: (p: Product) => void
  remove: (productId: string) => void
  clear: () => void
}

const CartContext = createContext<Cart | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([])

  function add(p: Product) {
    setItems((cur) => {
      const idx = cur.findIndex((i) => i.productId === p.id)
      if (idx === -1) return [...cur, { productId: p.id, name: p.name, qty: 1, unitPrice: p.discountPrice ?? p.price }]
      const copy = [...cur]
      copy[idx].qty += 1
      return copy
    })
  }

  function remove(productId: string) {
    setItems((cur) => cur.filter((i) => i.productId !== productId))
  }

  function clear() {
    setItems([])
  }

  return <CartContext.Provider value={{ items, add, remove, clear }}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
