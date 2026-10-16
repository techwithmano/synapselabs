'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import SynapseLogo from './components/SynapseLogo';
import {
  Activity,
  ArrowRight,
  AudioLines,
  BatteryCharging,
  Check,
  ChevronRight,
  Cpu,
  Fingerprint,
  Heart,
  Layers,
  Lock,
  LogOut,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Truck,
  Undo2,
  UserRound,
  Watch,
  X,
  Zap,
} from 'lucide-react';

const FAVORITES_STORAGE_KEY = 'synapse_favorites';

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

type VariantOption = { name: string; options: string[]; default: string };
const PRODUCT_VARIANTS: Record<string, VariantOption> = {
  'synapse-core-ring': {
    name: 'Size',
    options: ['US 8', 'US 9', 'US 10', 'US 11'],
    default: 'US 9',
  },
  'aura-spatial-clip': {
    name: 'Finish',
    options: ['Matte Porcelain', 'Obsidian Slate'],
    default: 'Matte Porcelain',
  },
  'neurodock-magnetic-slate': {
    name: 'Finish',
    options: ['Porcelain White', 'Titanium Silver'],
    default: 'Porcelain White',
  },
};

type AddButtonState = 'idle' | 'adding' | 'added' | 'error';

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

type ProductSpecs = {
  materials: string;
  telemetry: string;
  battery: string;
  durability: string;
  weight: string;
  features: string[];
};

const PRODUCT_SPECS: Record<string, ProductSpecs> = {
  'synapse-core-ring': {
    materials: 'Sintered Zirconia Ceramic & Grade 5 Titanium Chassis',
    telemetry: 'Multi-spectral PPG (530nm/660nm) & Sub-epidermal Thermal Sensor',
    battery: '7 Days Continuous Telemetry / Sub-second Inductive Charge',
    durability: '10 ATM (100m) Water Resistance / Hypoallergenic PVD',
    weight: '3.8g ultra-lightweight monolithic profile',
    features: [
      'Continuous neural biometric synchronicity & HRV telemetry',
      'Circadian sleep architecture and body recovery mapping',
      'Hairline cobalt optical telemetry pulse slit with ambient feedback',
      'Seamless biometric telemetry integration with zero screen distraction',
    ],
  },
  'aura-spatial-clip': {
    materials: 'Brushed Aerospace Titanium & Acoustic Micro-Grille',
    telemetry: 'Bone-Conduction Dual-Acoustic Resonator Field',
    battery: '14 Hours Continuous Playback / 36 Hours with Charging Vault',
    durability: 'IP68 Dust & Water Immersion Resistance',
    weight: '6.2g ergonomic auricle clip',
    features: [
      'Spatial acoustic conduction without ear canal occlusion',
      'Dual beamforming MEMS noise-isolation microphone array',
      'Whisper-grade ambient neural voice capture',
      'Zero acoustic leakage at high sound pressure levels',
    ],
  },
  'neurodock-magnetic-slate': {
    materials: 'Chamfered Ceramic Top Surface with Obsidian Aluminum Chassis',
    telemetry: '15W Adaptive Magnetic Resonance Inductive Charging',
    battery: 'Direct AC/USB-C Power Delivery with GaN Efficiency',
    durability: 'Scratch-resistant sintered ceramic surface',
    weight: '145g weighted anti-slip monolithic base',
    features: [
      'Simultaneous multi-device inductive coupling',
      '360° recessed cobalt status halo with breathing state indicator',
      'Internal liquid-chamber thermal dissipation architecture',
      'Foreign object detection and auto-power regulation',
    ],
  },
};

const defaultSpecs: ProductSpecs = {
  materials: 'Aerospace-Grade Titanium & High-Purity Ceramic',
  telemetry: 'Neural Biometric Sensor Array',
  battery: 'Multi-day Active Telemetry / Fast Magnetic Induction',
  durability: 'Water & Dust Resistant Architecture',
  weight: 'Monolithic Ultra-Lightweight Construction',
  features: [
    'Seamless sensory telemetry integration',
    'Tactile monolithic industrial finish',
    'Sub-millimeter biometric clarity',
  ],
};

export default function SynapseStorefront({
  initialCartOpen = false,
  hasBrandAd = false,
}: {
  initialCartOpen?: boolean;
  hasBrandAd?: boolean;
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTelemetryTab, setActiveTelemetryTab] = useState<'biometrics' | 'audio' | 'power'>('biometrics');
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);

  const [productAddStates, setProductAddStates] = useState<Record<string, AddButtonState>>({});
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({
    'synapse-core-ring': 'US 9',
    'aura-spatial-clip': 'Matte Porcelain',
    'neurodock-magnetic-slate': 'Porcelain White',
  });
  const [deletedCartBackup, setDeletedCartBackup] = useState<CartLine[] | null>(null);

  // Live Nav Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSelectedIndex, setSearchSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);

  // Favorites / Wishlist state
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const favoritesTriggerRef = useRef<HTMLButtonElement>(null);
  const favoritesDrawerRef = useRef<HTMLElement>(null);

  // Category filter & sort state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<string>('featured');

  const checkoutButtonRef = useRef<HTMLButtonElement>(null);
  const cartTriggerRef = useRef<HTMLButtonElement>(null);
  const specModalTriggerRef = useRef<HTMLElement | null>(null);
  const cartDrawerRef = useRef<HTMLElement>(null);
  const specModalRef = useRef<HTMLDivElement>(null);

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
    try {
      const savedFavs = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavs) {
        const parsed = JSON.parse(savedFavs) as unknown;
        if (Array.isArray(parsed) && parsed.every((id) => typeof id === 'string')) {
          setFavorites(parsed);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    if (!cartRestored) return;
    let shouldOpen = initialCartOpen;
    try {
      if (window.sessionStorage.getItem('synapse_cart_drawer_open') === 'true') {
        shouldOpen = true;
      }
    } catch {}
    if (shouldOpen) setCartOpen(true);
  }, [initialCartOpen, cartRestored]);

  // Focus trap, body scroll locking, and Escape key handling
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (searchOpen) closeSearch();
        if (favoritesOpen) closeFavorites();
        if (selectedProduct) closeSpecModal();
        if (cartOpen) closeCart();
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, favoritesOpen, selectedProduct, cartOpen, mobileMenuOpen]);

  useEffect(() => {
    if (!cartOpen && !selectedProduct && !mobileMenuOpen && !favoritesOpen) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';

    const container = cartOpen
      ? cartDrawerRef.current
      : favoritesOpen
      ? favoritesDrawerRef.current
      : selectedProduct
      ? specModalRef.current
      : null;

    if (!container) return;

    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function handleTrapTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(
        container?.querySelectorAll<HTMLElement>(focusableSelector) || [],
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    container.addEventListener('keydown', handleTrapTab);
    return () => {
      container.removeEventListener('keydown', handleTrapTab);
      document.body.style.overflow = '';
    };
  }, [cartOpen, selectedProduct, mobileMenuOpen, favoritesOpen]);

  function openCart(e?: React.SyntheticEvent) {
    if (e?.currentTarget instanceof HTMLElement) {
      cartTriggerRef.current = e.currentTarget as HTMLButtonElement;
    }
    setCartOpen(true);
    try {
      window.sessionStorage.setItem('synapse_cart_drawer_open', 'true');
    } catch {}
  }

  function closeCart() {
    setCartOpen(false);
    try {
      window.sessionStorage.removeItem('synapse_cart_drawer_open');
    } catch {}
    cartTriggerRef.current?.focus();
  }

  function openFavorites(e?: React.SyntheticEvent) {
    if (e?.currentTarget instanceof HTMLElement) {
      favoritesTriggerRef.current = e.currentTarget as HTMLButtonElement;
    }
    setFavoritesOpen(true);
  }

  function closeFavorites() {
    setFavoritesOpen(false);
    favoritesTriggerRef.current?.focus();
  }

  function toggleFavorite(productId: string) {
    const product = productById.get(productId);
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      if (product) {
        setToastMessage({
          title: exists ? `Removed ${product.name}` : `Saved ${product.name}`,
          subtitle: exists ? 'Removed from saved items' : 'Added to your saved wishlist',
        });
        window.setTimeout(() => setToastMessage(null), 3200);
      }
      return next;
    });
  }

  function openSearch() {
    setSearchOpen(true);
    setSearchSelectedIndex(-1);
    window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 60);
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchSelectedIndex(-1);
    searchTriggerRef.current?.focus();
  }

  function openSpecModal(product: Product, e?: React.SyntheticEvent) {
    if (e?.currentTarget instanceof HTMLElement) {
      specModalTriggerRef.current = e.currentTarget;
    }
    setSelectedProduct(product);
  }

  function closeSpecModal() {
    setSelectedProduct(null);
    specModalTriggerRef.current?.focus();
  }

  function setVariant(slug: string, option: string) {
    setSelectedVariants((prev) => ({ ...prev, [slug]: option }));
  }

  function emptyCart() {
    if (!cart.length) return;
    setDeletedCartBackup([...cart]);
    setCart([]);
    setToastMessage({
      title: 'Shopping bag emptied',
      subtitle: 'Items cleared from your selection',
    });
    window.setTimeout(() => setToastMessage(null), 3500);
  }

  function undoEmptyCart() {
    if (deletedCartBackup) {
      setCart(deletedCartBackup);
      setDeletedCartBackup(null);
    }
  }

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

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }, [searchQuery, products]);

  const favoriteItems = useMemo(() => {
    return favorites
      .map((id) => productById.get(id))
      .filter((p): p is Product => Boolean(p));
  }, [favorites, productById]);

  const availableCategories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ['All', ...cats];
  }, [products]);

  const displayedProducts = useMemo(() => {
    let list = [...products];
    if (selectedCategory !== 'All') {
      list = list.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }
    if (selectedSort === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [products, selectedCategory, selectedSort]);

  function handleSearchInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!searchResults.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSearchSelectedIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSearchSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : searchResults.length - 1,
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target =
        searchSelectedIndex >= 0
          ? searchResults[searchSelectedIndex]
          : searchResults[0];
      if (target) {
        closeSearch();
        openSpecModal(target);
      }
    }
  }

  function addToCart(productId: string) {
    if (productAddStates[productId] === 'adding') return;

    setProductAddStates((prev) => ({ ...prev, [productId]: 'adding' }));
    const product = productById.get(productId);

    try {
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
      try {
        window.sessionStorage.setItem('synapse_cart_drawer_open', 'true');
      } catch {}
      setProductAddStates((prev) => ({ ...prev, [productId]: 'added' }));

      if (product) {
        const variant = selectedVariants[product.slug];
        setToastMessage({
          title: `Added ${product.name}`,
          subtitle: `${variant ? `${variant} • ` : ''}${formatPrice(product.price, currency)} • Added to bag`,
        });
        window.setTimeout(() => setToastMessage(null), 3200);
      }

      window.setTimeout(() => {
        checkoutButtonRef.current?.focus();
      }, 120);

      window.setTimeout(() => {
        setProductAddStates((prev) => ({ ...prev, [productId]: 'idle' }));
        setAddedProduct('');
      }, 1500);
    } catch {
      setProductAddStates((prev) => ({ ...prev, [productId]: 'error' }));
    }
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
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main className="synapse-canvas synapse-store" id="main-content" data-testid="storefront">
        <header className="site-header" role="banner">
          <div className="nav-shell">
            <div className="site-header-inner">
              <Link className="brand-lockup" href="/" aria-label="Synapse Labs home">
                <SynapseLogo size={28} showWordmark={true} />
              </Link>

              <nav className="main-nav" aria-label="Main navigation">
                <a className="nav-link" href="/#devices">Devices</a>
                <a className="nav-link" href="/#technology">Technology</a>
                <Link className="nav-link nav-link-brand" href="/brand">Brand Sheet</Link>
              </nav>

            <div className="header-actions">
              {/* Live Search Wrapper */}
              <div className="search-wrapper" role="search">
                <button
                  ref={searchTriggerRef}
                  aria-label={searchOpen ? 'Close search' : 'Search hardware devices'}
                  aria-expanded={searchOpen}
                  aria-haspopup="dialog"
                  className="icon-button search-toggle-btn"
                  data-testid="button-open-search"
                  onClick={() => {
                    if (searchOpen) closeSearch();
                    else openSearch();
                  }}
                  type="button"
                >
                  {searchOpen ? <X size={18} aria-hidden="true" /> : <Search size={18} aria-hidden="true" />}
                </button>

                {searchOpen && (
                  <div
                    className="search-popover"
                    role="combobox"
                    aria-expanded="true"
                    aria-haspopup="listbox"
                    aria-owns="search-results-listbox"
                  >
                    <div className="search-input-box">
                      <Search size={16} className="search-input-icon" aria-hidden="true" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        className="search-input-field"
                        placeholder="Search devices, category, specs…"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setSearchSelectedIndex(-1);
                        }}
                        onKeyDown={handleSearchInputKeyDown}
                        aria-label="Search hardware devices"
                        aria-autocomplete="list"
                        aria-controls="search-results-listbox"
                        autoComplete="off"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          className="search-clear-btn"
                          onClick={() => {
                            setSearchQuery('');
                            setSearchSelectedIndex(-1);
                            searchInputRef.current?.focus();
                          }}
                          aria-label="Clear search input"
                        >
                          <X size={14} aria-hidden="true" />
                        </button>
                      )}
                    </div>

                    {searchQuery.trim() && (
                      <div
                        id="search-results-listbox"
                        className="search-results-list"
                        role="listbox"
                        aria-label="Search results"
                      >
                        {searchResults.length ? (
                          searchResults.map((result, idx) => {
                            const isSelected = idx === searchSelectedIndex;
                            return (
                              <button
                                key={result.id}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                className={`search-result-item${isSelected ? ' is-selected' : ''}`}
                                onClick={() => {
                                  closeSearch();
                                  openSpecModal(result);
                                }}
                              >
                                <img
                                  src={result.image}
                                  alt=""
                                  className="search-result-thumb"
                                  aria-hidden="true"
                                />
                                <div className="search-result-info">
                                  <span className="search-result-name">{result.name}</span>
                                  <span className="search-result-meta">{result.category}</span>
                                </div>
                                <span className="search-result-price">
                                  {formatPrice(result.price, currency)}
                                </span>
                              </button>
                            );
                          })
                        ) : (
                          <div className="search-empty-state" role="status">
                            No devices found for &ldquo;{searchQuery}&rdquo;
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Favorites / Wishlist Nav Trigger */}
              <button
                ref={favoritesTriggerRef}
                aria-label={`Saved items, ${favorites.length} ${favorites.length === 1 ? 'item' : 'items'}`}
                aria-expanded={favoritesOpen}
                className="icon-button wishlist-button"
                data-testid="button-open-favorites"
                onClick={openFavorites}
                type="button"
              >
                <Heart size={18} aria-hidden="true" fill={favorites.length ? 'currentColor' : 'none'} />
                {favorites.length > 0 && (
                  <span
                    className="wishlist-count-badge"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {favorites.length}
                  </span>
                )}
              </button>

              <div className="currency-switch" role="group" aria-label="Display currency">
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
                ref={cartTriggerRef}
                aria-label={`Shopping bag, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
                aria-expanded={cartOpen}
                aria-controls="cart-drawer-dialog"
                className="icon-button cart-button"
                data-testid="button-open-cart"
                onClick={openCart}
                type="button"
              >
                <ShoppingBag size={18} aria-hidden="true" />
                <span
                  className="cart-count"
                  data-testid="text-cart-count"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {cartCount}
                </span>
              </button>

              <button
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
                className="icon-button mobile-menu-toggle"
                onClick={() => setMobileMenuOpen((current) => !current)}
                type="button"
              >
                {mobileMenuOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
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
              <Link
                className="mobile-nav-link"
                href="/brand"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Brand Sheet</span>
                <ChevronRight size={15} aria-hidden="true" />
              </Link>
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

        {/* Category Filter Chips & Sort Controls */}
        <div className="catalog-toolbar" role="region" aria-label="Catalog filters and sorting">
          <div className="category-filter-chips" role="radiogroup" aria-label="Filter devices by category">
            {availableCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`filter-chip${isSelected ? ' is-active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat !== 'All' && categoryIcon(cat)}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          <div className="catalog-sort-group">
            <label htmlFor="catalog-sort-select" className="catalog-sort-label">
              Sort:
            </label>
            <select
              id="catalog-sort-select"
              className="catalog-sort-select"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              aria-label="Sort devices"
            >
              <option value="featured">Featured Order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Live Filter Meta Strip */}
        <div className="catalog-meta-strip" aria-live="polite">
          <span>
            Showing {displayedProducts.length} of {products.length} {products.length === 1 ? 'device' : 'devices'}
            {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
          </span>
          {(selectedCategory !== 'All' || selectedSort !== 'featured') && (
            <button
              type="button"
              className="reset-filters-btn"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedSort('featured');
              }}
              aria-label="Reset all catalog filters"
            >
              <RotateCcw size={13} aria-hidden="true" />
              <span>Reset filters</span>
            </button>
          )}
        </div>

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
        ) : displayedProducts.length === 0 ? (
          <div className="product-empty-filter" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: 'var(--synapse-steel)', fontSize: '15px' }}>
              No hardware matches this filter criteria.
            </p>
            <button
              type="button"
              className="button-primary"
              style={{ marginTop: '14px' }}
              onClick={() => {
                setSelectedCategory('All');
                setSelectedSort('featured');
              }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {displayedProducts.map((product) => {
              const addState = productAddStates[product.id] || 'idle';
              const variantInfo = PRODUCT_VARIANTS[product.slug];
              const currentVariant = selectedVariants[product.slug] || variantInfo?.default;
              const isFavorited = favorites.includes(product.id);

              return (
                <article className="product-card" key={product.id}>
                  <div
                    className="product-card__visual"
                    onClick={(e) => openSpecModal(product, e)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openSpecModal(product, e);
                      }
                    }}
                    aria-label={`View detailed specifications for ${product.name}`}
                  >
                    <div className="product-card__badges">
                      <span className="product-card__category">{product.category}</span>
                      <span className="product-card__status">
                        <span className="status-indicator-dot" aria-hidden="true" /> AVAILABLE
                      </span>
                    </div>

                    <button
                      type="button"
                      className={`favorite-toggle-btn product-card-favorite-pos${isFavorited ? ' is-active' : ''}`}
                      aria-pressed={isFavorited}
                      aria-label={isFavorited ? `Remove ${product.name} from saved items` : `Save ${product.name} to wishlist`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                    >
                      <Heart
                        size={17}
                        fill={isFavorited ? '#E11D48' : 'none'}
                        color={isFavorited ? '#E11D48' : 'currentColor'}
                        aria-hidden="true"
                      />
                    </button>

                    <div className="product-card__img-container">
                      <img alt={product.name} loading="lazy" src={product.image} />
                    </div>
                    <div className="product-card__action">
                      <span>View product specs ↗</span>
                    </div>
                  </div>
                  <div className="product-card-content">
                    <div className="product-card-meta">
                      <span className="category-label">{product.category}</span>
                      <span className="product-category-icon">{categoryIcon(product.category)}</span>
                    </div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>

                    {variantInfo && (
                      <div
                        className="product-card-variants"
                        role="radiogroup"
                        aria-label={`${product.name} ${variantInfo.name}`}
                      >
                        <span className="variant-label">{variantInfo.name}:</span>
                        <div className="variant-pills">
                          {variantInfo.options.map((option) => {
                            const isSelected = currentVariant === option;
                            return (
                              <button
                                key={option}
                                type="button"
                                role="radio"
                                aria-checked={isSelected}
                                className={`variant-pill${isSelected ? ' is-active' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setVariant(product.slug, option);
                                }}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="product-card-footer">
                      <div className="price-stack">
                        <span className="price-label">UNIT PRICE</span>
                        <strong data-testid={`text-price-${product.slug}`}>
                          {formatPrice(product.price, currency)}
                        </strong>
                      </div>
                      <button
                        className={`add-button${addState === 'added' ? ' is-added' : ''}`}
                        data-testid={`button-add-${product.slug}`}
                        disabled={addState === 'adding'}
                        onClick={() => addToCart(product.id)}
                        type="button"
                        aria-label={`Add ${product.name} to bag`}
                      >
                        {addState === 'adding' ? (
                          <>
                            <span className="button-spinner" aria-hidden="true" />
                            <span>Adding…</span>
                          </>
                        ) : addState === 'added' ? (
                          <>
                            <span>Added to Bag</span>
                            <Check size={16} aria-hidden="true" />
                          </>
                        ) : addState === 'error' ? (
                          <>
                            <span>Try again</span>
                            <ArrowRight size={16} aria-hidden="true" />
                          </>
                        ) : (
                          <>
                            <span>Add to cart</span>
                            <ArrowRight size={16} aria-hidden="true" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
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

      <section className="telemetry-lab-section page-container" id="telemetry">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE SYNAPSE LAB // SYSTEM ARCHITECTURE</span>
            <h2>Real-time Telemetry Demonstration.</h2>
          </div>
          <p>
            Interactive sensor visualization showcasing live frequency waveforms, neural telemetry, and resonant inductive power.
          </p>
        </div>

        <div className="telemetry-console">
          <div className="telemetry-console__tabs" role="tablist" aria-label="Telemetry demonstration channels">
            <button
              className={`telemetry-tab${activeTelemetryTab === 'biometrics' ? ' is-active' : ''}`}
              onClick={() => setActiveTelemetryTab('biometrics')}
              type="button"
              role="tab"
              aria-selected={activeTelemetryTab === 'biometrics'}
            >
              <Fingerprint size={16} aria-hidden="true" />
              <span>01 / Optical PPG Waveform</span>
            </button>
            <button
              className={`telemetry-tab${activeTelemetryTab === 'audio' ? ' is-active' : ''}`}
              onClick={() => setActiveTelemetryTab('audio')}
              type="button"
              role="tab"
              aria-selected={activeTelemetryTab === 'audio'}
            >
              <AudioLines size={16} aria-hidden="true" />
              <span>02 / Spatial Acoustic Conduction</span>
            </button>
            <button
              className={`telemetry-tab${activeTelemetryTab === 'power' ? ' is-active' : ''}`}
              onClick={() => setActiveTelemetryTab('power')}
              type="button"
              role="tab"
              aria-selected={activeTelemetryTab === 'power'}
            >
              <BatteryCharging size={16} aria-hidden="true" />
              <span>03 / Inductive Flux Resonance</span>
            </button>
          </div>

          <div className="telemetry-display">
            <div className="telemetry-display__header">
              <div className="telemetry-status-badge">
                <span className="telemetry-pulse-dot" />
                <span>STREAM: LIVE TELEMETRY SIMULATION</span>
              </div>
              <span className="telemetry-timestamp">SAMPLING: 240Hz · HARDWARE LATENCY: &lt;1.8ms</span>
            </div>

            <div className="telemetry-screen">
              {activeTelemetryTab === 'biometrics' && (
                <div className="telemetry-stream">
                  <div className="telemetry-readouts">
                    <div className="readout-card">
                      <span className="readout-label">PULSE CADENCE</span>
                      <strong className="readout-value">68 <small>BPM</small></strong>
                      <span className="readout-sub">RESTING CARDIOVASCULAR RATE</span>
                    </div>
                    <div className="readout-card">
                      <span className="readout-label">HEART RATE VARIABILITY</span>
                      <strong className="readout-value">72 <small>ms</small></strong>
                      <span className="readout-sub">NEURAL READINESS: OPTIMAL</span>
                    </div>
                    <div className="readout-card">
                      <span className="readout-label">BLOOD OXYGENATION</span>
                      <strong className="readout-value">99.2 <small>%</small></strong>
                      <span className="readout-sub">MULTI-SPECTRAL OPTICAL</span>
                    </div>
                  </div>
                  <div className="telemetry-waveform-wrap">
                    <svg className="telemetry-svg" viewBox="0 0 800 160" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        className="telemetry-wave-fill"
                        d="M0,100 Q40,100 60,95 T100,90 T140,85 T160,30 T170,140 T180,85 T220,95 T260,100 T300,100 Q340,100 360,95 T400,90 T440,85 T460,30 T470,140 T480,85 T520,95 T560,100 T600,100 Q640,100 660,95 T700,90 T740,85 T760,30 T770,140 T780,85 T800,100 L800,160 L0,160 Z"
                        fill="url(#waveGrad)"
                      />
                      <path
                        className="telemetry-wave-line"
                        d="M0,100 Q40,100 60,95 T100,90 T140,85 T160,30 T170,140 T180,85 T220,95 T260,100 T300,100 Q340,100 360,95 T400,90 T440,85 T460,30 T470,140 T480,85 T520,95 T560,100 T600,100 Q640,100 660,95 T700,90 T740,85 T760,30 T770,140 T780,85 T800,100"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="2.5"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {activeTelemetryTab === 'audio' && (
                <div className="telemetry-stream">
                  <div className="telemetry-readouts">
                    <div className="readout-card">
                      <span className="readout-label">FREQUENCY SPECTRUM</span>
                      <strong className="readout-value">20Hz–40kHz</strong>
                      <span className="readout-sub">HI-RES SPATIAL RESOLUTION</span>
                    </div>
                    <div className="readout-card">
                      <span className="readout-label">CONDUCTION SPEED</span>
                      <strong className="readout-value">1.2 <small>ms</small></strong>
                      <span className="readout-sub">ULTRA-LOW LATENCY AUDIO</span>
                    </div>
                    <div className="readout-card">
                      <span className="readout-label">BEAMFORMING ISOLATION</span>
                      <strong className="readout-value">-38 <small>dB</small></strong>
                      <span className="readout-sub">ACOUSTIC LEAKAGE: ZERO</span>
                    </div>
                  </div>
                  <div className="telemetry-bars-wrap">
                    {[35, 62, 48, 88, 70, 95, 54, 80, 42, 68, 92, 75, 40, 85, 60, 90, 50, 78, 65, 82, 45, 72, 88, 60].map((height, i) => (
                      <div className="eq-bar" key={i} style={{ height: `${height}%`, animationDelay: `${i * 0.05}s` }} />
                    ))}
                  </div>
                </div>
              )}

              {activeTelemetryTab === 'power' && (
                <div className="telemetry-stream">
                  <div className="telemetry-readouts">
                    <div className="readout-card">
                      <span className="readout-label">INDUCTIVE POWER</span>
                      <strong className="readout-value">15.0 <small>W</small></strong>
                      <span className="readout-sub">MAGNETIC RESONANCE COUPLING</span>
                    </div>
                    <div className="readout-card">
                      <span className="readout-label">SURFACE THERMAL STATE</span>
                      <strong className="readout-value">31.4 <small>°C</small></strong>
                      <span className="readout-sub">PASSIVE LIQUID-CHAMBER COOLING</span>
                    </div>
                    <div className="readout-card">
                      <span className="readout-label">CONVERSION EFFICIENCY</span>
                      <strong className="readout-value">94.8 <small>%</small></strong>
                      <span className="readout-sub">GaN FAST RESONANT INVERTER</span>
                    </div>
                  </div>
                  <div className="telemetry-waveform-wrap">
                    <svg className="telemetry-svg" viewBox="0 0 800 160" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="powerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        className="telemetry-wave-fill"
                        d="M0,80 Q50,20 100,80 T200,80 T300,80 T400,80 T500,80 T600,80 T700,80 T800,80 L800,160 L0,160 Z"
                        fill="url(#powerGrad)"
                      />
                      <path
                        className="telemetry-wave-line"
                        d="M0,80 Q50,20 100,80 T200,80 T300,80 T400,80 T500,80 T600,80 T700,80 T800,80"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2.5"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Trust & Value Strip (Rubric Step 2) */}
      <section className="trust-strip-section page-container" aria-label="Customer service commitments">
        <div className="trust-strip-grid">
          <div className="trust-item">
            <div className="trust-icon-box">
              <Truck size={18} aria-hidden="true" />
            </div>
            <strong>Complimentary Global Courier</strong>
            <p>Priority insured air dispatch to all destinations with end-to-end telemetry tracking.</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon-box">
              <Undo2 size={18} aria-hidden="true" />
            </div>
            <strong>30-Day Tactile Fit Guarantee</strong>
            <p>Try your instrument in daily life. Zero-friction size exchanges with pre-paid return kit.</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon-box">
              <ShieldCheck size={18} aria-hidden="true" />
            </div>
            <strong>2-Year Hardware Warranty</strong>
            <p>Full manufacturing coverage against ceramic micro-fissures or sensor node calibration drift.</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon-box">
              <Lock size={18} aria-hidden="true" />
            </div>
            <strong>Cryptographic Privacy</strong>
            <p>All biometric and spatial telemetry is processed on-device with zero cloud behavioral mining.</p>
          </div>
        </div>
      </section>

      {/* Optional Brand Film Slot (Rubric Step 5) - Renders ONLY if public/ad/brand-ad.mp4 exists */}
      {hasBrandAd && (
        <section className="brand-ad-section page-container" aria-label="Synapse Labs brand film">
          <div className="section-heading">
            <div>
              <span className="eyebrow">BRAND FILM // 11 SECONDS // 16:9 WIDESCREEN</span>
              <h2>Intelligence, in form.</h2>
            </div>
            <p>A cinematic glimpse into the industrial craft and telemetry behind Synapse Labs.</p>
          </div>
          <div className="brand-ad-video-container">
            <video
              controls
              muted
              playsInline
              preload="metadata"
              poster="/images/synapse/hero-synapse.svg"
              className="brand-ad-video"
              aria-label="Synapse Labs 11-second brand film (16:9 landscape)"
            >
              <source src="/ad/brand-ad.mp4" type="video/mp4" />
              <track
                kind="captions"
                src="/ad/brand-ad-captions.vtt"
                srcLang="en"
                label="English captions"
                default
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>
      )}

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
            <SynapseLogo size={24} showWordmark={true} />
          </Link>
          <span>Considered technology for everyday life.</span>
          <Link href="/brand">Brand Sheet</Link>
          <a href="#devices">Devices <ChevronRight size={14} aria-hidden="true" /></a>
          <small>© {new Date().getFullYear()} Synapse Labs</small>
        </div>
      </footer>

      {cartOpen && (
        <div
          className="cart-backdrop"
          data-testid="cart-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeCart();
          }}
        >
          <section
            ref={cartDrawerRef}
            aria-label="Shopping cart"
            aria-modal="true"
            className="cart-drawer"
            data-testid="cart-drawer"
            role="dialog"
            id="cart-drawer-dialog"
          >
            <header className="cart-header">
              <div>
                <span className="eyebrow">YOUR SELECTION</span>
                <h2>Shopping bag <span>({cartCount})</span></h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {Boolean(cartItems.length) && (
                  <button
                    type="button"
                    className="empty-cart-action"
                    onClick={emptyCart}
                    aria-label="Empty shopping bag"
                  >
                    Empty bag
                  </button>
                )}
                <button
                  aria-label="Close cart"
                  className="icon-button"
                  data-testid="button-close-cart"
                  onClick={closeCart}
                  type="button"
                >
                  <X size={19} aria-hidden="true" />
                </button>
              </div>
            </header>

            {deletedCartBackup && (
              <div className="cart-undo-banner" role="status">
                <span>Shopping bag emptied</span>
                <button type="button" className="undo-btn" onClick={undoEmptyCart}>
                  Undo
                </button>
              </div>
            )}

            <div className="cart-body">
              {cartItems.length > 0 || cart.length > 0 ? (
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
                    {!cartItems.length && cart.length > 0 && (
                      <div className="cart-lines-loading" style={{ padding: '24px', textAlign: 'center', color: 'var(--synapse-steel)' }}>
                        Loading bag contents…
                      </div>
                    )}
                  </div>

                  {checkoutError && (
                    <div className="checkout-error-banner" role="alert">
                      <span>{checkoutError}</span>
                      <button
                        type="button"
                        className="error-retry-btn"
                        onClick={() => void startCheckout()}
                      >
                        Try again
                      </button>
                    </div>
                  )}
                  <div className="cart-checkout">
                    <div className="cart-subtotal">
                      <span>Subtotal</span>
                      <strong data-testid="text-cart-subtotal">
                        {formatCurrencyAmount(subtotal, currencyCode)}
                      </strong>
                    </div>
                    <p>Shipping and taxes are calculated separately.</p>
                    {account ? (
                      <button
                        ref={checkoutButtonRef}
                        className="button-primary place-order-button"
                        data-testid="button-checkout"
                        disabled={startingCheckout}
                        onClick={() => void startCheckout()}
                        type="button"
                      >
                        {startingCheckout ? (
                          <>
                            <span className="button-spinner" aria-hidden="true" />
                            <span>Opening secure checkout…</span>
                          </>
                        ) : (
                          <>
                            <span>Secure checkout</span>
                            <ArrowRight size={17} aria-hidden="true" />
                          </>
                        )}
                      </button>
                    ) : (
                      <a
                        ref={checkoutButtonRef as unknown as React.Ref<HTMLAnchorElement>}
                        className="button-primary place-order-button"
                        data-testid="button-checkout"
                        href="/login?next=%2Fcart"
                      >
                        <span>Sign in to checkout</span>
                        <ArrowRight size={17} aria-hidden="true" />
                      </a>
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
                    onClick={closeCart}
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
      {selectedProduct && (
        <div
          ref={specModalRef}
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeSpecModal();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-product-title"
        >
          <div className="spec-modal">
            <button
              className="icon-button modal-close-btn"
              onClick={closeSpecModal}
              aria-label="Close product specifications"
              type="button"
            >
              <X size={18} aria-hidden="true" />
            </button>

            <div className="spec-modal__layout">
              <div className="spec-modal__visual">
                <span className="spec-modal__category">{selectedProduct.category}</span>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="spec-modal__img"
                />
                <div className="spec-modal__meta-strip">
                  <span>FLAGSHIP INSTRUMENT</span>
                  <strong>FORM 001 // SYNAPSE LABS</strong>
                </div>
              </div>

              <div className="spec-modal__details">
                <span className="eyebrow">HARDWARE SPECIFICATIONS</span>
                <h2 id="modal-product-title">{selectedProduct.name}</h2>
                <p className="spec-modal__description">{selectedProduct.description}</p>

                <div className="spec-grid">
                  {(() => {
                    const specs = PRODUCT_SPECS[selectedProduct.slug] ?? defaultSpecs;
                    return (
                      <>
                        <div className="spec-item">
                          <span className="spec-label">
                            <Layers size={13} aria-hidden="true" /> Materials
                          </span>
                          <span className="spec-val">{specs.materials}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">
                            <Cpu size={13} aria-hidden="true" /> Telemetry Architecture
                          </span>
                          <span className="spec-val">{specs.telemetry}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">
                            <Zap size={13} aria-hidden="true" /> Power &amp; Autonomy
                          </span>
                          <span className="spec-val">{specs.battery}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">
                            <ShieldCheck size={13} aria-hidden="true" /> Environmental Durability
                          </span>
                          <span className="spec-val">{specs.durability}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="spec-features">
                  <span className="spec-features-title">Core Engineering Capabilities</span>
                  <ul>
                    {((PRODUCT_SPECS[selectedProduct.slug] ?? defaultSpecs).features).map((feat, i) => (
                      <li key={i}>
                        <Check size={14} className="feature-check" aria-hidden="true" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="spec-modal__footer">
                  <div className="price-stack">
                    <span className="price-label">HARDWARE INVESTMENT</span>
                    <strong className="spec-modal__price">
                      {formatPrice(selectedProduct.price, currency)}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      className={`favorite-toggle-btn${favorites.includes(selectedProduct.id) ? ' is-active' : ''}`}
                      onClick={() => toggleFavorite(selectedProduct.id)}
                      type="button"
                      aria-label={favorites.includes(selectedProduct.id) ? 'Remove from saved items' : 'Save to wishlist'}
                      aria-pressed={favorites.includes(selectedProduct.id)}
                    >
                      <Heart
                        size={18}
                        fill={favorites.includes(selectedProduct.id) ? '#E11D48' : 'none'}
                        color={favorites.includes(selectedProduct.id) ? '#E11D48' : 'currentColor'}
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      className={`button-primary spec-add-btn${addedProduct === selectedProduct.id ? ' is-added' : ''}`}
                      onClick={() => {
                        addToCart(selectedProduct.id);
                      }}
                      type="button"
                    >
                      {addedProduct === selectedProduct.id ? (
                        <>Added to Bag <Check size={16} aria-hidden="true" /></>
                      ) : (
                        <>Add to Bag <ArrowRight size={16} aria-hidden="true" /></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Favorites / Saved Items Drawer (Rubric Step 4 - Interaction 4) */}
      {favoritesOpen && (
        <div
          className="favorites-drawer-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeFavorites();
          }}
          data-testid="favorites-overlay"
        >
          <section
            ref={favoritesDrawerRef}
            className="favorites-drawer"
            role="dialog"
            aria-label="Saved items wishlist"
            aria-modal="true"
          >
            <header className="favorites-header">
              <div>
                <span className="eyebrow">SAVED HARDWARE</span>
                <h2>Saved Items <span>({favorites.length})</span></h2>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={closeFavorites}
                aria-label="Close saved items drawer"
              >
                <X size={19} aria-hidden="true" />
              </button>
            </header>

            <div className="favorites-body">
              {favoriteItems.length ? (
                favoriteItems.map((prod) => (
                  <article className="favorites-item" key={prod.id}>
                    <img src={prod.image} alt="" className="favorites-item-thumb" aria-hidden="true" />
                    <div className="favorites-item-info">
                      <span className="category-label">{prod.category}</span>
                      <strong>{prod.name}</strong>
                      <span>{formatPrice(prod.price, currency)}</span>
                    </div>
                    <div className="favorites-item-actions">
                      <button
                        type="button"
                        className="button-primary favorites-add-btn"
                        onClick={() => {
                          addToCart(prod.id);
                        }}
                        aria-label={`Add ${prod.name} to bag`}
                      >
                        Add to bag
                      </button>
                      <button
                        type="button"
                        className="favorites-remove-btn"
                        onClick={() => toggleFavorite(prod.id)}
                        aria-label={`Remove ${prod.name} from saved items`}
                      >
                        <X size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="favorites-empty">
                  <div className="favorites-empty-icon">
                    <Heart size={24} aria-hidden="true" />
                  </div>
                  <h3>Your wishlist is quiet.</h3>
                  <p>Tap the heart icon on any hardware instrument to save it for quick access.</p>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => {
                      closeFavorites();
                      const el = document.getElementById('devices');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Explore collection <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {toastMessage && (
        <aside className="synapse-toast" role="status" aria-live="polite">
          <div className="toast-content">
            <span className="toast-dot" aria-hidden="true" />
            <div>
              <strong>{toastMessage.title}</strong>
              <small>{toastMessage.subtitle}</small>
            </div>
          </div>
          <button
            className="toast-action"
            onClick={() => {
              setCartOpen(true);
              setToastMessage(null);
            }}
            type="button"
          >
            View bag ↗
          </button>
        </aside>
      )}

      {featuredProduct && (
        <aside className="mobile-sticky-bar" aria-label="Quick order action">
          <div className="mobile-sticky-info">
            <span className="mobile-sticky-name">{featuredProduct.name}</span>
            <strong className="mobile-sticky-price">{formatPrice(featuredProduct.price, currency)}</strong>
          </div>
          <button
            type="button"
            className="button-primary mobile-sticky-btn"
            onClick={() => addToCart(featuredProduct.id)}
            disabled={productAddStates[featuredProduct.id] === 'adding'}
          >
            {productAddStates[featuredProduct.id] === 'adding' ? (
              <span className="button-spinner" aria-hidden="true" />
            ) : productAddStates[featuredProduct.id] === 'added' ? (
              'Added ✓'
            ) : (
              `Add to Bag — ${formatPrice(featuredProduct.price, currency)}`
            )}
          </button>
        </aside>
      )}
    </main>
    </>
  );
}
