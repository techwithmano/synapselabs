import fs from 'node:fs';
import path from 'node:path';
import KlyphStorefront from '@/src/App';

export default function HomePage() {
  const adVideoPath = path.join(process.cwd(), 'public', 'ad', 'brand-ad.mp4');
  const hasBrandAd = fs.existsSync(adVideoPath);

  return <KlyphStorefront hasBrandAd={hasBrandAd} />;
}
