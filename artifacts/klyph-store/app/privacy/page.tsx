import type { Metadata } from 'next';
import Link from 'next/link';
import SynapseLogo from '@/src/components/SynapseLogo';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Database,
  Fingerprint,
  HardDrive,
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy & Biometric Sovereignty Policy',
  description:
    'Our uncompromising commitment to on-device neural telemetry privacy, zero data harvesting, and sovereign hardware ownership.',
};

const PRIVACY_CONTACT_EMAIL = 'privacy@synapselabs.com';

export default function PrivacyPolicyPage() {
  return (
    <div className="synapse-canvas privacy-page">
      {/* Top Header */}
      <header className="account-topbar">
        <Link className="brand-lockup" href="/" aria-label="Synapse Labs home">
          <SynapseLogo size={26} showWordmark={true} />
        </Link>
        <Link className="back-link" href="/" aria-label="Return to store home">
          <ArrowLeft size={16} aria-hidden="true" /> Back to store
        </Link>
      </header>

      <main className="page-container privacy-main" id="main-content">
        {/* Breadcrumb Navigation */}
        <nav className="privacy-breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={13} />
            </li>
            <li aria-current="page">Privacy Policy</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="privacy-hero">
          <span className="eyebrow">
            <span className="eyebrow-dot" />
            SYNAPSE LABS // SOVEREIGN PRIVACY COMMITMENT
          </span>
          <h1>Biometric Sovereignty &amp; Privacy Policy.</h1>
          <p className="privacy-lead">
            Your physiological ground truth belongs to you alone. We engineer hardware that computes locally, respects your silence, and never monetizes your biology.
          </p>
          <div className="privacy-meta-badge">
            <ShieldCheck size={16} aria-hidden="true" />
            <span>Effective Date: October 2026 &middot; Version 2.4</span>
          </div>
        </section>

        {/* Key Guarantees Banner */}
        <div className="privacy-guarantees-grid">
          <div className="guarantee-card">
            <div className="guarantee-icon">
              <Fingerprint size={22} aria-hidden="true" />
            </div>
            <h3>On-Device Computation</h3>
            <p>
              Raw PPG waveforms and HRV algorithms process entirely on your hardware microcontroller.
            </p>
          </div>
          <div className="guarantee-card">
            <div className="guarantee-icon">
              <HardDrive size={22} aria-hidden="true" />
            </div>
            <h3>Zero Cloud Telemetry</h3>
            <p>
              We do not operate a centralized biometric health cloud. Your data is never mined or aggregated.
            </p>
          </div>
          <div className="guarantee-card">
            <div className="guarantee-icon">
              <Lock size={22} aria-hidden="true" />
            </div>
            <h3>Stripe PCI-DSS Security</h3>
            <p>
              Credit card transactions are tokenized via Stripe. Synapse Labs never handles or stores payment credentials.
            </p>
          </div>
        </div>

        {/* Privacy Content Sections */}
        <div className="privacy-content-card">
          {/* Section 1 */}
          <section className="privacy-section">
            <div className="section-title-wrap">
              <span className="privacy-section-num">01</span>
              <h2>The Principle of Biometric Sovereignty</h2>
            </div>
            <p>
              At Synapse Labs, privacy is an architectural requirement, not an optional preference toggle. When you wear the <strong>Synapse Core Ring (SC-01)</strong> or use the <strong>Aura Spatial Clip (AC-02)</strong>, all optical photoplethysmography (PPG), heart rate variability (HRV), and autonomic sensory calculations are computed on the device’s local low-power neural microcontroller.
            </p>
            <p>
              Raw capillary reflection waveforms never leave the instrument over unsecured channels. Your physiological signals belong entirely to you, isolated from public clouds, insurance underwriters, and behavioral advertising algorithms.
            </p>
          </section>

          {/* Section 2 */}
          <section className="privacy-section">
            <div className="section-title-wrap">
              <span className="privacy-section-num">02</span>
              <h2>Information We Collect &amp; Why</h2>
            </div>
            <p>
              As a direct-to-consumer hardware manufacturer, we collect only the minimal data necessary to fulfill physical orders and support your instruments:
            </p>
            <ul className="privacy-list">
              <li>
                <strong>Order &amp; Shipping Information:</strong> When you purchase hardware, we collect your name, shipping address, email, and phone number to dispatch your package via insured priority courier and send dispatch tracking notifications.
              </li>
              <li>
                <strong>Account Credentials:</strong> If you register a Synapse Labs account, we store your email address and a cryptographically salted and hashed password (using bcrypt with 10 salt rounds). We never have access to plaintext passwords.
              </li>
              <li>
                <strong>Customer Support Inquiries:</strong> When you contact our concierge team regarding sizing, technical calibration, or warranty service, we retain correspondence records solely to resolve your request.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="privacy-section">
            <div className="section-title-wrap">
              <span className="privacy-section-num">03</span>
              <h2>Payment Processing &amp; Financial Security</h2>
            </div>
            <p>
              All online payments are processed through <strong>Stripe, Inc.</strong>, a certified PCI-DSS Level 1 Service Provider. Your payment details (including credit card numbers, expiration dates, and security codes) are entered directly into Stripe’s encrypted tokenization fields.
            </p>
            <p>
              Synapse Labs never observes, processes, or stores your raw credit card numbers or security CVVs on our servers. We receive only a sanitized payment token and transaction status confirmation necessary to confirm your order.
            </p>
          </section>

          {/* Section 4 */}
          <section className="privacy-section">
            <div className="section-title-wrap">
              <span className="privacy-section-num">04</span>
              <h2>Cookies &amp; Local Storage Usage</h2>
            </div>
            <p>
              We operate our storefront with extreme technical restraint. We do not use third-party behavioral advertising pixels, cross-site tracking cookies, or commercial fingerprinting scripts.
            </p>
            <ul className="privacy-list">
              <li>
                <strong>Authentication Cookies:</strong> An HTTP-only, secure JWT cookie (<code>auth_token</code>) is issued when you log in to your account. This allows you to securely view your order history and dispatch status without re-entering credentials.
              </li>
              <li>
                <strong>Functional Local Storage:</strong> We utilize your browser’s local storage solely to remember your shopping bag contents, selected hardware sizes, currency preference (KWD/USD), and saved wishlist items across browser sessions.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="privacy-section">
            <div className="section-title-wrap">
              <span className="privacy-section-num">05</span>
              <h2>Data Retention &amp; Customer Rights</h2>
            </div>
            <p>
              Under global data protection standards (including the EU General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA)), you maintain total sovereignty over your personal information:
            </p>
            <div className="rights-grid">
              <div className="right-item">
                <CheckCircle2 size={18} className="right-check-icon" aria-hidden="true" />
                <div>
                  <strong>Right to Access &amp; Portability:</strong>
                  <span>Request a complete digital export of all order records associated with your account.</span>
                </div>
              </div>
              <div className="right-item">
                <CheckCircle2 size={18} className="right-check-icon" aria-hidden="true" />
                <div>
                  <strong>Right to Erasure (To Be Forgotten):</strong>
                  <span>Request permanent deletion of your customer profile and account credentials at any time.</span>
                </div>
              </div>
              <div className="right-item">
                <CheckCircle2 size={18} className="right-check-icon" aria-hidden="true" />
                <div>
                  <strong>Zero Data Sales Guarantee:</strong>
                  <span>We do not sell, rent, or barter customer personal information to any third party under any circumstances.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="privacy-section">
            <div className="section-title-wrap">
              <span className="privacy-section-num">06</span>
              <h2>Contact Our Data Protection Concierge</h2>
            </div>
            <p>
              If you have any questions, wish to exercise your rights of erasure, or require technical verification of our on-device privacy architecture, please contact our dedicated Data Protection Officer:
            </p>
            <div className="privacy-contact-box">
              <div className="contact-icon">
                <Mail size={20} aria-hidden="true" />
              </div>
              <div>
                <strong>Direct Privacy Concierge</strong>
                <a href={`mailto:${PRIVACY_CONTACT_EMAIL}`} className="privacy-email-link">
                  {PRIVACY_CONTACT_EMAIL}
                </a>
                <small>Official responses provided within 24 business hours.</small>
              </div>
            </div>
          </section>
        </div>
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
