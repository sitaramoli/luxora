import { Loader } from 'lucide-react';
import type { Metadata } from 'next';
import React, { Suspense } from 'react';

import { auth } from '@/auth';
import CartContent from '@/components/cart/CartContent';

export const metadata: Metadata = {
  title: 'Shopping Cart - Luxora',
  description: 'View and manage your cart items',
};

const CartSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center py-12">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    </div>
  );
};

const CartPage = async () => {
  const session = await auth();

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CartContent />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={<CartSkeleton />}>
          <CartContent />
        </Suspense>
      </div>
    </div>
  );
};

export default CartPage;
