import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import {
  Star,
  MapPin,
  Calendar,
  Users,
  Package,
  Heart,
  Share2,
  CheckCircle,
} from "lucide-react";

interface BrandPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return [{ slug: "chanel" }, { slug: "gucci" }, { slug: "rolex" }];
}

const BrandPage: React.FC<BrandPageProps> = ({ params }) => {
  // TODO:Mock brand data based on ID
  const getBrandData = (id: string) => {
    const brands = {
      "1": {
        id: "1",
        slug: "chanel",
        name: "Chanel",
        description: "Timeless elegance and sophisticated luxury fashion.",
        longDescription:
          'Founded in 1910 by Gabrielle "Coco" Chanel, Chanel is a French luxury fashion house that focuses on women\'s ready-to-wear clothes, luxury goods, and accessories. The brand is known for its timeless designs, revolutionary approach to fashion, and iconic products like the Chanel No. 5 perfume and the quilted handbag.',
        image:
          "https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=1200",
        coverImage:
          "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1600",
        productCount: 245,
        category: "Fashion",
        isVerified: true,
        rating: 4.9,
        reviewCount: 1247,
        founded: "1910",
        location: "Paris, France",
        followers: 2847392,
      },
      "2": {
        id: "2",
        slug: "gucci",
        name: "Gucci",
        description: "Italian luxury fashion house known for leather goods.",
        longDescription:
          "Gucci is an Italian luxury brand of fashion and leather goods, part of the Gucci Group, which is owned by the French holding company Kering. Gucci was founded by Guccio Gucci in Florence, Tuscany, in 1921. The brand is known for its innovative designs, quality craftsmanship, and Italian heritage.",
        image:
          "https://images.pexels.com/photos/1188748/pexels-photo-1188748.jpeg?auto=compress&cs=tinysrgb&w=1200",
        coverImage:
          "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1600",
        productCount: 189,
        category: "Fashion",
        isVerified: true,
        rating: 4.8,
        reviewCount: 892,
        founded: "1921",
        location: "Florence, Italy",
        followers: 1892456,
      },
      "3": {
        id: "3",
        slug: "rolex",
        name: "Rolex",
        description:
          "Swiss luxury watch manufacturer with prestigious heritage.",
        longDescription:
          "Rolex SA is a Swiss luxury watch manufacturer based in Geneva, Switzerland. Founded in 1905 by Hans Wilsdorf and Alfred Davis, Rolex is known for its precision, reliability, and status as a symbol of success and achievement. The brand has been at the forefront of watchmaking innovation for over a century.",
        image:
          "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=1200",
        coverImage:
          "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=1600",
        productCount: 67,
        category: "Watches",
        isVerified: true,
        rating: 4.9,
        reviewCount: 567,
        founded: "1905",
        location: "Geneva, Switzerland",
        followers: 3247891,
      },
    };
    return brands[id as keyof typeof brands] || brands["1"];
  };

  const brand = getBrandData(params.slug);

  // TODO:Mock products for this brand
  const brandProducts = [
    {
      id: "1",
      name: "Silk Evening Gown",
      brand: brand.name,
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
      brand: brand.name,
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
      name: "Designer Sunglasses",
      brand: brand.name,
      price: 350,
      image:
        "https://images.pexels.com/photos/1263986/pexels-photo-1263986.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.5,
      reviewCount: 189,
      category: "Accessories",
      isNew: false,
      isSale: false,
    },
    {
      id: "4",
      name: "Luxury Watch",
      brand: brand.name,
      price: 12500,
      image:
        "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.9,
      reviewCount: 67,
      category: "Watches",
      isNew: true,
      isSale: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src={brand.coverImage}
          alt={brand.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{brand.name}</h1>
            <p className="text-xl max-w-2xl">{brand.description}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 relative mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold">{brand.name}</h2>
                    {brand.isVerified && (
                      <CheckCircle className="h-6 w-6 text-blue-500" />
                    )}
                  </div>
                  <Badge className="mb-4">{brand.category}</Badge>

                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(brand.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {brand.rating} ({brand.reviewCount} reviews)
                    </span>
                  </div>

                  <div className="flex gap-2 mb-6">
                    <Button className="flex-1 bg-black text-white hover:bg-gray-800">
                      <Heart className="h-4 w-4 mr-2" />
                      Follow
                    </Button>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Founded in {brand.founded}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{brand.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{brand.followers.toLocaleString()} followers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span>{brand.productCount} products</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* About Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4">About {brand.name}</h3>
              <p className="text-gray-700 leading-relaxed">
                {brand.longDescription}
              </p>
            </div>

            {/* Products Section */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold">Products</h3>
                <Link href={`/products?brand=${brand.name.toLowerCase()}`}>
                  <Button variant="outline">View All Products</Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {brandProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandPage;
