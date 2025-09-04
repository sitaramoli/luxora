"use server";

import { db } from "@/database/drizzle";
import { products, merchants } from "@/database/schema";
import { eq, desc, and, gte, lte, like, sql } from "drizzle-orm";

export const fetchAllProducts = async (limit = 100, offset = 0) => {
  try {
    const allProducts = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        originalPrice: products.originalPrice,
        images: products.images,
        featured: products.featured,
        isSale: products.isSale,
        isNew: products.isNew,
        stockCount: products.stockCount,
        createdAt: products.createdAt,
        brandName: merchants.name,
        brandSlug: merchants.slug,
      })
      .from(products)
      .leftJoin(merchants, eq(products.brandId, merchants.id))
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);
    
    return { success: true, data: allProducts };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "Failed to fetch products." };
  }
};

export const fetchFeaturedProducts = async (limit = 8) => {
  try {
    const featuredProducts = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        originalPrice: products.originalPrice,
        images: products.images,
        featured: products.featured,
        isSale: products.isSale,
        isNew: products.isNew,
        stockCount: products.stockCount,
        createdAt: products.createdAt,
        brandName: merchants.name,
        brandSlug: merchants.slug,
      })
      .from(products)
      .leftJoin(merchants, eq(products.brandId, merchants.id))
      .where(eq(products.featured, true))
      .orderBy(desc(products.createdAt))
      .limit(limit);
    
    return { success: true, data: featuredProducts };
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return { success: false, error: "Failed to fetch featured products." };
  }
};

export const fetchProductById = async (id: string) => {
  try {
    const product = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        features: products.features,
        price: products.price,
        originalPrice: products.originalPrice,
        colors: products.colors,
        images: products.images,
        sizes: products.sizes,
        stockCount: products.stockCount,
        featured: products.featured,
        isSale: products.isSale,
        isNew: products.isNew,
        createdAt: products.createdAt,
        brandName: merchants.name,
        brandSlug: merchants.slug,
        brandDescription: merchants.description,
      })
      .from(products)
      .leftJoin(merchants, eq(products.brandId, merchants.id))
      .where(eq(products.id, id))
      .limit(1);
    
    return { success: true, data: product[0] || null };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: "Failed to fetch product." };
  }
};

export const searchProducts = async (query: string, limit = 20) => {
  try {
    const searchResults = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        originalPrice: products.originalPrice,
        images: products.images,
        featured: products.featured,
        isSale: products.isSale,
        isNew: products.isNew,
        stockCount: products.stockCount,
        createdAt: products.createdAt,
        brandName: merchants.name,
        brandSlug: merchants.slug,
      })
      .from(products)
      .leftJoin(merchants, eq(products.brandId, merchants.id))
      .where(
        sql`${products.name} ILIKE ${`%${query}%`} OR ${products.description} ILIKE ${`%${query}%`} OR ${merchants.name} ILIKE ${`%${query}%`}`
      )
      .orderBy(desc(products.createdAt))
      .limit(limit);
    
    return { success: true, data: searchResults };
  } catch (error) {
    console.error("Error searching products:", error);
    return { success: false, error: "Failed to search products." };
  }
};
