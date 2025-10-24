'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { auth } from '@/auth';
import type { PaymentMethod } from '@/database/schema';
import {
  getUserPaymentMethods,
  getUserPaymentMethodsWithAddresses,
  getUserPaymentMethod,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  getUserDefaultPaymentMethod,
  getCardBrandFromNumber,
} from '@/lib/services/payment-methods';
import { getUserAddresses } from '@/lib/services/addresses';
import { validateCardNumber, detectCardBrand } from '@/lib/validations/payment-methods';

// Validation schema for payment method form
const paymentMethodSchema = z.object({
  type: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'APPLE_PAY', 'GOOGLE_PAY']),
  cardholderName: z.string().min(2, 'Cardholder name is required').optional(),
  cardNumber: z.string().min(13, 'Card number must be at least 13 digits').max(19, 'Card number must be at most 19 digits').optional(),
  expiryMonth: z.number().min(1).max(12).optional(),
  expiryYear: z.number().min(new Date().getFullYear()).optional(),
  cvv: z.string().min(3).max(4).optional(),
  billingAddressId: z.string().uuid().nullable().optional(),
  isDefault: z.boolean().default(false),
});

// Helper function to safely get form data
function getFormValue(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (value === null || value === '') return null;
  return value as string;
}

/**
 * Get all payment methods for the current user
 */
export async function getUserPaymentMethodsAction() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    const paymentMethods = await getUserPaymentMethods(session.user.id);

    return {
      success: true,
      data: paymentMethods,
    };
  } catch (error) {
    console.error('Error fetching user payment methods:', error);
    return {
      success: false,
      error: 'Failed to fetch payment methods',
    };
  }
}

/**
 * Get payment methods with addresses for the current user
 */
export async function getUserPaymentMethodsWithAddressesAction() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    const [paymentMethodsWithAddresses, userAddresses] = await Promise.all([
      getUserPaymentMethodsWithAddresses(session.user.id),
      getUserAddresses(session.user.id),
    ]);

    return {
      success: true,
      data: {
        paymentMethods: paymentMethodsWithAddresses,
        addresses: userAddresses,
      },
    };
  } catch (error) {
    console.error('Error fetching payment methods with addresses:', error);
    return {
      success: false,
      error: 'Failed to fetch payment methods',
    };
  }
}

/**
 * Get a specific payment method by ID
 */
export async function getPaymentMethodAction(paymentMethodId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    const paymentMethod = await getUserPaymentMethod(paymentMethodId, session.user.id);

    if (!paymentMethod) {
      return {
        success: false,
        error: 'Payment method not found',
      };
    }

    return {
      success: true,
      data: paymentMethod,
    };
  } catch (error) {
    console.error('Error fetching payment method:', error);
    return {
      success: false,
      error: 'Failed to fetch payment method',
    };
  }
}

/**
 * Create a new payment method from form
 */
export async function createPaymentMethodFormAction(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    // Parse form data
    const cardNumber = formData.get('cardNumber')?.toString() || '';
    const cleanCardNumber = cardNumber.replace(/\D/g, '');
    
    const data = {
      type: (formData.get('type') as 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'APPLE_PAY' | 'GOOGLE_PAY') || 'CREDIT_CARD',
      cardholderName: formData.get('cardholderName')?.toString(),
      cardNumber: cleanCardNumber,
      expiryMonth: formData.get('expiryMonth') ? parseInt(formData.get('expiryMonth') as string) : undefined,
      expiryYear: formData.get('expiryYear') ? parseInt(formData.get('expiryYear') as string) : undefined,
      cvv: formData.get('cvv')?.toString(),
      billingAddressId: getFormValue(formData, 'billingAddressId'),
      isDefault: formData.get('isDefault') === 'true',
    };

    // Validate data
    const validatedData = paymentMethodSchema.parse(data);

    // For card types, we need card details
    if (['CREDIT_CARD', 'DEBIT_CARD'].includes(validatedData.type)) {
      if (!validatedData.cardNumber || !validatedData.cardholderName || !validatedData.expiryMonth || !validatedData.expiryYear) {
        return {
          success: false,
          error: 'Card details are required for card payment methods',
        };
      }
    }

    // Create payment method data
    const paymentMethodData = {
      userId: session.user.id,
      type: validatedData.type,
      cardBrand: validatedData.cardNumber ? getCardBrandFromNumber(validatedData.cardNumber) as any : null,
      cardNumberLast4: validatedData.cardNumber ? validatedData.cardNumber.slice(-4) : null,
      cardholderName: validatedData.cardholderName || null,
      expiryMonth: validatedData.expiryMonth || null,
      expiryYear: validatedData.expiryYear || null,
      billingAddressId: validatedData.billingAddressId || null,
      isDefault: validatedData.isDefault,
    };

    // Create payment method
    const newPaymentMethod = await createPaymentMethod(paymentMethodData);

    // Revalidate the payment methods page
    revalidatePath('/profile/payments');

    return {
      success: true,
      data: newPaymentMethod,
      message: 'Payment method added successfully',
    };
  } catch (error) {
    console.error('Error creating payment method:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation error',
        fieldErrors: error.flatten().fieldErrors,
      };
    }

    return {
      success: false,
      error: 'Failed to add payment method',
    };
  }
}

/**
 * Update an existing payment method from form
 */
export async function updatePaymentMethodFormAction(paymentMethodId: string, formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    // Parse form data
    const data = {
      cardholderName: formData.get('cardholderName')?.toString() || undefined,
      expiryMonth: formData.get('expiryMonth') ? parseInt(formData.get('expiryMonth') as string) : undefined,
      expiryYear: formData.get('expiryYear') ? parseInt(formData.get('expiryYear') as string) : undefined,
      billingAddressId: getFormValue(formData, 'billingAddressId'),
      isDefault: formData.get('isDefault') === 'true',
    };

    // Update payment method (we don't allow changing card number for security)
    const updatedPaymentMethod = await updatePaymentMethod(
      paymentMethodId,
      session.user.id,
      {
        cardholderName: data.cardholderName,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        billingAddressId: data.billingAddressId,
        isDefault: data.isDefault,
      }
    );

    if (!updatedPaymentMethod) {
      return {
        success: false,
        error: 'Payment method not found or unauthorized',
      };
    }

    // Revalidate the payment methods page
    revalidatePath('/profile/payments');

    return {
      success: true,
      data: updatedPaymentMethod,
      message: 'Payment method updated successfully',
    };
  } catch (error) {
    console.error('Error updating payment method:', error);
    return {
      success: false,
      error: 'Failed to update payment method',
    };
  }
}

/**
 * Delete a payment method
 */
export async function deletePaymentMethodAction(paymentMethodId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    const deleted = await deletePaymentMethod(paymentMethodId, session.user.id);

    if (!deleted) {
      return {
        success: false,
        error: 'Payment method not found or unauthorized',
      };
    }

    // Revalidate the payment methods page
    revalidatePath('/profile/payments');

    return {
      success: true,
      message: 'Payment method deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return {
      success: false,
      error: 'Failed to delete payment method',
    };
  }
}

/**
 * Set a payment method as default
 */
export async function setDefaultPaymentMethodAction(paymentMethodId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    const defaultPaymentMethod = await setDefaultPaymentMethod(paymentMethodId, session.user.id);

    if (!defaultPaymentMethod) {
      return {
        success: false,
        error: 'Payment method not found or unauthorized',
      };
    }

    // Revalidate the payment methods page
    revalidatePath('/profile/payments');

    return {
      success: true,
      data: defaultPaymentMethod,
      message: 'Default payment method updated successfully',
    };
  } catch (error) {
    console.error('Error setting default payment method:', error);
    return {
      success: false,
      error: 'Failed to set default payment method',
    };
  }
}

/**
 * Create a new payment method with validated input
 */
export async function createPaymentMethodAction(input: {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  billingAddressId: string;
  isDefault?: boolean;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    // Clean card number
    const cleanCardNumber = input.cardNumber.replace(/\D/g, '');
    
    // Validate card number using Luhn algorithm
    if (!validateCardNumber(cleanCardNumber)) {
      return {
        success: false,
        error: 'Invalid card number',
      };
    }

    const cardBrand = detectCardBrand(cleanCardNumber);

    // Create payment method data
    const paymentMethodData = {
      userId: session.user.id,
      type: 'CREDIT_CARD' as const,
      cardBrand: cardBrand as any,
      cardNumberLast4: cleanCardNumber.slice(-4),
      cardholderName: input.cardholderName,
      expiryMonth: parseInt(input.expiryMonth, 10),
      expiryYear: parseInt(input.expiryYear, 10),
      billingAddressId: input.billingAddressId,
      isDefault: input.isDefault || false,
    };

    // Create payment method
    const newPaymentMethod = await createPaymentMethod(paymentMethodData);

    // Revalidate the payment methods page
    revalidatePath('/profile/payments');

    return {
      success: true,
      data: newPaymentMethod,
      message: 'Payment method added successfully',
    };
  } catch (error) {
    console.error('Error creating payment method:', error);
    return {
      success: false,
      error: 'Failed to add payment method',
    };
  }
}

/**
 * Update payment method with validated input
 */
export async function updatePaymentMethodAction(input: {
  id: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  billingAddressId: string;
  isDefault?: boolean;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    // Update payment method (we don't allow changing card number for security)
    const updatedPaymentMethod = await updatePaymentMethod(
      input.id,
      session.user.id,
      {
        cardholderName: input.cardholderName,
        expiryMonth: parseInt(input.expiryMonth, 10),
        expiryYear: parseInt(input.expiryYear, 10),
        billingAddressId: input.billingAddressId,
        isDefault: input.isDefault || false,
      }
    );

    if (!updatedPaymentMethod) {
      return {
        success: false,
        error: 'Payment method not found or unauthorized',
      };
    }

    // Revalidate the payment methods page
    revalidatePath('/profile/payments');

    return {
      success: true,
      data: updatedPaymentMethod,
      message: 'Payment method updated successfully',
    };
  } catch (error) {
    console.error('Error updating payment method:', error);
    return {
      success: false,
      error: 'Failed to update payment method',
    };
  }
}

// Types for form handling
export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

export type PaymentMethodActionResult = {
  success: boolean;
  data?: PaymentMethod;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};
