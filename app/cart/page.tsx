"use client"
import React, { useEffect, useState } from 'react'
import { CartProvider, useCart } from '../../components/CartContext'

function CartInner() {
  const { items, clear } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [whatsapp, setWhatsapp] = useState('')

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((c) => setWhatsapp(c.whatsapp || ''))
      .catch(() => setWhatsapp(''))
  }, [])

  const total = items.reduce((s, i) => s + i.unitPrice * i.qty, 0)

  async function submit() {
    const payload = { items, total, name, phone, note }
    const res = await fetch('/api/orders', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
    if (res.ok) {
      const data = await res.json()
      const text = encodeURIComponent(`Order %0AName: ${name}%0APhone: ${phone}%0AItems:%0A${items.map(i => `${i.qty}x ${i.name} - ₹${i.unitPrice}`).join('%0A')}%0ATotal: ₹${total}%0ANote: ${note}`)
      const waNumber = whatsapp || ''
      if (!waNumber) {
        alert('WhatsApp number is not configured. Please set it in Admin settings.')
        return
      }
      const url = `https://wa.me/${waNumber}?text=${text}`
      window.open(url, '_blank')
      clear()
    } else {
      const error = await res.json().catch(() => null)
      alert(error?.error || 'Failed to submit order')
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Cart</h1>
      <div className="mb-4">
        <label className="block mb-1">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded" />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Note</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full p-2 border rounded" />
      </div>
      <div className="mb-4 font-semibold">Total: ₹{total}</div>
      <button onClick={submit} className="px-4 py-2 bg-maroon text-white rounded">Send Order via WhatsApp</button>
    </div>
  )
}

export default function CartPage() {
  return (
    <CartProvider>
      <CartInner />
    </CartProvider>
  )
}

