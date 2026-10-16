import fs from 'node:fs';
import path from 'node:path';
import KlyphStorefront from '@/src/App';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const possiblePaths = [
    path.join(process.cwd(), 'public', 'ad', 'brand-ad.mp4'),
    path.join(process.cwd(), 'artifacts', 'klyph-store', 'public', 'ad', 'brand-ad.mp4'),
    path.join(__dirname, '..', '..', 'public', 'ad', 'brand-ad.mp4'),
  ];
  const hasBrandAd = possiblePaths.some((p) => {
    try {
      return fs.existsSync(p);
    } catch {
      return false;
    }
  });

  return <KlyphStorefront hasBrandAd={hasBrandAd} />;
}
