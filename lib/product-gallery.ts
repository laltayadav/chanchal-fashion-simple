export const GALLERY_SWIPE_THRESHOLD = 40

export type GallerySwipeDirection = 'next' | 'prev' | null

export function getGalleryImageAtIndex(gallery: string[], index: number) {
  if (gallery.length === 0) return undefined
  const normalized = ((index % gallery.length) + gallery.length) % gallery.length
  return gallery[normalized]
}

export function getWrappedGalleryIndex(index: number, galleryLength: number, direction: Exclude<GallerySwipeDirection, null>) {
  if (galleryLength <= 0) return 0
  if (direction === 'next') return (index + 1) % galleryLength
  return (index - 1 + galleryLength) % galleryLength
}

export function getSwipeDirection(startX: number | null, endX: number | null, threshold = GALLERY_SWIPE_THRESHOLD): GallerySwipeDirection {
  if (startX === null || endX === null) return null
  const deltaX = endX - startX
  if (Math.abs(deltaX) < threshold) return null
  return deltaX < 0 ? 'next' : 'prev'
}

export function shouldOpenGalleryFromCard(didSwipe: boolean, galleryLength: number) {
  if (didSwipe) return false
  return galleryLength > 0
}