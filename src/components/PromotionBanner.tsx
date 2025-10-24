import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const PromotionBanner = () => {
  return (
    <section className="relative py-16 bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/images/new-collection.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/45" />
      </div>
      <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-4">New Season Collection</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Discover the latest arrivals from top luxury brands. Limited edition
          pieces now available.
        </p>
        <Link href="/collections/new-season">
          <Button size="lg" className="bg-white text-black hover:bg-gray-100">
            Shop New Arrivals
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
};
export default PromotionBanner;
