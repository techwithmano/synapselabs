'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function FinalCta() {
  return (
    <section className="final-cta-section" aria-label="Get Started">
      <div className="container">
        <div className="final-cta-card">
          <span className="section-eyebrow">Ready to begin</span>
          <h2>Experience health without distraction.</h2>
          <p>
            Track your sleep, heart rate, and recovery with zero screens, zero buzzing, and zero
            monthly fees.
          </p>
          <a href="#devices" className="btn btn-primary" style={{ minWidth: '220px' }}>
            <span>Shop the Core Ring</span>
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
