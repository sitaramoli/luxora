"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Shield,
  Sparkles,
  Lock,
  EyeOff,
  Eye,
  Loader,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { signInSchema } from "@/lib/validations";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signInWithCredentials } from "@/lib/actions/auth/auth";
import { useRouter } from "next/navigation";

const benefits = [
  {
    icon: Shield,
    title: "Secure Access",
    description: "Your account is protected with enterprise-grade security",
    className: "text-blue-600",
    backgroundColor: "bg-blue-100",
  },
  {
    icon: Sparkles,
    title: "Premium Experience",
    description: "Enjoy personalized luxury shopping experience",
    className: "text-purple-600",
    backgroundColor: "bg-purple-100",
  },
];

type SignInFormData = z.infer<typeof signInSchema>;

const Page = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    const result = await signInWithCredentials(data);
    if (result.success) {
      router.push("/");
    } else {
      toast.error("Error", {
        description: result.error,
      });
    }
  };

  return (
    <>
      {/* Left side - Branding */}
      <div className="hidden lg:block space-y-8">
        <div className="text-center lg:text-left">
          <Link href={"/"} className="inline-flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-black to-gray-800 flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">L</span>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent uppercase">
              Luxora
            </span>
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to the world of luxury
          </h1>
          <p>
            Access your exclusive account to discover premium collections from
            the world&#39;s most prestigious brands.
          </p>
        </div>
        <div className="space-y-6">
          {benefits.map(
            (
              { title, description, icon: Icon, backgroundColor, className },
              index,
            ) => (
              <div key={index} className="flex items-start gap-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0",
                    backgroundColor,
                  )}
                >
                  <Icon className={cn("h-6 w-6 text-gray-700", className)} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-gray-600">{description}</p>
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Right side - Sign in form */}
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
              Sign in to your account
            </CardTitle>
            <p className="text-center text-gray-600">
              Enter your credentials to access your luxury account
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className={cn(
                      "pl-10 h-12 border-gray-200 focus:border-black focus:ring-black rounded-xl",
                      errors.email &&
                        "border-red-300 focus:border-red-500 focus:ring-red-500",
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
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={cn(
                      "pl-10 pr-10 h-12 border-gray-200 focus:border-black focus:ring-black rounded-xl",
                      errors.password &&
                        "border-red-300 focus:border-red-500 focus:ring-red-500",
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
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Controller
                    name={"rememberMe"}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="rememberMe"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                      />
                    )}
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Remember me
                  </Label>
                </div>
                {/*TODO: Forgot password link */}
                {/*<Link*/}
                {/*  href="#"*/}
                {/*  className="text-sm text-black hover:text-gray-700 font-medium transition-colors"*/}
                {/*>*/}
                {/*  Forgot password?*/}
                {/*</Link>*/}
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? <Loader className="animate-spin" /> : "Sign in"}
              </Button>
            </form>
            <Separator />
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don&#39;t have an account?{" "}
                <Link
                  href="/sign-up"
                  className="text-black hover:text-gray-700 font-medium transition-colors"
                >
                  Create account
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
