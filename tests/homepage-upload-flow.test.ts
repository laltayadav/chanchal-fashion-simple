import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { adminCookieHeader } from './helpers/authCookie'
import { readDataFile, setupDataSandbox } from './helpers/dataSandbox'

const uploadsDir = path.join(process.cwd(), 'data', '__test_homepage_uploads__')
const originalUploadsDir = process.env.UPLOADS_DIR

setupDataSandbox()

beforeEach(() => {
  fs.rmSync(uploadsDir, { recursive: true, force: true })
  fs.mkdirSync(uploadsDir, { recursive: true })
  process.env.UPLOADS_DIR = uploadsDir
  vi.resetModules()
})

afterEach(() => {
  fs.rmSync(uploadsDir, { recursive: true, force: true })
  if (originalUploadsDir === undefined) {
    delete process.env.UPLOADS_DIR
  } else {
    process.env.UPLOADS_DIR = originalUploadsDir
  }
})

describe('homepage image upload flow', () => {
  it('processes an authenticated image upload into persistent WebP storage', async () => {
    const [{ PUT: updateConfig }, uploadsRoute] = await Promise.all([
      import('../app/api/config/route'),
      import('../app/api/uploads/[...parts]/route'),
    ])
    const png = await sharp({
      create: {
        width: 2,
        height: 2,
        channels: 3,
        background: '#8b354f',
      },
    }).png().toBuffer()

    const req = new NextRequest('http://localhost/api/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookieHeader(),
      },
      body: JSON.stringify({
        homepageTitle: 'A new collection',
        homepageDescription: 'Discover the collection.',
        homepageImages: [
          `data:image/png;base64,${png.toString('base64')}`,
          `data:image/png;base64,${png.toString('base64')}`,
        ],
        homepageSlides: [
          { image: `data:image/png;base64,${png.toString('base64')}`, title: '', description: '' },
          { image: `data:image/png;base64,${png.toString('base64')}`, title: 'Festive styles', description: 'A second slide' },
        ],
      }),
    })

    const res = await updateConfig(req)
    expect(res.status).toBe(200)
    const responseData = await res.json()
    expect(responseData.homepageImage).toMatch(/^uploads\/.+\.webp$/)
    expect(responseData.homepageImages).toHaveLength(2)
    expect(responseData.homepageImages[0]).toBe(responseData.homepageImage)
    expect(responseData.homepageSlides[1]).toMatchObject({
      image: responseData.homepageImages[1],
      title: 'Festive styles',
      description: 'A second slide',
    })

    const imageNames = responseData.homepageImages.map((image: string) => path.basename(image))
    expect(imageNames.every((imageName: string) => fs.existsSync(path.join(uploadsDir, imageName)))).toBe(true)
    const config = readDataFile<Record<string, unknown>>('config.json')
    expect(config.homepageImage).toBe(responseData.homepageImage)
    expect(config.homepageImages).toEqual(responseData.homepageImages)
    expect(config.homepageSlides).toEqual(responseData.homepageSlides)
    expect(config.homepageImageDataUrl).toBeUndefined()

    const imageName = imageNames[0]
    const imageResponse = await uploadsRoute.GET(
      new NextRequest(`http://localhost/api/uploads/${imageName}`),
      { params: Promise.resolve({ parts: [imageName] }) }
    )
    expect(imageResponse.status).toBe(200)
    expect(imageResponse.headers.get('content-type')).toBe('image/webp')
  })
})
