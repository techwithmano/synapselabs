'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Minus, Plus, ShoppingBag, Undo2, X } from 'lucide-react';
import { useStorefront } from '@/src/context/StorefrontContext';

export default function CartDrawer() {
  const {
    cartOpen,
    closeCart,
    cartItems,
    subtotal,
    formattedSubtotal,
    currency,
    setCurrency,
    formatPrice,
    adjustQuantity,
    emptyCart,
    undoEmptyCart,
    hasUndo,
    startCheckout,
    startingCheckout,
    checkoutError,
    account,
  } = useStorefront();

  const checkoutBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (cartOpen) {
      window.setTimeout(() => {
        checkoutBtnRef.current?.focus();
      }, 100);
    }
  }, [cartOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drawer-backdrop ${cartOpen ? 'is-open' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        className={`drawer ${cartOpen ? 'is-open' : ''}`}
        data-testid="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Bag"
      >
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} aria-hidden="true" />
            <h2 className="drawer-title font-heading">Shopping Bag</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Currency selector inside cart */}
            <div className="cart-currency-switch" style={{ display: 'inline-flex', gap: '4px' }}>
              <button
                type="button"
                onClick={() => setCurrency('KWD')}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: currency === 'KWD' ? 'var(--synapse-obsidian)' : 'var(--synapse-border)',
                  background: currency === 'KWD' ? 'var(--synapse-obsidian)' : '#FFFFFF',
                  color: currency === 'KWD' ? '#FFFFFF' : 'var(--synapse-steel)',
                  cursor: 'pointer',
                }}
              >
                KWD
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: currency === 'USD' ? 'var(--synapse-obsidian)' : 'var(--synapse-border)',
                  background: currency === 'USD' ? 'var(--synapse-obsidian)' : '#FFFFFF',
                  color: currency === 'USD' ? '#FFFFFF' : 'var(--synapse-steel)',
                  cursor: 'pointer',
                }}
              >
                USD
              </button>
            </div>

            <button
              type="button"
              className="btn-icon"
              data-testid="button-close-cart"
              onClick={closeCart}
              aria-label="Close shopping bag"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Drawer Body: Line Items */}
        <div className="drawer-body">
          {cartItems.length === 0 ? (
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
                <ShoppingBag size={26} aria-hidden="true" />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Your bag is empty</h3>
              <p style={{ fontSize: '14.5px', color: 'var(--synapse-steel)', maxWidth: '280px', margin: 0 }}>
                Explore the collection to add wellness rings, audio clips, or chargers.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="btn btn-secondary"
                style={{ marginTop: '12px' }}
              >
                Browse devices
              </button>
            </div>
          ) : (
            <div className="cart-lines-list">
              {cartItems.map((line, idx) => (
                <div key={`${line.productId}-${line.variant || 'default'}-${idx}`} className="cart-line">
                  <img
                    src={line.product.image}
                    alt={line.product.name}
                    className="cart-line-img"
                    width={64}
                    height={64}
                  />

                  <div className="cart-line-info">
                    <div className="cart-line-title">{line.product.name}</div>
                    {line.variant && <div className="cart-line-variant">{line.variant}</div>}
                    <div className="cart-line-price">{formatPrice(line.product.price * line.quantity)}</div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="stepper" role="group" aria-label={`Quantity for ${line.product.name}`}>
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() => adjustQuantity(line.productId, -1, line.variant)}
                      aria-label={`Decrease quantity of ${line.product.name}`}
                    >
                      <Minus size={14} aria-hidden="true" />
                    </button>
                    <span
                      className="stepper-val"
                      data-testid={`text-quantity-${line.product.slug}`}
                      aria-live="polite"
                    >
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      className="stepper-btn"
                      data-testid={`button-quantity-plus-${line.product.slug}`}
                      onClick={() => adjustQuantity(line.productId, 1, line.variant)}
                      aria-label={`Increase quantity of ${line.product.name}`}
                    >
                      <Plus size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer: Subtotal & Checkout */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="cart-subtotal-row">
              <span>Subtotal</span>
              <span data-testid="text-cart-subtotal">{formattedSubtotal}</span>
            </div>

            <div className="cart-shipping-note">
              Free courier shipping. Taxes calculated at checkout.
            </div>

            {checkoutError && (
              <div
                style={{
                  background: 'var(--synapse-error-bg)',
                  color: 'var(--synapse-error)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  marginBottom: '14px',
                  fontWeight: 500,
                }}
              >
                {checkoutError}
              </div>
            )}

            {/* Checkout / Sign in button */}
            {account ? (
              <button
                ref={checkoutBtnRef}
                type="button"
                data-testid="button-checkout"
                onClick={() => void startCheckout()}
                disabled={startingCheckout}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <span>{startingCheckout ? 'Connecting to Stripe...' : 'Checkout with Stripe'}</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            ) : (
              <Link
                href="/login?next=%2Fcart"
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <span>Sign in to checkout</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            )}

            <div className="cart-empty-actions">
              <button
                type="button"
                onClick={emptyCart}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px 0',
                  color: 'var(--synapse-muted)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textDecoration: 'underline',
                }}
              >
                Empty bag
              </button>

              {hasUndo && (
                <button
                  type="button"
                  onClick={undoEmptyCart}
                  className="btn-link"
                  style={{ padding: '0 4px', fontSize: '13px', minHeight: '32px' }}
                >
                  <Undo2 size={13} aria-hidden="true" />
                  <span>Undo</span>
                </button>
              )}

              <span style={{ fontSize: '12px', color: 'var(--synapse-muted)' }}>
                Charged in {currency}
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
