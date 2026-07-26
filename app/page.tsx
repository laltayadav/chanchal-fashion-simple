"use client"
import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { CartProvider, useCart } from '../components/CartContext'
import { Product } from '../lib/types'

function ShopInner() {
  const [products, setProducts] = useState<Product[]>([])
  const [type, setType] = useState<'All' | 'Saree' | 'Blouse' | 'Set'>('All')
  const [category, setCategory] = useState<string>('All')
  const { add } = useCart()

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
    <div className="p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Chanchal — Weave Your Own Story</h1>
      </header>

      <div className="mb-4 flex gap-2">
        {types.map((t) => (
          <button key={t} onClick={() => { setType(t); setCategory('All') }} className={`px-3 py-1 rounded ${type===t? 'bg-maroon text-white' : 'bg-gray-100'}`}>{t}</button>
        ))}
      </div>

      {type !== 'All' && (type === 'Saree' || type === 'Blouse') && (
        <div className="mb-4 flex gap-2 overflow-auto">
          <button onClick={() => setCategory('All')} className={`px-2 py-1 rounded ${category==='All'? 'bg-maroon text-white':'bg-gray-100'}`}>All</button>
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`px-2 py-1 rounded ${category===c? 'bg-maroon text-white':'bg-gray-100'}`}>{c}</button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {final.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={(prod) => add(prod)} />
        ))}
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <CartProvider>
      <ShopInner />
    </CartProvider>
  )
}

