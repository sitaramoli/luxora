import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email({ error: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { error: 'Password must be at least 8 characters' }),
  rememberMe: z.boolean(),
});

export const signUpSchema = z
  .object({
    fullName: z.string().min(3, { error: 'Name is required' }),
    email: z.email({ error: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { error: 'Password must be at least 8 characters' })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine(value => value, {
      error: 'You must accept the terms and conditions',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  category: z.string().min(1, 'Please select a category'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
