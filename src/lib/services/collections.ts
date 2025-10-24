
// Fetch public collections loosely related to a brand by name (matches name/description)
export async function fetchPublicCollectionsForBrand(brandName: string, limit = 8) {
  try {
    const pattern = `%${brandName}%`;
    const results = await db
      .select({
        id: collections.id,
        name: collections.name,
        slug: collections.slug,
        description: collections.description,
        shortDescription: collections.shortDescription,
        image: collections.image,
        season: collections.season,
        year: collections.year,
        isFeatured: collections.isFeatured,
        createdAt: collections.createdAt,
      })
      .from(collections)
      .where(
        and(
          eq(collections.status, 'ACTIVE'),
          or(
            ilike(collections.name, pattern),
            ilike(collections.description, pattern)
          )
        )
      )
      .orderBy(desc(collections.createdAt))
      .limit(limit);

    return { success: true, data: results };
  } catch (error) {
    console.error('Error fetching collections for brand:', error);
    return { success: false, error: 'Failed to fetch collections for brand.' };
  }
}

import { eq, desc, sql, and, or, ilike, asc, count } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { auth } from '@/auth';
import { db } from '@/database/drizzle';
import { 
  collections, 
  collectionItems, 
  products, 
  merchants, 
  users,
  brandCollections,
  type NewCollection,
  type NewCollectionItem,
  type Collection,
  type CollectionItem 
} from '@/database/schema';

// Validation schemas
const createCollectionSchema = z.object({
  name: z.string().min(1, 'Collection name is required').max(255, 'Name too long'),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug too long'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().optional(),
  image: z.string().min(1, 'Image URL is required'),
  coverImage: z.string().optional(),
  season: z.enum(['SPRING', 'SUMMER', 'FALL', 'WINTER', 'ALL_SEASON']).default('ALL_SEASON'),
  year: z.string().length(4, 'Year must be 4 digits'),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).default('DRAFT'),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
  metaTitle: z.string().max(255, 'Meta title too long').optional(),
  metaDescription: z.string().optional(),
  tags: z.array(z.string()).default([]),
  priceRangeMin: z.number().min(0).optional(),
  priceRangeMax: z.number().min(0).optional(),
});

const updateCollectionSchema = createCollectionSchema.partial();

const addProductToCollectionSchema = z.object({
  collectionId: z.string().uuid('Invalid collection ID'),
  productId: z.number().int().positive('Invalid product ID'),
  displayOrder: z.number().int().min(0).default(0),
  isHighlighted: z.boolean().default(false),
  customDescription: z.string().optional(),
});

// Fetch all collections with pagination and filters
export async function fetchCollections({
  page = 1,
  pageSize = 20,
  search = '',
  status = '',
  season = '',
  sortBy = 'createdAt',
  sortOrder = 'desc',
  isFeatured,
}: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  season?: string;
  sortBy?: 'createdAt' | 'name' | 'displayOrder' | 'productCount';
  sortOrder?: 'asc' | 'desc';
  isFeatured?: boolean;
} = {}) {
  try {
    const offset = (page - 1) * pageSize;

    // Build WHERE conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(collections.name, `%${search}%`),
          ilike(collections.description, `%${search}%`)
        )
      );
    }

    if (status && status !== 'all') {
      conditions.push(eq(collections.status, status as 'ACTIVE' | 'DRAFT' | 'ARCHIVED'));
    }

    if (season && season !== 'all') {
      conditions.push(eq(collections.season, season as any));
    }

    if (isFeatured !== undefined) {
      conditions.push(eq(collections.isFeatured, isFeatured));
    }

    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

    // Get collections with product count
    const collectionsQuery = db
      .select({
        id: collections.id,
        name: collections.name,
        slug: collections.slug,
        description: collections.description,
        shortDescription: collections.shortDescription,
        image: collections.image,
        coverImage: collections.coverImage,
        season: collections.season,
        year: collections.year,
        status: collections.status,
        isFeatured: collections.isFeatured,
        isNew: collections.isNew,
        displayOrder: collections.displayOrder,
        metaTitle: collections.metaTitle,
        metaDescription: collections.metaDescription,
        tags: collections.tags,
        priceRangeMin: collections.priceRangeMin,
        priceRangeMax: collections.priceRangeMax,
        createdBy: collections.createdBy,
        createdAt: collections.createdAt,
        updatedAt: collections.updatedAt,
        productCount: sql<number>`(SELECT COUNT(*) FROM ${collectionItems} WHERE ${collectionItems.collectionId} = ${collections.id})`,
        creatorName: users.fullName,
      })
      .from(collections)
      .leftJoin(users, eq(collections.createdBy, users.id))
      .where(whereCondition)
      .$dynamic();

    // Apply sorting
    switch (sortBy) {
      case 'name':
        collectionsQuery.orderBy(sortOrder === 'desc' ? desc(collections.name) : asc(collections.name));
        break;
      case 'displayOrder':
        collectionsQuery.orderBy(
          sortOrder === 'desc' 
            ? [desc(collections.displayOrder), desc(collections.createdAt)]
            : [asc(collections.displayOrder), asc(collections.createdAt)]
        );
        break;
      case 'createdAt':
      default:
        collectionsQuery.orderBy(sortOrder === 'desc' ? desc(collections.createdAt) : asc(collections.createdAt));
        break;
    }

    // Execute query with pagination
    const [collectionsResult, totalCountResult] = await Promise.all([
      collectionsQuery.limit(pageSize).offset(offset),
      db.select({ count: count() }).from(collections).where(whereCondition),
    ]);

    const totalItems = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      success: true,
      data: {
        collections: collectionsResult,
        pagination: {
          currentPage: page,
          pageSize,
          totalItems,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching collections:', error);
    return { success: false, error: 'Failed to fetch collections.' };
  }
}

// Fetch collections for a brand via explicit relation first, fallback to fuzzy match by name
export async function fetchCollectionsForBrand(brandId: string, brandName: string, limit = 8) {
  try {
    // First try explicit relation
    const related = await db
      .select({
        id: collections.id,
        name: collections.name,
        slug: collections.slug,
        description: collections.description,
        shortDescription: collections.shortDescription,
        image: collections.image,
        season: collections.season,
        year: collections.year,
        isFeatured: collections.isFeatured,
        createdAt: collections.createdAt,
        displayOrder: brandCollections.displayOrder,
        isHighlighted: brandCollections.isHighlighted,
      })
      .from(brandCollections)
      .leftJoin(collections, eq(brandCollections.collectionId, collections.id))
      .where(eq(brandCollections.brandId, brandId))
      .orderBy(asc(brandCollections.displayOrder), desc(collections.createdAt))
      .limit(limit);

    if (related.length > 0) {
      return { success: true, data: related };
    }

    // Fallback: fuzzy match by brand name
    const pattern = `%${brandName}%`;
    const results = await db
      .select({
        id: collections.id,
        name: collections.name,
        slug: collections.slug,
        description: collections.description,
        shortDescription: collections.shortDescription,
        image: collections.image,
        season: collections.season,
        year: collections.year,
        isFeatured: collections.isFeatured,
        createdAt: collections.createdAt,
      })
      .from(collections)
      .where(
        and(
          eq(collections.status, 'ACTIVE'),
          or(
            ilike(collections.name, pattern),
            ilike(collections.description, pattern)
          )
        )
      )
      .orderBy(desc(collections.createdAt))
      .limit(limit);

    return { success: true, data: results };
  } catch (error) {
    console.error('Error fetching collections for brand:', error);
    return { success: false, error: 'Failed to fetch collections for brand.' };
  }
}

// Fetch public collections (only active ones)
export async function fetchPublicCollections({
  limit = 100,
  featured = false,
}: {
  limit?: number;
  featured?: boolean;
} = {}) {
  try {
    const conditions = [eq(collections.status, 'ACTIVE')];
    
    if (featured) {
      conditions.push(eq(collections.isFeatured, true));
    }

    const collectionsResult = await db
      .select({
        id: collections.id,
        name: collections.name,
        slug: collections.slug,
        description: collections.description,
        shortDescription: collections.shortDescription,
        image: collections.image,
        coverImage: collections.coverImage,
        season: collections.season,
        year: collections.year,
        isFeatured: collections.isFeatured,
        isNew: collections.isNew,
        displayOrder: collections.displayOrder,
        tags: collections.tags,
        priceRangeMin: collections.priceRangeMin,
        priceRangeMax: collections.priceRangeMax,
        createdAt: collections.createdAt,
        productCount: sql<number>`(SELECT COUNT(*) FROM ${collectionItems} WHERE ${collectionItems.collectionId} = ${collections.id})`,
      })
      .from(collections)
      .where(and(...conditions))
      .orderBy(desc(collections.displayOrder), desc(collections.createdAt))
      .limit(limit);

    return {
      success: true,
      data: collectionsResult,
    };
  } catch (error) {
    console.error('Error fetching public collections:', error);
    return { success: false, error: 'Failed to fetch collections.' };
  }
}

// Fetch single collection by ID
export async function fetchCollectionById(id: string) {
  try {
    const collectionResult = await db
      .select({
        id: collections.id,
        name: collections.name,
        slug: collections.slug,
        description: collections.description,
        shortDescription: collections.shortDescription,
        image: collections.image,
        coverImage: collections.coverImage,
        season: collections.season,
        year: collections.year,
        status: collections.status,
        isFeatured: collections.isFeatured,
        isNew: collections.isNew,
        displayOrder: collections.displayOrder,
        metaTitle: collections.metaTitle,
        metaDescription: collections.metaDescription,
        tags: collections.tags,
        priceRangeMin: collections.priceRangeMin,
        priceRangeMax: collections.priceRangeMax,
        createdBy: collections.createdBy,
        createdAt: collections.createdAt,
        updatedAt: collections.updatedAt,
        creatorName: users.fullName,
      })
      .from(collections)
      .leftJoin(users, eq(collections.createdBy, users.id))
      .where(eq(collections.id, id))
      .limit(1);

    if (!collectionResult[0]) {
      return { success: false, error: 'Collection not found.' };
    }

    return {
      success: true,
      data: collectionResult[0],
    };
  } catch (error) {
    console.error('Error fetching collection:', error);
    return { success: false, error: 'Failed to fetch collection.' };
  }
}

// Fetch collection by slug (for public pages)
export async function fetchCollectionBySlug(slug: string) {
  try {
    const collectionResult = await db
      .select({
        id: collections.id,
        name: collections.name,
        slug: collections.slug,
        description: collections.description,
        shortDescription: collections.shortDescription,
        image: collections.image,
        coverImage: collections.coverImage,
        season: collections.season,
        year: collections.year,
        status: collections.status,
        isFeatured: collections.isFeatured,
        isNew: collections.isNew,
        displayOrder: collections.displayOrder,
        metaTitle: collections.metaTitle,
        metaDescription: collections.metaDescription,
        tags: collections.tags,
        priceRangeMin: collections.priceRangeMin,
        priceRangeMax: collections.priceRangeMax,
        createdAt: collections.createdAt,
        updatedAt: collections.updatedAt,
      })
      .from(collections)
      .where(and(eq(collections.slug, slug), eq(collections.status, 'ACTIVE')))
      .limit(1);

    if (!collectionResult[0]) {
      return { success: false, error: 'Collection not found.' };
    }

    return {
      success: true,
      data: collectionResult[0],
    };
  } catch (error) {
    console.error('Error fetching collection by slug:', error);
    return { success: false, error: 'Failed to fetch collection.' };
  }
}

// Fetch products in a collection
export async function fetchCollectionProducts(collectionId: string, limit = 100) {
  try {
    const productsResult = await db
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
        status: products.status,
        createdAt: products.createdAt,
        brandName: merchants.name,
        brandSlug: merchants.slug,
        // Collection item specific fields
        collectionItemId: collectionItems.id,
        displayOrder: collectionItems.displayOrder,
        isHighlighted: collectionItems.isHighlighted,
        customDescription: collectionItems.customDescription,
        addedAt: collectionItems.createdAt,
      })
      .from(collectionItems)
      .innerJoin(products, eq(collectionItems.productId, products.id))
      .leftJoin(merchants, eq(products.merchantId, merchants.id))
      .where(eq(collectionItems.collectionId, collectionId))
      .orderBy(asc(collectionItems.displayOrder), desc(collectionItems.createdAt))
      .limit(limit);

    return {
      success: true,
      data: productsResult,
    };
  } catch (error) {
    console.error('Error fetching collection products:', error);
    return { success: false, error: 'Failed to fetch collection products.' };
  }
}

// Create a new collection
export async function createCollection(data: z.infer<typeof createCollectionSchema>) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized. Admin access required.' };
  }

  try {
    const validation = createCollectionSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0]?.message || 'Invalid data' };
    }

    // Check if slug already exists
    const existingCollection = await db
      .select({ id: collections.id })
      .from(collections)
      .where(eq(collections.slug, validation.data.slug))
      .limit(1);

    if (existingCollection.length > 0) {
      return { success: false, error: 'A collection with this slug already exists.' };
    }

    const newCollection = await db
      .insert(collections)
      .values({
        ...validation.data,
        createdBy: session.user.id,
      })
      .returning();

    revalidatePath('/admin/collections');
    revalidatePath('/collections');

    return {
      success: true,
      data: newCollection[0],
    };
  } catch (error) {
    console.error('Error creating collection:', error);
    return { success: false, error: 'Failed to create collection.' };
  }
}

// Update a collection
export async function updateCollection(id: string, data: z.infer<typeof updateCollectionSchema>) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized. Admin access required.' };
  }

  try {
    const validation = updateCollectionSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0]?.message || 'Invalid data' };
    }

    // If updating slug, check it doesn't conflict with existing
    if (validation.data.slug) {
      const existingCollection = await db
        .select({ id: collections.id })
        .from(collections)
        .where(and(eq(collections.slug, validation.data.slug), sql`${collections.id} != ${id}`))
        .limit(1);

      if (existingCollection.length > 0) {
        return { success: false, error: 'A collection with this slug already exists.' };
      }
    }

    const updatedCollection = await db
      .update(collections)
      .set({
        ...validation.data,
        updatedAt: new Date(),
      })
      .where(eq(collections.id, id))
      .returning();

    if (!updatedCollection[0]) {
      return { success: false, error: 'Collection not found.' };
    }

    revalidatePath('/admin/collections');
    revalidatePath('/collections');

    return {
      success: true,
      data: updatedCollection[0],
    };
  } catch (error) {
    console.error('Error updating collection:', error);
    return { success: false, error: 'Failed to update collection.' };
  }
}

// Delete a collection
export async function deleteCollection(id: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized. Admin access required.' };
  }

  try {
    const deletedCollection = await db
      .delete(collections)
      .where(eq(collections.id, id))
      .returning();

    if (!deletedCollection[0]) {
      return { success: false, error: 'Collection not found.' };
    }

    revalidatePath('/admin/collections');
    revalidatePath('/collections');

    return {
      success: true,
      data: deletedCollection[0],
    };
  } catch (error) {
    console.error('Error deleting collection:', error);
    return { success: false, error: 'Failed to delete collection.' };
  }
}

// Add product to collection
export async function addProductToCollection(data: z.infer<typeof addProductToCollectionSchema>) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized. Admin access required.' };
  }

  try {
    const validation = addProductToCollectionSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0]?.message || 'Invalid data' };
    }

    // Check if product is already in collection
    const existingItem = await db
      .select({ id: collectionItems.id })
      .from(collectionItems)
      .where(
        and(
          eq(collectionItems.collectionId, validation.data.collectionId),
          eq(collectionItems.productId, validation.data.productId)
        )
      )
      .limit(1);

    if (existingItem.length > 0) {
      return { success: false, error: 'Product is already in this collection.' };
    }

    const newCollectionItem = await db
      .insert(collectionItems)
      .values({
        ...validation.data,
        addedBy: session.user.id,
      })
      .returning();

    revalidatePath('/admin/collections');
    revalidatePath('/collections');

    return {
      success: true,
      data: newCollectionItem[0],
    };
  } catch (error) {
    console.error('Error adding product to collection:', error);
    return { success: false, error: 'Failed to add product to collection.' };
  }
}

// Remove product from collection
export async function removeProductFromCollection(collectionId: string, productId: number) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized. Admin access required.' };
  }

  try {
    const deletedItem = await db
      .delete(collectionItems)
      .where(
        and(
          eq(collectionItems.collectionId, collectionId),
          eq(collectionItems.productId, productId)
        )
      )
      .returning();

    if (!deletedItem[0]) {
      return { success: false, error: 'Product not found in collection.' };
    }

    revalidatePath('/admin/collections');
    revalidatePath('/collections');

    return {
      success: true,
      data: deletedItem[0],
    };
  } catch (error) {
    console.error('Error removing product from collection:', error);
    return { success: false, error: 'Failed to remove product from collection.' };
  }
}

// Update collection item (reorder, highlight, etc.)
export async function updateCollectionItem(
  collectionId: string,
  productId: number,
  updates: {
    displayOrder?: number;
    isHighlighted?: boolean;
    customDescription?: string;
  }
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized. Admin access required.' };
  }

  try {
    const updatedItem = await db
      .update(collectionItems)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(collectionItems.collectionId, collectionId),
          eq(collectionItems.productId, productId)
        )
      )
      .returning();

    if (!updatedItem[0]) {
      return { success: false, error: 'Collection item not found.' };
    }

    revalidatePath('/admin/collections');
    revalidatePath('/collections');

    return {
      success: true,
      data: updatedItem[0],
    };
  } catch (error) {
    console.error('Error updating collection item:', error);
    return { success: false, error: 'Failed to update collection item.' };
  }
}

// Helper function to generate unique slug
export async function generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await db
      .select({ id: collections.id })
      .from(collections)
      .where(eq(collections.slug, slug))
      .limit(1);

    if (existing.length === 0) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}