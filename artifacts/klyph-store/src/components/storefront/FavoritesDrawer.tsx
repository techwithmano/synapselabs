'use client';

import React from 'react';
import { Heart, ShoppingBag, Trash2, X } from 'lucide-react';
import { useStorefront } from '@/src/context/StorefrontContext';

export default function FavoritesDrawer() {
  const {
    favoritesOpen,
    closeFavorites,
    favoriteItems,
    toggleFavorite,
    addToCart,
    formatPrice,
  } = useStorefront();

  return (
    <>
      <div
        className={`drawer-backdrop ${favoritesOpen ? 'is-open' : ''}`}
        onClick={closeFavorites}
        aria-hidden="true"
      />

      <aside
        className={`drawer ${favoritesOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Saved Wishlist"
      >
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={20} aria-hidden="true" style={{ color: '#EF4444', fill: '#EF4444' }} />
            <h2 className="drawer-title font-heading">Saved Items ({favoriteItems.length})</h2>
          </div>

          <button
            type="button"
            className="btn-icon"
            onClick={closeFavorites}
            aria-label="Close saved items"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="drawer-body">
          {favoriteItems.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                paddingBlock: '64px 32px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--synapse-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--synapse-muted)',
                }}
              >
                <Heart size={26} aria-hidden="true" />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>No saved items yet</h3>
              <p style={{ fontSize: '14.5px', color: 'var(--synapse-steel)', maxWidth: '280px', margin: 0 }}>
                Tap the heart on any device in the shop to save it here for later.
              </p>
              <button
                type="button"
                onClick={closeFavorites}
                className="btn btn-secondary"
                style={{ marginTop: '12px' }}
              >
                Explore shop
              </button>
            </div>
          ) : (
            <div className="cart-lines-list">
              {favoriteItems.map((item, idx) => (
                <div key={`${item.productId}-${item.variant || 'default'}-${idx}`} className="cart-line">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="cart-line-img"
                    width={64}
                    height={64}
                  />

                  <div className="cart-line-info">
                    <div className="cart-line-title">{item.product.name}</div>
                    {item.variant && <div className="cart-line-variant">{item.variant}</div>}
                    <div className="cart-line-price">{formatPrice(item.product.price)}</div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(item.productId, item.variant);
                          closeFavorites();
                        }}
                        className="btn btn-primary"
                        style={{ padding: '6px 14px', minHeight: '36px', fontSize: '13px' }}
                      >
                        <ShoppingBag size={14} aria-hidden="true" />
                        <span>Add to bag</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleFavorite(item.productId, item.variant)}
                        className="btn-icon"
                        style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px' }}
                        aria-label={`Remove ${item.product.name} from saved items`}
                      >
                        <Trash2 size={16} aria-hidden="true" style={{ color: 'var(--synapse-muted)' }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
