'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { updateUserProfileAction } from '@/lib/actions/profile';
import { UserProfile } from '@/types';

const ProfileFormSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(255),
  email: z.string().email('Invalid email address').max(255),
  phone: z.string().max(10).optional().or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  image: z.string().optional(),
});

type ProfileFormData = z.infer<typeof ProfileFormSchema>;

interface ProfileFormProps {
  user: UserProfile;
  onCancel: () => void;
  onSuccess: (updatedUser: UserProfile) => void;
  onImageChange?: (imagePath: string) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  onCancel,
  onSuccess,
  onImageChange,
}) => {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      gender: user.gender || 'MALE',
      image: user.image || '',
    },
  });

  const genderValue = watch('gender');

  const handleImageChange = (imagePath: string) => {
    setValue('image', imagePath, { shouldDirty: true });
    if (onImageChange) {
      onImageChange(imagePath);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('phone', data.phone || '');
      formData.append('gender', data.gender);
      formData.append('image', data.image || '');

      const result = await updateUserProfileAction(formData);

      if (result.success && result.data) {
        toast.success('Profile updated successfully!');
        onSuccess(result.data);
      } else {
        toast.error(result.error || 'Failed to update profile');
        if (result.fieldErrors) {
          // Handle field-specific errors
          Object.entries(result.fieldErrors).forEach(([field, messages]) => {
            if (messages && messages.length > 0) {
              toast.error(`${field}: ${messages[0]}`);
            }
          });
        }
      }
    });
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            {...register('fullName')}
            disabled={isPending}
          />
          {errors.fullName && (
            <p className="text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            disabled={isPending}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            {...register('phone')}
            disabled={isPending}
            placeholder="Optional"
          />
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select
            value={genderValue}
            onValueChange={(value: ProfileFormData['gender']) =>
              setValue('gender', value, { shouldDirty: true })
            }
            disabled={isPending}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Gender</SelectLabel>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isPending}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!isDirty || isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </form>
  );
};