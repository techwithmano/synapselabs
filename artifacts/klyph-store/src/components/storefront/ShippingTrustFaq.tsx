'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

const FAQS = [
  {
    q: 'How long does the battery last on a single charge?',
    a: 'The Synapse Core Ring lasts up to 7 full days of continuous day-and-night health tracking. When it is time to recharge, placing it on the magnetic dock for 20 minutes brings it back to full capacity.',
  },
  {
    q: 'Can I shower, swim, or wash my hands with the ring on?',
    a: 'Yes. The Core Ring has a 10 ATM (100-meter) water resistance rating. You can wear it while washing dishes, showering, swimming in pools, and diving in open ocean water without concern.',
  },
  {
    q: 'Are there any recurring monthly subscriptions or hidden fees?',
    a: 'Never. Once you purchase any Synapse device, all current and future wellness features, software updates, and tracking metrics are 100% free with no subscription required.',
  },
  {
    q: 'What happens if I order the wrong ring size?',
    a: 'Every purchase includes our 30-day fit guarantee. If your ring feels too tight or loose, contact us within 30 days and we will send you a replacement size free of charge.',
  },
  {
    q: 'How long will my order take to arrive?',
    a: 'Orders are processed within 24 hours. Express courier shipping takes 2 to 4 business days locally within Kuwait and the GCC, and 4 to 7 business days worldwide with full doorstep tracking.',
  },
];

export default function ShippingTrustFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="trust-faq-section" aria-label="Shipping, Warranty, and FAQ">
      <div className="container">
        {/* 3-Column Trust Block */}
        <div className="trust-3col">
          <div className="trust-card">
            <div className="trust-card-icon" aria-hidden="true">
              <Truck size={28} />
            </div>
            <h3>Free Courier Shipping</h3>
            <p>
              Every order ships with free, fully insured courier delivery and real-time tracking
              straight to your doorstep.
            </p>
            <Link href="/support#shipping" className="btn-link" style={{ padding: 0 }}>
              <span>Shipping details</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="trust-card">
            <div className="trust-card-icon" aria-hidden="true">
              <RotateCcw size={28} />
            </div>
            <h3>30-Day Fit Guarantee</h3>
            <p>
              Wear your ring day and night. If the size or feel is not right, swap it for another size
              or return it hassle-free.
            </p>
            <Link href="/support#returns" className="btn-link" style={{ padding: 0 }}>
              <span>Return policy</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="trust-card">
            <div className="trust-card-icon" aria-hidden="true">
              <ShieldCheck size={28} />
            </div>
            <h3>2-Year Hardware Warranty</h3>
            <p>
              Every device is backed by full hardware coverage against manufacturing flaws and battery
              degradation.
            </p>
            <Link href="/support#warranty" className="btn-link" style={{ padding: 0 }}>
              <span>Warranty terms</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* 5-Question FAQ Accordion */}
        <div className="faq-wrap">
          <div className="faq-title">
            <span className="section-eyebrow">Questions &amp; Answers</span>
            <h2>Common questions</h2>
          </div>

          <div className="faq-accordion" role="region" aria-label="Frequently Asked Questions">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="faq-item">
                  <button
                    type="button"
                    className="faq-trigger"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    id={`faq-question-${idx}`}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} aria-hidden="true" />
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${idx}`}
                      role="region"
                      aria-labelledby={`faq-question-${idx}`}
                      className="faq-answer"
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
