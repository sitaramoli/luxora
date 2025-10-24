'use client';

import {
  Search,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  RefreshCw,
  TrendingUp,
  MoreVertical,
  User,
  CreditCard,
  Filter,
  X,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

import {
  OrdersChart,
  TopProductsChart,
} from '@/components/dashboard/ChartComponents';
import { StatCard } from '@/components/dashboard/StatCard';
import { PageLoader } from '@/components/PageLoader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ordersData,
  topProductsData,
  miniChartData,
} from '@/constants/dashboard-data';
import {
  getMerchantOrdersAction,
  getMerchantOrderStatsAction,
  updateOrderStatusAction,
  exportOrdersAction,
} from '@/lib/actions/merchant-orders';
import { getPaymentStatusColor } from '@/lib/utils';

const getPaymentStatusIcon = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return <Clock className="h-4 w-4" />;
    case 'PROCESSING':
      return <Package className="h-4 w-4" />;
    case 'SHIPPED':
      return <Truck className="h-4 w-4" />;
    case 'DELIVERED':
      return <CheckCircle className="h-4 w-4" />;
    case 'CANCELLED':
    case 'REFUNDED':
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const Page: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const filters: any = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (searchQuery) filters.search = searchQuery;

      const result = await getMerchantOrdersAction(filters);
      if (result.success) {
        setOrders(result.data || []);
      } else {
        toast.error(result.error || 'Failed to load orders');
      }
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const result = await getMerchantOrderStatsAction();
      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  useEffect(() => {
    loadOrders();
    loadStats();
  }, [statusFilter, searchQuery]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const result = await updateOrderStatusAction(orderId, newStatus);
      if (result.success) {
        toast.success(result.message || 'Order status updated successfully');
        // Refresh orders and stats
        loadOrders();
        loadStats();
      } else {
        toast.error(result.error || 'Failed to update order status');
      }
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleRefresh = () => {
    loadOrders();
    loadStats();
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const filters: any = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (dateFilter.startDate) filters.startDate = dateFilter.startDate;
      if (dateFilter.endDate) filters.endDate = dateFilter.endDate;

      const result = await exportOrdersAction(filters);
      if (result.success && result.data) {
        // Create and download CSV file
        const blob = new Blob([result.data.csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = result.data.filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Orders exported successfully');
      } else {
        toast.error(result.error || 'Failed to export orders');
      }
    } catch (error) {
      toast.error('Failed to export orders');
      console.error('Error exporting orders:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPaymentStatusFilter('all');
    setDateFilter({ startDate: '', endDate: '' });
    setShowAdvancedFilters(false);
  };

  if (isLoading && orders.length === 0) {
    return <PageLoader isLoading={true} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order Management
              </h1>
              <p className="text-gray-600">
                Track and manage your customer orders
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
              <Button onClick={handleExport} disabled={isExporting}>
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export Orders'}
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders.toString()}
            change={12.5}
            changeType="positive"
            icon={<Package className="h-5 w-5" />}
            chartData={miniChartData.orders}
            color="#3B82F6"
            subtitle="All orders"
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders.toString()}
            change={-8.2}
            changeType="negative"
            icon={<Clock className="h-5 w-5" />}
            chartData={miniChartData.customers}
            color="#F59E0B"
            subtitle="Awaiting processing"
          />
          <StatCard
            title="Completed Orders"
            value={stats.deliveredOrders.toString()}
            change={18.5}
            changeType="positive"
            icon={<CheckCircle className="h-5 w-5" />}
            chartData={miniChartData.growth}
            color="#10B981"
            subtitle="Successfully delivered"
          />
          <StatCard
            title="Total Revenue"
            value={`$${(stats.totalRevenue / 1000).toFixed(0)}K`}
            change={22.1}
            changeType="positive"
            icon={<DollarSign className="h-5 w-5" />}
            chartData={miniChartData.revenue}
            chartType="area"
            color="#8B5CF6"
            subtitle="From all orders"
          />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Orders Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Orders Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrdersChart data={ordersData} />
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Top Ordered Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TopProductsChart data={topProductsData} />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending Actions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            {/* Enhanced Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-col lg:flex-row gap-4 items-center flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search orders by number or customer..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PROCESSING">Processing</SelectItem>
                        <SelectItem value="SHIPPED">Shipped</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setShowAdvancedFilters(!showAdvancedFilters)
                      }
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      {showAdvancedFilters ? 'Less Filters' : 'More Filters'}
                    </Button>
                    {(searchQuery ||
                      statusFilter !== 'all' ||
                      paymentStatusFilter !== 'all' ||
                      dateFilter.startDate ||
                      dateFilter.endDate) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Start Date
                      </label>
                      <Input
                        type="date"
                        value={dateFilter.startDate}
                        onChange={e =>
                          setDateFilter(prev => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        End Date
                      </label>
                      <Input
                        type="date"
                        value={dateFilter.endDate}
                        onChange={e =>
                          setDateFilter(prev => ({
                            ...prev,
                            endDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Payment Status
                      </label>
                      <Select
                        value={paymentStatusFilter}
                        onValueChange={setPaymentStatusFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Payment Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            All Payment Status
                          </SelectItem>
                          <SelectItem value="PAID">Paid</SelectItem>
                          <SelectItem value="PENDING">
                            Pending Payment
                          </SelectItem>
                          <SelectItem value="FAILED">Failed</SelectItem>
                          <SelectItem value="REFUNDED">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Orders List */}
            <div className="space-y-4">
              {isLoading && (
                <div className="flex justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              )}
              {orders.map(order => (
                <Card
                  key={order.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {order.id}
                          </h3>
                          <Badge
                            className={getPaymentStatusColor(order.status)}
                          >
                            {getPaymentStatusIcon(order.status)}
                            <span className="ml-1 capitalize">
                              {order.status?.toLowerCase()}
                            </span>
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {order.customer?.fullName || 'N/A'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {order.customer?.email || 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <div>
                              <p className="font-medium">
                                {order.createdAt
                                  ? new Date(
                                      order.createdAt
                                    ).toLocaleDateString()
                                  : 'N/A'}
                              </p>
                              <p className="text-xs text-gray-500">
                                Order Date
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <div>
                              <p className="font-medium text-green-600">
                                ${parseFloat(order.total).toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                Total Amount
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <div>
                              <p className="font-medium">
                                {order.paymentMethod || 'N/A'}
                              </p>
                              <p className="text-xs text-gray-500">Payment</p>
                            </div>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Order Items:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {order.orderItems &&
                            Array.isArray(order.orderItems) ? (
                              order.orderItems
                                .slice(0, 3)
                                .map((item: any, index: number) => (
                                  <span
                                    key={index}
                                    className="text-xs bg-white px-2 py-1 rounded border"
                                  >
                                    {item.product?.name || 'Unknown Product'} (x
                                    {item.quantity})
                                  </span>
                                ))
                            ) : (
                              <span className="text-xs text-gray-500">
                                No items found
                              </span>
                            )}
                            {order.orderItems &&
                              order.orderItems.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{order.orderItems.length - 3} more items
                                </span>
                              )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedOrder(
                              selectedOrder === order.id ? null : order.id
                            )
                          }
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {selectedOrder === order.id ? 'Hide' : 'View'} Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                        {order.status?.toUpperCase() === 'PENDING' && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(order.id, 'PROCESSING')
                            }
                            disabled={isUpdatingStatus}
                          >
                            {isUpdatingStatus
                              ? 'Processing...'
                              : 'Process Order'}
                          </Button>
                        )}
                        {order.status?.toUpperCase() === 'PROCESSING' && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(order.id, 'SHIPPED')
                            }
                            disabled={isUpdatingStatus}
                          >
                            {isUpdatingStatus
                              ? 'Updating...'
                              : 'Mark as Shipped'}
                          </Button>
                        )}
                        {order.status?.toUpperCase() === 'SHIPPED' && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(order.id, 'DELIVERED')
                            }
                            disabled={isUpdatingStatus}
                          >
                            {isUpdatingStatus
                              ? 'Updating...'
                              : 'Mark as Delivered'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {selectedOrder === order.id && (
                      <div className="border-t pt-6 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Customer Information */}
                          <div>
                            <h4 className="font-semibold mb-3">
                              Customer Information
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Name:</span>
                                <span>{order.customer?.fullName || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <span>{order.customer?.email || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-500" />
                                <span>{order.customer?.phone || 'N/A'}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                <span>{order.shippingAddress || 'N/A'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Order Information */}
                          <div>
                            <h4 className="font-semibold mb-3">
                              Order Information
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <strong>Payment Method:</strong>{' '}
                                {order.paymentMethod || 'N/A'}
                              </div>
                              <div>
                                <strong>Payment ID:</strong>{' '}
                                {order.paymentId || 'N/A'}
                              </div>
                              <div>
                                <strong>Order Date:</strong>{' '}
                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleString()
                                  : 'N/A'}
                              </div>
                              <div>
                                <strong>Status:</strong>
                                <Badge
                                  className={`ml-2 ${getPaymentStatusColor(order.status)}`}
                                >
                                  {order.status?.toLowerCase() || 'N/A'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div>
                          <h4 className="font-semibold mb-3">Order Items</h4>
                          <div className="space-y-3">
                            {order.orderItems &&
                            Array.isArray(order.orderItems) ? (
                              order.orderItems.map(
                                (item: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                  >
                                    <div>
                                      <h5 className="font-medium">
                                        {item.product?.name ||
                                          'Unknown Product'}
                                      </h5>
                                      <p className="text-sm text-gray-600">
                                        SKU: {item.product?.sku || 'N/A'} |
                                        Size: {item.size || 'N/A'} | Color:{' '}
                                        {item.color || 'N/A'}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">
                                        Qty: {item.quantity}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        ${parseFloat(item.price).toFixed(2)}{' '}
                                        each
                                      </p>
                                      <p className="font-medium text-green-600">
                                        ${parseFloat(item.total).toFixed(2)}{' '}
                                        total
                                      </p>
                                    </div>
                                  </div>
                                )
                              )
                            ) : (
                              <div className="p-3 bg-gray-50 rounded-lg text-center text-gray-500">
                                No items found for this order
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3">Order Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between font-semibold text-base border-t pt-2">
                              <span>Total:</span>
                              <span>${parseFloat(order.total).toFixed(2)}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                              Order ID: {order.id}
                            </div>
                            {order.paymentId && (
                              <div className="text-xs text-gray-500">
                                Payment ID: {order.paymentId}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Orders Requiring Action</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders
                    .filter(
                      order =>
                        order.status === 'pending' ||
                        order.status === 'processing'
                    )
                    .map(order => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {order.orderNumber}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {order.customer.name} • $
                            {order.total.toLocaleString()} • {order.status}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm">
                            {order.status === 'pending' ? 'Process' : 'Ship'}
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        key: 'pending',
                        label: 'Pending',
                        count: stats.pendingOrders,
                      },
                      {
                        key: 'processing',
                        label: 'Processing',
                        count: stats.processingOrders,
                      },
                      {
                        key: 'shipped',
                        label: 'Shipped',
                        count: stats.shippedOrders,
                      },
                      {
                        key: 'delivered',
                        label: 'Delivered',
                        count: stats.deliveredOrders,
                      },
                      {
                        key: 'cancelled',
                        label: 'Cancelled',
                        count: stats.cancelledOrders,
                      },
                    ].map(({ key, label, count }) => {
                      const percentage =
                        stats.totalOrders > 0
                          ? (count / stats.totalOrders) * 100
                          : 0;
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {getPaymentStatusIcon(key)}
                            <span className="capitalize">{label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Revenue</span>
                      <span className="font-semibold">
                        ${stats.totalRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Order Value</span>
                      <span className="font-semibold">
                        $
                        {stats.totalOrders > 0
                          ? (stats.totalRevenue / stats.totalOrders).toFixed(2)
                          : '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed Orders</span>
                      <span className="font-semibold">
                        {stats.deliveredOrders}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="font-semibold">
                        {stats.totalOrders > 0
                          ? (
                              (stats.deliveredOrders / stats.totalOrders) *
                              100
                            ).toFixed(1)
                          : '0.0'}
                        %
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
