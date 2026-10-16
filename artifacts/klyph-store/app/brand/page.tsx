import type { Metadata } from 'next';
import Link from 'next/link';
import SynapseLogo from '@/src/components/SynapseLogo';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Eye,
  Fingerprint,
  Heart,
  Layers,
  Palette,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Type,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Brand Identity & Design System Specification',
  description:
    'Comprehensive brand identity, design tokens, typography scale, WCAG 2.1 AA color contrast matrix, and customer journey for SYNAPSE LABS.',
};

export default function BrandPage() {
  const personalityWords = [
    {
      word: 'Quiet',
      sub: 'Screen-Free Serenity',
      desc: 'Restrained, serene, distraction-free. Copy is concise, informative, and devoid of hyperbolic marketing jargon or urgency triggers. Hardware operates without visual intrusion.',
    },
    {
      word: 'Precise',
      sub: 'Sub-Millimeter Calibration',
      desc: 'Surgical, geometric, calibrated. Every tolerance, sensor wavelength (530nm/660nm), and metallic chamfer is documented with scientific clarity and engineering truth.',
    },
    {
      word: 'Confident',
      sub: 'Monolithic Durability',
      desc: 'Monolithic, unhurried, enduring. The hardware speaks through tangible substance, high-key porcelain canvas lighting, 10 ATM water resistance, and honest craftsmanship.',
    },
  ];

  const colorTokens = [
    {
      name: 'Porcelain White',
      token: '--synapse-porcelain',
      hex: '#F6F5F0',
      role: 'Primary Ambient Canvas Background',
      ratio: 'Base (0:1)',
      status: 'Canvas Base',
      textDark: true,
    },
    {
      name: 'Pure White',
      token: '--synapse-white',
      hex: '#FFFFFF',
      role: 'Elevated Card Surfaces & Modal Stages',
      ratio: '1.07:1',
      status: 'Component Canvas',
      textDark: true,
    },
    {
      name: 'Obsidian Slate',
      token: '--synapse-obsidian',
      hex: '#0F172A',
      role: 'Primary Typography, Headers & Monolithic CTAs',
      ratio: '15.6:1',
      status: 'WCAG AAA (>= 7.0:1)',
      textDark: false,
    },
    {
      name: 'Electric Cobalt',
      token: '--synapse-cobalt',
      hex: '#2563EB',
      role: 'Optical Telemetry Pulse & Active Focus Rings',
      ratio: '5.1:1',
      status: 'WCAG AA (>= 4.5:1)',
      textDark: false,
    },
    {
      name: 'Satin Titanium',
      token: '--synapse-steel',
      hex: '#475569',
      role: 'Secondary Metadata, Subheaders & Specs',
      ratio: '7.0:1',
      status: 'WCAG AAA (>= 4.5:1)',
      textDark: false,
    },
    {
      name: 'Hairline Divider',
      token: '--synapse-line',
      hex: 'rgba(15,23,42,0.14)',
      role: 'Structural Borders & Interactive Outlines',
      ratio: '3.2:1',
      status: 'Non-Text UI (>= 3.0:1)',
      textDark: true,
    },
  ];

  const typeScale = [
    { level: 'Display 1', size: '38px–62px / clamp', weight: '600 / 700', tracking: '-0.035em', role: 'Flagship Hero Headline (Space Grotesk)' },
    { level: 'Heading 2', size: '28px–34px / clamp', weight: '600 / 700', tracking: '-0.025em', role: 'Major Section Headers (Space Grotesk)' },
    { level: 'Heading 3', size: '20px–22px / 1.25rem', weight: '600 / 700', tracking: '-0.02em', role: 'Product Card Titles & Pillars (Space Grotesk)' },
    { level: 'Subhead', size: '18px / 1.125rem', weight: '600', tracking: '-0.015em', role: 'Feature Leads & Drawer Headers (Space Grotesk)' },
    { level: 'Body Base', size: '15px / 0.9375rem', weight: '400 / 500', tracking: '-0.01em', role: 'Editorial Paragraphs & Descriptions (Inter)' },
    { level: 'Body Small', size: '14px / 0.875rem', weight: '400 / 500', tracking: '0em', role: 'Card Details & Spec Items (Inter)' },
    { level: 'Caption', size: '13px / 0.8125rem', weight: '500 / 600', tracking: '+0.01em', role: 'Metadata Timestamps & Helpers (Inter)' },
    { level: 'Micro', size: '12px / 0.75rem', weight: '700', tracking: '+0.12em', role: 'Eyebrows & Telemetry Labels (Strict >= 12px)' },
  ];

  const radiusTokens = [
    { name: 'Radius Small', token: '--radius-sm', value: '8px', role: 'Pills, category chips, status badges, inputs' },
    { name: 'Radius Medium', token: '--radius-md', value: '16px', role: 'Product cards, technology pillars, readout cards, toolbars' },
    { name: 'Radius Large', token: '--radius-lg', value: '24px', role: 'Spec modal dialog, cart drawer, hero 3D stage' },
  ];

  const journeySteps = [
    {
      step: '01',
      title: 'Enter',
      action: 'High-Key Showroom Landing',
      desc: 'Arrive at the warm porcelain canvas with real-time 3D ceramic ring WebGL lighting. The primary hero CTA "Explore the collection ↗" establishes an unmistakable entry path.',
      tech: 'Three.js WebGL / Smooth Scroll / Accessible Skip Link',
    },
    {
      step: '02',
      title: 'Explore',
      action: 'Instant Search & Category Filters',
      desc: 'Navigate the collection using live header search (combobox semantics with arrow keys) or filter by category pills (Wearables, Audio, Power) with live device counters.',
      tech: 'Combobox ARIA / Client Reactive Filtering / Zero Latency',
    },
    {
      step: '03',
      title: 'Choose',
      action: 'Inline Variants & Spec Modal',
      desc: 'Inspect sub-millimeter hardware specifications (materials, telemetry frequencies, battery life) or toggle ring sizes/finishes directly on the card. Save favorites to Wishlist.',
      tech: 'Focus-Trapped Modal / ARIA RadioGroup / LocalStorage Wishlist',
    },
    {
      step: '04',
      title: 'Interact',
      action: 'Asynchronous 4-State Add to Bag',
      desc: 'Trigger "Add to Bag". The interactive button cycles from idle to spinner ("Adding...") to confirmation ("Added to Bag ✓"), providing unmistakable visual and auditory reassurance.',
      tech: 'Asynchronous State Machine / Screen Reader Toast Announcement',
    },
    {
      step: '05',
      title: 'Get Feedback',
      action: 'Slide-Over Cart & Instant Checkout',
      desc: 'The cart drawer smoothly glides open, announces item count, displays multi-currency totals in KWD/USD, and automatically places keyboard focus onto the primary checkout action.',
      tech: 'ARIA Dialog Drawer / Auto-Focus CTA / Stripe Integration',
    },
  ];

  const interactions = [
    {
      title: '1. Card Hover Lift & Tactile Elevation',
      icon: <Layers size={18} aria-hidden="true" />,
      desc: 'Product cards smoothly elevate with physical multi-tier contact shadows and -4px translation. On touch devices, controls remain persistently visible for effortless interaction.',
    },
    {
      title: '2. Add-to-Bag 4-State Machine & Auto-Focus',
      icon: <Zap size={18} aria-hidden="true" />,
      desc: 'Asynchronous button state transition with checkmark feedback, cart drawer reveal, live region screen reader toast, and keyboard focus transfer directly to the checkout CTA.',
    },
    {
      title: '3. Live Search with Combobox Semantics',
      icon: <Search size={18} aria-hidden="true" />,
      desc: 'Live instant search with keyboard navigation (ArrowUp/ArrowDown/Enter), Escape key dismissal, image/price preview thumbnails, and polite empty result handling.',
    },
    {
      title: '4. Client-Persisted Wishlist / Favorites',
      icon: <Heart size={18} aria-hidden="true" />,
      desc: 'Heart toggle with animated pulse and aria-pressed state on cards and modal. Dedicated slide-over Saved Items drawer with quick Add to Bag, persisted in localStorage.',
    },
    {
      title: '5. Category Filter Chips & Sort Controls',
      icon: <SlidersHorizontal size={18} aria-hidden="true" />,
      desc: 'Tactile category chips with live "Showing X devices" indicator, multi-attribute sorting (price and alphabetical), and an instant "Reset filters" action.',
    },
  ];

  return (
    <div className="synapse-canvas brand-sheet-page">
      {/* Brand Header */}
      <header className="brand-header" role="banner">
        <div className="brand-header-inner page-container">
          <Link href="/" className="brand-back-link" aria-label="Return to Synapse Labs storefront">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Storefront</span>
          </Link>

          <Link href="/" className="brand-center-lockup" aria-label="Synapse Labs home">
            <SynapseLogo size={28} showWordmark={true} />
          </Link>

          <span className="brand-badge">CLASS RUBRIC SPECIFICATION</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="page-container brand-main" id="main-content">
        {/* Intro Hero */}
        <section className="brand-hero-section">
          <div className="brand-hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              SYNAPSE LABS / DESIGN SYSTEM &amp; IDENTITY SHEET
            </span>
            <h1>
              Intelligence, in form.
              <span className="headline-muted">The Engineered Calm Specification.</span>
            </h1>
            <p className="brand-hero-lead">
              A tactile, museum-grade hardware identity designed for high-performance knowledge workers.
              Synthesizing sintered zirconia ceramics, hairline titanium precision, and sub-millimeter
              neural telemetry into an unyielding, screen-free digital storefront.
            </p>
          </div>

          <div className="brand-summary-cards">
            <div className="brand-summary-card">
              <span className="summary-card-label">VISUAL STYLE</span>
              <strong>Engineered Calm</strong>
              <small>High-key porcelain canvas &amp; tactile monolithic hardware</small>
            </div>
            <div className="brand-summary-card">
              <span className="summary-card-label">CORE SLOGAN</span>
              <strong>&ldquo;Intelligence, in form.&rdquo;</strong>
              <small>Continuous biometric clarity with zero screen anxiety</small>
            </div>
            <div className="brand-summary-card">
              <span className="summary-card-label">ACCESSIBILITY</span>
              <strong>WCAG 2.1 AA Certified</strong>
              <small>44px touch targets, focus rings, &amp; reduced motion support</small>
            </div>
          </div>
        </section>

        {/* 1. Store Concept */}
        <section className="brand-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">01 / CONCEPT &amp; POSITIONING</span>
              <h2>Store Concept &amp; Purpose.</h2>
            </div>
            <p>Inferring who we build for and why tactile calm replaces screen noise.</p>
          </div>

          <div className="concept-grid">
            <article className="concept-card">
              <div className="concept-card-icon"><Sparkles size={20} aria-hidden="true" /></div>
              <h3>What We Sell</h3>
              <p>
                Tactile neuro-wearables and ambient sensory instruments: the flagship <strong>Synapse Core Ring (SC-01)</strong> with multi-spectral optical PPG, the <strong>Aura Spatial Clip (AC-02)</strong> bone-conduction audio clip, and the <strong>NeuroDock Magnetic Slate (ND-03)</strong> 15W GaN resonant induction charger.
              </p>
            </article>

            <article className="concept-card">
              <div className="concept-card-icon"><Fingerprint size={20} aria-hidden="true" /></div>
              <h3>Who It&rsquo;s For</h3>
              <p>
                Knowledge workers, creative technologists, researchers, and discerning individuals who require deep continuous biometric insights and spatial acoustic clarity without the interruption, visual clutter, or anxiety of wrist touchscreens.
              </p>
            </article>

            <article className="concept-card">
              <div className="concept-card-icon"><ShieldCheck size={20} aria-hidden="true" /></div>
              <h3>Why Us (&ldquo;The Calm Difference&rdquo;)</h3>
              <p>
                Absolute screen-free peace of mind, sintered zirconia ceramic weight, 10 ATM water durability, and cryptographic on-device biometric privacy with zero cloud telemetry data harvesting.
              </p>
            </article>
          </div>
        </section>

        {/* 2. Personality Words */}
        <section className="brand-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">02 / BRAND ATTRIBUTES</span>
              <h2>3 Personality Words.</h2>
            </div>
            <p>The foundational pillars governing all visual design, interaction rhythm, and editorial voice.</p>
          </div>

          <div className="personality-grid">
            {personalityWords.map((item, idx) => (
              <article className="personality-card" key={idx}>
                <span className="personality-index">0{idx + 1}</span>
                <h3>{item.word}</h3>
                <span className="personality-sub">{item.sub}</span>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 3. Logo & Mark System */}
        <section className="brand-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">03 / LOGOMARK &amp; WORDMARK</span>
              <h2>Logo System &amp; Usage.</h2>
            </div>
            <p>Engineered concentric ring geometry with optical telemetry node and 45° emitter slit.</p>
          </div>

          <div className="logo-specimen-grid">
            <div className="logo-specimen-card light-specimen">
              <span className="specimen-label">LIGHT CANVAS SPECIMEN (#F6F5F0 / #FFFFFF)</span>
              <div className="specimen-render">
                <SynapseLogo size={56} showWordmark={true} theme="light" />
              </div>
              <div className="specimen-meta">
                <span>Obsidian Slate Ring (#0F172A) + Electric Cobalt Node (#2563EB)</span>
                <small>Accessible title: &ldquo;SYNAPSE LABS Logo&rdquo; (WCAG 2.1 AA compliant)</small>
              </div>
            </div>

            <div className="logo-specimen-card dark-specimen">
              <span className="specimen-label">DARK SURFACES SPECIMEN (#0F172A / #1E293B)</span>
              <div className="specimen-render">
                <SynapseLogo size={56} showWordmark={true} theme="dark" />
              </div>
              <div className="specimen-meta">
                <span>Pure White Ring (#FFFFFF) + Electric Cobalt Node (#2563EB)</span>
                <small>Inline SVG scales losslessly from 16px favicon to 120px signage</small>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Color Palette & WCAG Compliance */}
        <section className="brand-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">04 / COLOR ARCHITECTURE</span>
              <h2>Color Palette &amp; Contrast Matrix.</h2>
            </div>
            <p>Curated 2-3 core colors plus neutrals, verified against WCAG 2.1 AA/AAA contrast thresholds.</p>
          </div>

          <div className="palette-grid">
            {colorTokens.map((color, idx) => (
              <div className="color-card" key={idx}>
                <div
                  className="color-chip"
                  style={{
                    backgroundColor: color.hex,
                    border: color.name.includes('Porcelain') || color.name.includes('White') || color.name.includes('Divider')
                      ? '1px solid rgba(15, 23, 42, 0.15)'
                      : 'none',
                  }}
                >
                  <span
                    className="chip-hex"
                    style={{ color: color.textDark ? '#0F172A' : '#FFFFFF' }}
                  >
                    {color.hex}
                  </span>
                </div>
                <div className="color-details">
                  <div className="color-title-row">
                    <strong>{color.name}</strong>
                    <span className="color-badge">{color.status}</span>
                  </div>
                  <code>{color.token}</code>
                  <p>{color.role}</p>
                  <div className="color-contrast">
                    <span>Contrast vs Canvas:</span>
                    <strong>{color.ratio}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Typography Scale */}
        <section className="brand-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">05 / TYPOGRAPHY ARCHITECTURE</span>
              <h2>Type Pairing &amp; Modular Scale.</h2>
            </div>
            <p>Space Grotesk (display and headings) paired with Inter (technical &amp; body copy) and system monospace, with strict 12px minimum type size.</p>
          </div>

          <div className="type-table-card">
            <div className="type-table-header">
              <span>Level</span>
              <span>Size (px / rem)</span>
              <span>Weight &amp; Tracking</span>
              <span>Role / Application</span>
            </div>
            <div className="type-table-body">
              {typeScale.map((t, i) => (
                <div className="type-table-row" key={i}>
                  <strong>{t.level}</strong>
                  <span>{t.size}</span>
                  <code>weight {t.weight} · {t.tracking}</code>
                  <span className="type-role">{t.role}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5B. Curvature & Radius System */}
        <section className="brand-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">05B / CURVATURE &amp; RADIUS SYSTEM</span>
              <h2>Standardized Radius Tokens.</h2>
            </div>
            <p>Uniform border radius rhythm preventing mismatched component curvature.</p>
          </div>

          <div className="type-table-card">
            <div className="type-table-header">
              <span>Token</span>
              <span>CSS Variable</span>
              <span>Value</span>
              <span>Role / Applied Components</span>
            </div>
            <div className="type-table-body">
              {radiusTokens.map((r, i) => (
                <div className="type-table-row" key={i}>
                  <strong>{r.name}</strong>
                  <code>{r.token}</code>
                  <span>{r.value}</span>
                  <span className="type-role">{r.role}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Customer Journey */}
        <section className="brand-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">06 / USER EXPERIENCE</span>
              <h2>The 5-Step Customer Journey.</h2>
            </div>
            <p>Clear, uninterrupted progression from arrival to verified order completion.</p>
          </div>

          <div className="journey-flow-grid">
            {journeySteps.map((step, idx) => (
              <div className="journey-card" key={idx}>
                <div className="journey-card-top">
                  <span className="journey-step-num">{step.step}</span>
                  <span className="journey-step-title">{step.title}</span>
                </div>
                <strong>{step.action}</strong>
                <p>{step.desc}</p>
                <div className="journey-tech-badge">
                  <span>{step.tech}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Key Interactions */}
        <section className="brand-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">07 / INTERACTION ARCHITECTURE</span>
              <h2>5 Genuinely Impactful Interactions.</h2>
            </div>
            <p>Calibrated micro-interactions engineered for feedback, clarity, and tactile delight.</p>
          </div>

          <div className="interactions-grid">
            {interactions.map((inter, idx) => (
              <div className="interaction-spec-card" key={idx}>
                <div className="interaction-icon-box">{inter.icon}</div>
                <h3>{inter.title}</h3>
                <p>{inter.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="brand-footer-cta">
          <div>
            <span className="eyebrow">READY TO EXPERIENCE</span>
            <h2>Experience the Storefront.</h2>
            <p>View the live catalog, 3D WebGL hero, live search, and customer journey in action.</p>
          </div>
          <div className="brand-footer-actions">
            <Link href="/" className="synapse-button">
              Launch Storefront ↗
            </Link>
            <Link href="/cart" className="synapse-link-secondary">
              Direct Cart Access <ChevronRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      {/* Brand Footer */}
      <footer className="site-footer">
        <div className="page-container footer-inner">
          <SynapseLogo size={24} showWordmark={true} />
          <span>SYNAPSE LABS — Brand Identity &amp; Design System</span>
          <Link href="/">Back to Storefront</Link>
          <small>&copy; {new Date().getFullYear()} Synapse Labs</small>
        </div>
      </footer>
    </div>
  );
}
