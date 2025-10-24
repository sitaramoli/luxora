import { eq, and, desc } from 'drizzle-orm';

import { db } from '@/database/drizzle';
import { paymentMethods, addresses, type NewPaymentMethod, type PaymentMethod } from '@/database/schema';

/**
 * Get all payment methods for a user
 */
export async function getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
  const result = await db
    .select()
    .from(paymentMethods)
    .where(eq(paymentMethods.userId, userId))
    .orderBy(desc(paymentMethods.isDefault), desc(paymentMethods.createdAt));

  return result;
}

/**
 * Get all payment methods with billing addresses for a user
 */
export async function getUserPaymentMethodsWithAddresses(userId: string) {
  const result = await db
    .select({
      paymentMethod: paymentMethods,
      billingAddress: addresses,
    })
    .from(paymentMethods)
    .leftJoin(addresses, eq(paymentMethods.billingAddressId, addresses.id))
    .where(eq(paymentMethods.userId, userId))
    .orderBy(desc(paymentMethods.isDefault), desc(paymentMethods.createdAt));

  return result;
}

/**
 * Get a specific payment method by ID for a user
 */
export async function getUserPaymentMethod(
  paymentMethodId: string,
  userId: string
): Promise<PaymentMethod | null> {
  const result = await db
    .select()
    .from(paymentMethods)
    .where(and(eq(paymentMethods.id, paymentMethodId), eq(paymentMethods.userId, userId)))
    .limit(1);

  return result[0] || null;
}

/**
 * Get user's default payment method
 */
export async function getUserDefaultPaymentMethod(
  userId: string
): Promise<PaymentMethod | null> {
  const result = await db
    .select()
    .from(paymentMethods)
    .where(and(eq(paymentMethods.userId, userId), eq(paymentMethods.isDefault, true)))
    .limit(1);

  return result[0] || null;
}

/**
 * Create a new payment method
 */
export async function createPaymentMethod(paymentMethodData: NewPaymentMethod): Promise<PaymentMethod> {
  // If this is set as default, unset all other default payment methods for the user
  if (paymentMethodData.isDefault) {
    await db
      .update(paymentMethods)
      .set({ isDefault: false, updatedAt: new Date() })
      .where(eq(paymentMethods.userId, paymentMethodData.userId));
  }

  const result = await db
    .insert(paymentMethods)
    .values({
      ...paymentMethodData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return result[0];
}

/**
 * Update an existing payment method
 */
export async function updatePaymentMethod(
  paymentMethodId: string,
  userId: string,
  paymentMethodData: Partial<NewPaymentMethod>
): Promise<PaymentMethod | null> {
  // If this is set as default, unset all other default payment methods for the user
  if (paymentMethodData.isDefault) {
    await db
      .update(paymentMethods)
      .set({ isDefault: false, updatedAt: new Date() })
      .where(and(eq(paymentMethods.userId, userId), eq(paymentMethods.isDefault, true)));
  }

  const result = await db
    .update(paymentMethods)
    .set({
      ...paymentMethodData,
      updatedAt: new Date(),
    })
    .where(and(eq(paymentMethods.id, paymentMethodId), eq(paymentMethods.userId, userId)))
    .returning();

  return result[0] || null;
}

/**
 * Delete a payment method
 */
export async function deletePaymentMethod(
  paymentMethodId: string,
  userId: string
): Promise<boolean> {
  const result = await db
    .delete(paymentMethods)
    .where(and(eq(paymentMethods.id, paymentMethodId), eq(paymentMethods.userId, userId)))
    .returning();

  return result.length > 0;
}

/**
 * Set a payment method as default (and unset others)
 */
export async function setDefaultPaymentMethod(
  paymentMethodId: string,
  userId: string
): Promise<PaymentMethod | null> {
  // First, unset all default payment methods for the user
  await db
    .update(paymentMethods)
    .set({ isDefault: false, updatedAt: new Date() })
    .where(eq(paymentMethods.userId, userId));

  // Then set the specified payment method as default
  const result = await db
    .update(paymentMethods)
    .set({ isDefault: true, updatedAt: new Date() })
    .where(and(eq(paymentMethods.id, paymentMethodId), eq(paymentMethods.userId, userId)))
    .returning();

  return result[0] || null;
}

/**
 * Count total payment methods for a user
 */
export async function getUserPaymentMethodCount(userId: string): Promise<number> {
  const result = await db
    .select({
      count: eq(paymentMethods.userId, userId),
    })
    .from(paymentMethods)
    .where(eq(paymentMethods.userId, userId));

  return result.length;
}

/**
 * Get card brand from card number (first few digits)
 */
export function getCardBrandFromNumber(cardNumber: string): string {
  const number = cardNumber.replace(/\D/g, '');
  
  if (number.startsWith('4')) return 'VISA';
  if (number.startsWith('5') || (number.startsWith('2') && parseInt(number.substring(0, 4)) >= 2221 && parseInt(number.substring(0, 4)) <= 2720)) return 'MASTERCARD';
  if (number.startsWith('34') || number.startsWith('37')) return 'AMERICAN_EXPRESS';
  if (number.startsWith('6011') || number.startsWith('65') || (number.startsWith('644') || number.startsWith('645') || number.startsWith('646') || number.startsWith('647') || number.startsWith('648') || number.startsWith('649'))) return 'DISCOVER';
  if (number.startsWith('35')) return 'JCB';
  if (number.startsWith('30') || number.startsWith('36') || number.startsWith('38')) return 'DINERS_CLUB';
  
  return 'OTHER';
}