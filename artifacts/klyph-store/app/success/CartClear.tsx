'use client';

import { useEffect } from 'react';
import { CART_STORAGE_KEY } from '@/lib/cart';

export default function CartClear() {
  useEffect(() => {
    try {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // The verified order is complete even if this browser blocks local storage.
    }
  }, []);

  return null;
}
