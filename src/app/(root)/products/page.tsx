"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import { Search, SlidersHorizontal } from "lucide-react";

const ProductsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  //TODO: Mock product data
  const products = [
    {
      id: "1",
      name: "Silk Evening Gown",
      brand: "Versace",
      price: 2850,
      originalPrice: 3200,
      image:
        "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.8,
      reviewCount: 124,
      category: "Dresses",
      isNew: false,
      isSale: true,
    },
    {
      id: "2",
      name: "Leather Handbag",
      brand: "Hermès",
      price: 4200,
      image:
        "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.9,
      reviewCount: 87,
      category: "Bags",
      isNew: true,
      isSale: false,
    },
    {
      id: "3",
      name: "Diamond Necklace",
      brand: "Tiffany & Co.",
      price: 8500,
      image:
        "https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.7,
      reviewCount: 45,
      category: "Jewelry",
      isNew: false,
      isSale: false,
    },
    {
      id: "4",
      name: "Cashmere Coat",
      brand: "Burberry",
      price: 1890,
      originalPrice: 2100,
      image:
        "https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.6,
      reviewCount: 203,
      category: "Outerwear",
      isNew: false,
      isSale: true,
    },
    {
      id: "5",
      name: "Luxury Watch",
      brand: "Rolex",
      price: 12500,
      image:
        "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.9,
      reviewCount: 67,
      category: "Watches",
      isNew: true,
      isSale: false,
    },
    {
      id: "6",
      name: "Designer Sunglasses",
      brand: "Ray-Ban",
      price: 350,
      image:
        "https://images.pexels.com/photos/1263986/pexels-photo-1263986.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.5,
      reviewCount: 189,
      category: "Accessories",
      isNew: false,
      isSale: false,
    },
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "dresses", label: "Dresses" },
    { value: "bags", label: "Bags" },
    { value: "jewelry", label: "Jewelry" },
    { value: "outerwear", label: "Outerwear" },
    { value: "watches", label: "Watches" },
    { value: "accessories", label: "Accessories" },
  ];

  const brands = [
    { value: "all", label: "All Brands" },
    { value: "versace", label: "Versace" },
    { value: "hermes", label: "Hermès" },
    { value: "tiffany", label: "Tiffany & Co." },
    { value: "burberry", label: "Burberry" },
    { value: "rolex", label: "Rolex" },
    { value: "rayban", label: "Ray-Ban" },
  ];

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
    { value: "rating", label: "Highest Rated" },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      product.category.toLowerCase() === selectedCategory;
    const matchesBrand =
      selectedBrand === "all" ||
      product.brand.toLowerCase().includes(selectedBrand);
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  const handleApplyClick = () => {
    console.log(
      "Applying filters: ",
      selectedCategory,
      selectedBrand,
      minPrice,
      maxPrice,
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Luxury Products
          </h1>
          <p className="text-gray-600">
            Discover our exclusive collection of luxury items
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 flex-wrap">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.value} value={brand.value}>
                      {brand.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Price Range
                  </label>
                  <div className="flex items-center space-x-2">
                    {/* Minimum Price Input */}
                    <div className="relative w-full">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                        placeholder="Min"
                        className="block w-full rounded-md border-gray-300 py-2 pl-7 pr-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        min="0"
                      />
                    </div>

                    <span className="text-gray-400">-</span>

                    {/* Maximum Price Input */}
                    <div className="relative w-full">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        placeholder="Max"
                        className="block w-full rounded-md border-gray-300 py-2 pl-7 pr-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={handleApplyClick}
                    className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Apply
                  </button>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Quick Filters
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-gray-300"
                    >
                      New Arrivals
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-gray-300"
                    >
                      On Sale
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-gray-300"
                    >
                      Free Shipping
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-gray-300"
                    >
                      High Rated
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Load More */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
