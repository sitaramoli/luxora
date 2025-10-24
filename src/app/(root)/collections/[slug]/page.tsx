'use client';

import {
  ArrowLeft,
  Calendar,
  Package,
  Star,
  Tag,
  ChevronRight,
  Home,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { PageLoader } from '@/components/PageLoader';
import ProductCard from '@/components/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { transformDatabaseProduct, type Product } from '@/types/product';
import { formatPriceRange, formatSeasonName } from '@/lib/utils';

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  image: string;
  coverImage: string | null;
  season: string;
  year: string;
  status: string;
  isFeatured: boolean;
  isNew: boolean;
  displayOrder: number;
  metaTitle: string | null;
  metaDescription: string | null;
  tags: string[] | null;
  priceRangeMin: string | null;
  priceRangeMax: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CollectionProduct {
  id: number;
  name: string;
  description: string;
  shortDescription: string | null;
  category: string;
  price: string;
  originalPrice: string;
  images: string[] | null;
  isFeatured: boolean;
  onSale: boolean;
  stockCount: number;
  status: string;
  createdAt: string;
  brandName: string | null;
  brandSlug: string | null;
  collectionItemId: string;
  displayOrder: number;
  isHighlighted: boolean;
  customDescription: string | null;
  addedAt: string;
}

const CollectionDetailPage: React.FC = () => {
  const params = useParams();
  const slug = params.slug as string;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<CollectionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollectionDetails = async () => {
      try {
        setLoading(true);

        // Fetch collection details
        const collectionResponse = await fetch(
          `/api/collections/${slug}?bySlug=true&includeProducts=true`
        );

        if (!collectionResponse.ok) {
          if (collectionResponse.status === 404) {
            setError('Collection not found');
          } else {
            throw new Error('Failed to fetch collection details');
          }
          return;
        }

        const data = await collectionResponse.json();
        setCollection(data.collection);
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching collection details:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCollectionDetails();
    }
  }, [slug]);

  // Transform products for ProductCard component
  const transformedProducts: Product[] = products.map(product =>
    transformDatabaseProduct({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      images: product.images,
      featured: product.isFeatured,
      onSale: product.onSale,
      stockCount: product.stockCount,
      createdAt: new Date(product.createdAt),
      brandName: product.brandName,
      brandSlug: product.brandSlug,
    })
  );

  if (loading) {
    return <PageLoader isLoading={loading} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error === 'Collection not found'
              ? 'Collection Not Found'
              : 'Error'}
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/collections">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Collections
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!collection) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 flex items-center">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/collections" className="hover:text-gray-900">
              Collections
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{collection.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src={collection.coverImage || collection.image}
          alt={collection.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              {collection.isNew && (
                <Badge className="bg-white/20 text-white border-white/30">
                  New Collection
                </Badge>
              )}
              {collection.isFeatured && (
                <Badge className="bg-white/20 text-white border-white/30">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              <Badge className="bg-white/20 text-white border-white/30">
                {formatSeasonName(collection.season)} {collection.year}
              </Badge>
            </div>
            <h1 className="text-5xl font-bold mb-4">{collection.name}</h1>
            <p className="text-xl">
              {collection.shortDescription || collection.description}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Collection Info */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Collection
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {collection.description}
              </p>

              {collection.tags && collection.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {collection.tags.map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Collection Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center">
                        <Package className="h-4 w-4 mr-2" />
                        Products
                      </span>
                      <span className="font-medium">{products.length}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Season
                      </span>
                      <span className="font-medium">
                        {formatSeasonName(collection.season)}
                      </span>
                    </div>

                    {(collection.priceRangeMin || collection.priceRangeMax) && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Price Range</span>
                        <span className="font-medium">
                          {formatPriceRange(
                            collection.priceRangeMin,
                            collection.priceRangeMax
                          )}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Year</span>
                      <span className="font-medium">{collection.year}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Products in this Collection
              </h2>
              <p className="text-gray-600 mt-2">
                {products.length} carefully curated luxury products
              </p>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {transformedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Products Yet
              </h3>
              <p className="text-gray-600">
                This collection doesn't have any products at the moment.
              </p>
            </div>
          )}
        </div>

        {/* Back to Collections */}
        <div className="mt-12 text-center">
          <Link href="/collections">
            <Button variant="outline" size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Collections
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CollectionDetailPage;
