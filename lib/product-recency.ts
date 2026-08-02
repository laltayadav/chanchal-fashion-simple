import { Product } from './types'

export const DEFAULT_NEW_ARRIVAL_WINDOW_DAYS = 30
export const DEFAULT_EXPIRING_SOON_DAYS = 3

function toTimestamp(value?: string) {
  if (!value) return Number.NaN
  const ts = Date.parse(value)
  return Number.isFinite(ts) ? ts : Number.NaN
}

export function productActivityTimestamp(product: Product) {
  const updated = toTimestamp(product.updatedAt)
  if (Number.isFinite(updated)) return updated

  const created = toTimestamp(product.createdAt)
  if (Number.isFinite(created)) return created

  return Number.NaN
}

export function sortProductsByRecent(products: Product[]) {
  return [...products].sort((left, right) => {
    const leftTs = productActivityTimestamp(left)
    const rightTs = productActivityTimestamp(right)

    const leftHas = Number.isFinite(leftTs)
    const rightHas = Number.isFinite(rightTs)
    if (leftHas && rightHas) return rightTs - leftTs
    if (leftHas) return -1
    if (rightHas) return 1

    return left.id.localeCompare(right.id)
  })
}

export function formatAbsoluteDate(value?: string) {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return date.toLocaleString()
}

export function formatRelativeAge(value?: string, now = Date.now()) {
  if (!value) return 'unknown'
  const ts = Date.parse(value)
  if (!Number.isFinite(ts)) return 'unknown'

  const diff = Math.max(0, now - ts)
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) return 'just now'
  if (diff < hour) {
    const minutes = Math.floor(diff / minute)
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  }
  if (diff < day) {
    const hours = Math.floor(diff / hour)
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  }

  const days = Math.floor(diff / day)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export function normalizeProductRecency(product: Product) {
  if (product.createdAt || product.updatedAt) {
    return {
      ...product,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt ?? product.createdAt,
    }
  }

  return product
}

function parseWindowDays(value?: number) {
  const raw = Number(value)
  if (!Number.isFinite(raw)) return DEFAULT_NEW_ARRIVAL_WINDOW_DAYS
  const rounded = Math.trunc(raw)
  if (rounded < 1) return DEFAULT_NEW_ARRIVAL_WINDOW_DAYS
  if (rounded > 365) return 365
  return rounded
}

function parseManualUntil(value?: string) {
  if (!value) return Number.NaN
  const trimmed = value.trim()
  if (!trimmed) return Number.NaN

  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
  if (dateOnly) {
    return Date.parse(`${trimmed}T23:59:59.999Z`)
  }

  return Date.parse(trimmed)
}

export function normalizeNewArrivalUntil(value?: string) {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined

  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
  if (dateOnly) {
    return `${trimmed}T23:59:59.999Z`
  }

  const ts = Date.parse(trimmed)
  if (!Number.isFinite(ts)) return undefined
  return new Date(ts).toISOString()
}

export function getNewArrivalUntilTimestamp(product: Product, windowDays?: number) {
  if (product.newArrivalEnabled === false) return Number.NaN

  const manual = parseManualUntil(product.newArrivalUntil)
  if (Number.isFinite(manual)) return manual

  const created = toTimestamp(product.createdAt)
  if (!Number.isFinite(created)) return Number.NaN

  const days = parseWindowDays(windowDays)
  return created + days * 24 * 60 * 60 * 1000
}

export function isProductNewArrival(product: Product, now = Date.now(), windowDays?: number) {
  const untilTs = getNewArrivalUntilTimestamp(product, windowDays)
  if (!Number.isFinite(untilTs)) return false
  return now <= untilTs
}

export function getNewArrivalAttentionState(product: Product, windowDays?: number, now = Date.now(), expiringSoonDays = DEFAULT_EXPIRING_SOON_DAYS) {
  if (product.newArrivalEnabled === false) return 'inactive' as const

  const untilTs = getNewArrivalUntilTimestamp(product, windowDays)
  if (!Number.isFinite(untilTs)) return 'inactive' as const

  if (now > untilTs) return 'expired' as const

  const soonWindowMs = Math.max(1, Math.trunc(expiringSoonDays)) * 24 * 60 * 60 * 1000
  if (untilTs - now <= soonWindowMs) return 'expiring' as const

  return 'active' as const
}

export function formatNewArrivalUntil(product: Product, windowDays?: number) {
  const ts = getNewArrivalUntilTimestamp(product, windowDays)
  if (!Number.isFinite(ts)) return 'N/A'
  return new Date(ts).toLocaleDateString()
}
