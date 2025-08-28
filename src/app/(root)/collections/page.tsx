"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ArrowRight } from "lucide-react";

const CollectionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const collections = [
    {
      id: "1",
      name: "Spring Elegance 2024",
      description:
        "Discover the latest spring collection featuring vibrant colors and flowing silhouettes.",
      image:
        "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800",
      productCount: 45,
      season: "Spring",
      year: "2024",
      isNew: true,
      featured: true,
      brands: ["Chanel", "Dior", "Versace"],
      priceRange: "$500 - $5,000",
    },
    {
      id: "2",
      name: "Timeless Classics",
      description:
        "Iconic pieces that never go out of style, curated from the world's finest brands.",
      image:
        "https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=800",
      productCount: 67,
      season: "All Season",
      year: "2024",
      isNew: false,
      featured: true,
      brands: ["Hermès", "Chanel", "Cartier"],
      priceRange: "$1,000 - $15,000",
    },
    {
      id: "3",
      name: "Evening Glamour",
      description:
        "Sophisticated evening wear for the most exclusive occasions.",
      image:
        "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=800",
      productCount: 32,
      season: "All Season",
      year: "2024",
      isNew: false,
      featured: false,
      brands: ["Versace", "Valentino", "Tom Ford"],
      priceRange: "$2,000 - $8,000",
    },
    {
      id: "4",
      name: "Summer Luxe 2024",
      description: "Light, airy pieces perfect for summer sophistication.",
      image:
        "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800",
      productCount: 38,
      season: "Summer",
      year: "2024",
      isNew: true,
      featured: false,
      brands: ["Gucci", "Prada", "Bottega Veneta"],
      priceRange: "$400 - $3,500",
    },
    {
      id: "5",
      name: "Heritage Collection",
      description:
        "Celebrating the rich heritage and craftsmanship of luxury fashion.",
      image:
        "https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=800",
      productCount: 54,
      season: "All Season",
      year: "2024",
      isNew: false,
      featured: true,
      brands: ["Burberry", "Louis Vuitton", "Hermès"],
      priceRange: "$800 - $12,000",
    },
    {
      id: "6",
      name: "Modern Minimalism",
      description:
        "Clean lines and contemporary design for the modern luxury consumer.",
      image:
        "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800",
      productCount: 29,
      season: "All Season",
      year: "2024",
      isNew: true,
      featured: false,
      brands: ["Jil Sander", "The Row", "Lemaire"],
      priceRange: "$600 - $4,000",
    },
  ];

  const filteredCollections = collections.filter((collection) => {
    const matchesSearch =
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeason =
      seasonFilter === "all" ||
      collection.season.toLowerCase() === seasonFilter;
    return matchesSearch && matchesSeason;
  });

  const sortedCollections = [...filteredCollections].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.id.localeCompare(a.id);
      case "name":
        return a.name.localeCompare(b.name);
      case "products":
        return b.productCount - a.productCount;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Collections Hero"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-5xl font-bold mb-4">Curated Collections</h1>
            <p className="text-xl">
              Discover our expertly curated collections featuring the finest
              luxury pieces from around the world
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Bar */}
        <div className="mb-8 bg-gray-50 rounded-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Select value={seasonFilter} onValueChange={setSeasonFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Seasons</SelectItem>
                  <SelectItem value="spring">Spring</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="fall">Fall</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="products">Most Products</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Featured Collections */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Featured Collections
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sortedCollections
              .filter((c) => c.featured)
              .slice(0, 2)
              .map((collection) => (
                <Card
                  key={collection.id}
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 p-0"
                >
                  <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        {collection.isNew && (
                          <Badge className="bg-white/20 text-white border-white/30">
                            New
                          </Badge>
                        )}
                        <Badge className="bg-white/20 text-white border-white/30">
                          {collection.season}
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        {collection.name}
                      </h3>
                      <p className="text-sm opacity-90">
                        {collection.productCount} products
                      </p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-4">
                      {collection.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <p className="font-medium">Featured Brands:</p>
                        <p>{collection.brands.join(", ")}</p>
                      </div>
                      <Link href={`/collections/${collection.id}`}>
                        <Button>
                          Explore
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* All Collections */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCollections.map((collection) => (
              <Card
                key={collection.id}
                className="group cursor-pointer hover:shadow-lg transition-shadow p-0"
              >
                <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {collection.isNew && (
                      <Badge className="bg-black/80 text-white">New</Badge>
                    )}
                    {collection.featured && (
                      <Badge className="bg-white/90 text-black">Featured</Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {collection.name}
                    </h3>
                    <Badge variant="secondary">{collection.season}</Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {collection.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{collection.productCount} products</span>
                    <span>{collection.priceRange}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {collection.brands.slice(0, 2).join(", ")}
                      {collection.brands.length > 2 &&
                        ` +${collection.brands.length - 2} more`}
                    </div>
                    <Link href={`/collections/${collection.id}`}>
                      <Button size="sm">View Collection</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {sortedCollections.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No collections found
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

export default CollectionsPage;
