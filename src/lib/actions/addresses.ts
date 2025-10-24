'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { auth } from '@/auth';
import type { Address } from '@/database/schema';
import {
  getUserAddresses,
  getUserAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getUserDefaultAddress,
} from '@/lib/services/addresses';

// Validation schema for address form
const addressSchema = z.object({
  type: z.enum(['HOME', 'WORK', 'OTHER']),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().nullable().optional(),
  addressLine1: z.string().min(5, 'Address line 1 is required'),
  addressLine2: z.string().nullable().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(5, 'Valid postal code is required'),
  country: z.string().min(2, 'Country is required').default('United States'),
  isDefault: z.boolean().default(false),
});

// Helper function to safely get form data
function getFormValue(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (value === null || value === '') return null;
  return value as string;
}

/**
 * Get all addresses for the current user
 */
export async function getUserAddressesAction() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    const addresses = await getUserAddresses(session.user.id);

    return {
      success: true,
      data: addresses,
    };
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    return {
      success: false,
      error: 'Failed to fetch addresses',
    };
  }
}

/**
 * Get a specific address by ID
 */
export async function getAddressAction(addressId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    const address = await getUserAddress(addressId, session.user.id);

    if (!address) {
      return {
        success: false,
        error: 'Address not found',
      };
    }

    return {
      success: true,
      data: address,
    };
  } catch (error) {
    console.error('Error fetching address:', error);
    return {
      success: false,
      error: 'Failed to fetch address',
    };
  }
}

/**
 * Get user's default address
 */
export async function getDefaultAddressAction() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    const defaultAddress = await getUserDefaultAddress(session.user.id);

    return {
      success: true,
      data: defaultAddress,
    };
  } catch (error) {
    console.error('Error fetching default address:', error);
    return {
      success: false,
      error: 'Failed to fetch default address',
    };
  }
}

/**
 * Create a new address
 */
export async function createAddressAction(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    // Parse form data with proper null handling
    const data = {
      type: (formData.get('type') as 'HOME' | 'WORK' | 'OTHER') || 'HOME',
      fullName: formData.get('fullName')?.toString() || '',
      phone: getFormValue(formData, 'phone'),
      addressLine1: formData.get('addressLine1')?.toString() || '',
      addressLine2: getFormValue(formData, 'addressLine2'),
      city: formData.get('city')?.toString() || '',
      state: formData.get('state')?.toString() || '',
      postalCode: formData.get('postalCode')?.toString() || '',
      country: formData.get('country')?.toString() || 'United States',
      isDefault: formData.get('isDefault') === 'true',
    };


    // Validate data
    const validatedData = addressSchema.parse(data);

    // Create address
    const newAddress = await createAddress({
      ...validatedData,
      userId: session.user.id,
    });

    // Revalidate the addresses page
    revalidatePath('/profile/address');

    return {
      success: true,
      data: newAddress,
      message: 'Address created successfully',
    };
  } catch (error) {
    console.error('Error creating address:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation error',
        fieldErrors: error.flatten().fieldErrors,
      };
    }

    return {
      success: false,
      error: 'Failed to create address',
    };
  }
}

/**
 * Update an existing address
 */
export async function updateAddressAction(addressId: string, formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    // Parse form data with proper null handling
    const data = {
      type: (formData.get('type') as 'HOME' | 'WORK' | 'OTHER') || 'HOME',
      fullName: formData.get('fullName')?.toString() || '',
      phone: getFormValue(formData, 'phone'),
      addressLine1: formData.get('addressLine1')?.toString() || '',
      addressLine2: getFormValue(formData, 'addressLine2'),
      city: formData.get('city')?.toString() || '',
      state: formData.get('state')?.toString() || '',
      postalCode: formData.get('postalCode')?.toString() || '',
      country: formData.get('country')?.toString() || 'United States',
      isDefault: formData.get('isDefault') === 'true',
    };


    // Validate data
    const validatedData = addressSchema.parse(data);

    // Update address
    const updatedAddress = await updateAddress(
      addressId,
      session.user.id,
      validatedData
    );

    if (!updatedAddress) {
      return {
        success: false,
        error: 'Address not found or unauthorized',
      };
    }

    // Revalidate the addresses page
    revalidatePath('/profile/address');

    return {
      success: true,
      data: updatedAddress,
      message: 'Address updated successfully',
    };
  } catch (error) {
    console.error('Error updating address:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation error',
        fieldErrors: error.flatten().fieldErrors,
      };
    }

    return {
      success: false,
      error: 'Failed to update address',
    };
  }
}

/**
 * Delete an address
 */
export async function deleteAddressAction(addressId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    const deleted = await deleteAddress(addressId, session.user.id);

    if (!deleted) {
      return {
        success: false,
        error: 'Address not found or unauthorized',
      };
    }

    // Revalidate the addresses page
    revalidatePath('/profile/address');

    return {
      success: true,
      message: 'Address deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting address:', error);
    return {
      success: false,
      error: 'Failed to delete address',
    };
  }
}

/**
 * Set an address as default
 */
export async function setDefaultAddressAction(addressId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    const defaultAddress = await setDefaultAddress(addressId, session.user.id);

    if (!defaultAddress) {
      return {
        success: false,
        error: 'Address not found or unauthorized',
      };
    }

    // Revalidate the addresses page
    revalidatePath('/profile/address');

    return {
      success: true,
      data: defaultAddress,
      message: 'Default address updated successfully',
    };
  } catch (error) {
    console.error('Error setting default address:', error);
    return {
      success: false,
      error: 'Failed to set default address',
    };
  }
}

// Types for form handling
export type AddressFormData = z.infer<typeof addressSchema>;

export type AddressActionResult = {
  success: boolean;
  data?: Address;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};