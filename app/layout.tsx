import './globals.css';
import type { Metadata } from 'next';
import RootProviders from '../components/RootProviders';
import { SITE_ORIGIN } from '../lib/site-identity'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: 'Chanchal Fashion | Elegant Sarees and Blouses',
    template: '%s | Chanchal Fashion',
  },
  description: 'Chanchal Fashion is a curated sari storefront with elegant sarees, statement blouses, and festive sets.',
  openGraph: {
    title: 'Chanchal Fashion | Elegant Sarees and Blouses',
    description: 'Curated sarees, statement blouses, and festive sets for everyday elegance and special occasions.',
    url: '/',
    siteName: 'Chanchal Fashion',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Chanchal Fashion storefront preview',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chanchal Fashion | Elegant Sarees and Blouses',
    description: 'Curated sarees, statement blouses, and festive sets for your next celebration.',
    images: ['/opengraph-image'],
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  icons: [
    {
      rel: 'icon',
      url: '/favicon.svg',
      type: 'image/svg+xml'
    }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
