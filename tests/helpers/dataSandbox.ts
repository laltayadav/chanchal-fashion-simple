import fs from 'fs'
import path from 'path'
import { beforeAll, beforeEach, afterAll } from 'vitest'

const DATA_DIR = path.join(process.cwd(), 'data')
const FILES = ['config.json', 'products.json', 'orders.json', 'admin-auth.json'] as const

type Snapshot = Record<string, string | null>

function readRaw(filePath: string) {
  if (!fs.existsSync(filePath)) return null
  return fs.readFileSync(filePath, 'utf8')
}

function writeRaw(filePath: string, value: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, value, 'utf8')
}

export function setupDataSandbox() {
  const snapshot: Snapshot = {}

  beforeAll(() => {
    for (const file of FILES) {
      const filePath = path.join(DATA_DIR, file)
      snapshot[file] = readRaw(filePath)
    }
  })

  beforeEach(() => {
    writeDataFile('config.json', {
      shopName: 'Chanchal',
      whatsapp: '9545938187',
      adminPassword: 'legacy-plain-pass',
    })
    writeDataFile('products.json', [])
    writeDataFile('orders.json', [])
    writeDataFile('admin-auth.json', { failedAttempts: 0, lockUntil: null, lastFailedAt: null })
    process.env.ADMIN_SESSION_SECRET = '1234567890123456789012345678901234567890'
  })

  afterAll(() => {
    for (const file of FILES) {
      const filePath = path.join(DATA_DIR, file)
      const original = snapshot[file]
      if (original === null) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      } else {
        writeRaw(filePath, original)
      }
    }
  })
}

export function writeDataFile<T>(fileName: (typeof FILES)[number], data: T) {
  const filePath = path.join(DATA_DIR, fileName)
  writeRaw(filePath, JSON.stringify(data, null, 2) + '\n')
}

export function readDataFile<T>(fileName: (typeof FILES)[number]): T {
  const filePath = path.join(DATA_DIR, fileName)
  const raw = readRaw(filePath)
  if (!raw) {
    throw new Error(`Missing data file: ${fileName}`)
  }
  return JSON.parse(raw) as T
}
