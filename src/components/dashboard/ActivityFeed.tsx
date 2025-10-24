'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  ShoppingCart,
  UserPlus,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Star,
  Archive,
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'order' | 'user' | 'product' | 'alert' | 'success' | 'warning' | 'review' | 'inventory';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
  amount?: string;
  user?: string;
  relatedId?: string;
  createdAt?: Date;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'order':
      return <ShoppingCart className="h-4 w-4" />;
    case 'user':
      return <UserPlus className="h-4 w-4" />;
    case 'product':
      return <Package className="h-4 w-4" />;
    case 'alert':
      return <AlertTriangle className="h-4 w-4" />;
    case 'success':
      return <CheckCircle className="h-4 w-4" />;
    case 'warning':
      return <Clock className="h-4 w-4" />;
    case 'review':
      return <Star className="h-4 w-4" />;
    case 'inventory':
      return <Archive className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const getActivityColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'order':
      return 'bg-blue-100 text-blue-600';
    case 'user':
      return 'bg-green-100 text-green-600';
    case 'product':
      return 'bg-purple-100 text-purple-600';
    case 'alert':
      return 'bg-red-100 text-red-600';
    case 'success':
      return 'bg-green-100 text-green-600';
    case 'warning':
      return 'bg-yellow-100 text-yellow-600';
    case 'review':
      return 'bg-amber-100 text-amber-600';
    case 'inventory':
      return 'bg-orange-100 text-orange-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'active':
    case 'verified':
      return 'bg-green-100 text-green-800';
    case 'pending':
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  title = 'Recent Activity',
  showViewAll = true,
  onViewAll,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {title}
          </div>
          {showViewAll && onViewAll && (
            <Button variant="outline" size="sm" onClick={onViewAll}>
              View All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`flex items-start gap-4 p-4 rounded-lg transition-colors hover:bg-gray-50 ${
                index !== activities.length - 1
                  ? 'border-b border-gray-100'
                  : ''
              }`}
            >
              <div
                className={`p-2 rounded-full ${getActivityColor(activity.type)}`}
              >
                {getActivityIcon(activity.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {activity.description}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                      {activity.status && (
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      )}
                      {activity.amount && (
                        <span className="text-sm font-medium text-gray-900">
                          {activity.amount}
                        </span>
                      )}
                      {activity.user && (
                        <span className="text-sm text-gray-500">
                          by {activity.user}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-gray-500">
                      {activity.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {activities.length === 0 && (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
