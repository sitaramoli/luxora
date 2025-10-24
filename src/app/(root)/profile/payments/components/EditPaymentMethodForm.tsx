'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, MapPin } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Address, PaymentMethod } from '@/database/schema';
import { updatePaymentMethodAction } from '@/lib/actions/payment-methods';
import { updatePaymentMethodSchema } from '@/lib/validations/payment-methods';

interface EditPaymentMethodFormProps {
  paymentMethod: PaymentMethod;
  billingAddress: Address | null;
  addresses: Address[];
  onSuccess: () => void;
}

// Helper function to get a card brand display name
const getCardBrandName = (brand: string): string => {
  const brandNames: Record<string, string> = {
    VISA: 'Visa',
    MASTERCARD: 'Mastercard',
    AMEX: 'American Express',
    DISCOVER: 'Discover',
    JCB: 'JCB',
    DINERS: 'Diners Club',
  };
  return brandNames[brand] || brand;
};

// Helper function to get card brand emoji
const getCardBrandEmoji = (brand: string): string => {
  const brandEmojis: Record<string, string> = {
    VISA: '💳',
    MASTERCARD: '💳',
    AMEX: '💳',
    DISCOVER: '💳',
    JCB: '💳',
    DINERS: '💳',
  };
  return brandEmojis[brand] || '💳';
};

const EditPaymentMethodForm: React.FC<EditPaymentMethodFormProps> = ({
  paymentMethod,
  billingAddress,
  addresses,
  onSuccess,
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(updatePaymentMethodSchema),
    defaultValues: {
      id: paymentMethod.id,
      cardholderName: paymentMethod.cardholderName || '',
      expiryMonth: paymentMethod.expiryMonth
        ? paymentMethod.expiryMonth.toString().padStart(2, '0')
        : '',
      expiryYear: paymentMethod.expiryYear
        ? paymentMethod.expiryYear.toString().padStart(2, '0')
        : '',
      billingAddressId: paymentMethod.billingAddressId || '',
      isDefault: paymentMethod.isDefault,
    },
  });

  const onSubmit = (data: any) => {
    startTransition(async () => {
      try {
        const result = await updatePaymentMethodAction(data);

        if (result.success) {
          toast.success('Payment method updated successfully!');
          onSuccess();
        } else {
          toast.error(result.error || 'Failed to update payment method');
        }
      } catch (error) {
        console.error('Error updating payment method:', error);
        toast.error('An unexpected error occurred');
      }
    });
  };

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      value: month.toString().padStart(2, '0'),
      label: month.toString().padStart(2, '0'),
    };
  });

  // Generate year options (current year + 10 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => {
    const year = currentYear + i;
    const shortYear = year.toString().slice(2);
    return {
      value: shortYear,
      label: shortYear,
    };
  });

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Card Information Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold">Card Information</h3>
                </div>

                {/* Display Card Number (read-only) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Card Number
                  </label>
                  <div className="relative">
                    <Input
                      value={`**** **** **** ${paymentMethod.cardNumberLast4 || '****'}`}
                      readOnly
                      disabled
                      className="bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className="text-sm text-gray-500">
                        {getCardBrandEmoji(paymentMethod.cardBrand || 'VISA')}{' '}
                        {getCardBrandName(paymentMethod.cardBrand || 'VISA')}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Card number cannot be changed for security reasons
                  </p>
                </div>

                {/* Cardholder Name */}
                <FormField
                  control={form.control}
                  name="cardholderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cardholder Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          onChange={e => {
                            // Convert to uppercase as it appears on cards
                            field.onChange(e.target.value.toUpperCase());
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Expiry Date */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Month</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {monthOptions.map(option => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expiryYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Year</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="YY" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {yearOptions.map(option => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Address Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold">Billing Address</h3>
                </div>

                <FormField
                  control={form.control}
                  name="billingAddressId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Billing Address</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a billing address" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {addresses.map(address => (
                            <SelectItem key={address.id} value={address.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {address.addressLine1}
                                  {address.addressLine2 &&
                                    `, ${address.addressLine2}`}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {address.city}, {address.state}{' '}
                                  {address.postalCode}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      {addresses.length === 0 && (
                        <p className="text-sm text-gray-500">
                          No addresses found. Please add an address first in
                          your profile.
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                {/* Current billing address display */}
                {billingAddress && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">
                      <strong>Current billing address:</strong>
                    </p>
                    <p className="text-sm text-gray-700">
                      {billingAddress.addressLine1}
                      {billingAddress.addressLine2 &&
                        `, ${billingAddress.addressLine2}`}
                    </p>
                    <p className="text-sm text-gray-700">
                      {billingAddress.city}, {billingAddress.state}{' '}
                      {billingAddress.postalCode}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Default Payment Method */}
          <FormField
            control={form.control}
            name="isDefault"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Set as default payment method</FormLabel>
                  <p className="text-sm text-gray-500">
                    This will be used as your preferred payment method for
                    future orders.
                  </p>
                </div>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isPending || addresses.length === 0}
              className="flex-1"
            >
              {isPending ? 'Updating...' : 'Update Payment Method'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditPaymentMethodForm;
