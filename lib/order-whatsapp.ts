import { OrderItem } from './types'

type BuildOrderWhatsappMessageInput = {
  name: string
  phone: string
  address: string
  items: OrderItem[]
  total: number
  note?: string
}

function normalizeLines(value: string): string[] {
  return value
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

function formatLabeledMultiline(label: string, value: string): string {
  const lines = normalizeLines(value)
  if (lines.length === 0) return `${label}:`
  if (lines.length === 1) return `${label}: ${lines[0]}`
  return `${label}: ${lines[0]}\n${lines.slice(1).map((line) => `  ${line}`).join('\n')}`
}

export function buildOrderWhatsappMessage(input: BuildOrderWhatsappMessageInput): string {
  const noteLine = input.note && input.note.trim().length > 0
    ? formatLabeledMultiline('Note', input.note)
    : 'Note:'

  return [
    'Order',
    `Name: ${input.name.trim()}`,
    `Phone: ${input.phone.trim()}`,
    formatLabeledMultiline('Address', input.address),
    'Items:',
    ...input.items.map((item) => {
      const sizeSuffix = item.size && item.size.trim().length > 0 ? ` (Size: ${item.size.trim()})` : ''
      return `${item.qty}x ${item.name}${sizeSuffix} - ₹${item.unitPrice}`
    }),
    `Total: ₹${input.total}`,
    noteLine,
  ].join('\n')
}
