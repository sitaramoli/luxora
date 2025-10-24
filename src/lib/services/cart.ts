'use server';

import { auth } from '@/auth';
import { dbWithMonitoring } from '@/database/drizzle';
import { carts, cartItems, products, merchants } from '@/database/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export interface CartItem {
  id: string;
  productId: number;
  quantity: number;
  selectedColor?: string | null;
  selectedSize?: string | null;
  product: {
    id: number;
    name: string;
    price: string;
    images: string[] | null;
    brandName: string | null;
  };
}

export interface CartResponse {
  success: boolean;
  data?: {
    items: CartItem[];
    totalItems: number;
    totalAmount: string;
  };
  error?: string;
}

/**
 * Get or create cart for the current user
 */
async function getOrCreateCart(userId: string): Promise<{ cartId: string | null; error?: string }> {
  try {
    // First, try to find existing cart
    const existingCart = await dbWithMonitoring.db
      .select({ id: carts.id })
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1);

    if (existingCart.length > 0) {
      return { cartId: existingCart[0].id };
    }

    // Create new cart if none exists
    const cartId = nanoid();
    await dbWithMonitoring.db.insert(carts).values({
      id: cartId,
      userId: userId,
    });

    return { cartId };
  } catch (error) {
    console.error('Error getting or creating cart:', error);
    return { cartId: null, error: 'Failed to access cart' };
  }
}

/**
 * Add item to cart
 */
export async function addToCart({
  productId,
  quantity = 1,
  selectedColor,
  selectedSize,
}: {
  productId: number;
  quantity?: number;
  selectedColor?: string;
  selectedSize?: string;
}): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Authentication required' };
  }

  try {
    const { cartId, error } = await getOrCreateCart(session.user.id);
    if (!cartId) {
      return { success: false, error: error || 'Failed to access cart' };
    }

    // Check if product exists
    const product = await dbWithMonitoring.db
      .select({ id: products.id, stockCount: products.stockCount })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (product.length === 0) {
      return { success: false, error: 'Product not found' };
    }

    if (product[0].stockCount < quantity) {
      return { success: false, error: 'Insufficient stock' };
    }

    // Normalize undefined to null for consistent comparison
    const normalizedColor = selectedColor || null;
    const normalizedSize = selectedSize || null;

    // Check if item already exists in cart with same attributes
    const existingItem = await dbWithMonitoring.db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, cartId),
          eq(cartItems.productId, productId),
          normalizedColor ? eq(cartItems.selectedColor, normalizedColor) : isNull(cartItems.selectedColor),
          normalizedSize ? eq(cartItems.selectedSize, normalizedSize) : isNull(cartItems.selectedSize)
        )
      )
      .limit(1);

    if (existingItem.length > 0) {
      // Update quantity
      const newQuantity = existingItem[0].quantity + quantity;
      if (product[0].stockCount < newQuantity) {
        return { success: false, error: 'Insufficient stock for requested quantity' };
      }

      await dbWithMonitoring.db
        .update(cartItems)
        .set({ quantity: newQuantity })
        .where(eq(cartItems.id, existingItem[0].id));
    } else {
      // Add new item
      const cartItemId = nanoid();
      await dbWithMonitoring.db.insert(cartItems).values({
        id: cartItemId,
        cartId: cartId,
        productId: productId,
        quantity: quantity,
        selectedColor: normalizedColor,
        selectedSize: normalizedSize,
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, error: 'Failed to add item to cart' };
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(cartItemId: string): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Authentication required' };
  }

  try {
    const { cartId, error } = await getOrCreateCart(session.user.id);
    if (!cartId) {
      return { success: false, error: error || 'Failed to access cart' };
    }

    await dbWithMonitoring.db
      .delete(cartItems)
      .where(
        and(
          eq(cartItems.id, cartItemId),
          eq(cartItems.cartId, cartId)
        )
      );

    return { success: true };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { success: false, error: 'Failed to remove item from cart' };
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity({
  cartItemId,
  quantity,
}: {
  cartItemId: string;
  quantity: number;
}): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Authentication required' };
  }

  try {
    const { cartId, error } = await getOrCreateCart(session.user.id);
    if (!cartId) {
      return { success: false, error: error || 'Failed to access cart' };
    }

    if (quantity <= 0) {
      return removeFromCart(cartItemId);
    }

    // Check stock
    const cartItem = await dbWithMonitoring.db
      .select({ productId: cartItems.productId })
      .from(cartItems)
      .where(
        and(
          eq(cartItems.id, cartItemId),
          eq(cartItems.cartId, cartId)
        )
      )
      .limit(1);

    if (cartItem.length === 0) {
      return { success: false, error: 'Cart item not found' };
    }

    const product = await dbWithMonitoring.db
      .select({ stockCount: products.stockCount })
      .from(products)
      .where(eq(products.id, cartItem[0].productId))
      .limit(1);

    if (product.length === 0) {
      return { success: false, error: 'Product not found' };
    }

    if (product[0].stockCount < quantity) {
      return { success: false, error: 'Insufficient stock' };
    }

    await dbWithMonitoring.db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, cartItemId));

    return { success: true };
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return { success: false, error: 'Failed to update cart item' };
  }
}

/**
 * Get cart items for current user
 */
export async function getCart(): Promise<CartResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Authentication required' };
  }

  try {
    const { cartId, error } = await getOrCreateCart(session.user.id);
    if (!cartId) {
      return { success: false, error: error || 'Failed to access cart' };
    }

    const items = await dbWithMonitoring.db
      .select({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        selectedColor: cartItems.selectedColor,
        selectedSize: cartItems.selectedSize,
        productName: products.name,
        productPrice: products.price,
        productImages: products.images,
        brandName: merchants.name,
      })
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .leftJoin(merchants, eq(products.merchantId, merchants.id))
      .where(eq(cartItems.cartId, cartId));

    const cartItemsData: CartItem[] = items.map(item => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
      product: {
        id: item.productId,
        name: item.productName || 'Unknown Product',
        price: item.productPrice || '0.00',
        images: item.productImages,
        brandName: item.brandName,
      },
    }));

    const totalItems = cartItemsData.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItemsData.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    return {
      success: true,
      data: {
        items: cartItemsData,
        totalItems,
        totalAmount: totalAmount.toFixed(2),
      },
    };
  } catch (error) {
    console.error('Error getting cart:', error);
    return { success: false, error: 'Failed to get cart items' };
  }
}

/**
 * Get cart item count for current user
 */
export async function getCartItemCount(): Promise<{ count: number; success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { count: 0, success: false, error: 'Authentication required' };
  }

  try {
    const { cartId, error } = await getOrCreateCart(session.user.id);
    if (!cartId) {
      return { count: 0, success: false, error: error || 'Failed to access cart' };
    }

    const result = await dbWithMonitoring.db
      .select({ quantity: cartItems.quantity })
      .from(cartItems)
      .where(eq(cartItems.cartId, cartId));

    const totalCount = result.reduce((sum, item) => sum + item.quantity, 0);

    return { count: totalCount, success: true };
  } catch (error) {
    console.error('Error getting cart item count:', error);
    return { count: 0, success: false, error: 'Failed to get cart count' };
  }
}

/**
 * Clear cart for current user
 */
export async function clearCart(): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Authentication required' };
  }

  try {
    const { cartId, error } = await getOrCreateCart(session.user.id);
    if (!cartId) {
      return { success: false, error: error || 'Failed to access cart' };
    }

    await dbWithMonitoring.db
      .delete(cartItems)
      .where(eq(cartItems.cartId, cartId));

    return { success: true };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return { success: false, error: 'Failed to clear cart' };
  }
}