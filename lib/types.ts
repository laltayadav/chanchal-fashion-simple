export type ProductType = 'Saree' | 'Blouse' | 'Set' | 'Kurti'

export interface Product {
  id: string
  type: ProductType
  name: string
  category: string
  size?: string
  price: number
  discountPrice?: number
  image?: string
  images?: string[]
  includes?: string
  inStock: boolean
  newArrivalEnabled?: boolean
  newArrivalUntil?: string
  createdAt?: string
  updatedAt?: string
}

export interface OrderItem {
  productId: string
  name: string
  qty: number
  unitPrice: number
  size?: string
}

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  name: string
  phone: string
  address?: string
  note?: string
  timestamp: string
  status?: 'new' | 'fulfilled'
}

export type Config = {
  shopName?: string
  whatsapp?: string
  newArrivalWindowDays?: number
  adminPassword?: string
  adminPasswordHash?: string
}

export interface AdminAuthState {
  failedAttempts: number
  lockUntil?: number | null
  lastFailedAt?: string | null
}
