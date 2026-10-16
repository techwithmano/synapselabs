'use client';

import React from 'react';
import Link from 'next/link';
import SynapseLogo from '@/src/components/SynapseLogo';
import { SUPPORT_EMAIL } from '@/src/lib/constants';

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand info */}
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Link className="brand-lockup" href="/" aria-label="Synapse Labs home">
              <SynapseLogo size={24} showWordmark={true} />
            </Link>
            <p style={{ fontSize: '14px', maxWidth: '300px', margin: 0, color: 'var(--synapse-steel)' }}>
              Thoughtful smart hardware designed for everyday health and quiet clarity.
            </p>
            <p style={{ fontSize: '13px', margin: 0, color: 'var(--synapse-muted)' }}>
              Questions? Email us at{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                style={{ color: 'var(--synapse-cobalt)', fontWeight: 600, textDecoration: 'underline' }}
              >
                {SUPPORT_EMAIL}
              </a>
            </p>
          </div>

          {/* Col 1: Shop */}
          <div className="footer-col">
            <h4>Shop</h4>
            <ul className="footer-links">
              <li>
                <a href="/#devices">Synapse Core Ring</a>
              </li>
              <li>
                <a href="/#devices">Aura Spatial Clip</a>
              </li>
              <li>
                <a href="/#devices">NeuroDock Slate</a>
              </li>
              <li>
                <Link href="/technology">How it works</Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Support */}
          <div className="footer-col">
            <h4>Support</h4>
            <ul className="footer-links">
              <li>
                <Link href="/support">Help &amp; Sizing</Link>
              </li>
              <li>
                <Link href="/support#shipping">Shipping &amp; Delivery</Link>
              </li>
              <li>
                <Link href="/support#returns">30-Day Returns</Link>
              </li>
              <li>
                <Link href="/orders">Order status</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Legal */}
          <div className="footer-col">
            <h4>Company &amp; Legal</h4>
            <ul className="footer-links">
              <li>
                <Link href="/brand">Brand Identity</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/support#warranty">2-Year Warranty</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Synapse Labs. All rights reserved.</span>
          <span>Wellness insights only. Not intended for medical diagnosis or treatment.</span>
        </div>
      </div>
    </footer>
  );
}
