"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BrandCard from "@/components/BrandCard";
import { Search } from "lucide-react";

const BrandsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  //TODO: Fetch brands from API
  const brands = [
    {
      id: "1",
      name: "Chanel",
      slug: "chanel",
      description: "Timeless elegance and sophisticated luxury fashion.",
      image:
        "https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=600",
      productCount: 245,
      category: "Fashion",
      isVerified: true,
    },
    {
      id: "2",
      name: "Gucci",
      slug: "gucci",
      description: "Italian luxury fashion house known for leather goods.",
      image:
        "https://images.pexels.com/photos/1188748/pexels-photo-1188748.jpeg?auto=compress&cs=tinysrgb&w=600",
      productCount: 189,
      category: "Fashion",
      isVerified: true,
    },
    {
      id: "3",
      name: "Rolex",
      slug: "rolex",
      description: "Swiss luxury watch manufacturer with prestigious heritage.",
      image:
        "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=600",
      productCount: 67,
      category: "Watches",
      isVerified: true,
    },
    {
      id: "4",
      name: "Hermès",
      slug: "hermes",
      description: "French luxury goods manufacturer specializing in leather.",
      image:
        "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600",
      productCount: 156,
      category: "Fashion",
      isVerified: true,
    },
    {
      id: "5",
      name: "Tiffany & Co.",
      slug: "tiffany-co",
      description: "American luxury jewelry and specialty retailer.",
      image:
        "https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=600",
      productCount: 89,
      category: "Jewelry",
      isVerified: true,
    },
    {
      id: "6",
      name: "Prada",
      slug: "prada",
      description: "Italian luxury fashion house founded in Milan.",
      image:
        "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600",
      productCount: 134,
      category: "Fashion",
      isVerified: true,
    },
    {
      id: "7",
      name: "Versace",
      slug: "versace",
      description: "Italian luxury fashion company and trade name.",
      image:
        "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=600",
      productCount: 98,
      category: "Fashion",
      isVerified: true,
    },
    {
      id: "8",
      name: "Cartier",
      slug: "cartier",
      description:
        "French luxury goods conglomerate known for jewelry and watches.",
      image:
        "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=600",
      productCount: 76,
      category: "Jewelry",
      isVerified: true,
    },
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "fashion", label: "Fashion" },
    { value: "jewelry", label: "Jewelry" },
    { value: "watches", label: "Watches" },
  ];

  const sortOptions = [
    { value: "name", label: "Name A-Z" },
    { value: "products", label: "Most Products" },
    { value: "newest", label: "Newest First" },
  ];

  const filteredBrands = brands.filter((brand) => {
    const matchesSearch = brand.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      brand.category.toLowerCase() === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedBrands = [...filteredBrands].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "products":
        return b.productCount - a.productCount;
      case "newest":
        return b.id.localeCompare(a.id);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Luxury Brands
          </h1>
          <p className="text-gray-600">
            Discover collections from the world&#39;s most prestigious brands
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
                placeholder="Search brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
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
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {sortedBrands.length} of {brands.length} brands
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedBrands.map((brand) => (
            <BrandCard key={brand.slug} brand={brand} />
          ))}
        </div>

        {/* Empty State */}
        {sortedBrands.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No brands found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandsPage;
