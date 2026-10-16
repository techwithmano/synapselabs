'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { useStorefront } from '@/src/context/StorefrontContext';

export default function SearchOverlay() {
  const { searchOpen, closeSearch, products, formatPrice, addToCart } = useStorefront();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      setSelectedIndex(-1);
      window.setTimeout(() => {
        inputRef.current?.focus();
      }, 80);
    }
  }, [searchOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.benefit.toLowerCase().includes(q),
    );
  }, [query, products]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = selectedIndex >= 0 ? results[selectedIndex] : results[0];
      if (target) {
        addToCart(target.id);
        closeSearch();
      }
    }
  }

  if (!searchOpen) return null;

  return (
    <div
      className={`modal-backdrop ${searchOpen ? 'is-open' : ''}`}
      onClick={closeSearch}
      role="dialog"
      aria-modal="true"
      aria-label="Search devices"
    >
      <div className="search-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-wrap">
          <Search size={20} aria-hidden="true" style={{ color: 'var(--synapse-muted)' }} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search rings, audio clips, chargers..."
            className="search-input"
            aria-label="Search query"
          />
          <button
            type="button"
            className="btn-icon"
            onClick={closeSearch}
            aria-label="Close search"
            style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px' }}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {query.trim() && (
          <ul className="search-results-list" role="listbox">
            {results.length === 0 ? (
              <li style={{ padding: '24px 20px', textAlign: 'center', color: 'var(--synapse-muted)', fontSize: '14.5px' }}>
                No matching devices found for &ldquo;{query}&rdquo;
              </li>
            ) : (
              results.map((product, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <li key={product.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        addToCart(product.id);
                        closeSearch();
                      }}
                      className={`search-result-item ${isSelected ? 'is-selected' : ''}`}
                      style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img
                          src={product.image}
                          alt=""
                          width={48}
                          height={48}
                          style={{ borderRadius: '6px', objectFit: 'cover', background: 'var(--synapse-bg)' }}
                        />
                        <div>
                          <strong style={{ display: 'block', fontSize: '15px', color: 'var(--synapse-obsidian)' }}>
                            {product.name}
                          </strong>
                          <span style={{ fontSize: '13px', color: 'var(--synapse-steel)' }}>
                            {formatPrice(product.price)} &bull; {product.benefit}
                          </span>
                        </div>
                      </div>
                      <ArrowRight size={16} aria-hidden="true" style={{ color: 'var(--synapse-muted)' }} />
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
