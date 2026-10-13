import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../src/index.css';
import '../src/synapse.css';

export const metadata: Metadata = {
  title: 'SYNAPSE LABS — Considered Technology',
  description: 'Biometric sensing, spatial audio, and magnetic power for everyday life.',
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
