import fs from 'fs'
import os from 'os'
import path from 'path'
import { afterEach, describe, expect, it, vi } from 'vitest'

const originalDataDir = process.env.DATA_DIR

function makeTempDir(prefix: string) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `${prefix}-`))
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  const raw = fs.readFileSync(filePath, 'utf8').trim()
  return raw ? JSON.parse(raw) as T : fallback
}

async function loadDbModule() {
  vi.resetModules()
  return import('../lib/db')
}

afterEach(() => {
  if (originalDataDir === undefined) {
    delete process.env.DATA_DIR
  } else {
    process.env.DATA_DIR = originalDataDir
  }
  vi.restoreAllMocks()
})

describe('runtime JSON data safety', () => {
  it('boots products/config from bundled seed but initializes orders empty on mounted runtime data', async () => {
    const runtimeDir = makeTempDir('runtime-data')
    process.env.DATA_DIR = runtimeDir

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const db = await loadDbModule()

    const products = await db.getProducts()
    const orders = await db.getOrders()
    const config = await db.getConfig()

    const runtimeProducts = readJsonFile(path.join(runtimeDir, 'products.json'), [])
    const runtimeOrders = readJsonFile(path.join(runtimeDir, 'orders.json'), [])
    const runtimeConfig = readJsonFile(path.join(runtimeDir, 'config.json'), {})
    expect(products).toEqual(runtimeProducts)
    expect(config).toEqual(runtimeConfig)
    expect(orders).toEqual([])
    expect(runtimeOrders).toEqual([])
    expect(warnSpy).toHaveBeenCalledWith('[db] Bootstrapping runtime file from bundled seed: products.json')
    expect(warnSpy).toHaveBeenCalledWith('[db] Bootstrapping runtime file from bundled seed: config.json')
    expect(warnSpy).toHaveBeenCalledWith('[db] Initializing runtime file with fallback data: orders.json')
    expect(warnSpy).not.toHaveBeenCalledWith('[db] Bootstrapping runtime file from bundled seed: orders.json')
  })

  it('uses local runtime data directory as the source of truth when explicitly configured', async () => {
    const runtimeDir = makeTempDir('local-only-data')
    fs.writeFileSync(path.join(runtimeDir, 'products.json'), JSON.stringify([{ id: 'local-1', type: 'Saree', name: 'Local Only', category: 'Test', price: 123, inStock: true }], null, 2) + '\n', 'utf8')
    fs.writeFileSync(path.join(runtimeDir, 'orders.json'), JSON.stringify([{ id: 'order-1', items: [], total: 0, name: 'Local', phone: '1', timestamp: '2026-08-02T00:00:00.000Z' }], null, 2) + '\n', 'utf8')
    fs.writeFileSync(path.join(runtimeDir, 'config.json'), JSON.stringify({ shopName: 'Local Runtime Shop' }, null, 2) + '\n', 'utf8')
    fs.writeFileSync(path.join(runtimeDir, 'admin-auth.json'), JSON.stringify({ failedAttempts: 0, lockUntil: null, lastFailedAt: null }, null, 2) + '\n', 'utf8')

    process.env.DATA_DIR = runtimeDir

    const db = await loadDbModule()
    const products = await db.getProducts()
    const orders = await db.getOrders()
    const config = await db.getConfig()

    expect(products).toHaveLength(1)
    expect(products[0].id).toBe('local-1')
    expect(orders).toHaveLength(1)
    expect(orders[0].id).toBe('order-1')
    expect(config.shopName).toBe('Local Runtime Shop')
  })
})