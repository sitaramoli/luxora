'use server';

import { auth } from '@/auth';
import { updateUserProfile } from '@/lib/services/users';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const UpdateProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(255),
  email: z.string().email('Invalid email address').max(255),
  phone: z.string().max(10).optional().nullable(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  image: z.string().optional().nullable(),
});

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ["confirmPassword"],
});

export async function updateUserProfileAction(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    const validatedFields = UpdateProfileSchema.safeParse({
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone') || null,
      gender: formData.get('gender'),
      image: formData.get('image') || null,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error: 'Invalid form data',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { fullName, email, phone, gender, image } = validatedFields.data;

    // Check if email is already taken by another user
    if (email !== session.user.email) {
      const existingUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0 && existingUser[0].id !== session.user.id) {
        return {
          success: false,
          error: 'Email is already taken',
        };
      }
    }

    const updatedUser = await updateUserProfile(session.user.id, {
      fullName,
      email,
      phone: phone || undefined,
      gender,
      image: image || undefined,
    });

    // Revalidate cache to ensure fresh data is loaded
    revalidatePath('/profile');
    revalidatePath('/');

    return {
      success: true,
      data: updatedUser,
      // Include session refresh instruction
      sessionRefreshRequired: true,
    };
  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function updateProfileImageAction(imagePath: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    // Validate image path
    if (!imagePath || typeof imagePath !== 'string') {
      return {
        success: false,
        error: 'Invalid image path',
      };
    }

    const updatedUser = await updateUserProfile(session.user.id, {
      image: imagePath,
    });

    // Revalidate cache to ensure fresh data is loaded
    revalidatePath('/profile');
    revalidatePath('/');

    return {
      success: true,
      data: updatedUser,
      // Include session refresh instruction
      sessionRefreshRequired: true,
    };
  } catch (error) {
    console.error('Profile image update error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function changePasswordAction(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    const validatedFields = ChangePasswordSchema.safeParse({
      currentPassword: formData.get('currentPassword'),
      newPassword: formData.get('newPassword'),
      confirmPassword: formData.get('confirmPassword'),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error: 'Invalid form data',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { currentPassword, newPassword } = validatedFields.data;

    // Get current user with password
    const [user] = await db
      .select({ password: users.password })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      return {
        success: false,
        error: 'Current password is incorrect',
        fieldErrors: {
          currentPassword: ['Current password is incorrect'],
        },
      };
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password in database
    await db
      .update(users)
      .set({ password: hashedNewPassword })
      .where(eq(users.id, session.user.id));

    return {
      success: true,
    };
  } catch (error) {
    console.error('Password change error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}