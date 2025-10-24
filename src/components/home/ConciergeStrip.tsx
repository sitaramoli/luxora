import React from 'react';
import { Shield, Truck, Headphones } from 'lucide-react';

const items = [
  {
    icon: Shield,
    title: 'Authenticity Guaranteed',
    subtitle: 'Lifetime assurance by luxury experts',
  },
  {
    icon: Truck,
    title: 'Concierge Delivery',
    subtitle: 'White-glove, scheduled service',
  },
  {
    icon: Headphones,
    title: '24/7 Luxury Concierge',
    subtitle: 'Personalized assistance anytime',
  },
];

const ConciergeStrip = () => {
  return (
    <section className="bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {items.map(({ icon: Icon, title, subtitle }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-white transition-colors hover:bg-white/[0.06]"
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 rounded-xl bg-white/10 p-2">
                  <Icon className="h-5 w-5 text-yellow-300" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">{title}</h3>
                  <p className="text-sm text-white/70">{subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConciergeStrip;
