'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Check, ChevronRight, CreditCard,
  Fingerprint, KeyRound, LockKeyhole, Minus, Plus, Radar, Shield, ShieldCheck,
  ShoppingBag, X,
} from 'lucide-react';

type Currency = 'KWD' | 'USD';
type Finish = 'Matte Black' | 'Stealth Navy' | 'Raw Titanium';
type Product = {
  id: string; name: string; price: number; description: string; category: string; specs: string[];
  image: string; alt: string; badge: string; stock: string; tone: 'gold' | 'quiet';
};
type ProductRecord = {
  _id: string; name: string; description: string; price: number; image: string; category: string;
};
type ProductPresentation = Pick<Product, 'id' | 'alt' | 'badge' | 'stock' | 'tone' | 'specs'>;
type CartLine = { productId: string; finish: Finish; quantity: number };

const productPresentation: Record<string, ProductPresentation> = {
  'KLYPH Pro': {
    id: 'pro', alt: 'KLYPH Pro monolithic titanium biometric vault',
    badge: 'FLAGSHIP', stock: 'In stock · Ships in 24h', tone: 'gold', specs: ['Biometric', '8 cards'],
  },
  'KLYPH Air': {
    id: 'air', alt: 'KLYPH Air ultra-slim carbon fiber wallet',
    badge: 'ULTRA-SLIM', stock: '4.2mm profile', tone: 'quiet', specs: ['3K carbon', 'MagSafe'],
  },
  'KLYPH Vault': {
    id: 'vault', alt: 'KLYPH Vault steel seed recovery plate',
    badge: 'MAXIMUM SECURITY', stock: '1400°C blast proof', tone: 'quiet', specs: ['316L steel', '1400°C'],
  },
};
function isProductRecord(value: unknown): value is ProductRecord {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return typeof item._id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.description === 'string' &&
    typeof item.price === 'number' && Number.isFinite(item.price) &&
    typeof item.image === 'string' &&
    typeof item.category === 'string';
}
function toStoreProduct(record: ProductRecord): Product {
  const presentation = productPresentation[record.name];
  return {
    id: presentation?.id ?? record._id,
    name: record.name,
    description: record.description,
    price: record.price,
    image: record.image,
    category: record.category,
    alt: presentation?.alt ?? record.name,
    badge: presentation?.badge ?? record.category,
    stock: presentation?.stock ?? 'Available',
    tone: presentation?.tone ?? 'quiet',
    specs: presentation?.specs ?? [],
  };
}
const finishes: { name: Finish; color: string }[] = [
  { name: 'Matte Black', color: '#171717' },
  { name: 'Stealth Navy', color: '#0f172a' },
  { name: 'Raw Titanium', color: '#94a3b8' },
];
const comparisonRows = [
  ['Biometric Pin Authorization', 'Sub-200ms Capacitive', 'None (Manual pull)', 'PIN Buttons (Vulnerable)'],
  ['Asset Geolocation Tracking', 'Native Apple Find My', 'None', 'None'],
  ['Enclave Certification', 'Common Criteria EAL6+', 'N/A', 'EAL5+ Standard'],
  ['Material Composition', 'Grade 5 Titanium CNC', 'Aluminum Alloy / PU Leather', 'Molded Polycarbonate'],
  ['Liquid Submersion Rating', 'IP68 (6m depth 24h)', 'Unrated', 'Non-waterproof'],
] as const;
const usdRate = 95 / 29;

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<Currency>('KWD');
  const [selected, setSelected] = useState<Record<string, Finish>>({
    pro: 'Matte Black', air: 'Matte Black', vault: 'Raw Titanium',
  });
  const [cartItems, setCartItems] = useState<CartLine[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedButton, setAddedButton] = useState<string | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [subscribeState, setSubscribeState] = useState('');
  const [email, setEmail] = useState('');
  const [whitepaperOpen, setWhitepaperOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const response = await fetch('/api/products', { cache: 'no-store' });
      const payload: unknown = await response.json();
      if (!response.ok || !Array.isArray(payload) || !payload.every(isProductRecord)) {
        throw new Error('Invalid product response');
      }
      setProducts(payload.map(toStoreProduct));
    } catch {
      setProducts([]);
      setProductsError('Products could not be loaded. Please try again.');
    } finally {
      setProductsLoading(false);
    }
  }, []);
  useEffect(() => { void loadProducts(); }, [loadProducts]);

  const heroProduct = products.find((product) => product.id === 'pro');
  const airProduct = products.find((product) => product.id === 'air');
  const itemCount = cartItems.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = useMemo(() => cartItems.reduce((sum, line) => {
    const product = products.find((item) => item.id === line.productId);
    return sum + (product?.price ?? 0) * line.quantity;
  }, 0), [cartItems, products]);

  useEffect(() => {
    if (!isCartOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsCartOpen(false);
      if (event.key === 'Tab') {
        const drawer = document.querySelector('[data-testid="cart-drawer"]');
        const focusable = drawer?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex="-1"])');
        if (!focusable?.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isCartOpen]);

  const formatPrice = (kwd: number) => currency === 'KWD'
    ? `${kwd.toFixed(0)} KWD`
    : `$${Math.round(kwd * usdRate)} USD`;
  const addToCart = (productId: string, buttonId: string) => {
    if (!products.some((product) => product.id === productId)) return;
    const finish = selected[productId] ?? 'Matte Black';
    setCartItems((current) => {
      const existing = current.find((line) => line.productId === productId && line.finish === finish);
      if (existing) return current.map((line) => line === existing ? { ...line, quantity: line.quantity + 1 } : line);
      return [...current, { productId, finish, quantity: 1 }];
    });
    setAddedButton(buttonId);
    window.setTimeout(() => setAddedButton((current) => current === buttonId ? null : current), 1100);
    setPaymentComplete(false);
    setIsCartOpen(true);
  };
  const changeQuantity = (productId: string, finish: Finish, delta: number) => {
    setCartItems((current) => current.flatMap((line) => {
      if (line.productId !== productId || line.finish !== finish) return [line];
      const quantity = line.quantity + delta;
      return quantity > 0 ? [{ ...line, quantity }] : [];
    }));
    setPaymentComplete(false);
  };

  return (
    <div className="klyph-light">
      <header className="lr-header">
        <div className="lr-wrap lr-nav">
          <a href="#top" className="lr-brand" aria-label="KLYPH home" data-testid="link-klyph-home">
            <span className="lr-brand-mark"><Fingerprint size={18} strokeWidth={1.7} /></span>KLYPH
          </a>
          <nav className="lr-links" aria-label="Main navigation">
            <a href="#vault-catalog" data-testid="link-nav-collection">Collection</a>
            <a href="#architecture" data-testid="link-nav-security">Security</a>
            <a href="#comparison" data-testid="link-nav-specs">Specs</a>
            <a href="#ecosystem" data-testid="link-nav-ecosystem">Dispatch</a>
          </nav>
          <div className="lr-nav-actions">
            <div className="lr-currency" aria-label="Currency">
              {(['KWD', 'USD'] as const).map((unit) => <button key={unit} type="button" onClick={() => setCurrency(unit)} aria-pressed={currency === unit} data-testid={`button-currency-${unit.toLowerCase()}`}>{unit}</button>)}
            </div>
            <button type="button" onClick={() => setIsCartOpen(true)} aria-label={`Shopping cart, ${itemCount} items`} className="lr-cart-icon" data-testid="button-open-cart">
              <ShoppingBag size={18} /><span data-testid="text-cart-count">{itemCount}</span>
            </button>
            <button type="button" disabled={!heroProduct} onClick={() => addToCart('pro', 'pre-order')} className="lr-nav-order" data-testid="button-pre-order">
              {addedButton === 'pre-order' ? 'Added' : 'Pre-order'}
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="lr-hero">
          <div className="lr-wrap">
            <div className="lr-eyebrow"><span />Biometric hardware vault · Firmware v2.4</div>
            <div className="lr-hero-copy">
              <h1>Security you<br className="lr-desktop-break" /> can carry.</h1>
              <div className="lr-hero-aside">
                <p>A titanium biometric wallet, built for everyday carry and cold storage.</p>
                <div className="lr-hero-actions">
                  <button type="button" onClick={() => addToCart('pro', 'hero-order')} className="lr-button lr-button-blue" data-testid="button-hero-order">
                    <Fingerprint size={17} />{addedButton === 'hero-order' ? 'Added' : heroProduct ? `${heroProduct.name} · ${formatPrice(heroProduct.price)}` : productsLoading ? 'Loading KLYPH Pro…' : 'KLYPH Pro unavailable'}<ArrowRight size={16} />
                  </button>
                  <a className="lr-text-link" href="#architecture">Explore security <ChevronRight size={15} /></a>
                </div>
              </div>
            </div>
            <figure className="lr-hero-visual">
              {heroProduct ? <img src={heroProduct.image} alt={heroProduct.alt} data-testid="img-hero-product" /> : <div aria-hidden="true" className={`lr-hero-image-placeholder ${productsLoading ? 'lr-skeleton' : ''}`} />}
              {heroProduct && <figcaption><span><i /> {heroProduct.name.toUpperCase()} / GEN 2.4</span><span>SHA-256 verified firmware</span></figcaption>}
            </figure>
            <div className="lr-hero-specs" aria-label="KLYPH Pro specifications">
              <Metric title="Biometric unlock" value="0.18s" detail="Capacitive sensor" />
              <Metric title="Chassis" value="6mm Ti" detail="Grade 5 aerospace titanium" />
              <Metric title="Enclave" value="EAL6+" detail="Common Criteria" />
              <Metric title="Find My" value="Native" detail="Apple Find My integration" />
            </div>
          </div>
        </section>

        <section className="lr-trust" aria-label="Certifications">
          <div className="lr-wrap lr-trust-inner">
            <Trust icon={<ShieldCheck />} label="MIL-STD-810H Certified" />
            <Trust icon={<KeyRound />} label="BIP-39 Compatible" />
            <Trust icon={<Radar />} label="Apple Find My Network" />
            <Trust icon={<LockKeyhole />} label="Zero-Knowledge Biometrics" />
            <Trust icon={<ShieldCheck />} label="Made in Germany" />
          </div>
        </section>

        <section className="lr-section lr-wrap" id="vault-catalog">
          <div className="lr-section-heading">
            <div><div className="lr-kicker">The collection</div><h2>Three forms.<br className="lr-mobile-break" /> One standard.</h2></div>
            <p>Precision security, made for the way you carry.</p>
          </div>
          <div className="lr-products" aria-busy={productsLoading}>
            {productsLoading
              ? Array.from({ length: 3 }, (_, index) => <ProductSkeleton key={index} />)
              : productsError
                ? <div className="lr-products-error" role="alert"><p>{productsError}</p><button type="button" onClick={() => void loadProducts()}>Retry</button></div>
                : products.length
                  ? products.map((product) => <ProductCard
              key={product.id} product={product} selected={selected[product.id] ?? 'Matte Black'}
              currencyPrice={formatPrice(product.price)} added={addedButton === `add-${product.id}`}
              onSelect={(finish) => setSelected((current) => ({ ...current, [product.id]: finish }))}
              onAdd={() => addToCart(product.id, `add-${product.id}`)}
            />)
                  : <p className="lr-products-empty" role="status">No products are currently available.</p>}
          </div>
        </section>

        <section className="lr-security" id="architecture">
          <div className="lr-wrap">
            <div className="lr-section-heading lr-security-heading">
              <div><div className="lr-kicker">Security, by design</div><h2>Built to keep<br />your keys yours.</h2></div>
              <p>No radio bridges without physical authorization. Every layer is isolated by design.</p>
            </div>
            <div className="lr-feature-grid">
              <FeatureCard icon={<Fingerprint />} number="01" title="Hardware-isolated biometrics" text="On-device enclave matches a fingerprint in under 200ms; only non-reversible template hashes are kept." telemetry={<><div className="lr-telemetry-line"><span>SCAN DELTA</span><b>182ms · PASS</b></div><div className="lr-meter"><i /></div><div className="lr-telemetry-foot"><span>ENCLAVE: EAL6+</span><span>ZERO NETWORK EXPORT</span></div></>} />
              <FeatureCard icon={<Shield />} number="02" title="Grade 5 titanium" text="One-piece Ti-6Al-4V resists 2,500kg shear, tampering, and RF snooping." telemetry={<><SpecRow label="TENSILE STRENGTH" value="950 MPa" /><SpecRow label="THERMAL BOUNDARY" value="−40°C to +185°C" /><SpecRow label="INGRESS PROOF" value="IP68 Submersible" /></>} />
              <FeatureCard icon={<Radar />} number="03" title="Apple Find My" text="Encrypted Find My relays with an integrated acoustic alert; no personal ID correlation." telemetry={<><div className="lr-beacon"><i /> BEACON BROADCAST ACTIVE</div><p className="lr-telemetry-note">Rotating ephemeral token · No personal ID correlation</p></>} />
            </div>
          </div>
        </section>

        <section className="lr-wrap lr-compare" id="comparison">
          <div className="lr-compare-top"><div><div className="lr-kicker">At a glance</div><h2>Details matter.</h2></div><p>Five security and durability benchmarks.</p></div>
          <div className="lr-table-scroll">
            <table className="lr-table" data-testid="table-comparison">
              <thead><tr><th>Capability</th><th>KLYPH Pro</th><th>Standard RFID Wallet</th><th>Plastic Hardware Key</th></tr></thead>
              <tbody>{comparisonRows.map(([capability, klyph, standard, hardware]) => <tr key={capability}><th>{capability}</th><td>{klyph}</td><td>{standard}</td><td>{hardware}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="lr-compare-mobile">
            {comparisonRows.map(([capability, klyph, standard, hardware]) => <article key={capability}><h3>{capability}</h3><div><b>KLYPH Pro</b><span>{klyph}</span></div><div><b>Standard RFID Wallet</b><span>{standard}</span></div><div><b>Plastic Hardware Key</b><span>{hardware}</span></div></article>)}
          </div>
        </section>

        <section className="lr-allocation">
          <div className="lr-wrap lr-allocation-inner">
            <div><div className="lr-kicker">Limited allocation · Batch 04</div><h2>Carry what matters.</h2><p>Express armored dispatch. Two-year titanium replacement.</p></div>
            <div className="lr-allocation-actions">
              <button type="button" disabled={!airProduct} onClick={() => addToCart('air', 'claim-allocation')} className="lr-button lr-button-blue" data-testid="button-claim-allocation">{addedButton === 'claim-allocation' ? <><Check size={17} /> Added</> : <><LockKeyhole size={17} /> {airProduct ? `From ${formatPrice(airProduct.price)}` : productsLoading ? 'Loading…' : 'Unavailable'} <ArrowRight size={16} /></>}</button>
              <button type="button" className="lr-button lr-button-outline" onClick={() => setWhitepaperOpen((open) => !open)} data-testid="button-whitepaper"><ArrowDownRight size={17} />{whitepaperOpen ? 'Close whitepaper' : 'Security whitepaper'}</button>
            </div>
            {whitepaperOpen && <div role="status" className="lr-whitepaper" data-testid="status-whitepaper">Whitepaper v2.4 SHA-256 verified. Firmware dispatch details are ready.</div>}
            <div className="lr-perks"><span><ArrowUpRight />24h regional courier</span><span><LockKeyhole />256-bit encrypted checkout</span><span><ShieldCheck />30-day custody guarantee</span></div>
          </div>
        </section>
      </main>

      <footer className="lr-footer" id="ecosystem">
        <div className="lr-wrap">
          <div className="lr-footer-main">
            <div className="lr-footer-brand">
              <a href="#top" className="lr-brand"><span className="lr-brand-mark"><Fingerprint size={18} /></span>KLYPH</a>
              <p>Biometric security for everyday carry.</p>
              <div className="lr-badges">{['CC EAL6+ Certified', 'FIPS 140-3 Vault', 'IP68 Submersible'].map((badge) => <span key={badge}>{badge}</span>)}</div>
            </div>
             <div className="lr-footer-links"><h3>Architecture</h3>{['Biometric enclave', 'Titanium chassis', 'Apple Find My'].map((item) => <a key={item} href="#architecture">{item}</a>)}</div>
            <div className="lr-dispatch">
              <h3>Security dispatch</h3><p>Firmware and dispatch updates.</p>
              <form onSubmit={(event) => { event.preventDefault(); setSubscribeState(email.includes('@') ? 'Dispatch alerts enabled for this demo.' : 'Enter a valid email address.'); }}>
                <label className="lr-sr-only" htmlFor="dispatch-email">Email address</label>
                <input id="dispatch-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" data-testid="input-dispatch-email" />
                <button type="submit" aria-label="Sign up for security dispatch" data-testid="button-dispatch-subscribe"><ArrowRight size={18} /></button>
              </form>
              {subscribeState && <p role="status" className="lr-subscribe-status" data-testid="status-dispatch">{subscribeState}</p>}
              <div className="lr-guarantee"><ShieldCheck size={16} />2-year titanium replacement guarantee</div>
            </div>
          </div>
          <div className="lr-footer-bottom"><p>© 2025 KLYPH Sovereign Technologies LLC. All rights reserved.</p><div><a href="#architecture">Security whitepaper</a><a href="#comparison">Custody legal</a><a href="#top">Privacy policy</a></div></div>
        </div>
      </footer>

      <AnimatePresence>
        {isCartOpen && <motion.div className="lr-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .18 }} data-testid="cart-overlay">
          <button type="button" className="lr-backdrop" aria-label="Close shopping cart" onClick={() => setIsCartOpen(false)} data-testid="button-cart-backdrop" />
          <motion.aside role="dialog" aria-modal="true" aria-labelledby="cart-heading" className="lr-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 280 }} data-testid="cart-drawer">
            <div className="lr-drawer-head"><div><div className="lr-kicker">KLYPH / Checkout</div><h2 id="cart-heading">Your cart <span>({itemCount})</span></h2></div><button ref={closeRef} type="button" aria-label="Close cart" onClick={() => setIsCartOpen(false)} className="lr-close" data-testid="button-close-cart"><X size={20} /></button></div>
            <div className="lr-drawer-body">
              {cartItems.length === 0 ? <div className="lr-empty"><div className="lr-empty-icon"><ShoppingBag size={23} /></div><h3>Your vault is waiting.</h3><p>Choose an instrument from the collection to begin.</p><button type="button" onClick={() => { setIsCartOpen(false); document.getElementById('vault-catalog')?.scrollIntoView({ behavior: 'smooth' }); }} data-testid="button-empty-shop">Explore collection <ArrowRight size={14} /></button></div> : <div className="lr-cart-lines">
                {cartItems.map((line) => {
                  const product = products.find((item) => item.id === line.productId);
                  if (!product) return null;
                  return <div key={`${line.productId}-${line.finish}`} className="lr-cart-line" data-testid={`row-cart-${line.productId}-${line.finish.toLowerCase().replaceAll(' ', '-')}`}>
                    <img src={product.image} alt={product.alt} />
                    <div className="lr-line-info"><div className="lr-line-title"><div><h3>{product.name}</h3><p>{line.finish}</p></div><strong data-testid={`text-line-price-${line.productId}`}>{formatPrice(product.price * line.quantity)}</strong></div>
                      <div className="lr-quantity"><button type="button" aria-label={`Decrease ${product.name} quantity`} onClick={() => changeQuantity(product.id, line.finish, -1)} data-testid={`button-quantity-minus-${product.id}`}><Minus size={14} /></button><span data-testid={`text-quantity-${product.id}`}>{line.quantity}</span><button type="button" aria-label={`Increase ${product.name} quantity`} onClick={() => changeQuantity(product.id, line.finish, 1)} data-testid={`button-quantity-plus-${product.id}`}><Plus size={14} /></button></div>
                    </div>
                  </div>;
                })}
              </div>}
              <div className="lr-encrypted"><LockKeyhole size={15} />Encrypted checkout · Your keys never leave your device</div>
            </div>
            <div className="lr-drawer-foot"><div className="lr-subtotal"><span>Subtotal</span><strong data-testid="text-cart-subtotal">{formatPrice(subtotal)}</strong></div><div className="lr-dispatch-cost"><span>Dispatch & duties</span><span>Calculated at dispatch</span></div>
              {paymentComplete ? <div role="status" className="lr-payment-success" data-testid="status-demo-payment"><span><Check size={18} /></span><div><b>Demo order secured</b><p>No payment was collected. Your vault is reserved locally.</p></div></div> : <button type="button" disabled={cartItems.length === 0} onClick={() => setPaymentComplete(true)} className="lr-pay" data-testid="button-demo-apple-pay"><CreditCard size={18} />Pay with Apple Pay <small>DEMO</small></button>}
              <p className="lr-demo-note">Demo checkout only. No payment SDK, backend, or charge is used.</p>
            </div>
          </motion.aside>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}

function Metric({ title, value, detail }: { title: string; value: string; detail: string }) {
  return <div className="lr-metric"><span>{title}</span><strong>{value}</strong><small>{detail}</small></div>;
}
function Trust({ icon, label }: { icon: ReactNode; label: string }) {
  return <div className="lr-trust-item"><span>{icon}</span>{label}</div>;
}
function ProductCard({ product, selected, currencyPrice, added, onSelect, onAdd }: {
  product: Product; selected: Finish; currencyPrice: string; added: boolean;
  onSelect: (finish: Finish) => void; onAdd: () => void;
}) {
  return <article className="lr-product" data-testid={`card-product-${product.id}`}>
    <div className="lr-product-image">
      <img src={product.image} alt={product.alt} loading="lazy" decoding="async" className={selected === 'Stealth Navy' ? 'finish-navy' : selected === 'Raw Titanium' ? 'finish-titanium' : ''} data-testid={`img-product-${product.id}`} />
      <span className="lr-product-badge">{product.badge}</span><span className="lr-product-stock">{product.stock}</span>
    </div>
    <div className="lr-product-content">
      <div className="lr-product-title"><h3>{product.name}</h3><strong data-testid={`text-price-${product.id}`}>{currencyPrice}</strong></div>
      <p>{product.description}</p>
      <div className="lr-product-specs">{product.specs.map((spec) => <span key={spec}>{spec}</span>)}</div>
      <div className="lr-finish-row"><div><span>Finish</span><b data-testid={`text-finish-${product.id}`}>{selected}</b></div><div className="lr-swatches">{finishes.map((finish) => <button key={finish.name} type="button" title={finish.name} aria-label={`${product.name} finish: ${finish.name}`} aria-pressed={selected === finish.name} onClick={() => onSelect(finish.name)} style={{ backgroundColor: finish.color }} data-testid={`button-finish-${product.id}-${finish.name.toLowerCase().replaceAll(' ', '-')}`} />)}</div></div>
      <button type="button" onClick={onAdd} className={`lr-add ${product.tone === 'gold' ? 'lr-add-primary' : ''}`} data-testid={`button-add-${product.id}`}>{added ? <Check size={16} /> : <ShoppingBag size={16} />}{added ? 'Added' : `Add to cart · ${currencyPrice}`}</button>
    </div>
  </article>;
}
function ProductSkeleton() {
  return <article className="lr-product lr-product-skeleton" aria-hidden="true">
    <div className="lr-product-image"><div className="lr-skeleton lr-product-skeleton-image" /></div>
    <div className="lr-product-content">
      <div className="lr-skeleton lr-skeleton-title" />
      <div className="lr-skeleton lr-skeleton-copy" />
      <div className="lr-skeleton lr-skeleton-copy lr-skeleton-copy-short" />
      <div className="lr-skeleton lr-skeleton-specs" />
      <div className="lr-skeleton lr-skeleton-finish" />
      <div className="lr-skeleton lr-skeleton-button" />
    </div>
  </article>;
}
function FeatureCard({ icon, number, title, text, telemetry }: { icon: ReactNode; number: string; title: string; text: string; telemetry: ReactNode }) {
  return <article className="lr-feature"><div className="lr-feature-top"><span className="lr-feature-icon">{icon}</span><span className="lr-feature-number">{number}</span></div><h3>{title}</h3><p>{text}</p><div className="lr-telemetry">{telemetry}</div></article>;
}
function SpecRow({ label, value }: { label: string; value: string }) {
  return <div className="lr-spec-row"><span>{label}</span><b>{value}</b></div>;
}

export default App;
