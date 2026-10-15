import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '../src/index.css';
import '../src/synapse.css';

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://synapselabs-nu.vercel.app'),
  title: {
    default: 'SYNAPSE LABS — Engineered Calm Hardware Showroom',
    template: '%s | SYNAPSE LABS',
  },
  description:
    'Precision neural telemetry, spatial audio instrumentation, and monolithic magnetic charging housed in tactile monolithic ceramics.',
  keywords: [
    'Synapse Labs',
    'neuro-wearable',
    'smart ring',
    'biometric telemetry',
    'spatial audio',
    'bone conduction',
    'magnetic induction charging',
    'porcelain ceramic wearable',
  ],
  authors: [{ name: 'Synapse Labs' }],
  creator: 'Synapse Labs',
  icons: { icon: '/favicon.svg', apple: '/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://synapselabs-nu.vercel.app',
    siteName: 'SYNAPSE LABS',
    title: 'SYNAPSE LABS — Engineered Calm Hardware Showroom',
    description:
      'Precision neural telemetry housed in tactile monolithic ceramics. Calm, unyielding performance engineered for seamless sensory integration.',
    images: [
      {
        url: '/images/synapse/synapse-core-ring.webp',
        width: 1200,
        height: 630,
        alt: 'Synapse Core Ring — Flagship Biometric Neuro-Wearable',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SYNAPSE LABS — Engineered Calm Hardware Showroom',
    description:
      'Precision neural telemetry, spatial audio instrumentation, and monolithic magnetic charging.',
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

