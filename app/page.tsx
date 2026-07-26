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
    <div className="space-y-8">
      <section className="rounded-card border border-maroon/10 bg-cream p-6 shadow-sm">
        <div className="space-y-3 sm:space-y-4">
          <div className="text-sm uppercase tracking-[0.35em] text-gold">Chanchal Fashion</div>
          <h1 className="max-w-3xl text-4xl font-serif font-semibold leading-tight text-maroon-deep sm:text-5xl">Weave Your Own Story with beautifully crafted sarees, blouses, and sets.</h1>
          <p className="max-w-2xl text-base leading-7 text-ink/75">Handpicked styles, thoughtful details and festive elegance for every celebration. Discover curated pieces made to make every outfit feel special.</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => { setType(t); setCategory('All') }}
                  className={`rounded-chip px-4 py-2 text-sm font-medium transition ${type===t ? 'bg-maroon text-white' : 'bg-white text-ink shadow-sm hover:bg-cream'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {type !== 'All' && (type === 'Saree' || type === 'Blouse') && (
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setCategory('All')} className={`rounded-chip px-3 py-2 text-sm font-medium transition ${category==='All'? 'bg-maroon text-white' : 'bg-white text-ink shadow-sm hover:bg-cream'}`}>All</button>
              {categories.map((c) => (
                <button key={c} onClick={() => setCategory(c)} className={`rounded-chip px-3 py-2 text-sm font-medium transition ${category===c? 'bg-maroon text-white' : 'bg-white text-ink shadow-sm hover:bg-cream'}`}>{c}</button>
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

