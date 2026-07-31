import { formatPrice } from './utils'

// ── Wonderplays Brand Constants ──────────────────────────────────────────────
export const BRAND = {
  name: 'Wonderplays',
  tagline: 'Wonderful Place for All Collectors.',
  description:
    'Toko Online berbasis Digital yang memberikan pengalaman berbelanja Produk Collectibles yang Mudah, Murah, dan Terpercaya sejak 2023.',
  since: '2023',
  hours: 'Buka Setiap Hari 12.00 – 24.00 WIB',
}

export const CONTACT = {
  wa: '6281772888828',
  waDisplay: '0817-2888-828',
  instagram: '@Wonderplays_',
  instagramUrl: 'https://instagram.com/Wonderplays_',
  tiktok: '@Wonderplays_',
  tiktokUrl: 'https://tiktok.com/@Wonderplays_',
}

export const WA_MESSAGE = encodeURIComponent(
  'Halo Wonderplays! Saya ingin bertanya tentang produk Collectibles. Bisa bantu saya? 😊',
)
export const WA_LINK = `https://wa.me/${CONTACT.wa}?text=${WA_MESSAGE}`

// ── WhatsApp Checkout ────────────────────────────────────────────────────────
// The storefront has no login/payment gateway: checkout opens WhatsApp with a
// pre-filled order draft so the customer can confirm directly with the shop.
export interface CheckoutLine {
  name: string
  quantity: number
  price: number
}

export function buildCheckoutWaLink(lines: CheckoutLine[]): string {
  const itemLines = lines
    .map(
      (line, i) =>
        `${i + 1}. ${line.name} (x${line.quantity}) — ${formatPrice(line.price * line.quantity)}`,
    )
    .join('\n')

  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0)

  const message =
    `Halo ${BRAND.name}! Saya mau checkout pesanan berikut:\n\n` +
    `${itemLines}\n\n` +
    `Total: ${formatPrice(total)}\n\n` +
    `Mohon info ketersediaan stok, ongkir, dan cara pembayarannya ya. Terima kasih! 😊`

  return `https://wa.me/${CONTACT.wa}?text=${encodeURIComponent(message)}`
}
