import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../src/index.css';
import '../src/LightRefresh.css';
import '../src/obsidian.css';

export const metadata: Metadata = {
  title: 'KLYPH — Biometric Sovereign Vault',
  description:
    'Precision biometric security, titanium hardware, and cold storage for everyday carry.',
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
