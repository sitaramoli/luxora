'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Crown, 
  Star, 
  ArrowRight,
  Sparkles,
  Award,
  TrendingUp,
  Users,
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Luxury brands data
const luxuryBrands = [
  {
    id: 1,
    name: "Hermès",
    description: "French luxury goods manufacturer specializing in leather, lifestyle accessories, perfumery, and ready-to-wear.",
    logo: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=200",
    coverImage: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800",
    founded: "1837",
    country: "France",
    specialty: "Leather Goods",
    products: 247,
    rating: 4.9,
    isPartner: true,
    isFeatured: true
  },
  {
    id: 2,
    name: "Chanel",
    description: "French luxury fashion house founded by Coco Chanel. Known for haute couture, ready-to-wear, handbags, perfumery, and cosmetics.",
    logo: "https://images.pexels.com/photos/965733/pexels-photo-965733.jpeg?auto=compress&cs=tinysrgb&w=200",
    coverImage: "https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=800",
    founded: "1910",
    country: "France",
    specialty: "Fashion & Beauty",
    products: 892,
    rating: 4.8,
    isPartner: true,
    isFeatured: true
  },
  {
    id: 3,
    name: "Louis Vuitton",
    description: "French fashion house and luxury goods company known for luggage, handbags, and accessories.",
    logo: "https://images.pexels.com/photos/1449844/pexels-photo-1449844.jpeg?auto=compress&cs=tinysrgb&w=200",
    coverImage: "https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg?auto=compress&cs=tinysrgb&w=800",
    founded: "1854",
    country: "France",
    specialty: "Luxury Goods",
    products: 1256,
    rating: 4.9,
    isPartner: true,
    isFeatured: false
  },
  {
    id: 4,
    name: "Cartier",
    description: "French luxury goods conglomerate that designs, manufactures, and sells jewelry, watches, and accessories.",
    logo: "https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg?auto=compress&cs=tinysrgb&w=200",
    coverImage: "https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg?auto=compress&cs=tinysrgb&w=800",
    founded: "1847",
    country: "France",
    specialty: "Jewelry & Watches",
    products: 423,
    rating: 4.9,
    isPartner: true,
    isFeatured: true
  },
  {
    id: 5,
    name: "Gucci",
    description: "Italian luxury fashion house based in Florence, specializing in ready-to-wear, handbags, shoes, and jewelry.",
    logo: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=200",
    coverImage: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800",
    founded: "1921",
    country: "Italy",
    specialty: "Fashion & Accessories",
    products: 678,
    rating: 4.7,
    isPartner: true,
    isFeatured: false
  },
  {
    id: 6,
    name: "Prada",
    description: "Italian luxury fashion house specializing in ready-to-wear leather handbags, travel accessories, shoes, and fragrances.",
    logo: "https://images.pexels.com/photos/965733/pexels-photo-965733.jpeg?auto=compress&cs=tinysrgb&w=200",
    coverImage: "https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=800",
    founded: "1913",
    country: "Italy",
    specialty: "Fashion & Leather",
    products: 534,
    rating: 4.8,
    isPartner: true,
    isFeatured: false
  }
];

const LuxuryFeaturedBrands: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredBrand, setHoveredBrand] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);

  const featuredBrands = luxuryBrands.filter(brand => brand.isFeatured);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-slide carousel
  useEffect(() => {
    if (isVisible) {
      autoSlideRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % featuredBrands.length);
      }, 5000);
    }

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, [isVisible, featuredBrands.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % featuredBrands.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + featuredBrands.length) % featuredBrands.length);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-gray-950 via-black to-gray-950 overflow-hidden"
    >
      {/* Luxury background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Floating luxury elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 left-16 w-64 h-64 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-16 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400/10 to-purple-400/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10 mb-6">
            <Crown className="h-5 w-5 text-yellow-400" />
            <span className="text-white/90 font-medium">Prestigious Partners</span>
            <Award className="h-5 w-5 text-yellow-400" />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-white animate-gradient">
              Luxury Brands
            </span>
          </h2>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            We partner with the world's most prestigious fashion houses to bring you 
            authentic luxury pieces from legendary brands with centuries of craftsmanship.
          </p>
        </div>

        {/* Featured Brand Carousel */}
        <div className={`mb-20 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredBrands.map((brand, index) => (
                  <div key={brand.id} className="w-full flex-shrink-0 relative">
                    <Card className="relative h-96 overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black border border-white/10">
                      {/* Background image */}
                      <div className="absolute inset-0">
                        <Image
                          src={brand.coverImage}
                          alt={brand.name}
                          fill
                          className="object-cover opacity-20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
                      </div>

                      {/* Content */}
                      <div className="relative z-10 h-full flex items-center">
                        <div className="container mx-auto px-8">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            
                            {/* Brand Info */}
                            <div className="space-y-6">
                              <div className="flex items-center space-x-4">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-yellow-400/50">
                                  <Image
                                    src={brand.logo}
                                    alt={`${brand.name} logo`}
                                    width={80}
                                    height={80}
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <h3 className="text-4xl font-bold text-white mb-2">{brand.name}</h3>
                                  <div className="flex items-center space-x-4 text-white/60">
                                    <span>Est. {brand.founded}</span>
                                    <span>•</span>
                                    <span>{brand.country}</span>
                                    <span>•</span>
                                    <span className="text-yellow-400">{brand.specialty}</span>
                                  </div>
                                </div>
                              </div>

                              <p className="text-lg text-white/80 leading-relaxed max-w-lg">
                                {brand.description}
                              </p>

                              <div className="flex items-center space-x-8">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-white">{brand.products}</div>
                                  <div className="text-sm text-white/60">Products</div>
                                </div>
                                <div className="text-center">
                                  <div className="flex items-center justify-center mb-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < Math.floor(brand.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                                      />
                                    ))}
                                  </div>
                                  <div className="text-sm text-white/60">{brand.rating}/5</div>
                                </div>
                              </div>

                              <Link href={`/brands/${brand.name.toLowerCase()}`}>
                                <Button className="group bg-gradient-to-r from-yellow-400 to-yellow-300 text-black hover:from-yellow-300 hover:to-yellow-400 px-8 py-3 rounded-2xl font-semibold transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/40">
                                  Explore {brand.name}
                                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                              </Link>
                            </div>

                            {/* Brand Visual */}
                            <div className="relative">
                              <div className="relative w-full max-w-md mx-auto">
                                <div className="aspect-square rounded-3xl overflow-hidden border-4 border-white/10 rotate-3 hover:rotate-0 transition-transform duration-700">
                                  <Image
                                    src={brand.coverImage}
                                    alt={brand.name}
                                    fill
                                    className="object-cover"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                </div>
                                
                                {/* Floating elements */}
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/40 animate-bounce">
                                  <Crown className="h-6 w-6 text-black" />
                                </div>
                                <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/40 animate-pulse">
                                  <Sparkles className="h-5 w-5 text-white" />
                                </div>
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

            {/* Navigation buttons */}
            <Button
              variant="ghost"
              size="lg"
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20 z-20"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20 z-20"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Slide indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {featuredBrands.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-yellow-400 w-8' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* All Brands Grid */}
        <div className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Our Prestigious Partners
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {luxuryBrands.map((brand, index) => (
              <div
                key={brand.id}
                className="group relative"
                onMouseEnter={() => setHoveredBrand(brand.id)}
                onMouseLeave={() => setHoveredBrand(null)}
              >
                <Card className="relative aspect-square overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-white/30 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-white/10">
                  <div className="absolute inset-0 p-4 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-xl overflow-hidden mb-3 border border-white/20">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <h4 className="text-white font-semibold text-center text-sm group-hover:text-yellow-200 transition-colors">
                      {brand.name}
                    </h4>
                    <p className="text-white/50 text-xs text-center mt-1">
                      {brand.specialty}
                    </p>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>

                {/* Hover tooltip */}
                {hoveredBrand === brand.id && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 backdrop-blur-sm text-white text-xs rounded-lg border border-white/20 whitespace-nowrap z-10">
                    Est. {brand.founded} • {brand.products} products
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link href="/brands">
              <Button 
                size="lg"
                className="group relative bg-gradient-to-r from-white/10 to-white/5 border border-white/20 text-white hover:bg-white/20 px-12 py-4 text-lg font-semibold rounded-2xl backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-white/20 overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000" />
                <span className="relative z-10 flex items-center">
                  View All Luxury Brands
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LuxuryFeaturedBrands;