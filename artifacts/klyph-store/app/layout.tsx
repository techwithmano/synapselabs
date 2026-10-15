import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../src/index.css';
import '../src/synapse.css';

export const metadata: Metadata = {
  title: 'SYNAPSE LABS — Engineered Calm Hardware Showroom',
  description: 'Precision neural telemetry, spatial audio instrumentation, and monolithic magnetic charging.',
  icons: { icon: '/favicon.svg' },
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
