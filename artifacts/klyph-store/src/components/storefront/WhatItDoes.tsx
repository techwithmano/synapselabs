'use client';

import React from 'react';
import { BatteryCharging, Droplets, Headphones, Moon, ShieldCheck, Zap } from 'lucide-react';

export default function WhatItDoes() {
  return (
    <section className="benefits-section" aria-label="Product Benefits">
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">Capabilities</span>
          <h2>Everything you need. Nothing you don't.</h2>
          <p>
            Simple, honest hardware built to give you meaningful wellness insights without demanding
            your attention.
          </p>
        </div>

        {/* 3 Benefit Blocks */}
        <div className="benefits-grid">
          {/* Card 1: Ring */}
          <div className="benefit-card">
            <div className="benefit-icon-box" aria-hidden="true">
              <Moon size={24} />
            </div>
            <h3>Sleep &amp; Recovery Tracking</h3>
            <p>
              The Core Ring sits comfortably on your finger 24/7. It tracks your resting heart rate,
              sleep stages, and daily physical recovery so you know when to push and when to rest.
            </p>
          </div>

          {/* Card 2: Clip */}
          <div className="benefit-card">
            <div className="benefit-icon-box" aria-hidden="true">
              <Headphones size={24} />
            </div>
            <h3>Spatial Open-Ear Audio</h3>
            <p>
              The Aura Spatial Clip snaps gently to your outer ear. Hear calls, podcasts, and music
              with crystalline clarity while staying completely aware of your surroundings.
            </p>
          </div>

          {/* Card 3: Dock */}
          <div className="benefit-card">
            <div className="benefit-icon-box" aria-hidden="true">
              <Zap size={24} />
            </div>
            <h3>Fast Magnetic Charging</h3>
            <p>
              The NeuroDock Slate delivers fast, drop-and-go inductive power on a scratch-resistant
              ceramic surface. Charge your ring and clip simultaneously with zero tangled cables.
            </p>
          </div>
        </div>

        {/* Spec Strip: Verified Real Values Only */}
        <div className="spec-strip" aria-label="Hardware Specifications">
          <div className="spec-cell">
            <strong>7 Days</strong>
            <span>Continuous battery life</span>
          </div>

          <div className="spec-cell">
            <strong>100m (10 ATM)</strong>
            <span>Water &amp; swim resistance</span>
          </div>

          <div className="spec-cell">
            <strong>$0 Monthly</strong>
            <span>No subscription required</span>
          </div>

          <div className="spec-cell">
            <strong>20 Minutes</strong>
            <span>Rapid inductive recharge</span>
          </div>
        </div>

        <small className="spec-footnote">
          *Wellness insights only. Not a medical device. Intended for fitness and general wellness tracking.
        </small>
      </div>
    </section>
  );
}
