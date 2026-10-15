'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { CART_STORAGE_KEY } from '@/lib/cart';

const HeroCanvas3D = dynamic(() => import('./components/HeroCanvas3D'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-slate-100/50 rounded-2xl" />,
});
import {
  formatCurrencyAmount,
  getUnitPriceInCurrency,
  type CheckoutCurrency,
} from '@/lib/pricing';
import {
  ArrowRight,
  AudioLines,
  BatteryCharging,
  Check,
  ChevronRight,
  Fingerprint,
  LogOut,
  Menu,
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

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function checkoutCurrency(currency: Currency): CheckoutCurrency {
  return currency === 'USD' ? 'usd' : 'kwd';
}

function formatPrice(price: number, currency: Currency): string {
  const code = checkoutCurrency(currency);
  return formatCurrencyAmount(getUnitPriceInCurrency(price, code), code);
}

function categoryIcon(category: string) {
  const normalized = category.toLowerCase();
  if (normalized.includes('audio')) return <AudioLines size={19} aria-hidden="true" />;
  if (normalized.includes('power')) return <BatteryCharging size={19} aria-hidden="true" />;
  return <Watch size={19} aria-hidden="true" />;
}

export default function SynapseStorefront({
  initialCartOpen = false,
}: {
  initialCartOpen?: boolean;
} = {}) {
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
  const [startingCheckout, setStartingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [addedProduct, setAddedProduct] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    if (initialCartOpen && cartRestored) setCartOpen(true);
  }, [initialCartOpen, cartRestored]);

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
  const currencyCode = checkoutCurrency(currency);
  const subtotal = cartItems.reduce(
    (sum, line) =>
      sum + getUnitPriceInCurrency(line.product.price, currencyCode) * line.quantity,
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

  async function startCheckout() {
    if (!account) {
      window.location.assign('/login?next=%2Fcart');
      return;
    }
    if (!cartItems.length) return;
    setStartingCheckout(true);
    setCheckoutError('');
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map((line) => ({
            productId: line.productId,
            quantity: line.quantity,
          })),
          currency: currencyCode,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
        url?: string;
      };
      if (response.status === 401) {
        setAccount(null);
        window.location.assign('/login?next=%2Fcart');
        return;
      }
      if (!response.ok) {
        setCheckoutError(result.error ?? 'Unable to start checkout. Please try again.');
        return;
      }
      if (!result.url) {
        setCheckoutError('Stripe did not return a checkout link. Please try again.');
        return;
      }
      window.location.assign(result.url);
    } catch {
      setCheckoutError('Connection issue. Please try checkout again.');
    } finally {
      setStartingCheckout(false);
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
    <main className="synapse-canvas synapse-store" data-testid="storefront">
      <header className="site-header">
        <div className="nav-shell">
          <div className="site-header-inner">
            <Link className="brand-lockup" href="/" aria-label="Synapse Labs home">
              <span className="brand-mark" aria-hidden="true">S</span>
              <span className="brand-words"><strong>SYNAPSE</strong><small>LABS</small></span>
            </Link>

            <nav className="main-nav" aria-label="Main navigation">
              <a className="nav-link" href="/#devices">Devices</a>
              <a className="nav-link" href="/#technology">Technology</a>
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
                  <div className="nav-user-pill" title={account.name}>
                    <span className="nav-user-avatar" aria-hidden="true">
                      {account.name.trim().charAt(0) || 'U'}
                    </span>
                    <span className="nav-user-name">{account.name}</span>
                  </div>
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

            <button
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="icon-button mobile-menu-toggle"
              onClick={() => setMobileMenuOpen((open) => !open)}
              type="button"
            >
              {mobileMenuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-nav-tray" aria-label="Mobile navigation">
            <nav className="mobile-nav-links">
              <a
                className="mobile-nav-link"
                href="/#devices"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Devices</span>
                <ChevronRight size={15} aria-hidden="true" />
              </a>
              <a
                className="mobile-nav-link"
                href="/#technology"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Technology</span>
                <ChevronRight size={15} aria-hidden="true" />
              </a>
            </nav>

            <div className="mobile-nav-divider" />

            <div className="mobile-nav-currency">
              <span className="mobile-nav-subhead">Display Currency</span>
              <div className="currency-switch" aria-label="Mobile display currency">
                <button
                  aria-pressed={currency === 'KWD'}
                  onClick={() => setCurrency('KWD')}
                  type="button"
                >
                  KWD
                </button>
                <button
                  aria-pressed={currency === 'USD'}
                  onClick={() => setCurrency('USD')}
                  type="button"
                >
                  USD
                </button>
              </div>
            </div>

            <div className="mobile-nav-divider" />

            <div className="mobile-nav-account">
              {!accountLoading && (
                account ? (
                  <div className="mobile-account-group">
                    <div className="mobile-user-info">
                      <span className="nav-user-avatar" aria-hidden="true">
                        {account.name.trim().charAt(0) || 'U'}
                      </span>
                      <div className="mobile-user-details">
                        <strong>{account.name}</strong>
                        <small>{account.email}</small>
                      </div>
                    </div>
                    <div className="mobile-account-actions">
                      <Link
                        className="mobile-action-button"
                        href="/orders"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <PackageCheck size={16} aria-hidden="true" />
                        <span>My orders</span>
                      </Link>
                      <button
                        className="mobile-action-button mobile-logout-button"
                        disabled={signingOut}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          void signOut();
                        }}
                        type="button"
                      >
                        <LogOut size={16} aria-hidden="true" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    className="button-primary mobile-signin-button"
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserRound size={17} aria-hidden="true" />
                    <span>Sign in to account</span>
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </header>

      <section className="hero-section page-container">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="eyebrow-dot" />
            SYNAPSE LABS / HARDWARE SYSTEM 01
          </span>
          <h1>
            Intelligence, in form.
            <span className="headline-muted">Continuous biometric clarity.</span>
          </h1>
          <p className="hero-description">
            Precision neural telemetry housed in tactile monolithic ceramics.
            Calm, unyielding performance engineered for seamless sensory integration.
          </p>
          <div className="hero-cta-group">
            <a className="synapse-button hero-button" href="#devices">
              Explore the collection ↗
            </a>
            <a className="synapse-link-secondary" href="#technology">
              Discover the technology <ChevronRight size={15} aria-hidden="true" />
            </a>
          </div>

          <div className="hero-metadata-strip">
            <div className="metadata-item">
              <span className="metadata-label">Collection</span>
              <span className="metadata-value">01 / Wearables</span>
            </div>
            <div className="metadata-divider" aria-hidden="true" />
            <div className="metadata-item">
              <span className="metadata-label">Design Language</span>
              <span className="metadata-value">Ceramic / Titanium</span>
            </div>
            <div className="metadata-divider" aria-hidden="true" />
            <div className="metadata-item">
              <span className="metadata-label">Telemetry</span>
              <span className="metadata-value">Continuous Neural Optical</span>
            </div>
          </div>
        </div>

        <div className="hero-visual-wrap">
          {loadingProducts ? (
            <div aria-hidden="true" className="hero-image-skeleton" />
          ) : featuredProduct ? (
            <div className="hero-stage hero-product-visual" data-testid="hero-product">
              <div className="hero-stage__halo" aria-hidden="true" />
              <span className="hero-stage__label hero-stage__label--top">
                SC–01 // CORE SENSOR ARRAY
              </span>
              <span className="hero-stage__label hero-stage__label--bottom">
                FORM / 001 // ENGINEERED IN DETAIL
              </span>
              <div className="hero-stage__viewport">
                <HeroCanvas3D />
              </div>
              <div className="hero-stage__caption">
                <div className="hero-caption-icon">{categoryIcon(featuredProduct.category)}</div>
                <div className="hero-caption-name">
                  <span>FLAGSHIP INSTRUMENT</span>
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
        </div>
      </section>

      <section className="benefit-strip" aria-label="Synapse device categories">
        <div className="benefit-strip-inner">
          <div><Fingerprint size={17} aria-hidden="true" /><span>Sub-millimeter Biometrics</span></div>
          <span className="benefit-divider" aria-hidden="true" />
          <div><AudioLines size={17} aria-hidden="true" /><span>Spatial Acoustic Conduction</span></div>
          <span className="benefit-divider" aria-hidden="true" />
          <div><BatteryCharging size={17} aria-hidden="true" /><span>Monolithic Magnetic Induction</span></div>
        </div>
      </section>

      <section className="devices-section page-container" id="devices">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE HARDWARE PORTFOLIO</span>
            <h2>Engineered Calm.</h2>
          </div>
          <p>Tactile ceramic and titanium instrumentation designed for seamless biometric synchronicity.</p>
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
                <div className="product-card__visual">
                  <div className="product-card__badges">
                    <span className="product-card__category">{product.category}</span>
                    <span className="product-card__status">
                      <span className="status-indicator-dot" /> AVAILABLE
                    </span>
                  </div>
                  <div className="product-card__img-container">
                    <img alt={product.name} loading="lazy" src={product.image} />
                  </div>
                  <div className="product-card__action">
                    <span>View product ↗</span>
                  </div>
                </div>
                <div className="product-card-content">
                  <div className="product-card-meta">
                    <span className="category-label">{product.category}</span>
                    <span className="product-category-icon">{categoryIcon(product.category)}</span>
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-card-footer">
                    <div className="price-stack">
                      <span className="price-label">UNIT PRICE</span>
                      <strong data-testid={`text-price-${product.slug}`}>
                        {formatPrice(product.price, currency)}
                      </strong>
                    </div>
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
          <h2>Human telemetry. Zero friction.</h2>
        </div>
        <a className="synapse-button" href="#devices">
          Explore the collection ↗
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
              {cartItems.length ? (
                <>
                  <div className="cart-lines">
                    {cartItems.map((line) => (
                      <article className="cart-line" key={line.product.id}>
                        <img alt="" src={line.product.image} />
                        <div className="cart-line-details">
                          <span className="category-label">{line.product.category}</span>
                          <h3>{line.product.name}</h3>
                          <strong data-testid={`text-line-price-${line.product.slug}`}>
                            {formatCurrencyAmount(
                              getUnitPriceInCurrency(line.product.price, currencyCode) *
                                line.quantity,
                              currencyCode,
                            )}
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
                      <strong data-testid="text-cart-subtotal">
                        {formatCurrencyAmount(subtotal, currencyCode)}
                      </strong>
                    </div>
                    <p>Shipping and taxes are calculated separately.</p>
                    <button
                      className="button-primary place-order-button"
                      data-testid="button-checkout"
                      disabled={startingCheckout}
                      onClick={() => void startCheckout()}
                      type="button"
                    >
                      {startingCheckout
                        ? 'Opening secure checkout…'
                        : account
                        ? 'Secure checkout'
                        : 'Sign in to checkout'}
                      {!startingCheckout && <ArrowRight size={17} aria-hidden="true" />}
                    </button>
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
