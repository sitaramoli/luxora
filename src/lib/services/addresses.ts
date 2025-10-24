import { eq, and, desc } from 'drizzle-orm';

import { db } from '@/database/drizzle';
import { addresses, type NewAddress, type Address } from '@/database/schema';

/**
 * Get all addresses for a user
 */
export async function getUserAddresses(userId: string): Promise<Address[]> {
  const result = await db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, userId))
    .orderBy(desc(addresses.isDefault), desc(addresses.createdAt));

  return result;
}

/**
 * Get a specific address by ID for a user
 */
export async function getUserAddress(
  addressId: string,
  userId: string
): Promise<Address | null> {
  const result = await db
    .select()
    .from(addresses)
    .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
    .limit(1);

  return result[0] || null;
}

/**
 * Get user's default address
 */
export async function getUserDefaultAddress(
  userId: string
): Promise<Address | null> {
  const result = await db
    .select()
    .from(addresses)
    .where(and(eq(addresses.userId, userId), eq(addresses.isDefault, true)))
    .limit(1);

  return result[0] || null;
}

/**
 * Create a new address
 */
export async function createAddress(addressData: NewAddress): Promise<Address> {
  // If this is set as default, unset all other default addresses for the user
  if (addressData.isDefault) {
    await db
      .update(addresses)
      .set({ isDefault: false, updatedAt: new Date() })
      .where(eq(addresses.userId, addressData.userId));
  }

  const result = await db
    .insert(addresses)
    .values({
      ...addressData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return result[0];
}

/**
 * Update an existing address
 */
export async function updateAddress(
  addressId: string,
  userId: string,
  addressData: Partial<NewAddress>
): Promise<Address | null> {
  // If this is set as default, unset all other default addresses for the user
  if (addressData.isDefault) {
    await db
      .update(addresses)
      .set({ isDefault: false, updatedAt: new Date() })
      .where(and(eq(addresses.userId, userId), eq(addresses.isDefault, true)));
  }

  const result = await db
    .update(addresses)
    .set({
      ...addressData,
      updatedAt: new Date(),
    })
    .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
    .returning();

  return result[0] || null;
}

/**
 * Delete an address
 */
export async function deleteAddress(
  addressId: string,
  userId: string
): Promise<boolean> {
  const result = await db
    .delete(addresses)
    .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
    .returning();

  return result.length > 0;
}

/**
 * Set an address as default (and unset others)
 */
export async function setDefaultAddress(
  addressId: string,
  userId: string
): Promise<Address | null> {
  // First, unset all default addresses for the user
  await db
    .update(addresses)
    .set({ isDefault: false, updatedAt: new Date() })
    .where(eq(addresses.userId, userId));

  // Then set the specified address as default
  const result = await db
    .update(addresses)
    .set({ isDefault: true, updatedAt: new Date() })
    .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
    .returning();

  return result[0] || null;
}

/**
 * Count total addresses for a user
 */
export async function getUserAddressCount(userId: string): Promise<number> {
  const result = await db
    .select({
      count: eq(addresses.userId, userId),
    })
    .from(addresses)
    .where(eq(addresses.userId, userId));

  return result.length;
}