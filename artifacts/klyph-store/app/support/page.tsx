'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Ruler, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import Header from '@/src/components/storefront/Header';
import Footer from '@/src/components/storefront/Footer';
import CartDrawer from '@/src/components/storefront/CartDrawer';
import FavoritesDrawer from '@/src/components/storefront/FavoritesDrawer';
import SearchOverlay from '@/src/components/storefront/SearchOverlay';
import SizeGuideModal from '@/src/components/storefront/SizeGuideModal';
import Toast from '@/src/components/storefront/Toast';
import { StorefrontProvider } from '@/src/context/StorefrontContext';
import { SIZING_DATA, SUPPORT_EMAIL } from '@/src/lib/constants';

const SUPPORT_FAQS = [
  {
    q: 'How long does the battery last on the Core Ring?',
    a: 'The Synapse Core Ring lasts up to 7 full days of continuous day and night tracking. Placing it on the magnetic dock for 20 minutes brings it back to full charge.',
  },
  {
    q: 'Can I wear the Core Ring while swimming or showering?',
    a: 'Yes. The ring is rated for 10 ATM (100 meters) water resistance. You can wear it while swimming, showering, washing hands, and engaging in water sports.',
  },
  {
    q: 'Are there any recurring monthly subscriptions?',
    a: 'No. All sleep tracking, heart rate insights, recovery metrics, and software updates are included with your hardware purchase with zero monthly fees.',
  },
  {
    q: 'What should I do if my ring size feels too tight or loose?',
    a: 'We offer a 30-day fit guarantee. If your ring is uncomfortable, contact us and we will provide a free size replacement.',
  },
  {
    q: 'How does the Aura Spatial Clip work without going into the ear?',
    a: 'The Aura Clip attaches gently to your outer ear, conducting clear sound waves directly toward your eardrum while leaving your ear open to your surroundings.',
  },
];

export default function SupportPage() {
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

          {/* Page Intro */}
          <div style={{ marginBottom: '48px' }}>
            <span className="section-eyebrow">Customer Support</span>
            <h1 style={{ fontSize: 'clamp(32px, 4vw, 44px)', marginBottom: '16px' }}>
              Help, Sizing &amp; Care
            </h1>
            <p style={{ fontSize: '17px', color: 'var(--synapse-steel)', maxWidth: '640px' }}>
              Find ring sizing measurements, shipping timelines, warranty coverage, and quick answers
              to common questions.
            </p>
          </div>

          {/* Quick Jump Bar */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '48px',
              paddingBottom: '24px',
              borderBottom: '1px solid var(--synapse-border)',
            }}
          >
            <a href="#sizing" className="btn btn-secondary" style={{ minHeight: '40px', padding: '6px 16px', fontSize: '13.5px' }}>
              <Ruler size={15} aria-hidden="true" /> Sizing chart
            </a>
            <a href="#shipping" className="btn btn-secondary" style={{ minHeight: '40px', padding: '6px 16px', fontSize: '13.5px' }}>
              <Truck size={15} aria-hidden="true" /> Shipping
            </a>
            <a href="#returns" className="btn btn-secondary" style={{ minHeight: '40px', padding: '6px 16px', fontSize: '13.5px' }}>
              <RotateCcw size={15} aria-hidden="true" /> 30-Day returns
            </a>
            <a href="#warranty" className="btn btn-secondary" style={{ minHeight: '40px', padding: '6px 16px', fontSize: '13.5px' }}>
              <ShieldCheck size={15} aria-hidden="true" /> 2-Year warranty
            </a>
            <a href="#contact" className="btn btn-secondary" style={{ minHeight: '40px', padding: '6px 16px', fontSize: '13.5px' }}>
              <Mail size={15} aria-hidden="true" /> Email us
            </a>
          </div>

          {/* Section: Sizing Chart */}
          <section
            id="sizing"
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--synapse-border)',
              borderRadius: 'var(--radius-md)',
              padding: '32px',
              marginBottom: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Ruler size={22} style={{ color: 'var(--synapse-cobalt)' }} />
              <h2 style={{ fontSize: '22px', margin: 0 }}>Ring Sizing Chart</h2>
            </div>
            <p style={{ fontSize: '15px', color: 'var(--synapse-steel)', marginBottom: '20px' }}>
              For optimal heart rate and sleep tracking, choose a size that fits snugly over your knuckle
              and rests comfortably on your index, middle, or ring finger.
            </p>

            <table className="size-table">
              <thead>
                <tr>
                  <th>US Size</th>
                  <th>Inner Diameter</th>
                  <th>Finger Circumference</th>
                </tr>
              </thead>
              <tbody>
                {SIZING_DATA.map((row) => (
                  <tr key={row.size}>
                    <td>
                      <strong>{row.size}</strong>
                    </td>
                    <td>{row.diameter} mm</td>
                    <td>{row.circumference} mm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Section: Shipping & Delivery */}
          <section
            id="shipping"
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--synapse-border)',
              borderRadius: 'var(--radius-md)',
              padding: '32px',
              marginBottom: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Truck size={22} style={{ color: 'var(--synapse-cobalt)' }} />
              <h2 style={{ fontSize: '22px', margin: 0 }}>Shipping &amp; Delivery</h2>
            </div>
            <p style={{ fontSize: '15px', color: 'var(--synapse-steel)', lineHeight: 1.6, margin: 0 }}>
              All orders ship with free tracked courier delivery. Orders are dispatched within 24 hours of
              placement. Delivery takes 2 to 4 business days locally in Kuwait and the GCC region, and 4
              to 7 business days worldwide. Tracking links are provided via email as soon as your package
              is in transit.
            </p>
          </section>

          {/* Section: Returns & 30-Day Fit Guarantee */}
          <section
            id="returns"
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--synapse-border)',
              borderRadius: 'var(--radius-md)',
              padding: '32px',
              marginBottom: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <RotateCcw size={22} style={{ color: 'var(--synapse-cobalt)' }} />
              <h2 style={{ fontSize: '22px', margin: 0 }}>30-Day Fit Guarantee &amp; Returns</h2>
            </div>
            <p style={{ fontSize: '15px', color: 'var(--synapse-steel)', lineHeight: 1.6, margin: 0 }}>
              Wear your ring for up to 30 days. If the fit isn&apos;t completely comfortable, send us an email
              at {SUPPORT_EMAIL} and we will exchange it for your preferred size with free return shipping,
              or issue a full refund upon receipt of the device.
            </p>
          </section>

          {/* Section: 2-Year Warranty */}
          <section
            id="warranty"
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--synapse-border)',
              borderRadius: 'var(--radius-md)',
              padding: '32px',
              marginBottom: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <ShieldCheck size={22} style={{ color: 'var(--synapse-cobalt)' }} />
              <h2 style={{ fontSize: '22px', margin: 0 }}>2-Year Hardware Warranty</h2>
            </div>
            <p style={{ fontSize: '15px', color: 'var(--synapse-steel)', lineHeight: 1.6, margin: 0 }}>
              Every Synapse device includes a full two-year limited warranty against manufacturing defects,
              sensor irregularities, and premature battery wear. If your hardware fails under normal daily
              use, we will repair or replace it at no cost.
            </p>
          </section>

          {/* Section: FAQ */}
          <section
            id="faq"
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--synapse-border)',
              borderRadius: 'var(--radius-md)',
              padding: '32px',
              marginBottom: '32px',
            }}
          >
            <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {SUPPORT_FAQS.map((faq, i) => (
                <div key={i} style={{ borderBottom: '1px solid var(--synapse-border-light)', paddingBottom: '16px' }}>
                  <h3 style={{ fontSize: '16.5px', marginBottom: '6px' }}>{faq.q}</h3>
                  <p style={{ fontSize: '14.5px', color: 'var(--synapse-steel)', margin: 0, lineHeight: 1.55 }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Email Us (Replaced non-functional contact form) */}
          <section
            id="contact"
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--synapse-border)',
              borderRadius: 'var(--radius-md)',
              padding: '40px 32px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'var(--synapse-cobalt-light)',
                color: 'var(--synapse-cobalt)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginInline: 'auto',
                marginBottom: '16px',
              }}
            >
              <Mail size={24} aria-hidden="true" />
            </div>

            <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Have a question? We are here to help.</h2>
            <p style={{ fontSize: '15px', color: 'var(--synapse-steel)', maxWidth: '480px', marginInline: 'auto', marginBottom: '24px' }}>
              Reach out directly to our team for order questions, sizing advice, or warranty claims.
            </p>

            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="btn btn-primary"
              style={{ minWidth: '200px' }}
            >
              <Mail size={16} aria-hidden="true" />
              <span>Email {SUPPORT_EMAIL}</span>
            </a>
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
