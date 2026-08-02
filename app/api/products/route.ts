import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getProducts, saveProducts } from '../../../lib/db'
import { saveProductImage, deleteProductImage } from '../../../lib/images'
import { requireAdmin } from '../../../lib/admin-guard'
import { normalizeNewArrivalUntil, normalizeProductRecency } from '../../../lib/product-recency'
import { Product } from '../../../lib/types'

export async function GET() {
  const products = (await getProducts()).map((product) => normalizeProductRecency(product))
  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  const body = await req.json()
  const products = await getProducts()
  const id = uuidv4()
  // support multiple image base64s or array of image URLs
  let images: string[] = []
  if (Array.isArray(body.imageBase64s) && body.imageBase64s.length) {
    for (const b64 of body.imageBase64s) {
      const buffer = Buffer.from(b64, 'base64')
      images.push(await saveProductImage(buffer))
    }
  } else if (body.imageBase64) {
    const buffer = Buffer.from(body.imageBase64, 'base64')
    images.push(await saveProductImage(buffer))
  } else if (Array.isArray(body.images) && body.images.length) {
    // remote urls or existing uploads
    images = images.concat(body.images.map((s: string) => s.trim()).filter(Boolean))
  } else if (typeof body.image === 'string' && body.image.startsWith('data:')) {
    const [, base64] = body.image.split(',')
    const buffer = Buffer.from(base64, 'base64')
    images.push(await saveProductImage(buffer))
  } else if (typeof body.image === 'string' && body.image.trim()) {
    images.push(body.image.trim())
  }

  const now = new Date().toISOString()
  const product = {
    id,
    type: body.type,
    name: body.name,
    category: body.category || '',
    size: typeof body.size === 'string' && body.size.trim() ? body.size.trim() : undefined,
    price: Number(body.price) || 0,
    discountPrice: body.discountPrice ? Number(body.discountPrice) : undefined,
    image: images[0],
    images: images.length > 0 ? images : undefined,
    includes: body.includes,
    inStock: body.inStock !== false,
    newArrivalEnabled: body.newArrivalEnabled === true,
    newArrivalUntil: normalizeNewArrivalUntil(body.newArrivalUntil),
    createdAt: now,
    updatedAt: now,
  }
  products.push(product)
  await saveProducts(products)
  return NextResponse.json(product, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  const body = await req.json()
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const products = await getProducts()
  const idx = products.findIndex((p) => p.id === body.id)
  if (idx === -1) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const existing = normalizeProductRecency(products[idx] as Product)
  // handle multiple images
  if (Array.isArray(body.imageBase64s) && body.imageBase64s.length) {
    // append new uploaded images to existing images (do not delete existing by default)
    const newImgs: string[] = []
    for (const b64 of body.imageBase64s) {
      const buffer = Buffer.from(b64, 'base64')
      newImgs.push(await saveProductImage(buffer))
    }
    existing.images = existing.images ? existing.images.concat(newImgs) : newImgs
    existing.image = existing.images[0]
  } else if (body.imageBase64 || (typeof body.image === 'string' && body.image.startsWith('data:'))) {
    if (existing.image) await deleteProductImage(existing.image)
    const base64 = body.imageBase64 || body.image.split(',')[1]
    const buffer = Buffer.from(base64, 'base64')
    existing.image = await saveProductImage(buffer)
    existing.images = existing.image ? [existing.image] : undefined
  } else if (Array.isArray(body.images) && body.images.length) {
    const imgs = body.images.map((s: string) => s.trim()).filter(Boolean)
    existing.images = imgs
    existing.image = imgs[0]
  } else if (typeof body.image === 'string' && body.image.trim()) {
    existing.image = body.image.trim()
    existing.images = existing.image ? [existing.image] : undefined
  }

  existing.type = body.type ?? existing.type
  existing.name = body.name ?? existing.name
  existing.category = body.category ?? existing.category
  if (body.size !== undefined) {
    existing.size = typeof body.size === 'string' && body.size.trim() ? body.size.trim() : undefined
  }
  existing.price = body.price !== undefined ? Number(body.price) : existing.price
  existing.discountPrice = body.discountPrice !== undefined ? Number(body.discountPrice) : existing.discountPrice
  existing.includes = body.includes ?? existing.includes
  existing.inStock = body.inStock !== undefined ? Boolean(body.inStock) : existing.inStock
  if (body.newArrivalEnabled !== undefined) {
    existing.newArrivalEnabled = Boolean(body.newArrivalEnabled)
  }
  if (body.newArrivalUntil !== undefined) {
    existing.newArrivalUntil = normalizeNewArrivalUntil(body.newArrivalUntil)
  }
  existing.createdAt = existing.createdAt || new Date().toISOString()
  existing.updatedAt = new Date().toISOString()
  products[idx] = existing
  await saveProducts(products)
  return NextResponse.json(existing)
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const products = await getProducts()
  const idx = products.findIndex((p) => p.id === id)
  if (idx === -1) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const [removed] = products.splice(idx, 1)
  if (removed.images && Array.isArray(removed.images)) {
    for (const img of removed.images) await deleteProductImage(img)
  }
  if (removed.image) await deleteProductImage(removed.image)
  await saveProducts(products)
  return NextResponse.json({ ok: true })
}

