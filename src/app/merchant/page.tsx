"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  Star, 
  Eye, 
  Edit, 
  DollarSign,
  ShoppingCart,
  Package,
  Activity,
  BarChart3,
  PieChart,
  Target
} from "lucide-react";
import { useSession } from "next-auth/react";
import { recentOrders, stats, topProducts } from "@/constants/merchant-data";
import { getOrderStatusColor } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions, getMerchantQuickActions } from "@/components/dashboard/QuickActions";
import { 
  RevenueChart, 
  OrdersChart, 
  SalesDistributionChart, 
  TopProductsChart,
  CustomerSatisfactionChart,
  PerformanceMetricsChart
} from "@/components/dashboard/ChartComponents";
import {
  revenueData,
  ordersData,
  salesDistributionData,
  topProductsData,
  customerSatisfactionData,
  performanceMetricsData,
  merchantActivityData,
  miniChartData
} from "@/constants/dashboard-data";

const Page: React.FC = () => {
  const router = useRouter();
  const { data } = useSession();

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

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Merchant Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, {data?.user?.name}. Here's your store overview.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Store Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <p className="text-lg font-semibold text-gray-900">4.9</p>
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
            value="$125,000"
            change={18.5}
            changeType="positive"
            icon={<DollarSign className="h-5 w-5" />}
            chartData={miniChartData.revenue}
            chartType="area"
            color="#10B981"
            subtitle="This month"
          />
          <StatCard
            title="Total Orders"
            value="342"
            change={12.3}
            changeType="positive"
            icon={<ShoppingCart className="h-5 w-5" />}
            chartData={miniChartData.orders}
            color="#3B82F6"
            subtitle="Active orders"
          />
          <StatCard
            title="Products"
            value="156"
            change={5.2}
            changeType="positive"
            icon={<Package className="h-5 w-5" />}
            chartData={miniChartData.customers}
            color="#8B5CF6"
            subtitle="In inventory"
          />
          <StatCard
            title="Conversion Rate"
            value="3.2%"
            change={-2.1}
            changeType="negative"
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
                Store Revenue
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
            activities={merchantActivityData}
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
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {order.id}
                        </span>
                        <Badge className={getOrderStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.customer} • {order.product}
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
              {topProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{product.sales} sales</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {product.revenue}
                    </p>
                    <Button variant="outline" size="sm" className="mt-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
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
