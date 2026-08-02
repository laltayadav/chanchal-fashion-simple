import fs from 'fs'
import path from 'path'
import { Product, Order, Config, AdminAuthState } from './types'

const DEFAULT_DATA_DIR = path.join(process.cwd(), 'data')
const DATA_DIR = process.env.DATA_DIR || DEFAULT_DATA_DIR
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json')
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json')
const CONFIG_FILE = path.join(DATA_DIR, 'config.json')
const ADMIN_AUTH_FILE = path.join(DATA_DIR, 'admin-auth.json')
const SEEDABLE_RUNTIME_FILES = new Set(['products.json', 'config.json', 'admin-auth.json'])

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function readJson<T>(filePath: string, fallback: T): T {
  try {
    ensureDataDir()
    if (!fs.existsSync(filePath)) {
      const relPath = path.relative(DATA_DIR, filePath)
      const seedPath = path.join(DEFAULT_DATA_DIR, relPath)
      const isMountedRuntimeData = DATA_DIR !== DEFAULT_DATA_DIR
      const canSeedFromBundle = isMountedRuntimeData && SEEDABLE_RUNTIME_FILES.has(relPath) && fs.existsSync(seedPath)

      // Mounted runtime data may bootstrap only from explicitly allowed seed files.
      if (canSeedFromBundle) {
        console.warn(`[db] Bootstrapping runtime file from bundled seed: ${relPath}`)
        fs.copyFileSync(seedPath, filePath)
      } else {
        if (isMountedRuntimeData) {
          console.warn(`[db] Initializing runtime file with fallback data: ${relPath}`)
        }
        fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2) + '\n', 'utf8')
        return fallback
      }
    }
    const raw = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(raw) as T
  } catch (e) {
    return fallback
  }
}

function writeJson<T>(filePath: string, data: T) {
  ensureDataDir()
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

export async function getProducts(): Promise<Product[]> {
  return readJson<Product[]>(PRODUCTS_FILE, [])
}

export async function saveProducts(products: Product[]): Promise<void> {
  writeJson(PRODUCTS_FILE, products)
}

export async function getOrders(): Promise<Order[]> {
  return readJson<Order[]>(ORDERS_FILE, [])
}

export async function saveOrders(orders: Order[]): Promise<void> {
  writeJson(ORDERS_FILE, orders)
}

export async function getConfig(): Promise<Config> {
  return readJson<Config>(CONFIG_FILE, {})
}

export async function saveConfig(cfg: Config): Promise<void> {
  writeJson(CONFIG_FILE, cfg)
}

export async function getAdminAuthState(): Promise<AdminAuthState> {
  return readJson<AdminAuthState>(ADMIN_AUTH_FILE, { failedAttempts: 0, lockUntil: null, lastFailedAt: null })
}

export async function saveAdminAuthState(state: AdminAuthState): Promise<void> {
  writeJson(ADMIN_AUTH_FILE, state)
}

