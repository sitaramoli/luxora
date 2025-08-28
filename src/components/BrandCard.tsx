"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Package } from "lucide-react";

interface Brand {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  category: string;
  isVerified: boolean;
}

interface BrandCardProps {
  brand: Brand;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  return (
    <Link href={`/brands/${brand.id}`}>
      <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer p-0">
        <CardContent className="p-0">
          <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg bg-gray-100">
            <Image
              src={brand.image}
              alt={brand.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold">{brand.name}</h3>
                {brand.isVerified && (
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                )}
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                {brand.category}
              </Badge>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-gray-600 text-sm line-clamp-2">
              {brand.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Package className="h-4 w-4" />
                <span>{brand.productCount} products</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="group-hover:bg-black group-hover:text-white transition-colors"
              >
                Explore
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BrandCard;
