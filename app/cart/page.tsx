"use client"
import React, { useEffect, useState } from 'react'
import { useCart } from '../../components/CartContext'
import AppShell from '../../components/AppShell'

function CartInner() {
  const { items, remove, updateQty, clear } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((c) => setWhatsapp(c.whatsapp || ''))
      .catch(() => setWhatsapp(''))
  }, [])

  const total = items.reduce((s, i) => s + i.unitPrice * i.qty, 0)

  async function submit() {
    if (!name.trim() || !phone.trim()) {
      setMessage('Please provide your name and phone number.')
      return
    }
    if (items.length === 0) {
      setMessage('Add at least one item to the cart before placing an order.')
      return
    }
    setLoading(true)
    const payload = { items, total, name, phone, note }
    const res = await fetch('/api/orders', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
    setLoading(false)
    if (res.ok) {
      const plain = `Order\nName: ${name}\nPhone: ${phone}\nItems:\n${items.map(i => `${i.qty}x ${i.name} - ₹${i.unitPrice}`).join('\n')}\nTotal: ₹${total}\nNote: ${note}`
      const text = encodeURIComponent(plain)
      const waNumber = whatsapp || ''
      if (!waNumber) {
        setMessage('WhatsApp number is not configured. Please set it in Admin settings.')
        return
      }
      const url = `https://wa.me/${waNumber}?text=${text}`
      window.open(url, '_blank')
      clear()
      setName('')
      setPhone('')
      setNote('')
      setMessage('Order created and WhatsApp opened. Clear the cart before placing another order.')
    } else {
      const error = await res.json().catch(() => null)
      setMessage(error?.error || 'Failed to submit order')
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-4">Your cart</h1>

        {items.length === 0 ? (
          <div className="text-stone-500">Your cart is empty. Add items from the shop page.</div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="rounded-3xl border border-stone-200 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-stone-500">₹{item.unitPrice} each</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.productId, item.qty - 1)} className="h-9 w-9 rounded-full border border-stone-300 text-lg font-semibold">−</button>
                    <span className="min-w-[2rem] text-center text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item.productId, item.qty + 1)} className="h-9 w-9 rounded-full border border-stone-300 text-lg font-semibold">+</button>
                    <button onClick={() => remove(item.productId)} className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-700">Remove</button>
                  </div>
                </div>
                <div className="mt-3 text-sm text-stone-600">Subtotal: ₹{item.unitPrice * item.qty}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xl font-semibold">Total: ₹{total}</div>
          <button onClick={submit} disabled={loading || items.length === 0} className="rounded-full bg-amber-900 px-6 py-3 text-white transition hover:bg-amber-800 disabled:opacity-50">
            {loading ? 'Submitting…' : 'Send order via WhatsApp'}
          </button>
        </div>

        {message ? <div className="mt-3 rounded-2xl bg-stone-100 p-3 text-sm text-stone-700">{message}</div> : null}
      </section>

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Customer details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium">Phone</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
          </label>
        </div>
        <label className="mt-4 block space-y-2">
          <span className="text-sm font-medium">Note</span>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full rounded-2xl border border-stone-300 px-4 py-3" rows={4} />
        </label>
      </section>
    </div>
  )
}

export default function CartPage() {
  return (
    <AppShell>
      <CartInner />
    </AppShell>
  )
}

