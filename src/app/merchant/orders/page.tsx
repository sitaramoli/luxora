"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Filter
} from "lucide-react";
import { getPaymentStatusColor } from "@/lib/utils";
import { orders } from "@/constants/merchant-data";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  OrdersChart,
  TopProductsChart
} from "@/components/dashboard/ChartComponents";
import {
  ordersData,
  topProductsData,
  miniChartData
} from "@/constants/dashboard-data";

const getPaymentStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING":
      return <Clock className="h-4 w-4" />;
    case "PROCESSING":
      return <Package className="h-4 w-4" />;
    case "SHIPPED":
      return <Truck className="h-4 w-4" />;
    case "DELIVERED":
      return <CheckCircle className="h-4 w-4" />;
    case "CANCELLED":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const Page: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    console.log(`Updating order ${orderId} status to ${newStatus}`);
    // Here you would call your API to update the order status
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING",
  ).length;
  const processingOrders = orders.filter(
    (order) => order.status === "PROCESSING",
  ).length;
  const completedOrders = orders.filter(
    (order) => order.status === "DELIVERED",
  ).length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

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
              <p className="text-gray-600">Track and manage your customer orders</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Orders
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={totalOrders.toString()}
            change={12.5}
            changeType="positive"
            icon={<Package className="h-5 w-5" />}
            chartData={miniChartData.orders}
            color="#3B82F6"
            subtitle="All orders"
          />
          <StatCard
            title="Pending Orders"
            value={pendingOrders.toString()}
            change={-8.2}
            changeType="negative"
            icon={<Clock className="h-5 w-5" />}
            chartData={miniChartData.customers}
            color="#F59E0B"
            subtitle="Awaiting processing"
          />
          <StatCard
            title="Completed Orders"
            value={completedOrders.toString()}
            change={18.5}
            changeType="positive"
            icon={<CheckCircle className="h-5 w-5" />}
            chartData={miniChartData.growth}
            color="#10B981"
            subtitle="Successfully delivered"
          />
          <StatCard
            title="Total Revenue"
            value={`$${(totalRevenue / 1000).toFixed(0)}K`}
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
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      More Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {order.orderNumber}
                          </h3>
                          <Badge
                            className={getPaymentStatusColor(order.status)}
                          >
                            {getPaymentStatusIcon(order.status)}
                            <span className="ml-1 capitalize">
                              {order.status}
                            </span>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <div>
                              <p className="font-medium text-gray-900">{order.customer.name}</p>
                              <p className="text-xs text-gray-500">{order.customer.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <div>
                              <p className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
                              <p className="text-xs text-gray-500">Order Date</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <div>
                              <p className="font-medium text-green-600">${order.total.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">Total Amount</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <div>
                              <p className="font-medium">{order.paymentStatus}</p>
                              <p className="text-xs text-gray-500">Payment</p>
                            </div>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-2">Order Items:</p>
                          <div className="flex flex-wrap gap-2">
                            {order.products.slice(0, 3).map((product, index) => (
                              <span key={index} className="text-xs bg-white px-2 py-1 rounded border">
                                {product.name} (x{product.quantity})
                              </span>
                            ))}
                            {order.products.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{order.products.length - 3} more items
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
                              selectedOrder === order.id ? null : order.id,
                            )
                          }
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {selectedOrder === order.id ? "Hide" : "View"} Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                        {order.status === "PENDING" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(order.id, "PROCESSING")
                            }
                          >
                            Process Order
                          </Button>
                        )}
                        {order.status === "PROCESSING" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(order.id, "SHIPPED")
                            }
                          >
                            Mark as Shipped
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
                                <span>{order.customer.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <span>{order.customer.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-500" />
                                <span>{order.customer.phone}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                <span>{order.customer.address}</span>
                              </div>
                            </div>
                          </div>

                          {/* Shipping Information */}
                          <div>
                            <h4 className="font-semibold mb-3">
                              Shipping Information
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <strong>Method:</strong> {order.shippingMethod}
                              </div>
                              <div>
                                <strong>Estimated Delivery:</strong>{" "}
                                {order.estimatedDelivery}
                              </div>
                              {order.trackingNumber && (
                                <div>
                                  <strong>Tracking:</strong>{" "}
                                  {order.trackingNumber}
                                </div>
                              )}
                              <div>
                                <strong>Payment Status:</strong>
                                <Badge className="ml-2 bg-green-100 text-green-800">
                                  {order.paymentStatus}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div>
                          <h4 className="font-semibold mb-3">Order Items</h4>
                          <div className="space-y-3">
                            {order.products.map((product, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div>
                                  <h5 className="font-medium">
                                    {product.name}
                                  </h5>
                                  <p className="text-sm text-gray-600">
                                    SKU: {product.sku} | Size: {product.size} |
                                    Color: {product.color}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">
                                    Qty: {product.quantity}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    ${product.price.toLocaleString()} each
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3">Order Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span>${order.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping:</span>
                              <span>
                                {order.shipping === 0
                                  ? "Free"
                                  : `$${order.shipping}`}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tax:</span>
                              <span>${order.tax.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-base border-t pt-2">
                              <span>Total:</span>
                              <span>${order.total.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {order.notes && (
                          <div>
                            <h4 className="font-semibold mb-2">Order Notes</h4>
                            <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                              {order.notes}
                            </p>
                          </div>
                        )}
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
                      (order) =>
                        order.status === "pending" ||
                        order.status === "processing",
                    )
                    .map((order) => (
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
                            {order.status === "pending" ? "Process" : "Ship"}
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
                    {["pending", "processing", "shipped", "delivered"].map(
                      (status) => {
                        const count = orders.filter(
                          (order) => order.status === status,
                        ).length;
                        const percentage = (count / totalOrders) * 100;
                        return (
                          <div
                            key={status}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              {getPaymentStatusIcon(status)}
                              <span className="capitalize">{status}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">
                                {count}
                              </span>
                            </div>
                          </div>
                        );
                      },
                    )}
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
                        ${totalRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Order Value</span>
                      <span className="font-semibold">
                        ${(totalRevenue / totalOrders).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed Orders</span>
                      <span className="font-semibold">
                        {orders.filter((o) => o.status === "delivered").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="font-semibold">
                        {(
                          (orders.filter((o) => o.status === "delivered")
                            .length /
                            totalOrders) *
                          100
                        ).toFixed(1)}
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
