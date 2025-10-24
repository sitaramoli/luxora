'use client';

import {
  Eye,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React from 'react';

import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import {
  RevenueChart,
  OrdersChart,
  SalesDistributionChart,
  TopProductsChart,
  GrowthTrendChart,
} from '@/components/dashboard/ChartComponents';
import {
  QuickActions,
  getAdminQuickActions,
} from '@/components/dashboard/QuickActions';
import { StatCard } from '@/components/dashboard/StatCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { pendingMerchants, recentOrders } from '@/constants/admin-data';
import {
  revenueData,
  ordersData,
  salesDistributionData,
  topProductsData,
  growthTrendData,
  adminActivityData,
  miniChartData,
  realTimeMetrics,
} from '@/constants/dashboard-data';
import { getPaymentStatusColor, getStatusColor } from '@/lib/utils';

const Page: React.FC = () => {
  const router = useRouter();
  const { data } = useSession();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-merchant':
        router.push('/admin/merchants');
        break;
      case 'view-users':
        router.push('/admin/users');
        break;
      case 'view-analytics':
        router.push('/admin/analytics');
        break;
      case 'generate-report':
        // Handle report generation
        break;
      case 'notifications':
        router.push('/admin/notifications');
        break;
      case 'settings':
        router.push('/admin/settings');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, {data?.user.name}. Here's what's happening with
                Luxora today.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">System Health</p>
                <p className="text-lg font-semibold text-green-600">
                  {realTimeMetrics.systemHealth}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value="$850,000"
            change={12.5}
            changeType="positive"
            icon={<DollarSign className="h-5 w-5" />}
            chartData={miniChartData.revenue}
            chartType="area"
            color="#10B981"
            subtitle="This month"
          />
          <StatCard
            title="Total Orders"
            value="2,156"
            change={8.2}
            changeType="positive"
            icon={<ShoppingCart className="h-5 w-5" />}
            chartData={miniChartData.orders}
            color="#3B82F6"
            subtitle="Active orders"
          />
          <StatCard
            title="Active Users"
            value="1,247"
            change={15.3}
            changeType="positive"
            icon={<Users className="h-5 w-5" />}
            chartData={miniChartData.customers}
            color="#8B5CF6"
            subtitle="Online now"
            badge={{ text: 'Live', variant: 'default' }}
          />
          <StatCard
            title="Growth Rate"
            value="+28%"
            change={5.1}
            changeType="positive"
            icon={<TrendingUp className="h-5 w-5" />}
            chartData={miniChartData.growth}
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
                Revenue Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart data={revenueData} />
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
              <OrdersChart data={ordersData} />
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
              <SalesDistributionChart data={salesDistributionData} />
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TopProductsChart data={topProductsData} />
            </CardContent>
          </Card>

          {/* Growth Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Growth Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GrowthTrendChart data={growthTrendData} />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions
            actions={getAdminQuickActions(handleQuickAction)}
            title="Quick Actions"
            columns={3}
          />
        </div>

        {/* Activity Feed and Recent Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activity Feed */}
          <ActivityFeed
            activities={adminActivityData}
            title="Recent Activity"
            onViewAll={() => router.push('/admin/activity')}
          />

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Orders
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/admin/orders')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map(order => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {order.id}
                        </span>
                        <Badge className={getPaymentStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.customer} • {order.merchant}
                      </p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {order.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Merchant Applications */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Pending Merchant Applications
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/admin/merchants')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Review All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingMerchants.map(merchant => (
                <div
                  key={merchant.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {merchant.name}
                      </span>
                      <Badge className={getStatusColor(merchant.status)}>
                        {merchant.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{merchant.category}</p>
                    <p className="text-xs text-gray-500">
                      Submitted: {merchant.submittedDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        router.push(`/admin/merchants/${merchant.id}`)
                      }
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
