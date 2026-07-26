import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { POST as checkAdminPassword } from '../app/api/admin/check/route'
import { POST as createProduct } from '../app/api/products/route'
import { hashAdminPassword } from '../lib/admin-password'
import { readDataFile, setupDataSandbox, writeDataFile } from './helpers/dataSandbox'
import { adminCookieHeader } from './helpers/authCookie'

setupDataSandbox()

describe('admin authentication and authorization', () => {
  it('migrates legacy plaintext admin password to hash on successful login', async () => {
    const req = new Request('http://localhost/api/admin/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'legacy-plain-pass', rememberDevice: false }),
    })

    const res = await checkAdminPassword(req)
    expect(res.status).toBe(200)

    const config = readDataFile<any>('config.json')
    expect(config.adminPasswordHash).toBeDefined()
    expect(config.adminPassword).toBeUndefined()
  })

  it('logs in with a valid hashed password and sets admin cookie', async () => {
    writeDataFile('config.json', {
      shopName: 'Chanchal',
      whatsapp: '9545938187',
      adminPasswordHash: hashAdminPassword('VeryStrongPass!123'),
    })

    const req = new Request('http://localhost/api/admin/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'VeryStrongPass!123', rememberDevice: false }),
    })

    const res = await checkAdminPassword(req)
    expect(res.status).toBe(200)
    expect(res.headers.get('set-cookie') || '').toContain('chanchal_admin_session=')
  })

  it('rejects invalid passwords', async () => {
    writeDataFile('config.json', {
      shopName: 'Chanchal',
      whatsapp: '9545938187',
      adminPasswordHash: hashAdminPassword('VeryStrongPass!123'),
    })

    const req = new Request('http://localhost/api/admin/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong-password', rememberDevice: false }),
    })

    const res = await checkAdminPassword(req)
    expect(res.status).toBe(401)
  })

  it('blocks unauthorized product creation and allows authorized creation', async () => {
    const unauthorizedReq = new NextRequest('http://localhost/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'Saree', name: 'No Auth', category: 'Silk', price: 1000 }),
    })

    const unauthorizedRes = await createProduct(unauthorizedReq)
    expect(unauthorizedRes.status).toBe(401)

    const authorizedReq = new NextRequest('http://localhost/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookieHeader(),
      },
      body: JSON.stringify({ type: 'Saree', name: 'Authorized Product', category: 'Silk', price: 1500 }),
    })

    const authorizedRes = await createProduct(authorizedReq)
    expect(authorizedRes.status).toBe(201)

    const products = readDataFile<any[]>('products.json')
    expect(products.length).toBe(1)
  })
})
