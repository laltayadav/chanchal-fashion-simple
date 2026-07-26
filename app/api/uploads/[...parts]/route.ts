import fs from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const UPLOADS_DIR = (process.env.UPLOADS_DIR || path.join(process.cwd(), 'public', 'uploads')).trim()

const CONTENT_TYPES: Record<string, string> = {
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ parts: string[] }> }
) {
  try {
    const resolvedParams = await params
    const parts = resolvedParams?.parts || []
    if (!parts.length) {
      return new NextResponse('Not Found', { status: 404 })
    }

    const filePath = path.resolve(UPLOADS_DIR, ...parts)
    const rootPath = path.resolve(UPLOADS_DIR)

    if (!filePath.startsWith(rootPath + path.sep) && filePath !== rootPath) {
      return new NextResponse('Not Found', { status: 404 })
    }

    const stat = await fs.promises.stat(filePath)
    if (!stat.isFile()) {
      return new NextResponse('Not Found', { status: 404 })
    }

    const ext = path.extname(filePath).toLowerCase()
    const contentType = CONTENT_TYPES[ext] || 'application/octet-stream'
    const buf = await fs.promises.readFile(filePath)

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new NextResponse('Not Found', { status: 404 })
  }
}
