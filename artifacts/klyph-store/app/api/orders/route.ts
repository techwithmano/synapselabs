import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { AUTH_COOKIE_NAME, getUserIdFromToken } from '@/lib/auth';
import Order from '@/models/Order';
import Product from '@/models/Product';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RequestedItem = { productId?: unknown; quantity?: unknown };
type PopulatedProduct = { _id: Types.ObjectId; name: string; image: string; category: string };
type LeanOrderItem = {
  product: PopulatedProduct | Types.ObjectId | null;
  quantity: number;
  price: number;
};
type LeanOrder = {
  _id: Types.ObjectId;
  total: number;
  status: 'pending' | 'paid';
  createdAt: Date;
  items: LeanOrderItem[];
};

function getAuthenticatedUserId(request: NextRequest): string | null {
  return getUserIdFromToken(request.cookies.get(AUTH_COOKIE_NAME)?.value);
}

export async function GET(request: NextRequest) {
  try {
    const userId = getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Sign in to view your orders.' }, { status: 401 });
    }

    await connectToDatabase();
    const orders = (await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name image category')
      .lean()) as unknown as LeanOrder[];

    return NextResponse.json({
      orders: orders.map((order) => ({
        id: String(order._id),
        total: order.total,
        status: order.status,
        createdAt: new Date(order.createdAt).toISOString(),
        items: order.items.map((item) => {
          const product =
            item.product && 'name' in item.product
              ? {
                  id: String(item.product._id),
                  name: item.product.name,
                  image: item.product.image,
                  category: item.product.category,
                }
              : null;
          return {
            product,
            quantity: item.quantity,
            price: item.price,
          };
        }),
      })),
    });
  } catch (error) {
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    console.error(`GET /api/orders failed (${errorName}).`);
    return NextResponse.json(
      { error: 'Unable to load your orders.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Sign in to place an order.' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const items = body && typeof body === 'object'
      ? (body as { items?: unknown }).items
      : null;
    if (!Array.isArray(items) || items.length === 0 || items.length > 20) {
      return NextResponse.json({ error: 'Add items to your cart first.' }, { status: 400 });
    }

    const quantities = new Map<string, number>();
    for (const item of items as RequestedItem[]) {
      const productId = typeof item.productId === 'string' ? item.productId : '';
      const quantity = item.quantity;
      if (
        !Types.ObjectId.isValid(productId) ||
        typeof quantity !== 'number' ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 99
      ) {
        return NextResponse.json({ error: 'Your cart contains an invalid item.' }, { status: 400 });
      }
      const totalQuantity = (quantities.get(productId) ?? 0) + quantity;
      if (totalQuantity > 99) {
        return NextResponse.json(
          { error: 'Each item is limited to 99 per order.' },
          { status: 400 },
        );
      }
      quantities.set(productId, totalQuantity);
    }

    await connectToDatabase();
    const productIds = [...quantities.keys()];
    const products = await Product.find({ _id: { $in: productIds } })
      .select('_id name price')
      .lean();
    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'A product in your cart is no longer available.' },
        { status: 400 },
      );
    }

    const productById = new Map(products.map((product) => [String(product._id), product]));
    const orderItems = productIds.map((productId) => {
      const product = productById.get(productId)!;
      return {
        product: product._id,
        quantity: quantities.get(productId)!,
        price: product.price,
      };
    });
    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({ user: userId, items: orderItems, total });

    return NextResponse.json(
      {
        order: {
          id: String(order._id),
          total: order.total,
          status: order.status,
          createdAt: order.createdAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    console.error(`POST /api/orders failed (${errorName}).`);
    return NextResponse.json(
      { error: 'Unable to place your order. Please try again.' },
      { status: 500 },
    );
  }
}
