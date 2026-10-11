"use client"

import { useEffect, useRef, useState } from 'react'
import { normalizeAndValidateWhatsappNumber } from '../lib/whatsapp-number'
import { DEFAULT_NEW_ARRIVAL_WINDOW_DAYS } from '../lib/product-recency'
import { getHomepageContent, isValidHomepageImagePath, MAX_HOMEPAGE_IMAGES } from '../lib/homepage-content'
import type { HomepageSlide } from '../lib/types'

export function AdminSettingsForm() {
  const homepageImagesInput = useRef<HTMLInputElement | null>(null)
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [newArrivalWindowDays, setNewArrivalWindowDays] = useState(DEFAULT_NEW_ARRIVAL_WINDOW_DAYS)
  const [homepageTitle, setHomepageTitle] = useState('')
  const [homepageDescription, setHomepageDescription] = useState('')
  const [homepageSlides, setHomepageSlides] = useState<HomepageSlide[]>([])
  const [savingSettings, setSavingSettings] = useState(false)
  const [settingsLoaded, setSettingsLoaded] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [settingsMessage, setSettingsMessage] = useState('')
  const [settingsError, setSettingsError] = useState(false)
  const [securityMessage, setSecurityMessage] = useState('')

  function showSettingsMessage(message: string, isError = false) {
    setSettingsMessage(message)
    setSettingsError(isError)
    if (message) setTimeout(() => setSettingsMessage(''), 3000)
  }

  useEffect(() => {
    fetch('/api/config')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load shop settings')
        return r.json()
      })
      .then((c) => {
        setName(c.shopName || '')
        setWhatsapp(c.whatsapp || '')
        const parsed = Number(c.newArrivalWindowDays)
        setNewArrivalWindowDays(Number.isFinite(parsed) ? Math.max(1, Math.min(365, Math.trunc(parsed))) : DEFAULT_NEW_ARRIVAL_WINDOW_DAYS)
        const homepage = getHomepageContent(c)
        setHomepageTitle(homepage.title)
        setHomepageDescription(homepage.description)
        setHomepageSlides(homepage.slides)
        setSettingsLoaded(true)
      })
      .catch(() => showSettingsMessage('Could not load shop settings. Refresh the page before editing.', true))
  }, [])

  async function handleHomepageImagesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (files.length === 0) return

    const supportedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (files.some((file) => !supportedTypes.includes(file.type.toLowerCase()))) {
      showSettingsMessage('Choose a JPEG, PNG, or WebP image.', true)
      return
    }
    if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      showSettingsMessage('Homepage images must be 5 MB or smaller.', true)
      return
    }
    if (homepageSlides.length + files.length > MAX_HOMEPAGE_IMAGES) {
      showSettingsMessage(`You can add up to ${MAX_HOMEPAGE_IMAGES} homepage images.`, true)
      return
    }

    try {
      const dataUrls = await Promise.all(files.map((file) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = () => reject(new Error('Could not read a selected image'))
        reader.onload = () => typeof reader.result === 'string'
          ? resolve(reader.result)
          : reject(new Error('Could not read a selected image'))
        reader.readAsDataURL(file)
      })))
      setHomepageSlides((current) => [
        ...current,
        ...dataUrls.map((image) => ({ image, title: '', description: '' })),
      ].slice(0, MAX_HOMEPAGE_IMAGES))
      showSettingsMessage('')
    } catch {
      showSettingsMessage('Could not read the selected images. Please try again.', true)
    }
  }

  async function saveSettings() {
    if (!homepageTitle.trim() || !homepageDescription.trim()) {
      showSettingsMessage('Enter a master headline and supporting text before saving.', true)
      return
    }

    const parsedWhatsapp = normalizeAndValidateWhatsappNumber(whatsapp)
    if (parsedWhatsapp.error) {
      showSettingsMessage(parsedWhatsapp.error, true)
      return
    }

    const normalizedWindow = Math.max(1, Math.min(365, Math.trunc(Number(newArrivalWindowDays) || DEFAULT_NEW_ARRIVAL_WINDOW_DAYS)))

    setSavingSettings(true)
    try {
      const payload: Record<string, string | number | string[] | HomepageSlide[]> = {
        shopName: name,
        whatsapp: parsedWhatsapp.normalized,
        newArrivalWindowDays: normalizedWindow,
        homepageTitle,
        homepageDescription,
        homepageSlides,
      }

      const res = await fetch('/api/config', {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      })

      if (res.ok) {
        setWhatsapp(parsedWhatsapp.normalized)
        setNewArrivalWindowDays(normalizedWindow)
        const data = await res.json()
        setHomepageSlides(data.homepageSlides || [])
        showSettingsMessage('Shop and homepage settings saved.')
      } else {
        const data = await res.json().catch(() => null)
        showSettingsMessage(data?.error || 'Failed to save shop settings.', true)
      }
    } catch {
      showSettingsMessage('Could not save shop settings. Please try again.', true)
    } finally {
      setSavingSettings(false)
    }
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
          <label className="space-y-2">
            <span className="text-sm font-medium">New arrivals window (days)</span>
            <input
              type="number"
              min={1}
              max={365}
              value={newArrivalWindowDays}
              onChange={(e) => setNewArrivalWindowDays(Number(e.target.value) || DEFAULT_NEW_ARRIVAL_WINDOW_DAYS)}
              className="w-full rounded-2xl border border-stone-300 px-4 py-3"
            />
          </label>
          <div className="space-y-3 border-t border-stone-200 pt-4">
            <div>
              <h3 className="text-base font-semibold">Home page</h3>
              <p className="text-sm text-stone-500">Add up to {MAX_HOMEPAGE_IMAGES} images, then use the arrows to choose their order.</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
              {homepageSlides.length ? (
                <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-3">
                  {homepageSlides.map((slide, index) => (
                    <div key={`${slide.image.slice(0, 48)}-${index}`} className="overflow-hidden rounded-xl border border-stone-200">
                      <img
                        src={isValidHomepageImagePath(slide.image) ? `/${slide.image}` : slide.image}
                        alt={`Homepage slide ${index + 1}`}
                        className="h-28 w-full object-cover"
                      />
                      <div className="space-y-2 p-2">
                        <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                          <span>{index === 0 ? 'Master slide' : `Slide ${index + 1}`}</span>
                          <div className="flex gap-1">
                            <button type="button" aria-label={`Move slide ${index + 1} earlier`} disabled={!settingsLoaded || index === 0} onClick={() => setHomepageSlides((current) => current.map((item, itemIndex) => itemIndex === index ? current[index - 1] : itemIndex === index - 1 ? current[index] : item))} className="px-1 disabled:opacity-40">↑</button>
                            <button type="button" aria-label={`Move slide ${index + 1} later`} disabled={!settingsLoaded || index === homepageSlides.length - 1} onClick={() => setHomepageSlides((current) => current.map((item, itemIndex) => itemIndex === index ? current[index + 1] : itemIndex === index + 1 ? current[index] : item))} className="px-1 disabled:opacity-40">↓</button>
                            <button type="button" aria-label={`Remove slide ${index + 1}`} disabled={!settingsLoaded} onClick={() => setHomepageSlides((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="px-1 text-red-700">×</button>
                          </div>
                        </div>
                        {index > 0 ? (
                          <>
                            <input
                              aria-label={`Slide ${index + 1} title`}
                              placeholder={`Title (uses master: ${homepageTitle})`}
                              maxLength={90}
                              value={slide.title || ''}
                              onChange={(event) => setHomepageSlides((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item))}
                              className="w-full rounded-xl border border-stone-300 px-2 py-1 text-xs"
                            />
                            <textarea
                              aria-label={`Slide ${index + 1} description`}
                              placeholder="Description (uses master if blank)"
                              maxLength={220}
                              rows={2}
                              value={slide.description || ''}
                              onChange={(event) => setHomepageSlides((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item))}
                              className="w-full rounded-xl border border-stone-300 px-2 py-1 text-xs"
                            />
                          </>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-maroon-deep via-maroon to-[#8b354f] px-4 text-center text-sm font-medium text-white">
                  Branded fallback shown until you upload a hero image
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!settingsLoaded || homepageSlides.length >= MAX_HOMEPAGE_IMAGES}
                onClick={() => homepageImagesInput.current?.click()}
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-50 disabled:opacity-50"
              >
                Add hero images
              </button>
              {homepageSlides.length ? (
                <button
                  type="button"
                  disabled={!settingsLoaded}
                  onClick={() => setHomepageSlides([])}
                  className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  Remove all images
                </button>
              ) : null}
              <span className="self-center text-xs text-stone-500">JPEG, PNG, or WebP; up to 5 MB each; max {MAX_HOMEPAGE_IMAGES}</span>
            </div>
            <input
              ref={homepageImagesInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleHomepageImagesChange}
              className="hidden"
            />
            <label className="block space-y-2">
              <span className="text-sm font-medium">Headline</span>
              <input
                value={homepageTitle}
                required
                maxLength={90}
                onChange={(event) => setHomepageTitle(event.target.value)}
                className="w-full rounded-2xl border border-stone-300 px-4 py-3"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Supporting text</span>
              <textarea
                value={homepageDescription}
                required
                maxLength={220}
                onChange={(event) => setHomepageDescription(event.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-stone-300 px-4 py-3"
              />
            </label>
          </div>
          <button onClick={saveSettings} disabled={savingSettings || !settingsLoaded} className="rounded-full bg-amber-900 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-60">
            {savingSettings ? 'Saving…' : 'Save settings'}
          </button>
          {settingsMessage ? <div role="status" className={`text-sm ${settingsError ? 'text-red-700' : 'text-emerald-700'}`}>{settingsMessage}</div> : null}
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
