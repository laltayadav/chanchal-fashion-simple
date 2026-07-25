import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chanchal Fashion',
  description: 'A simple sari shop storefront',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
