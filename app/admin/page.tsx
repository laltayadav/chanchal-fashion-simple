"use client"
import React, { useEffect, useState } from 'react'
import { Product } from '../../lib/types'

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false)
  const [pw, setPw] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [config, setConfig] = useState<{ shopName?: string; whatsapp?: string; adminPassword?: string }>({})
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((c) => {
        setConfig(c)
        setName(c.shopName || '')
        setWhatsapp(c.whatsapp || '')
        setAdminPassword(c.adminPassword || '')
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (authorized) {
      fetch('/api/products').then((r) => r.json()).then(setProducts)
      fetch('/api/orders').then((r) => r.json()).then(setOrders)
      fetch('/api/config').then((r) => r.json()).then((c) => {
        setConfig(c)
        setName(c.shopName || '')
        setWhatsapp(c.whatsapp || '')
        setAdminPassword(c.adminPassword || '')
      }).catch(() => {})
    }
  }, [authorized])

  function login() {
    const secret = config.adminPassword || 'admin'
    if (pw === secret) {
      setAuthorized(true)
    } else {
      alert('Incorrect password')
    }
  }

  async function saveConfig() {
    const res = await fetch('/api/config', {
      method: 'PUT',
      body: JSON.stringify({ shopName: name, whatsapp, adminPassword }),
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.ok) {
      setSaveMessage('Settings saved successfully.')
      setTimeout(() => setSaveMessage(''), 3000)
    } else {
      setSaveMessage('Failed to save settings. Please try again.')
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  async function createProduct() {
    const p: any = {
      type: 'Saree',
      name: 'New Product',
      category: 'Silk',
      price: 1000,
      discountPrice: 900,
      image: 'https://images.unsplash.com/photo-1610030181087-540965ecca9b?w=800',
      inStock: true
    }
    const res = await fetch('/api/products', { method: 'POST', body: JSON.stringify(p), headers: { 'Content-Type': 'application/json' } })
    if (res.ok) setProducts(await (await fetch('/api/products')).json())
  }

  if (!authorized) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">Admin</h1>
        <input value={pw} onChange={(e)=>setPw(e.target.value)} placeholder="Admin password" className="p-2 border rounded mb-2" />
        <div><button onClick={login} className="px-3 py-1 bg-maroon text-white rounded">Enter</button></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
      <section className="mb-6">
        <h2 className="font-medium mb-2">Settings</h2>
        <div className="mb-2">
          <label className="block">Shop name</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} className="p-2 border rounded w-full" />
        </div>
        <div className="mb-2">
          <label className="block">WhatsApp (E.164 without +)</label>
          <input value={whatsapp} onChange={(e)=>setWhatsapp(e.target.value)} className="p-2 border rounded w-full" />
        </div>
        <div className="mb-2">
          <label className="block">Admin password</label>
          <input value={adminPassword} onChange={(e)=>setAdminPassword(e.target.value)} type="password" className="p-2 border rounded w-full" />
          <p className="text-sm text-gray-500 mt-1">If no password is set, the default admin password is <strong>admin</strong>.</p>
        </div>
        <button onClick={saveConfig} className="px-3 py-1 bg-maroon text-white rounded">Save</button>
        {saveMessage ? <div className="mt-3 text-sm text-green-700">{saveMessage}</div> : null}
      </section>

      <section className="mb-6">
        <h2 className="font-medium mb-2">Products</h2>
        <div className="mb-2"><button onClick={createProduct} className="px-3 py-1 bg-green-600 text-white rounded">Create sample product</button></div>
        <ul>
          {products.map(p => (
            <li key={p.id} className="mb-2">{p.name} — {p.type} — {p.category} — {p.inStock? 'In stock': 'Out'}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-medium mb-2">Orders</h2>
        <ul>
          {orders.map((o:any) => (
            <li key={o.id} className="mb-2">{o.name} — {o.phone} — ₹{o.total} — {o.timestamp}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

