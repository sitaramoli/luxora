import React from 'react';

import FeaturedBrands from '@/components/FeaturedBrands';
import LuxuryExclusiveBanner from '@/components/LuxuryExclusiveBanner';
import LuxuryFeaturedProductsServer from '@/components/LuxuryFeaturedProductsServer';
import LuxuryFeaturesSection from '@/components/LuxuryFeaturesSection';
import LuxuryTestimonials from '@/components/LuxuryTestimonials';
import RevolutionaryHeroSection from '@/components/RevolutionaryHeroSection';

const Page = () => {
  return (
    <>
      <RevolutionaryHeroSection
        title="Luxury Redefined"
        subtitle="Discover exclusive collections from the world's most prestigious brands"
        backgroundImage="/images/Hero.jpg"
        ctaText="Explore Collection"
        ctaLink="/products"
      />
      <LuxuryFeaturesSection />
      <LuxuryFeaturedProductsServer />
      <LuxuryExclusiveBanner />
      <FeaturedBrands />
      <LuxuryTestimonials />
    </>
  );
};
export default Page;
