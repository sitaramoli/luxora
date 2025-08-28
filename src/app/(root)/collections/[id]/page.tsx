import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import CollectionPageContent from "./CollectionPageContent";

interface CollectionPageProps {
  params: {
    id: string;
  };
}

// TODO: Data fetching on the server
const getCollectionData = (id: string) => {
  const collections = {
    "1": {
      id: "1",
      name: "Spring Elegance 2024",
      description:
        "Discover the latest spring collection featuring vibrant colors and flowing silhouettes.",
      longDescription:
        "Our Spring Elegance 2024 collection celebrates the renewal of the season with fresh, vibrant designs that embody the spirit of spring. Each piece is carefully crafted to capture the essence of elegance while embracing the energy of new beginnings.",
      image:
        "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200",
      coverImage:
        "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1600",
      productCount: 45,
      season: "Spring",
      year: "2024",
      isNew: true,
      featured: true,
      brands: ["Chanel", "Dior", "Versace"],
      priceRange: "$500 - $5,000",
    },
    "2": {
      id: "2",
      name: "Timeless Classics",
      description:
        "Iconic pieces that never go out of style, curated from the world's finest brands.",
      longDescription:
        "The Timeless Classics collection features iconic pieces that transcend seasonal trends. These carefully selected items represent the pinnacle of luxury craftsmanship and design, ensuring they remain relevant and beautiful for years to come.",
      image:
        "https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=1200",
      coverImage:
        "https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=1600",
      productCount: 67,
      season: "All Season",
      year: "2024",
      isNew: false,
      featured: true,
      brands: ["Hermès", "Chanel", "Cartier"],
      priceRange: "$1,000 - $15,000",
    },
    "3": {
      id: "3",
      name: "Evening Glamour",
      description:
        "Sophisticated evening wear for the most exclusive occasions.",
      longDescription:
        "Evening Glamour showcases the most sophisticated pieces for special occasions. From red carpet events to intimate soirées, this collection ensures you make an unforgettable impression with every appearance.",
      image:
        "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=1200",
      coverImage:
        "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=1600",
      productCount: 32,
      season: "All Season",
      year: "2024",
      isNew: false,
      featured: false,
      brands: ["Versace", "Valentino", "Tom Ford"],
      priceRange: "$2,000 - $8,000",
    },
  };
  return collections[id as keyof typeof collections] || collections["1"];
};

// Mock products for this collection
const collectionProducts = [
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
    isNew: true,
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

// This function is still valid and pre-renders paths at build time
export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

// This is now a Server Component
const CollectionPage: React.FC<CollectionPageProps> = ({ params }) => {
  const collection = getCollectionData(params.id);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src={collection.coverImage}
          alt={collection.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              {collection.isNew && (
                <Badge className="bg-white/20 text-white border-white/30">
                  New
                </Badge>
              )}
              <Badge className="bg-white/20 text-white border-white/30">
                {collection.season}
              </Badge>
            </div>
            <h1 className="text-5xl font-bold mb-4">{collection.name}</h1>
            <p className="text-xl">{collection.description}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Collection Info */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            {collection.longDescription}
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
            <span>{collection.productCount} products</span>
            <span>{collection.priceRange}</span>
            <span>Featured brands: {collection.brands.join(", ")}</span>
          </div>
        </div>

        {/* Render the Client Component with fetched data */}
        <CollectionPageContent
          products={collectionProducts}
          productCount={collection.productCount}
        />
      </div>
    </div>
  );
};

export default CollectionPage;
