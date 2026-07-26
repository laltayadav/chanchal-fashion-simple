import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

// In production, this should point to a Fly volume mount (default set in fly.toml)
// while keeping storefront URLs unchanged as /uploads/<file>.
const IMAGES_DIR = (process.env.UPLOADS_DIR || path.join(process.cwd(), 'public', 'uploads')).trim()

function ensureImagesDir() {
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true })
}

export async function saveProductImage(buffer: Buffer): Promise<string> {
  ensureImagesDir()
  const id = uuidv4()
  const filename = `${id}.webp`
  const dest = path.join(IMAGES_DIR, filename)
  await sharp(buffer).resize({ width: 1000, withoutEnlargement: true }).webp().toFile(dest)
  // return a public-relative path (omit leading slash so callers can prefix with '/')
  return `uploads/${filename}`
}

export async function deleteProductImage(relPath: string): Promise<void> {
  if (!relPath) return
  // Only allow deleting files under uploads/ to avoid path traversal and broad tracing.
  if (!relPath.startsWith('uploads/')) return
  const filename = relPath.slice('uploads/'.length)
  if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) return
  const candidate = path.join(IMAGES_DIR, filename)
  if (fs.existsSync(candidate)) {
    await fs.promises.unlink(candidate)
  }
}

