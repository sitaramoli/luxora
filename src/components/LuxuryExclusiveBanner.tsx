'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Crown, 
  Star, 
  ArrowRight,
  Sparkles,
  Gift,
  Clock,
  Users,
  Zap,
  Diamond,
  Award
} from 'lucide-react';

// Countdown timer component
const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center space-x-4">
      {Object.entries(timeLeft).map(([unit, value], index) => (
        <div key={unit} className="text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20 min-w-[60px]">
            <div className="text-2xl font-bold text-white">
              {value.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-white/70 uppercase tracking-wider">
              {unit}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const LuxuryExclusiveBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Set target date to 30 days from now
  const exclusiveEndDate = new Date();
  exclusiveEndDate.setDate(exclusiveEndDate.getDate() + 30);

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
      className="relative py-20 overflow-hidden"
    >
      {/* Luxury gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent animate-gradient" 
             style={{ backgroundSize: '200% 100%' }} />
      </div>

      {/* Premium pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, white 1px, transparent 1px), radial-gradient(circle at 70% 80%, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating luxury elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating diamonds */}
        <div className="absolute top-16 left-20 opacity-30">
          <Diamond className="h-8 w-8 text-yellow-400 animate-pulse" style={{ animationDelay: '0s' }} />
        </div>
        <div className="absolute top-32 right-32 opacity-40">
          <Crown className="h-12 w-12 text-yellow-300 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }} />
        </div>
        <div className="absolute bottom-24 left-1/4 opacity-25">
          <Sparkles className="h-6 w-6 text-purple-300 animate-ping" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute bottom-16 right-20 opacity-35">
          <Award className="h-10 w-10 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Card className={`relative overflow-hidden bg-gradient-to-br from-black/40 via-black/20 to-black/40 border-2 border-yellow-400/30 backdrop-blur-xl ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
          
          {/* Premium glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-purple-400/5 to-yellow-400/5 animate-pulse" />
          
          <div className="relative z-10 p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Content Side */}
              <div className="text-center lg:text-left space-y-8">
                
                {/* VIP Badge */}
                <div className={`inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-400/20 to-purple-400/20 backdrop-blur-sm rounded-full px-6 py-3 border-2 border-yellow-400/40 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
                  <Crown className="h-6 w-6 text-yellow-400" />
                  <span className="text-white font-bold text-lg tracking-wide">VIP EXCLUSIVE</span>
                  <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                </div>

                {/* Main Headline */}
                <div className={`space-y-4 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>
                  <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-white animate-gradient">
                      Private Sale
                    </span>
                  </h2>
                  <h3 className="text-2xl lg:text-3xl text-white/90 font-light">
                    Up to <span className="text-yellow-400 font-bold">70% OFF</span> Luxury Collections
                  </h3>
                </div>

                {/* Description */}
                <p className={`text-lg text-white/80 leading-relaxed max-w-lg ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '600ms' }}>
                  Join our exclusive members-only sale featuring rare pieces from Hermès, Chanel, Louis Vuitton, 
                  and other prestigious fashion houses. Limited time, limited quantities.
                </p>

                {/* Exclusive Features */}
                <div className={`grid grid-cols-2 gap-6 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '800ms' }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center">
                      <Gift className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Free Shipping</div>
                      <div className="text-white/60 text-sm">On all orders</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-400/20 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">VIP Access</div>
                      <div className="text-white/60 text-sm">Members only</div>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className={`flex flex-col sm:flex-row gap-4 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '1000ms' }}>
                  <Link href="/exclusive-sale">
                    <Button 
                      size="lg"
                      className="group relative bg-gradient-to-r from-yellow-400 to-yellow-300 text-black hover:from-yellow-300 hover:to-yellow-400 px-8 py-4 text-lg font-bold rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/40 overflow-hidden min-w-[200px]"
                    >
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000" />
                      <span className="relative z-10 flex items-center justify-center">
                        <Crown className="mr-2 h-5 w-5" />
                        Access VIP Sale
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </span>
                    </Button>
                  </Link>
                  
                  <Link href="/membership">
                    <Button 
                      variant="outline"
                      size="lg"
                      className="group relative bg-transparent border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60 px-8 py-4 text-lg font-semibold rounded-2xl backdrop-blur-sm transition-all duration-500 min-w-[200px]"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        <Zap className="mr-2 h-5 w-5" />
                        Join VIP Club
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Visual Side */}
              <div className={`relative ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`} style={{ animationDelay: '600ms' }}>
                
                {/* Countdown Timer */}
                <div className="mb-8">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center space-x-2 text-white/80 text-sm uppercase tracking-wider">
                      <Clock className="h-4 w-4" />
                      <span>Sale Ends In</span>
                    </div>
                  </div>
                  <CountdownTimer targetDate={exclusiveEndDate} />
                </div>

                {/* Luxury Showcase */}
                <div className="relative">
                  {/* Main showcase card */}
                  <Card className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/[0.02] border border-white/20 backdrop-blur-xl p-8 rounded-3xl overflow-hidden group hover:scale-105 transition-all duration-700">
                    
                    {/* Premium glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10 text-center space-y-6">
                      
                      {/* Luxury Items Preview */}
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { name: "Hermès Bag", price: "$8,500", discount: "50% OFF" },
                          { name: "Chanel Jewelry", price: "$2,200", discount: "60% OFF" },
                          { name: "LV Wallet", price: "$650", discount: "40% OFF" },
                          { name: "Cartier Watch", price: "$12,000", discount: "30% OFF" }
                        ].map((item, index) => (
                          <div key={index} className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:border-yellow-400/50 transition-all duration-300">
                            <div className="aspect-square bg-gradient-to-br from-white/10 to-white/5 rounded-xl mb-3 flex items-center justify-center">
                              <div className="w-8 h-8 bg-yellow-400/30 rounded-full flex items-center justify-center">
                                <Crown className="h-4 w-4 text-yellow-400" />
                              </div>
                            </div>
                            <h4 className="text-white font-semibold text-sm mb-1">{item.name}</h4>
                            <div className="flex items-center justify-between">
                              <span className="text-yellow-400 font-bold text-sm">{item.price}</span>
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">{item.discount}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Exclusive Stats */}
                      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">500+</div>
                          <div className="text-white/60 text-xs">Exclusive Items</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-400">70%</div>
                          <div className="text-white/60 text-xs">Max Discount</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">24h</div>
                          <div className="text-white/60 text-xs">Left</div>
                        </div>
                      </div>
                    </div>

                    {/* Floating badges */}
                    <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/40 animate-pulse">
                      <div className="text-white text-xs font-bold text-center leading-tight">
                        <div>70%</div>
                        <div>OFF</div>
                      </div>
                    </div>
                  </Card>

                  {/* Floating elements around showcase */}
                  <div className="absolute -top-6 -left-6 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/40 animate-bounce">
                    <Star className="h-6 w-6 text-black" />
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/40 animate-ping">
                    <Gift className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default LuxuryExclusiveBanner;