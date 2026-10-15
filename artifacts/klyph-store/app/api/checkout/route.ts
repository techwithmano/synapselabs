import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { AUTH_COOKIE_NAME, getUserIdFromToken } from '@/lib/auth';
import {
  getUnitPriceInCurrency,
  toStripeMinorUnits,
  type CheckoutCurrency,
} from '@/lib/pricing';
import { getStripeClient, StripeConfigurationError } from '@/lib/stripe';
import Order from '@/models/Order';
import Product from '@/models/Product';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RequestedItem = { productId?: unknown; quantity?: unknown };

function getAuthenticatedUserId(request: NextRequest): string | null {
  return getUserIdFromToken(request.cookies.get(AUTH_COOKIE_NAME)?.value);
}

function sanitizeDiagnosticValue(value: string): string {
  return value
    .replace(/mongodb(?:\+srv)?:\/\/[^\s"'<>]+/gi, '[redacted MongoDB URI]')
    .replace(/\bsk_(?:test|live)_[A-Za-z0-9]+\b/g, '[redacted Stripe key]')
    .replace(
      /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
      '[redacted token]',
    )
    .replace(
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
      '[redacted email]',
    )
    .replace(/[\r\n\t]+/g, ' ')
    .slice(0, 240);
}

function describeCheckoutError(error: unknown): string {
  if (!(error instanceof Error)) return 'name=UnknownError';

  const details: string[] = [
    `name=${sanitizeDiagnosticValue(error.name || 'Error')}`,
  ];
  const errorDetails = error as Error & {
    code?: unknown;
    type?: unknown;
    statusCode?: unknown;
    requestId?: unknown;
  };

  for (const key of ['type', 'code', 'statusCode', 'requestId'] as const) {
    const value = errorDetails[key];
    if (typeof value === 'string' || typeof value === 'number') {
      details.push(`${key}=${sanitizeDiagnosticValue(String(value))}`);
    }
  }

  if (error.message) {
    details.push(`message="${sanitizeDiagnosticValue(error.message)}"`);
  }
  return details.join(' ');
}

async function removePendingOrder(orderId: Types.ObjectId, userId: string) {
  try {
    await Order.deleteOne({ _id: orderId, user: userId, status: 'pending' });
  } catch (error) {
    console.error(
      `POST /api/checkout could not remove a pending order (${describeCheckoutError(error)}).`,
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getAuthenticatedUserId(request);
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: 'Sign in to continue to checkout.' },
        { status: 401 },
      );
    }

    const body = await request.json().catch(() => null);
    const items =
      body && typeof body === 'object'
        ? (body as { items?: unknown }).items
        : null;
    const currencyValue =
      body && typeof body === 'object'
        ? (body as { currency?: unknown }).currency
        : null;

    if (currencyValue !== 'kwd' && currencyValue !== 'usd') {
      return NextResponse.json(
        { error: 'Choose KWD or USD before checking out.' },
        { status: 400 },
      );
    }
    const currency: CheckoutCurrency = currencyValue;

    if (!Array.isArray(items) || items.length === 0 || items.length > 20) {
      return NextResponse.json(
        { error: 'Add items to your cart first.' },
        { status: 400 },
      );
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
        return NextResponse.json(
          { error: 'Your cart contains an invalid item.' },
          { status: 400 },
        );
      }

      const combinedQuantity = (quantities.get(productId) ?? 0) + quantity;
      if (combinedQuantity > 99) {
        return NextResponse.json(
          { error: 'Each item is limited to 99 per order.' },
          { status: 400 },
        );
      }
      quantities.set(productId, combinedQuantity);
    }

    await connectToDatabase();
    const productIds = [...quantities.keys()];
    const products = await Product.find({ _id: { $in: productIds } })
      .select('_id name description price')
      .lean();
    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'A product in your cart is no longer available.' },
        { status: 400 },
      );
    }

    const productById = new Map(
      products.map((product) => [String(product._id), product]),
    );
    const orderItems = productIds.map((productId) => {
      const product = productById.get(productId)!;
      const price = getUnitPriceInCurrency(product.price, currency);
      if (price <= 0 || toStripeMinorUnits(price, currency) <= 0) {
        throw new Error('Product has an invalid checkout price.');
      }
      return {
        product: product._id,
        quantity: quantities.get(productId)!,
        price,
      };
    });
    const total = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    if (!Number.isFinite(total) || total <= 0) {
      return NextResponse.json(
        { error: 'Your cart total is invalid. Please try again.' },
        { status: 400 },
      );
    }

    const stripe = getStripeClient();
    const order = await Order.create({
      user: userId,
      items: orderItems,
      total,
      currency,
      status: 'pending',
    });

    let sessionUrl: string | null = null;
    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: orderItems.map((item) => {
          const product = productById.get(String(item.product))!;
          return {
            price_data: {
              currency,
              unit_amount: toStripeMinorUnits(item.price, currency),
              product_data: {
                name: product.name,
                description: product.description || undefined,
              },
            },
            quantity: item.quantity,
          };
        }),
        metadata: { userId, orderId: String(order._id) },
        success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${request.nextUrl.origin}/cart`,
      });
      sessionUrl = session.url;
    } catch (error: any) {
      if (
        currency === 'kwd' &&
        typeof error?.message === 'string' &&
        error.message.toLowerCase().includes('invalid currency: kwd')
      ) {
        const usdCurrency: CheckoutCurrency = 'usd';
        const usdOrderItems = productIds.map((productId) => {
          const product = productById.get(productId)!;
          const price = getUnitPriceInCurrency(product.price, usdCurrency);
          return {
            product: product._id,
            quantity: quantities.get(productId)!,
            price,
          };
        });
        const usdTotal = usdOrderItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );

        order.currency = usdCurrency;
        order.items = usdOrderItems;
        order.total = usdTotal;
        await order.save();

        const fallbackSession = await stripe.checkout.sessions.create({
          mode: 'payment',
          line_items: usdOrderItems.map((item) => {
            const product = productById.get(String(item.product))!;
            return {
              price_data: {
                currency: usdCurrency,
                unit_amount: toStripeMinorUnits(item.price, usdCurrency),
                product_data: {
                  name: product.name,
                  description: product.description || undefined,
                },
              },
              quantity: item.quantity,
            };
          }),
          metadata: { userId, orderId: String(order._id) },
          success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${request.nextUrl.origin}/cart`,
        });
        sessionUrl = fallbackSession.url;
      } else {
        await removePendingOrder(order._id, userId);
        throw error;
      }
    }

    if (!sessionUrl) {
      await removePendingOrder(order._id, userId);
      return NextResponse.json(
        { error: 'Stripe did not return a checkout link. Please try again.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: sessionUrl });
  } catch (error) {
    if (error instanceof StripeConfigurationError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error(`POST /api/checkout failed (${describeCheckoutError(error)}).`);
    return NextResponse.json(
      { error: 'Unable to start checkout. Please try again.' },
      { status: 500 },
    );
  }
}
