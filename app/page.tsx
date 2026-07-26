"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductCard from '../components/ProductCard'
import { useCart } from '../components/CartContext'
import CartDrawer from '../components/CartDrawer'
import { Product } from '../lib/types'
import AppShell from '../components/AppShell'

function ShopInner() {
  const [products, setProducts] = useState<Product[]>([])
  const [type, setType] = useState<'All' | 'Saree' | 'Blouse' | 'Set'>('All')
  const [category, setCategory] = useState<string>('All')
  const { add, items } = useCart()

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then(setProducts)
  }, [])

  const types = ['All', 'Saree', 'Blouse', 'Set'] as const

  const filtered = products.filter((p) => (type === 'All' ? true : p.type === type))
  const categories = Array.from(new Set(filtered.map((p) => p.category).filter(Boolean)))
  const final = filtered.filter((p) => (category === 'All' ? true : p.category === category))

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold">Handpicked saris, delivered with care</h1>
          <p className="max-w-2xl text-sm text-stone-600">Browse curated saree, blouse, and set collections</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => { setType(t); setCategory('All') }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${type===t ? 'bg-amber-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}>
                  {t}
                </button>
              ))}
            </div>
<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">
              {items.length} item{items.length === 1 ? '' : 's'} in cart
            </div>
            <Link href="/cart" className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-700 hover:border-amber-700">
              View cart
            </Link>
            </div>
          </div>

          {type !== 'All' && (type === 'Saree' || type === 'Blouse') && (
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setCategory('All')} className={`rounded-full px-3 py-2 text-sm transition ${category==='All'? 'bg-amber-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}>All</button>
              {categories.map((c) => (
                <button key={c} onClick={() => setCategory(c)} className={`rounded-full px-3 py-2 text-sm transition ${category===c? 'bg-amber-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}>{c}</button>
              ))}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            {final.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={(prod) => add(prod)} />
            ))}
          </div>
        </div>

        <div className="hidden xl:block">
          <CartDrawer />
        </div>
      </section>
    </div>
  )
}

export default function Page() {
  return (
    <AppShell>
      <ShopInner />
    </AppShell>
  )
}

