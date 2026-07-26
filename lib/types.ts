export type ProductType = 'Saree' | 'Blouse' | 'Set'

export interface Product {
  id: string
  type: ProductType
  name: string
  category: string
  price: number
  discountPrice?: number
  image?: string
  images?: string[]
  includes?: string
  inStock: boolean
}

export interface OrderItem {
  productId: string
  name: string
  qty: number
  unitPrice: number
}

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  name: string
  phone: string
  note?: string
  timestamp: string
  status?: 'new' | 'fulfilled'
}

export type Config = {
  shopName?: string
  whatsapp?: string
  adminPassword?: string
}
