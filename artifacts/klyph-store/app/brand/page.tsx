import type { Metadata } from 'next';
import Link from 'next/link';
import SynapseLogo from '@/src/components/SynapseLogo';
import {
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  ChevronRight,
  Cpu,
  EyeOff,
  Fingerprint,
  HardDrive,
  Heart,
  Layers,
  Lock,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Story & Philosophy of Engineered Calm',
  description:
    'Tactile neuro-wearables and ambient sensory instruments engineered for screen-free focus, sub-millimeter biometric precision, and complete data sovereignty.',
};

export default function BrandStoryPage() {
  const personalityPillars = [
    {
      word: 'Quiet',
      sub: 'Screen-Free Serenity',
      desc: 'Restrained, serene, distraction-free. We reject glowing wrist touchscreens, buzzes, and dopamine urgency loops. Synapse instruments collect vital physiological truth in total silence, keeping you fully immersed in your work.',
    },
    {
      word: 'Precise',
      sub: 'Sub-Millimeter Calibration',
      desc: 'Surgical, geometric, calibrated. Every tolerance, multi-spectral optical sensor wavelength (530nm green and 660nm infrared), and metallic chamfer is engineered with scientific clarity and uncompromising truth.',
    },
    {
      word: 'Confident',
      sub: 'Monolithic Durability',
      desc: 'Monolithic, unhurried, enduring. Sintered zirconia ceramics, grade 5 titanium chassis, and 10 ATM water resistance ensure our instruments are built to endure decades of continuous wear without degradation.',
    },
  ];

  return (
    <div className="synapse-canvas brand-sheet-page">
      {/* Brand Header */}
      <header className="account-topbar">
        <Link className="brand-lockup" href="/" aria-label="Synapse Labs home">
          <SynapseLogo size={26} showWordmark={true} />
        </Link>
        <Link className="back-link" href="/" aria-label="Return to store home">
          <ArrowLeft size={16} aria-hidden="true" /> Back to store
        </Link>
      </header>

      {/* Main Content */}
      <main className="page-container brand-main" id="main-content">
        {/* Breadcrumb Navigation */}
        <nav className="privacy-breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={13} />
            </li>
            <li aria-current="page">Our Philosophy</li>
          </ol>
        </nav>

        {/* Intro Hero */}
        <section className="brand-hero-section">
          <div className="brand-hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              THE SYNAPSE LABS STORY // FORM, PRIVACY &amp; RESTRAINT
            </span>
            <h1>
              Intelligence, in form.
              <span className="headline-muted">The Philosophy of Engineered Calm.</span>
            </h1>
            <p className="brand-hero-lead">
              A tactile, museum-grade hardware studio dedicated to high-performance knowledge workers.
              Synthesizing sintered zirconia ceramics, titanium precision, and sub-millimeter
              neural telemetry into an unyielding, screen-free physical sanctuary.
            </p>
          </div>

          <div className="brand-summary-cards">
            <div className="brand-summary-card">
              <span className="summary-card-label">DESIGN ETHOS</span>
              <strong>Engineered Calm</strong>
              <small>Tactile monolithic ceramics with zero digital distraction</small>
            </div>
            <div className="brand-summary-card">
              <span className="summary-card-label">CORE PROMISE</span>
              <strong>Screen-Free Insight</strong>
              <small>Continuous biometric ground truth without wrist screen anxiety</small>
            </div>
            <div className="brand-summary-card">
              <span className="summary-card-label">DATA SECURITY</span>
              <strong>Sovereign Privacy</strong>
              <small>On-device telemetry calculation with zero cloud harvesting</small>
            </div>
          </div>
        </section>

        {/* 1. Store Concept & Positioning */}
        <section className="brand-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">01 / CONCEPT &amp; PURPOSE</span>
              <h2>Why We Build Screen-Free Hardware.</h2>
            </div>
            <p>Technology should respect your attention and fit your life in absolute silence.</p>
          </div>

          <div className="concept-grid">
            <article className="concept-card">
              <div className="concept-card-icon"><Sparkles size={20} aria-hidden="true" /></div>
              <h3>What We Build</h3>
              <p>
                Tactile neuro-wearables and ambient sensory instruments: the flagship <strong>Synapse Core Ring (SC-01)</strong> with dual-wavelength optical PPG, the <strong>Aura Spatial Clip (AC-02)</strong> bone-conduction spatial sound clip, and the <strong>NeuroDock Magnetic Slate (ND-03)</strong> 15W resonant induction charger.
              </p>
            </article>

            <article className="concept-card">
              <div className="concept-card-icon"><Fingerprint size={20} aria-hidden="true" /></div>
              <h3>Who It&rsquo;s For</h3>
              <p>
                Knowledge workers, creative technologists, researchers, writers, and thinkers who demand deep autonomic insight and spatial acoustic clarity without the constant interruption, visual clutter, or anxiety of wrist touchscreens.
              </p>
            </article>

            <article className="concept-card">
              <div className="concept-card-icon"><ShieldCheck size={20} aria-hidden="true" /></div>
              <h3>The Sovereign Difference</h3>
              <p>
                Absolute screen-free peace of mind, high-density sintered zirconia ceramic weight, 10 ATM waterproof assurance, and cryptographic on-device biometric privacy with zero cloud data harvesting or subscription paywalls.
              </p>
            </article>
          </div>
        </section>

        {/* 2. Three Personality Tenets */}
        <section className="brand-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">02 / CORE ATTRIBUTES</span>
              <h2>The 3 Pillars of Our Craft.</h2>
            </div>
            <p>The timeless foundation governing our engineering tolerances, physical materials, and product design.</p>
          </div>

          <div className="personality-grid">
            {personalityPillars.map((item, idx) => (
              <article className="personality-card" key={idx}>
                <span className="personality-index">0{idx + 1}</span>
                <h3>{item.word}</h3>
                <span className="personality-sub">{item.sub}</span>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 3. Material Science & Architecture */}
        <section className="brand-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">03 / MATERIAL SCIENCE</span>
              <h2>Monolithic Materiality.</h2>
            </div>
            <p>Engineered from earth-hardened compounds designed for tactile warmth and physical permanence.</p>
          </div>

          <div className="material-science-grid">
            <div className="material-card">
              <div className="material-card-icon"><Cpu size={20} aria-hidden="true" /></div>
              <h3>Sintered Zirconia Ceramic</h3>
              <p>
                Diamond-polished at 1,500&deg;C. Highly biocompatible, hypoallergenic, and impervious to daily micro-abrasions, providing deep tactile warmth that mirrors natural stone.
              </p>
            </div>
            <div className="material-card">
              <div className="material-card-icon"><ShieldCheck size={20} aria-hidden="true" /></div>
              <h3>Grade 5 Titanium Chassis</h3>
              <p>
                High tensile-strength aerospace alloy provides sub-millimeter rigidity, housing the optical sensor package while weighing under 4 grams.
              </p>
            </div>
            <div className="material-card">
              <div className="material-card-icon"><BatteryCharging size={20} aria-hidden="true" /></div>
              <h3>Resonant Magnetic Induction</h3>
              <p>
                Zero mechanical charging pins to corrode or collect residue. 15W magnetic coupling charges the ring from empty to 100% in 45 minutes.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Sovereign Privacy Section */}
        <section className="brand-section">
          <div className="brand-privacy-card">
            <div className="privacy-card-inner">
              <span className="eyebrow">04 / SOVEREIGN DATA</span>
              <h2>Your biology is not our product.</h2>
              <p>
                Every sensor reading, HRV computation, and sleep architecture curve is calculated locally on the hardware. We do not sell your biometrics, build advertising profiles, or hold your health hostage behind a monthly subscription.
              </p>
              <div className="privacy-cta-row">
                <Link href="/privacy" className="button-primary">
                  Read Full Biometric Sovereignty Policy <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link href="/#devices" className="button-secondary">
                  Explore Hardware Collection
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="page-container footer-inner">
          <Link className="brand-lockup" href="/" aria-label="Synapse Labs home">
            <SynapseLogo size={24} showWordmark={true} />
          </Link>
          <span>Considered technology for everyday life.</span>
          <Link href="/#philosophy">Our Philosophy</Link>
          <Link href="/support">Support &amp; FAQ</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/#devices">Collection</Link>
          <small>&copy; {new Date().getFullYear()} Synapse Labs</small>
        </div>
      </footer>
    </div>
  );
}
