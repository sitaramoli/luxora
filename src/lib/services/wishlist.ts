'use server';

import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { auth } from '@/auth';
import { dbWithMonitoring } from '@/database/drizzle';
import {
  wishlists,
  wishlistItems,
  products,
  merchants,
} from '@/database/schema';

export interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    brand: {
      name: string;
    } | null;
    slug: string;
    status: string;
  };
  createdAt: string;
}

export interface WishlistResponse {
  success: boolean;
  data?: {
    items: WishlistItem[];
    totalItems: number;
  };
  error?: string;
}

/**
 * Get or create wishlist for the current user
 */
async function getOrCreateWishlist(
  userId: string
): Promise<{ wishlistId: string | null; error?: string }> {
  try {
    // First, try to find existing wishlist
    const existingWishlist = await dbWithMonitoring.db
      .select({ id: wishlists.id })
      .from(wishlists)
      .where(eq(wishlists.userId, userId))
      .limit(1);

    if (existingWishlist.length > 0) {
      return { wishlistId: existingWishlist[0].id };
    }

    // Create new wishlist if none exists
    const wishlistId = nanoid();
    await dbWithMonitoring.db.insert(wishlists).values({
      id: wishlistId,
      userId,
    });

    return { wishlistId };
  } catch (error) {
    console.error('Error getting or creating wishlist:', error);
    return { wishlistId: null, error: 'Failed to access wishlist' };
  }
}

/**
 * Add item to wishlist
 */
export async function addToWishlist(
  productId: number
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Authentication required' };
  }

  try {
    const { wishlistId, error } = await getOrCreateWishlist(session.user.id);
    if (!wishlistId) {
      return { success: false, error: error || 'Failed to access wishlist' };
    }

    // Check if product exists
    const product = await dbWithMonitoring.db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (product.length === 0) {
      return { success: false, error: 'Product not found' };
    }

    // Check if item already exists in wishlist
    const existingItem = await dbWithMonitoring.db
      .select()
      .from(wishlistItems)
      .where(
        and(
          eq(wishlistItems.wishlistId, wishlistId),
          eq(wishlistItems.productId, productId)
        )
      )
      .limit(1);

    if (existingItem.length > 0) {
      return { success: false, error: 'Item already in wishlist' };
    }

    // Add new item to wishlist
    const wishlistItemId = nanoid();
    await dbWithMonitoring.db.insert(wishlistItems).values({
      id: wishlistItemId,
      wishlistId,
      productId,
    });

    return { success: true };
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return { success: false, error: 'Failed to add item to wishlist' };
  }
}

/**
 * Remove item from wishlist
 */
export async function removeFromWishlist(
  productId: number
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Authentication required' };
  }

  try {
    const { wishlistId, error } = await getOrCreateWishlist(session.user.id);
    if (!wishlistId) {
      return { success: false, error: error || 'Failed to access wishlist' };
    }

    await dbWithMonitoring.db
      .delete(wishlistItems)
      .where(
        and(
          eq(wishlistItems.wishlistId, wishlistId),
          eq(wishlistItems.productId, productId)
        )
      );

    return { success: true };
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return { success: false, error: 'Failed to remove item from wishlist' };
  }
}

/**
 * Check if product is in wishlist
 */
export async function isInWishlist(
  productId: number
): Promise<{ inWishlist: boolean; success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      inWishlist: false,
      success: false,
      error: 'Authentication required',
    };
  }

  try {
    const { wishlistId, error } = await getOrCreateWishlist(session.user.id);
    if (!wishlistId) {
      return {
        inWishlist: false,
        success: false,
        error: error || 'Failed to access wishlist',
      };
    }

    const result = await dbWithMonitoring.db
      .select({ id: wishlistItems.id })
      .from(wishlistItems)
      .where(
        and(
          eq(wishlistItems.wishlistId, wishlistId),
          eq(wishlistItems.productId, productId)
        )
      )
      .limit(1);

    return { inWishlist: result.length > 0, success: true };
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return {
      inWishlist: false,
      success: false,
      error: 'Failed to check wishlist',
    };
  }
}

/**
 * Get wishlist items for current user
 */
export async function getWishlist(): Promise<WishlistResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Authentication required' };
  }

  try {
    const { wishlistId, error } = await getOrCreateWishlist(session.user.id);
    if (!wishlistId) {
      return { success: false, error: error || 'Failed to access wishlist' };
    }

    const items = await dbWithMonitoring.db
      .select({
        id: wishlistItems.id,
        productId: wishlistItems.productId,
        createdAt: wishlistItems.createdAt,
        productName: products.name,
        productPrice: products.price,
        productImages: products.images,
        productSlug: products.slug,
        productStatus: products.status,
        brandName: merchants.name,
      })
      .from(wishlistItems)
      .leftJoin(products, eq(wishlistItems.productId, products.id))
      .leftJoin(merchants, eq(products.merchantId, merchants.id))
      .where(eq(wishlistItems.wishlistId, wishlistId))
      .orderBy(wishlistItems.createdAt);

    const wishlistItemsData: WishlistItem[] = items.map(item => ({
      id: item.id,
      productId: item.productId.toString(),
      createdAt: item.createdAt?.toISOString() || new Date().toISOString(),
      product: {
        id: item.productId.toString(),
        name: item.productName || 'Unknown Product',
        price: parseFloat(item.productPrice || '0'),
        imageUrl:
          Array.isArray(item.productImages) && item.productImages.length > 0
            ? item.productImages[0]
            : '/placeholder-product.jpg',
        brand: item.brandName ? { name: item.brandName } : null,
        slug: item.productSlug || `product-${item.productId}`,
        status: item.productStatus || 'INACTIVE',
      },
    }));

    return {
      success: true,
      data: {
        items: wishlistItemsData,
        totalItems: wishlistItemsData.length,
      },
    };
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return { success: false, error: 'Failed to get wishlist items' };
  }
}

/**
 * Get wishlist item count for current user
 */
export async function getWishlistItemCount(): Promise<{
  count: number;
  success: boolean;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { count: 0, success: false, error: 'Authentication required' };
  }

  try {
    const { wishlistId, error } = await getOrCreateWishlist(session.user.id);
    if (!wishlistId) {
      return {
        count: 0,
        success: false,
        error: error || 'Failed to access wishlist',
      };
    }

    const result = await dbWithMonitoring.db
      .select({ id: wishlistItems.id })
      .from(wishlistItems)
      .where(eq(wishlistItems.wishlistId, wishlistId));

    return { count: result.length, success: true };
  } catch (error) {
    console.error('Error getting wishlist item count:', error);
    return { count: 0, success: false, error: 'Failed to get wishlist count' };
  }
}

/**
 * Clear wishlist for current user
 */
export async function clearWishlist(): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Authentication required' };
  }

  try {
    const { wishlistId, error } = await getOrCreateWishlist(session.user.id);
    if (!wishlistId) {
      return { success: false, error: error || 'Failed to access wishlist' };
    }

    await dbWithMonitoring.db
      .delete(wishlistItems)
      .where(eq(wishlistItems.wishlistId, wishlistId));

    return { success: true };
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    return { success: false, error: 'Failed to clear wishlist' };
  }
}
