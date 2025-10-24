'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { changePasswordAction } from '@/lib/actions/profile';

const PasswordFormSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof PasswordFormSchema>;

export const PasswordForm: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(PasswordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordFormData) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('currentPassword', data.currentPassword);
      formData.append('newPassword', data.newPassword);
      formData.append('confirmPassword', data.confirmPassword);

      const result = await changePasswordAction(formData);

      if (result.success) {
        toast.success('Password changed successfully!');
        reset();
      } else {
        toast.error(result.error || 'Failed to change password');
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password *</Label>
        <div className="relative">
          <Input
            id="currentPassword"
            type={showCurrentPassword ? 'text' : 'password'}
            {...register('currentPassword')}
            disabled={isPending}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            disabled={isPending}
          >
            {showCurrentPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.currentPassword && (
          <p className="text-sm text-red-600">{errors.currentPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password *</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            {...register('newPassword')}
            disabled={isPending}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowNewPassword(!showNewPassword)}
            disabled={isPending}
          >
            {showNewPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.newPassword && (
          <p className="text-sm text-red-600">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password *</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            disabled={isPending}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isPending}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Lock className="h-4 w-4 mr-2" />
        )}
        Change Password
      </Button>
    </form>
  );
};