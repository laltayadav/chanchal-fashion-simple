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
    expect(data.adminPassword).toBeUndefined()
    expect(data.adminPasswordHash).toBeUndefined()
  })

  it('accepts allowlisted config fields and rejects unknown fields', async () => {
    const validReq = new NextRequest('http://localhost/api/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookieHeader(),
      },
      body: JSON.stringify({ shopName: 'New Name', whatsapp: '9988776655' }),
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
