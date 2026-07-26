"use client"

import React, { useEffect, useState } from 'react'
import { Product } from '../lib/types'
import { AdminProductForm } from './AdminProductForm'

function defaultProduct(): Partial<Product> {
  return {
    type: 'Saree',
    name: '',
    category: '',
    price: 0,
    discountPrice: undefined,
    image: '',
    inStock: true,
  }
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [productForm, setProductForm] = useState<Partial<Product>>(defaultProduct())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [savingProduct, setSavingProduct] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((c) => {
        setName(c.shopName || '')
        setWhatsapp(c.whatsapp || '')
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch('/api/products').then((r) => r.json()).then(setProducts)
    fetch('/api/orders').then((r) => r.json()).then(setOrders)
  }, [])

  async function saveConfig() {
    const res = await fetch('/api/config', {
      method: 'PUT',
      body: JSON.stringify({ shopName: name, whatsapp, adminPassword: adminPassword || undefined }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      setSaveMessage('Settings saved successfully.')
      setTimeout(() => setSaveMessage(''), 3000)
    } else {
      setSaveMessage('Failed to save settings. Please try again.')
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

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
      const remoteUrls = imgs.filter((s) => typeof s === 'string' && !s.startsWith('data:'))
      if (dataUrls.length) {
        payload.imageBase64s = dataUrls.map((d) => d.split(',')[1])
      }
      if (editingId) {
        const existing = products.find((p) => p.id === editingId)
        const existingImgs = existing ? (existing.images || (existing.image ? [existing.image] : [])) : []
        payload.images = [...existingImgs, ...remoteUrls]
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
      setMessage('Failed to save product. Please check the values.')
    }
  }

  async function handleDeleteImage(imgPath: string) {
    setMessage('')
    if (!editingId) {
      setProductForm((cur) => ({ ...cur, images: (cur.images || []).filter((i) => i !== imgPath) }))
      return
    }

    let p = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath
    const existing = products.find((p) => p.id === editingId)
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
      const saved = updated.find((p: Product) => p.id === editingId)
      setProductForm(saved || defaultProduct())
      setMessage('Image removed.')
    } else {
      setMessage('Failed to update product after image deletion.')
    }
  }

  async function startEdit(product: Product) {
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
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <div className="grid gap-4">
              <label className="space-y-2">
                <span className="text-sm font-medium">Shop name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">WhatsApp number</span>
                <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full rounded-2xl border border-stone-300 px-4 py-3" placeholder="919876543210" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Admin password</span>
                <input value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} type="password" className="w-full rounded-2xl border border-stone-300 px-4 py-3" placeholder="Leave blank to keep current" />
              </label>
              <button onClick={saveConfig} className="rounded-full bg-amber-900 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-800">Save settings</button>
              {saveMessage ? <div className="text-sm text-emerald-700">{saveMessage}</div> : null}
            </div>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Products</h2>
                <p className="text-sm text-stone-500">Create, edit, and delete products available in the shop.</p>
              </div>
              <button onClick={() => { setEditingId(null); setProductForm(defaultProduct()); setMessage('') }} className="rounded-full border border-amber-900 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50">New product</button>
            </div>
            <div className="mt-4 space-y-3">
              {products.map((product) => (
                <div key={product.id} className="flex flex-col gap-3 rounded-3xl border border-stone-200 bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-semibold">{product.name}</div>
                    <div className="text-sm text-stone-600">{product.type} • {product.category}</div>
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
        </div>

        <div>
          <AdminProductForm
            product={productForm}
            onChange={setProductForm}
            onSave={saveProduct}
            onDelete={editingId ? () => deleteProduct(editingId) : undefined}
            onDeleteImage={handleDeleteImage}
            saving={savingProduct}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        {orders.length === 0 ? (
          <div className="text-stone-500">No orders have been placed yet.</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="rounded-3xl border border-stone-200 bg-stone-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-semibold">{order.name}</div>
                    <div className="text-sm text-stone-600">{order.phone}</div>
                  </div>
                  <div className="text-sm text-stone-500">{new Date(order.timestamp).toLocaleString()}</div>
                </div>
                <div className="mt-3 text-sm text-stone-700">Total: ₹{order.total}</div>
                {order.note ? <div className="mt-2 text-sm text-stone-600">Note: {order.note}</div> : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
