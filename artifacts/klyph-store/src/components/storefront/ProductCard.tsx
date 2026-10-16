'use client';

import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useStorefront } from '@/src/context/StorefrontContext';
import { type Product, PRODUCT_VARIANTS } from '@/src/lib/constants';

export default function ProductCard({ product }: { product: Product }) {
  const {
    formatPrice,
    addToCart,
    toggleFavorite,
    isFavorite,
    selectedVariants,
    setVariant,
    openSizeGuide,
  } = useStorefront();

  const variantConfig = PRODUCT_VARIANTS[product.slug];
  const activeVariant = selectedVariants[product.slug] || variantConfig?.default;
  const isSaved = isFavorite(product.id, activeVariant);

  return (
    <article
      className="product-card"
      data-product-slug={product.slug}
      aria-labelledby={`product-title-${product.slug}`}
    >
      <div className="product-card-top">
        <div className="product-image-wrap">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
            width={380}
            height={380}
            loading="lazy"
          />
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={() => toggleFavorite(product.id, activeVariant)}
          className={`btn-icon product-card-fav ${isSaved ? 'is-saved' : ''}`}
          aria-label={isSaved ? `Remove ${product.name} from saved items` : `Save ${product.name} to wishlist`}
        >
          <Heart size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="product-card-content">
        <div className="product-card-header">
          <h3 id={`product-title-${product.slug}`} className="product-title font-heading">
            {product.name}
          </h3>
          <span className="product-price" data-testid={`text-price-${product.slug}`}>
            {formatPrice(product.price)}
          </span>
        </div>

        <p className="product-benefit">{product.benefit}</p>

        {/* Variant selection */}
        {variantConfig && (
          <div className="variant-section">
            <div className="variant-header">
              <span>
                {variantConfig.name}: <strong>{activeVariant}</strong>
              </span>
              {product.slug === 'synapse-core-ring' && (
                <button
                  type="button"
                  onClick={openSizeGuide}
                  className="size-guide-btn"
                  aria-label="Open ring sizing guide"
                >
                  Size guide
                </button>
              )}
            </div>

            <div className="variant-pills" role="radiogroup" aria-label={`Select ${variantConfig.name}`}>
              {variantConfig.options.map((option) => {
                const isSelected = activeVariant === option;
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setVariant(product.slug, option)}
                    className={`variant-pill ${isSelected ? 'is-selected' : ''}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* One Primary Add to Bag Button */}
        <button
          type="button"
          onClick={() => addToCart(product.id, activeVariant)}
          className="btn btn-primary product-card-cta"
          data-testid={`button-add-${product.slug}`}
        >
          <ShoppingBag size={17} aria-hidden="true" />
          <span>Add to bag</span>
        </button>
      </div>
    </article>
  );
}
