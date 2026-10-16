import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '../src/index.css';
import '../src/synapse.css';
import '../src/storefront.css';

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://synapselabs-nu.vercel.app'),
  title: {
    default: 'Synapse — Smart Rings and Audio for Wellness',
    template: '%s | Synapse',
  },
  description:
    'A smart ring that tracks your sleep, heart rate, and recovery without screens or buzzing. Your health data stays private on your device.',
  keywords: [
    'Synapse',
    'smart ring',
    'sleep tracking',
    'heart rate monitor',
    'wellness insights',
    'open-ear audio',
    'magnetic charger',
  ],
  authors: [{ name: 'Synapse Labs' }],
  creator: 'Synapse Labs',
  icons: { icon: '/favicon.svg', apple: '/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://synapselabs-nu.vercel.app',
    siteName: 'Synapse Labs',
    title: 'Synapse — Smart Rings and Audio for Wellness',
    description:
      'A smart ring that tracks your sleep, heart rate, and recovery without screens or buzzing. Your health data stays private on your device.',
    images: [
      {
        url: '/images/synapse/synapse-core-ring.webp',
        width: 1200,
        height: 630,
        alt: 'Synapse Core Ring',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Synapse — Smart Rings and Audio for Wellness',
    description:
      'A smart ring that tracks your sleep, heart rate, and recovery without screens or buzzing.',
    images: ['/images/synapse/synapse-core-ring.webp'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
