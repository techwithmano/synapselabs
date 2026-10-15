import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const seedProducts = [
  {
    name: 'Synapse Core Ring',
    description: 'Matte ceramic biometric pulse and neural telemetry band.',
    price: 18,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
    category: 'Wearables',
  },
  {
    name: 'Aura Spatial Clip',
    description: 'Titanium bone-conduction spatial audio and voice interface.',
    price: 26,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    category: 'Audio',
  },
  {
    name: 'NeuroDock Magnetic Slate',
    description: 'High-speed inductive ceramic charging plate with cobalt status ring.',
    price: 14,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&auto=format&fit=crop&q=80',
    category: 'Power',
  },
];

const legacySeedNames = ['KLYPH Pro', 'KLYPH Air', 'KLYPH Vault'] as const;
const legacyToSeedName: Record<(typeof legacySeedNames)[number], string> = {
  'KLYPH Pro': 'Synapse Core Ring',
  'KLYPH Air': 'Aura Spatial Clip',
  'KLYPH Vault': 'NeuroDock Magnetic Slate',
};

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 11000
  );
}

async function insertMissingProducts(products: typeof seedProducts) {
  if (!products.length) return;

  try {
    await Product.insertMany(products);
  } catch (error) {
    if (!isDuplicateKeyError(error)) throw error;

    await Product.bulkWrite(
      products.map((product) => ({
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

export async function GET() {
  try {
    await connectToDatabase();

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await insertMissingProducts(seedProducts);
    } else {
      const legacyProducts = await Product.find({
        name: { $in: legacySeedNames },
      })
        .select('_id name')
        .lean();

      if (legacyProducts.length) {
        const existingSynapseProducts = await Product.find({
          name: { $in: seedProducts.map((product) => product.name) },
        })
          .select('_id name')
          .lean();
        const existingByName = new Map(
          existingSynapseProducts.map((product) => [product.name, product._id]),
        );
        const legacyByName = new Map(
          legacyProducts.map((product) => [product.name, product._id]),
        );
        const missingProducts: typeof seedProducts = [];

        for (const product of seedProducts) {
          const legacyName = legacySeedNames.find(
            (name) => legacyToSeedName[name] === product.name,
          );
          const legacyId = legacyName ? legacyByName.get(legacyName) : undefined;
          const existingId = existingByName.get(product.name);

          if (existingId) {
            await Product.updateOne({ _id: existingId }, { $set: product });
            if (legacyId) await Product.deleteOne({ _id: legacyId });
          } else if (legacyId) {
            await Product.updateOne({ _id: legacyId }, { $set: product });
          } else {
            missingProducts.push(product);
          }
        }

        await insertMissingProducts(missingProducts);
      }
    }

    const products = await Product.find().sort({ createdAt: 1, _id: 1 }).lean();
    return NextResponse.json(products, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('GET /api/products failed with error:', error);
    return NextResponse.json(
      { error: 'Unable to load products. Please try again.' },
      { status: 500 },
    );
  }
}
