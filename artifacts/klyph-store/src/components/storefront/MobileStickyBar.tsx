'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useStorefront } from '@/src/context/StorefrontContext';
import { type Product } from '@/src/lib/constants';

export default function MobileStickyBar() {
  const { products, formatPrice, addToCart, cartOpen, favoritesOpen, searchOpen, sizeGuideOpen } =
    useStorefront();

  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [inShopView, setInShopView] = useState(false);
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    // Observe #devices
    const shopEl = document.getElementById('devices');
    let shopObs: IntersectionObserver | null = null;
    if (shopEl) {
      shopObs = new IntersectionObserver(
        ([entry]) => {
          setInShopView(entry.isIntersecting);
        },
        { threshold: 0.05 },
      );
      shopObs.observe(shopEl);
    }

    // Observe footer
    const footerEl = document.querySelector('.site-footer');
    let footerObs: IntersectionObserver | null = null;
    if (footerEl) {
      footerObs = new IntersectionObserver(
        ([entry]) => {
          setFooterInView(entry.isIntersecting);
        },
        { threshold: 0.01 },
      );
      footerObs.observe(footerEl);
    }

    // Observe individual product cards to set activeProduct
    const cards = document.querySelectorAll<HTMLElement>('.product-card');
    const ratioMap = new Map<string, number>();
    let cardObs: IntersectionObserver | null = null;
    if (cards.length) {
      cardObs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const slug = (entry.target as HTMLElement).dataset.productSlug;
            if (slug) {
              ratioMap.set(slug, entry.isIntersecting ? entry.intersectionRatio : 0);
            }
          }
          let bestSlug = '';
          let maxRatio = 0;
          for (const [slug, ratio] of ratioMap.entries()) {
            if (ratio > maxRatio) {
              maxRatio = ratio;
              bestSlug = slug;
            }
          }
          if (bestSlug) {
            const found = products.find((p) => p.slug === bestSlug);
            if (found) setActiveProduct(found);
          }
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1.0] },
      );
      cards.forEach((c) => cardObs?.observe(c));
    }

    return () => {
      shopObs?.disconnect();
      footerObs?.disconnect();
      cardObs?.disconnect();
    };
  }, [products]);

  const target = activeProduct || products[0];

  const anyModalOpen = cartOpen || favoritesOpen || searchOpen || sizeGuideOpen;
  const isVisible = inShopView && !footerInView && !anyModalOpen && Boolean(target);

  if (!target) return null;

  return (
    <div
      className={`mobile-sticky-bar ${isVisible ? 'is-visible' : ''}`}
      role="region"
      aria-label="Quick Add Bar"
    >
      <div style={{ minWidth: 0 }}>
        <strong
          style={{
            display: 'block',
            fontSize: '14px',
            color: 'var(--synapse-obsidian)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {target.name}
        </strong>
        <span style={{ fontSize: '13px', color: 'var(--synapse-steel)', fontWeight: 600 }}>
          {formatPrice(target.price)}
        </span>
      </div>

      <button
        type="button"
        onClick={() => addToCart(target.id)}
        className="btn btn-primary"
        style={{ padding: '8px 18px', minHeight: '42px', fontSize: '13.5px' }}
      >
        <ShoppingBag size={15} aria-hidden="true" />
        <span>Add to bag</span>
      </button>
    </div>
  );
}
