'use client';

import { Search, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import { PageLoader } from '@/components/PageLoader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  isFeatured: boolean;
  isNew: boolean;
  displayOrder: number;
  tags: string[] | null;
  priceRangeMin: string | null;
  priceRangeMax: string | null;
  createdAt: string;
  productCount: number;
}

const CollectionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch collections from API
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/collections');

        if (!response.ok) {
          throw new Error('Failed to fetch collections');
        }

        const data: Collection[] = await response.json();
        setCollections(data);
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const filteredCollections = collections.filter(collection => {
    const matchesSearch =
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeason =
      seasonFilter === 'all' ||
      collection.season.toLowerCase() === seasonFilter.toLowerCase();
    return matchesSearch && matchesSeason;
  });

  const sortedCollections = [...filteredCollections].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'name':
        return a.name.localeCompare(b.name);
      case 'products':
        return b.productCount - a.productCount;
      default:
        return 0;
    }
  });

  if (loading) {
    return <PageLoader isLoading={loading} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Collections Hero"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-5xl font-bold mb-4">Curated Collections</h1>
            <p className="text-xl">
              Discover our expertly curated collections featuring the finest
              luxury pieces from around the world
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Bar */}
        <div className="mb-8 bg-gray-50 rounded-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search collections..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Select value={seasonFilter} onValueChange={setSeasonFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Seasons</SelectItem>
                  <SelectItem value="spring">Spring</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="fall">Fall</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
                  <SelectItem value="all_season">All Season</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="products">Most Products</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Featured Collections */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Featured Collections
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sortedCollections
              .filter(c => c.isFeatured)
              .slice(0, 2)
              .map(collection => (
                <Card
                  key={collection.id}
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 p-0"
                >
                  <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        {collection.isNew && (
                          <Badge className="bg-white/20 text-white border-white/30">
                            New
                          </Badge>
                        )}
                        <Badge className="bg-white/20 text-white border-white/30">
                          {formatSeasonName(collection.season)}
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        {collection.name}
                      </h3>
                      <p className="text-sm opacity-90">
                        {collection.productCount} products
                      </p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-4">
                      {collection.shortDescription || collection.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <p className="font-medium">Price Range:</p>
                        <p>
                          {formatPriceRange(
                            collection.priceRangeMin,
                            collection.priceRangeMax
                          )}
                        </p>
                      </div>
                      <Link href={`/collections/${collection.slug}`}>
                        <Button>
                          Explore
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* All Collections */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCollections.map(collection => (
              <Card
                key={collection.id}
                className="group cursor-pointer hover:shadow-lg transition-shadow p-0"
              >
                <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {collection.isNew && (
                      <Badge className="bg-black/80 text-white">New</Badge>
                    )}
                    {collection.isFeatured && (
                      <Badge className="bg-white/90 text-black">Featured</Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {collection.name}
                    </h3>
                    <Badge variant="secondary">
                      {formatSeasonName(collection.season)}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {collection.shortDescription || collection.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{collection.productCount} products</span>
                    <span>
                      {formatPriceRange(
                        collection.priceRangeMin,
                        collection.priceRangeMax
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {collection.year} •{' '}
                      {collection.tags?.slice(0, 2).join(', ') ||
                        'Luxury Collection'}
                    </div>
                    <Link href={`/collections/${collection.slug}`}>
                      <Button size="sm">View Collection</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {sortedCollections.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No collections found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;
