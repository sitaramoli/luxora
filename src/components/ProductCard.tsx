'use client';

import React, { memo, useCallback, useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/PageLoader';
import { Product } from '@/types/product';
import { toast } from 'sonner';
import { dispatchCartUpdated, dispatchWishlistUpdated } from '@/lib/events';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
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

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoadingCart(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: parseInt(product.id),
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Please sign in to add items to cart');
          return;
        }
        throw new Error(data.error || 'Failed to add to cart');
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
  }, [product.id]);

  const handleWishlistToggle = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            toast.error('Please sign in to manage wishlist');
            return;
          }
          throw new Error(data.error || 'Failed to remove from wishlist');
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

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            toast.error('Please sign in to add to wishlist');
            return;
          }
          throw new Error(data.error || 'Failed to add to wishlist');
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
  }, [product.id, isInWishlist]);

  const discountPercentage = useMemo(() => {
    return product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;
  }, [product.originalPrice, product.price]);

  const starRating = useMemo(() => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={cn(
          'h-3 w-3',
          i < Math.floor(product.rating)
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
        )}
      />
    ));
  }, [product.rating]);

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer p-0">
        <CardContent className="p-0">
          <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority={false}
              loading="lazy"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isNew && (
                <Badge className="bg-black text-white">New</Badge>
              )}
              {product.isSale && (
                <Badge className="bg-red-500 text-white">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleWishlistToggle}
              disabled={isLoadingWishlist || !wishlistChecked}
              className="absolute top-3 right-3 bg-white/80 hover:bg-white"
            >
              {isLoadingWishlist ? (
                <LoadingSpinner size="icon" />
              ) : (
                <Heart
                  className={cn(
                    'h-4 w-4',
                    isInWishlist
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-600'
                  )}
                />
              )}
            </Button>

            {/* Quick Add to Cart */}
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                onClick={handleAddToCart}
                disabled={isLoadingCart}
                className="w-full bg-black/80 text-white hover:bg-black disabled:opacity-50"
                size="sm"
              >
                {isLoadingCart ? (
                  <LoadingSpinner size="icon" className="mr-2" />
                ) : (
                  <ShoppingBag className="h-4 w-4 mr-2" />
                )}
                {isLoadingCart ? 'Adding...' : 'Add to Cart'}
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div>
              <p className="text-sm text-gray-500">{product.brand}</p>
              <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-black transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 capitalize">
                {product.category}
              </p>
            </div>

            <div className="flex items-center gap-1">
              {starRating}
              <span className="text-sm text-gray-500 ml-1">
                ({product.reviewCount})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
