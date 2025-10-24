import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Star, Sparkles, Quote } from 'lucide-react';
import { getHighestRatedTestimonials } from '@/lib/services/testimonials';

const LuxuryTestimonials = async () => {
  const testimonials = await getHighestRatedTestimonials(6);
  if (!testimonials?.length) return null;

  return (
    <section className="relative py-24 bg-gradient-to-b from-black via-gray-950 to-black overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400/10 to-purple-400/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10 mb-6">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            <span className="text-white/90 font-medium">What Our Clients Say</span>
            <Sparkles className="h-5 w-5 text-yellow-400" />
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-white">
              Testimonials
            </span>
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto">
            Experiences from our discerning community, celebrating craftsmanship, service, and authenticity.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <Card
              key={t.id}
              className="relative overflow-hidden bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent border border-white/10 backdrop-blur-xl p-8 transition-all duration-500 hover:border-white/20"
            >
              {/* Decorative corner */}
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-yellow-400/20" />

              <div className="flex items-center gap-4 mb-5">
                <div className="relative h-12 w-12 rounded-full overflow-hidden border border-white/20 bg-white/10">
                  {t.avatar ? (
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  ) : (
                    <div className="h-full w-full" />
                  )}
                </div>
                <div>
                  <div className="text-white font-semibold">{t.name}</div>
                  {t.role && <div className="text-white/60 text-sm">{t.role}</div>}
                </div>
              </div>

              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < (t.rating ?? 0) ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`}
                  />
                ))}
              </div>

              <div className="relative">
                <Quote className="absolute -left-2 -top-2 h-5 w-5 text-yellow-400/70" />
                <p className="text-white/80 pl-5">“{t.content}”</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LuxuryTestimonials;
