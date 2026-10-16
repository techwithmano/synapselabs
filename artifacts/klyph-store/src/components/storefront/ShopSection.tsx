'use client';

import React from 'react';
import { useStorefront } from '@/src/context/StorefrontContext';
import ProductCard from './ProductCard';

export default function ShopSection() {
  const { products, loadingProducts, productError } = useStorefront();

  return (
    <section id="devices" className="shop-section" aria-label="Shop Devices">
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">The Collection</span>
          <h2>Designed for everyday calm.</h2>
          <p>
            Choose the device that fits your routine. No screens, no monthly subscription fees, and
            complete privacy for your wellness data.
          </p>
        </div>

        {loadingProducts ? (
          <div
            style={{
              padding: '64px 20px',
              textAlign: 'center',
              color: 'var(--synapse-muted)',
              fontSize: '15px',
            }}
          >
            Loading collection...
          </div>
        ) : productError ? (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              background: 'var(--synapse-error-bg)',
              color: 'var(--synapse-error)',
              borderRadius: 'var(--radius-md)',
              maxWidth: '600px',
              marginInline: 'auto',
            }}
          >
            <p style={{ margin: 0, fontWeight: 600 }}>{productError}</p>
            <p style={{ margin: '8px 0 0', fontSize: '14px', color: 'inherit' }}>
              Please refresh the page to try again.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div
            style={{
              padding: '64px 20px',
              textAlign: 'center',
              color: 'var(--synapse-muted)',
            }}
          >
            No products are currently available. Check back soon.
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
