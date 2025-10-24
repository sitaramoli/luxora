'use client';

import {
  ArrowLeft,
  Edit,
  Image as ImageIcon,
  Package,
  Tag,
  DollarSign,
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { PageLoader } from '@/components/PageLoader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getMerchantProduct } from '@/lib/services/products';

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
  colors: { name: string; value: string }[] | null;
  features: string[] | null;
  images: string[] | null;
  isFeatured: boolean;
  onSale: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

const ViewProductPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.id as string);

  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  // Load product data on component mount
  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      const result = await getMerchantProduct(productId);
      if (result.success && result.data) {
        setProduct({
          ...result.data,
          colors:
            (result.data.colors as { name: string; value: string }[]) || null,
        });
      } else {
        toast.error(result.error || 'Failed to load product');
        router.push('/merchant/inventory');
      }
    } catch (error) {
      toast.error('Failed to load product');
      console.error('Error loading product:', error);
      router.push('/merchant/inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/merchant/inventory/edit/${productId}`);
  };

  const getStockStatus = () => {
    if (!product) return 'UNKNOWN';
    if (product.stockCount === 0) return 'OUT_OF_STOCK';
    if (product.stockCount <= product.minStock) return 'LOW_STOCK';
    if (product.stockCount >= product.maxStock) return 'OVER_STOCK';
    return 'IN_STOCK';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'IN_STOCK':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'LOW_STOCK':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'OUT_OF_STOCK':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'OVER_STOCK':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return <PageLoader isLoading={true} />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Product not found
          </h3>
          <p className="text-gray-600 mb-4">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push('/merchant/inventory')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus();
  const stockValue = parseFloat(product.price) * product.stockCount;

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            View Product
          </h1>
          <p className="text-gray-600">Product details and information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 w-full">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="mt-6 w-full">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Product Name</Label>
                        <div className="p-3 bg-gray-50 border rounded-md">
                          <p className="text-gray-900 font-medium">
                            {product.name}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <div className="p-3 bg-gray-50 border rounded-md">
                          <p className="text-gray-900">{product.category}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Short Description (Optional)</Label>
                      <div className="p-3 bg-gray-50 border rounded-md min-h-[60px]">
                        <p className="text-gray-900">
                          {product.shortDescription ||
                            'No short description available'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Full Description</Label>
                      <div className="p-3 bg-gray-50 border rounded-md min-h-[120px]">
                        <p className="text-gray-900 whitespace-pre-wrap">
                          {product.description || 'No description available'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <div className="pl-10 p-3 bg-gray-50 border rounded-md">
                            <p className="text-gray-900 font-medium">
                              {parseFloat(product.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Original Price (Optional)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <div className="pl-10 p-3 bg-gray-50 border rounded-md">
                            <p className="text-gray-900">
                              {parseFloat(product.originalPrice).toFixed(2)}
                              {product.onSale && (
                                <Badge className="ml-2 bg-red-100 text-red-800">
                                  ON SALE
                                </Badge>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>On Sale (Optional)</Label>
                        <div className="p-3 bg-gray-50 border rounded-md">
                          <Badge
                            className={
                              product.onSale
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }
                          >
                            {product.onSale ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Featured Product (Optional)</Label>
                        <div className="p-3 bg-gray-50 border rounded-md">
                          <Badge
                            className={
                              product.isFeatured
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }
                          >
                            {product.isFeatured ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="details" className="mt-6 w-full">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Product Variants</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Sizes */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Sizes (Optional)
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes && product.sizes.length > 0 ? (
                          product.sizes.map((size, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-sm"
                            >
                              {size}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-gray-500 italic text-sm">
                            No sizes specified
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Colors */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Colors (Optional)
                      </Label>
                      <div className="flex flex-wrap gap-3">
                        {product.colors && product.colors.length > 0 ? (
                          product.colors.map((color, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <div
                                className="w-6 h-6 rounded-full border-2 border-gray-300"
                                style={{ backgroundColor: color.value }}
                              />
                              <span className="text-sm text-gray-900">
                                {color.name}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 italic text-sm">
                            No colors specified
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Features (Optional)
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {product.features && product.features.length > 0 ? (
                          product.features.map((feature, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-sm"
                            >
                              {feature}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-gray-500 italic text-sm">
                            No features specified
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inventory" className="mt-6 w-full">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Inventory & Stock Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>SKU</Label>
                        <div className="p-3 bg-gray-50 border rounded-md">
                          <p className="text-gray-900 font-mono">
                            {product.sku}
                          </p>
                        </div>
                      </div>
                      {product.barcode && (
                        <div className="space-y-2">
                          <Label>Barcode</Label>
                          <div className="p-3 bg-gray-50 border rounded-md">
                            <p className="text-gray-900 font-mono">
                              {product.barcode}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Current Stock</Label>
                        <div className="p-3 bg-gray-50 border rounded-md text-center">
                          <p className="text-2xl font-bold text-blue-600">
                            {product.stockCount}
                          </p>
                          <p className="text-sm text-gray-500">units</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Minimum Stock</Label>
                        <div className="p-3 bg-gray-50 border rounded-md text-center">
                          <p className="text-xl font-medium text-orange-600">
                            {product.minStock}
                          </p>
                          <p className="text-sm text-gray-500">minimum</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Maximum Stock</Label>
                        <div className="p-3 bg-gray-50 border rounded-md text-center">
                          <p className="text-xl font-medium text-green-600">
                            {product.maxStock}
                          </p>
                          <p className="text-sm text-gray-500">maximum</p>
                        </div>
                      </div>
                    </div>

                    {product.weight && (
                      <div className="space-y-2">
                        <Label>Weight (Optional)</Label>
                        <div className="p-3 bg-gray-50 border rounded-md">
                          <p className="text-gray-900">{product.weight}</p>
                        </div>
                      </div>
                    )}

                    {(product.length || product.width || product.height) && (
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Dimensions (Optional)
                        </Label>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Length</Label>
                            <div className="p-3 bg-gray-50 border rounded-md">
                              <p className="text-gray-900">
                                {product.length || '-'}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Width</Label>
                            <div className="p-3 bg-gray-50 border rounded-md">
                              <p className="text-gray-900">
                                {product.width || '-'}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Height</Label>
                            <div className="p-3 bg-gray-50 border rounded-md">
                              <p className="text-gray-900">
                                {product.height || '-'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Tags (Optional)
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {product.tags && product.tags.length > 0 ? (
                          product.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <Tag className="h-3 w-3" />
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-gray-500 italic text-sm">
                            No tags assigned
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="media" className="mt-6 w-full">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {product.images && product.images.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {product.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Product image ${index + 1}`}
                              className="w-full h-40 object-cover rounded-lg border"
                            />
                            <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                              {index === 0 ? 'Primary' : `Image ${index + 1}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No images uploaded
                        </h3>
                        <p className="text-gray-600">
                          This product doesn't have any images yet.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Product Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Status
                    </span>
                    <Badge className={getStatusColor(product.status)}>
                      {product.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Stock Status
                    </span>
                    <Badge className={getStockStatusColor(stockStatus)}>
                      {stockStatus.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Stock Value
                    </span>
                    <span className="font-bold text-gray-900">
                      ${stockValue.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Stock Count
                    </span>
                    <span className="font-bold text-gray-900">
                      {product.stockCount} units
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleEdit}
                    className="w-full bg-black text-white hover:bg-gray-800"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Product
                  </Button>
                </CardContent>
              </Card>

              {/* Product Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Updated:</span>
                    <span>
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductPage;
