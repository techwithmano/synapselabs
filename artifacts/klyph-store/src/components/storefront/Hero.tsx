'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, CheckCircle2, RotateCw, ShieldCheck, Truck } from 'lucide-react';
import { useStorefront } from '@/src/context/StorefrontContext';

const HeroCanvas3D = dynamic(() => import('@/src/components/HeroCanvas3D'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '360px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--synapse-muted)',
        fontSize: '14px',
      }}
    >
      Loading 3D preview...
    </div>
  ),
});

export default function Hero() {
  const { formatPrice, currency } = useStorefront();
  // Minimum starting price in catalog is Neurodock (14 KWD / $46 USD) or Core Ring (18 KWD / $59 USD)
  const startingPrice = formatPrice(14);

  return (
    <section className="hero-section" aria-label="Introduction">
      <div className="container hero-grid">
        {/* Left: Copy */}
        <div className="hero-copy">
          <span className="hero-eyebrow">
            <span
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--synapse-cobalt)',
              }}
            />
            Continuous Health Tracking
          </span>

          <h1 className="hero-headline">Quiet insight. Zero distraction.</h1>

          <p className="hero-lead">
            A smart ring that tracks your sleep, heart rate, and recovery without a screen or
            buzzing. Your health data stays private on your device.
          </p>

          <div className="hero-cta-group">
            <a href="#devices" className="btn btn-primary">
              <span>Shop the Core Ring</span>
              <ArrowRight size={16} aria-hidden="true" />
            </a>

            <Link href="/technology" className="btn-link">
              <span>See how it works</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>

            <span className="hero-price-pill">From {startingPrice}</span>
          </div>

          {/* Single row of 3 trust points */}
          <div className="hero-trust-row">
            <div className="trust-item">
              <Truck size={17} aria-hidden="true" />
              <span>Free shipping</span>
            </div>
            <div className="trust-item">
              <CheckCircle2 size={17} aria-hidden="true" />
              <span>30-day fit guarantee</span>
            </div>
            <div className="trust-item">
              <ShieldCheck size={17} aria-hidden="true" />
              <span>2-year warranty</span>
            </div>
          </div>
        </div>

        {/* Right / Below on mobile: Interactive 3D Ring */}
        <div className="hero-visual-wrap" aria-label="Interactive 3D model of Synapse Core Ring">
          <div style={{ width: '100%', height: '100%', minHeight: '340px' }}>
            <HeroCanvas3D />
          </div>
          <div className="hero-visual-hint" aria-hidden="true">
            <RotateCw size={13} style={{ display: 'inline', marginRight: '5px' }} />
            Drag to rotate
          </div>
        </div>
      </div>
    </section>
  );
}
