import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { setupDataSandbox } from './helpers/dataSandbox'
import { adminCookieHeader } from './helpers/authCookie'

setupDataSandbox()

describe('product image lifecycle regression', () => {
  it('supports uploaded and external image create/edit/reorder/delete/view', async () => {
    const uploadsDir = path.join(process.cwd(), 'data', '__test_uploads__')
    fs.mkdirSync(uploadsDir, { recursive: true })
    process.env.UPLOADS_DIR = uploadsDir

    const productsRoute = await import('../app/api/products/route')
    const uploadsRoute = await import('../app/api/uploads/[...parts]/route')

    const seededFilename = 'seeded-image.webp'
    const seededRelativePath = `uploads/${seededFilename}`
    fs.writeFileSync(path.join(uploadsDir, seededFilename), Buffer.from('seed-image'))

    const createReq = new NextRequest('http://localhost/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookieHeader(),
      },
      body: JSON.stringify({
        type: 'Kurti',
        name: 'Image Flow Kurti',
        category: 'Printed',
        price: 1500,
        images: [seededRelativePath],
      }),
    })

    const createRes = await productsRoute.POST(createReq)
    expect(createRes.status).toBe(201)
    const created = await createRes.json()
    expect(created.image).toBe(seededRelativePath)

    const uploadFilename = seededFilename
    const uploadViewRes = await uploadsRoute.GET(
      new NextRequest(`http://localhost/api/uploads/${uploadFilename}`),
      { params: Promise.resolve({ parts: [uploadFilename] }) }
    )
    expect(uploadViewRes.status).toBe(200)
    expect(uploadViewRes.headers.get('cache-control')).toContain('immutable')

    const updateReq = new NextRequest('http://localhost/api/products', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookieHeader(),
      },
      body: JSON.stringify({
        id: created.id,
        images: ['https://example.com/new.webp', created.image],
      }),
    })

    const updateRes = await productsRoute.PUT(updateReq)
    expect(updateRes.status).toBe(200)
    const updated = await updateRes.json()
    expect(updated.images).toEqual(['https://example.com/new.webp', created.image])
    expect(updated.image).toBe('https://example.com/new.webp')

    const deleteReq = new NextRequest(`http://localhost/api/products?id=${created.id}`, {
      method: 'DELETE',
      headers: { Cookie: adminCookieHeader() },
    })
    const deleteRes = await productsRoute.DELETE(deleteReq)
    expect(deleteRes.status).toBe(200)

    const uploadAfterDeleteRes = await uploadsRoute.GET(
      new NextRequest(`http://localhost/api/uploads/${uploadFilename}`),
      { params: Promise.resolve({ parts: [uploadFilename] }) }
    )
    expect(uploadAfterDeleteRes.status).toBe(404)

    fs.rmSync(uploadsDir, { recursive: true, force: true })
  })
})
