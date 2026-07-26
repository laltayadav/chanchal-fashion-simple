import { Product } from './types'

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
