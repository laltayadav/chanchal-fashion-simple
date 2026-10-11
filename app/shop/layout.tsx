import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop Sarees, Blouses and Festive Sets',
  description: 'Browse Chanchal Fashion sarees, statement blouses, kurtis, and festive sets.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Shop Sarees, Blouses and Festive Sets | Chanchal Fashion',
    description: 'Browse Chanchal Fashion sarees, statement blouses, kurtis, and festive sets.',
    url: '/shop',
    type: 'website',
  },
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}
