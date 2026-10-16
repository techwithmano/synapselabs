'use client';

import React, { useEffect, useState } from 'react';

export default function BrandFilm({ hasBrandAd = false }: { hasBrandAd?: boolean }) {
  const [available, setAvailable] = useState(hasBrandAd);

  useEffect(() => {
    setAvailable(hasBrandAd);
  }, [hasBrandAd]);

  useEffect(() => {
    if (available) return;
    void fetch('/ad/brand-ad.mp4', { method: 'HEAD' })
      .then((res) => {
        if (res.ok) setAvailable(true);
      })
      .catch(() => {});
  }, [available]);

  if (!available) {
    return null;
  }

  return (
    <section className="film-section" aria-label="Brand Film">
      <div className="container">
        <div className="section-head" style={{ marginBottom: '32px' }}>
          <span className="section-eyebrow">Experience</span>
          <h2>Watch the film</h2>
        </div>

        <div className="film-wrapper">
          <video
            controls
            playsInline
            preload="metadata"
            poster="/images/synapse/synapse-core-ring.webp"
            aria-label="Synapse Brand Film"
          >
            <source src="/ad/brand-ad.mp4" type="video/mp4" />
            <track
              kind="captions"
              src="/ad/brand-ad-captions.vtt"
              srcLang="en"
              label="English Captions"
              default
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}
