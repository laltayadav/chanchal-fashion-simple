"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { Product } from '../lib/types'
import { AdminProductForm } from './AdminProductForm'
import { DEFAULT_NEW_ARRIVAL_WINDOW_DAYS, formatAbsoluteDate, formatNewArrivalUntil, formatRelativeAge, getNewArrivalAttentionState, sortProductsByRecent } from '../lib/product-recency'

function defaultProduct(): Partial<Product> {
  return {
    type: 'Saree',
    name: '',
    category: '',
    size: '',
    price: 0,
    discountPrice: undefined,
    image: '',
    inStock: true,
    newArrivalEnabled: true,
    newArrivalUntil: undefined,
  }
}

export function AdminProductsManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [newArrivalWindowDays, setNewArrivalWindowDays] = useState(DEFAULT_NEW_ARRIVAL_WINDOW_DAYS)
  const [productForm, setProductForm] = useState<Partial<Product>>(defaultProduct())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [savingProduct, setSavingProduct] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/products').then((r) => r.json()).then(setProducts)
    fetch('/api/config')
      .then((r) => r.json())
      .then((cfg) => {
        const parsed = Number(cfg?.newArrivalWindowDays)
        if (!Number.isFinite(parsed)) return
        setNewArrivalWindowDays(Math.max(1, Math.min(365, Math.trunc(parsed))))
      })
  }, [])

  const sortedProducts = useMemo(() => sortProductsByRecent(products), [products])

  async function saveProduct() {
    if (!productForm.name || !productForm.type || !productForm.category) {
      setMessage('Product name, type, and category are required.')
      return
    }
    setSavingProduct(true)
    const payload: any = {
      ...productForm,
      price: Number(productForm.price || 0),
      discountPrice: productForm.discountPrice !== undefined ? Number(productForm.discountPrice) : undefined,
      inStock: productForm.inStock !== false,
    }

    if (Array.isArray(payload.images)) {
      const imgs: string[] = payload.images
      const dataUrls = imgs.filter((s) => typeof s === 'string' && s.startsWith('data:'))
      const remoteUrls = Array.from(new Set(imgs.filter((s) => typeof s === 'string' && !s.startsWith('data:')).map((s) => s.trim()).filter(Boolean)))
      if (dataUrls.length) {
        payload.imageBase64s = dataUrls.map((d) => d.split(',')[1])
      }
      if (editingId) {
        // For edits, productForm already contains existing images; sending only the current
        // non-data URLs avoids duplicating entries on repeated saves.
        payload.images = remoteUrls
      } else {
        payload.images = remoteUrls.length ? remoteUrls : undefined
      }
    } else if (typeof payload.image === 'string' && payload.image.startsWith('data:')) {
      const [, base64] = payload.image.split(',')
      payload.imageBase64 = base64
      delete payload.image
    }

    const method = editingId ? 'PUT' : 'POST'
    const body = editingId ? { id: editingId, ...payload } : payload
    const res = await fetch('/api/products', { method, body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } })
    setSavingProduct(false)
    if (res.ok) {
      const created = await res.json().catch(() => null)
      const updated = await (await fetch('/api/products')).json()
      setProducts(updated)
      if (editingId) {
        const saved = updated.find((p: Product) => p.id === editingId)
        setProductForm(saved || defaultProduct())
        setMessage('Product saved. Images updated.')
      } else if (created && created.id) {
        setEditingId(created.id)
        setProductForm(created)
        setMessage('Product created and ready for more edits.')
      } else {
        setProductForm(defaultProduct())
        setEditingId(null)
        setMessage('Product saved successfully.')
      }
    } else {
      const data = await res.json().catch(() => null)
      setMessage(data?.error || 'Failed to save product. Please check the values.')
    }
  }

  async function handleDeleteImage(imgPath: string) {
    setMessage('')
    if (!editingId) {
      setProductForm((cur) => ({ ...cur, images: (cur.images || []).filter((i) => i !== imgPath) }))
      return
    }

    let p = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath
    const existing = products.find((item) => item.id === editingId)
    const existingImgs = existing ? (existing.images || (existing.image ? [existing.image] : [])) : []
    const remaining = existingImgs.filter((i) => i !== p)

    if (p.startsWith('uploads/')) {
      const del = await fetch('/api/images', { method: 'DELETE', body: JSON.stringify({ path: p }), headers: { 'Content-Type': 'application/json' } })
      if (!del.ok) {
        setMessage('Failed to delete image file.')
        return
      }
    }

    const res = await fetch('/api/products', { method: 'PUT', body: JSON.stringify({ id: editingId, images: remaining }), headers: { 'Content-Type': 'application/json' } })
    if (res.ok) {
      const updated = await (await fetch('/api/products')).json()
      setProducts(updated)
      const saved = updated.find((item: Product) => item.id === editingId)
      setProductForm(saved || defaultProduct())
      setMessage('Image removed.')
    } else {
      setMessage('Failed to update product after image deletion.')
    }
  }

  function startEdit(product: Product) {
    setEditingId(product.id)
    setProductForm(product)
    setMessage('')
  }

  async function deleteProduct(id: string) {
    const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setProducts((cur) => cur.filter((p) => p.id !== id))
      if (editingId === id) {
        setEditingId(null)
        setProductForm(defaultProduct())
      }
      setMessage('Product deleted.')
    } else {
      setMessage('Failed to delete product.')
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Products</h2>
            <p className="text-sm text-stone-500">Create, edit, and delete products available in the shop.</p>
          </div>
          <button onClick={() => { setEditingId(null); setProductForm(defaultProduct()); setMessage('') }} className="rounded-full border border-amber-900 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50">New product</button>
        </div>

        <div className="mt-4 space-y-3">
          {sortedProducts.length === 0 ? <div className="text-sm text-stone-500">No products yet.</div> : null}
          {sortedProducts.map((product) => (
            <div key={product.id} className="flex flex-col gap-3 rounded-3xl border border-stone-200 bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-semibold">{product.name}</div>
                <div className="text-sm text-stone-600">{product.type} • {product.category}</div>
                {product.size ? <div className="text-xs text-stone-500">Size: {product.size}</div> : null}
                {(() => {
                  const newArrivalState = getNewArrivalAttentionState(product, newArrivalWindowDays)
                  const isAlert = newArrivalState === 'expiring' || newArrivalState === 'expired'
                  const stateText = newArrivalState === 'active'
                    ? 'Active'
                    : newArrivalState === 'expiring'
                      ? 'Expiring soon'
                      : newArrivalState === 'expired'
                        ? 'Expired'
                        : 'Inactive'

                  return (
                    <div className={`mt-1 text-xs ${isAlert ? 'font-semibold text-red-700' : 'text-stone-500'}`}>
                      New arrivals: {stateText} • Until: {formatNewArrivalUntil(product, newArrivalWindowDays)}
                    </div>
                  )
                })()}
                <div className="mt-1 text-xs text-stone-500">
                  Added: {formatAbsoluteDate(product.createdAt)} ({formatRelativeAge(product.createdAt)})
                </div>
                <div className="text-xs text-stone-500">
                  Updated: {formatAbsoluteDate(product.updatedAt)} ({formatRelativeAge(product.updatedAt)})
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => startEdit(product)} className="rounded-full border border-amber-900 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50">Edit</button>
                <button onClick={() => deleteProduct(product.id)} className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100">Delete</button>
              </div>
            </div>
          ))}
        </div>
        {message ? <div className="mt-4 rounded-3xl bg-stone-100 p-4 text-sm text-stone-700">{message}</div> : null}
      </div>

      <AdminProductForm
        product={productForm}
        onChange={setProductForm}
        onSave={saveProduct}
        onDelete={editingId ? () => deleteProduct(editingId) : undefined}
        onDeleteImage={handleDeleteImage}
        saving={savingProduct}
        newArrivalWindowDays={newArrivalWindowDays}
      />
    </section>
  )
}
