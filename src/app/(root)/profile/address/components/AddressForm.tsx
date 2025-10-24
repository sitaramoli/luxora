'use client';

import { Save, Loader2 } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Address } from '@/database/schema';
import {
  createAddressAction,
  updateAddressAction,
} from '@/lib/actions/addresses';

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Japan',
  'South Korea',
];

interface AddressFormProps {
  address?: Address;
  onSuccess: () => void;
  isEditing?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  address,
  onSuccess,
  isEditing = false,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when address changes
  useEffect(() => {
    if (formRef.current && address && isEditing) {
      // Reset form with new address data
      formRef.current.reset();
    }
  }, [address, isEditing]);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    try {
      const result =
        isEditing && address
          ? await updateAddressAction(address.id, formData)
          : await createAddressAction(formData);

      if (result.success) {
        toast.success(
          result.message ||
            `Address ${isEditing ? 'updated' : 'created'} successfully!`
        );
        onSuccess();
      } else {
        if (result.fieldErrors) {
          // Handle field-specific errors
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            if (errors && Array.isArray(errors) && errors.length > 0) {
              toast.error(`${field}: ${errors[0]}`);
            }
          });
        } else {
          toast.error(
            result.error ||
              `Failed to ${isEditing ? 'update' : 'create'} address`
          );
        }
      }
    } catch (error) {
      console.error('Error submitting address form:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} address`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            name="fullName"
            defaultValue={address?.fullName || ''}
            placeholder="Enter your full name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Address Type</Label>
          <Select name="type" defaultValue={address?.type || 'HOME'}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HOME">Home</SelectItem>
              <SelectItem value="WORK">Work</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressLine1">Address Line 1 *</Label>
        <Input
          id="addressLine1"
          name="addressLine1"
          defaultValue={address?.addressLine1 || ''}
          placeholder="Street address, P.O. box, company name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
        <Input
          id="addressLine2"
          name="addressLine2"
          defaultValue={address?.addressLine2 || ''}
          placeholder="Apartment, suite, unit, building, floor, etc."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            name="city"
            defaultValue={address?.city || ''}
            placeholder="City"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State/Province *</Label>
          <Input
            id="state"
            name="state"
            defaultValue={address?.state || ''}
            placeholder="State or Province"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code *</Label>
          <Input
            id="postalCode"
            name="postalCode"
            defaultValue={address?.postalCode || ''}
            placeholder="ZIP/Postal code"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Select
            name="country"
            defaultValue={address?.country || 'United States'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map(country => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={address?.phone || ''}
            placeholder="Phone number"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDefault"
          name="isDefault"
          defaultChecked={address?.isDefault}
          value="true"
        />
        <Label htmlFor="isDefault" className="text-sm font-medium">
          Set as default address
        </Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Update Address' : 'Save Address'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;
