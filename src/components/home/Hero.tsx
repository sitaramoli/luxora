import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/Hero.jpg"
          alt="Luxora – Elevated luxury"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="min-h-[76vh] md:min-h-[82vh] flex items-center">
            <div className="max-w-3xl space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-300" />
                <span className="text-sm text-white/80">New Season • Curated Exclusives</span>
              </div>

              <h1 className="text-5xl leading-tight font-semibold text-white sm:text-6xl">
                Luxury, Curated for the Discerning
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200">
                  Discover the Exceptional
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl">
                Timeless craftsmanship, iconic houses, and contemporary edge. Explore limited collections and
                elevated essentials—delivered with unmatched service.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href="/products">
                  <Button size="lg" className="bg-yellow-300 text-black hover:bg-yellow-200 px-7">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/collections">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Explore Collections
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle corner gradient accents for luxury feel, CSS-only */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-yellow-300/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-400/10 blur-3xl" />
    </section>
  );
};

export default Hero;
