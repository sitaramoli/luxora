'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const WishlistSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Stats skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
      
      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Image skeleton */}
            <Skeleton className="w-full h-48" />
            
            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistSkeleton;