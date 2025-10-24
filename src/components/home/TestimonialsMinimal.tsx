import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { getHighestRatedTestimonials } from '@/lib/services/testimonials';

const TestimonialsMinimal = async () => {
  const testimonials = await getHighestRatedTestimonials(6);
  if (!testimonials?.length) return null;

  return (
    <section className="bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-white">Loved by our community</h2>
          <p className="text-white/70 mt-2">Real voices, real experiences</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Card
              key={t.id}
              className="border-white/10 bg-white/[0.03] p-6 text-white"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/10">
                  {t.avatar ? (
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  ) : null}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  {t.role ? (
                    <div className="text-xs text-white/60">{t.role}</div>
                  ) : null}
                </div>
              </div>

              <div className="mb-3 flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < (t.rating ?? 0) ? 'text-yellow-300 fill-yellow-300' : 'text-white/30'}`}
                  />)
                )}
              </div>

              <p className="text-sm text-white/80">“{t.content}”</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsMinimal;
