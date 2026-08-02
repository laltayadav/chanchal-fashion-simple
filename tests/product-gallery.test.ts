import { describe, expect, it } from 'vitest'
import { getGalleryImageAtIndex, getSwipeDirection, getWrappedGalleryIndex, shouldOpenGalleryFromCard } from '../lib/product-gallery'

describe('product gallery interaction helpers', () => {
  it('returns the current gallery image using wrapped indexing', () => {
    const gallery = ['a.webp', 'b.webp', 'c.webp']

    expect(getGalleryImageAtIndex(gallery, 0)).toBe('a.webp')
    expect(getGalleryImageAtIndex(gallery, 1)).toBe('b.webp')
    expect(getGalleryImageAtIndex(gallery, 4)).toBe('b.webp')
  })

  it('wraps next and previous indices for multi-image browsing', () => {
    expect(getWrappedGalleryIndex(0, 3, 'prev')).toBe(2)
    expect(getWrappedGalleryIndex(2, 3, 'next')).toBe(0)
  })

  it('detects swipe direction only after threshold distance', () => {
    expect(getSwipeDirection(100, 70)).toBeNull()
    expect(getSwipeDirection(100, 50)).toBe('next')
    expect(getSwipeDirection(100, 150)).toBe('prev')
  })

  it('suppresses popup open after swipe but allows normal tap/click open', () => {
    expect(shouldOpenGalleryFromCard(true, 2)).toBe(false)
    expect(shouldOpenGalleryFromCard(false, 2)).toBe(true)
    expect(shouldOpenGalleryFromCard(false, 0)).toBe(false)
  })
})