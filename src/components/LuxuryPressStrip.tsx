import React from 'react';
import Image from 'next/image';

const logos = [
  { name: 'Vogue', src: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Vogue_logo.svg' },
  { name: 'GQ', src: 'https://upload.wikimedia.org/wikipedia/commons/3/32/GQ_Logo.svg' },
  { name: 'Harper’s Bazaar', src: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Harper%27s_Bazaar_logo.svg' },
  { name: 'Esquire', src: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Esquire_logo.svg' },
  { name: 'Elle', src: 'https://upload.wikimedia.org/wikipedia/commons/2/25/ELLE_Magazine_Logo.svg' },
];

const LuxuryPressStrip = () => {
  return (
    <section className="relative bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">As seen in</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center opacity-80">
          {logos.map((logo) => (
            <div key={logo.name} className="flex items-center justify-center">
              <div className="relative h-6 w-28 sm:h-8 sm:w-36 grayscale opacity-80">
                <Image src={logo.src} alt={logo.name} fill className="object-contain" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LuxuryPressStrip;
