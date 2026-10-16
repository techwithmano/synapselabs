'use client';

import React from 'react';
import { Ruler, X } from 'lucide-react';
import { useStorefront } from '@/src/context/StorefrontContext';
import { SIZING_DATA } from '@/src/lib/constants';

export default function SizeGuideModal() {
  const { sizeGuideOpen, closeSizeGuide } = useStorefront();

  if (!sizeGuideOpen) return null;

  return (
    <div
      className={`modal-backdrop ${sizeGuideOpen ? 'is-open' : ''}`}
      onClick={closeSizeGuide}
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-modal-title"
    >
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ruler size={20} aria-hidden="true" style={{ color: 'var(--synapse-cobalt)' }} />
            <h2 id="size-guide-modal-title" className="font-heading" style={{ margin: 0, fontSize: '18px' }}>
              Ring Sizing Guide
            </h2>
          </div>

          <button
            type="button"
            className="btn-icon"
            onClick={closeSizeGuide}
            aria-label="Close sizing guide"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '14.5px', marginBottom: '16px' }}>
            The Core Ring fits true to standard US jewelry sizes. For optimal sensor contact, choose
            a size that fits snugly on your index, middle, or ring finger without slipping over the
            knuckle easily.
          </p>

          <table className="size-table" aria-label="Ring Size Conversion Chart">
            <thead>
              <tr>
                <th>US Size</th>
                <th>Inner Diameter</th>
                <th>Finger Circumference</th>
              </tr>
            </thead>
            <tbody>
              {SIZING_DATA.map((row) => (
                <tr key={row.size}>
                  <td>
                    <strong>{row.size}</strong>
                  </td>
                  <td>{row.diameter} mm</td>
                  <td>{row.circumference} mm</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              marginTop: '20px',
              padding: '14px 16px',
              background: 'var(--synapse-bg)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13.5px',
              color: 'var(--synapse-steel)',
            }}
          >
            <strong>30-Day Fit Guarantee:</strong> If the ring size you order does not feel completely
            comfortable after wearing it day and night, we provide free size exchanges within 30 days.
          </div>
        </div>
      </div>
    </div>
  );
}
