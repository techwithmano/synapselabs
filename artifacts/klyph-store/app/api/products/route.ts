import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const seedProducts = [
  {
    name: 'Synapse Core Ring',
    description:
      'Matte ceramic biometric pulse and neural telemetry band with titanium interior.',
    price: 18,
    image: '/images/synapse/synapse-core-ring.webp',
    category: 'Wearables',
  },
  {
    name: 'Aura Spatial Clip',
    description:
      'Titanium bone-conduction spatial audio and voice interface with acoustic micro-grille.',
    price: 26,
    image: '/images/synapse/aura-spatial-clip.webp',
    category: 'Audio',
  },
  {
    name: 'NeuroDock Magnetic Slate',
    description:
      'High-speed inductive ceramic charging plate with illuminated cobalt status halo.',
    price: 14,
    image: '/images/synapse/neurodock-slate.webp',
    category: 'Power',
  },
];

const legacySeedNames = ['KLYPH Pro', 'KLYPH Air', 'KLYPH Vault'] as const;
const legacyToSeedName: Record<(typeof legacySeedNames)[number], string> = {
  'KLYPH Pro': 'Synapse Core Ring',
  'KLYPH Air': 'Aura Spatial Clip',
  'KLYPH Vault': 'NeuroDock Magnetic Slate',
};

async function syncHardwareProducts() {
  // 1. Rename any legacy KLYPH items if present
  const legacyProducts = await Product.find({
    name: { $in: legacySeedNames },
  })
    .select('_id name')
    .lean();

  if (legacyProducts.length) {
    for (const legacy of legacyProducts) {
      const targetName = legacyToSeedName[legacy.name as (typeof legacySeedNames)[number]];
      if (targetName) {
        const existingTarget = await Product.findOne({ name: targetName });
        if (existingTarget) {
          await Product.deleteOne({ _id: legacy._id });
        } else {
          await Product.updateOne({ _id: legacy._id }, { $set: { name: targetName } });
        }
      }
    }
  }

  // 2. Upsert and synchronize all 3 core products with new SVG assets, prices & descriptions
  await Product.bulkWrite(
    seedProducts.map((product) => ({
      updateOne: {
        filter: { name: product.name },
        update: {
          $set: {
            description: product.description,
            price: product.price,
            image: product.image,
            category: product.category,
          },
          $setOnInsert: {
            name: product.name,
          },
        },
        upsert: true,
      },
    })),
    { ordered: false },
  );
}

export async function GET() {
  try {
    await connectToDatabase();
    await syncHardwareProducts();

    const products = await Product.find().lean();

    // Ensure the 3 flagship products appear in exact canonical order (01 Core Ring, 02 Aura Clip, 03 NeuroDock)
    products.sort((a, b) => {
      const indexA = seedProducts.findIndex((p) => p.name === a.name);
      const indexB = seedProducts.findIndex((p) => p.name === b.name);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return String(a._id).localeCompare(String(b._id));
    });

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      },
    });
  } catch (error) {
    console.error('GET /api/products failed with error:', error);
    return NextResponse.json(
      { error: 'Unable to load products. Please try again.' },
      { status: 500 },
    );
  }
}
