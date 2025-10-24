import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchPublicCollections } from '@/lib/services/collections';

const CollectionsTeaser = async () => {
  const res = await fetchPublicCollections({ limit: 3, featured: true });
  const collections: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription?: string | null;
    image: string;
    productCount?: number;
  }> = Array.isArray((res as any)?.data?.collections)
    ? (res as any).data.collections
    : Array.isArray((res as any)?.data)
    ? (res as any).data
    : [];

  if (!collections.length) {
    return null;
  }

  return (
    <section className="bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-white">Featured Collections</h2>
            <p className="text-white/70 mt-2">Limited drops and seasonal edits, hand-picked by our curators</p>
          </div>
          <Link href="/collections">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">View all</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {collections.map((c) => (
            <Link key={c.id} href={`/collections/${c.slug}`}>
              <Card className="group relative overflow-hidden border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-lg font-semibold">{c.name}</h3>
                      <p className="text-sm text-white/70 line-clamp-1">{c.shortDescription ?? c.description}</p>
                    </div>
                    <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80">
                      {c.productCount ?? 0} items
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionsTeaser;
