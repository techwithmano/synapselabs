'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Heart, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react';
import Header from '@/src/components/storefront/Header';
import Footer from '@/src/components/storefront/Footer';
import CartDrawer from '@/src/components/storefront/CartDrawer';
import FavoritesDrawer from '@/src/components/storefront/FavoritesDrawer';
import SearchOverlay from '@/src/components/storefront/SearchOverlay';
import SizeGuideModal from '@/src/components/storefront/SizeGuideModal';
import Toast from '@/src/components/storefront/Toast';
import SynapseLogo from '@/src/components/SynapseLogo';
import { StorefrontProvider } from '@/src/context/StorefrontContext';

export default function BrandIdentityPage() {
  const personalityWords = [
    {
      word: 'Quiet',
      sub: 'Screen-Free Serenity',
      desc: 'Restrained, serene, distraction-free. We reject glowing touchscreens, buzzing notifications, and dopamine loops. Synapse collects vital wellness insights in total silence, keeping you immersed in your day.',
    },
    {
      word: 'Precise',
      sub: 'Geometric Clarity',
      desc: 'Calibrated, honest, and scientifically grounded. Every tolerance, dual-wavelength optical sensor placement, and metallic chamfer is designed for clear reflection and dependable wellness metrics.',
    },
    {
      word: 'Confident',
      sub: 'Enduring Materiality',
      desc: 'Unhurried and enduring. Sintered zirconia ceramics, grade 5 titanium, and 10 ATM water resistance ensure our hardware withstands years of continuous wear without degradation.',
    },
  ];

  const palette = [
    { name: 'Porcelain', hex: '#F6F5F0', role: 'Page background & matte finishes' },
    { name: 'Obsidian', hex: '#0F172A', role: 'Primary text & high-contrast buttons' },
    { name: 'Steel', hex: '#475569', role: 'Secondary body copy & captions' },
    { name: 'Cobalt', hex: '#2563EB', role: 'Interactive links, focus rings & accents' },
    { name: 'White', hex: '#FFFFFF', role: 'Card surfaces & modal backgrounds' },
  ];

  const customerJourney = [
    { step: '01', title: 'Discover & Browse', desc: 'Shopper reviews clear benefits, starting prices, and 3D ring views.' },
    { step: '02', title: 'Select Variant', desc: 'Picks ring size (US 8-11) or finish, with instant access to the Sizing Guide.' },
    { step: '03', title: '1-Click Add to Bag', desc: 'Item added immediately; slim bag drawer opens with subtotal highlighted.' },
    { step: '04', title: 'Fast Stripe Checkout', desc: 'Secure redirect to Stripe with chosen currency (KWD or USD).' },
    { step: '05', title: 'Courier Delivery & Fit', desc: 'Tracked doorstep dispatch backed by our 30-day fit guarantee.' },
  ];

  return (
    <StorefrontProvider>
      <Header />

      <main style={{ paddingBlock: '64px 96px', background: 'var(--synapse-bg)' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          {/* Back link */}
          <Link
            href="/"
            className="btn-link"
            style={{ padding: 0, marginBottom: '24px', display: 'inline-flex' }}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to store</span>
          </Link>

          {/* Intro Hero */}
          <div style={{ marginBottom: '56px' }}>
            <span className="section-eyebrow">Class Rubric &amp; Brand System</span>
            <h1 style={{ fontSize: 'clamp(32px, 4vw, 44px)', marginBottom: '16px' }}>
              Synapse Brand Identity
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--synapse-steel)', maxWidth: '640px' }}>
              The design tokens, visual hierarchy, personality pillars, and customer journey
              powering Synapse Labs.
            </p>
          </div>

          {/* Section 1: Concept & Slogan */}
          <section
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--synapse-border)',
              borderRadius: 'var(--radius-md)',
              padding: '36px',
              marginBottom: '32px',
            }}
          >
            <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>1. Concept, Purpose &amp; Slogan</h2>
            <p style={{ fontSize: '15px', color: 'var(--synapse-steel)', marginBottom: '20px' }}>
              Synapse builds screen-free hardware for knowledge workers and individuals who desire
              deep wellness awareness without notifications or digital fatigue.
            </p>

            <div
              style={{
                padding: '20px 24px',
                background: 'var(--synapse-bg)',
                borderRadius: 'var(--radius-sm)',
                borderLeft: '4px solid var(--synapse-cobalt)',
              }}
            >
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--synapse-cobalt)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Brand Slogan
              </span>
              <strong style={{ display: 'block', fontSize: '20px', color: 'var(--synapse-obsidian)', marginTop: '4px' }}>
                &ldquo;Quiet insight. Zero distraction.&rdquo;
              </strong>
            </div>
          </section>

          {/* Section 2: Logo & Wordmark */}
          <section
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--synapse-border)',
              borderRadius: 'var(--radius-md)',
              padding: '36px',
              marginBottom: '32px',
            }}
          >
            <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>2. Logo &amp; Wordmark</h2>
            <p style={{ fontSize: '15px', color: 'var(--synapse-steel)', marginBottom: '24px' }}>
              The logomark represents a stylized optical heartbeat pulse passing through a ceramic
              ring coordinate. Paired with Space Grotesk lettering.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '32px',
                padding: '28px',
                background: 'var(--synapse-bg)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <SynapseLogo size={42} showWordmark={true} />
            </div>
          </section>

          {/* Section 3: Three Personality Words */}
          <section
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--synapse-border)',
              borderRadius: 'var(--radius-md)',
              padding: '36px',
              marginBottom: '32px',
            }}
          >
            <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>3. The Three Personality Pillars</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {personalityWords.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '24px',
                    background: 'var(--synapse-bg)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--synapse-border-light)',
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '20px', color: 'var(--synapse-obsidian)' }}>
                    {item.word}
                  </strong>
                  <span style={{ display: 'block', fontSize: '13px', color: 'var(--synapse-cobalt)', fontWeight: 600, margin: '4px 0 10px' }}>
                    {item.sub}
                  </span>
                  <p style={{ fontSize: '14px', color: 'var(--synapse-steel)', margin: 0, lineHeight: 1.55 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Color Palette & Typography */}
          <section
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--synapse-border)',
              borderRadius: 'var(--radius-md)',
              padding: '36px',
              marginBottom: '32px',
            }}
          >
            <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>4. Curated Color Palette &amp; Typography</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              {palette.map((color) => (
                <div
                  key={color.name}
                  style={{
                    border: '1px solid var(--synapse-border)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ height: '70px', background: color.hex, borderBottom: '1px solid rgba(0,0,0,0.06)' }} />
                  <div style={{ padding: '12px' }}>
                    <strong style={{ display: 'block', fontSize: '14px' }}>{color.name}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--synapse-muted)', fontFamily: 'monospace' }}>
                      {color.hex}
                    </span>
                    <span style={{ display: 'block', fontSize: '12px', color: 'var(--synapse-steel)', marginTop: '4px' }}>
                      {color.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>Typography System</h3>
            <p style={{ fontSize: '14.5px', color: 'var(--synapse-steel)', margin: 0 }}>
              <strong>Headings:</strong> Space Grotesk (geometric, contemporary, precise).<br />
              <strong>Body:</strong> Inter (16px base, 1.6 line height for effortless readability).
            </p>
          </section>

          {/* Section 5: Customer Journey Diagram */}
          <section
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--synapse-border)',
              borderRadius: 'var(--radius-md)',
              padding: '36px',
              marginBottom: '32px',
            }}
          >
            <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>5. Customer Purchase Journey</h2>
            <p style={{ fontSize: '15px', color: 'var(--synapse-steel)', marginBottom: '24px' }}>
              Target shopper journey engineered for 2 to 3 step purchase clarity with zero dark patterns.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {customerJourney.map((step) => (
                <div
                  key={step.step}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '16px',
                    background: 'var(--synapse-bg)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      color: 'var(--synapse-cobalt)',
                      fontSize: '16px',
                      marginTop: '2px',
                    }}
                  >
                    {step.step}
                  </span>
                  <div>
                    <strong style={{ fontSize: '15px', display: 'block', color: 'var(--synapse-obsidian)' }}>
                      {step.title}
                    </strong>
                    <span style={{ fontSize: '13.5px', color: 'var(--synapse-steel)' }}>{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: Design Tokens Reference */}
          <section
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--synapse-border)',
              borderRadius: 'var(--radius-md)',
              padding: '36px',
            }}
          >
            <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>6. Design Tokens Table</h2>
            <table className="size-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Token</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Colors</td>
                  <td><code>--synapse-bg</code></td>
                  <td>#F6F5F0 (Porcelain)</td>
                </tr>
                <tr>
                  <td>Colors</td>
                  <td><code>--synapse-obsidian</code></td>
                  <td>#0F172A (Obsidian Slate)</td>
                </tr>
                <tr>
                  <td>Colors</td>
                  <td><code>--synapse-cobalt</code></td>
                  <td>#2563EB (Cobalt Blue)</td>
                </tr>
                <tr>
                  <td>Radius</td>
                  <td><code>--radius-sm / md / lg</code></td>
                  <td>8px / 16px / 24px</td>
                </tr>
                <tr>
                  <td>Grid</td>
                  <td><code>--space-1 .. 24</code></td>
                  <td>8px baseline rhythm (4, 8, 16, 24, 32, 48, 96px)</td>
                </tr>
                <tr>
                  <td>Interactive</td>
                  <td>Touch Target</td>
                  <td>Minimum 44px on all links &amp; buttons</td>
                </tr>
              </tbody>
            </table>
          </section>
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
