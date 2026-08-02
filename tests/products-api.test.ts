import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { GET as getProducts, POST as createProduct, PUT as updateProduct, DELETE as deleteProduct } from '../app/api/products/route'
import { setupDataSandbox } from './helpers/dataSandbox'
import { adminCookieHeader } from './helpers/authCookie'

setupDataSandbox()

describe('products API CRUD', () => {
  it('creates, edits, and deletes a product', async () => {
    const createReq = new NextRequest('http://localhost/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookieHeader(),
      },
      body: JSON.stringify({
        type: 'Kurti',
        name: 'New Kurti',
        category: 'Printed',
        size: 'Free Size',
        price: 2500,
        newArrivalEnabled: true,
        newArrivalUntil: '2026-08-20',
      }),
    })

    const createRes = await createProduct(createReq)
    expect(createRes.status).toBe(201)
    const created = await createRes.json()
    expect(created.id).toBeDefined()
    expect(created.size).toBe('Free Size')
    expect(created.type).toBe('Kurti')
    expect(created.newArrivalEnabled).toBe(true)
    expect(created.newArrivalUntil).toContain('T23:59:59.999Z')
    expect(created.createdAt).toBeDefined()
    expect(created.updatedAt).toBeDefined()
    expect(created.createdAt).toBe(created.updatedAt)

    const updateReq = new NextRequest('http://localhost/api/products', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookieHeader(),
      },
      body: JSON.stringify({
        id: created.id,
        name: 'Updated Kurti',
        category: 'Designer',
        size: 'XL',
        inStock: false,
        images: ['https://example.com/a.webp', 'https://example.com/b.webp'],
        newArrivalEnabled: true,
        newArrivalUntil: '',
      }),
    })

    const updateRes = await updateProduct(updateReq)
    expect(updateRes.status).toBe(200)
    const updated = await updateRes.json()
    expect(updated.name).toBe('Updated Kurti')
    expect(updated.size).toBe('XL')
    expect(updated.inStock).toBe(false)
    expect(updated.images).toEqual(['https://example.com/a.webp', 'https://example.com/b.webp'])
    expect(updated.image).toBe('https://example.com/a.webp')
    expect(updated.newArrivalUntil).toBeUndefined()
    expect(updated.createdAt).toBe(created.createdAt)
    expect(Date.parse(updated.updatedAt)).toBeGreaterThanOrEqual(Date.parse(created.updatedAt))

    const deleteReq = new NextRequest(`http://localhost/api/products?id=${created.id}`, {
      method: 'DELETE',
      headers: { Cookie: adminCookieHeader() },
    })

    const deleteRes = await deleteProduct(deleteReq)
    expect(deleteRes.status).toBe(200)

    const listRes = await getProducts()
    const products = await listRes.json()
    expect(products).toHaveLength(0)
  })
})
