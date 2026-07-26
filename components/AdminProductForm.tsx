"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Product, ProductType } from '../lib/types'

type Props = {
  product: Partial<Product>
  onChange: (product: Partial<Product>) => void
  onSave: () => void
  onDelete?: () => void
  onDeleteImage?: (imgPath: string) => void
  saving?: boolean
}

const productTypes: ProductType[] = ['Saree', 'Blouse', 'Set']

export function AdminProductForm({ product, onChange, onSave, onDelete, onDeleteImage, saving }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [preview, setPreview] = useState('')
  const [thumbs, setThumbs] = useState<string[]>([])

  function normalizePreview(src?: string) {
    if (!src) return ''
    if (src.startsWith('uploads/')) return `/${src}`
    return src
  }

  useEffect(() => {
    const imgs = Array.isArray(product.images) ? product.images : (product.image ? [product.image] : [])
    const normalized = imgs.map(normalizePreview)
    setThumbs(normalized)
    setPreview(normalized[0] || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.images, product.image])

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    Promise.all(files.map((file) => new Promise<string>((res) => {
      const reader = new FileReader()
      reader.onload = () => res(reader.result as string)
      reader.readAsDataURL(file)
    }))).then((dataUrls) => {
      const combined = [ ...(product.images || []), ...dataUrls ]
      const normalized = combined.map(normalizePreview)
      setThumbs(normalized)
      setPreview(normalized[0] || '')
      onChange({ ...product, images: combined })
    })
  }

  return (
    <div className="space-y-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="space-y-3">
        <span className="text-sm font-semibold">Image preview</span>
        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-stone-50 p-4">
          {preview ? (
            <img src={preview} alt="Product preview" className="h-40 w-full object-cover rounded-2xl" />
          ) : (
            <div className="flex h-40 items-center justify-center text-sm text-stone-500">No image selected</div>
          )}
          {thumbs.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto items-center">
              {thumbs.map((t, idx) => {
                const rawImgs = Array.isArray(product.images) ? product.images : (product.image ? [product.image] : [])
                const isPrimary = idx === 0
                return (
                  <div key={idx} className="relative flex-none">
                    <img src={t} onClick={() => setPreview(t)} className="h-16 w-16 rounded-lg object-cover" />
                    <div className="mt-1 flex gap-1 justify-center">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const arr = rawImgs.slice()
                          ;[arr[idx-1], arr[idx]] = [arr[idx], arr[idx-1]]
                          onChange({ ...product, images: arr })
                          setThumbs(arr.map(normalizePreview))
                          setPreview(normalizePreview(arr[0]))
                        }}
                        className="rounded-md bg-stone-100 px-1 text-sm disabled:opacity-40">◀</button>
                      <button
                        type="button"
                        disabled={idx === rawImgs.length - 1}
                        onClick={() => {
                          const arr = rawImgs.slice()
                          ;[arr[idx], arr[idx+1]] = [arr[idx+1], arr[idx]]
                          onChange({ ...product, images: arr })
                          setThumbs(arr.map(normalizePreview))
                          setPreview(normalizePreview(arr[0]))
                        }}
                        className="rounded-md bg-stone-100 px-1 text-sm disabled:opacity-40">▶</button>
                    </div>
                    <div className="absolute left-0 top-0 flex gap-1">
                      <button type="button" onClick={() => {
                        const arr = rawImgs.slice()
                        // move selected to front
                        const [sel] = arr.splice(idx, 1)
                        arr.unshift(sel)
                        onChange({ ...product, images: arr })
                        setThumbs(arr.map(normalizePreview))
                        setPreview(normalizePreview(arr[0]))
                      }} className={`rounded-full px-1 text-xs ${isPrimary ? 'bg-amber-900 text-white' : 'bg-white text-stone-700'}`}>{isPrimary ? 'Primary' : 'Set'}</button>
                    </div>
                    <button type="button" onClick={() => {
                      const toRemove = rawImgs[idx]
                      if (!toRemove) return
                      const ok = window.confirm('Delete this image?')
                      if (!ok) return
                      const remaining = rawImgs.filter((_, i) => i !== idx)
                      onChange({ ...product, images: remaining })
                      if (typeof onDeleteImage === 'function') onDeleteImage(toRemove)
                      const normalized = remaining.map(normalizePreview)
                      setThumbs(normalized)
                      setPreview(normalized[0] || '')
                    }} className="absolute right-0 top-0 rounded-full bg-red-600 text-white p-0.5 text-xs">×</button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-800">
            Upload images
          </button>
          <span className="text-sm text-stone-500">or paste image URLs (comma separated) below</span>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
        <input value={(product.images || []).filter(Boolean).join(',')}
          onChange={(e) => onChange({ ...product, images: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
          placeholder="https://... , https://..."
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 mt-2" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold">Type</span>
          <select value={product.type || ''} onChange={(e) => onChange({ ...product, type: e.target.value as ProductType })} className="w-full rounded-2xl border border-stone-300 px-4 py-3">
            <option value="">Select type</option>
            {productTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Name</span>
          <input value={product.name || ''} onChange={(e) => onChange({ ...product, name: e.target.value })} className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold">Category</span>
          <input value={product.category || ''} onChange={(e) => onChange({ ...product, category: e.target.value })} className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Image URL</span>
          <input value={product.image || ''} onChange={(e) => onChange({ ...product, image: e.target.value })} className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold">Size</span>
          <input
            value={product.size || ''}
            onChange={(e) => onChange({ ...product, size: e.target.value })}
            placeholder="Free Size, 38 inch, XL"
            className="w-full rounded-2xl border border-stone-300 px-4 py-3"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-semibold">Price</span>
          <input type="number" value={product.price ?? ''} onChange={(e) => onChange({ ...product, price: Number(e.target.value) })} className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Discount Price</span>
          <input type="number" value={product.discountPrice ?? ''} onChange={(e) => onChange({ ...product, discountPrice: e.target.value ? Number(e.target.value) : undefined })} className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">In stock</span>
          <select value={product.inStock === false ? 'false' : 'true'} onChange={(e) => onChange({ ...product, inStock: e.target.value === 'true' })} className="w-full rounded-2xl border border-stone-300 px-4 py-3">
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </label>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        {onDelete ? (
          <button type="button" onClick={onDelete} className="rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-100">
            Delete
          </button>
        ) : null}
        <button type="button" onClick={onSave} disabled={saving} className="rounded-full bg-amber-900 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save product'}
        </button>
      </div>
    </div>
  )
}
