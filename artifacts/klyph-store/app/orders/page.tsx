import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AlertCircle, ArrowLeft, ArrowRight, PackageCheck } from 'lucide-react';
import connectToDatabase from '@/lib/db';
import { AUTH_COOKIE_NAME, verifyAuthToken } from '@/lib/auth';
import Order from '@/models/Order';
import User from '@/models/User';
import { Types } from 'mongoose';
import { formatCurrencyAmount, type CheckoutCurrency } from '@/lib/pricing';
import SynapseLogo from '@/src/components/SynapseLogo';
import Footer from '@/src/components/storefront/Footer';

export const dynamic = 'force-dynamic';

type PopulatedProduct = {
  _id: Types.ObjectId;
  name: string;
  image: string;
  category: string;
};
type OrderRecord = {
  _id: Types.ObjectId;
  total: number;
  currency?: string;
  status: 'pending' | 'paid';
  createdAt: Date;
  items: {
    product: PopulatedProduct | Types.ObjectId | null;
    quantity: number;
    price: number;
  }[];
};

function orderCurrency(value?: string): CheckoutCurrency {
  return value === 'usd' ? 'usd' : 'kwd';
}

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const identity = token ? verifyAuthToken(token) : null;
  if (!identity) redirect('/login?next=%2Forders');

  await connectToDatabase();
  const user = await User.findById(identity.userId).select('name').lean();
  if (!user) redirect('/login?next=%2Forders');

  const orders = (await Order.find({ user: identity.userId })
    .sort({ createdAt: -1 })
    .populate('items.product', 'name image category')
    .lean()) as unknown as OrderRecord[];

  return (
    <main className="account-shell">
      <header className="account-topbar">
        <Link className="brand-lockup" href="/" aria-label="Synapse Labs home">
          <SynapseLogo size={24} showWordmark={true} />
        </Link>
        <Link className="back-link" href="/">
          <ArrowLeft size={15} aria-hidden="true" /> Continue shopping
        </Link>
      </header>

      <section className="orders-page">
        <div className="orders-title-row">
          <div>
            <span className="eyebrow">YOUR ACCOUNT</span>
            <h1>My orders</h1>
            <p>Welcome, {user.name}.</p>
          </div>
          <PackageCheck className="orders-title-icon" size={34} aria-hidden="true" />
        </div>

        {orders.length ? (
          <div className="orders-list">
            {orders.map((order) => (
              <article className="order-card" key={String(order._id)}>
                <div className="order-card-head">
                  <div>
                    <span className="order-label">ORDER</span>
                    <h2>#{String(order._id).slice(-8).toUpperCase()}</h2>
                  </div>
                  <div className="order-status">
                    <span className={`status-dot status-${order.status}`} />
                    {order.status === 'pending' ? 'Payment not completed' : order.status}
                  </div>
                </div>
                <div className="order-items">
                  {order.items.map((item, index) => {
                    const product =
                      item.product && 'name' in item.product ? item.product : null;
                    const currency = orderCurrency(order.currency);
                    return (
                      <div className="order-line" key={`${String(order._id)}-${index}`}>
                        {product?.image ? (
                          <img src={product.image} alt="" loading="lazy" />
                        ) : (
                          <span className="order-image-placeholder" />
                        )}
                        <div className="order-line-name">
                          <strong>{product?.name ?? 'Unavailable product'}</strong>
                          <span>Qty {item.quantity}</span>
                        </div>
                        <span className="order-line-price">
                          {formatCurrencyAmount(item.price * item.quantity, currency)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {order.status === 'pending' && (
                  <div className="order-pending-notice" role="note">
                    <div className="order-pending-msg">
                      <AlertCircle size={16} className="order-pending-icon" aria-hidden="true" />
                      <span>Payment was not completed for this checkout session.</span>
                    </div>
                    <div className="order-pending-links">
                      <Link href="/cart" className="order-action-link order-action-btn order-action-btn--primary">
                        <span>Return to cart</span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                      <Link href="/support" className="order-action-link order-action-btn order-action-btn--secondary">
                        <span>Need help? Sizing &amp; Support</span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                )}
                <div className="order-card-foot">
                  <time dateTime={new Date(order.createdAt).toISOString()}>
                    {new Date(order.createdAt).toLocaleDateString('en', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                  <strong>
                    {formatCurrencyAmount(order.total, orderCurrency(order.currency))}
                  </strong>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="orders-empty">
            <span className="empty-icon"><PackageCheck size={24} aria-hidden="true" /></span>
            <h2>No orders yet</h2>
            <p>Your Synapse purchases will appear here.</p>
            <Link className="button-primary" href="/">Explore devices</Link>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
