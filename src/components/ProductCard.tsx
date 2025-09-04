"use client";

import React, { memo, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  isNew: boolean;
  isSale: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement add to cart functionality
  }, []);

  const handleWishlistToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement wishlist toggle functionality
  }, []);

  const discountPercentage = useMemo(() => {
    return product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100,
        )
      : 0;
  }, [product.originalPrice, product.price]);

  const isInWishlist = useCallback((id: string) => {
    // TODO: Implement wishlist check
    return false;
  }, []);

  const starRating = useMemo(() => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={cn(
          "h-3 w-3",
          i < Math.floor(product.rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300",
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
              className="absolute top-3 right-3 bg-white/80 hover:bg-white"
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  isInWishlist(product.id)
                    ? "fill-red-500 text-red-500"
                    : "text-gray-600",
                )}
              />
            </Button>

            {/* Quick Add to Cart */}
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-black/80 text-white hover:bg-black"
                size="sm"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Cart
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
