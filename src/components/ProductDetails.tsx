'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { dispatchCartUpdated, dispatchWishlistUpdated } from '@/lib/events';
import { LoadingSpinner } from '@/components/PageLoader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import ProductCard from '@/components/ProductCard';

import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Share2,
  Plus,
  Minus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Product, Review } from '@/types';

interface ProductDetailProps {
  product: Product;
  reviews: Review[];
  relatedProducts: any[];
}

const ProductDetails: React.FC<ProductDetailProps> = ({
  product,
  reviews,
  relatedProducts,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [wishlistChecked, setWishlistChecked] = useState(false);

  // Check if product is in wishlist on mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const response = await fetch(`/api/wishlist?productId=${product.id}`);
        if (response.ok) {
          const data = await response.json();
          setIsInWishlist(data.inWishlist);
        }
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      } finally {
        setWishlistChecked(true);
      }
    };

    checkWishlistStatus();
  }, [product.id]);

  const handleAddToCart = async () => {
    setIsLoadingCart(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: parseInt(product.id),
          quantity: quantity,
          selectedColor: selectedColor || null,
          selectedSize: selectedSize || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          toast.error('Please sign in to add items to cart');
          return;
        }
        throw new Error(errorData.error || 'Failed to add to cart');
      }

      toast.success('Item added to cart!');
      
      // Update cart count in header
      dispatchCartUpdated();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add to cart');
    } finally {
      setIsLoadingCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    setIsLoadingWishlist(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch('/api/wishlist', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: parseInt(product.id),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            toast.error('Please sign in to manage wishlist');
            return;
          }
          throw new Error(errorData.error || 'Failed to remove from wishlist');
        }

        setIsInWishlist(false);
        toast.success('Item removed from wishlist');
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: parseInt(product.id),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            toast.error('Please sign in to add to wishlist');
            return;
          }
          throw new Error(errorData.error || 'Failed to add to wishlist');
        }

        setIsInWishlist(true);
        toast.success('Item added to wishlist!');
      }
      
      // Update wishlist count in header
      dispatchWishlistUpdated();
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update wishlist');
    } finally {
      setIsLoadingWishlist(false);
    }
  };

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-black">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/products" className="hover:text-black">
                Products
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={`/brands/${product.slug}`}
                className="hover:text-black"
              >
                {product.brand}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.isSale && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    'aspect-square relative overflow-hidden rounded-md bg-gray-100 border-2',
                    selectedImage === index ? 'border-black' : 'border-gray-200'
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-gray-500 mb-2">{product.brand}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-4 w-4',
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-6">{product.description}</p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-3 block">Size</Label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map(size => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-3 block">Color</Label>
                <div className="flex gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={cn(
                        'w-8 h-8 rounded-full border-2 transition-all',
                        selectedColor === color.name
                          ? 'border-black scale-110'
                          : 'border-gray-300 hover:border-gray-400'
                      )}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Quantity</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 bg-gray-100 rounded-md min-w-[60px] text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setQuantity(Math.min(product.stockCount, quantity + 1))
                  }
                  disabled={quantity >= product.stockCount}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Only {product.stockCount} left in stock
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-black text-white hover:bg-gray-800"
                size="lg"
                disabled={!product.inStock || isLoadingCart || (product.sizes && product.sizes.length > 0 && !selectedSize) || (product.colors && product.colors.length > 0 && !selectedColor)}
              >
                {isLoadingCart ? (
                  <LoadingSpinner size="icon" className="mr-2" />
                ) : (
                  <ShoppingCart className="h-5 w-5 mr-2" />
                )}
                {isLoadingCart ? 'Adding to Cart...' : 'Add to Cart'}
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleWishlistToggle}
                  className="flex-1"
                  disabled={isLoadingWishlist || !wishlistChecked}
                >
                  {isLoadingWishlist ? (
                    <LoadingSpinner size="icon" className="mr-2" />
                  ) : (
                    <Heart
                      className={cn(
                        'h-4 w-4 mr-2',
                        isInWishlist
                          ? 'fill-red-500 text-red-500'
                          : ''
                      )}
                    />
                  )}
                  {isLoadingWishlist 
                    ? 'Loading...'
                    : isInWishlist
                    ? 'Remove from Wishlist'
                    : 'Add to Wishlist'}
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Product Features */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Product Features</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Service Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-gray-500" />
                <span>Free shipping over $500</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span>Authenticity guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-gray-500" />
                <span>30-day returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({product.reviewCount})
              </TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
                <h3 className="text-lg font-semibold mt-6 mb-4">
                  Specifications
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {reviews.map(review => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'h-3 w-3',
                                  i < review.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.date}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Shipping Information</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Free standard shipping on orders over $500</li>
                    <li>• Express shipping available for $25</li>
                    <li>• International shipping available</li>
                    <li>• All orders are processed within 1-2 business days</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Returns Policy</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 30-day return window from delivery date</li>
                    <li>• Items must be in original condition with tags</li>
                    <li>• Free returns for defective items</li>
                    <li>
                      • Return shipping cost is customer&#39;s responsibility
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
