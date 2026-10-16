'use client';

import React from 'react';
import { StorefrontProvider } from '@/src/context/StorefrontContext';
import Header from '@/src/components/storefront/Header';
import Hero from '@/src/components/storefront/Hero';
import ShopSection from '@/src/components/storefront/ShopSection';
import WhatItDoes from '@/src/components/storefront/WhatItDoes';
import WhySynapse from '@/src/components/storefront/WhySynapse';
import BrandFilm from '@/src/components/storefront/BrandFilm';
import ShippingTrustFaq from '@/src/components/storefront/ShippingTrustFaq';
import FinalCta from '@/src/components/storefront/FinalCta';
import Footer from '@/src/components/storefront/Footer';
import CartDrawer from '@/src/components/storefront/CartDrawer';
import FavoritesDrawer from '@/src/components/storefront/FavoritesDrawer';
import SearchOverlay from '@/src/components/storefront/SearchOverlay';
import SizeGuideModal from '@/src/components/storefront/SizeGuideModal';
import MobileStickyBar from '@/src/components/storefront/MobileStickyBar';
import Toast from '@/src/components/storefront/Toast';

export default function SynapseStorefront({
  initialCartOpen = false,
  hasBrandAd = false,
}: {
  initialCartOpen?: boolean;
  hasBrandAd?: boolean;
} = {}) {
  return (
    <StorefrontProvider initialCartOpen={initialCartOpen}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* 1. Header (sticky, slim) */}
      <Header />

      <main id="main-content" data-testid="storefront">
        {/* 2. Hero */}
        <Hero />

        {/* 3. Shop */}
        <ShopSection />

        {/* 4. What it does */}
        <WhatItDoes />

        {/* 5. Why Synapse */}
        <WhySynapse />

        {/* 6. Brand film */}
        <BrandFilm hasBrandAd={hasBrandAd} />

        {/* 7. Shipping, returns, warranty & FAQ */}
        <ShippingTrustFaq />

        {/* 8. Final CTA */}
        <FinalCta />
      </main>

      {/* 9. Footer */}
      <Footer />

      {/* Drawers, Modals & Floating Overlays */}
      <CartDrawer />
      <FavoritesDrawer />
      <SearchOverlay />
      <SizeGuideModal />
      <MobileStickyBar />
      <Toast />
    </StorefrontProvider>
  );
}
