import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { Product } from '../lib/types'
import { useCart } from './CartContext'

type Props = {
  product: Product
  onAdd?: (product: Product) => void
}

export default function ProductCard({ product, onAdd }: Props) {
  const { items, add, updateQty, remove } = useCart()
  const cartItem = items.find((item) => item.productId === product.id)
  const gallery = (product.images && product.images.length > 0) ? product.images : product.image ? [product.image] : []
  const productLabel = product.type === 'Set'
    ? (product.includes || 'Saree + Blouse Set')
    : (product.category || product.type)
  const displaySrc = gallery.length ? (gallery[0].startsWith('data:') || gallery[0].startsWith('http') ? gallery[0] : `/${gallery[0]}`) : undefined
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [displayedSrc, setDisplayedSrc] = useState<string | undefined>(undefined)
  const [loadingImage, setLoadingImage] = useState(false)

  function next() { if (gallery.length === 0) return; setIndex((i) => (i + 1) % gallery.length) }
  function prev() { if (gallery.length === 0) return; setIndex((i) => (i - 1 + gallery.length) % gallery.length) }

  React.useEffect(() => {
    if (open) setIndex(0)
  }, [open, gallery.length])

  React.useEffect(() => {
    if (index >= gallery.length) setIndex(0)
  }, [gallery.length, index])

  React.useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  // preload selected image and update displayedSrc only after load to avoid flicker
  React.useEffect(() => {
    if (!open || gallery.length === 0) return
    const src = gallery[index]
    if (!src) return
    const resolved = src.startsWith('http') || src.startsWith('data:') ? src : `/${src}`
    // if currently displayed is same, nothing to do
    if (resolved === displayedSrc) return
    setLoadingImage(true)
    const img = new Image()
    img.onload = () => {
      setDisplayedSrc(resolved)
      setLoadingImage(false)
    }
    img.onerror = () => {
      // on error, still set to resolved to avoid perpetual blank
      setDisplayedSrc(resolved)
      setLoadingImage(false)
    }
    img.src = resolved
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [index, gallery, open])

  return (
    <div className={`rounded-card border border-maroon/10 bg-white p-4 shadow-sm transition ${open ? '' : 'hover:-translate-y-1 hover:shadow-md'}`}>
      {displaySrc ? (
        <div className="relative overflow-hidden rounded-card">
          <img
            src={displaySrc}
            alt={product.name}
            onClick={() => gallery.length > 0 && setOpen(true)}
            className="aspect-[4/3] w-full object-cover cursor-zoom-in"
          />
          {gallery.length > 1 && (
            <div className="absolute right-3 top-3 rounded-chip bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm">{gallery.length} images</div>
          )}
        </div>
      ) : (
        <div className="flex h-52 items-center justify-center rounded-card bg-stone-100 text-stone-500">No Image</div>
      )}
      <div className="mt-4 text-xs uppercase tracking-[0.3em] text-ink/50">{product.type} • {productLabel}</div>
      <h3 className="mt-2 text-xl font-serif font-semibold text-maroon-deep">{product.name}</h3>
      <div className="mt-3 mb-4">
        {product.discountPrice ? (
          <div className="flex items-center gap-3 text-lg">
            <span className="text-ink/40 line-through text-sm">₹{product.price}</span>
            <span className="text-teal font-semibold">₹{product.discountPrice}</span>
          </div>
        ) : (
          <div className="text-lg font-semibold text-teal">₹{product.price}</div>
        )}
      </div>
      {product.inStock ? (
        cartItem ? (
          <div className="flex items-center gap-2">
            <button onClick={() => { const newQty = cartItem.qty - 1; if (newQty <= 0) remove(product.id); else updateQty(product.id, newQty) }} className="flex-1 rounded-card border border-maroon/10 bg-cream py-2 text-sm font-semibold text-ink">−</button>
            <div className="px-4 text-sm font-semibold text-ink">{cartItem.qty}</div>
            <button onClick={() => updateQty(product.id, cartItem.qty + 1)} className="flex-1 rounded-card bg-maroon text-white py-2 text-sm font-semibold hover:bg-maroon-deep">+</button>
          </div>
        ) : (
          <button
            onClick={() => onAdd && onAdd(product)}
            className="w-full rounded-card bg-maroon text-white py-3 text-sm font-semibold transition hover:bg-maroon-deep">
            Add to Cart
          </button>
        )
      ) : (
        <button className="w-full rounded-card bg-stone-100 py-3 text-sm font-semibold text-stone-500 cursor-not-allowed">Out of Stock</button>
      )}

      {open && gallery.length > 0 && typeof document !== 'undefined' ? createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div className="relative flex h-[70vh] w-[min(92vw,900px)] items-center justify-center overflow-hidden rounded-card bg-black/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-full w-full items-center justify-center">
              {displayedSrc ? (
                <img src={displayedSrc} alt="gallery" className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-white/80">Loading image…</div>
              )}
            </div>
            {gallery.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-stone-900 shadow">‹</button>
                <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-stone-900 shadow">›</button>
              </>
            )}
            <button onClick={() => setOpen(false)} className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-stone-900 shadow">✕</button>
          </div>
        </div>,
        document.body
      ) : null}
    </div>
  )
}

