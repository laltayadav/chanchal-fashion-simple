import { describe, expect, it } from 'vitest'
import { formatAbsoluteDate, formatRelativeAge, getNewArrivalAttentionState, isProductNewArrival, sortProductsByRecent } from '../lib/product-recency'
import { Product } from '../lib/types'

describe('product recency UI helpers', () => {
  it('sorts by updatedAt first, then createdAt fallback, then id fallback', () => {
    const products: Product[] = [
      {
        id: 'b',
        type: 'Saree',
        name: 'Legacy',
        category: 'Silk',
        price: 1000,
        inStock: true,
      },
      {
        id: 'a',
        type: 'Saree',
        name: 'Created only',
        category: 'Silk',
        price: 1000,
        inStock: true,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'c',
        type: 'Saree',
        name: 'Updated latest',
        category: 'Silk',
        price: 1000,
        inStock: true,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-02-01T00:00:00.000Z',
      },
    ]

    const sorted = sortProductsByRecent(products)
    expect(sorted.map((p) => p.id)).toEqual(['c', 'a', 'b'])
  })

  it('formats relative and absolute dates for admin display', () => {
    const now = Date.parse('2026-07-27T12:00:00.000Z')
    const fiveHoursAgo = '2026-07-27T07:00:00.000Z'

    expect(formatRelativeAge(fiveHoursAgo, now)).toBe('5 hours ago')
    expect(formatAbsoluteDate(fiveHoursAgo)).not.toBe('N/A')
  })

  it('computes new arrivals from createdAt only and ignores updatedAt refresh', () => {
    const now = Date.parse('2026-08-02T12:00:00.000Z')
    const product: Product = {
      id: 'p1',
      type: 'Kurti',
      name: 'Kurti A',
      category: 'Printed',
      price: 1200,
      inStock: true,
      createdAt: '2026-06-20T00:00:00.000Z',
      updatedAt: '2026-08-01T00:00:00.000Z',
    }

    expect(isProductNewArrival(product, now, 30)).toBe(false)
  })

  it('uses manual new-until override and includes out-of-stock products', () => {
    const now = Date.parse('2026-08-02T12:00:00.000Z')
    const product: Product = {
      id: 'p2',
      type: 'Saree',
      name: 'Saree B',
      category: 'Silk',
      price: 3200,
      inStock: false,
      createdAt: '2026-01-01T00:00:00.000Z',
      newArrivalEnabled: true,
      newArrivalUntil: '2026-08-10T23:59:59.999Z',
    }

    expect(isProductNewArrival(product, now, 30)).toBe(true)
  })

  it('returns expiring and expired attention states', () => {
    const now = Date.parse('2026-08-02T12:00:00.000Z')
    const expiringSoon: Product = {
      id: 'p3',
      type: 'Blouse',
      name: 'Blouse C',
      category: 'Designer',
      price: 900,
      inStock: true,
      createdAt: '2026-08-01T00:00:00.000Z',
      newArrivalEnabled: true,
      newArrivalUntil: '2026-08-04T00:00:00.000Z',
    }

    const expired: Product = {
      ...expiringSoon,
      id: 'p4',
      newArrivalUntil: '2026-08-01T00:00:00.000Z',
    }

    expect(getNewArrivalAttentionState(expiringSoon, 30, now)).toBe('expiring')
    expect(getNewArrivalAttentionState(expired, 30, now)).toBe('expired')
  })
})
