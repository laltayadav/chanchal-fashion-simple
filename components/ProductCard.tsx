import React, { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Product } from '../lib/types'
import { useCart } from './CartContext'
import { getGalleryImageAtIndex, getSwipeDirection, getWrappedGalleryIndex, shouldOpenGalleryFromCard } from '../lib/product-gallery'

type Props = {
  product: Product
  onAdd?: (product: Product) => void
}

function resolveImageSrc(src: string) {
  if (!src) return undefined
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:') || src.startsWith('blob:')) {
    return src
  }
  if (src.startsWith('/')) return src
  return `/${src}`
}

function optimizeRemoteCardSrc(src: string) {
  if (!src.startsWith('http://') && !src.startsWith('https://')) return src
  try {
    const url = new URL(src)
    if (!url.searchParams.has('w')) url.searchParams.set('w', '640')
    if (!url.searchParams.has('q')) url.searchParams.set('q', '70')
    if (!url.searchParams.has('auto')) url.searchParams.set('auto', 'format')
    return url.toString()
  } catch {
    return src
  }
}

export default function ProductCard({ product, onAdd }: Props) {
  const { items, updateQty, remove } = useCart()
  const cartItem = items.find((item) => item.productId === product.id)
  const gallery = (product.images && product.images.length > 0) ? product.images : product.image ? [product.image] : []
  const productLabel = product.type === 'Set'
    ? (product.includes || 'Saree + Blouse Set')
    : (product.category || product.type)
  const [cardIndex, setCardIndex] = useState(0)
  const [popupIndex, setPopupIndex] = useState(0)
  const displaySrc = resolveImageSrc(getGalleryImageAtIndex(gallery, cardIndex) || '')
  const cardSrc = displaySrc ? optimizeRemoteCardSrc(displaySrc) : undefined
  const [open, setOpen] = useState(false)
  const [displayedSrc, setDisplayedSrc] = useState<string | undefined>(undefined)
  const [loadingImage, setLoadingImage] = useState(false)
  const [popupTouchStartX, setPopupTouchStartX] = useState<number | null>(null)
  const [cardTouchStartX, setCardTouchStartX] = useState<number | null>(null)
  const didSwipeCardRef = useRef(false)

  function nextCard() { if (gallery.length === 0) return; setCardIndex((i) => getWrappedGalleryIndex(i, gallery.length, 'next')) }
  function prevCard() { if (gallery.length === 0) return; setCardIndex((i) => getWrappedGalleryIndex(i, gallery.length, 'prev')) }
  function nextPopup() { if (gallery.length === 0) return; setPopupIndex((i) => getWrappedGalleryIndex(i, gallery.length, 'next')) }
  function prevPopup() { if (gallery.length === 0) return; setPopupIndex((i) => getWrappedGalleryIndex(i, gallery.length, 'prev')) }

  function handleCardImageClick() {
    const shouldOpen = shouldOpenGalleryFromCard(didSwipeCardRef.current, gallery.length)
    didSwipeCardRef.current = false
    if (!shouldOpen) return
    setPopupIndex(cardIndex)
    setOpen(true)
  }

  function onCardTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    if (gallery.length <= 1) return
    didSwipeCardRef.current = false
    setCardTouchStartX(event.touches[0]?.clientX ?? null)
  }

  function onCardTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (gallery.length <= 1) return
    const endX = event.changedTouches[0]?.clientX ?? null
    const direction = getSwipeDirection(cardTouchStartX, endX)
    setCardTouchStartX(null)
    if (!direction) return
    didSwipeCardRef.current = true
    if (direction === 'next') nextCard()
    else prevCard()
  }

  function onTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    if (gallery.length <= 1) return
    setPopupTouchStartX(event.touches[0]?.clientX ?? null)
  }

  function onTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    const endX = event.changedTouches[0]?.clientX ?? null
    const direction = getSwipeDirection(popupTouchStartX, endX)
    setPopupTouchStartX(null)
    if (!direction) return
    if (direction === 'next') nextPopup()
    else prevPopup()
  }

  React.useEffect(() => {
    if (cardIndex >= gallery.length) setCardIndex(0)
    if (popupIndex >= gallery.length) setPopupIndex(0)
  }, [cardIndex, gallery.length, popupIndex])

  React.useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const priceBlock = product.discountPrice ? (
    <div className="flex items-center gap-3 text-lg">
      <span className="text-sm text-ink/40 line-through">₹{product.price}</span>
      <span className="font-semibold text-teal">₹{product.discountPrice}</span>
    </div>
  ) : (
    <div className="text-lg font-semibold text-teal">₹{product.price}</div>
  )

  // preload selected image and update displayedSrc only after load to avoid flicker
  React.useEffect(() => {
    if (!open || gallery.length === 0) return
    const src = getGalleryImageAtIndex(gallery, popupIndex)
    if (!src) return
    const resolved = resolveImageSrc(src)
    if (!resolved) return
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
  }, [displayedSrc, gallery, open, popupIndex])

  return (
    <div className={`flex h-full flex-col rounded-card border border-maroon/10 bg-white p-4 shadow-sm transition ${open ? '' : 'hover:-translate-y-1 hover:shadow-md'}`}>
      {displaySrc ? (
        <div
          className="relative aspect-[3/4] overflow-hidden rounded-card bg-stone-100"
          onTouchStart={onCardTouchStart}
          onTouchEnd={onCardTouchEnd}
        >
          <img
            src={cardSrc}
            alt={product.name}
            onClick={handleCardImageClick}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="h-full w-full cursor-zoom-in object-cover"
          />
          {gallery.length > 1 && (
            <div className="absolute right-3 top-3 rounded-chip bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm">{gallery.length} images</div>
          )}
        </div>
      ) : (
        <div className="flex aspect-[3/4] items-center justify-center rounded-card bg-stone-100 text-stone-500">No Image</div>
      )}
      <div className="mt-4 flex flex-1 flex-col">
        <div className="text-xs uppercase tracking-[0.3em] text-ink/50">{product.type} • {productLabel}</div>
        <h3 className="mt-2 min-h-[3.5rem] text-xl font-serif font-semibold text-maroon-deep">{product.name}</h3>
        <div className="mt-1 min-h-[1.25rem] text-xs text-ink/60">{product.size ? `Size: ${product.size}` : ''}</div>
        <div className="mt-3 min-h-[2rem]">{priceBlock}</div>
      </div>
      {product.inStock ? (
        cartItem ? (
          <div className="mt-auto flex items-center gap-2">
            <button onClick={() => { const newQty = cartItem.qty - 1; if (newQty <= 0) remove(product.id); else updateQty(product.id, newQty) }} className="flex-1 rounded-card border border-maroon/10 bg-cream py-2 text-sm font-semibold text-ink">−</button>
            <div className="px-4 text-sm font-semibold text-ink">{cartItem.qty}</div>
            <button onClick={() => updateQty(product.id, cartItem.qty + 1)} className="flex-1 rounded-card bg-maroon text-white py-2 text-sm font-semibold hover:bg-maroon-deep">+</button>
          </div>
        ) : (
          <button
            onClick={() => onAdd && onAdd(product)}
            className="mt-auto w-full rounded-card bg-maroon py-3 text-sm font-semibold text-white transition hover:bg-maroon-deep">
            Add to Cart
          </button>
        )
      ) : (
        <button className="mt-auto w-full cursor-not-allowed rounded-card bg-stone-100 py-3 text-sm font-semibold text-stone-500">Out of Stock</button>
      )}

      {open && gallery.length > 0 && typeof document !== 'undefined' ? createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div
            className="relative flex h-[70vh] w-[min(92vw,900px)] items-center justify-center overflow-hidden rounded-card bg-black/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="flex h-full w-full items-center justify-center">
              {displayedSrc ? (
                <img src={displayedSrc} alt="gallery" className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-white/80">Loading image…</div>
              )}
            </div>
            {gallery.length > 1 && (
              <>
                <button onClick={prevPopup} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-stone-900 shadow">‹</button>
                <button onClick={nextPopup} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-stone-900 shadow">›</button>
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

