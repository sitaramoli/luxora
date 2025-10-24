import React from 'react';
import LuxuryFeaturedProducts from '@/components/LuxuryFeaturedProducts';
import { fetchFeaturedProducts } from '@/lib/services/products';
import { transformDatabaseProduct, type DatabaseProduct } from '@/types/product';

const LuxuryFeaturedProductsServer = async () => {
  const res = await fetchFeaturedProducts(8);
  const products = (res?.success ? (res.data as DatabaseProduct[]) : []).map(transformDatabaseProduct);

  if (!products.length) return null;

  return <LuxuryFeaturedProducts products={products} />;
};

export default LuxuryFeaturedProductsServer;
