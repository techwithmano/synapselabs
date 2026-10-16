'use client';

import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react';
import { CART_STORAGE_KEY } from '@/lib/cart';
import { formatCurrencyAmount, getUnitPriceInCurrency, type CheckoutCurrency } from '@/lib/pricing';
import {
  type Account,
  type CartLine,
  type Currency,
  type FavoriteItem,
  type Product,
  CART_DRAWER_STORAGE_KEY,
  FAVORITES_STORAGE_KEY,
  PRODUCT_BENEFITS,
  PRODUCT_VARIANTS,
} from '@/src/lib/constants';

type StorefrontContextType = {
  products: Product[];
  loadingProducts: boolean;
  productError: string;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (price: number) => string;
  account: Account | null;
  accountLoading: boolean;
  signingOut: boolean;
  signOut: () => Promise<void>;
  cart: CartLine[];
  cartItems: (CartLine & { product: Product })[];
  cartCount: number;
  subtotal: number;
  formattedSubtotal: string;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: string, variant?: string) => void;
  adjustQuantity: (productId: string, amount: number, variant?: string) => void;
  emptyCart: () => void;
  undoEmptyCart: () => void;
  hasUndo: boolean;
  startCheckout: () => Promise<void>;
  startingCheckout: boolean;
  checkoutError: string;
  favorites: FavoriteItem[];
  favoriteItems: (FavoriteItem & { product: Product })[];
  favoritesOpen: boolean;
  openFavorites: () => void;
  closeFavorites: () => void;
  toggleFavorite: (productId: string, variant?: string) => void;
  isFavorite: (productId: string, variant?: string) => boolean;
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  sizeGuideOpen: boolean;
  openSizeGuide: () => void;
  closeSizeGuide: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  selectedVariants: Record<string, string>;
  setVariant: (slug: string, option: string) => void;
  toastMessage: { title: string; subtitle: string } | null;
  setToastMessage: (msg: { title: string; subtitle: string } | null) => void;
};

const StorefrontContext = createContext<StorefrontContextType | null>(null);

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function StorefrontProvider({
  children,
  initialCartOpen = false,
}: {
  children: React.ReactNode;
  initialCartOpen?: boolean;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState('');
  const [currency, setCurrency] = useState<Currency>('KWD');
  const [account, setAccount] = useState<Account | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const cached = window.sessionStorage.getItem('synapse_auth_user');
      if (cached) return JSON.parse(cached) as Account;
    } catch {}
    return null;
  });
  const [accountLoading, setAccountLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  // Cart
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartRestored, setCartRestored] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [deletedCartBackup, setDeletedCartBackup] = useState<CartLine[] | null>(null);
  const [startingCheckout, setStartingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Favorites
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  // Modals & Drawers
  const [searchOpen, setSearchOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Variants selection state
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({
    'synapse-core-ring': 'US 9',
    'aura-spatial-clip': 'Matte Porcelain',
    'neurodock-magnetic-slate': 'Porcelain White',
  });

  // Toasts
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);

  const checkoutCurrencyCode: CheckoutCurrency = currency === 'USD' ? 'usd' : 'kwd';

  const formatPrice = useCallback(
    (price: number): string => {
      return formatCurrencyAmount(
        getUnitPriceInCurrency(price, checkoutCurrencyCode),
        checkoutCurrencyCode,
      );
    },
    [checkoutCurrencyCode],
  );

  // Load Products
  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    setProductError('');
    try {
      const response = await fetch('/api/products', { cache: 'no-store' });
      const payload = (await response.json()) as
        | { error?: string }
        | Array<{ _id: string; name: string; description: string; price: number; image: string; category: string }>;
      if (!response.ok || !Array.isArray(payload)) {
        throw new Error(
          !Array.isArray(payload) && payload.error
            ? payload.error
            : 'Products are temporarily unavailable.',
        );
      }
      setProducts(
        payload.map((record) => {
          const slug = slugify(record.name);
          return {
            id: record._id,
            slug,
            name: record.name,
            description: record.description,
            price: record.price,
            image: record.image,
            category: record.category,
            benefit: PRODUCT_BENEFITS[slug] ?? record.description,
          };
        }),
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

    // Check auth
    void fetch('/api/auth/me', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) {
          try { window.sessionStorage.removeItem('synapse_auth_user'); } catch {}
          return null;
        }
        const result = (await response.json()) as { user?: Account | null };
        const user = result.user ?? null;
        if (user) {
          try { window.sessionStorage.setItem('synapse_auth_user', JSON.stringify(user)); } catch {}
        } else {
          try { window.sessionStorage.removeItem('synapse_auth_user'); } catch {}
        }
        return user;
      })
      .then(setAccount)
      .catch(() => {
        setAccount(null);
        try { window.sessionStorage.removeItem('synapse_auth_user'); } catch {}
      })
      .finally(() => setAccountLoading(false));

    // Restore cart
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

    // Restore favorites
    try {
      const savedFavs = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavs) {
        const parsed = JSON.parse(savedFavs) as unknown;
        if (Array.isArray(parsed)) {
          const migrated: FavoriteItem[] = parsed
            .map((item) => (typeof item === 'string' ? { productId: item } : (item as FavoriteItem)))
            .filter((item) => typeof item?.productId === 'string');
          setFavorites(migrated);
        }
      }
    } catch {}
  }, [loadProducts]);

  // Persist cart
  useEffect(() => {
    if (!cartRestored) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart, cartRestored]);

  // Persist favorites
  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  // Initial cart open
  useEffect(() => {
    if (!cartRestored) return;
    if (initialCartOpen) setCartOpen(true);
  }, [initialCartOpen, cartRestored]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (searchOpen) setSearchOpen(false);
        if (sizeGuideOpen) setSizeGuideOpen(false);
        if (favoritesOpen) setFavoritesOpen(false);
        if (cartOpen) closeCart();
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, sizeGuideOpen, favoritesOpen, cartOpen, mobileMenuOpen]);

  const productById = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products],
  );

  const cartItems = useMemo(
    () =>
      cart
        .map((line) => ({ ...line, product: productById.get(line.productId)! }))
        .filter((line): line is CartLine & { product: Product } => Boolean(line.product)),
    [cart, productById],
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, line) => sum + line.quantity, 0),
    [cart],
  );

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, line) =>
          sum + getUnitPriceInCurrency(line.product.price, checkoutCurrencyCode) * line.quantity,
        0,
      ),
    [cartItems, checkoutCurrencyCode],
  );

  const formattedSubtotal = useMemo(
    () => formatCurrencyAmount(subtotal, checkoutCurrencyCode),
    [subtotal, checkoutCurrencyCode],
  );

  const favoriteItems = useMemo(
    () =>
      favorites
        .map((fav) => ({
          ...fav,
          product: productById.get(fav.productId)!,
        }))
        .filter((item): item is FavoriteItem & { product: Product } => Boolean(item.product)),
    [favorites, productById],
  );

  const openCart = useCallback(() => {
    setCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setCartOpen(false);
  }, []);

  const addToCart = useCallback(
    (productId: string, overrideVariant?: string) => {
      const product = productById.get(productId);
      const chosenVariant =
        overrideVariant ||
        (product ? selectedVariants[product.slug] : undefined) ||
        (product ? PRODUCT_VARIANTS[product.slug]?.default : undefined);

      setCart((current) => {
        const foundIndex = current.findIndex(
          (line) =>
            line.productId === productId &&
            (line.variant || '') === (chosenVariant || ''),
        );
        if (foundIndex > -1) {
          return current.map((line, idx) =>
            idx === foundIndex
              ? { ...line, quantity: Math.min(line.quantity + 1, 99) }
              : line,
          );
        }
        return [...current, { productId, variant: chosenVariant, quantity: 1 }];
      });

      setCheckoutError('');
      openCart();

      if (product) {
        setToastMessage({
          title: `Added ${product.name}`,
          subtitle: `${chosenVariant ? `${chosenVariant} • ` : ''}${formatPrice(product.price)} • Added to bag`,
        });
        window.setTimeout(() => setToastMessage(null), 3200);
      }
    },
    [productById, selectedVariants, openCart, formatPrice],
  );

  const adjustQuantity = useCallback((productId: string, amount: number, variant?: string) => {
    setCart((current) => {
      let adjusted = false;
      const updated = current.map((line) => {
        const isTarget =
          line.productId === productId &&
          (variant !== undefined ? line.variant === variant : !adjusted);
        if (isTarget) {
          adjusted = true;
          return { ...line, quantity: line.quantity + amount };
        }
        return line;
      });
      return updated.filter((line) => line.quantity > 0);
    });
  }, []);

  const emptyCart = useCallback(() => {
    if (!cart.length) return;
    setDeletedCartBackup([...cart]);
    setCart([]);
    setToastMessage({
      title: 'Shopping bag emptied',
      subtitle: 'Items cleared from your selection',
    });
    window.setTimeout(() => setToastMessage(null), 3500);
  }, [cart]);

  const undoEmptyCart = useCallback(() => {
    if (deletedCartBackup) {
      setCart(deletedCartBackup);
      setDeletedCartBackup(null);
    }
  }, [deletedCartBackup]);

  const isFavorite = useCallback(
    (productId: string, variant?: string): boolean => {
      return favorites.some(
        (f) => f.productId === productId && (!variant || !f.variant || f.variant === variant),
      );
    },
    [favorites],
  );

  const toggleFavorite = useCallback(
    (productId: string, variant?: string) => {
      const product = productById.get(productId);
      const chosenVariant = variant || (product ? selectedVariants[product.slug] : undefined);
      setFavorites((prev) => {
        const exists = prev.some(
          (f) => f.productId === productId && (!f.variant || !chosenVariant || f.variant === chosenVariant),
        );
        const next = exists
          ? prev.filter(
              (f) =>
                !(
                  f.productId === productId &&
                  (!f.variant || !chosenVariant || f.variant === chosenVariant)
                ),
            )
          : [...prev, { productId, variant: chosenVariant }];
        if (product) {
          setToastMessage({
            title: exists ? `Removed ${product.name}` : `Saved ${product.name}`,
            subtitle: exists
              ? 'Removed from saved items'
              : `${chosenVariant ? `${chosenVariant} • ` : ''}Added to your saved wishlist`,
          });
          window.setTimeout(() => setToastMessage(null), 3200);
        }
        return next;
      });
    },
    [productById, selectedVariants],
  );

  const startCheckout = useCallback(async () => {
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
          currency: checkoutCurrencyCode,
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
  }, [account, cartItems, checkoutCurrencyCode]);

  const signOut = useCallback(async () => {
    setSigningOut(true);
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        setAccount(null);
        try { window.sessionStorage.removeItem('synapse_auth_user'); } catch {}
      }
    } finally {
      setSigningOut(false);
    }
  }, []);

  const setVariant = useCallback((slug: string, option: string) => {
    setSelectedVariants((prev) => ({ ...prev, [slug]: option }));
  }, []);

  const value = {
    products,
    loadingProducts,
    productError,
    currency,
    setCurrency,
    formatPrice,
    account,
    accountLoading,
    signingOut,
    signOut,
    cart,
    cartItems,
    cartCount,
    subtotal,
    formattedSubtotal,
    cartOpen,
    openCart,
    closeCart,
    addToCart,
    adjustQuantity,
    emptyCart,
    undoEmptyCart,
    hasUndo: Boolean(deletedCartBackup),
    startCheckout,
    startingCheckout,
    checkoutError,
    favorites,
    favoriteItems,
    favoritesOpen,
    openFavorites: () => setFavoritesOpen(true),
    closeFavorites: () => setFavoritesOpen(false),
    toggleFavorite,
    isFavorite,
    searchOpen,
    openSearch: () => setSearchOpen(true),
    closeSearch: () => setSearchOpen(false),
    sizeGuideOpen,
    openSizeGuide: () => setSizeGuideOpen(true),
    closeSizeGuide: () => setSizeGuideOpen(false),
    mobileMenuOpen,
    setMobileMenuOpen,
    selectedVariants,
    setVariant,
    toastMessage,
    setToastMessage,
  };

  return <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>;
}

export function useStorefront() {
  const context = useContext(StorefrontContext);
  if (!context) {
    throw new Error('useStorefront must be used within a StorefrontProvider');
  }
  return context;
}
