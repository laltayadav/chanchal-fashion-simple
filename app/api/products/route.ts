import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getProducts, saveProducts } from '../../../lib/db'
import { saveProductImage, deleteProductImage } from '../../../lib/images'

export async function GET() {
  const products = await getProducts()
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const body = await req.json()
  const products = await getProducts()
  const id = uuidv4()
  let imagePath: string | undefined = undefined
  if (body.imageBase64) {
    const buffer = Buffer.from(body.imageBase64, 'base64')
    imagePath = await saveProductImage(buffer)
  }
  const product = {
    id,
    type: body.type,
    name: body.name,
    category: body.category || '',
    price: Number(body.price) || 0,
    discountPrice: body.discountPrice ? Number(body.discountPrice) : undefined,
    image: imagePath,
    includes: body.includes,
    inStock: body.inStock !== false,
  }
  products.push(product)
  await saveProducts(products)
  return NextResponse.json(product, { status: 201 })
}

export async function PUT(req: Request) {
  const body = await req.json()
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const products = await getProducts()
  const idx = products.findIndex((p) => p.id === body.id)
  if (idx === -1) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const existing = products[idx]
  // handle image replacement
  if (body.imageBase64) {
    if (existing.image) await deleteProductImage(existing.image)
    const buffer = Buffer.from(body.imageBase64, 'base64')
    existing.image = await saveProductImage(buffer)
  }
  existing.type = body.type ?? existing.type
  existing.name = body.name ?? existing.name
  existing.category = body.category ?? existing.category
  existing.price = body.price !== undefined ? Number(body.price) : existing.price
  existing.discountPrice = body.discountPrice !== undefined ? Number(body.discountPrice) : existing.discountPrice
  existing.includes = body.includes ?? existing.includes
  existing.inStock = body.inStock !== undefined ? Boolean(body.inStock) : existing.inStock
  products[idx] = existing
  await saveProducts(products)
  return NextResponse.json(existing)
}

export async function DELETE(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const products = await getProducts()
  const idx = products.findIndex((p) => p.id === id)
  if (idx === -1) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const [removed] = products.splice(idx, 1)
  if (removed.image) await deleteProductImage(removed.image)
  await saveProducts(products)
  return NextResponse.json({ ok: true })
}

