"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, ChevronLeft, ChevronRight, Crown, Star } from 'lucide-react';
import type { Brand } from '@/types/brand';

interface Props {
  brands: Brand[];
}

const AUTO_INTERVAL = 6000;

const FeaturedBrandsCarousel: React.FC<Props> = ({ brands }) => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!brands.length) return;
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % brands.length);
    }, AUTO_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [brands.length]);

  const next = () => setCurrent(prev => (prev + 1) % brands.length);
  const prev = () => setCurrent(prev => (prev - 1 + brands.length) % brands.length);

  if (!brands.length) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {brands.map((brand) => (
            <div key={brand.id} className="w-full flex-shrink-0 relative">
              <Card className="relative h-96 overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black border border-white/10">
                <div className="absolute inset-0">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-cover opacity-25"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
                </div>

                <div className="relative z-10 h-full flex items-center">
                  <div className="container mx-auto px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                      {/* Brand Info */}
                      <div className="space-y-5">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur">
                          <Crown className="h-4 w-4 text-yellow-300" />
                          <span className="text-sm text-white/80">Prestigious Partner</span>
                        </div>
                        <h3 className="text-4xl font-bold text-white">{brand.name}</h3>
                        <p className="text-white/70 max-w-xl">{brand.description}</p>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{brand.productCount}</div>
                            <div className="text-xs text-white/60">Products</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < 5 ? 'text-yellow-300 fill-yellow-300' : 'text-white/30'}`} />
                              ))}
                            </div>
                            <div className="text-xs text-white/60">Quality Rated</div>
                          </div>
                        </div>
                        <Link href={`/brands/${brand.id}`}>
                          <Button className="group bg-white text-black hover:bg-yellow-300 px-6 py-2 rounded-2xl">
                            Explore {brand.name}
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>

                      {/* Visual tile */}
                      <div className="relative hidden lg:block">
                        <div className="relative w-full max-w-md mx-auto">
                          <div className="aspect-square rounded-3xl overflow-hidden border-4 border-white/10 rotate-2 hover:rotate-0 transition-transform duration-700">
                            <Image src={brand.image} alt={brand.name} fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          </div>
                          <div className="absolute -top-4 -right-4 w-10 h-10 bg-yellow-300 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <Button
        variant="ghost"
        size="lg"
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20 z-20"
        aria-label="Previous"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="lg"
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20 z-20"
        aria-label="Next"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {brands.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${i === current ? 'bg-yellow-300 w-8' : 'bg-white/40 w-2'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedBrandsCarousel;
