import { describe, expect, it } from 'vitest'
import { buildOrderWhatsappMessage } from '../lib/order-whatsapp'

describe('order WhatsApp message builder', () => {
  it('includes address line before note line', () => {
    const message = buildOrderWhatsappMessage({
      name: 'Customer Name',
      phone: '9999999999',
      address: '221B Baker Street',
      items: [{ productId: 'p1', name: 'Test Saree', qty: 2, unitPrice: 1200 }],
      total: 2400,
      note: 'Call before shipping',
    })

    expect(message).toContain('Address: 221B Baker Street')
    expect(message).toContain('Note: Call before shipping')
    expect(message.indexOf('Address:')).toBeLessThan(message.indexOf('Note:'))
  })

  it('keeps multiline address readable by indenting continuation lines', () => {
    const message = buildOrderWhatsappMessage({
      name: 'Customer Name',
      phone: '9999999999',
      address: 'Block A\nFlat 42\nNear market',
      items: [{ productId: 'p1', name: 'Test Saree', qty: 1, unitPrice: 1200 }],
      total: 1200,
      note: '',
    })

    expect(message).toContain('Address: Block A')
    expect(message).toContain('\n  Flat 42')
    expect(message).toContain('\n  Near market')
  })

  it('includes item size in the WhatsApp message', () => {
    const message = buildOrderWhatsappMessage({
      name: 'Customer Name',
      phone: '9999999999',
      address: '221B Baker Street',
      items: [{ productId: 'p1', name: 'Test Saree', qty: 2, unitPrice: 1200, size: 'Free Size' }],
      total: 2400,
      note: '',
    })

    expect(message).toContain('2x Test Saree')
    expect(message).toContain('Size: Free Size')
  })
})
