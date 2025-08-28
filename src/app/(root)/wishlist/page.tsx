"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Heart, ShoppingBag, Trash2, Star, ArrowLeft } from "lucide-react";

const WishlistPage: React.FC = () => {
  const items = [
    {
      id: "1",
      name: "Women's T-Shirt",
      brand: "Adidas",
      price: 200,
      image:
        "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Clothing",
    },
  ];
  const recommendedProducts = [
    {
      id: "rec-1",
      name: "Designer Sunglasses",
      brand: "Ray-Ban",
      price: 350,
      image:
        "https://images.pexels.com/photos/1263986/pexels-photo-1263986.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.5,
      category: "Accessories",
    },
    {
      id: "rec-2",
      name: "Luxury Watch",
      brand: "Rolex",
      price: 12500,
      image:
        "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.9,
      category: "Watches",
    },
    {
      id: "rec-3",
      name: "Silk Scarf",
      brand: "Hermès",
      price: 450,
      image:
        "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.7,
      category: "Accessories",
    },
    {
      id: "rec-4",
      name: "Leather Wallet",
      brand: "Gucci",
      price: 650,
      image:
        "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.6,
      category: "Accessories",
    },
  ];
  const handleAddToCart = (product: any) => {
    //
  };

  const handleRemoveFromWishlist = (productId: string) => {
    //
  };
  const clearWishlist = () => {};

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Your wishlist is empty
            </h1>
            <p className="text-gray-600 mb-8">
              Save items you love to your wishlist for easy access later
            </p>
            <Link href="/products">
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-800"
              >
                Discover Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600">
              {items.length} item{items.length > 1 ? "s" : ""} saved
            </p>
          </div>

          {items.length > 0 && (
            <Button
              variant="outline"
              onClick={clearWishlist}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-lg transition-shadow p-0"
            >
              <CardContent className="p-0">
                <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {product.category}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      ${product.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-black text-white hover:bg-gray-800"
                      size="sm"
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Link href={`/products/${product.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recommendations */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>You might also like</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedProducts.map((product) => (
                  <div key={product.id} className="group cursor-pointer">
                    <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 mb-3">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">{product.brand}</p>
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-gray-500">
                          {product.rating}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ${product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
