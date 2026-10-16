'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function WhySynapse() {
  return (
    <section id="why-synapse" className="why-section" aria-label="Why Synapse">
      <div className="container">
        <div className="section-head" style={{ marginBottom: '40px' }}>
          <span className="section-eyebrow">Our Philosophy</span>
          <h2>Technology that respects you.</h2>
        </div>

        <div className="why-grid">
          {/* Point 1 */}
          <div className="why-point">
            <span className="why-num">01</span>
            <h3>No screens or buzzing</h3>
            <p>
              Designed to disappear into your daily routine. No glowing displays, notifications, or
              anxiety-inducing vibration motors.
            </p>
          </div>

          {/* Point 2 */}
          <div className="why-point">
            <span className="why-num">02</span>
            <h3>Data stays on your device</h3>
            <p>
              Your wellness metrics belong exclusively to you. We never sell, rent, or monetize your
              health information to third parties.
            </p>
          </div>

          {/* Point 3 */}
          <div className="why-point">
            <span className="why-num">03</span>
            <h3>Zero subscription fees</h3>
            <p>
              Buy the hardware once and keep full access forever. All metrics, updates, and features
              are included with no monthly paywalls.
            </p>
          </div>
        </div>

        <div className="why-footer">
          <Link href="/privacy" className="btn-link">
            <span>Read our privacy policy</span>
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
