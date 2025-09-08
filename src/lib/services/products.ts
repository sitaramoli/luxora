"use server";

import { db } from "@/database/drizzle";
import { products, merchants, NewProduct } from "@/database/schema";
import { eq, desc, sql } from "drizzle-orm";
import config from "@/lib/config";
import ImageKit from "imagekit";
import { z } from "zod";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

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
        featured: products.isFeatured,
        onSale: products.onSale,
        stockCount: products.stockCount,
        createdAt: products.createdAt,
        brandName: merchants.name,
        brandSlug: merchants.slug,
      })
      .from(products)
      .leftJoin(merchants, eq(products.merchantId, merchants.id))
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
        featured: products.isFeatured,
        onSale: products.onSale,
        stockCount: products.stockCount,
        createdAt: products.createdAt,
        brandName: merchants.name,
        brandSlug: merchants.slug,
      })
      .from(products)
      .leftJoin(merchants, eq(products.merchantId, merchants.id))
      .where(eq(products.isFeatured, true))
      .orderBy(desc(products.createdAt))
      .limit(limit);

    return { success: true, data: featuredProducts };
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return { success: false, error: "Failed to fetch featured products." };
  }
};

export const fetchProductById = async (id: number) => {
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
        featured: products.isFeatured,
        onSale: products.onSale,
        createdAt: products.createdAt,
        brandName: merchants.name,
        brandSlug: merchants.slug,
        brandDescription: merchants.description,
      })
      .from(products)
      .leftJoin(merchants, eq(products.merchantId, merchants.id))
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
        featured: products.isFeatured,
        onSale: products.onSale,
        stockCount: products.stockCount,
        createdAt: products.createdAt,
        brandName: merchants.name,
        brandSlug: merchants.slug,
      })
      .from(products)
      .leftJoin(merchants, eq(products.merchantId, merchants.id))
      .where(
        sql`${products.name} ILIKE ${`%${query}%`} OR ${products.description} ILIKE ${`%${query}%`} OR ${merchants.name} ILIKE ${`%${query}%`}`,
      )
      .orderBy(desc(products.createdAt))
      .limit(limit);

    return { success: true, data: searchResults };
  } catch (error) {
    console.error("Error searching products:", error);
    return { success: false, error: "Failed to search products." };
  }
};

// Add Product
const {
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint },
  },
} = config;

const imageKit = new ImageKit({ publicKey, privateKey, urlEndpoint });
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Product description is required"),
  sku: z.string().min(1, "SKU is required"),
  stockCount: z.number().int().min(0, "Stock count cannot be negative"),
  minStock: z.number().int().min(0, "Minimum stock alert cannot be negative"),
  maxStock: z.number().int().min(0, "Maximum stock cannot be negative"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

/**
 * Action to upload images to ImageKit
 * @param formData - The FormData containing the files to upload
 * @param productName - The name of the product
 * @returns An array of uploaded image URLs
 */
export async function uploadImages(formData: FormData, productName: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };
  const files = formData.getAll("images") as File[];

  if (files.length === 0) {
    return { success: false, error: "No files to upload." };
  }

  try {
    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(new Uint8Array(await file.arrayBuffer()));
      return imageKit.upload({
        file: buffer,
        fileName: session.user.id + "_" + `${productName}_${Date.now()}`,
        folder: "/products/",
      });
    });

    const results = await Promise.all(uploadPromises);
    const urls = results.map((result) => result.url);

    return { success: true, urls };
  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    return { success: false, error: "Failed to upload images." };
  }
}

/**
 * Action to add a new product to the database
 * @param productData - The product data conforming to the NewProduct type
 * @returns The newly created product
 */
export async function addProduct(productData: NewProduct) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const validation = productSchema.safeParse(productData);
  if (!validation.success) {
    return { success: false, error: z.treeifyError(validation.error) };
  }

  try {
    const newProduct = await db
      .insert(products)
      .values({
        ...productData,
        merchantId: session.user.id,
      })
      .returning();

    revalidatePath("/merchant/inventory");

    return { success: true, product: newProduct[0] };
  } catch (error) {
    console.error("Database Insert Error:", error);
    return { success: false, error: "Failed to add product to database." };
  }
}
