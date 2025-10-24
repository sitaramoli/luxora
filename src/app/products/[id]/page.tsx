import { notFound } from 'next/navigation';
import React from 'react';

import ProductDetails from '@/components/ProductDetails';
import { fetchProductById } from '@/lib/services/products';
import type { Product as UIProduct, Review } from '@/types';

interface PageProps {
  params: { id: string };
}

function mapToUIProduct(db: any): UIProduct {
  return {
    id: String(db.id),
    name: db.name,
    brand: db.brandName || 'Unknown Brand',
    price: Number(db.price),
    originalPrice: db.originalPrice ? Number(db.originalPrice) : undefined,
    rating: 4.6,
    reviewCount: 0,
    category: 'Luxury',
    isNew: db.createdAt
      ? new Date(db.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
      : false,
    isSale: !!db.onSale,
    description: db.description || '',
    features: db.features || [],
    images:
      Array.isArray(db.images) && db.images.length > 0
        ? db.images
        : ['/images/placeholder-product.jpg'],
    sizes: db.sizes || [],
    colors: (db.colors || []).map((c: string) => ({ name: c, value: c })),
    inStock: (db.stockCount || 0) > 0,
    stockCount: db.stockCount || 0,
    slug: db.brandSlug || '',
  };
}

const ProductPage = async ({ params }: PageProps) => {
  const numericId = Number(params.id);
  if (Number.isNaN(numericId)) return notFound();

  const res = await fetchProductById(numericId);
  if (!res.success || !res.data) return notFound();

  const product = mapToUIProduct(res.data);

  // Fetch product reviews and related products
  const [reviewsRes, relatedRes] = await Promise.all([
    (await import('@/lib/services/products')).fetchProductReviews(
      Number(params.id),
      10
    ),
    (await import('@/lib/services/products')).fetchRelatedProductsByMerchant(
      res.data.merchantId as string,
      Number(params.id),
      8
    ),
  ]);

  const reviews: Review[] = (reviewsRes.success ? reviewsRes.data : []).map(
    (r: any) => ({
      id: r.id,
      user: r.userName || 'Anonymous',
      rating: r.rating,
      date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
      comment: r.comment || '',
    })
  );

  const relatedProducts: any[] = (
    relatedRes.success ? relatedRes.data : []
  ).map(mapToUIProduct);

  return (
    <section className="bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetails
          product={product}
          reviews={reviews}
          relatedProducts={relatedProducts}
        />
      </div>
    </section>
  );
};

export default ProductPage;
