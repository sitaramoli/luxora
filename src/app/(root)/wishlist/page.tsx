import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';

import { auth } from '@/auth';
import WishlistContent from '@/components/wishlist/WishlistContent';
import WishlistSkeleton from '@/components/wishlist/WishlistSkeleton';

export const metadata: Metadata = {
  title: 'My Wishlist - Luxora',
  description: 'View and manage your favorite products',
};

const WishlistPage = async () => {
  const session = await auth();

  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect('/sign-in?callbackUrl=/wishlist');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

        <Suspense fallback={<WishlistSkeleton />}>
          <WishlistContent />
        </Suspense>
      </div>
    </div>
  );
};

export default WishlistPage;
