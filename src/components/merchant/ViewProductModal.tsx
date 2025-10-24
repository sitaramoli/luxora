'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, 
  Package, 
  Tag, 
  Calendar, 
  DollarSign, 
  BarChart3,
  Ruler,
  Weight,
  Eye,
  Edit
} from 'lucide-react';
import { getMerchantProduct } from '@/lib/services/products';
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

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  onEdit?: (productId: number) => void;
}

export const ViewProductModal: React.FC<ViewProductModalProps> = ({
  isOpen,
  onClose,
  productId,
  onEdit,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen && productId) {
      loadProduct();
    }
    if (!isOpen) {
      setProduct(null);
      setCurrentImageIndex(0);
    }
  }, [isOpen, productId]);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      const result = await getMerchantProduct(productId);
      if (result.success && result.data) {
        setProduct(result.data);
      } else {
        toast.error(result.error || 'Failed to load product');
        onClose();
      }
    } catch (error) {
      toast.error('Failed to load product');
      console.error('Error loading product:', error);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.stockCount === 0) return 'OUT_OF_STOCK';
    if (product.stockCount <= product.minStock) return 'LOW_STOCK';
    if (product.stockCount >= product.maxStock) return 'OVER_STOCK';
    return 'IN_STOCK';
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Loading product...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!product) {
    return null;
  }

  const stockStatus = getStockStatus(product);
  const stockValue = parseFloat(product.price) * product.stockCount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold">
            {product.name}
          </DialogTitle>
          {onEdit && (
            <Button 
              variant="outline" 
              onClick={() => onEdit(product.id)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Product
            </Button>
          )}
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index
                        ? 'border-blue-500'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Status and Basic Info */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Badge className={getProductStatusColor(product.status)}>
                  {product.status}
                </Badge>
                <Badge className={getProductStatusColor(stockStatus)}>
                  {stockStatus.replace('_', ' ')}
                </Badge>
                {product.isFeatured && (
                  <Badge variant="secondary">Featured</Badge>
                )}
                {product.onSale && (
                  <Badge variant="destructive">On Sale</Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <span>SKU: {product.sku}</span>
                </div>
                {product.barcode && (
                  <div className="flex items-center gap-1">
                    <BarChart3 className="h-4 w-4" />
                    <span>Barcode: {product.barcode}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  <span>{product.category}</span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Current Price</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Original Price</p>
                  <p className="text-lg font-semibold">
                    {formatPrice(product.originalPrice)}
                  </p>
                </div>
              </div>
            </div>

            {/* Stock Information */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Stock Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Current Stock</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {product.stockCount}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Stock Value</p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatPrice(stockValue.toString())}
                  </p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Min Stock</p>
                  <p className="text-lg font-semibold text-yellow-600">
                    {product.minStock}
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Max Stock</p>
                  <p className="text-lg font-semibold text-purple-600">
                    {product.maxStock}
                  </p>
                </div>
              </div>
            </div>

            {/* Dimensions */}
            {(product.weight || product.length || product.width || product.height) && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Ruler className="h-5 w-5" />
                  Dimensions
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.weight && (
                    <div className="flex items-center gap-2">
                      <Weight className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Weight: {product.weight} kg</span>
                    </div>
                  )}
                  {product.length && (
                    <div className="text-sm">Length: {product.length} cm</div>
                  )}
                  {product.width && (
                    <div className="text-sm">Width: {product.width} cm</div>
                  )}
                  {product.height && (
                    <div className="text-sm">Height: {product.height} cm</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Description</h3>
          {product.shortDescription && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 font-medium">Short Description</p>
              <p className="text-blue-700">{product.shortDescription}</p>
            </div>
          )}
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags and Sizes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Available Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <Badge key={index} variant="outline">
                    {size}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Product Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Created: {formatDate(product.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Updated: {formatDate(product.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {onEdit && (
            <Button onClick={() => onEdit(product.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};