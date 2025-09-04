"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Users, 
  ShoppingCart, 
  TrendingUp,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';

interface Metric {
  id: string;
  label: string;
  value: number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
  unit?: string;
}

interface RealTimeMetricsProps {
  metrics: Metric[];
  title?: string;
  refreshInterval?: number;
}

export const RealTimeMetrics: React.FC<RealTimeMetricsProps> = ({
  metrics,
  title = "Real-time Metrics",
  refreshInterval = 30000, // 30 seconds
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // In a real app, you would fetch fresh data here
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isOnline ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              {isOnline ? (
                <Wifi className="h-3 w-3" />
              ) : (
                <WifiOff className="h-3 w-3" />
              )}
              {isOnline ? 'Live' : 'Offline'}
            </Badge>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <RefreshCw 
                className={`h-4 w-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} 
              />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Last updated: {formatTime(lastUpdated)}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${metric.color}20` }}
                >
                  {metric.icon}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {metric.changeType === 'positive' && (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    )}
                    {metric.changeType === 'negative' && (
                      <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
                    )}
                    <span 
                      className={`text-xs font-medium ${
                        metric.changeType === 'positive' 
                          ? 'text-green-600' 
                          : metric.changeType === 'negative'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value.toLocaleString()}{metric.unit}
                </p>
                <p className="text-sm text-gray-600">{metric.label}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Predefined metrics for different user types
export const getAdminRealTimeMetrics = (): Metric[] => [
  {
    id: 'online-users',
    label: 'Online Users',
    value: 1247,
    change: 5.2,
    changeType: 'positive',
    icon: <Users className="h-4 w-4" />,
    color: '#3B82F6',
  },
  {
    id: 'active-orders',
    label: 'Active Orders',
    value: 23,
    change: 12.5,
    changeType: 'positive',
    icon: <ShoppingCart className="h-4 w-4" />,
    color: '#10B981',
  },
  {
    id: 'pending-reviews',
    label: 'Pending Reviews',
    value: 8,
    change: -15.3,
    changeType: 'negative',
    icon: <Activity className="h-4 w-4" />,
    color: '#F59E0B',
  },
  {
    id: 'system-health',
    label: 'System Health',
    value: 99.9,
    change: 0.1,
    changeType: 'positive',
    icon: <Activity className="h-4 w-4" />,
    color: '#10B981',
    unit: '%',
  },
];

export const getMerchantRealTimeMetrics = (): Metric[] => [
  {
    id: 'store-visitors',
    label: 'Store Visitors',
    value: 89,
    change: 8.7,
    changeType: 'positive',
    icon: <Users className="h-4 w-4" />,
    color: '#3B82F6',
  },
  {
    id: 'cart-additions',
    label: 'Cart Additions',
    value: 15,
    change: 23.1,
    changeType: 'positive',
    icon: <ShoppingCart className="h-4 w-4" />,
    color: '#10B981',
  },
  {
    id: 'product-views',
    label: 'Product Views',
    value: 234,
    change: 5.8,
    changeType: 'positive',
    icon: <Activity className="h-4 w-4" />,
    color: '#8B5CF6',
  },
  {
    id: 'conversion-rate',
    label: 'Conversion Rate',
    value: 3.2,
    change: -2.1,
    changeType: 'negative',
    icon: <TrendingUp className="h-4 w-4" />,
    color: '#F59E0B',
    unit: '%',
  },
];
