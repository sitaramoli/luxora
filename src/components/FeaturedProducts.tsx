import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { fetchFeaturedProducts } from '@/lib/services/products';
import { transformDatabaseProduct, type DatabaseProduct } from '@/types/product';

const FeaturedProducts = async () => {
  const result = await fetchFeaturedProducts(4); // Fetch 4 featured products
  
  // Handle potential error or empty state
  if (!result.success || !result.data || result.data.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600">
                Handpicked luxury items from our expert curators
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="text-center py-12">
            <p className="text-gray-500">No featured products available at the moment.</p>
            <Link href="/products">
              <Button className="mt-4">
                Browse All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Transform database products to UI format
  const products = result.data.map((dbProduct: DatabaseProduct) => transformDatabaseProduct(dbProduct));

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Featured Products
            </h2>
            <p className="text-gray-600">
              Handpicked luxury items from our expert curators
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="group">
              View All
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
