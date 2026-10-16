export const SUPPORT_EMAIL = 'support@synapselabs.com';
export const FAVORITES_STORAGE_KEY = 'synapse_favorites';
export const CART_DRAWER_STORAGE_KEY = 'synapse_cart_drawer_open';

export type Currency = 'KWD' | 'USD';

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  benefit: string;
};

export type CartLine = {
  productId: string;
  variant?: string;
  quantity: number;
};

export type FavoriteItem = {
  productId: string;
  variant?: string;
};

export type Account = {
  id: string;
  name: string;
  email: string;
};

export type VariantOption = {
  name: string;
  options: string[];
  default: string;
};

export const PRODUCT_VARIANTS: Record<string, VariantOption> = {
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

export const SIZING_DATA = [6, 7, 8, 9, 10, 11, 12, 13].map((size) => {
  const diameter = 11.63 + 0.8128 * size;
  const circumference = Math.PI * diameter;
  return {
    size: `US ${size}`,
    diameter: diameter.toFixed(1),
    circumference: circumference.toFixed(1),
  };
});

export const PRODUCT_BENEFITS: Record<string, string> = {
  'synapse-core-ring': 'Continuous sleep, heart rate, and wellness insights in ceramic and titanium.',
  'aura-spatial-clip': 'Spatial open-ear audio with dual noise-isolation microphones.',
  'neurodock-magnetic-slate': 'Fast magnetic resonance charging on a scratch-resistant ceramic surface.',
};
