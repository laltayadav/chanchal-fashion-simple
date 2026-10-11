import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { GET as getConfig, PUT as updateConfig } from '../app/api/config/route'
import { PUT as updateSecurity } from '../app/api/admin/security/route'
import { readDataFile, setupDataSandbox } from './helpers/dataSandbox'
import { adminCookieHeader } from './helpers/authCookie'

setupDataSandbox()

describe('config and security APIs', () => {
  it('returns public config without sensitive fields', async () => {
    const res = await getConfig()
    const data = await res.json()

    expect(data.shopName).toBeDefined()
    expect(data.newArrivalWindowDays).toBe(30)
    expect(data.homepageTitle).toBe('Weave Your Own Story')
    expect(data.homepageDescription).toContain('elegant sarees')
    expect(data.homepageImage).toBe('')
    expect(data.homepageImages).toEqual([])
    expect(data.adminPassword).toBeUndefined()
    expect(data.adminPasswordHash).toBeUndefined()
  })

  it('saves homepage copy while preserving legacy config compatibility', async () => {
    const req = new NextRequest('http://localhost/api/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookieHeader(),
      },
      body: JSON.stringify({
        homepageTitle: '  Festive elegance  ',
        homepageDescription: 'Discover a new collection.',
        homepageImage: '',
      }),
    })

    const res = await updateConfig(req)
    expect(res.status).toBe(200)

    const updated = await getConfig()
    const data = await updated.json()
    expect(data.homepageTitle).toBe('Festive elegance')
    expect(data.homepageDescription).toBe('Discover a new collection.')
    expect(data.homepageImage).toBe('')
    expect(data.homepageImages).toEqual([])
    expect(data.adminPassword).toBeUndefined()
  })

  it('rejects unauthenticated homepage updates without changing config', async () => {
    const before = readDataFile<any>('config.json')
    const req = new NextRequest('http://localhost/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ homepageTitle: 'Unauthorized change' }),
    })

    const res = await updateConfig(req)
    expect(res.status).toBe(401)
    expect(readDataFile<any>('config.json')).toEqual(before)
  })

  it('rejects invalid homepage image paths, image payloads, and overlong copy', async () => {
    const invalidPayloads = [
      { homepageImage: 'https://example.com/image.webp' },
      { homepageImageDataUrl: 'data:image/svg+xml;base64,PHN2Zz4=' },
      { homepageImages: ['uploads/valid.webp', 'https://example.com/image.webp'] },
      { homepageImages: Array.from({ length: 6 }, () => 'uploads/valid.webp') },
      { homepageSlides: [{ image: 'uploads/valid.webp', title: 'x'.repeat(91) }] },
      { homepageSlides: [{ image: 'uploads/valid.webp', description: 'x'.repeat(221) }] },
      { homepageTitle: '  ' },
      { homepageDescription: '  ' },
      { homepageTitle: 'x'.repeat(91) },
      { homepageDescription: 'x'.repeat(221) },
    ]

    for (const payload of invalidPayloads) {
      const req = new NextRequest('http://localhost/api/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: adminCookieHeader(),
        },
        body: JSON.stringify(payload),
      })

      const res = await updateConfig(req)
      expect(res.status).toBe(400)
    }
  })

  it('persists slide copy with its image order and returns the configured order', async () => {
    const req = new NextRequest('http://localhost/api/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookieHeader(),
      },
      body: JSON.stringify({
        homepageTitle: 'Master collection',
        homepageDescription: 'The master description.',
        homepageSlides: [
          { image: 'uploads/second.webp', title: 'Second slide', description: '' },
          { image: 'uploads/first.webp', title: '', description: 'First image description' },
        ],
      }),
    })

    const res = await updateConfig(req)
    expect(res.status).toBe(200)

    const config = readDataFile<any>('config.json')
    expect(config.homepageSlides).toEqual([
      { image: 'uploads/second.webp', title: 'Second slide', description: '' },
      { image: 'uploads/first.webp', title: '', description: 'First image description' },
    ])
    expect(config.homepageImages).toEqual(['uploads/second.webp', 'uploads/first.webp'])
    expect(config.homepageImage).toBe('uploads/second.webp')

    const publicRes = await getConfig()
    const publicConfig = await publicRes.json()
    expect(publicConfig.homepageSlides).toEqual(config.homepageSlides)
  })

  it('accepts allowlisted config fields and rejects unknown fields', async () => {
    const validReq = new NextRequest('http://localhost/api/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookieHeader(),
      },
      body: JSON.stringify({ shopName: 'New Name', whatsapp: '9988776655', newArrivalWindowDays: 45 }),
    })

    const validRes = await updateConfig(validReq)
    expect(validRes.status).toBe(200)

    const badReq = new NextRequest('http://localhost/api/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookieHeader(),
      },
      body: JSON.stringify({ adminPassword: 'not-allowed' }),
    })

    const badRes = await updateConfig(badReq)
    expect(badRes.status).toBe(400)
  })

  it('accepts valid new-arrival window and rejects invalid values', async () => {
    const validReq = new NextRequest('http://localhost/api/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookieHeader(),
      },
      body: JSON.stringify({ newArrivalWindowDays: 21 }),
    })

    const validRes = await updateConfig(validReq)
    expect(validRes.status).toBe(200)

    const updated = readDataFile<any>('config.json')
    expect(updated.newArrivalWindowDays).toBe(21)

    const invalidReq = new NextRequest('http://localhost/api/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookieHeader(),
      },
      body: JSON.stringify({ newArrivalWindowDays: 0 }),
    })

    const invalidRes = await updateConfig(invalidReq)
    expect(invalidRes.status).toBe(400)
  })

  it('normalizes 10-digit WhatsApp number to country-code format', async () => {
    const req = new NextRequest('http://localhost/api/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookieHeader(),
      },
      body: JSON.stringify({ whatsapp: '9988776655' }),
    })

    const res = await updateConfig(req)
    expect(res.status).toBe(200)

    const updated = readDataFile<any>('config.json')
    expect(updated.whatsapp).toBe('919988776655')
  })

  it('rejects invalid WhatsApp number in config update', async () => {
    const req = new NextRequest('http://localhost/api/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookieHeader(),
      },
      body: JSON.stringify({ whatsapp: '+99 37135' }),
    })

    const res = await updateConfig(req)
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({
      error: expect.stringContaining('WhatsApp number is invalid'),
    })
  })

  it('sanitizes WhatsApp number on GET response', async () => {
    const req = new NextRequest('http://localhost/api/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookieHeader(),
      },
      body: JSON.stringify({ whatsapp: '+91 99887 76655' }),
    })

    const updateRes = await updateConfig(req)
    expect(updateRes.status).toBe(200)

    const getRes = await getConfig()
    const data = await getRes.json()
    expect(data.whatsapp).toBe('919988776655')
  })

  it('updates admin password through dedicated security endpoint and removes plaintext', async () => {
    const req = new NextRequest('http://localhost/api/admin/security', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookieHeader(),
      },
      body: JSON.stringify({ adminPassword: 'UpdatedStrong!123' }),
    })

    const res = await updateSecurity(req)
    expect(res.status).toBe(200)

    const config = readDataFile<any>('config.json')
    expect(config.adminPasswordHash).toBeDefined()
    expect(config.adminPassword).toBeUndefined()
  })
})
