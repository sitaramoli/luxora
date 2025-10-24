import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { fetchPublicCollectionsForBrand } from '@/lib/services/collections';
import { fetchBrandByIdWithProducts } from '@/lib/services/merchants';
import {
  transformDatabaseProduct,
  type DatabaseProduct,
} from '@/types/product';

interface PageProps {
  params: { id: string };
}

const BrandDetailPage = async ({ params }: PageProps) => {
  const id = params.id;
  const res = await fetchBrandByIdWithProducts(id);
  if (!res.success || !res.data) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-semibold text-white mb-2">
            Brand not found
          </h1>
          <p className="text-white/70 mb-6">
            The brand you are looking for doesn’t exist or may have been
            removed.
          </p>
          <Link href="/brands">
            <Button className="bg-white text-black hover:bg-yellow-300">
              Back to Brands
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  const { brand, products } = res.data;
  const transformed = (products as DatabaseProduct[]).map(
    transformDatabaseProduct
  );

  // Fetch collections loosely related to brand name
  const collectionsRes = await fetchPublicCollectionsForBrand(brand.name, 6);
  const collections = collectionsRes.success ? collectionsRes.data : [];

  return (
    <section className="bg-gradient-to-b from-black via-gray-950 to-black">
      {/* Hero */}
      <div className="relative h-[420px] overflow-hidden">
        <Image
          src={brand.coverImage || brand.image}
          alt={brand.name}
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        <div className="relative z-10 h-full container mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-300" />
              <span className="text-sm text-white/80">Prestigious Partner</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {brand.name}
            </h1>
            <p className="text-white/80">
              {brand.description || brand.shortDescription}
            </p>
            <div className="flex items-center gap-6 text-white/80 text-sm">
              <span className="rounded-full border border-white/15 px-3 py-1">
                Category: {brand.category}
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1">
                Products: {brand.productCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 border border-white/20">
            <TabsTrigger value="products" className="text-white">
              Products
            </TabsTrigger>
            <TabsTrigger value="about" className="text-white">
              About
            </TabsTrigger>
            <TabsTrigger value="collections" className="text-white">
              Collections
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Latest from {brand.name}
                </h2>
                <p className="text-white/70">
                  Handpicked items from this house
                </p>
              </div>
              <Link href="/products">
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  View all products
                </Button>
              </Link>
            </div>

            {transformed.length === 0 ? (
              <Card className="bg-white/5 border-white/10 p-8 text-center text-white/70">
                No products available.
              </Card>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:[&>*]:snap-start md:snap-x md:overflow-x-auto">
                {transformed.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-8">
            <Card className="bg-white/5 border-white/10 p-8 text-white/80">
              <h3 className="text-xl font-semibold text-white mb-4">
                About {brand.name}
              </h3>
              <p className="leading-relaxed">{brand.description}</p>
            </Card>
          </TabsContent>

          <TabsContent value="collections" className="mt-8">
            {!collections || collections.length === 0 ? (
              <Card className="bg-white/5 border-white/10 p-8 text-center text-white/70">
                No collections found for this brand.
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((c: any) => (
                  <Link key={c.id} href={`/collections/${c.slug}`}>
                    <Card className="relative overflow-hidden bg-white/5 border-white/10 group">
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={c.image}
                          alt={c.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <h4 className="text-white font-semibold">{c.name}</h4>
                        <p className="text-white/70 text-sm line-clamp-1">
                          {c.shortDescription || c.description}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default BrandDetailPage;
