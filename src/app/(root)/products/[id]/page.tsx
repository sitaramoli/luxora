import React from "react";
import ProductDetails from "@/components/ProductDetails";
import { Product, Review } from "@/types";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }];
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = async ({
  params,
}) => {
  const { id } = await params;
  // Mock product data
  const product: Product = {
    id: id,
    name: "Silk Evening Gown",
    brand: "Versace",
    slug: "versace",
    price: 2850,
    originalPrice: 3200,
    rating: 4.8,
    reviewCount: 124,
    category: "Dresses",
    isNew: false,
    isSale: true,
    description:
      "An exquisite silk evening gown crafted with the finest materials and attention to detail. This stunning piece features intricate beading and a flowing silhouette that embodies timeless elegance.",
    features: [
      "100% Pure Silk",
      "Hand-beaded details",
      "Made in Italy",
      "Dry clean only",
      "Limited edition",
    ],
    images: [
      "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1457983/pexels-photo-1457983.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Navy", value: "#1a1a2e" },
      { name: "Burgundy", value: "#722f37" },
    ],
    inStock: true,
    stockCount: 5,
  };

  const reviews: Review[] = [
    {
      id: 1,
      user: "Sarah Johnson",
      rating: 5,
      date: "2024-01-15",
      comment:
        "Absolutely stunning dress! The quality is exceptional and the fit is perfect.",
    },
    {
      id: 2,
      user: "Emma Wilson",
      rating: 4,
      date: "2024-01-10",
      comment:
        "Beautiful dress but runs slightly large. Would recommend sizing down.",
    },
    {
      id: 3,
      user: "Michael Chen",
      rating: 5,
      date: "2024-01-05",
      comment:
        "Purchased this for my wife and she loves it. Fast shipping and great packaging.",
    },
  ];

  const relatedProducts = [
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
  ];

  return (
    <div>
      <ProductDetails
        product={product}
        reviews={reviews}
        relatedProducts={relatedProducts}
      />
    </div>
  );
};

export default ProductDetailPage;
