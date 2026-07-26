"use client"

import { ReactNode, useState } from 'react'
import { SiteHeader } from './SiteHeader'
import CartFloating from './CartFloating'
import CartDrawer from './CartDrawer'

export default function AppShell({ children }: { children: ReactNode }) {
  const [showCart, setShowCart] = useState(false)

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900">
      <div className="mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-6 lg:px-8">
        <SiteHeader />
        <main className="mt-6">{children}</main>
        <CartFloating onOpen={() => setShowCart(true)} />
      </div>

      {showCart && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCart(false)} />
          <div className="relative ml-auto w-full max-w-md bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Cart</h3>
              <button onClick={() => setShowCart(false)} className="text-stone-700">Close</button>
            </div>
            <CartDrawer />
          </div>
        </div>
      )}
    </div>
  )
}
