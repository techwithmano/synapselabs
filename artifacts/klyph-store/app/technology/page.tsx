'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  AudioLines,
  BatteryCharging,
  Fingerprint,
  Heart,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import Header from '@/src/components/storefront/Header';
import Footer from '@/src/components/storefront/Footer';
import CartDrawer from '@/src/components/storefront/CartDrawer';
import FavoritesDrawer from '@/src/components/storefront/FavoritesDrawer';
import SearchOverlay from '@/src/components/storefront/SearchOverlay';
import SizeGuideModal from '@/src/components/storefront/SizeGuideModal';
import Toast from '@/src/components/storefront/Toast';
import { StorefrontProvider } from '@/src/context/StorefrontContext';

export default function TechnologyPage() {
  const [activeTab, setActiveTab] = useState<'biometrics' | 'audio' | 'power'>('biometrics');

  return (
    <StorefrontProvider>
      <Header />

      <main style={{ paddingBlock: '64px 96px', background: 'var(--synapse-bg)' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          {/* Page Intro */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--synapse-cobalt)',
                background: 'var(--synapse-cobalt-light)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                marginBottom: '16px',
              }}
            >
              Illustration using sample data
            </span>
            <h1 style={{ fontSize: 'clamp(32px, 4vw, 44px)', marginBottom: '16px' }}>
              How Synapse reads your pulse
            </h1>
            <p style={{ fontSize: '17px', color: 'var(--synapse-steel)', maxWidth: '640px', marginInline: 'auto' }}>
              Green and infrared optical sensors shine through your skin. As your heart beats, blood
              volume changes how light bounces back, creating a clean wave that maps your pulse and
              rest.
            </p>
          </div>

          {/* Technology Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '32px',
            }}
            role="tablist"
            aria-label="Technology channels"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'biometrics'}
              onClick={() => setActiveTab('biometrics')}
              className={`btn ${activeTab === 'biometrics' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ minHeight: '44px', padding: '8px 20px', fontSize: '14px' }}
            >
              <Fingerprint size={16} aria-hidden="true" />
              <span>01 / Optical Pulse Wave</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'audio'}
              onClick={() => setActiveTab('audio')}
              className={`btn ${activeTab === 'audio' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ minHeight: '44px', padding: '8px 20px', fontSize: '14px' }}
            >
              <AudioLines size={16} aria-hidden="true" />
              <span>02 / Spatial Acoustic Conduction</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'power'}
              onClick={() => setActiveTab('power')}
              className={`btn ${activeTab === 'power' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ minHeight: '44px', padding: '8px 20px', fontSize: '14px' }}
            >
              <BatteryCharging size={16} aria-hidden="true" />
              <span>03 / Inductive Power Transfer</span>
            </button>
          </div>

          {/* Interactive Screen Display */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--synapse-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              boxShadow: 'var(--shadow-card)',
              marginBottom: '48px',
            }}
          >
            {activeTab === 'biometrics' && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--synapse-border-light)',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={18} style={{ color: 'var(--synapse-cobalt)' }} />
                    <strong style={{ fontSize: '15px' }}>Optical PPG Reflection (Sample Data)</strong>
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--synapse-muted)' }}>
                    Resting pulse: ~68 BPM &bull; Rhythm: Regular
                  </span>
                </div>

                {/* Interactive Waveform SVG */}
                <div
                  style={{
                    background: '#FAFAF8',
                    border: '1px solid var(--synapse-border)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    marginBottom: '24px',
                  }}
                >
                  <svg
                    viewBox="0 0 1000 200"
                    preserveAspectRatio="none"
                    aria-label="Sample optical pulse waveform"
                    style={{ width: '100%', height: '180px', display: 'block' }}
                  >
                    <defs>
                      <pattern id="techGridPattern" width="40" height="20" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="20" x2="40" y2="20" stroke="rgba(15, 23, 42, 0.04)" strokeWidth="1" strokeDasharray="2 3" />
                        <line x1="40" y1="0" x2="40" y2="20" stroke="rgba(15, 23, 42, 0.04)" strokeWidth="1" strokeDasharray="2 3" />
                      </pattern>
                      <linearGradient id="techWaveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
                        <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <rect width="1000" height="200" fill="url(#techGridPattern)" />

                    {/* Area Fill */}
                    <path
                      d="M 0,145 L 18,145 C 32,145 44,75 55,45 C 68,45 82,88 96,105 C 104,103 112,86 122,86 C 140,88 158,145 180,145 L 200,145 L 218,145 C 232,145 244,75 255,45 C 68,45 282,88 296,105 C 304,103 312,86 322,86 C 340,88 358,145 380,145 L 400,145 L 418,145 C 432,145 444,75 455,45 C 468,45 482,88 496,105 C 504,103 512,86 522,86 C 540,88 558,145 580,145 L 600,145 L 618,145 C 632,145 644,75 655,45 C 668,45 682,88 696,105 C 704,103 712,86 722,86 C 740,88 758,145 780,145 L 800,145 L 818,145 C 832,145 844,75 855,45 C 868,45 882,88 896,105 C 904,103 912,86 922,86 C 940,88 958,145 980,145 L 1000,145 L 1000,200 L 0,200 Z"
                      fill="url(#techWaveGrad)"
                    />

                    {/* Primary Curve */}
                    <path
                      d="M 0,145 L 18,145 C 32,145 44,75 55,45 C 68,45 82,88 96,105 C 104,103 112,86 122,86 C 140,88 158,145 180,145 L 200,145 L 218,145 C 232,145 244,75 255,45 C 268,45 282,88 296,105 C 304,103 312,86 322,86 C 340,88 358,145 380,145 L 400,145 L 418,145 C 432,145 444,75 455,45 C 468,45 482,88 496,105 C 504,103 512,86 522,86 C 540,88 558,145 580,145 L 600,145 L 618,145 C 632,145 644,75 655,45 C 668,45 682,88 696,105 C 704,103 712,86 722,86 C 740,88 758,145 780,145 L 800,145 L 818,145 C 832,145 844,75 855,45 C 868,45 882,88 896,105 C 904,103 912,86 922,86 C 940,88 958,145 980,145 L 1000,145"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Pulse Peak Indicator */}
                    <circle cx="455" cy="45" r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                    <text x="455" y="30" textAnchor="middle" fill="#0F172A" fontSize="11" fontWeight="600">
                      Heartbeat Peak
                    </text>
                  </svg>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  <div style={{ padding: '16px', background: 'var(--synapse-bg)', borderRadius: 'var(--radius-sm)' }}>
                    <strong style={{ display: 'block', fontSize: '14.5px', marginBottom: '6px' }}>
                      Dual-Wavelength LEDs
                    </strong>
                    <span style={{ fontSize: '13.5px', color: 'var(--synapse-steel)' }}>
                      Emits gentle green light to monitor resting heart rate during everyday movement,
                      and infrared light during sleep.
                    </span>
                  </div>

                  <div style={{ padding: '16px', background: 'var(--synapse-bg)', borderRadius: 'var(--radius-sm)' }}>
                    <strong style={{ display: 'block', fontSize: '14.5px', marginBottom: '6px' }}>
                      Skin Contact Placement
                    </strong>
                    <span style={{ fontSize: '13.5px', color: 'var(--synapse-steel)' }}>
                      Because the ring sits securely against the palm side of the finger, sensor
                      readings have minimal motion artifacts compared to a loose wrist watch.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'audio' && (
              <div>
                <h3 style={{ marginBottom: '12px' }}>Acoustic Conduction without Ear Fatigue</h3>
                <p style={{ fontSize: '15px', color: 'var(--synapse-steel)', lineHeight: 1.6 }}>
                  Unlike conventional earbuds that wedge inside the canal and trap moisture, the Aura
                  Spatial Clip attaches to the helix of the outer ear. It conducts crisp sound waves
                  directly toward your eardrum while leaving your ear open to ambient conversation and
                  traffic.
                </p>
                <div style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
                  <div style={{ padding: '12px 18px', background: 'var(--synapse-bg)', borderRadius: 'var(--radius-sm)', fontSize: '13.5px' }}>
                    <strong>Zero ear canal pressure</strong>
                  </div>
                  <div style={{ padding: '12px 18px', background: 'var(--synapse-bg)', borderRadius: 'var(--radius-sm)', fontSize: '13.5px' }}>
                    <strong>Dual beamforming microphones</strong>
                  </div>
                  <div style={{ padding: '12px 18px', background: 'var(--synapse-bg)', borderRadius: 'var(--radius-sm)', fontSize: '13.5px' }}>
                    <strong>14 hours continuous battery</strong>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'power' && (
              <div>
                <h3 style={{ marginBottom: '12px' }}>Magnetic Inductive Resonance</h3>
                <p style={{ fontSize: '15px', color: 'var(--synapse-steel)', lineHeight: 1.6 }}>
                  The NeuroDock Slate uses internal magnetic resonance coils paired with a ceramic top
                  plate. Drop the Core Ring or Aura Clip onto the surface in any orientation—magnetic
                  guides align the hardware automatically for an efficient 20-minute rapid recharge.
                </p>
                <div style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
                  <div style={{ padding: '12px 18px', background: 'var(--synapse-bg)', borderRadius: 'var(--radius-sm)', fontSize: '13.5px' }}>
                    <strong>Scratch-proof ceramic surface</strong>
                  </div>
                  <div style={{ padding: '12px 18px', background: 'var(--synapse-bg)', borderRadius: 'var(--radius-sm)', fontSize: '13.5px' }}>
                    <strong>Auto foreign object detection</strong>
                  </div>
                  <div style={{ padding: '12px 18px', background: 'var(--synapse-bg)', borderRadius: 'var(--radius-sm)', fontSize: '13.5px' }}>
                    <strong>Universal USB-C power delivery</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CTA at end */}
          <div style={{ textAlign: 'center', padding: '32px 20px', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--synapse-border)' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Ready to wear the Core Ring?</h2>
            <p style={{ fontSize: '15px', color: 'var(--synapse-steel)', maxWidth: '480px', marginInline: 'auto', marginBottom: '24px' }}>
              Enjoy 7 days of battery, full water resistance, and private sleep insights with zero monthly fees.
            </p>
            <Link href="/#devices" className="btn btn-primary" style={{ minWidth: '220px' }}>
              <span>Shop the Core Ring</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
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
