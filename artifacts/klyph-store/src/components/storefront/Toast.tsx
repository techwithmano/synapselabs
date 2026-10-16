'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useStorefront } from '@/src/context/StorefrontContext';

export default function Toast() {
  const { toastMessage } = useStorefront();

  if (!toastMessage) return null;

  return (
    <div className="synapse-toast" role="status" aria-live="polite">
      <CheckCircle2 size={18} aria-hidden="true" style={{ color: 'var(--synapse-cobalt)', flexShrink: 0 }} />
      <div>
        <strong style={{ display: 'block', fontSize: '14px', lineHeight: 1.2 }}>{toastMessage.title}</strong>
        <span style={{ fontSize: '12.5px', color: '#94A3B8' }}>{toastMessage.subtitle}</span>
      </div>
    </div>
  );
}
