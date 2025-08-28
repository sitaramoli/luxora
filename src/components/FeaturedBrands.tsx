"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import CardSkeleton from "@/components/CardSkeleton";
import BrandCard from "@/components/BrandCard";
import { featuredBrands } from "@/constants";

const FeaturedBrands = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Brands
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore collections from the world&#39;s most prestigious luxury
            brands
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            : featuredBrands.map((brand) => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/brands">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800">
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
