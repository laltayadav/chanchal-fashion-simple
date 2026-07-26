import { describe, expect, it } from 'vitest'
import { formatAbsoluteDate, formatRelativeAge, sortProductsByRecent } from '../lib/product-recency'
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
})
