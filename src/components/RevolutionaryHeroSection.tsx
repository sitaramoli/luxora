'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import StoryModal from '@/components/ui/story-modal';
import { 
  ArrowRight, 
  Play, 
  Sparkles, 
  Star, 
  ShoppingBag,
  TrendingUp,
  Award,
  Zap,
  Heart,
  Eye
} from 'lucide-react';

interface RevolutionaryHeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
}

// Floating animation component
const FloatingElement = ({ 
  children, 
  delay = 0, 
  duration = 3,
  className = ""
}: { 
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) => (
  <div 
    className={`animate-pulse opacity-80 ${className}`}
    style={{
      animation: `float ${duration}s ease-in-out ${delay}s infinite alternate`
    }}
  >
    {children}
  </div>
);

// Stats counter component
const StatsCounter = ({ end, label, prefix = "", suffix = "" }: {
  end: number;
  label: string;
  prefix?: string;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = end / 50;
      const interval = setInterval(() => {
        setCount(prev => {
          if (prev >= end) {
            clearInterval(interval);
            return end;
          }
          return Math.min(prev + increment, end);
        });
      }, 40);
      return () => clearInterval(interval);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [end]);

  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-white mb-1">
        {prefix}{Math.floor(count).toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-white/80">{label}</div>
    </div>
  );
};

// Product showcase card
const ProductShowcase = ({ delay }: { delay: number }) => (
  <div 
    className="group cursor-pointer transform hover:scale-105 transition-all duration-700 hover:rotate-1"
    style={{ animationDelay: `${delay}s` }}
  >
    <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4 hover:bg-white/20 transition-all duration-500 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500">
          <ShoppingBag className="h-8 w-8 text-white" />
        </div>
        
        <h4 className="text-white font-semibold mb-2 group-hover:text-yellow-200 transition-colors">
          Premium Collection
        </h4>
        <p className="text-white/70 text-sm mb-3">
          Curated luxury items from top designers
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">$2,499</span>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>
      </div>
    </Card>
  </div>
);

const RevolutionaryHeroSection: React.FC<RevolutionaryHeroSectionProps> = ({
  title,
  subtitle,
  backgroundImage,
  ctaText,
  ctaLink,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          from { transform: translateY(0px) rotate(0deg); }
          to { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-gradient {
          background-size: 400% 400%;
          animation: gradientShift 8s ease infinite;
        }
        
        .slide-in-up {
          animation: slideInUp 1s ease-out forwards;
        }
        
        .slide-in-left {
          animation: slideInLeft 1s ease-out forwards;
        }
        
        .slide-in-right {
          animation: slideInRight 1s ease-out forwards;
        }
      `}</style>

      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden bg-black"
        style={{
          background: `linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: `${50 + mousePosition.x * 5}% ${50 + mousePosition.y * 5}%`,
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating geometric shapes */}
          <FloatingElement delay={0} duration={4} className="absolute top-20 left-10">
            <div className="w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-sm" />
          </FloatingElement>
          
          <FloatingElement delay={1} duration={3.5} className="absolute top-40 right-20">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-lg rotate-45 blur-sm" />
          </FloatingElement>
          
          <FloatingElement delay={2} duration={5} className="absolute bottom-32 left-1/4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400/15 to-transparent rounded-full blur-sm" />
          </FloatingElement>

          {/* Parallax moving elements */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              transform: `translateY(${scrollY * 0.5}px)`
            }}
          >
            <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white rounded-full animate-pulse" />
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-pulse" />
            <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
            
            {/* Left Column - Main Content */}
            <div className={`space-y-8 ${isVisible ? 'slide-in-left' : 'opacity-0'}`}>
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span className="text-white text-sm font-medium">New Luxury Collection 2025</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>

              {/* Main Heading with Gradient Animation */}
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-white animate-gradient">
                  {title}
                </h1>
                
                {/* Animated subtitle */}
                <div className="relative">
                  <p className="text-xl lg:text-2xl text-white/90 leading-relaxed max-w-xl">
                    {subtitle}
                  </p>
                  <div className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full" />
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-6 py-6">
                <StatsCounter end={500} label="Luxury Brands" suffix="+" />
                <StatsCounter end={50000} label="Happy Customers" suffix="+" />
                <StatsCounter end={25} label="Countries" suffix="+" />
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={ctaLink}>
                  <Button
                    size="lg"
                    className="group relative bg-gradient-to-r from-white via-yellow-50 to-white text-black hover:from-yellow-400 hover:via-yellow-300 hover:to-yellow-400 text-lg px-8 py-6 rounded-2xl font-semibold transition-all duration-700 hover:shadow-2xl hover:shadow-yellow-400/40 hover:scale-105 min-w-[200px] overflow-hidden"
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000" />
                    <span className="relative z-10 flex items-center">
                      {ctaText}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                  </Button>
                </Link>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsStoryModalOpen(true)}
                  className="group relative bg-transparent border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60 text-lg px-8 py-6 rounded-2xl font-semibold transition-all duration-500 backdrop-blur-md min-w-[200px] overflow-hidden"
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center">
                    <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Watch Story
                  </span>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-8 pt-8">
                <div className="flex items-center space-x-2 text-white/80">
                  <Award className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm">Award Winning</span>
                </div>
                <div className="flex items-center space-x-2 text-white/80">
                  <Zap className="h-5 w-5 text-green-400" />
                  <span className="text-sm">Fast Delivery</span>
                </div>
                <div className="flex items-center space-x-2 text-white/80">
                  <Heart className="h-5 w-5 text-red-400" />
                  <span className="text-sm">Loved by 50K+</span>
                </div>
              </div>
            </div>

            {/* Right Column - Interactive Showcase */}
            <div className={`relative ${isVisible ? 'slide-in-right' : 'opacity-0'}`}>
              
              {/* Main Product Showcase */}
              <div className="relative">
                
                {/* Central Hero Product */}
                <div className="relative group cursor-pointer" onClick={() => setIsStoryModalOpen(true)}>
                  <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-700 hover:scale-105 hover:rotate-1 overflow-hidden">
                    
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="relative z-10 text-center">
                      <div className="relative w-32 h-32 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                        <ShoppingBag className="h-16 w-16 text-white" />
                        {/* Play icon overlay */}
                        <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Play className="h-3 w-3 text-white fill-white" />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-200 transition-colors">
                        Exclusive Collection
                      </h3>
                      <p className="text-white/70 mb-4">
                        Hand-picked luxury items from world-renowned designers
                      </p>
                      
                      <div className="flex items-center justify-center space-x-4 mb-6">
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-white/80">4.9 (2,847 reviews)</span>
                      </div>
                      
                      <div className="text-4xl font-bold text-white mb-4">
                        From <span className="text-yellow-400">$1,299</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-1" />
                          <span className="text-white/80">Trending Now</span>
                        </div>
                        <div className="text-center">
                          <Eye className="h-6 w-6 text-blue-400 mx-auto mb-1" />
                          <span className="text-white/80">247 Viewing</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Floating Product Cards */}
                <div className="absolute -top-8 -left-8">
                  <ProductShowcase delay={0.5} />
                </div>
                
                <div className="absolute -top-4 -right-12">
                  <ProductShowcase delay={1} />
                </div>
                
                <div className="absolute -bottom-8 -left-12">
                  <ProductShowcase delay={1.5} />
                </div>

                {/* Floating elements around the showcase */}
                <FloatingElement delay={0} className="absolute -top-10 left-1/2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
                </FloatingElement>
                
                <FloatingElement delay={2} className="absolute top-1/2 -right-6">
                  <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse" />
                </FloatingElement>
                
                <FloatingElement delay={1} className="absolute -bottom-6 left-1/3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" />
                </FloatingElement>
              </div>
              
              {/* Live Activity Indicators */}
              <div className="absolute -bottom-16 left-0 right-0">
                <Card className="bg-white/10 backdrop-blur-md border-white/20 px-4 py-3 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-white text-sm">1,247 people shopping now</span>
                    </div>
                    <div className="text-white/70 text-xs">
                      🔥 85% off selected items
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center space-y-2 text-white/60 animate-bounce">
            <span className="text-sm">Discover More</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Story Modal */}
      <StoryModal 
        isOpen={isStoryModalOpen} 
        onClose={() => setIsStoryModalOpen(false)} 
      />
    </>
  );
};

export default RevolutionaryHeroSection;
