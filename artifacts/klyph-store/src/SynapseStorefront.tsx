'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  AudioLines,
  BatteryCharging,
  Check,
  ChevronRight,
  Fingerprint,
  LogOut,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  UserRound,
  Watch,
  X,
} from 'lucide-react';

type Currency = 'KWD' | 'USD';
type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};
type CartLine = { productId: string; quantity: number };
type Account = { id: string; name: string; email: string };
type ApiProduct = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};
type ProductResponse = { error?: string } | ApiProduct[];

const CART_STORAGE_KEY = 'synapse-cart-v1';
const KWD_TO_USD = 3.27;

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function formatPrice(price: number, currency: Currency): string {
  return currency === 'USD'
    ? `$${Math.round(price * KWD_TO_USD)} USD`
    : `${price} KWD`;
}

function categoryIcon(category: string) {
  const normalized = category.toLowerCase();
  if (normalized.includes('audio')) return <AudioLines size={19} aria-hidden="true" />;
  if (normalized.includes('power')) return <BatteryCharging size={19} aria-hidden="true" />;
  return <Watch size={19} aria-hidden="true" />;
}

export default function SynapseStorefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState('');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartRestored, setCartRestored] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>('KWD');
  const [account, setAccount] = useState<Account | null>(null);
  const [accountLoading, setAccountLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [addedProduct, setAddedProduct] = useState('');

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    setProductError('');
    try {
      const response = await fetch('/api/products', { cache: 'no-store' });
      const payload = (await response.json()) as ProductResponse;
      if (!response.ok || !Array.isArray(payload)) {
        throw new Error(
          !Array.isArray(payload) && payload.error
            ? payload.error
            : 'Products are temporarily unavailable.',
        );
      }
      setProducts(
        payload.map((record) => ({
          id: record._id,
          slug: slugify(record.name),
          name: record.name,
          description: record.description,
          price: record.price,
          image: record.image,
          category: record.category,
        })),
      );
    } catch (error) {
      setProductError(
        error instanceof Error ? error.message : 'Products are temporarily unavailable.',
      );
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
    void fetch('/api/auth/me', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) return null;
        const result = (await response.json()) as { user?: Account | null };
        return result.user ?? null;
      })
      .then(setAccount)
      .catch(() => setAccount(null))
      .finally(() => setAccountLoading(false));

    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as unknown;
        if (
          Array.isArray(parsed) &&
          parsed.every(
            (line) =>
              line &&
              typeof line.productId === 'string' &&
              Number.isInteger(line.quantity) &&
              line.quantity > 0 &&
              line.quantity <= 99,
          )
        ) {
          setCart(parsed as CartLine[]);
        }
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setCartRestored(true);
    }
  }, [loadProducts]);

  useEffect(() => {
    if (!cartRestored) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart, cartRestored]);

  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );
  const cartItems = useMemo(
    () =>
      cart
        .map((line) => ({ ...line, product: productById.get(line.productId) }))
        .filter((line): line is CartLine & { product: Product } => Boolean(line.product)),
    [cart, productById],
  );
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  );
  const featuredProduct =
    products.find((product) => product.category.toLowerCase() === 'wearables') ??
    products[0];

  function addToCart(productId: string) {
    setCart((current) => {
      const found = current.find((line) => line.productId === productId);
      if (found) {
        return current.map((line) =>
          line.productId === productId
            ? { ...line, quantity: Math.min(line.quantity + 1, 99) }
            : line,
        );
      }
      return [...current, { productId, quantity: 1 }];
    });
    setAddedProduct(productId);
    setCheckoutError('');
    setOrderComplete(false);
    setCartOpen(true);
    window.setTimeout(() => setAddedProduct(''), 1400);
  }

  function adjustQuantity(productId: string, amount: number) {
    setCart((current) =>
      current
        .map((line) =>
          line.productId === productId
            ? { ...line, quantity: line.quantity + amount }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }

  async function placeOrder() {
    if (!account || !cartItems.length) return;
    setPlacingOrder(true);
    setCheckoutError('');
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map((line) => ({
            productId: line.productId,
            quantity: line.quantity,
          })),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setCheckoutError(result.error ?? 'Unable to place your order. Please try again.');
        return;
      }
      setCart([]);
      setOrderComplete(true);
    } catch {
      setCheckoutError('Connection issue. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  }

  async function signOut() {
    setSigningOut(true);
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) setAccount(null);
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <main className="synapse-store" data-testid="storefront">
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="brand-lockup" href="/" aria-label="Synapse Labs home">
            <span className="brand-mark" aria-hidden="true">S</span>
            <span className="brand-words"><strong>SYNAPSE</strong><small>LABS</small></span>
          </Link>

          <nav className="main-nav" aria-label="Main navigation">
            <a href="#devices">Devices</a>
            <a href="#technology">Technology</a>
          </nav>

          <div className="header-actions">
            <div className="currency-switch" aria-label="Display currency">
              <button
                aria-pressed={currency === 'KWD'}
                data-testid="button-currency-kwd"
                onClick={() => setCurrency('KWD')}
                type="button"
              >
                KWD
              </button>
              <button
                aria-pressed={currency === 'USD'}
                data-testid="button-currency-usd"
                onClick={() => setCurrency('USD')}
                type="button"
              >
                USD
              </button>
            </div>

            {!accountLoading &&
              (account ? (
                <>
                  <span className="nav-user-name" title={account.name}>{account.name}</span>
                  <Link
                    aria-label="My orders"
                    className="icon-button orders-nav-button"
                    href="/orders"
                    title="My orders"
                  >
                    <PackageCheck size={18} aria-hidden="true" />
                    <span className="action-label">Orders</span>
                  </Link>
                  <button
                    aria-label="Log out"
                    className="icon-button logout-button"
                    disabled={signingOut}
                    onClick={() => void signOut()}
                    title="Log out"
                    type="button"
                  >
                    <LogOut size={17} aria-hidden="true" />
                  </button>
                </>
              ) : (
                <Link className="signin-link" href="/login">
                  <UserRound size={17} aria-hidden="true" />
                  <span>Sign in</span>
                </Link>
              ))}

            <button
              aria-label={`Open cart${cartCount ? `, ${cartCount} items` : ''}`}
              className="icon-button cart-button"
              data-testid="button-open-cart"
              onClick={() => setCartOpen(true)}
              type="button"
            >
              <ShoppingBag size={18} aria-hidden="true" />
              <span className="cart-count" data-testid="text-cart-count">{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      <section className="hero-section page-container">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> PERSONAL TECH, IN SYNC</span>
          <h1>Technology that<br /><span>feels natural.</span></h1>
          <p>Three focused devices. One clearer connection to your day.</p>
          <a className="button-primary hero-button" href="#devices">
            Explore the devices <ArrowRight size={17} aria-hidden="true" />
          </a>
          <div className="hero-note">
            <span className="hero-note-icon"><Check size={14} aria-hidden="true" /></span>
            Designed for everyday use
          </div>
        </div>

        <div className="hero-visual-wrap">
          {loadingProducts ? (
            <div aria-hidden="true" className="hero-image-skeleton" />
          ) : featuredProduct ? (
            <div className="hero-product-visual" data-testid="hero-product">
              <div className="hero-image-frame">
                <img
                  alt={featuredProduct.name}
                  className="hero-product-image"
                  fetchPriority="high"
                  src={featuredProduct.image}
                />
              </div>
              <div className="hero-visual-caption">
                <div className="hero-caption-icon">{categoryIcon(featuredProduct.category)}</div>
                <div className="hero-caption-name">
                  <span>FEATURED DEVICE</span>
                  <strong>{featuredProduct.name}</strong>
                </div>
                <span className="hero-caption-price">{formatPrice(featuredProduct.price, currency)}</span>
              </div>
            </div>
          ) : (
            <div className="hero-image-empty" aria-label="No featured device available">
              <Fingerprint size={46} aria-hidden="true" />
            </div>
          )}
          <span className="hero-visual-index" aria-hidden="true">01 / 03</span>
        </div>
      </section>

      <section className="benefit-strip" aria-label="Synapse device categories">
        <div className="benefit-strip-inner">
          <div><Fingerprint size={17} aria-hidden="true" /><span>Biometric sensing</span></div>
          <span className="benefit-divider" aria-hidden="true" />
          <div><AudioLines size={17} aria-hidden="true" /><span>Spatial audio</span></div>
          <span className="benefit-divider" aria-hidden="true" />
          <div><BatteryCharging size={17} aria-hidden="true" /><span>Magnetic power</span></div>
        </div>
      </section>

      <section className="devices-section page-container" id="devices">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE COLLECTION</span>
            <h2>Made to work together.</h2>
          </div>
          <p>Thoughtful hardware for how you move, listen, and recharge.</p>
        </div>

        {productError && (
          <div className="product-error" role="alert">
            <p>{productError}</p>
            <button className="text-button" onClick={() => void loadProducts()} type="button">
              Try again <ChevronRight size={15} aria-hidden="true" />
            </button>
          </div>
        )}

        {loadingProducts ? (
          <div aria-label="Loading devices" className="product-grid product-grid-skeleton" aria-busy="true">
            {[0, 1, 2].map((item) => (
              <div className="product-skeleton" key={item}>
                <span className="skeleton-image" />
                <span className="skeleton-line skeleton-line-short" />
                <span className="skeleton-line" />
                <span className="skeleton-line skeleton-line-medium" />
              </div>
            ))}
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-card-image">
                  <img alt={product.name} loading="lazy" src={product.image} />
                  <span className="product-number">{String(products.indexOf(product) + 1).padStart(2, '0')}</span>
                </div>
                <div className="product-card-content">
                  <div className="product-card-meta">
                    <span className="category-label">{product.category}</span>
                    <span className="product-category-icon">{categoryIcon(product.category)}</span>
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-card-footer">
                    <strong data-testid={`text-price-${product.slug}`}>
                      {formatPrice(product.price, currency)}
                    </strong>
                    <button
                      className={`add-button${addedProduct === product.id ? ' is-added' : ''}`}
                      data-testid={`button-add-${product.slug}`}
                      onClick={() => addToCart(product.id)}
                      type="button"
                    >
                      {addedProduct === product.id ? (
                        <>Added <Check size={16} aria-hidden="true" /></>
                      ) : (
                        <>Add to cart <ArrowRight size={16} aria-hidden="true" /></>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="technology-section" id="technology">
        <div className="page-container technology-inner">
          <div className="technology-heading">
            <span className="eyebrow">THE SYNAPSE APPROACH</span>
            <h2>Less friction.<br /><span>More flow.</span></h2>
            <p>Useful technology should fit your life, not interrupt it.</p>
          </div>
          <div className="technology-cards">
            <article className="technology-card">
              <span className="technology-icon"><Fingerprint size={20} aria-hidden="true" /></span>
              <span className="technology-index">01</span>
              <h3>Sense</h3>
              <p>Quiet biometric insight, built for everyday wear.</p>
            </article>
            <article className="technology-card">
              <span className="technology-icon"><AudioLines size={20} aria-hidden="true" /></span>
              <span className="technology-index">02</span>
              <h3>Hear</h3>
              <p>Spatial sound that leaves you in your surroundings.</p>
            </article>
            <article className="technology-card">
              <span className="technology-icon"><BatteryCharging size={20} aria-hidden="true" /></span>
              <span className="technology-index">03</span>
              <h3>Recharge</h3>
              <p>Simple magnetic charging, ready when you are.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="closing-section page-container">
        <div>
          <span className="eyebrow">SYNAPSE LABS</span>
          <h2>Your day, in better sync.</h2>
        </div>
        <a className="button-primary" href="#devices">
          Explore the collection <ArrowRight size={17} aria-hidden="true" />
        </a>
      </section>

      <footer className="site-footer">
        <div className="page-container footer-inner">
          <Link className="brand-lockup" href="/" aria-label="Synapse Labs home">
            <span className="brand-mark" aria-hidden="true">S</span>
            <span className="brand-words"><strong>SYNAPSE</strong><small>LABS</small></span>
          </Link>
          <span>Considered technology for everyday life.</span>
          <a href="#devices">Devices <ChevronRight size={14} aria-hidden="true" /></a>
          <small>© {new Date().getFullYear()} Synapse Labs</small>
        </div>
      </footer>

      {cartOpen && (
        <div
          className="cart-backdrop"
          data-testid="cart-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCartOpen(false);
          }}
        >
          <section
            aria-label="Shopping cart"
            aria-modal="true"
            className="cart-drawer"
            data-testid="cart-drawer"
            role="dialog"
          >
            <header className="cart-header">
              <div>
                <span className="eyebrow">YOUR SELECTION</span>
                <h2>Shopping bag <span>({cartCount})</span></h2>
              </div>
              <button
                aria-label="Close cart"
                className="icon-button"
                data-testid="button-close-cart"
                onClick={() => setCartOpen(false)}
                type="button"
              >
                <X size={19} aria-hidden="true" />
              </button>
            </header>

            <div className="cart-body">
              {orderComplete ? (
                <div className="cart-success" role="status">
                  <span className="success-check"><Check size={22} aria-hidden="true" /></span>
                  <h3>Order placed.</h3>
                  <p>Your order is saved as pending. You can follow it in your account.</p>
                  <Link className="text-button" href="/orders">
                    View my orders <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              ) : cartItems.length ? (
                <>
                  <div className="cart-lines">
                    {cartItems.map((line) => (
                      <article className="cart-line" key={line.product.id}>
                        <img alt="" src={line.product.image} />
                        <div className="cart-line-details">
                          <span className="category-label">{line.product.category}</span>
                          <h3>{line.product.name}</h3>
                          <strong data-testid={`text-line-price-${line.product.slug}`}>
                            {formatPrice(line.product.price * line.quantity, currency)}
                          </strong>
                          <div className="quantity-control">
                            <button
                              aria-label={`Decrease ${line.product.name} quantity`}
                              data-testid={`button-quantity-minus-${line.product.slug}`}
                              onClick={() => adjustQuantity(line.product.id, -1)}
                              type="button"
                            >
                              <Minus size={13} aria-hidden="true" />
                            </button>
                            <span data-testid={`text-quantity-${line.product.slug}`}>{line.quantity}</span>
                            <button
                              aria-label={`Increase ${line.product.name} quantity`}
                              data-testid={`button-quantity-plus-${line.product.slug}`}
                              onClick={() => adjustQuantity(line.product.id, 1)}
                              type="button"
                            >
                              <Plus size={13} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {checkoutError && <p className="checkout-error" role="alert">{checkoutError}</p>}
                  <div className="cart-checkout">
                    <div className="cart-subtotal">
                      <span>Subtotal</span>
                      <strong data-testid="text-cart-subtotal">{formatPrice(subtotal, currency)}</strong>
                    </div>
                    <p>Shipping and taxes are calculated separately.</p>
                    {account ? (
                      <button
                        className="button-primary place-order-button"
                        data-testid="button-place-order"
                        disabled={placingOrder}
                        onClick={() => void placeOrder()}
                        type="button"
                      >
                        {placingOrder ? 'Saving order…' : 'Place order'}
                        {!placingOrder && <ArrowRight size={17} aria-hidden="true" />}
                      </button>
                    ) : (
                      <Link className="button-primary place-order-button" href="/login?next=%2F">
                        Sign in to place order <ArrowRight size={17} aria-hidden="true" />
                      </Link>
                    )}
                    <div className="cart-currency-switch">
                      <span>Display in</span>
                      <button
                        aria-pressed={currency === 'KWD'}
                        onClick={() => setCurrency('KWD')}
                        type="button"
                      >KWD</button>
                      <button
                        aria-pressed={currency === 'USD'}
                        onClick={() => setCurrency('USD')}
                        type="button"
                      >USD</button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="cart-empty">
                  <span className="empty-icon"><ShoppingBag size={24} aria-hidden="true" /></span>
                  <h3>Your bag is empty.</h3>
                  <p>Choose a device to get started.</p>
                  <button
                    className="text-button"
                    onClick={() => setCartOpen(false)}
                    type="button"
                  >
                    Explore devices <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
