'use client';

import {
  Package,
  ShoppingCart,
  Star,
  Archive,
  AlertTriangle,
  RefreshCw,
  Activity as ActivityIcon,
  TrendingUp,
  Clock,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getMerchantActivityAction } from '@/lib/actions/merchant-dashboard';
import type { ActivityItem } from '@/lib/services/merchant-dashboard';
import { cn } from '@/lib/utils';

const ACTIVITY_TYPE_CONFIG = {
  order: {
    icon: ShoppingCart,
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
  },
  product: {
    icon: Package,
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
  },
  review: {
    icon: Star,
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
  },
  inventory: {
    icon: Archive,
    color: 'bg-purple-500',
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-50',
  },
  warning: {
    icon: AlertTriangle,
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
  },
  success: {
    icon: TrendingUp,
    color: 'bg-emerald-500',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
  },
  user: {
    icon: Star,
    color: 'bg-indigo-500',
    textColor: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
  },
} as const;

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
  Published: 'bg-green-100 text-green-800',
  Live: 'bg-green-100 text-green-800',
  Draft: 'bg-gray-100 text-gray-800',
  Alert: 'bg-red-100 text-red-800',
} as const;

interface ActivityCardProps {
  activity: ActivityItem;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const config =
    ACTIVITY_TYPE_CONFIG[activity.type] || ACTIVITY_TYPE_CONFIG.order;
  const Icon = config.icon;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div
            className={cn(
              'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
              config.bgColor
            )}
          >
            <Icon className={cn('w-5 h-5', config.textColor)} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {activity.title}
              </h3>
              <div className="flex items-center space-x-2">
                <Badge
                  className={cn(
                    'text-xs font-medium',
                    STATUS_COLORS[
                      activity.status as keyof typeof STATUS_COLORS
                    ] || 'bg-gray-100 text-gray-800'
                  )}
                  variant="secondary"
                >
                  {activity.status}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {activity.description}
            </p>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {activity.timestamp}
              </div>

              {activity.amount && (
                <div className="text-sm font-semibold text-gray-900">
                  {activity.amount}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ActivitySkeleton = () => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-start space-x-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex items-center justify-between mt-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function MerchantActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadActivities = async (showRefreshSpinner = false) => {
    try {
      if (showRefreshSpinner) setRefreshing(true);
      else setLoading(true);

      const result = await getMerchantActivityAction(20);

      if (result.success && result.data) {
        setActivities(result.data || []);
        setError(null);
      } else {
        setError(result.error || 'Failed to load activities');
      }
    } catch (err) {
      console.error('Error loading activities:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleRefresh = () => {
    loadActivities(true);
  };

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Error Loading Activities
            </h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <ActivityIcon className="w-8 h-8 text-gray-700" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Activity Feed</h1>
            <p className="text-gray-600">
              Stay updated with your store's latest activities
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <RefreshCw
              className={cn('w-4 h-4', refreshing && 'animate-spin')}
            />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 w-full">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Orders</p>
                <p className="text-lg font-bold text-gray-900">
                  {activities.filter(a => a.type === 'order').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Products</p>
                <p className="text-lg font-bold text-gray-900">
                  {activities.filter(a => a.type === 'product').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Reviews</p>
                <p className="text-lg font-bold text-gray-900">
                  {
                    activities.filter(
                      a => a.type === 'review' || a.type === 'user'
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Alerts</p>
                <p className="text-lg font-bold text-gray-900">
                  {activities.filter(a => a.type === 'warning').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Recent Activity</span>
            <Badge variant="secondary" className="ml-2">
              {activities.length} items
            </Badge>
          </CardTitle>
          <CardDescription>
            Real-time updates from your store activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <ActivitySkeleton key={i} />
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12">
              <ActivityIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Activities Yet
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Your store activities will appear here. Start by adding products
                or processing orders to see activity updates.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
