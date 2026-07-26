import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'
import { Config } from './types'

const HASH_PREFIX = 'scrypt'
const HASH_KEY_LEN = 64

export function hashAdminPassword(password: string): string {
  const salt = randomBytes(16).toString('base64url')
  const derived = scryptSync(password, salt, HASH_KEY_LEN).toString('base64url')
  return `${HASH_PREFIX}$${salt}$${derived}`
}

export function verifyAdminPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split('$')
  if (parts.length !== 3 || parts[0] !== HASH_PREFIX) return false

  const salt = parts[1]
  const expected = Buffer.from(parts[2], 'base64url')
  const actual = scryptSync(password, salt, expected.length)
  if (actual.length !== expected.length) return false
  return timingSafeEqual(new Uint8Array(actual), new Uint8Array(expected))
}

export function normalizeConfigSecrets(config: Config): Config {
  if (config.adminPasswordHash) {
    const { adminPassword, ...rest } = config
    return rest
  }

  if (!config.adminPassword) return config

  const migrated = { ...config, adminPasswordHash: hashAdminPassword(config.adminPassword) }
  delete migrated.adminPassword
  return migrated
}

export function isPasswordValid(config: Config, password: string): boolean {
  if (config.adminPasswordHash) {
    return verifyAdminPassword(password, config.adminPasswordHash)
  }

  if (config.adminPassword) {
    return password === config.adminPassword
  }

  return password === 'admin'
}
