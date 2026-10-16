'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Lock, Mail, ShieldCheck } from 'lucide-react';
import Header from '@/src/components/storefront/Header';
import Footer from '@/src/components/storefront/Footer';
import CartDrawer from '@/src/components/storefront/CartDrawer';
import FavoritesDrawer from '@/src/components/storefront/FavoritesDrawer';
import SearchOverlay from '@/src/components/storefront/SearchOverlay';
import SizeGuideModal from '@/src/components/storefront/SizeGuideModal';
import Toast from '@/src/components/storefront/Toast';
import { StorefrontProvider } from '@/src/context/StorefrontContext';
import { SUPPORT_EMAIL } from '@/src/lib/constants';

export default function PrivacyPolicyPage() {
  return (
    <StorefrontProvider>
      <Header />

      <main style={{ paddingBlock: '64px 96px', background: 'var(--synapse-bg)' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          {/* Back link */}
          <Link
            href="/"
            className="btn-link"
            style={{ padding: 0, marginBottom: '24px', display: 'inline-flex' }}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to store</span>
          </Link>

          {/* Intro */}
          <div style={{ marginBottom: '48px' }}>
            <span className="section-eyebrow">Data Protection</span>
            <h1 style={{ fontSize: 'clamp(32px, 4vw, 44px)', marginBottom: '16px' }}>
              Privacy Policy
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--synapse-steel)', maxWidth: '640px' }}>
              Your wellness information belongs exclusively to you. We design hardware that keeps your
              health metrics private, secure, and under your control.
            </p>
          </div>

          {/* 3 Core Guarantees */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
              marginBottom: '48px',
            }}
          >
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--synapse-border)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
              }}
            >
              <Lock size={22} style={{ color: 'var(--synapse-cobalt)', marginBottom: '12px' }} />
              <strong style={{ display: 'block', fontSize: '16px', marginBottom: '6px' }}>
                On-Device Processing
              </strong>
              <p style={{ fontSize: '14px', color: 'var(--synapse-steel)', margin: 0, lineHeight: 1.55 }}>
                Sleep stages and heart rate calculations are calculated locally on your phone and device.
              </p>
            </div>

            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--synapse-border)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
              }}
            >
              <ShieldCheck size={22} style={{ color: 'var(--synapse-cobalt)', marginBottom: '12px' }} />
              <strong style={{ display: 'block', fontSize: '16px', marginBottom: '6px' }}>
                Zero Data Monetization
              </strong>
              <p style={{ fontSize: '14px', color: 'var(--synapse-steel)', margin: 0, lineHeight: 1.55 }}>
                We never sell, rent, or broker your personal health information to advertisers or insurers.
              </p>
            </div>

            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--synapse-border)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
              }}
            >
              <CheckCircle2 size={22} style={{ color: 'var(--synapse-cobalt)', marginBottom: '12px' }} />
              <strong style={{ display: 'block', fontSize: '16px', marginBottom: '6px' }}>
                No Paywalls
              </strong>
              <p style={{ fontSize: '14px', color: 'var(--synapse-steel)', margin: 0, lineHeight: 1.55 }}>
                Your data is never held behind recurring subscription tiers or premium paywalls.
              </p>
            </div>
          </div>

          {/* Policy Articles */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--synapse-border)',
              borderRadius: 'var(--radius-md)',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>1. Information We Collect</h2>
              <p style={{ fontSize: '15px', color: 'var(--synapse-steel)', lineHeight: 1.6, margin: 0 }}>
                When you make a purchase on our store, we collect basic order information (such as your
                name, delivery address, email, and payment receipt via Stripe). We do not store full credit
                card numbers on our servers.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>2. How Wellness Data is Handled</h2>
              <p style={{ fontSize: '15px', color: 'var(--synapse-steel)', lineHeight: 1.6, margin: 0 }}>
                Sensor measurements from the Core Ring (including optical pulse waves and skin temperature
                variations) are paired encrypted via Bluetooth directly with your phone. You retain the
                right to export or delete your health records at any time.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>3. Third-Party Sharing</h2>
              <p style={{ fontSize: '15px', color: 'var(--synapse-steel)', lineHeight: 1.6, margin: 0 }}>
                We only share necessary transactional data with vetted logistics partners to deliver your
                physical order and process payment securely via Stripe. We do not provide user data to
                data brokers or advertising exchanges.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>4. Contact our Privacy Team</h2>
              <p style={{ fontSize: '15px', color: 'var(--synapse-steel)', lineHeight: 1.6, margin: 0 }}>
                For data access requests or questions regarding our privacy practices, contact us at{' '}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  style={{ color: 'var(--synapse-cobalt)', fontWeight: 600, textDecoration: 'underline' }}
                >
                  {SUPPORT_EMAIL}
                </a>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
      <FavoritesDrawer />
      <SearchOverlay />
      <SizeGuideModal />
      <Toast />
    </StorefrontProvider>
  );
}
