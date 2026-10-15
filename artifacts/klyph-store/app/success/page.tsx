import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ArrowLeft, ArrowRight, BadgeCheck, CircleAlert } from 'lucide-react';
import { Types } from 'mongoose';
import connectToDatabase from '@/lib/db';
import { AUTH_COOKIE_NAME, verifyAuthToken } from '@/lib/auth';
import { toStripeMinorUnits, type CheckoutCurrency } from '@/lib/pricing';
import { getStripeClient } from '@/lib/stripe';
import CartClear from './CartClear';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string | string[] }>;
};

function CheckoutStatus({
  success,
  title,
  message,
}: {
  success: boolean;
  title: string;
  message: string;
}) {
  return (
    <main className="account-shell success-page">
      <header className="account-topbar">
        <Link className="brand-lockup" href="/" aria-label="Synapse Labs home">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span className="brand-words"><strong>SYNAPSE</strong><small>LABS</small></span>
        </Link>
        <Link className="back-link" href="/">
          <ArrowLeft size={15} aria-hidden="true" /> Continue shopping
        </Link>
      </header>

      <section className="success-content">
        <div className="success-card" role={success ? 'status' : 'alert'}>
          <span className={`success-icon${success ? ' is-paid' : ''}`}>
            {success ? (
              <BadgeCheck size={30} aria-hidden="true" />
            ) : (
              <CircleAlert size={28} aria-hidden="true" />
            )}
          </span>
          <span className="eyebrow">
            {success ? 'PAYMENT CONFIRMED' : 'CHECKOUT STATUS'}
          </span>
          <h1>{title}</h1>
          <p>{message}</p>
          <div className="success-actions">
            {success ? (
              <>
                <Link className="button-primary" href="/orders">
                  View in My Orders <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link className="text-button" href="/">Continue Shopping</Link>
              </>
            ) : (
              <>
                <Link className="button-primary" href="/cart">Return to cart</Link>
                <Link className="text-button" href="/">Continue shopping</Link>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId =
    typeof params.session_id === 'string' ? params.session_id : null;

  if (!sessionId) {
    return (
      <CheckoutStatus
        success={false}
        title="No payment session found"
        message="Your cart is unchanged. Return to checkout to try again."
      />
    );
  }

  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const identity = token ? verifyAuthToken(token) : null;
  if (!identity) {
    redirect(`/login?next=${encodeURIComponent(`/success?session_id=${sessionId}`)}`);
  }

  try {
    const session = await getStripeClient().checkout.sessions.retrieve(sessionId);
    const orderId = session.metadata?.orderId;

    if (
      session.mode !== 'payment' ||
      session.payment_status !== 'paid' ||
      session.metadata?.userId !== identity.userId ||
      !orderId ||
      !Types.ObjectId.isValid(orderId)
    ) {
      return (
        <CheckoutStatus
          success={false}
          title="Payment not confirmed"
          message="We could not verify a completed payment. Your cart is still saved, so you can try again."
        />
      );
    }

    await connectToDatabase();
    const order = await Order.findOne({
      _id: orderId,
      user: identity.userId,
    });
    if (!order) {
      return (
        <CheckoutStatus
          success={false}
          title="Order not found"
          message="We could not match this payment to an order. Your cart has been preserved."
        />
      );
    }

    const currency = (order.currency ?? 'kwd') as CheckoutCurrency;
    if (
      session.currency?.toLowerCase() !== currency ||
      session.amount_total !== toStripeMinorUnits(order.total, currency)
    ) {
      return (
        <CheckoutStatus
          success={false}
          title="Payment details need review"
          message="The payment could not be matched to this order. Your cart is still saved."
        />
      );
    }

    if (order.status !== 'paid') {
      order.status = 'paid';
      await order.save();
    }

    return (
      <>
        <CheckoutStatus
          success
          title="Thank you for your order."
          message="Your payment is complete. Your order is now available in your account."
        />
        <CartClear />
      </>
    );
  } catch (error) {
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    console.error(`GET /success verification failed (${errorName}).`);
    return (
      <CheckoutStatus
        success={false}
        title="We couldn't verify your payment"
        message="Your cart is still saved. Check your orders or return to checkout in a moment."
      />
    );
  }
}
