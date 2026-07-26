import fs from 'fs'
import path from 'path'
import { Product, Order, Config } from './types'

const DATA_DIR = path.join(process.cwd(), 'data')
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json')
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json')
const CONFIG_FILE = path.join(DATA_DIR, 'config.json')

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function readJson<T>(filePath: string, fallback: T): T {
  try {
    ensureDataDir()
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2) + '\n', 'utf8')
      return fallback
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

