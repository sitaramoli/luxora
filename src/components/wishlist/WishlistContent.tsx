'use client';

import React, { useEffect, useState } from 'react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';
import { dispatchCartUpdated, dispatchWishlistUpdated } from '@/lib/events';
import { PageLoader } from '@/components/PageLoader';
import Image from 'next/image';
import Link from 'next/link';

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    brand: {
      name: string;
    } | null;
    slug: string;
    status: string;
  };
  createdAt: string;
}

const WishlistContent = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/wishlist');
      
      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }
      
      const data = await response.json();
      
      // Ensure we always set an array
      const items = Array.isArray(data.items) ? data.items : [];
      setWishlistItems(items);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load your wishlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      setRemovingItems(prev => new Set(prev).add(productId));
      
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove item from wishlist');
      }

      setWishlistItems(prev => prev.filter(item => item.productId !== productId));
      
      toast.success('Item removed from wishlist');
      
      // Update wishlist count in header
      dispatchWishlistUpdated();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const addToCart = async (productId: string) => {
    try {
      setAddingToCart(prev => new Set(prev).add(productId));
      
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: parseInt(productId), quantity: 1 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add item to cart');
      }

      toast.success('Item added to cart');
      
      // Update cart count in header
      dispatchCartUpdated();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const clearWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clearAll: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to clear wishlist');
      }

      setWishlistItems([]);
      
      toast.success('Wishlist cleared');
      
      // Update wishlist count in header
      dispatchWishlistUpdated();
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    }
  };

  if (isLoading) {
    return <PageLoader isLoading={isLoading} />;
  }

  if (wishlistItems.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Heart className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6 text-center">
            Start adding products to your wishlist and they'll appear here.
          </p>
          <Button asChild>
            <Link href="/products">
              Browse Products
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats and actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
        </p>
        {wishlistItems.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearWishlist}
            className="text-red-600 hover:text-red-700"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Wishlist items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.isArray(wishlistItems) && wishlistItems.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-0">
              <div className="relative aspect-square overflow-hidden">
                <Link href={`/products/${item.product.slug}`}>
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </Link>
                
                {/* Remove from wishlist button */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                  onClick={() => removeFromWishlist(item.productId)}
                  disabled={removingItems.has(item.productId)}
                >
                  {removingItems.has(item.productId) ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-red-500" />
                  )}
                </Button>

                {/* Out of stock overlay */}
                {item.product.status !== 'ACTIVE' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-medium text-gray-900 hover:text-gray-700 line-clamp-2"
                  >
                    {item.product.name}
                  </Link>
                  {item.product.brand && (
                    <p className="text-sm text-gray-500">{item.product.brand.name}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(item.product.price)}
                  </span>
                </div>

                <Button
                  className="w-full"
                  onClick={() => addToCart(item.productId)}
                  disabled={addingToCart.has(item.productId) || item.product.status !== 'ACTIVE'}
                >
                  {addingToCart.has(item.productId) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      {item.product.status === 'ACTIVE' ? 'Add to Cart' : 'Out of Stock'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WishlistContent;