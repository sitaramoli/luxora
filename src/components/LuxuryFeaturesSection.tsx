'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Shield, 
  Truck, 
  HeartHandshake,
  Crown,
  Sparkles,
  Award,
  Clock,
  Star,
  Users,
  Globe,
  Gem,
  Headphones
} from 'lucide-react';

// Luxury services data
const luxuryServices = [
  {
    id: 1,
    icon: Shield,
    title: "Authenticity Guaranteed",
    description: "Every piece is meticulously verified by our team of luxury experts using advanced authentication technology.",
    features: ["Expert Authentication", "Blockchain Verification", "Lifetime Guarantee"],
    color: "yellow"
  },
  {
    id: 2,
    icon: Crown,
    title: "White Glove Delivery",
    description: "Premium concierge delivery service with signature packaging and personalized presentation.",
    features: ["Concierge Service", "Signature Packaging", "Scheduled Delivery"],
    color: "purple"
  },
  {
    id: 3,
    icon: Headphones,
    title: "24/7 Luxury Concierge",
    description: "Dedicated luxury shopping assistants available around the clock for personalized service.",
    features: ["Personal Stylist", "24/7 Support", "VIP Assistance"],
    color: "blue"
  },
  {
    id: 4,
    icon: Star,
    title: "Exclusive Collections",
    description: "Access to limited edition pieces and pre-release collections from top luxury brands.",
    features: ["Limited Editions", "Pre-Release Access", "Exclusive Collaborations"],
    color: "green"
  },
  {
    id: 5,
    icon: Gem,
    title: "Investment Tracking",
    description: "Professional valuation and investment tracking for your luxury collection portfolio.",
    features: ["Market Valuation", "Investment Analytics", "Portfolio Management"],
    color: "pink"
  },
  {
    id: 6,
    icon: Globe,
    title: "Global VIP Network",
    description: "Access to exclusive events, private sales, and VIP experiences in luxury capitals worldwide.",
    features: ["Exclusive Events", "Private Sales", "Global Access"],
    color: "orange"
  }
];

// Animated counter component
const AnimatedCounter = ({ end, suffix = "" }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
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
    }
  }, [isVisible, end]);

  return (
    <div ref={ref} className="text-4xl font-bold text-white">
      {Math.floor(count).toLocaleString()}{suffix}
    </div>
  );
};

const LuxuryFeaturesSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

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

  const getColorClasses = (color: string) => {
    const colorMap = {
      yellow: {
        bg: "from-yellow-400/20 to-yellow-300/10",
        border: "border-yellow-400/30",
        text: "text-yellow-400",
        glow: "shadow-yellow-400/20"
      },
      purple: {
        bg: "from-purple-400/20 to-purple-300/10", 
        border: "border-purple-400/30",
        text: "text-purple-400",
        glow: "shadow-purple-400/20"
      },
      blue: {
        bg: "from-blue-400/20 to-blue-300/10",
        border: "border-blue-400/30", 
        text: "text-blue-400",
        glow: "shadow-blue-400/20"
      },
      green: {
        bg: "from-green-400/20 to-green-300/10",
        border: "border-green-400/30",
        text: "text-green-400", 
        glow: "shadow-green-400/20"
      },
      pink: {
        bg: "from-pink-400/20 to-pink-300/10",
        border: "border-pink-400/30",
        text: "text-pink-400",
        glow: "shadow-pink-400/20"
      },
      orange: {
        bg: "from-orange-400/20 to-orange-300/10",
        border: "border-orange-400/30", 
        text: "text-orange-400",
        glow: "shadow-orange-400/20"
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.yellow;
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-black via-gray-950 to-black overflow-hidden"
    >
      {/* Luxury background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-yellow-400/30 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-transparent via-white/1 to-transparent rounded-full animate-spin" style={{ animationDuration: '80s' }} />
      </div>

      {/* Premium pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 40% 40%, white 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className={`text-center mb-20 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400/10 to-purple-400/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10 mb-6">
            <Award className="h-5 w-5 text-yellow-400" />
            <span className="text-white/90 font-medium">Premium Services</span>
            <Sparkles className="h-5 w-5 text-yellow-400" />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-white animate-gradient">
              Luxury Experience
            </span>
          </h2>
          
          <p className="text-xl text-white/70 max-w-4xl mx-auto leading-relaxed">
            Elevating luxury shopping through unparalleled service, expert curation, 
            and personalized experiences that redefine what it means to shop for luxury.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {luxuryServices.map((service, index) => {
            const colors = getColorClasses(service.color);
            const IconComponent = service.icon;
            
            return (
              <div
                key={service.id}
                className={`group relative ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 150}ms` }}
                onMouseEnter={() => setHoveredFeature(service.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <Card className={`relative h-full bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent border border-white/10 backdrop-blur-xl p-8 transition-all duration-700 hover:scale-105 hover:border-white/30 group-hover:shadow-2xl ${colors.glow}`}>
                  
                  {/* Service icon with gradient background */}
                  <div className={`relative w-20 h-20 bg-gradient-to-br ${colors.bg} rounded-2xl flex items-center justify-center mb-6 border ${colors.border} group-hover:scale-110 transition-transform duration-500`}>
                    <IconComponent className={`h-10 w-10 ${colors.text}`} />
                    
                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
                  </div>

                  {/* Service content */}
                  <div className="space-y-4">
                    <h3 className={`text-2xl font-bold text-white group-hover:${colors.text.replace('text-', 'text-')} transition-colors duration-300`}>
                      {service.title}
                    </h3>
                    
                    <p className="text-white/70 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Service features */}
                    <div className="space-y-2 pt-4 border-t border-white/10">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <div className={`w-2 h-2 ${colors.bg} rounded-full`} />
                          <span className="text-white/60 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none`} />
                  
                  {/* Animated border */}
                  {hoveredFeature === service.id && (
                    <div className="absolute inset-0 rounded-lg">
                      <div className={`absolute inset-0 bg-gradient-to-r ${colors.bg} rounded-lg blur-sm animate-pulse`} />
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>

        {/* Luxury Stats Section */}
        <div className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '800ms' }}>
          <Card className="relative bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent border border-white/10 backdrop-blur-xl p-12 overflow-hidden">
            
            {/* Premium background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `linear-gradient(45deg, transparent 40%, white 50%, transparent 60%)`,
                backgroundSize: '20px 20px',
                animation: 'shimmer 3s ease-in-out infinite'
              }} />
            </div>

            <div className="relative z-10">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Trusted by Luxury Enthusiasts Worldwide
                </h3>
                <p className="text-white/70 max-w-2xl mx-auto">
                  Our commitment to excellence has earned the trust of discerning customers across the globe.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <AnimatedCounter end={250000} suffix="+" />
                  <div className="text-white/60 mt-2">Luxury Items Sold</div>
                  <div className="w-12 h-1 bg-gradient-to-r from-yellow-400 to-transparent mx-auto mt-3 rounded-full" />
                </div>
                
                <div className="text-center">
                  <AnimatedCounter end={98} suffix="%" />
                  <div className="text-white/60 mt-2">Customer Satisfaction</div>
                  <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-transparent mx-auto mt-3 rounded-full" />
                </div>
                
                <div className="text-center">
                  <AnimatedCounter end={500} suffix="+" />
                  <div className="text-white/60 mt-2">Luxury Brands</div>
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-transparent mx-auto mt-3 rounded-full" />
                </div>
                
                <div className="text-center">
                  <AnimatedCounter end={45} />
                  <div className="text-white/60 mt-2">Countries Served</div>
                  <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-transparent mx-auto mt-3 rounded-full" />
                </div>
              </div>

              {/* Premium guarantee */}
              <div className="mt-12 text-center">
                <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-yellow-400/20 to-purple-400/20 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-black" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-bold">Lifetime Authenticity Guarantee</div>
                    <div className="text-white/70 text-sm">Every purchase backed by our authentication promise</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
};

export default LuxuryFeaturesSection;