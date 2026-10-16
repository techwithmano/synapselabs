import type { Metadata } from 'next';
import Link from 'next/link';
import SynapseLogo from '@/src/components/SynapseLogo';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  HelpCircle,
  Lock,
  Mail,
  Package,
  Ruler,
  ShieldCheck,
  Truck,
  Undo2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Support, Sizing & Client Concierge — SYNAPSE LABS',
  description:
    'Hardware sizing guide, insured global dispatch, 30-day tactile fit guarantee, 2-year warranty, and client concierge for Synapse Labs.',
};

/**
 * PLACEHOLDER SUPPORT EMAIL
 * Replace this constant with the production concierge/support inbox address.
 */
const SUPPORT_EMAIL = 'support@synapselabs.invalid';

// Sizing table computed with exact formulas:
// diameter = 11.63 + 0.8128 * size
// circumference = Math.PI * diameter
const SIZING_DATA = [6, 7, 8, 9, 10, 11, 12, 13].map((size) => {
  const diameter = 11.63 + 0.8128 * size;
  const circumference = Math.PI * diameter;
  return {
    size: `US ${size}`,
    diameterMm: diameter.toFixed(1),
    circumferenceMm: circumference.toFixed(1),
  };
});

const FAQS = [
  {
    q: 'How long does the battery last on the Synapse Core Ring?',
    a: 'The Synapse Core Ring delivers a continuous 7 days of active biometric telemetry on a single charge. Charging from 0% to 100% takes approximately 45 minutes on the NeuroDock Magnetic Slate.',
  },
  {
    q: 'Can I wear the Core Ring while swimming or showering?',
    a: 'Yes. The ring is precision sintered from zirconia ceramic and grade 5 titanium with 10 ATM (100 meters) water resistance, suitable for swimming, shallow diving, showering, and rigorous workouts.',
  },
  {
    q: 'Does Synapse hardware require a monthly subscription?',
    a: 'No. Synapse Labs believes in sovereign hardware ownership. All telemetry processing, HRV analytics, sleep stage mapping, and software updates are included with your hardware with zero subscription fees.',
  },
  {
    q: 'How does the Aura Spatial Clip transmit sound?',
    a: 'The Aura Spatial Clip utilizes dual-acoustic bone conduction resonators positioned against the auricle cartilage, delivering immersive spatial audio directly to the inner ear without blocking your ear canal or ambient awareness.',
  },
  {
    q: 'What is your return policy if the ring does not fit?',
    a: 'We offer a 30-Day Tactile Fit Guarantee. If your instrument does not fit comfortably, contact concierge within 30 days of delivery for a complimentary size exchange or a full refund with pre-paid return air dispatch.',
  },
];

export default function SupportPage() {
  return (
    <div className="synapse-canvas support-page">
      {/* Top Header */}
      <header className="account-topbar">
        <Link className="brand-lockup" href="/" aria-label="Synapse Labs home">
          <SynapseLogo size={26} showWordmark={true} />
        </Link>
        <Link className="back-link" href="/" aria-label="Return to store home">
          <ArrowLeft size={16} aria-hidden="true" /> Back to store
        </Link>
      </header>

      <main className="page-container support-main" id="main-content">
        {/* Support Hero */}
        <section className="support-hero">
          <span className="eyebrow">
            <span className="eyebrow-dot" />
            SYNAPSE LABS // CLIENT CONCIERGE &amp; DOCUMENTATION
          </span>
          <h1>Hardware Support &amp; Sizing.</h1>
          <p className="support-lead">
            Everything you need to calibrate, measure, and maintain your Synapse hardware instruments.
          </p>
        </section>

        {/* Quick Navigation Cards */}
        <div className="support-cards-grid">
          <a href="#sizing" className="support-nav-card">
            <div className="support-card-icon"><Ruler size={22} aria-hidden="true" /></div>
            <h3>Ring Sizing Guide</h3>
            <p>Precise finger measurement and millimeter conversion table.</p>
            <span className="support-card-link">View guide <ChevronRight size={14} aria-hidden="true" /></span>
          </a>

          <a href="#shipping" className="support-nav-card">
            <div className="support-card-icon"><Truck size={22} aria-hidden="true" /></div>
            <h3>Shipping &amp; Delivery</h3>
            <p>Insured courier dispatch, international customs, and tracking.</p>
            <span className="support-card-link">Read policy <ChevronRight size={14} aria-hidden="true" /></span>
          </a>

          <a href="#returns" className="support-nav-card">
            <div className="support-card-icon"><Undo2 size={22} aria-hidden="true" /></div>
            <h3>30-Day Fit &amp; Returns</h3>
            <p>Hassle-free size exchange and return procedures.</p>
            <span className="support-card-link">Learn more <ChevronRight size={14} aria-hidden="true" /></span>
          </a>

          <a href="#warranty" className="support-nav-card">
            <div className="support-card-icon"><ShieldCheck size={22} aria-hidden="true" /></div>
            <h3>2-Year Warranty</h3>
            <p>Manufacturing coverage, sensor integrity, and ceramic durability.</p>
            <span className="support-card-link">Warranty details <ChevronRight size={14} aria-hidden="true" /></span>
          </a>
        </div>

        {/* Sizing Guide Section */}
        <section className="support-section" id="sizing">
          <div className="section-heading">
            <div>
              <span className="eyebrow">RING SIZING CALIBRATION</span>
              <h2>How to Measure Your Ring Size.</h2>
            </div>
            <p>
              Accurate sizing ensures optimal optical sensor contact with your sub-epidermal capillaries.
            </p>
          </div>

          <div className="sizing-guide-container">
            <div className="sizing-instructions">
              <h3>Paper Strip or String Measurement Method</h3>
              <ol className="sizing-steps">
                <li>
                  <strong>1. Prepare a strip:</strong> Cut a non-stretchy strip of paper about 15mm wide or use a piece of standard string.
                </li>
                <li>
                  <strong>2. Wrap your finger:</strong> Wrap the strip snugly around the base of the finger you plan to wear the ring on (typically the index or middle finger for optimal biometric signal strength).
                </li>
                <li>
                  <strong>3. Mark the overlap:</strong> Use a pen to mark the exact point where the strip forms a complete circle and overlaps.
                </li>
                <li>
                  <strong>4. Measure against a ruler:</strong> Lay the strip flat and measure the distance in millimeters from the edge to your pen mark. This is your finger circumference.
                </li>
                <li>
                  <strong>5. Knuckle clearance:</strong> Ensure the measurement can slide comfortably over your knuckle. If your knuckle is noticeably larger than your finger base, choose the half-size or next larger size.
                </li>
              </ol>
            </div>

            <div className="sizing-table-wrap">
              <h3>Official Sizing Reference Table</h3>
              <p className="sizing-table-note">
                Computed via standard biological circumference formula: <code>inner diameter = 11.63 + 0.8128 &times; size</code> and <code>circumference = &pi; &times; diameter</code>.
              </p>
              <table className="sizing-table">
                <thead>
                  <tr>
                    <th scope="col">US Size</th>
                    <th scope="col">Inner Diameter (mm)</th>
                    <th scope="col">Circumference (mm)</th>
                    <th scope="col">Availability</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZING_DATA.map((row) => {
                    const isAvailable = ['US 8', 'US 9', 'US 10', 'US 11'].includes(row.size);
                    return (
                      <tr key={row.size} className={isAvailable ? 'row-available' : 'row-reference'}>
                        <td><strong>{row.size}</strong></td>
                        <td>{row.diameterMm} mm</td>
                        <td>{row.circumferenceMm} mm</td>
                        <td>
                          {isAvailable ? (
                            <span className="stock-tag stock-in">In Collection</span>
                          ) : (
                            <span className="stock-tag stock-custom">Reference</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Shipping & Delivery Section */}
        <section className="support-section" id="shipping">
          <div className="section-heading">
            <div>
              <span className="eyebrow">GLOBAL DISPATCH</span>
              <h2>Shipping &amp; Delivery Commitments.</h2>
            </div>
          </div>
          <div className="support-prose-card">
            <p>
              Every Synapse instrument is packed in museum-grade, shock-dampening recyclable packaging and dispatched via insured priority air courier.
            </p>
            <ul>
              <li><strong>Dispatch Time:</strong> Orders are processed and dispatched within 24 to 48 hours from our fulfillment center.</li>
              <li><strong>Transit Times:</strong> Regional air courier takes 2 to 4 business days. International delivery takes 4 to 7 business days depending on destination.</li>
              <li><strong>Tracking:</strong> You will receive a direct courier tracking number by email as soon as the package is collected.</li>
              <li><strong>Duties &amp; Import:</strong> Customs clearance is expedited. Local import duties are handled according to your local jurisdiction.</li>
            </ul>
          </div>
        </section>

        {/* 30-Day Fit & Returns */}
        <section className="support-section" id="returns">
          <div className="section-heading">
            <div>
              <span className="eyebrow">TACTILE FIT GUARANTEE</span>
              <h2>30-Day Evaluation &amp; Exchanges.</h2>
            </div>
          </div>
          <div className="support-prose-card">
            <p>
              We want your Synapse Core Ring or Aura Spatial Clip to fit seamlessly into your life. You have 30 days from delivery to evaluate the instrument in your daily routine.
            </p>
            <ul>
              <li><strong>Zero-Friction Size Exchanges:</strong> If your ring is too snug or loose, contact concierge for an exchange. We will dispatch the new size with a pre-paid return mailer.</li>
              <li><strong>Full Refunds:</strong> Returns in original physical condition with all charging accessories qualify for a 100% refund to your original payment method.</li>
              <li><strong>Return Window:</strong> Initiated within 30 calendar days of confirmed courier delivery.</li>
            </ul>
          </div>
        </section>

        {/* Warranty Section */}
        <section className="support-section" id="warranty">
          <div className="section-heading">
            <div>
              <span className="eyebrow">HARDWARE ASSURANCE</span>
              <h2>2-Year Limited Hardware Warranty.</h2>
            </div>
          </div>
          <div className="support-prose-card">
            <p>
              Synapse Labs warrants all hardware products against defects in materials and workmanship under normal consumer use for a period of two (2) years from the original purchase date.
            </p>
            <ul>
              <li><strong>What Is Covered:</strong> Ceramic structural integrity, titanium chassis delamination, optical sensor calibration drift, bone-conduction transducers, and internal charging circuitry.</li>
              <li><strong>What Is Excluded:</strong> Cosmetic scratches from extreme abrasive surfaces, intentional destruction, or unauthorized disassembly.</li>
              <li><strong>Service Procedure:</strong> Defective instruments are exchanged directly for replacement units calibrated to factory specifications.</li>
            </ul>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="support-section" id="faq">
          <div className="section-heading">
            <div>
              <span className="eyebrow">COMMON INQUIRIES</span>
              <h2>Frequently Asked Questions.</h2>
            </div>
          </div>
          <div className="faq-grid">
            {FAQS.map((faq, i) => (
              <article className="faq-item" key={i}>
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Contact Concierge Section */}
        <section className="support-section" id="contact">
          <div className="concierge-card">
            <div className="concierge-content">
              <span className="eyebrow">CLIENT CONCIERGE</span>
              <h2>Need Personal Assistance?</h2>
              <p>
                Our hardware specialists are available to answer questions about sizing, orders, or technical integration.
              </p>
              <div className="concierge-email-box">
                <Mail size={18} aria-hidden="true" />
                <a href={`mailto:${SUPPORT_EMAIL}`} className="concierge-email-link">
                  {SUPPORT_EMAIL}
                </a>
              </div>
              <small className="concierge-hours">Inquiries answered within 12 hours · Sunday through Thursday</small>
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
          <Link href="/brand">Brand &amp; Design</Link>
          <Link href="/support">Support &amp; FAQ</Link>
          <Link href="/#devices">Devices</Link>
          <small>&copy; {new Date().getFullYear()} Synapse Labs</small>
        </div>
      </footer>
    </div>
  );
}
