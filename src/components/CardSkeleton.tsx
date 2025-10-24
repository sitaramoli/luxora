import React, { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const CardSkeleton = memo(() => (
  <div
    className="flex flex-col space-y-3"
    role="status"
    aria-label="Loading..."
  >
    <Skeleton className="h-[300px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
));

CardSkeleton.displayName = 'CardSkeleton';

export default CardSkeleton;
