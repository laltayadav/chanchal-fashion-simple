import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { DELETE as deleteOrder, GET as getOrders, POST as placeOrder } from '../app/api/orders/route'
import { setupDataSandbox } from './helpers/dataSandbox'
import { adminCookieHeader } from './helpers/authCookie'

setupDataSandbox()

describe('order placement and admin visibility', () => {
  it('persists submitted orders and exposes them to authorized admin requests', async () => {
    const createReq = new Request('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'p1', name: 'Test Saree', qty: 2, unitPrice: 1200 }],
        total: 2400,
        name: 'Customer Name',
        phone: '9999999999',
        address: '221B Baker Street, London',
        note: 'Call before shipping',
      }),
    })

    const createRes = await placeOrder(createReq)
    expect(createRes.status).toBe(201)

    const listReq = new NextRequest('http://localhost/api/orders', {
      method: 'GET',
      headers: { Cookie: adminCookieHeader() },
    })

    const listRes = await getOrders(listReq)
    expect(listRes.status).toBe(200)
    const orders = await listRes.json()
    expect(orders).toHaveLength(1)
    expect(orders[0].name).toBe('Customer Name')
    expect(orders[0].total).toBe(2400)
    expect(orders[0].address).toBe('221B Baker Street, London')
  })

  it('rejects order creation when address is missing', async () => {
    const createReq = new Request('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'p1', name: 'Test Saree', qty: 1, unitPrice: 1200 }],
        total: 1200,
        name: 'No Address',
        phone: '9999999999',
      }),
    })

    const createRes = await placeOrder(createReq)
    expect(createRes.status).toBe(400)
    await expect(createRes.json()).resolves.toEqual({ error: 'address is required' })
  })

  it('allows admin to delete an order', async () => {
    const createReq = new Request('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'p1', name: 'Delete Me Saree', qty: 1, unitPrice: 1500 }],
        total: 1500,
        name: 'Delete Candidate',
        phone: '9999999999',
        address: '42 Test Street',
      }),
    })

    const createRes = await placeOrder(createReq)
    expect(createRes.status).toBe(201)
    const created = await createRes.json()

    const deleteReq = new NextRequest(`http://localhost/api/orders?id=${encodeURIComponent(created.id)}`, {
      method: 'DELETE',
      headers: { Cookie: adminCookieHeader() },
    })
    const deleteRes = await deleteOrder(deleteReq)
    expect(deleteRes.status).toBe(200)

    const listReq = new NextRequest('http://localhost/api/orders', {
      method: 'GET',
      headers: { Cookie: adminCookieHeader() },
    })
    const listRes = await getOrders(listReq)
    expect(listRes.status).toBe(200)
    const orders = await listRes.json()
    expect(orders.some((order: { id: string }) => order.id === created.id)).toBe(false)
  })
})
