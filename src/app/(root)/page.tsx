import React from "react";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeaturedBrands from "@/components/FeaturedBrands";
import PromotionBanner from "@/components/PromotionBanner";
import FeaturesSection from "@/components/FeaturesSection";
import Testimonials from "@/components/Testimonials";

const Page = () => {
  return (
    <>
      <HeroSection
        title="Luxury Redefined"
        subtitle="Discover exclusive collections from the world's most prestigious brands"
        backgroundImage="/images/Hero.jpg"
        ctaText="Explore Collection"
        ctaLink="/products"
      />
      <FeaturesSection />
      <FeaturedProducts />
      <PromotionBanner />
      <FeaturedBrands />
      <Testimonials />
    </>
  );
};
export default Page;
