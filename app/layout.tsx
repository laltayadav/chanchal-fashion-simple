import './globals.css';
import type { Metadata } from 'next';
import RootProviders from '../components/RootProviders';

export const metadata: Metadata = {
  title: 'Chanchal Fashion',
  description: 'A simple sari shop storefront',
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
