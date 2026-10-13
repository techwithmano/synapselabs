import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const seedProducts = [
  {
    name: 'KLYPH Pro',
    description: 'A biometric titanium wallet with Apple Find My and instant ejection.',
    price: 29,
    image: '/images/klyph-pro.webp',
    category: 'pro',
  },
  {
    name: 'KLYPH Air',
    description: 'A 4.2mm carbon-fiber sleeve with MagSafe and RFID shielding.',
    price: 16,
    image: '/images/klyph-air.webp',
    category: 'air',
  },
  {
    name: 'KLYPH Vault',
    description: 'A 316L steel seed vault built to withstand 1400°C.',
    price: 22,
    image: '/images/klyph-vault.webp',
    category: 'vault',
  },
];

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 11000
  );
}

export async function GET() {
  try {
    await connectToDatabase();
    await Product.init();

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      try {
        await Product.insertMany(seedProducts);
      } catch (error) {
        if (!isDuplicateKeyError(error)) throw error;

        await Product.bulkWrite(
          seedProducts.map((product) => ({
            updateOne: {
              filter: { name: product.name },
              update: { $setOnInsert: product },
              upsert: true,
            },
          })),
          { ordered: false },
        );
      }
    }

    const products = await Product.find().sort({ createdAt: 1, _id: 1 }).lean();
    return NextResponse.json(products, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    console.error(`GET /api/products failed (${errorName}).`);
    return NextResponse.json(
      { error: 'Unable to load products. Please try again.' },
      { status: 500 },
    );
  }
}
