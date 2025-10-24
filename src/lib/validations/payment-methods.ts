import { z } from 'zod';
import { CARD_BRAND_ENUM } from '@/database/schema';

// Helper function to validate credit card number using Luhn algorithm
const validateCardNumber = (cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/\s+/g, '');
  if (!/^\d+$/.test(cleanNumber) || cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// Helper function to detect card brand from number
const detectCardBrand = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\s+/g, '');
  
  // Visa
  if (/^4/.test(cleanNumber)) return 'VISA';
  
  // Mastercard
  if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) return 'MASTERCARD';
  
  // American Express
  if (/^3[47]/.test(cleanNumber)) return 'AMEX';
  
  // Discover
  if (/^6(?:011|5)/.test(cleanNumber)) return 'DISCOVER';
  
  // JCB
  if (/^35(?:2[89]|[3-8])/.test(cleanNumber)) return 'JCB';
  
  // Diners Club
  if (/^3[0689]/.test(cleanNumber)) return 'DINERS';
  
  return 'VISA'; // Default fallback
};

// Helper function to validate expiry date
const validateExpiryDate = (month: number, year: number): boolean => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
  const currentYear = now.getFullYear();
  
  // Convert 2-digit year to 4-digit year
  const fullYear = year < 100 ? 2000 + year : year;
  
  if (fullYear < currentYear) return false;
  if (fullYear === currentYear && month < currentMonth) return false;
  
  return true;
};

export const addPaymentMethodSchema = z.object({
  cardNumber: z
    .string()
    .min(1, 'Card number is required')
    .refine(
      (value) => validateCardNumber(value),
      'Invalid card number'
    ),
  cardholderName: z
    .string()
    .min(1, 'Cardholder name is required')
    .min(2, 'Cardholder name must be at least 2 characters')
    .max(100, 'Cardholder name must be less than 100 characters'),
  expiryMonth: z
    .string()
    .min(1, 'Expiry month is required')
    .refine((value) => {
      const month = parseInt(value, 10);
      return month >= 1 && month <= 12;
    }, 'Invalid month'),
  expiryYear: z
    .string()
    .min(1, 'Expiry year is required')
    .refine((value) => {
      const year = parseInt(value, 10);
      return year >= 0 && year <= 99;
    }, 'Invalid year'),
  billingAddressId: z
    .string()
    .min(1, 'Please select a billing address'),
  isDefault: z.boolean().optional().default(false),
}).refine(
  (data) => {
    const month = parseInt(data.expiryMonth, 10);
    const year = parseInt(data.expiryYear, 10);
    return validateExpiryDate(month, year);
  },
  {
    message: 'Card has expired',
    path: ['expiryMonth'],
  }
);

export const updatePaymentMethodSchema = z.object({
  id: z.string().min(1, 'Payment method ID is required'),
  cardholderName: z
    .string()
    .min(1, 'Cardholder name is required')
    .min(2, 'Cardholder name must be at least 2 characters')
    .max(100, 'Cardholder name must be less than 100 characters'),
  expiryMonth: z
    .string()
    .min(1, 'Expiry month is required')
    .refine((value) => {
      const month = parseInt(value, 10);
      return month >= 1 && month <= 12;
    }, 'Invalid month'),
  expiryYear: z
    .string()
    .min(1, 'Expiry year is required')
    .refine((value) => {
      const year = parseInt(value, 10);
      return year >= 0 && year <= 99;
    }, 'Invalid year'),
  billingAddressId: z
    .string()
    .min(1, 'Please select a billing address'),
  isDefault: z.boolean().optional().default(false),
}).refine(
  (data) => {
    const month = parseInt(data.expiryMonth, 10);
    const year = parseInt(data.expiryYear, 10);
    return validateExpiryDate(month, year);
  },
  {
    message: 'Card has expired',
    path: ['expiryMonth'],
  }
);

export type AddPaymentMethodInput = z.infer<typeof addPaymentMethodSchema>;
export type UpdatePaymentMethodInput = z.infer<typeof updatePaymentMethodSchema>;

// Export helper functions for use in components
export { validateCardNumber, detectCardBrand, validateExpiryDate };