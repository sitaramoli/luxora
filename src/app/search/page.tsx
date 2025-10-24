'use client';

import { debounce } from 'lodash';
import { Search, SlidersHorizontal, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { PageLoader } from '@/components/PageLoader';
import ProductCard from '@/components/ProductCard';
import ProductsPagination from '@/components/ProductsPagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { transformDatabaseProduct, type Product } from '@/types/product';

interface SearchResponse {
  products: Array<{
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
    createdAt: Date;
    brandName: string | null;
    brandSlug: string | null;
    status: string;
  }>;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  categories: string[];
  brands: Array<{ id: string; name: string }>;
}

const SearchPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get initial search query from URL
  const initialQuery = searchParams.get('q') || '';

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const [selectedBrand, setSelectedBrand] = useState(
    searchParams.get('brandId') || 'all'
  );
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(
    searchParams.get('sortBy') || 'featured'
  );
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1')
  );

  // Applied price filters (only used when Apply button is clicked)
  const [appliedMinPrice, setAppliedMinPrice] = useState(
    searchParams.get('minPrice') || ''
  );
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(
    searchParams.get('maxPrice') || ''
  );

  // Active filters
  const [onSale, setOnSale] = useState<boolean | undefined>(
    searchParams.get('onSale') === 'true'
      ? true
      : searchParams.get('onSale') === 'false'
        ? false
        : undefined
  );
  const [isNew, setIsNew] = useState<boolean | undefined>(
    searchParams.get('isNew') === 'true'
      ? true
      : searchParams.get('isNew') === 'false'
        ? false
        : undefined
  );

  // Data states
  const [searchData, setSearchData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortOptions = [
    { value: 'featured', label: 'Most Relevant' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'createdAt', label: 'Newest First' },
    { value: 'name', label: 'Name A-Z' },
  ];

  // Update URL params
  const updateUrlParams = useCallback(
    (params: Record<string, string>) => {
      const newSearchParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== 'all' && value !== '1' && value !== '') {
          newSearchParams.set(key, value);
        }
      });

      const newUrl = `${pathname}?${newSearchParams.toString()}`;
      router.replace(newUrl, { scroll: false });
    },
    [pathname, router]
  );

  // Fetch search results
  const fetchSearchResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: '20',
        search: searchQuery,
        category: selectedCategory === 'all' ? '' : selectedCategory,
        brandId: selectedBrand === 'all' ? '' : selectedBrand,
        sortBy,
        sortOrder: 'desc',
      });

      if (appliedMinPrice) params.set('minPrice', appliedMinPrice);
      if (appliedMaxPrice) params.set('maxPrice', appliedMaxPrice);
      if (onSale !== undefined) params.set('onSale', onSale.toString());
      if (isNew !== undefined) params.set('isNew', isNew.toString());

      const response = await fetch(`/api/products?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data: SearchResponse = await response.json();
      setSearchData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    searchQuery,
    selectedCategory,
    selectedBrand,
    appliedMinPrice,
    appliedMaxPrice,
    sortBy,
    onSale,
    isNew,
  ]);

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        setCurrentPage(1);
        updateUrlParams({
          q: query,
          category: selectedCategory,
          brandId: selectedBrand,
          sortBy,
          page: '1',
          minPrice: appliedMinPrice,
          maxPrice: appliedMaxPrice,
          onSale: onSale?.toString() || '',
          isNew: isNew?.toString() || '',
        });
      }, 500),
    [
      selectedCategory,
      selectedBrand,
      sortBy,
      appliedMinPrice,
      appliedMaxPrice,
      onSale,
      isNew,
      updateUrlParams,
    ]
  );

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Handle filters change
  const handleFiltersChange = (filters: {
    category?: string;
    brandId?: string;
    sortBy?: string;
    minPrice?: string;
    maxPrice?: string;
    onSale?: boolean | undefined;
    isNew?: boolean | undefined;
  }) => {
    setCurrentPage(1);
    updateUrlParams({
      q: searchQuery,
      category: filters.category || selectedCategory,
      brandId: filters.brandId || selectedBrand,
      sortBy: filters.sortBy || sortBy,
      minPrice: filters.minPrice || appliedMinPrice,
      maxPrice: filters.maxPrice || appliedMaxPrice,
      page: '1',
      onSale: filters.onSale?.toString() || '',
      isNew: filters.isNew?.toString() || '',
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlParams({
      q: searchQuery,
      category: selectedCategory,
      brandId: selectedBrand,
      sortBy,
      minPrice: appliedMinPrice,
      maxPrice: appliedMaxPrice,
      page: page.toString(),
      onSale: onSale?.toString() || '',
      isNew: isNew?.toString() || '',
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle applying price filter
  const handleApplyPriceFilter = () => {
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
    handleFiltersChange({ minPrice, maxPrice });
  };

  // Handle badge filters
  const handleBadgeFilter = (type: 'new' | 'sale') => {
    switch (type) {
      case 'new':
        const newIsNew = isNew ? undefined : true;
        setIsNew(newIsNew);
        handleFiltersChange({ isNew: newIsNew });
        break;
      case 'sale':
        const newOnSale = onSale ? undefined : true;
        setOnSale(newOnSale);
        handleFiltersChange({ onSale: newOnSale });
        break;
    }
  };

  // Clear all filters except search query
  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMinPrice('');
    setMaxPrice('');
    setAppliedMinPrice('');
    setAppliedMaxPrice('');
    setOnSale(undefined);
    setIsNew(undefined);
    setSortBy('featured');
    setCurrentPage(1);

    updateUrlParams({
      q: searchQuery,
      category: 'all',
      brandId: 'all',
      sortBy: 'featured',
      minPrice: '',
      maxPrice: '',
      page: '1',
      onSale: '',
      isNew: '',
    });
  };

  // Transform products data
  const transformedProducts: Product[] = useMemo(() => {
    if (!searchData?.products) return [];
    return searchData.products.map(transformDatabaseProduct);
  }, [searchData?.products]);

  // Count active filters (excluding search query)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedBrand !== 'all') count++;
    if (appliedMinPrice) count++;
    if (appliedMaxPrice) count++;
    if (onSale) count++;
    if (isNew) count++;
    return count;
  }, [
    selectedCategory,
    selectedBrand,
    appliedMinPrice,
    appliedMaxPrice,
    onSale,
    isNew,
  ]);

  // Fetch data when dependencies change
  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults();
    } else {
      setSearchData(null);
      setLoading(false);
    }
  }, [fetchSearchResults, searchQuery]);

  // Cleanup debounced function
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          {searchQuery ? (
            <p className="text-gray-600">
              Results for <span className="font-semibold">"{searchQuery}"</span>
            </p>
          ) : (
            <p className="text-gray-600">
              Enter a search term to find luxury products
            </p>
          )}
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search luxury items..."
                value={searchQuery}
                onChange={e => handleSearchChange(e.target.value)}
                className="pl-10"
                disabled={loading}
                autoFocus
              />
            </div>

            {/* Quick Filters */}
            {searchData && (
              <div className="flex gap-2 flex-wrap">
                <Select
                  value={selectedCategory}
                  onValueChange={value => {
                    setSelectedCategory(value);
                    handleFiltersChange({ category: value });
                  }}
                  disabled={loading}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {searchData.categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedBrand}
                  onValueChange={value => {
                    setSelectedBrand(value);
                    handleFiltersChange({ brandId: value });
                  }}
                  disabled={loading}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {searchData.brands.map(brand => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  More Filters
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 w-5 p-0 text-xs"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>

                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    onClick={clearAllFilters}
                    className="flex items-center gap-2"
                    disabled={loading}
                  >
                    <X className="h-4 w-4" />
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && searchData && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Price Range
                  </Label>
                  <div className="flex items-center space-x-2">
                    <div className="relative w-full">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        $
                      </span>
                      <Input
                        type="number"
                        value={minPrice}
                        onChange={e => setMinPrice(e.target.value)}
                        placeholder="Min"
                        className={`pl-7 ${minPrice !== appliedMinPrice ? 'border-orange-300 bg-orange-50' : ''}`}
                        min="0"
                        disabled={loading}
                      />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="relative w-full">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        $
                      </span>
                      <Input
                        type="number"
                        value={maxPrice}
                        onChange={e => setMaxPrice(e.target.value)}
                        placeholder="Max"
                        className={`pl-7 ${maxPrice !== appliedMaxPrice ? 'border-orange-300 bg-orange-50' : ''}`}
                        min="0"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  {(minPrice !== appliedMinPrice ||
                    maxPrice !== appliedMaxPrice) && (
                    <p className="text-xs text-orange-600 mt-2">
                      Click "Apply Price Filter" to update results
                    </p>
                  )}
                  <Button
                    onClick={handleApplyPriceFilter}
                    className={`mt-4 w-full ${
                      minPrice !== appliedMinPrice ||
                      maxPrice !== appliedMaxPrice
                        ? 'bg-orange-600 hover:bg-orange-700'
                        : ''
                    }`}
                    disabled={loading}
                    variant={
                      minPrice !== appliedMinPrice ||
                      maxPrice !== appliedMaxPrice
                        ? 'default'
                        : 'outline'
                    }
                  >
                    Apply Price Filter
                    {(minPrice !== appliedMinPrice ||
                      maxPrice !== appliedMaxPrice) && (
                      <span className="ml-1 text-xs">•</span>
                    )}
                  </Button>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Quick Filters
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={isNew ? 'default' : 'secondary'}
                      className="cursor-pointer hover:bg-gray-300"
                      onClick={() => handleBadgeFilter('new')}
                    >
                      New Arrivals {isNew && <X className="ml-1 h-3 w-3" />}
                    </Badge>
                    <Badge
                      variant={onSale ? 'default' : 'secondary'}
                      className="cursor-pointer hover:bg-gray-300"
                      onClick={() => handleBadgeFilter('sale')}
                    >
                      On Sale {onSale && <X className="ml-1 h-3 w-3" />}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        {!loading && !error && searchData && searchQuery && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <p className="text-gray-600">
              Showing {transformedProducts.length} of{' '}
              {searchData.pagination.totalItems} results
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              {selectedBrand !== 'all' &&
                ` from ${searchData.brands.find(b => b.id === selectedBrand)?.name}`}
            </p>
            <div className="flex items-center gap-4">
              <Select
                value={sortBy}
                onValueChange={value => {
                  setSortBy(value);
                  handleFiltersChange({ sortBy: value });
                }}
                disabled={loading}
              >
                <SelectTrigger className="w-48">
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
              <p className="text-sm text-gray-500 hidden sm:block">
                Page {searchData.pagination.currentPage} of{' '}
                {searchData.pagination.totalPages}
              </p>
            </div>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error loading search results
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchSearchResults} disabled={loading}>
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State - No Search Query */}
        {!loading && !error && !searchQuery && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Start Your Search
            </h3>
            <p className="text-gray-600 mb-4">
              Enter keywords to search our collection of luxury products
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!loading &&
          !error &&
          transformedProducts.length > 0 &&
          searchQuery && (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {transformedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        {/* No Results State */}
        {!loading &&
          !error &&
          transformedProducts.length === 0 &&
          searchQuery && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 mb-4">
                {activeFiltersCount > 0
                  ? `No products found for "${searchQuery}" with current filters. Try adjusting your search criteria.`
                  : `No products found for "${searchQuery}". Try different keywords or check your spelling.`}
              </p>
              {activeFiltersCount > 0 && (
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  className="mr-4"
                >
                  Clear Filters
                </Button>
              )}
              <Link href="/products">
                <Button variant="outline">Browse All Products</Button>
              </Link>
            </div>
          )}

        {/* Pagination */}
        {!loading &&
          !error &&
          searchData &&
          searchData.pagination.totalPages > 1 && (
            <ProductsPagination
              currentPage={searchData.pagination.currentPage}
              totalPages={searchData.pagination.totalPages}
              hasNext={searchData.pagination.hasNext}
              hasPrevious={searchData.pagination.hasPrevious}
              onPageChange={handlePageChange}
            />
          )}
      </div>
    </div>
  );
};

export default SearchPage;
