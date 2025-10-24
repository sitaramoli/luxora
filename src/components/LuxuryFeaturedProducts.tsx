'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Star, 
  Heart, 
  Eye, 
  ShoppingBag, 
  ArrowRight,
  Sparkles,
  Crown,
  Award,
  TrendingUp,
  Zap
} from 'lucide-react';
import type { Product } from '@/types/product';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/PageLoader';
import { dispatchCartUpdated, dispatchWishlistUpdated } from '@/lib/events';

// Floating animation component for luxury elements
const LuxuryFloatingElement = ({ 
  children, 
  delay = 0, 
  className = ""
}: { 
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <div 
    className={`animate-float opacity-80 ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    {children}
  </div>
);

// Animated counter for price
const AnimatedPrice = ({ price, originalPrice }: { price: number; originalPrice?: number }) => {
  const [displayPrice, setDisplayPrice] = useState(0);

  useEffect(() => {
    const increment = price / 50;
    const interval = setInterval(() => {
      setDisplayPrice(prev => {
        if (prev >= price) {
          clearInterval(interval);
          return price;
        }
        return Math.min(prev + increment, price);
      });
    }, 20);

    return () => clearInterval(interval);
  }, [price]);

  return (
    <div className="space-y-1">
      <div className="text-2xl font-bold text-white">
        ${Math.floor(displayPrice).toLocaleString()}
      </div>
      {originalPrice && originalPrice > price && (
        <div className="text-sm text-white/60 line-through">
          ${originalPrice.toLocaleString()}
        </div>
      )}
    </div>
  );
};

const LuxuryFeaturedProducts: React.FC<{ products: Product[] }> = ({ products }) => {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const router = useRouter();
  const [addingToCart, setAddingToCart] = useState<Record<string, boolean>>({});
  const [wishlistLoading, setWishlistLoading] = useState<Record<string, boolean>>({});
  const [inWishlist, setInWishlist] = useState<Record<string, boolean>>({});

  const handleAddToCart = async (productId: string) => {
    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: parseInt(productId), quantity: 1 }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Please sign in to add items to cart');
        } else {
          throw new Error(data.error || 'Failed to add to cart');
        }
        return;
      }
      toast.success('Item added to cart!');
      dispatchCartUpdated();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Failed to add to cart');
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleWishlistToggle = async (productId: string) => {
    setWishlistLoading(prev => ({ ...prev, [productId]: true }));
    const currentlyIn = !!inWishlist[productId];
    try {
      if (currentlyIn) {
        const response = await fetch('/api/wishlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: parseInt(productId) }),
        });
        const data = await response.json();
        if (!response.ok) {
          if (response.status === 401) {
            toast.error('Please sign in to manage wishlist');
          } else {
            throw new Error(data.error || 'Failed to remove from wishlist');
          }
          return;
        }
        setInWishlist(prev => ({ ...prev, [productId]: false }));
        toast.success('Removed from wishlist');
      } else {
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: parseInt(productId) }),
        });
        const data = await response.json();
        if (!response.ok) {
          if (response.status === 401) {
            toast.error('Please sign in to add to wishlist');
          } else {
            throw new Error(data.error || 'Failed to add to wishlist');
          }
          return;
        }
        setInWishlist(prev => ({ ...prev, [productId]: true }));
        toast.success('Added to wishlist');
      }
      dispatchWishlistUpdated();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Wishlist update failed');
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleView = (productId: string) => {
    router.push(`/products/${productId}`);
  };

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

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-black via-gray-950 to-black overflow-hidden"
    >
      {/* Luxury background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-transparent via-white/2 to-transparent rounded-full animate-spin" style={{ animationDuration: '60s' }} />
      </div>

      {/* Floating luxury elements */}
      <LuxuryFloatingElement delay={0} className="absolute top-32 left-10">
        <Crown className="h-8 w-8 text-yellow-400/30" />
      </LuxuryFloatingElement>
      <LuxuryFloatingElement delay={1} className="absolute top-40 right-16">
        <Sparkles className="h-6 w-6 text-purple-400/30" />
      </LuxuryFloatingElement>
      <LuxuryFloatingElement delay={2} className="absolute bottom-32 left-1/4">
        <Award className="h-7 w-7 text-white/20" />
      </LuxuryFloatingElement>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400/10 to-purple-400/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10 mb-6">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            <span className="text-white/90 font-medium">Curated Exclusively</span>
            <Crown className="h-5 w-5 text-yellow-400" />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-white animate-gradient">
              Featured Luxury
            </span>
          </h2>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Handpicked treasures from the world's most prestigious fashion houses. 
            Each piece tells a story of craftsmanship, heritage, and timeless elegance.
          </p>
          
          {/* Decorative line */}
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mt-8 rounded-full" />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {products.map((product, index) => {
            const discount = product.originalPrice && product.originalPrice > product.price
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;
            return (
              <div
                key={product.id}
                className={`group relative ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 200}ms` }}
                onMouseEnter={() => setHoveredProduct(parseInt(product.id))}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <Card className="relative overflow-hidden bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent border border-white/10 backdrop-blur-xl transition-all duration-700 hover:scale-105 hover:border-white/20 group-hover:shadow-2xl group-hover:shadow-yellow-400/10">
                  
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Floating badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.isNew && (
                        <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black text-xs font-bold rounded-full flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          New
                        </div>
                      )}
                      {product.isSale && (
                        <div className="px-3 py-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          On Sale
                        </div>
                      )}
                      {discount > 0 && (
                        <div className="px-3 py-1 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          -{discount}%
                        </div>
                      )}
                    </div>

                    {/* Quick actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                    <Button size="sm" variant="ghost" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20" onClick={() => handleWishlistToggle(product.id)} disabled={!!wishlistLoading[product.id]}>
                      {wishlistLoading[product.id] ? (
                        <LoadingSpinner size="icon" />
                      ) : (
                        <Heart className={`h-4 w-4 ${inWishlist[product.id] ? 'fill-red-500 text-red-500' : ''}`} />
                      )}
                    </Button>
                    <Button size="sm" variant="ghost" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20" onClick={() => handleView(product.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    </div>

                    {/* Hover overlay with quick add */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <Button className="w-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30 rounded-xl disabled:opacity-50" onClick={() => handleAddToCart(product.id)} disabled={!!addingToCart[product.id]}>
                        {addingToCart[product.id] ? (
                          <LoadingSpinner size="icon" className="mr-2" />
                        ) : (
                          <ShoppingBag className="h-4 w-4 mr-2" />
                        )}
                        {addingToCart[product.id] ? 'Adding...' : 'Quick Add'}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Product Details */}
                  <div className="p-6 space-y-4">
                    {/* Brand & Category */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-yellow-400 font-medium tracking-wide uppercase">
                        {product.brand}
                      </span>
                      <span className="text-xs text-white/50 px-2 py-1 bg-white/5 rounded-full">
                        {product.category}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-xl font-semibold text-white group-hover:text-yellow-200 transition-colors duration-300 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-white/60">
                        {product.rating} ({product.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <AnimatedPrice 
                        price={product.price} 
                        originalPrice={product.originalPrice}
                      />
                      
                      {hoveredProduct === parseInt(product.id) && (
                        <div className="animate-bounce">
                          <ArrowRight className="h-5 w-5 text-yellow-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-purple-400/10 rounded-lg" />
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className={`text-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '800ms' }}>
          <Link href="/products">
            <Button 
              size="lg"
              className="group relative bg-gradient-to-r from-yellow-400 to-yellow-300 text-black hover:from-yellow-300 hover:to-yellow-400 px-12 py-4 text-lg font-semibold rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/40 overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000" />
              <span className="relative z-10 flex items-center">
                Explore All Luxury Items
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LuxuryFeaturedProducts;