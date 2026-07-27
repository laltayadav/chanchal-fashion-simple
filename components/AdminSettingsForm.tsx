"use client"

import { useEffect, useState } from 'react'
import { normalizeAndValidateWhatsappNumber } from '../lib/whatsapp-number'

export function AdminSettingsForm() {
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [settingsMessage, setSettingsMessage] = useState('')
  const [securityMessage, setSecurityMessage] = useState('')

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((c) => {
        setName(c.shopName || '')
        setWhatsapp(c.whatsapp || '')
      })
      .catch(() => {})
  }, [])

  async function saveSettings() {
    const parsedWhatsapp = normalizeAndValidateWhatsappNumber(whatsapp)
    if (parsedWhatsapp.error) {
      setSettingsMessage(parsedWhatsapp.error)
      setTimeout(() => setSettingsMessage(''), 3000)
      return
    }

    const res = await fetch('/api/config', {
      method: 'PUT',
      body: JSON.stringify({ shopName: name, whatsapp: parsedWhatsapp.normalized }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      setWhatsapp(parsedWhatsapp.normalized)
      setSettingsMessage('Shop settings saved.')
    } else {
      const data = await res.json().catch(() => null)
      setSettingsMessage(data?.error || 'Failed to save shop settings.')
    }
    setTimeout(() => setSettingsMessage(''), 3000)
  }

  async function saveSecurity() {
    const res = await fetch('/api/admin/security', {
      method: 'PUT',
      body: JSON.stringify({ adminPassword }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      setAdminPassword('')
      setSecurityMessage('Admin password updated.')
    } else {
      const data = await res.json().catch(() => null)
      setSecurityMessage(data?.error || 'Failed to update password.')
    }
    setTimeout(() => setSecurityMessage(''), 3000)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Shop settings</h2>
        <div className="grid gap-4">
          <label className="space-y-2">
            <span className="text-sm font-medium">Shop name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium">WhatsApp number</span>
            <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full rounded-2xl border border-stone-300 px-4 py-3" placeholder="10-digit mobile or 91XXXXXXXXXX" />
          </label>
          <button onClick={saveSettings} className="rounded-full bg-amber-900 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-800">Save settings</button>
          {settingsMessage ? <div className="text-sm text-emerald-700">{settingsMessage}</div> : null}
        </div>
      </section>

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Security</h2>
        <div className="grid gap-4">
          <label className="space-y-2">
            <span className="text-sm font-medium">New admin password</span>
            <input
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              type="password"
              className="w-full rounded-2xl border border-stone-300 px-4 py-3"
              placeholder="At least 12 characters"
            />
          </label>
          <button onClick={saveSecurity} className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-800">Update password</button>
          {securityMessage ? <div className="text-sm text-emerald-700">{securityMessage}</div> : null}
        </div>
      </section>
    </div>
  )
}
