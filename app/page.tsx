"use client"
import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useCart } from '../components/CartContext'
import CartDrawer from '../components/CartDrawer'
import { Product } from '../lib/types'
import AppShell from '../components/AppShell'
import { DEFAULT_NEW_ARRIVAL_WINDOW_DAYS, isProductNewArrival, sortProductsByRecent } from '../lib/product-recency'
import { SHOP_LAYOUT_CLASSES } from '../lib/shop-layout'

function ShopInner() {
  const [products, setProducts] = useState<Product[]>([])
  const [type, setType] = useState<'All' | 'Saree' | 'Blouse' | 'Set' | 'Kurti'>('All')
  const [category, setCategory] = useState<string>('All')
  const [browseMode, setBrowseMode] = useState<'all' | 'new'>('all')
  const [sortBy, setSortBy] = useState<'featured' | 'newest'>('featured')
  const [newArrivalWindowDays, setNewArrivalWindowDays] = useState(DEFAULT_NEW_ARRIVAL_WINDOW_DAYS)
  const { add, items } = useCart()

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then(setProducts)

    fetch('/api/config')
      .then((r) => r.json())
      .then((cfg) => {
        const parsed = Number(cfg?.newArrivalWindowDays)
        if (!Number.isFinite(parsed)) return
        const normalized = Math.max(1, Math.min(365, Math.trunc(parsed)))
        setNewArrivalWindowDays(normalized)
      })
      .catch(() => {
        setNewArrivalWindowDays(DEFAULT_NEW_ARRIVAL_WINDOW_DAYS)
      })
  }, [])

  const types = ['All', 'Saree', 'Blouse', 'Set', 'Kurti'] as const

  const getSubcategory = (p: Product) => {
    const rawCategory = (p.category || '').trim()
    if (rawCategory) return rawCategory
    if (p.type === 'Set') {
      const fromIncludes = (p.includes || '').trim()
      if (fromIncludes) return fromIncludes
      return 'Set Collection'
    }
    return ''
  }

  const byNewArrival = browseMode === 'new'
    ? products.filter((p) => isProductNewArrival(p, Date.now(), newArrivalWindowDays))
    : products

  const filtered = byNewArrival.filter((p) => (type === 'All' ? true : p.type === type))
  const categories = Array.from(new Set(filtered.map((p) => getSubcategory(p)).filter(Boolean)))
  const categoryFiltered = filtered.filter((p) => (category === 'All' ? true : getSubcategory(p) === category))
  const final = sortBy === 'newest' ? sortProductsByRecent(categoryFiltered) : categoryFiltered
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0)

  return (
    <div className="space-y-8">
      <section className="rounded-card border border-maroon/10 bg-gradient-to-br from-cream via-cream to-gold-soft/20 p-6 shadow-sm">
        <div className="space-y-3 sm:space-y-4">
          <h2 className="max-w-3xl text-3xl font-serif font-semibold leading-tight text-maroon-deep sm:text-4xl lg:text-5xl">Handpicked Sarees and Blouses for Every Celebration</h2>
          <p className="max-w-2xl text-base leading-7 text-ink/75">Explore curated drapes, statement blouses, and complete festive sets designed to make your look effortlessly elegant.</p>
        </div>
        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-maroon/20 to-transparent" />
      </section>

      <section className={SHOP_LAYOUT_CLASSES.contentWithCart}>
        <div className="space-y-6">
          <div className="space-y-3 md:hidden">
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => { setBrowseMode('all'); setCategory('All') }}
                className={`shrink-0 rounded-chip px-4 py-2 text-sm font-medium transition ${browseMode==='all' ? 'bg-maroon text-white ring-1 ring-maroon-deep/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]' : 'bg-white text-ink shadow-sm hover:bg-cream'}`}
              >
                All Products
              </button>
              <button
                onClick={() => { setBrowseMode('new'); setCategory('All') }}
                className={`shrink-0 rounded-chip px-4 py-2 text-sm font-medium transition ${browseMode==='new' ? 'bg-maroon text-white ring-1 ring-maroon-deep/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]' : 'bg-white text-ink shadow-sm hover:bg-cream'}`}
              >
                New Arrivals
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {types.map((t) => (
                <button
                  key={`mobile-${t}`}
                  onClick={() => { setType(t); setCategory('All') }}
                  className={`shrink-0 rounded-chip px-4 py-2 text-sm font-medium transition ${type===t ? 'bg-maroon text-white ring-1 ring-maroon-deep/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]' : 'bg-white text-ink shadow-sm hover:bg-cream'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setBrowseMode('all'); setCategory('All') }}
                className={`rounded-chip px-4 py-2 text-sm font-medium transition ${browseMode==='all' ? 'bg-maroon text-white ring-1 ring-maroon-deep/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]' : 'bg-white text-ink shadow-sm hover:bg-cream'}`}
              >
                All Products
              </button>
              <button
                onClick={() => { setBrowseMode('new'); setCategory('All') }}
                className={`rounded-chip px-4 py-2 text-sm font-medium transition ${browseMode==='new' ? 'bg-maroon text-white ring-1 ring-maroon-deep/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]' : 'bg-white text-ink shadow-sm hover:bg-cream'}`}
              >
                New Arrivals
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => { setType(t); setCategory('All') }}
                  className={`rounded-chip px-4 py-2 text-sm font-medium transition ${type===t ? 'bg-maroon text-white ring-1 ring-maroon-deep/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]' : 'bg-white text-ink shadow-sm hover:bg-cream'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <label className="flex items-center gap-2 text-sm text-ink/70">
              <span>Sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'featured' | 'newest')}
                className="rounded-chip border border-maroon/20 bg-white px-3 py-2 text-sm text-ink shadow-sm"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
              </select>
            </label>
          </div>

          {type !== 'All' && (
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setCategory('All')} className={`rounded-chip px-3 py-2 text-sm font-medium transition ${category==='All'? 'bg-maroon text-white ring-1 ring-maroon-deep/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]' : 'bg-white text-ink shadow-sm hover:bg-cream'}`}>All</button>
              {categories.map((c) => (
                <button key={c} onClick={() => setCategory(c)} className={`rounded-chip px-3 py-2 text-sm font-medium transition ${category===c? 'bg-maroon text-white ring-1 ring-maroon-deep/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]' : 'bg-white text-ink shadow-sm hover:bg-cream'}`}>{c}</button>
              ))}
            </div>
          )}

          <div className={SHOP_LAYOUT_CLASSES.productGrid}>
            {final.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={(prod) => add(prod)} />
            ))}
          </div>
        </div>

        <div className={SHOP_LAYOUT_CLASSES.desktopCartRegion}>
          <CartDrawer />
        </div>
      </section>

      {totalQty > 0 && (
        <div className="fixed bottom-4 right-4 z-40 hidden rounded-chip border border-maroon/20 bg-white px-4 py-2 text-sm font-semibold text-maroon shadow-lg md:block">
          {totalQty} item{totalQty === 1 ? '' : 's'} in cart
        </div>
      )}
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

