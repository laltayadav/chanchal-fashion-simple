"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginForm() {
  const router = useRouter()
  const [pw, setPw] = useState('')
  const [rememberDevice, setRememberDevice] = useState(true)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function login() {
    setMessage('')
    setLoading(true)
    const res = await fetch('/api/admin/check', {
      method: 'POST',
      body: JSON.stringify({ password: pw, rememberDevice }),
      headers: { 'Content-Type': 'application/json' },
    })

    setLoading(false)
    if (res.ok) {
      router.refresh()
      return
    }

    const data = await res.json().catch(() => null)
    if (res.status === 423) {
      setMessage(data?.error ? 'Too many failed attempts. Please try again later.' : 'Admin access is temporarily locked.')
    } else {
      setMessage(data?.error ? 'Incorrect password.' : 'Unable to unlock admin access.')
    }
  }

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold mb-4">Admin Access</h1>
      <p className="mb-4 text-stone-600">Enter the admin password to manage products and view orders.</p>
      <input
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        placeholder="Admin password"
        type="password"
        className="w-full rounded-2xl border border-stone-300 px-4 py-3 mb-4"
      />
      <label className="mb-4 flex items-center gap-3 text-sm text-stone-700">
        <input
          type="checkbox"
          checked={rememberDevice}
          onChange={(e) => setRememberDevice(e.target.checked)}
          className="h-4 w-4 rounded border-stone-300"
        />
        Remember this device
      </label>
      <button
        onClick={login}
        disabled={loading}
        className="w-full rounded-full bg-amber-900 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-50"
      >
        {loading ? 'Unlocking…' : 'Unlock'}
      </button>
      {message ? <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{message}</div> : null}
    </div>
  )
}
