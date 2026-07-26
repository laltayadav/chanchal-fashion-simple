"use client"

import { ReactNode } from 'react'
import { CartProvider } from './CartContext'

export default function RootProviders({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}
