import './_group.css';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Check, ChevronRight, CreditCard,
  Fingerprint, KeyRound, LockKeyhole, Minus, Plus, Radar, Shield,
  ShieldCheck, ShoppingBag, X,
} from 'lucide-react';

type Currency = 'KWD' | 'USD';
type Finish = 'Matte Black' | 'Stealth Navy' | 'Raw Titanium';
type Product = {
  id: string; name: string; price: number; description: string; specs: string[];
  image: string; alt: string; badge: string; stock: string; tone: 'gold' | 'quiet';
};
type CartLine = { productId: string; finish: Finish; quantity: number };

const products: Product[] = [
  {
    id: 'pro', name: 'KLYPH Pro', price: 29,
    description: 'Monolithic biometric fingerprint cardholder with native Apple Find My integration and cold multi-sig support. Holds up to 8 cards with instant ejection.',
    specs: ['Biometric Sensor', 'Apple Find My', '8 Cards Capacity', 'Titanium Grade 5'],
    image: '/__mockup/images/klyph-pro.webp', alt: 'KLYPH Pro monolithic titanium biometric vault',
    badge: 'FLAGSHIP', stock: 'In Stock · Ships in 24h', tone: 'gold',
  },
  {
    id: 'air', name: 'KLYPH Air', price: 16,
    description: 'Surgically woven 3K carbon fiber sleeve with magnetic MagSafe array and dual-layer RFID/NFC shielding. Featherlight sovereign carry.',
    specs: ['Carbon Fiber 3K', 'RFID / NFC Shield', 'MagSafe Compatible', '4.2mm Profile'],
    image: '/__mockup/images/klyph-air.webp', alt: 'KLYPH Air ultra-slim carbon fiber wallet',
    badge: 'ULTRA-SLIM', stock: '4.2mm Profile Thickness', tone: 'quiet',
  },
  {
    id: 'vault', name: 'KLYPH Vault', price: 22,
    description: 'Indestructible dual-plate cold seed phrase vault. Crafted from 316L medical stainless steel with tamper-evident anti-shear locks.',
    specs: ['Aerospace 316L Steel', '1400°C Fireproof', 'Tamper-Evident', '24-Word Grid'],
    image: '/__mockup/images/klyph-vault.webp', alt: 'KLYPH Vault steel seed recovery plate',
    badge: 'MAXIMUM SECURITY', stock: '1400°C Blast Proof', tone: 'quiet',
  },
];
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

export function Current() {
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

  const itemCount = cartItems.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = useMemo(
    () => cartItems.reduce((sum, line) => {
      const product = products.find((item) => item.id === line.productId);
      return sum + (product?.price ?? 0) * line.quantity;
    }, 0),
    [cartItems],
  );

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
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
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
    <div className="grain min-h-screen overflow-x-hidden bg-[#0b0f19] text-[#dfe2f1]">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[#313540]/80 bg-[#0b0f19]/90 backdrop-blur-xl">
        <div className="page-wrap flex h-[68px] items-center justify-between gap-4">
          <a href="#top" aria-label="KLYPH home" className="flex items-center gap-2.5 font-display text-[18px] font-semibold tracking-[.15em]" data-testid="link-klyph-home">
            <span className="grid h-7 w-7 place-items-center rounded-[6px] border border-[#eab308]/60 text-[#facc15]"><Fingerprint size={17} strokeWidth={1.6} /></span>
            KLYPH
          </a>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            <a href="#vault-catalog" className="font-display text-[11px] font-semibold uppercase tracking-[.12em] text-[#facc15]" data-testid="link-nav-collection">Vault Collection</a>
            <a href="#architecture" className="font-display text-[11px] font-semibold uppercase tracking-[.12em] text-[#a4a9b7] transition-colors hover:text-white" data-testid="link-nav-security">Security Tech</a>
            <a href="#comparison" className="font-display text-[11px] font-semibold uppercase tracking-[.12em] text-[#a4a9b7] transition-colors hover:text-white" data-testid="link-nav-specs">Specs</a>
            <a href="#ecosystem" className="font-display text-[11px] font-semibold uppercase tracking-[.12em] text-[#a4a9b7] transition-colors hover:text-white" data-testid="link-nav-ecosystem">Ecosystem</a>
          </nav>
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="flex rounded-full border border-[#313540] bg-[#171b26] p-[3px]" aria-label="Currency">
              {(['KWD', 'USD'] as const).map((unit) => (
                <button key={unit} type="button" onClick={() => setCurrency(unit)} aria-pressed={currency === unit}
                  className={`rounded-full px-2.5 py-1 font-display text-[10px] font-bold tracking-wider transition-colors ${currency === unit ? 'bg-[#eab308] text-[#0b0f19]' : 'text-[#a4a9b7] hover:text-white'}`}
                  data-testid={`button-currency-${unit.toLowerCase()}`}>{unit}</button>
              ))}
            </div>
            <button type="button" onClick={() => setIsCartOpen(true)} aria-label={`Shopping cart, ${itemCount} items`} className="relative grid h-9 w-9 place-items-center rounded-lg border border-[#313540] bg-[#171b26] transition-colors hover:border-[#eab308]/60" data-testid="button-open-cart">
              <ShoppingBag size={17} />
              <span className="absolute -right-1.5 -top-1.5 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-[#eab308] px-1 font-display text-[9px] font-bold text-[#0b0f19]" data-testid="text-cart-count">{itemCount}</span>
            </button>
            <button type="button" onClick={() => addToCart('pro', 'pre-order')} className={`primary-hover hidden rounded-lg border border-[#eab308]/50 bg-[#171b26] px-3.5 py-2 font-display text-[10px] font-semibold uppercase tracking-wider text-[#facc15] sm:inline-flex ${addedButton === 'pre-order' ? 'added-pulse' : ''}`} data-testid="button-pre-order">{addedButton === 'pre-order' ? 'Added ✓' : 'Pre-Order'}</button>
          </div>
        </div>
      </header>

      <main id="top" className="pt-[68px]">
        <section className="relative overflow-hidden pb-8 pt-7 sm:pb-10 sm:pt-10">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(234,179,8,.09),transparent_68%)]" />
          <div className="page-wrap relative flex flex-col items-center">
            <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-[#313540] bg-[#171b26]/85 px-3.5 py-2 text-center font-display text-[9px] font-semibold uppercase tracking-[.12em] text-[#facc15] sm:mb-6 sm:text-[10px]">
              <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-[#eab308]" />
              <span>Introducing Mil-Spec Biometric Hardware Vault — Next-Gen Firmware v2.4</span>
              <ChevronRight size={13} className="hidden shrink-0 text-[#94a3b8] sm:block" />
            </div>
            <div className="max-w-4xl text-center">
              <h1 className="hero-title font-display text-[37px] font-semibold leading-[1.08] tracking-[-.045em] sm:text-[54px] lg:text-[58px]">The Last Wallet You’ll Ever Carry</h1>
              <p className="mx-auto mt-4 max-w-[680px] text-[14px] leading-6 text-[#a4a9b7] sm:mt-5 sm:text-[16px] sm:leading-7">
                Engineered from a monolithic block of 6mm aerospace titanium with sub-second capacitive biometric authentication and native Apple Find My integration. Zero compromise cold storage and everyday carry.
              </p>
            </div>
            <div className="z-10 mt-6 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-7 sm:w-auto sm:flex-row">
              <button type="button" onClick={() => addToCart('pro', 'hero-order')} className={`primary-hover gold-glow flex items-center justify-center gap-2 rounded-lg bg-[#eab308] px-6 py-3.5 font-display text-[11px] font-bold uppercase tracking-[.1em] text-[#211900] ${addedButton === 'hero-order' ? 'added-pulse' : ''}`} data-testid="button-hero-order">
                <Fingerprint size={18} fill="currentColor" /> <span>{addedButton === 'hero-order' ? 'Added ✓' : `Order KLYPH Pro — ${formatPrice(29)}`}</span>{addedButton === 'hero-order' ? <Check size={16} /> : <ArrowRight size={16} />}
              </button>
              <a href="#architecture" className="flex items-center justify-center gap-2 rounded-lg border border-[#313540] bg-[#171b26]/70 px-5 py-3.5 font-display text-[11px] font-semibold uppercase tracking-[.09em] text-[#e2e4eb] transition-all hover:border-[#94a3b8] hover:bg-[#1c1f2a]" data-testid="link-hero-specs">
                <Shield size={17} className="text-[#eab308]" /> View Security Specs
              </a>
            </div>

            <div className="relative mt-9 flex w-full max-w-[1100px] items-center justify-center gap-3 sm:mt-11">
              <div className="pointer-events-none absolute inset-x-[12%] top-1/2 h-48 -translate-y-1/2 rounded-full bg-[#eab308]/10 blur-[80px]" />
              <div className="hidden shrink-0 flex-col gap-3 pt-[70px] xl:flex">
                <Metric title="Speed Index" value="0.18s" detail="Capacitive Biometric Unlock" />
                <Metric title="Chassis Alloy" value="6mm Ti" detail="Aerospace Grade 5 Monolith" />
              </div>
              <div className="relative w-full max-w-[660px] flex-1 rounded-xl border border-[#313540] bg-gradient-to-b from-[#313540]/70 via-[#171b26] to-[#090d15] p-1.5 shadow-[0_24px_65px_-20px_rgba(0,0,0,.8)]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-[#080c14] sm:aspect-[16/9]">
                  <img src="/images/klyph-pro.webp" alt="KLYPH Pro titanium biometric wallet, precision machined in black titanium" className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.025]" data-testid="img-hero-product" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080c14]/90 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-wrap items-center justify-between gap-2 rounded-md border border-[#313540]/70 bg-[#0b0f19]/80 px-3 py-2 font-display text-[9px] uppercase tracking-[.12em] text-[#a4a9b7] backdrop-blur sm:bottom-3.5 sm:left-4 sm:right-4 sm:px-3.5 sm:text-[10px]">
                    <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#eab308]" /> Secure Harvesting Active</span>
                    <span className="text-[#facc15]">FW v2.4 SHA-256 Verified</span>
                  </div>
                </div>
              </div>
              <div className="hidden shrink-0 flex-col gap-3 pt-[70px] xl:flex">
                <Metric title="Enclave Standard" value="CC EAL6+" detail="Dual-Isolated HSM Core" />
                <Metric title="RF Attenuation" value="100%" detail="Faraday RFID/NFC Blinded" />
              </div>
            </div>
            <div className="mt-4 grid w-full grid-cols-2 gap-2 xl:hidden sm:grid-cols-4">
              {[['Unlock', '0.18s'], ['Body', '6mm Ti'], ['Enclave', 'EAL6+'], ['Shielding', '100%']].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-[#313540] bg-[#171b26] px-2 py-2.5 text-center">
                  <div className="font-display text-[9px] uppercase tracking-widest text-[#eab308]">{label}</div><div className="mt-1 font-display text-[16px] font-semibold">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#313540] bg-[#090d15]/85 py-4" aria-label="Certifications">
          <div className="page-wrap flex flex-wrap items-center justify-between gap-x-5 gap-y-3 text-[9px] font-semibold uppercase tracking-[.09em] text-[#a4a9b7] sm:text-[10px]">
            <Trust icon={<ShieldCheck size={16} />} label="MIL-STD-810H Certified" />
            <span className="hidden h-3 w-px bg-[#313540] md:block" />
            <Trust icon={<KeyRound size={16} />} label="BIP-39 Compatible" />
            <span className="hidden h-3 w-px bg-[#313540] md:block" />
            <Trust icon={<Radar size={16} />} label="Apple Find My Network" />
            <span className="hidden h-3 w-px bg-[#313540] md:block" />
            <Trust icon={<LockKeyhole size={16} />} label="Zero-Knowledge Biometrics" />
            <span className="hidden h-3 w-px bg-[#313540] md:block" />
            <Trust icon={<ShieldCheck size={16} />} label="Made in Germany" />
          </div>
        </section>

        <section className="page-wrap py-11 sm:py-14" id="vault-catalog">
          <div className="mb-6 flex flex-col justify-between gap-3 md:mb-7 md:flex-row md:items-end">
            <div><div className="section-kicker mb-2">Vault Collection</div><h2 className="font-display text-[25px] font-semibold leading-tight tracking-[-.03em] sm:text-[31px]">Precision-Engineered Physical Security Instruments</h2></div>
            <p className="max-w-xs text-[12px] leading-5 text-[#a4a9b7]">Crafted for sovereign capital preservation and seamless daily execution.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} selected={selected[product.id] ?? 'Matte Black'} currencyPrice={formatPrice(product.price)} added={addedButton === `add-${product.id}`} onSelect={(finish) => setSelected((current) => ({ ...current, [product.id]: finish }))} onAdd={() => addToCart(product.id, `add-${product.id}`)} />
            ))}
          </div>
        </section>

        <section className="border-y border-[#313540] bg-[#090d15]/65 py-11 sm:py-14" id="architecture">
          <div className="page-wrap">
            <div className="mb-7 max-w-3xl sm:mb-8">
              <div className="section-kicker mb-2">Cryptographic Subsystem</div>
              <h2 className="font-display text-[27px] font-bold leading-tight tracking-[-.03em] sm:text-[32px]">Engineered to Withstand Nation-State Extraction</h2>
              <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[#a4a9b7]">Every layer of the KLYPH architecture is mathematically and mechanically isolated. No radio bridges without physical authorization.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <FeatureCard icon={<Fingerprint size={25} fill="currentColor" />} title="Hardware-Isolated Biometrics" text="Private secure enclave matches minutiae patterns in under 200 milliseconds. Sensor arrays store zero bitmap imagery: templates exist purely as non-reversible cryptographic hashes." telemetry={<><div className="mb-2 flex justify-between text-[11px]"><span>SCAN DELTA</span><span className="text-[#facc15]">182ms [PASS]</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[#313540]"><div className="h-full w-[94%] rounded-full bg-[#eab308]" /></div><div className="mt-2 flex justify-between text-[10px] text-[#778091]"><span>ENCLAVE: EAL6+</span><span>ZERO NETWORK EXPORT</span></div></>} />
              <FeatureCard icon={<Shield size={25} />} title="Titanium Monolith Chassis" text="CNC-milled from a single block of Grade 5 (Ti-6Al-4V) aerospace titanium. Resistant to physical tampering, shear pressure over 2,500 kg, and electromagnetic frequency snooping." telemetry={<><SpecRow label="TENSILE STRENGTH" value="950 MPa" /><SpecRow label="THERMAL BOUNDARY" value="−40°C to +185°C" /><SpecRow label="INGRESS PROOF" value="IP68 Submersible" gold /></>} />
              <FeatureCard icon={<Radar size={25} />} title="Global Apple Find My" text="Never misplace your sovereign reserve. Leverages hundreds of millions of Apple devices worldwide with end-to-end encrypted relaying. Acoustic alert speaker embedded within the titanium cavity." telemetry={<><div className="mb-2 flex items-center gap-2 text-[11px] text-[#facc15]"><span className="h-2 w-2 animate-pulse rounded-full bg-[#eab308]" />BEACON BROADCAST ACTIVE</div><div className="text-[10px] leading-relaxed text-[#a4a9b7]">Apple Network Key · Rotating Ephemeral Token · 100% Zero Personal ID Correlation</div></>} />
            </div>
          </div>
        </section>

        <section className="page-wrap py-11 sm:py-14" id="comparison">
          <div className="rounded-2xl border border-[#313540] bg-[#171b26] p-4 sm:rounded-3xl sm:p-7 lg:p-9">
            <div className="mb-5 flex flex-col justify-between gap-3 lg:mb-6 lg:flex-row lg:items-end">
              <div><div className="section-kicker mb-2">Comparative Metrics</div><h2 className="font-display text-[24px] font-bold leading-tight tracking-[-.025em] sm:text-[30px]">Standard Wallets vs. KLYPH Architecture</h2></div>
              <p className="text-[12px] text-[#a4a9b7]">Audited benchmark across mechanical and cryptographic parameters.</p>
            </div>
            <div className="grid gap-3 lg:hidden" aria-label="Comparison metrics">
              {comparisonRows.map(([capability, klyph, standard, hardware]) => (
                <article key={capability} className="rounded-lg border border-[#313540] bg-[#0b0f19]/60 p-3.5">
                  <h3 className="font-display text-[12px] font-semibold text-[#e2e4eb]">{capability}</h3>
                  <dl className="mt-3 grid gap-2">
                    <div className="rounded-md border border-[#313540]/70 bg-[#171b26] px-3 py-2">
                      <dt className="font-display text-[9px] font-semibold uppercase tracking-wider text-[#facc15]">KLYPH Pro Vault</dt>
                      <dd className="mt-1 text-[11px] leading-4 text-[#e2e4eb]">{klyph}</dd>
                    </div>
                    <div className="rounded-md border border-[#313540]/70 bg-[#171b26] px-3 py-2">
                      <dt className="font-display text-[9px] font-semibold uppercase tracking-wider text-[#a4a9b7]">Standard RFID Wallet</dt>
                      <dd className="mt-1 text-[11px] leading-4 text-[#e2e4eb]">{standard}</dd>
                    </div>
                    <div className="rounded-md border border-[#313540]/70 bg-[#171b26] px-3 py-2">
                      <dt className="font-display text-[9px] font-semibold uppercase tracking-wider text-[#a4a9b7]">Plastic Hardware Key</dt>
                      <dd className="mt-1 text-[11px] leading-4 text-[#e2e4eb]">{hardware}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
            <div className="hidden overflow-x-auto lg:block">
              <table className="table-min w-full border-collapse text-left" data-testid="table-comparison">
                <thead><tr className="border-b border-[#313540] font-display text-[10px] uppercase tracking-wider text-[#a4a9b7]"><th className="px-3 py-3">Vector / Capability</th><th className="px-3 py-3 text-[#facc15]">KLYPH Pro Vault</th><th className="px-3 py-3">Standard RFID Wallet</th><th className="px-3 py-3">Plastic Hardware Key</th></tr></thead>
                <tbody className="divide-y divide-[#313540]/70 text-[12px]">
                  {comparisonRows.map(([capability, klyph, standard, hardware]) => (
                    <tr key={capability}><td className="px-3 py-3.5 font-semibold text-[#e2e4eb]">{capability}</td><td className="px-3 py-3.5 font-display font-semibold text-[#facc15]">{klyph}</td><td className="px-3 py-3.5 text-[#a4a9b7]">{standard}</td><td className="px-3 py-3.5 text-[#a4a9b7]">{hardware}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="border-y border-[#313540] bg-gradient-to-b from-[#0b0f19] to-[#090d15] py-11 text-center sm:py-14">
          <div className="page-wrap max-w-4xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#313540] bg-[#171b26] px-3 py-1.5 font-display text-[10px] font-semibold uppercase tracking-widest text-[#facc15]"><span className="h-1.5 w-1.5 rounded-full bg-[#eab308]" />Limited Allocation · Batch 04</div>
            <h2 className="font-display text-[27px] font-bold leading-tight tracking-[-.03em] sm:text-[32px]">Secure Your Sovereign Hardware Vault Today</h2>
            <p className="mx-auto mb-6 mt-3 max-w-xl text-[14px] leading-6 text-[#a4a9b7]">Worldwide expedited dispatch via armored courier. Comprehensive 2-year titanium replacement guarantee included.</p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <button type="button" onClick={() => addToCart('air', 'claim-allocation')} className={`primary-hover gold-glow inline-flex items-center justify-center gap-2 rounded-lg bg-[#eab308] px-6 py-3.5 font-display text-[11px] font-bold uppercase tracking-[.1em] text-[#211900] ${addedButton === 'claim-allocation' ? 'added-pulse' : ''}`} data-testid="button-claim-allocation">{addedButton === 'claim-allocation' ? <><Check size={17} />Added ✓</> : <><LockKeyhole size={17} />Claim Allocation — From {formatPrice(16)}</>}</button>
              <button type="button" onClick={() => setWhitepaperOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#313540] bg-[#171b26] px-5 py-3.5 font-display text-[11px] font-semibold uppercase tracking-wider transition-colors hover:border-[#94a3b8]" data-testid="button-whitepaper"><ArrowDownRight size={17} />Download Security Whitepaper</button>
            </div>
            {whitepaperOpen && <div role="status" className="mx-auto mt-4 max-w-md rounded-lg border border-[#eab308]/30 bg-[#eab308]/10 p-3 text-[12px] text-[#f5d56c]" data-testid="status-whitepaper">Whitepaper v2.4 SHA-256 verified. Firmware dispatch details are ready.</div>}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-[#a4a9b7]"><span className="inline-flex items-center gap-1.5"><ArrowUpRight size={14} className="text-[#eab308]" />24h Regional Courier</span><span className="inline-flex items-center gap-1.5"><LockKeyhole size={14} className="text-[#eab308]" />256-bit Encrypted Checkout</span><span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#eab308]" />30-Day Custody Guarantee</span></div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#313540] bg-[#090d15]" id="ecosystem">
        <div className="page-wrap py-9 sm:py-11">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
            <div className="flex flex-col gap-4 lg:col-span-5">
              <div className="flex items-center gap-2.5 font-display text-[16px] font-semibold tracking-[.15em]"><span className="grid h-7 w-7 place-items-center rounded border border-[#eab308]/60 text-[#facc15]"><Fingerprint size={16} /></span>KLYPH</div>
              <p className="max-w-sm text-[12px] leading-5 text-[#a4a9b7]">Aerospace-grade cryptographic architecture. Biometric multi-signature cold storage crafted for sovereign asset custody.</p>
              <div className="flex flex-wrap gap-2">{['CC EAL6+ Certified', 'FIPS 140-3 Vault', 'IP68 Submersible'].map((badge) => <span key={badge} className="rounded-full border border-[#313540] bg-[#171b26] px-2.5 py-1 font-display text-[9px] uppercase tracking-wider text-[#a4a9b7]"><i className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#eab308]" />{badge}</span>)}</div>
            </div>
            <div className="flex flex-col gap-3 lg:col-span-3">
              <h3 className="font-display text-[10px] font-bold uppercase tracking-[.15em] text-[#facc15]">Vault Architecture</h3>
              {['Cold Key Genesis', 'Biometric Capacitive Array', 'Dual Secure Enclave', 'Air-Gapped Optical QR', 'Lifetime Custody Guarantee'].map((item) => <a key={item} href="#architecture" className="text-[12px] text-[#a4a9b7] transition-colors hover:text-white">{item}</a>)}
            </div>
            <div className="flex flex-col gap-3 lg:col-span-4">
              <h3 className="font-display text-[10px] font-bold uppercase tracking-[.15em] text-[#facc15]">Security Dispatch</h3>
              <p className="text-[12px] leading-5 text-[#a4a9b7]">Receive audited cryptographic firmware logs and priority allocation alerts.</p>
              <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); setSubscribeState(email.includes('@') ? 'Dispatch alerts enabled for this demo.' : 'Enter a valid email address.'); }}>
                <label className="sr-only" htmlFor="dispatch-email">Email address</label>
                <input id="dispatch-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="custodian@domain.io" className="min-w-0 flex-1 rounded-lg border border-[#313540] bg-[#171b26] px-3 py-2.5 font-display text-[12px] text-[#e2e4eb] placeholder:text-[#778091]" data-testid="input-dispatch-email" />
                <button type="submit" aria-label="Sign up for security dispatch" className="grid w-11 shrink-0 place-items-center rounded-lg bg-[#eab308] text-[#0b0f19] transition-colors hover:bg-[#facc15]" data-testid="button-dispatch-subscribe"><ArrowRight size={17} /></button>
              </form>
              {subscribeState && <p role="status" className="text-[11px] text-[#facc15]" data-testid="status-dispatch">{subscribeState}</p>}
              <div className="flex items-center gap-2 text-[11px] text-[#a4a9b7]"><ShieldCheck size={15} className="text-[#eab308]" />2-Year Comprehensive Titanium Replacement Guarantee</div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-3 border-t border-[#313540] pt-5 text-center sm:flex-row sm:text-left">
            <p className="text-[10px] text-[#a4a9b7]">© 2025 KLYPH Sovereign Technologies LLC. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-5 font-display text-[9px] uppercase tracking-wider text-[#a4a9b7]"><a href="#architecture" className="hover:text-white">Security Whitepaper</a><a href="#comparison" className="hover:text-white">Custody Legal</a><a href="#top" className="hover:text-white">Privacy Policy</a></div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {isCartOpen && (
          <motion.div className="fixed inset-0 z-[60] flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }} data-testid="cart-overlay">
            <button type="button" className="absolute inset-0 cursor-default bg-[#03050a]/75 backdrop-blur-[3px]" aria-label="Close shopping cart" onClick={() => setIsCartOpen(false)} data-testid="button-cart-backdrop" />
            <motion.aside role="dialog" aria-modal="true" aria-labelledby="cart-heading" className="relative flex h-full w-full max-w-[440px] flex-col border-l border-[#313540] bg-[#111620] shadow-2xl"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 280 }} data-testid="cart-drawer">
              <div className="flex items-center justify-between border-b border-[#313540] px-5 py-5 sm:px-6">
                <div><div className="font-display text-[10px] uppercase tracking-[.17em] text-[#eab308]">KLYPH / Checkout</div><h2 id="cart-heading" className="mt-1 font-display text-[23px] font-semibold">Your Cart <span className="text-[#778091]">({itemCount})</span></h2></div>
                <button ref={closeRef} type="button" aria-label="Close cart" onClick={() => setIsCartOpen(false)} className="grid h-10 w-10 place-items-center rounded-lg border border-[#313540] text-[#a4a9b7] transition-colors hover:border-[#eab308]/50 hover:text-white" data-testid="button-close-cart"><X size={19} /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                {cartItems.length === 0 ? (
                  <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                    <div className="mb-4 grid h-14 w-14 place-items-center rounded-full border border-[#313540] bg-[#171b26] text-[#eab308]"><ShoppingBag size={22} /></div>
                    <h3 className="font-display text-[17px] font-semibold">Your vault is waiting.</h3><p className="mt-2 max-w-[250px] text-[12px] leading-5 text-[#a4a9b7]">Choose a precision-built instrument from the collection to begin.</p>
                    <button type="button" onClick={() => { setIsCartOpen(false); document.getElementById('vault-catalog')?.scrollIntoView({ behavior: 'smooth' }); }} className="mt-5 font-display text-[10px] font-bold uppercase tracking-wider text-[#facc15]" data-testid="button-empty-shop">Explore Collection <ArrowRight size={13} className="ml-1 inline" /></button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((line) => {
                      const product = products.find((item) => item.id === line.productId)!;
                      return <div key={`${line.productId}-${line.finish}`} className="flex gap-4 border-b border-[#313540] pb-4" data-testid={`row-cart-${line.productId}-${line.finish.toLowerCase().replaceAll(' ', '-')}`}>
                        <div className="h-[90px] w-[94px] shrink-0 overflow-hidden rounded-lg border border-[#313540] bg-[#090d15]"><img src={product.image} alt={product.alt} className="h-full w-full object-cover" /></div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2"><div><h3 className="font-display text-[14px] font-semibold">{product.name}</h3><p className="mt-1 text-[11px] text-[#a4a9b7]">{line.finish}</p></div><strong className="whitespace-nowrap font-display text-[13px] text-[#facc15]" data-testid={`text-line-price-${line.productId}`}>{formatPrice(product.price * line.quantity)}</strong></div>
                          <div className="mt-3 inline-flex items-center gap-3 rounded-md border border-[#313540] bg-[#0b0f19] p-1">
                            <button type="button" aria-label={`Decrease ${product.name} quantity`} onClick={() => changeQuantity(product.id, line.finish, -1)} className="grid h-7 w-7 place-items-center rounded text-[#a4a9b7] hover:bg-[#1c1f2a] hover:text-white" data-testid={`button-quantity-minus-${product.id}`}><Minus size={13} /></button>
                            <span className="min-w-4 text-center font-display text-[12px]" data-testid={`text-quantity-${product.id}`}>{line.quantity}</span>
                            <button type="button" aria-label={`Increase ${product.name} quantity`} onClick={() => changeQuantity(product.id, line.finish, 1)} className="grid h-7 w-7 place-items-center rounded text-[#a4a9b7] hover:bg-[#1c1f2a] hover:text-white" data-testid={`button-quantity-plus-${product.id}`}><Plus size={13} /></button>
                          </div>
                        </div>
                      </div>;
                    })}
                  </div>
                )}
                <div className="mt-5 flex items-center gap-2 rounded-lg border border-[#313540]/80 bg-[#0b0f19]/70 px-3 py-3 text-[10px] text-[#a4a9b7]"><LockKeyhole size={14} className="shrink-0 text-[#eab308]" />Encrypted checkout · Your keys never leave your device</div>
              </div>
              <div className="border-t border-[#313540] bg-[#0d111a] px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                <div className="mb-1 flex justify-between text-[12px] text-[#a4a9b7]"><span>Subtotal</span><span data-testid="text-cart-subtotal">{formatPrice(subtotal)}</span></div>
                <div className="mb-4 flex justify-between text-[11px] text-[#778091]"><span>Dispatch & duties</span><span>Calculated at dispatch</span></div>
                {paymentComplete ? (
                  <div role="status" className="rounded-lg border border-[#eab308]/50 bg-[#eab308]/10 p-4 text-center" data-testid="status-demo-payment"><div className="mx-auto mb-2 grid h-8 w-8 place-items-center rounded-full bg-[#eab308] text-[#0b0f19]"><Check size={18} /></div><div className="font-display text-[13px] font-semibold text-[#facc15]">Demo order secured</div><p className="mt-1 text-[11px] text-[#a4a9b7]">No payment was collected. Your vault is reserved locally.</p></div>
                ) : (
                  <button type="button" disabled={cartItems.length === 0} onClick={() => setPaymentComplete(true)} className="primary-hover flex w-full items-center justify-center gap-2 rounded-lg bg-[#eab308] py-3.5 font-display text-[12px] font-bold tracking-wide text-[#171300] transition-opacity disabled:cursor-not-allowed disabled:opacity-40" data-testid="button-demo-apple-pay"><CreditCard size={17} />Pay with Apple Pay <span className="text-[10px] font-medium opacity-75">DEMO</span></button>
                )}
                <p className="mt-3 text-center text-[9px] leading-4 text-[#778091]">Demo checkout only. No payment SDK, backend, or charge is used.</p>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Metric({ title, value, detail }: { title: string; value: string; detail: string }) {
  return <div className="w-[178px] rounded-lg border border-[#313540] bg-[#111620]/90 p-3.5 shadow-xl backdrop-blur-md">
    <div className="flex items-center gap-2 font-display text-[9px] uppercase tracking-[.13em] text-[#facc15]"><span className="h-1.5 w-1.5 rounded-full bg-[#eab308]" />{title}</div>
    <div className="mt-1 font-display text-[20px] font-semibold">{value}</div><div className="mt-0.5 text-[10px] text-[#a4a9b7]">{detail}</div>
  </div>;
}

function Trust({ icon, label }: { icon: ReactNode; label: string }) {
  return <div className="flex items-center gap-2"><span className="text-[#eab308]">{icon}</span><span>{label}</span></div>;
}

function ProductCard({ product, selected, currencyPrice, added, onSelect, onAdd }: {
  product: Product; selected: Finish; currencyPrice: string; added: boolean;
  onSelect: (finish: Finish) => void; onAdd: () => void;
}) {
  return <article className="card-hover group flex flex-col overflow-hidden rounded-xl border border-[#313540] bg-[#171b26] shadow-xl" data-testid={`card-product-${product.id}`}>
    <div className="relative aspect-[4/3] overflow-hidden bg-[#090d15]">
      <img src={product.image} alt={product.alt} className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.045] ${selected === 'Stealth Navy' ? 'saturate-[.8] hue-rotate-[8deg]' : selected === 'Raw Titanium' ? 'brightness-110 saturate-[.78]' : ''}`} data-testid={`img-product-${product.id}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080c14]/45 via-transparent to-transparent" />
      <div className="absolute left-3.5 top-3.5 flex items-center gap-1.5">
        <span className={`rounded-full px-2.5 py-1 font-display text-[9px] font-bold uppercase tracking-wider ${product.tone === 'gold' ? 'bg-[#eab308] text-[#211900]' : 'border border-[#525969] bg-[#171b26]/90 text-[#e2e4eb]'}`}>{product.badge}</span>
        {product.id === 'pro' && <span className="rounded-full border border-[#525969] bg-[#111620]/85 px-2.5 py-1 font-display text-[9px] uppercase tracking-wider">GEN 2.4</span>}
      </div>
      <div className="absolute bottom-3 left-3.5 rounded-full border border-[#313540] bg-[#090d15]/80 px-2.5 py-1 font-display text-[10px] text-[#e2e4eb] backdrop-blur">
        {product.id === 'pro' && <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#eab308]" />}{product.stock}
      </div>
    </div>
    <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
      <div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-display text-[20px] font-semibold transition-colors group-hover:text-[#facc15]">{product.name}</h3>
          <div className="whitespace-nowrap font-display text-[19px] font-bold text-[#facc15]" data-testid={`text-price-${product.id}`}>{currencyPrice}</div>
        </div>
        <p className="mb-4 text-[12px] leading-[1.65] text-[#a4a9b7]">{product.description}</p>
        <div className="mb-4 flex flex-wrap gap-1.5">{product.specs.map((spec) => <span key={spec} className="rounded border border-[#313540] bg-[#20242f] px-2 py-1 font-display text-[9px] uppercase tracking-[.04em] text-[#a4a9b7]">{spec}</span>)}</div>
        <div className="mb-4 flex items-center justify-between border-t border-[#313540] pt-3">
          <div><span className="font-display text-[9px] uppercase tracking-wider text-[#a4a9b7]">Finish:</span><span className="ml-2 font-display text-[10px] font-semibold text-[#e2e4eb]" data-testid={`text-finish-${product.id}`}>{selected}</span></div>
          <div className="flex items-center gap-2">
            {finishes.map((finish) => <button key={finish.name} type="button" title={finish.name} aria-label={`${product.name} finish: ${finish.name}`} aria-pressed={selected === finish.name} onClick={() => onSelect(finish.name)} className={`h-[21px] w-[21px] rounded-full transition-all hover:scale-110 ${selected === finish.name ? 'ring-2 ring-[#eab308] ring-offset-2 ring-offset-[#171b26]' : 'border border-[#525969]'}`} style={{ backgroundColor: finish.color }} data-testid={`button-finish-${product.id}-${finish.name.toLowerCase().replaceAll(' ', '-')}`} />)}
          </div>
        </div>
      </div>
      <button type="button" onClick={onAdd} className={`primary-hover flex w-full items-center justify-center gap-2 rounded-lg py-3 font-display text-[10px] font-bold uppercase tracking-[.1em] ${product.tone === 'gold' ? 'bg-[#eab308] text-[#211900]' : 'border border-[#3b414e] bg-[#20242f] text-[#e2e4eb] hover:border-[#eab308] hover:text-[#facc15]'} ${added ? 'added-pulse' : ''}`} data-testid={`button-add-${product.id}`}>
        {added ? <Check size={15} /> : <ShoppingBag size={15} />}<span>{added ? 'Added ✓' : `Add to Cart — ${currencyPrice}`}</span>
      </button>
    </div>
  </article>;
}

function FeatureCard({ icon, title, text, telemetry }: { icon: ReactNode; title: string; text: string; telemetry: ReactNode }) {
  return <article className="card-hover flex flex-col justify-between rounded-xl border border-[#313540] bg-[#171b26] p-5 sm:p-6">
    <div><div className="mb-4 grid h-11 w-11 place-items-center rounded-lg border border-[#313540] bg-[#20242f] text-[#eab308]">{icon}</div><h3 className="mb-2 font-display text-[19px] font-semibold">{title}</h3><p className="text-[12px] leading-[1.7] text-[#a4a9b7]">{text}</p></div>
    <div className="mono mt-6 rounded-lg border border-[#313540] bg-[#0b0f19] p-3.5 text-[#778091]">{telemetry}</div>
  </article>;
}

function SpecRow({ label, value, gold = false }: { label: string; value: string; gold?: boolean }) {
  return <div className="flex justify-between gap-2 py-1 text-[10px]"><span className="text-[#778091]">{label}</span><span className={gold ? 'text-[#facc15]' : 'text-[#e2e4eb]'}>{value}</span></div>;
}

export default Current;
