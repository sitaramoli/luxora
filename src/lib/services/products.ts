'use server';

import { eq, desc, sql, and, or, ilike } from 'drizzle-orm';
import ImageKit from 'imagekit';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { auth } from '@/auth';
import { db } from '@/database/drizzle';
import {
  products,
  merchants,
  users,
  type NewProduct,
  reviews,
} from '@/database/schema';
import config from '@/lib/config';

export const fetchProductReviews = async (productId: number, limit = 20) => {
  try {
    // Simple reviews fetch; join with users for display name
    const reviewsData = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        userName: users.fullName,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt))
      .limit(limit);

    return { success: true, data: reviewsData };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return { success: false, error: 'Failed to fetch reviews' };
  }
};

export const fetchRelatedProductsByMerchant = async (
  merchantId: string,
  excludeProductId: number,
  limit = 8
) => {
  try {
    const items = await db
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
        sql`${products.merchantId} = ${merchantId} AND ${products.id} <> ${excludeProductId}`
      )
      .orderBy(desc(products.createdAt))
      .limit(limit);
    return { success: true, data: items };
  } catch (error) {
    console.error('Error fetching related products:', error);
    return { success: false, error: 'Failed to fetch related products' };
  }
};

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
    console.error('Error fetching products:', error);
    return { success: false, error: 'Failed to fetch products.' };
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
    console.error('Error fetching featured products:', error);
    return { success: false, error: 'Failed to fetch featured products.' };
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
        merchantId: products.merchantId,
      })
      .from(products)
      .leftJoin(merchants, eq(products.merchantId, merchants.id))
      .where(eq(products.id, id))
      .limit(1);

    return { success: true, data: product[0] || null };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { success: false, error: 'Failed to fetch product.' };
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
        sql`${products.name} ILIKE ${`%${query}%`} OR ${products.description} ILIKE ${`%${query}%`} OR ${merchants.name} ILIKE ${`%${query}%`}`
      )
      .orderBy(desc(products.createdAt))
      .limit(limit);

    return { success: true, data: searchResults };
  } catch (error) {
    console.error('Error searching products:', error);
    return { success: false, error: 'Failed to search products.' };
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
  name: z.string().min(1, 'Product name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Product description is required'),
  sku: z.string().min(1, 'SKU is required'),
  stockCount: z.number().int().min(0, 'Stock count cannot be negative'),
  minStock: z.number().int().min(0, 'Minimum stock alert cannot be negative'),
  maxStock: z.number().int().min(0, 'Maximum stock cannot be negative'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
});

/**
 * Action to upload images to ImageKit
 * @param formData - The FormData containing the files to upload
 * @param productName - The name of the product
 * @returns An array of uploaded image URLs
 */
export async function uploadImages(formData: FormData, productName: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };
  const files = formData.getAll('images') as File[];

  if (files.length === 0) {
    return { success: false, error: 'No files to upload.' };
  }

  try {
    const uploadPromises = files.map(async file => {
      const buffer = Buffer.from(new Uint8Array(await file.arrayBuffer()));
      return imageKit.upload({
        file: buffer,
        fileName: `${session.user.id}_` + `${productName}_${Date.now()}`,
        folder: '/products/',
      });
    });

    const results = await Promise.all(uploadPromises);
    const urls = results.map(result => result.url);

    return { success: true, urls };
  } catch (error) {
    console.error('ImageKit Upload Error:', error);
    return { success: false, error: 'Failed to upload images.' };
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
    return { success: false, error: 'Unauthorized' };
  }

  // Resolve merchant ID using helper function
  const { merchantId, error } = await resolveMerchantId(session.user.id);

  if (!merchantId) {
    return { success: false, error: error || 'Merchant profile not found' };
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
        merchantId,
      })
      .returning();

    revalidatePath('/merchant/inventory');

    return { success: true, product: newProduct[0] };
  } catch (error) {
    console.error('Database Insert Error:', error);
    return { success: false, error: 'Failed to add product to database.' };
  }
}

/**
 * Fetch products for a specific merchant with pagination and filters
 */
/**
 * Helper function to resolve merchant ID from user session
 */
async function resolveMerchantId(
  userId: string
): Promise<{ merchantId: string | null; error?: string }> {
  try {
    // First, try to find merchant profile
    const merchantResult = await db
      .select({ merchantId: merchants.id })
      .from(merchants)
      .where(eq(merchants.userId, userId))
      .limit(1);

    if (merchantResult.length > 0) {
      return { merchantId: merchantResult[0].merchantId };
    }

    // If no merchant profile, check if user has MERCHANT role and use user ID directly
    const userResult = await db
      .select({ role: users.role, id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userResult.length === 0) {
      return { merchantId: null, error: 'User not found' };
    }

    const user = userResult[0];
    if (user.role === 'MERCHANT') {
      // Use user ID as merchant ID for direct merchant accounts
      return { merchantId: userId };
    }

    return { merchantId: null, error: 'User is not a merchant' };
  } catch (error) {
    console.error('Error resolving merchant ID:', error);
    return { merchantId: null, error: 'Database error' };
  }
}

export async function fetchMerchantProducts({
  page = 1,
  pageSize = 20,
  search = '',
  category = '',
  status = '',
}: {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  status?: string;
} = {}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Resolve merchant ID using helper function
    const { merchantId, error } = await resolveMerchantId(session.user.id);

    if (!merchantId) {
      return { success: false, error: error || 'Merchant profile not found' };
    }

    const offset = (page - 1) * pageSize;

    // Build WHERE conditions
    const conditions = [eq(products.merchantId, merchantId)];

    if (search) {
      const searchCondition = or(
        ilike(products.name, `%${search}%`),
        ilike(products.sku, `%${search}%`)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    if (category && category !== 'all') {
      conditions.push(eq(products.category, category));
    }

    if (status && status !== 'all') {
      conditions.push(
        eq(products.status, status as 'ACTIVE' | 'DRAFT' | 'ARCHIVED')
      );
    }

    const whereCondition = and(...conditions);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(whereCondition);

    // Get products with pagination
    const merchantProducts = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        shortDescription: products.shortDescription,
        category: products.category,
        price: products.price,
        originalPrice: products.originalPrice,
        sku: products.sku,
        barcode: products.barcode,
        weight: products.weight,
        length: products.length,
        width: products.width,
        height: products.height,
        status: products.status,
        stockCount: products.stockCount,
        minStock: products.minStock,
        maxStock: products.maxStock,
        tags: products.tags,
        sizes: products.sizes,
        colors: products.colors,
        features: products.features,
        images: products.images,
        isFeatured: products.isFeatured,
        onSale: products.onSale,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .where(whereCondition)
      .orderBy(desc(products.createdAt))
      .limit(pageSize)
      .offset(offset);

    const totalPages = Math.ceil(count / pageSize);

    return {
      success: true,
      data: {
        products: merchantProducts,
        pagination: {
          page,
          pageSize,
          totalProducts: count,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching merchant products:', error);
    return { success: false, error: 'Failed to fetch products.' };
  }
}

/**
 * Update product stock
 */
export async function updateProductStock(productId: number, newStock: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Resolve merchant ID using helper function
    const { merchantId, error } = await resolveMerchantId(session.user.id);

    if (!merchantId) {
      return { success: false, error: error || 'Merchant profile not found' };
    }

    const updatedProduct = await db
      .update(products)
      .set({
        stockCount: newStock,
        updatedAt: new Date(),
      })
      .where(
        and(eq(products.id, productId), eq(products.merchantId, merchantId))
      )
      .returning();

    if (updatedProduct.length === 0) {
      return { success: false, error: 'Product not found or unauthorized' };
    }

    revalidatePath('/merchant/inventory');

    return { success: true, product: updatedProduct[0] };
  } catch (error) {
    console.error('Error updating product stock:', error);
    return { success: false, error: 'Failed to update product stock.' };
  }
}

/**
 * Get single merchant product by ID
 */
export async function getMerchantProduct(productId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Resolve merchant ID using helper function
    const { merchantId, error } = await resolveMerchantId(session.user.id);

    if (!merchantId) {
      return { success: false, error: error || 'Merchant profile not found' };
    }

    const product = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        shortDescription: products.shortDescription,
        category: products.category,
        price: products.price,
        originalPrice: products.originalPrice,
        sku: products.sku,
        barcode: products.barcode,
        weight: products.weight,
        length: products.length,
        width: products.width,
        height: products.height,
        status: products.status,
        stockCount: products.stockCount,
        minStock: products.minStock,
        maxStock: products.maxStock,
        tags: products.tags,
        sizes: products.sizes,
        colors: products.colors,
        features: products.features,
        images: products.images,
        isFeatured: products.isFeatured,
        onSale: products.onSale,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .where(
        and(eq(products.id, productId), eq(products.merchantId, merchantId))
      )
      .limit(1);

    if (product.length === 0) {
      return { success: false, error: 'Product not found' };
    }

    return { success: true, data: product[0] };
  } catch (error) {
    console.error('Error fetching merchant product:', error);
    return { success: false, error: 'Failed to fetch product.' };
  }
}

/**
 * Update merchant product
 */
export async function updateMerchantProduct(
  productId: number,
  updates: Partial<NewProduct>
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Resolve merchant ID using helper function
    const { merchantId, error } = await resolveMerchantId(session.user.id);

    if (!merchantId) {
      return { success: false, error: error || 'Merchant profile not found' };
    }

    const updatedProduct = await db
      .update(products)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(
        and(eq(products.id, productId), eq(products.merchantId, merchantId))
      )
      .returning();

    if (updatedProduct.length === 0) {
      return { success: false, error: 'Product not found or unauthorized' };
    }

    revalidatePath('/merchant/inventory');

    return { success: true, data: updatedProduct[0] };
  } catch (error) {
    console.error('Error updating merchant product:', error);
    return { success: false, error: 'Failed to update product.' };
  }
}

/**
 * Get product categories used by merchant
 */
export async function getMerchantProductCategories() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Resolve merchant ID using helper function
    const { merchantId, error } = await resolveMerchantId(session.user.id);

    if (!merchantId) {
      return { success: false, error: error || 'Merchant profile not found' };
    }

    const categories = await db
      .select({ category: products.category })
      .from(products)
      .where(eq(products.merchantId, merchantId))
      .groupBy(products.category)
      .orderBy(products.category);

    return {
      success: true,
      data: categories.map(c => c.category),
    };
  } catch (error) {
    console.error('Error fetching merchant categories:', error);
    return { success: false, error: 'Failed to fetch categories.' };
  }
}

// New public products service for paginated products
export interface PaginatedProductsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'featured' | 'price' | 'createdAt' | 'name' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  onSale?: boolean;
  isNew?: boolean;
}

export interface PaginatedProductsResponse {
  success: boolean;
  data?: {
    products: Array<{
      id: number;
      name: string;
      description: string;
      shortDescription: string | null;
      category: string;
      price: string;
      originalPrice: string;
      images: string[] | null;
      isFeatured: boolean;
      onSale: boolean;
      stockCount: number;
      createdAt: Date;
      brandName: string | null;
      brandSlug: string | null;
      status: string;
    }>;
    pagination: {
      currentPage: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
    categories: string[];
    brands: Array<{ id: string; name: string }>;
  };
  error?: string;
}

export const fetchPaginatedProducts = async ({
  page = 1,
  pageSize = 20,
  search = '',
  category = '',
  brandId = '',
  minPrice,
  maxPrice,
  sortBy = 'featured',
  sortOrder = 'desc',
  onSale,
  isNew,
}: PaginatedProductsParams): Promise<PaginatedProductsResponse> => {
  try {
    const offset = (page - 1) * pageSize;

    // Build the base query
    let productsQuery = db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        shortDescription: products.shortDescription,
        category: products.category,
        price: products.price,
        originalPrice: products.originalPrice,
        images: products.images,
        isFeatured: products.isFeatured,
        onSale: products.onSale,
        stockCount: products.stockCount,
        createdAt: products.createdAt,
        brandName: merchants.name,
        brandSlug: merchants.slug,
        status: products.status,
      })
      .from(products)
      .leftJoin(merchants, eq(products.merchantId, merchants.id))
      .where(eq(products.status, 'ACTIVE'))
      .$dynamic();

    // Add filters
    if (search) {
      productsQuery = productsQuery.where(
        sql`LOWER(${products.name}) LIKE LOWER(${`%${search}%`}) OR LOWER(${products.description}) LIKE LOWER(${`%${search}%`}) OR LOWER(${merchants.name}) LIKE LOWER(${`%${search}%`})`
      );
    }

    if (category && category !== 'all') {
      productsQuery = productsQuery.where(
        sql`LOWER(${products.category}) = LOWER(${category})`
      );
    }

    if (brandId && brandId !== 'all') {
      productsQuery = productsQuery.where(eq(products.merchantId, brandId));
    }

    if (minPrice !== undefined) {
      productsQuery = productsQuery.where(
        sql`CAST(${products.price} AS DECIMAL) >= ${minPrice}`
      );
    }

    if (maxPrice !== undefined) {
      productsQuery = productsQuery.where(
        sql`CAST(${products.price} AS DECIMAL) <= ${maxPrice}`
      );
    }

    if (onSale !== undefined) {
      productsQuery = productsQuery.where(eq(products.onSale, onSale));
    }

    if (isNew !== undefined) {
      // Consider products created in the last 30 days as "new"
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      if (isNew) {
        productsQuery = productsQuery.where(
          sql`${products.createdAt} >= ${thirtyDaysAgo}`
        );
      } else {
        productsQuery = productsQuery.where(
          sql`${products.createdAt} < ${thirtyDaysAgo}`
        );
      }
    }

    // Get total count for pagination
    const totalCountQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .leftJoin(merchants, eq(products.merchantId, merchants.id))
      .where(eq(products.status, 'ACTIVE'))
      .$dynamic();

    // Apply the same filters to count query
    if (search) {
      totalCountQuery.where(
        sql`LOWER(${products.name}) LIKE LOWER(${`%${search}%`}) OR LOWER(${products.description}) LIKE LOWER(${`%${search}%`}) OR LOWER(${merchants.name}) LIKE LOWER(${`%${search}%`})`
      );
    }

    if (category && category !== 'all') {
      totalCountQuery.where(
        sql`LOWER(${products.category}) = LOWER(${category})`
      );
    }

    if (brandId && brandId !== 'all') {
      totalCountQuery.where(eq(products.merchantId, brandId));
    }

    if (minPrice !== undefined) {
      totalCountQuery.where(
        sql`CAST(${products.price} AS DECIMAL) >= ${minPrice}`
      );
    }

    if (maxPrice !== undefined) {
      totalCountQuery.where(
        sql`CAST(${products.price} AS DECIMAL) <= ${maxPrice}`
      );
    }

    if (onSale !== undefined) {
      totalCountQuery.where(eq(products.onSale, onSale));
    }

    if (isNew !== undefined) {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      if (isNew) {
        totalCountQuery.where(sql`${products.createdAt} >= ${thirtyDaysAgo}`);
      } else {
        totalCountQuery.where(sql`${products.createdAt} < ${thirtyDaysAgo}`);
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'name':
        if (sortOrder === 'desc') {
          productsQuery = productsQuery.orderBy(desc(products.name));
        } else {
          productsQuery = productsQuery.orderBy(products.name);
        }
        break;
      case 'price':
        if (sortOrder === 'desc') {
          productsQuery = productsQuery.orderBy(
            desc(sql`CAST(${products.price} AS DECIMAL)`)
          );
        } else {
          productsQuery = productsQuery.orderBy(
            sql`CAST(${products.price} AS DECIMAL)`
          );
        }
        break;
      case 'createdAt':
        if (sortOrder === 'desc') {
          productsQuery = productsQuery.orderBy(desc(products.createdAt));
        } else {
          productsQuery = productsQuery.orderBy(products.createdAt);
        }
        break;
      case 'featured':
      default:
        // Sort by featured first, then by creation date
        if (sortOrder === 'desc') {
          productsQuery = productsQuery.orderBy(
            desc(products.isFeatured),
            desc(products.createdAt)
          );
        } else {
          productsQuery = productsQuery.orderBy(
            products.isFeatured,
            products.createdAt
          );
        }
        break;
    }

    // Get categories and brands for filters
    const [productsResult, totalCountResult, categoriesResult, brandsResult] =
      await Promise.all([
        productsQuery.limit(pageSize).offset(offset),
        totalCountQuery,
        // Get all categories
        db
          .select({ category: products.category })
          .from(products)
          .where(eq(products.status, 'ACTIVE'))
          .groupBy(products.category)
          .orderBy(products.category),
        // Get all active brands
        db
          .select({ id: merchants.id, name: merchants.name })
          .from(merchants)
          .where(eq(merchants.status, 'ACTIVE'))
          .orderBy(merchants.name),
      ]);

    const totalItems = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      success: true,
      data: {
        products: productsResult,
        pagination: {
          currentPage: page,
          pageSize,
          totalItems,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1,
        },
        categories: categoriesResult.map(c => c.category),
        brands: brandsResult,
      },
    };
  } catch (error) {
    console.error('Error fetching paginated products:', error);
    return {
      success: false,
      error: 'Failed to fetch products.',
    };
  }
};
