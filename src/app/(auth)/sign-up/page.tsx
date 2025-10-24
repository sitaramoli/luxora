'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Crown,
  Loader,
  Mail,
  Shield,
  Sparkles,
  User,
  Lock,
  EyeOff,
  Eye,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { signUp } from '@/lib/actions/auth/auth';
import { cn } from '@/lib/utils';
import { signUpSchema } from '@/lib/validations';

const benefits = [
  {
    icon: Crown,
    title: 'Exclusive Access',
    description: 'Get early access to new collections and limited editions',
    className: 'text-yellow-600',
    backgroundColor: 'bg-yellow-100',
  },
  {
    icon: Shield,
    title: 'Secure Shopping',
    description: 'Your personal and payment information is always protected',
    className: 'text-blue-600',
    backgroundColor: 'bg-blue-100',
  },
  {
    icon: Sparkles,
    title: 'Personalized Experience',
    description: 'Receive curated recommendations based on your preferences',
    className: 'text-purple-600',
    backgroundColor: 'bg-purple-100',
  },
];

type SignupFormData = z.infer<typeof signUpSchema>;

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const password = watch('password');

  const passwordRequirements = [
    { label: 'At least 8 characters', met: password?.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password || '') },
    { label: 'One lowercase letter', met: /[a-z]/.test(password || '') },
    { label: 'One number', met: /\d/.test(password || '') },
  ];

  const onSubmit = async (data: SignupFormData) => {
    const result = await signUp(data);
    if (result.success) {
      toast.success('Success', {
        description: 'Your luxury account has been created.',
      });
      router.push('/');
    } else {
      toast.error('Error', {
        description: result.error,
      });
    }
  };

  return (
    <>
      {/* Left Side - Branding */}
      <div className="hidden lg:block space-y-8">
        <div className="text-center lg:text-left">
          <Link href="/" className="inline-flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent uppercase">
              Luxora
            </span>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join the luxury community
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Create your account to unlock exclusive access to the world&#39;s
            most prestigious brands and collections.
          </p>
        </div>

        <div className="space-y-6">
          {benefits.map(
            (
              { title, description, icon: Icon, backgroundColor, className },
              index
            ) => (
              <div key={index} className="flex items-start gap-4">
                <div
                  className={cn(
                    'w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0',
                    backgroundColor
                  )}
                >
                  <Icon className={cn('h-6 w-6 text-gray-700', className)} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-gray-600">{description}</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Right Side - sign up Form */}
      <div className="w-full max-w-md mx-auto lg:mx-0">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center lg:hidden mb-6">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <span className="text-2xl font-bold text-black uppercase">
                  Luxora
                </span>
              </Link>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Create your account
            </CardTitle>
            <p className="text-center text-gray-600">
              Join thousands of luxury enthusiasts worldwide
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    {...register('fullName')}
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className={cn(
                      'pl-10 h-12 border-gray-200 focus:border-black focus:ring-black rounded-xl',
                      errors.fullName &&
                        'border-red-300 focus:border-red-500 focus:ring-red-500'
                    )}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-600 text-sm">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    {...register('email')}
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className={cn(
                      'pl-10 h-12 border-gray-200 focus:border-black focus:ring-black rounded-xl',
                      errors.email &&
                        'border-red-300 focus:border-red-500 focus:ring-red-500'
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    {...register('password')}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    className={cn(
                      'pl-10 pr-10 h-12 border-gray-200 focus:border-black focus:ring-black rounded-xl',
                      errors.password &&
                        'border-red-300 focus:border-red-500 focus:ring-red-500'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm">
                    {errors.password.message}
                  </p>
                )}

                {/* Password Requirements */}
                {password && (
                  <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      Password requirements:
                    </p>
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle
                          className={cn(
                            'h-3 w-3',
                            req.met ? 'text-green-500' : 'text-gray-300'
                          )}
                        />
                        <span
                          className={cn(
                            'text-xs',
                            req.met ? 'text-green-700' : 'text-gray-500'
                          )}
                        >
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    {...register('confirmPassword')}
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className={cn(
                      'pl-10 pr-10 h-12 border-gray-200 focus:border-black focus:ring-black rounded-xl',
                      errors.confirmPassword &&
                        'border-red-300 focus:border-red-500 focus:ring-red-500'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-3">
                <Controller
                  name={'acceptTerms'}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="acceptTerms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded mt-0.5"
                    />
                  )}
                />
                <Label
                  htmlFor="acceptTerms"
                  className="text-sm text-gray-700 leading-relaxed"
                >
                  I agree to the{' '}
                  <Link
                    href="/terms"
                    className="text-black hover:text-gray-700 font-medium transition-colors underline"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    className="text-black hover:text-gray-700 font-medium transition-colors underline"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-red-600 text-sm">
                  {errors.acceptTerms.message}
                </p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <Loader className="animate-spin" />
                ) : (
                  'Create account'
                )}
              </Button>
            </form>

            <Separator />

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/sign-in"
                  className="text-black hover:text-gray-700 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Page;
