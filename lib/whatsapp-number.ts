const DEFAULT_COUNTRY_CODE = '91'

type NormalizeOptions = {
  defaultCountryCode?: string
}

type NormalizeResult = {
  normalized: string
  error?: string
}

export function normalizeWhatsappNumber(rawValue: string, options: NormalizeOptions = {}): string {
  const defaultCountryCode = options.defaultCountryCode || DEFAULT_COUNTRY_CODE
  let value = String(rawValue || '').trim()

  if (!value) return ''

  // Support common copy/paste variants like +91, 0091, spaces, and dashes.
  if (value.startsWith('+')) value = value.slice(1)
  if (value.startsWith('00')) value = value.slice(2)

  let digitsOnly = value.replace(/\D/g, '')
  if (!digitsOnly) return ''

  // If a local 10-digit mobile is entered, assume default country code.
  if (digitsOnly.length === 10) {
    digitsOnly = `${defaultCountryCode}${digitsOnly}`
  }

  return digitsOnly
}

export function normalizeAndValidateWhatsappNumber(rawValue: string, options: NormalizeOptions = {}): NormalizeResult {
  const normalized = normalizeWhatsappNumber(rawValue, options)
  if (!normalized) {
    return { normalized: '' }
  }

  if (!/^\d{11,15}$/.test(normalized)) {
    return {
      normalized,
      error: 'WhatsApp number is invalid. Enter a 10-digit mobile number or full number with country code.',
    }
  }

  return { normalized }
}
