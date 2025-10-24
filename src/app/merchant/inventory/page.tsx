'use client';

import { debounce } from 'lodash';
import {
  Search,
  Edit,
  AlertTriangle,
  TrendingUp,
  Package,
  Plus,
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Tag,
  DollarSign,
  MoreHorizontal,
  Calendar,
  Loader,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

import { StatCard } from '@/components/dashboard/StatCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { miniChartData } from '@/constants/dashboard-data';
import {
  fetchMerchantProducts,
  updateProductStock,
  getMerchantProductCategories,
} from '@/lib/services/products';
import { getProductStatusColor } from '@/lib/utils';

interface Product {
  id: number;
  name: string;
  description: string;
  shortDescription?: string | null;
  category: string;
  price: string;
  originalPrice: string;
  sku: string;
  barcode?: string | null;
  weight?: string | null;
  length?: string | null;
  width?: string | null;
  height?: string | null;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  stockCount: number;
  minStock: number;
  maxStock: number;
  tags: string[] | null;
  sizes: string[] | null;
  colors: any[] | null;
  features: string[] | null;
  images: string[] | null;
  isFeatured: boolean;
  onSale: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface PaginationData {
  page: number;
  pageSize: number;
  totalProducts: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const Page: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state management
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1')
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') || 'all'
  );
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get('category') || 'all'
  );

  // Data state
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    pageSize: 20,
    totalProducts: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editedStock, setEditedStock] = useState<{ [key: string]: number }>({});

  const getStockStatus = (product: Product) => {
    if (product.stockCount === 0) return 'OUT_OF_STOCK';
    if (product.stockCount <= product.minStock) return 'LOW_STOCK';
    if (product.stockCount >= product.maxStock) return 'OVER_STOCK';
    return 'IN_STOCK';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'LOW_STOCK':
      case 'OUT_OF_STOCK':
        return <AlertTriangle className="h-4 w-4" />;
      case 'OVER_STOCK':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  // Debounced search function
  const debouncedFetchProducts = useCallback(
    debounce(
      async (
        page: number,
        search: string,
        category: string,
        status: string
      ) => {
        setIsLoading(true);
        try {
          const result = await fetchMerchantProducts({
            page,
            pageSize: 20,
            search,
            category,
            status,
          });

          if (result.success && result.data) {
            setProducts(result.data.products);
            setPagination(result.data.pagination);
          } else {
            toast.error('Failed to fetch products');
          }
        } catch (error) {
          toast.error('An error occurred while fetching products');
          console.error('Error fetching products:', error);
        } finally {
          setIsLoading(false);
        }
      },
      300
    ),
    []
  );

  const fetchCategories = async () => {
    try {
      const result = await getMerchantProductCategories();
      if (result.success && result.data) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Update URL params
  const updateUrlParams = useCallback(
    (page: number, search: string, category: string, status: string) => {
      const params = new URLSearchParams();
      if (page > 1) params.set('page', page.toString());
      if (search) params.set('search', search);
      if (category !== 'all') params.set('category', category);
      if (status !== 'all') params.set('status', status);

      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      window.history.pushState({}, '', newUrl);
    },
    []
  );

  // Effects
  useEffect(() => {
    debouncedFetchProducts(
      currentPage,
      searchQuery,
      categoryFilter,
      statusFilter
    );
    updateUrlParams(currentPage, searchQuery, categoryFilter, statusFilter);
  }, [
    currentPage,
    searchQuery,
    categoryFilter,
    statusFilter,
    debouncedFetchProducts,
    updateUrlParams,
  ]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleStockUpdate = async (productId: number, newStock: number) => {
    try {
      const result = await updateProductStock(productId, newStock);
      if (result.success) {
        toast.success('Stock updated successfully');
        // Update local state
        setProducts(prev =>
          prev.map(p =>
            p.id === productId ? { ...p, stockCount: newStock } : p
          )
        );
        // Clear edited stock state
        setEditedStock(prev => {
          const updated = { ...prev };
          delete updated[productId.toString()];
          return updated;
        });
      } else {
        toast.error(result.error || 'Failed to update stock');
      }
    } catch (error) {
      toast.error('An error occurred while updating stock');
      console.error('Error updating stock:', error);
    }
  };

  const handleRefresh = () => {
    debouncedFetchProducts(
      currentPage,
      searchQuery,
      categoryFilter,
      statusFilter
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Navigation handlers
  const handleViewProduct = (productId: number) => {
    router.push(`/merchant/inventory/view/${productId}`);
  };

  const handleEditProduct = (productId: number) => {
    router.push(`/merchant/inventory/edit/${productId}`);
  };

  // Calculate stats
  const totalStockValue = products.reduce(
    (sum, item) => sum + (parseFloat(item.price) || 0) * item.stockCount,
    0
  );
  const lowStockItems = products.filter(
    item =>
      getStockStatus(item) === 'LOW_STOCK' ||
      getStockStatus(item) === 'OUT_OF_STOCK'
  ).length;

  // Render pagination
  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const showEllipsis = pagination.totalPages > 7;

    if (showEllipsis) {
      // Always show first page
      pages.push(1);

      if (pagination.page > 4) {
        pages.push('ellipsis1');
      }

      // Show pages around current page
      const start = Math.max(2, pagination.page - 1);
      const end = Math.min(pagination.totalPages - 1, pagination.page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (pagination.page < pagination.totalPages - 3) {
        pages.push('ellipsis2');
      }

      // Always show last page
      if (pagination.totalPages > 1) {
        pages.push(pagination.totalPages);
      }
    } else {
      for (let i = 1; i <= pagination.totalPages; i++) {
        pages.push(i);
      }
    }

    return (
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                pagination.hasPreviousPage &&
                handlePageChange(pagination.page - 1)
              }
              className={
                !pagination.hasPreviousPage
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
              size="default"
            />
          </PaginationItem>
          {pages.map((page, index) => (
            <PaginationItem key={index}>
              {typeof page === 'string' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={page === pagination.page}
                  className="cursor-pointer"
                  size="default"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                pagination.hasNextPage && handlePageChange(pagination.page + 1)
              }
              className={
                !pagination.hasNextPage
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
              size="default"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Inventory Management
              </h1>
              <p className="text-gray-600">
                Monitor and manage your product inventory (
                {pagination.totalProducts} products)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
              <Link href="/merchant/inventory/add">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Stock Value"
            value={`$${(totalStockValue / 1000).toFixed(0)}K`}
            change={8.2}
            changeType="positive"
            icon={<Package className="h-5 w-5" />}
            chartData={miniChartData.revenue}
            chartType="area"
            color="#3B82F6"
            subtitle="Current inventory value"
          />
          <StatCard
            title="Low Stock Alerts"
            value={lowStockItems.toString()}
            change={-12.5}
            changeType="negative"
            icon={<AlertTriangle className="h-5 w-5" />}
            chartData={miniChartData.orders}
            color="#EF4444"
            subtitle="Items need restocking"
          />
          <StatCard
            title="Total Products"
            value={pagination.totalProducts.toString()}
            change={15.3}
            changeType="positive"
            icon={<BarChart3 className="h-5 w-5" />}
            chartData={miniChartData.customers}
            color="#10B981"
            subtitle="Active products"
          />
          <StatCard
            title="Stock Value"
            value={`$${(totalStockValue / 1000).toFixed(0)}K`}
            change={22.1}
            changeType="positive"
            icon={<DollarSign className="h-5 w-5" />}
            chartData={miniChartData.growth}
            color="#8B5CF6"
            subtitle="Current inventory value"
          />
        </div>

        {/* Enhanced Filters and Actions */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col lg:flex-row gap-4 items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search products by name or SKU..."
                    value={searchQuery}
                    onChange={e => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={handleStatusFilterChange}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={categoryFilter}
                  onValueChange={handleCategoryFilterChange}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Start by adding your first product to inventory'}
            </p>
            {!searchQuery &&
              statusFilter === 'all' &&
              categoryFilter === 'all' && (
                <Link href="/merchant/inventory/add">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Button>
                </Link>
              )}
          </div>
        ) : (
          <div className="space-y-4">
            {products.map(product => {
              const stockStatus = getStockStatus(product);
              return (
                <Card
                  key={product.id}
                  className="w-full transition-all hover:shadow-lg bg-white border border-slate-200"
                >
                  <CardContent className="p-4 md:p-6 grid grid-cols-[auto_1fr] gap-6 items-start">
                    <div className="w-24 h-24 relative rounded-xl overflow-hidden bg-slate-100">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">
                            {product.name}
                          </h3>
                          <div className="flex gap-2 mt-1.5">
                            <Badge
                              className={getProductStatusColor(product.status)}
                            >
                              {product.status}
                            </Badge>
                            <Badge
                              className={getProductStatusColor(stockStatus)}
                            >
                              {getStatusIcon(stockStatus)}
                              <span className="ml-1.5">
                                {stockStatus.split('_').join(' ')}
                              </span>
                            </Badge>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-5 w-5 text-slate-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewProduct(product.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditProduct(product.id)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit Item</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                        <div className="flex items-center gap-1.5">
                          <Tag className="h-4 w-4" />
                          <span>SKU: {product.sku}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Package className="h-4 w-4" />
                          <span>{product.category}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Added{' '}
                            {new Date(product.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="border-t mt-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-sm font-medium text-slate-600">
                                Stock Level
                              </p>
                              <span className="text-lg font-bold text-slate-900">
                                {product.stockCount}
                              </span>
                            </div>
                            <Progress
                              value={
                                product.maxStock > 0
                                  ? (product.stockCount / product.maxStock) *
                                    100
                                  : 0
                              }
                              className="h-2"
                            />

                            <div className="flex items-center justify-between mt-1.5">
                              <p className="text-xs text-slate-500">
                                Min: {product.minStock}
                              </p>

                              {/* Editable Stock Input + Save */}
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={
                                    editedStock[product.id.toString()] ??
                                    product.stockCount
                                  }
                                  min={0}
                                  max={product.maxStock || 999999}
                                  className="w-20 px-2 py-1 text-sm border rounded-md focus:ring-2 focus:ring-blue-500"
                                  onChange={e =>
                                    setEditedStock({
                                      ...editedStock,
                                      [product.id.toString()]: Number(
                                        e.target.value
                                      ),
                                    })
                                  }
                                />
                                <Button
                                  size="sm"
                                  variant="default"
                                  disabled={
                                    product.stockCount ===
                                      editedStock[product.id.toString()] ||
                                    editedStock[product.id.toString()] ===
                                      undefined
                                  }
                                  onClick={() =>
                                    handleStockUpdate(
                                      product.id,
                                      editedStock[product.id.toString()] ??
                                        product.stockCount
                                    )
                                  }
                                >
                                  Save
                                </Button>
                              </div>

                              <p className="text-xs text-slate-500">
                                Max: {product.maxStock}
                              </p>
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                  Price
                                </span>
                                <span className="font-semibold">
                                  ${parseFloat(product.price).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                  Stock Value
                                </span>
                                <span className="text-sm">
                                  $
                                  {(
                                    parseFloat(product.price) *
                                    product.stockCount
                                  ).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                  Featured
                                </span>
                                <span className="text-sm">
                                  {product.isFeatured ? (
                                    <Badge variant="secondary">Yes</Badge>
                                  ) : (
                                    'No'
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                  On Sale
                                </span>
                                <span className="text-sm">
                                  {product.onSale ? (
                                    <Badge variant="secondary">Yes</Badge>
                                  ) : (
                                    'No'
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
};

export default Page;
