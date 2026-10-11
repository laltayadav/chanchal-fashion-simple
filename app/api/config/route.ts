import { NextRequest, NextResponse } from 'next/server'
import { getConfig, saveConfig } from '../../../lib/db'
import { requireAdmin } from '../../../lib/admin-guard'
import { normalizeAndValidateWhatsappNumber } from '../../../lib/whatsapp-number'
import { DEFAULT_NEW_ARRIVAL_WINDOW_DAYS } from '../../../lib/product-recency'
import { saveProductImage } from '../../../lib/images'
import {
  getHomepageContent,
  isValidHomepageImagePath,
  MAX_HOMEPAGE_DESCRIPTION_LENGTH,
  MAX_HOMEPAGE_IMAGES,
  MAX_HOMEPAGE_TITLE_LENGTH,
} from '../../../lib/homepage-content'
import type { HomepageSlide } from '../../../lib/types'

const MAX_HOMEPAGE_IMAGE_BYTES = 5 * 1024 * 1024
const HOMEPAGE_IMAGE_DATA_URL = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/
const ALLOWED_CONFIG_FIELDS = [
  'shopName',
  'whatsapp',
  'newArrivalWindowDays',
  'homepageTitle',
  'homepageDescription',
  'homepageImage',
  'homepageImageDataUrl',
  'homepageImages',
  'homepageSlides',
] as const
type AllowedConfigField = (typeof ALLOWED_CONFIG_FIELDS)[number]
type ParsedHomepageSlide = {
  image: { path: string } | { buffer: Buffer }
  title: string
  description: string
}

function decodeHomepageImage(value: unknown): { ok: false; error: string } | { ok: true; buffer: Buffer } {
  if (typeof value !== 'string') return { ok: false, error: 'Homepage image must be a supported image data URL' }
  const match = HOMEPAGE_IMAGE_DATA_URL.exec(value)
  if (!match) return { ok: false, error: 'Homepage image must be a JPEG, PNG, or WebP image' }
  if (match[2].length > Math.ceil(MAX_HOMEPAGE_IMAGE_BYTES * 4 / 3) + 4) {
    return { ok: false, error: 'Homepage image must be 5 MB or smaller' }
  }
  const decoded = Buffer.from(match[2], 'base64')
  if (!decoded.length || decoded.length > MAX_HOMEPAGE_IMAGE_BYTES || decoded.toString('base64') !== match[2]) {
    return { ok: false, error: 'Homepage image must be 5 MB or smaller and valid base64' }
  }
  return { ok: true, buffer: decoded }
}

function parseConfigPayload(body: unknown) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Invalid payload' }
  }

  const payload = body as Record<string, unknown>
  const unknownKeys = Object.keys(payload).filter((k) => !ALLOWED_CONFIG_FIELDS.includes(k as AllowedConfigField))
  if (unknownKeys.length > 0) {
    return { error: `Unsupported fields: ${unknownKeys.join(', ')}` }
  }

  const result: Record<string, string | number | string[]> = {}
  let homepageImageBuffer: Buffer | undefined
  let homepageImages: Array<{ path: string } | { buffer: Buffer }> | undefined
  let homepageSlides: ParsedHomepageSlide[] | undefined
  for (const key of ALLOWED_CONFIG_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(payload, key)) continue
    const value = payload[key]

    if (key === 'homepageImageDataUrl') {
      const decoded = decodeHomepageImage(value)
      if (!decoded.ok) return { error: decoded.error }
      homepageImageBuffer = decoded.buffer
      continue
    }

    if (key === 'homepageImages') {
      if (!Array.isArray(value) || value.length > MAX_HOMEPAGE_IMAGES) {
        return { error: `homepageImages must contain no more than ${MAX_HOMEPAGE_IMAGES} images` }
      }
      homepageImages = []
      for (const image of value) {
        if (typeof image !== 'string') return { error: 'homepageImages must contain image paths or supported image data URLs' }
        if (isValidHomepageImagePath(image)) {
          homepageImages.push({ path: image })
          continue
        }
        const decoded = decodeHomepageImage(image)
        if (!decoded.ok) return { error: decoded.error }
        homepageImages.push({ buffer: decoded.buffer })
      }
      continue
    }

    if (key === 'homepageSlides') {
      if (!Array.isArray(value) || value.length > MAX_HOMEPAGE_IMAGES) {
        return { error: `homepageSlides must contain no more than ${MAX_HOMEPAGE_IMAGES} slides` }
      }
      homepageSlides = []
      for (const candidate of value) {
        if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
          return { error: 'Each homepage slide must be an object' }
        }
        const slide = candidate as Record<string, unknown>
        if (Object.keys(slide).some((field) => !['image', 'title', 'description'].includes(field))) {
          return { error: 'Homepage slides may only include image, title, and description' }
        }
        let image: ParsedHomepageSlide['image']
        if (typeof slide.image !== 'string') {
          return { error: 'Each homepage slide must include an uploaded image or image data URL' }
        }
        if (isValidHomepageImagePath(slide.image)) {
          image = { path: slide.image }
        } else {
          const decoded = decodeHomepageImage(slide.image)
          if (!decoded.ok) return { error: decoded.error }
          image = { buffer: decoded.buffer }
        }
        const title = slide.title === undefined ? '' : slide.title
        const description = slide.description === undefined ? '' : slide.description
        if (typeof title !== 'string' || title.length > MAX_HOMEPAGE_TITLE_LENGTH) {
          return { error: `Homepage slide title must be ${MAX_HOMEPAGE_TITLE_LENGTH} characters or fewer` }
        }
        if (typeof description !== 'string' || description.length > MAX_HOMEPAGE_DESCRIPTION_LENGTH) {
          return { error: `Homepage slide description must be ${MAX_HOMEPAGE_DESCRIPTION_LENGTH} characters or fewer` }
        }
        homepageSlides.push({ image, title: title.trim(), description: description.trim() })
      }
      continue
    }

    if (key === 'newArrivalWindowDays') {
      const parsed = Number(value)
      if (!Number.isFinite(parsed)) {
        return { error: 'newArrivalWindowDays must be a number' }
      }
      const normalized = Math.trunc(parsed)
      if (normalized < 1 || normalized > 365) {
        return { error: 'newArrivalWindowDays must be between 1 and 365' }
      }
      result[key] = normalized
      continue
    }

    if (typeof value !== 'string') {
      return { error: `${key} must be a string` }
    }

    if (key === 'whatsapp') {
      const parsed = normalizeAndValidateWhatsappNumber(value)
      if (parsed.error) {
        return { error: parsed.error }
      }
      result[key] = parsed.normalized
      continue
    }

    if (key === 'homepageTitle' || key === 'homepageDescription') {
      const maxLength = key === 'homepageTitle' ? MAX_HOMEPAGE_TITLE_LENGTH : MAX_HOMEPAGE_DESCRIPTION_LENGTH
      const normalized = value.trim()
      if (!normalized) {
        return { error: `${key} is required` }
      }
      if (normalized.length > maxLength) {
        return { error: `${key} must be ${maxLength} characters or fewer` }
      }
      result[key] = normalized
      continue
    }

    if (key === 'homepageImage') {
      const normalized = value.trim()
      if (normalized && !isValidHomepageImagePath(normalized)) {
        return { error: 'homepageImage must be an uploaded image path or empty' }
      }
      result[key] = normalized
      continue
    }

    result[key] = value.trim()
  }

  return { data: result, homepageImageBuffer, homepageImages, homepageSlides }
}

export async function GET() {
  const cfg = await getConfig()
  const parsedWhatsapp = normalizeAndValidateWhatsappNumber(cfg.whatsapp || '')
  const normalizedWindow = Number(cfg.newArrivalWindowDays)
  const homepage = getHomepageContent(cfg)
  const publicConfig = {
    shopName: cfg.shopName,
    whatsapp: parsedWhatsapp.normalized,
    newArrivalWindowDays: Number.isFinite(normalizedWindow) ? Math.max(1, Math.min(365, Math.trunc(normalizedWindow))) : DEFAULT_NEW_ARRIVAL_WINDOW_DAYS,
    homepageTitle: homepage.title,
    homepageDescription: homepage.description,
    homepageImage: homepage.image,
    homepageImages: homepage.images,
    homepageSlides: homepage.slides,
  }
  return NextResponse.json(publicConfig)
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  const body = await req.json()
  const parsed = parseConfigPayload(body)
  if (parsed.error) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const existing = await getConfig()
  const merged = { ...existing }
  if (parsed.homepageSlides) {
    try {
      const slides: HomepageSlide[] = []
      for (const entry of parsed.homepageSlides) {
        const image = 'path' in entry.image ? entry.image.path : await saveProductImage(entry.image.buffer)
        slides.push({
          image,
          title: entry.title,
          description: entry.description,
        })
      }
      merged.homepageSlides = slides
      merged.homepageImages = slides.map((slide) => slide.image)
      merged.homepageImage = slides[0]?.image || ''
    } catch (error) {
      console.error('[config] Failed to process homepage image upload', error)
      return NextResponse.json({ error: 'Homepage image could not be processed' }, { status: 400 })
    }
  } else if (parsed.homepageImages) {
    try {
      const images = []
      for (const entry of parsed.homepageImages) {
        images.push('path' in entry ? entry.path : await saveProductImage(entry.buffer))
      }
      parsed.data.homepageImages = images
      parsed.data.homepageImage = images[0] || ''
      merged.homepageSlides = images.map((image) => ({ image }))
    } catch (error) {
      console.error('[config] Failed to process homepage image upload', error)
      return NextResponse.json({ error: 'Homepage image could not be processed' }, { status: 400 })
    }
  } else if (parsed.homepageImageBuffer) {
    try {
      const image = await saveProductImage(parsed.homepageImageBuffer)
      parsed.data.homepageImage = image
      parsed.data.homepageImages = [image]
      merged.homepageSlides = [{ image }]
    } catch (error) {
      console.error('[config] Failed to process homepage image upload', error)
      return NextResponse.json({ error: 'Homepage image could not be processed' }, { status: 400 })
    }
  } else if (parsed.data && typeof parsed.data.homepageImage === 'string') {
    parsed.data.homepageImages = parsed.data.homepageImage ? [parsed.data.homepageImage] : []
    merged.homepageSlides = parsed.data.homepageImage ? [{ image: parsed.data.homepageImage }] : []
  }
  if (parsed.data) {
    for (const [key, value] of Object.entries(parsed.data)) {
      ;(merged as Record<string, unknown>)[key] = value
    }
  }

  await saveConfig(merged)
  const homepage = getHomepageContent(merged)
  return NextResponse.json({
    ok: true,
    homepageImage: homepage.image,
    homepageImages: homepage.images,
    homepageSlides: homepage.slides,
  })
}
