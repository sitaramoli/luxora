import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import FeaturedBrandsCarousel from '@/components/FeaturedBrandsCarousel';
import { Button } from '@/components/ui/button';
import { fetchFeaturedMerchants } from '@/lib/services/merchants';
import {
  transformDatabaseMerchant,
  type DatabaseMerchant,
} from '@/types/brand';

const FeaturedBrands = async () => {
  const result = await fetchFeaturedMerchants(3); // Fetch 3 featured merchants

  // Handle potential error or empty state
  if (!result.success || !result.data || result.data.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Featured Brands
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Explore collections from the world&#39;s most prestigious luxury
              brands
            </p>
          </div>

          <div className="text-center py-12">
            <p className="text-white/60 mb-4">
              No featured brands available at the moment.
            </p>
            <Link href="/brands">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-yellow-300"
              >
                Browse All Brands
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Transform database merchants to UI brand format
  const brands = result.data.map((dbMerchant: DatabaseMerchant) =>
    transformDatabaseMerchant(dbMerchant)
  );

  return (
    <section className="py-16 bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Featured Brands
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Explore collections from the world&#39;s most prestigious luxury
            brands
          </p>
        </div>

        <FeaturedBrandsCarousel brands={brands} />

        <div className="text-center mt-12">
          <Link href="/brands">
            <Button size="lg" className="bg-white text-black hover:bg-yellow-300">
              Explore All Brands
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default FeaturedBrands;
