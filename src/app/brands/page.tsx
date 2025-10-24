'use client';

import { debounce } from 'lodash';
import { Search } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import React, { useState, useEffect, useCallback, useMemo } from 'react';

import BrandCard from '@/components/BrandCard';
import BrandsPagination from '@/components/BrandsPagination';
import { PageLoader } from '@/components/PageLoader';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { transformDatabaseMerchant, type Brand } from '@/types/brand';

interface BrandsResponse {
  brands: Array<{
    id: string;
    name: string;
    description: string;
    shortDescription: string;
    category: string;
    image: string;
    logo: string | null;
    coverImage: string;
    isFeatured: boolean;
    status: string;
    createdAt: Date;
    productCount: number;
  }>;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

const BrandsPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get initial values from URL params
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get('category') || 'all'
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get('sortBy') || 'productCount'
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1')
  );

  // Data states
  const [brandsData, setBrandsData] = useState<BrandsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'watches', label: 'Watches' },
    { value: 'luxury goods', label: 'Luxury Goods' },
  ];

  const sortOptions = [
    { value: 'productCount', label: 'Most Products' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'createdAt', label: 'Newest First' },
  ];

  // Update URL params
  const updateUrlParams = useCallback(
    (params: Record<string, string>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== 'all' && value !== '1' && value !== '') {
          newSearchParams.set(key, value);
        } else {
          newSearchParams.delete(key);
        }
      });

      const newUrl = `${pathname}?${newSearchParams.toString()}`;
      router.replace(newUrl, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Fetch brands data
  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: '20',
        search: searchQuery,
        category: categoryFilter === 'all' ? '' : categoryFilter,
        sortBy,
        sortOrder: 'desc',
      });

      const response = await fetch(`/api/brands?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch brands');
      }

      const data: BrandsResponse = await response.json();
      setBrandsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, categoryFilter, sortBy]);

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        setCurrentPage(1);
        updateUrlParams({
          search: query,
          category: categoryFilter,
          sortBy,
          page: '1',
        });
      }, 500),
    [categoryFilter, sortBy, updateUrlParams]
  );

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
    updateUrlParams({
      search: searchQuery,
      category: value,
      sortBy,
      page: '1',
    });
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
    updateUrlParams({
      search: searchQuery,
      category: categoryFilter,
      sortBy: value,
      page: '1',
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlParams({
      search: searchQuery,
      category: categoryFilter,
      sortBy,
      page: page.toString(),
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Transform brands data
  const transformedBrands: Brand[] = useMemo(() => {
    if (!brandsData?.brands) return [];
    return brandsData.brands.map(transformDatabaseMerchant);
  }, [brandsData?.brands]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // Cleanup debounced function
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Luxury Brands</h1>
          <p className="text-white/70">
            Discover collections from the world's most prestigious brands
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search brands..."
                value={searchQuery}
                onChange={e => handleSearchChange(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white focus:ring-white"
                disabled={loading}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <Select
                value={categoryFilter}
                onValueChange={handleCategoryChange}
                disabled={loading}
              >
                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={handleSortChange}
                disabled={loading}
              >
                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        {!loading && !error && brandsData && (
          <div className="flex justify-between items-center mb-6">
            <p className="text-white/70">
              Showing {transformedBrands.length} of{' '}
              {brandsData.pagination.totalItems} brands
              {searchQuery && ` for \"${searchQuery}\"`}
              {categoryFilter !== 'all' && ` in ${categoryFilter}`}
            </p>
            <p className="text-sm text-white/60">
              Page {brandsData.pagination.currentPage} of{' '}
              {brandsData.pagination.totalPages}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && <PageLoader isLoading={loading} />}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Error loading brands
            </h3>
            <p className="text-white/70 mb-4">{error}</p>
            <button
              onClick={fetchBrands}
              className="px-4 py-2 border border-white text-white rounded-md hover:bg-white hover:text-black transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Brands Grid */}
        {!loading && !error && transformedBrands.length > 0 && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {transformedBrands.map(brand => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && transformedBrands.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white/40 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              No brands found
            </h3>
            <p className="text-white/70">
              {searchQuery || categoryFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No brands are available at the moment'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading &&
          !error &&
          brandsData &&
          brandsData.pagination.totalPages > 1 && (
            <BrandsPagination
              currentPage={brandsData.pagination.currentPage}
              totalPages={brandsData.pagination.totalPages}
              hasNext={brandsData.pagination.hasNext}
              hasPrevious={brandsData.pagination.hasPrevious}
              onPageChange={handlePageChange}
            />
          )}
      </div>
    </div>
  );
};

export default BrandsPage;
