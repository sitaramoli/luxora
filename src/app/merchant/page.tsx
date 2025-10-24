'use client';

import {
  TrendingUp,
  Star,
  Eye,
  Edit,
  DollarSign,
  ShoppingCart,
  Package,
  Activity,
  BarChart3,
  PieChart,
  Target,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';

import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import {
  RevenueChart,
  OrdersChart,
  SalesDistributionChart,
  CustomerSatisfactionChart,
  PerformanceMetricsChart,
} from '@/components/dashboard/ChartComponents';
import {
  QuickActions,
  getMerchantQuickActions,
} from '@/components/dashboard/QuickActions';
import { StatCard } from '@/components/dashboard/StatCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  customerSatisfactionData,
  performanceMetricsData,
} from '@/constants/dashboard-data';
import { getDashboardDataAction } from '@/lib/actions/merchant-dashboard';
import type {
  DashboardStats,
  RecentOrder,
  TopProduct,
  ChartData,
  ActivityItem,
} from '@/lib/services/merchant-dashboard';
import { getOrderStatusColor } from '@/lib/utils';

interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  chartData: ChartData;
  activityFeed: ActivityItem[];
  merchantInfo: {
    name: string;
    email: string;
    category: string;
    status: string;
  } | null;
}

const Page: React.FC = () => {
  const router = useRouter();
  const { data } = useSession();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getDashboardDataAction();

      if (result.success && result.data) {
        setDashboardData(result.data);
      } else {
        setError(result.error || 'Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-product':
        router.push('/merchant/inventory/add');
        break;
      case 'view-orders':
        router.push('/merchant/orders');
        break;
      case 'view-analytics':
        router.push('/merchant/analytics');
        break;
      case 'export-data':
        // Handle data export
        break;
      case 'import-products':
        router.push('/merchant/inventory/import');
        break;
      case 'preview-store':
        // Handle store preview
        break;
      default:
        break;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 w-full flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 w-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
          <p className="text-gray-600 mb-4">
            {error || 'Failed to load dashboard data'}
          </p>
          <Button onClick={loadDashboardData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  // Generate mini chart data for stat cards
  const generateMiniChartData = (length: number = 7) => {
    return Array.from({ length }, (_, i) => ({
      value: Math.floor(Math.random() * 100) + 20,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {dashboardData.merchantInfo?.name || 'Merchant Dashboard'}
              </h1>
              <p className="text-gray-600">
                Welcome back, {data?.user?.name}. Here's your store overview.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={loadDashboardData}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
              <div className="text-right">
                <p className="text-sm text-gray-500">Store Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <p className="text-lg font-semibold text-gray-900">
                    {dashboardData.stats.rating.average || '0.0'}
                  </p>
                  <span className="text-xs text-gray-500">
                    ({dashboardData.stats.rating.totalReviews})
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Store Revenue"
            value={formatCurrency(dashboardData.stats.revenue.thisMonth)}
            change={dashboardData.stats.revenue.percentageChange}
            changeType={
              dashboardData.stats.revenue.percentageChange >= 0
                ? 'positive'
                : 'negative'
            }
            icon={<DollarSign className="h-5 w-5" />}
            chartData={generateMiniChartData()}
            chartType="area"
            color="#10B981"
            subtitle="This month"
          />
          <StatCard
            title="Total Orders"
            value={dashboardData.stats.orders.total.toString()}
            change={dashboardData.stats.orders.percentageChange}
            changeType={
              dashboardData.stats.orders.percentageChange >= 0
                ? 'positive'
                : 'negative'
            }
            icon={<ShoppingCart className="h-5 w-5" />}
            chartData={generateMiniChartData()}
            color="#3B82F6"
            subtitle="All time"
          />
          <StatCard
            title="Products"
            value={dashboardData.stats.products.total.toString()}
            change={5.2}
            changeType="positive"
            icon={<Package className="h-5 w-5" />}
            chartData={generateMiniChartData()}
            color="#8B5CF6"
            subtitle="In inventory"
            badge={
              dashboardData.stats.products.outOfStock > 0
                ? {
                    text: `${dashboardData.stats.products.outOfStock} out of stock`,
                    variant: 'destructive',
                  }
                : undefined
            }
          />
          <StatCard
            title="Conversion Rate"
            value={`${dashboardData.stats.conversion.rate}%`}
            change={-2.1}
            changeType="negative"
            icon={<TrendingUp className="h-5 w-5" />}
            chartData={generateMiniChartData()}
            color="#F59E0B"
            subtitle="vs last month"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Store Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart
                data={dashboardData.chartData.revenueChart.map(item => ({
                  month: formatDate(new Date(item.date)).split(' ')[0],
                  revenue: item.revenue,
                  orders: item.orders,
                  customers: Math.floor(item.orders * 0.8), // Estimated customers
                }))}
              />
            </CardContent>
          </Card>

          {/* Orders Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Orders Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrdersChart
                data={dashboardData.chartData.ordersChart.map(item => ({
                  day: formatDate(new Date(item.date)).split(' ')[0],
                  orders: item.orders,
                  completed: item.completed,
                  pending: item.pending,
                }))}
              />
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Sales Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Sales Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SalesDistributionChart
                data={dashboardData.chartData.salesDistribution}
              />
            </CardContent>
          </Card>

          {/* Customer Satisfaction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Customer Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerSatisfactionChart data={customerSatisfactionData} />
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PerformanceMetricsChart data={performanceMetricsData} />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions
            actions={getMerchantQuickActions(handleQuickAction)}
            title="Quick Actions"
            columns={3}
          />
        </div>

        {/* Activity Feed and Recent Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activity Feed */}
          <ActivityFeed
            activities={dashboardData.activityFeed}
            title="Store Activity"
            onViewAll={() => router.push('/merchant/activity')}
          />

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Orders
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/merchant/orders')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentOrders.length > 0 ? (
                  dashboardData.recentOrders.map(order => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            #{order.id.slice(-8)}
                          </span>
                          <Badge className={getOrderStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {order.customer.name} • {order.itemsCount} items
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="h-8 w-8 mx-auto mb-2" />
                    <p>No recent orders</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Top Performing Products
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/merchant/inventory')}
              >
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.topProducts.length > 0 ? (
                dashboardData.topProducts.map(product => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{product.totalSales} sales</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                          <span>{product.rating}</span>
                          <span className="text-xs text-gray-500">
                            ({product.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(product.revenue)}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-1"
                        onClick={() =>
                          router.push(`/merchant/inventory/edit/${product.id}`)
                        }
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-8 w-8 mx-auto mb-2" />
                  <p>No products found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
