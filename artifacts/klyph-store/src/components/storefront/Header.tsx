'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Menu, Search, ShoppingBag, UserRound, X, LogOut } from 'lucide-react';
import SynapseLogo from '@/src/components/SynapseLogo';
import { useStorefront } from '@/src/context/StorefrontContext';

function getInitials(name?: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Header() {
  const {
    account,
    cartCount,
    openCart,
    favorites,
    openFavorites,
    openSearch,
    mobileMenuOpen,
    setMobileMenuOpen,
    signOut,
    signingOut,
  } = useStorefront();

  return (
    <header className="site-header" role="banner">
      <div className="container site-header-inner">
        {/* Brand Logo */}
        <Link className="brand-lockup" href="/" aria-label="Synapse Labs home">
          <SynapseLogo size={26} showWordmark={true} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="main-nav desktop-nav" aria-label="Main navigation">
          <a className="nav-link" href="/#devices">
            Shop
          </a>
          <a className="nav-link" href="/#why-synapse">
            Why Synapse
          </a>
          <Link className="nav-link" href="/technology">
            Technology
          </Link>
          <Link className="nav-link" href="/support">
            Support
          </Link>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Search trigger */}
          <button
            type="button"
            className="btn-icon desktop-only"
            onClick={openSearch}
            aria-label="Search collection"
          >
            <Search size={19} aria-hidden="true" />
          </button>

          {/* Favorites trigger */}
          <button
            type="button"
            className="btn-icon desktop-only"
            onClick={openFavorites}
            aria-label={`Saved items (${favorites.length})`}
          >
            <Heart size={19} aria-hidden="true" />
            {favorites.length > 0 && (
              <span className="badge-count" aria-hidden="true">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Account Icon / Initials */}
          {account ? (
            <div className="account-dropdown desktop-only" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Link
                href="/orders"
                className="account-avatar"
                aria-label={`Account orders for ${account.name}`}
                title="My orders"
              >
                {getInitials(account.name)}
              </Link>
              <Link href="/orders" className="nav-link desktop-only" style={{ fontSize: '13.5px', padding: '0 4px' }}>
                My orders
              </Link>
              <button
                type="button"
                onClick={() => void signOut()}
                disabled={signingOut}
                className="btn-icon desktop-only"
                style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px' }}
                aria-label="Log out"
                title="Log out"
              >
                <LogOut size={16} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn-link desktop-only"
              style={{ fontSize: '14px', padding: '0 8px', minHeight: '44px' }}
              aria-label="Sign in"
            >
              <UserRound size={17} aria-hidden="true" style={{ marginRight: '4px' }} />
              <span>Sign in</span>
            </Link>
          )}

          {/* Bag trigger */}
          <button
            type="button"
            className="btn-icon"
            onClick={openCart}
            aria-label={`Shopping bag (${cartCount} items)`}
          >
            <ShoppingBag size={20} aria-hidden="true" />
            {cartCount > 0 && (
              <span className="badge-count" aria-hidden="true">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="btn-icon mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-drawer"
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            bottom: 0,
            background: '#FFFFFF',
            zIndex: 90,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflowY: 'auto',
          }}
        >
          <a
            href="/#devices"
            className="nav-link"
            style={{ fontSize: '18px', fontWeight: 600 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Shop Collection
          </a>
          <a
            href="/#why-synapse"
            className="nav-link"
            style={{ fontSize: '18px', fontWeight: 600 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Why Synapse
          </a>
          <Link
            href="/technology"
            className="nav-link"
            style={{ fontSize: '18px', fontWeight: 600 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Technology
          </Link>
          <Link
            href="/support"
            className="nav-link"
            style={{ fontSize: '18px', fontWeight: 600 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Support
          </Link>
          <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '8px 0' }} />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setMobileMenuOpen(false);
              openSearch();
            }}
            style={{ justifyContent: 'flex-start' }}
          >
            <Search size={18} aria-hidden="true" /> Search
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setMobileMenuOpen(false);
              openFavorites();
            }}
            style={{ justifyContent: 'flex-start' }}
          >
            <Heart size={18} aria-hidden="true" /> Saved Items ({favorites.length})
          </button>
          {account ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
              <Link
                href="/orders"
                className="btn btn-secondary"
                onClick={() => setMobileMenuOpen(false)}
                style={{ justifyContent: 'flex-start' }}
              >
                My orders
              </Link>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setMobileMenuOpen(false);
                  void signOut();
                }}
                style={{ justifyContent: 'flex-start', color: '#DC2626' }}
              >
                <LogOut size={18} aria-hidden="true" /> Log out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn btn-primary"
              onClick={() => setMobileMenuOpen(false)}
              style={{ marginTop: '12px' }}
            >
              Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
