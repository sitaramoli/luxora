"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
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
  XCircle,
  Calendar,
  DollarSign,
  Download,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { PageLoader } from "@/components/PageLoader";
import { useSession } from "next-auth/react";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: number;
  vendor: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  products: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}

const OrdersPage = () => {
  const { status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchOrders = async () => {
        try {
          setIsLoading(true);
          const response = await fetch("/api/orders?action=getAllOrders");
          if (!response.ok) {
            throw new Error("Failed to fetch orders");
          }
          const data = await response.json();
          setOrders(data.orders);
        } catch (error) {
          toast.error("Error", {
            description: "An error occurred while processing your request.",
          });
          console.error("Error fetching orders:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrders();
    }
  }, [status]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.vendor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const ordersByStatus = useMemo(() => {
    return {
      all: orders?.length,
      pending: orders?.filter((o) => o.status === "pending").length,
      processing: orders?.filter((o) => o.status === "processing").length,
      shipped: orders?.filter((o) => o.status === "shipped").length,
      delivered: orders?.filter((o) => o.status === "delivered").length,
      cancelled: orders?.filter((o) => o.status === "cancelled").length,
    };
  }, [orders]);

  return (
    <>
      <PageLoader isLoading={status === "loading" || isLoading} />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">
              Track and manage your luxury purchases
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            {Object.entries(ordersByStatus).map(([status, count]) => (
              <Card
                key={status}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {status === "all" ? "Total" : status}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="orders">All Orders</TabsTrigger>
              <TabsTrigger value="returns">Returns & Refunds</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="mt-6">
              {/* Filters */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4 items-center">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Orders List */}
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {order.orderNumber}
                            </h3>
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">
                                {order.status}
                              </span>
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Ordered: {order.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>
                                Total: ${order.total.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="h-4 w-4" />
                              <span>
                                {order.items} item{order.items > 1 ? "s" : ""}
                              </span>
                            </div>
                            <div>
                              <span>Vendor: {order.vendor}</span>
                            </div>
                          </div>
                          {order.trackingNumber && (
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Tracking:</span>{" "}
                              {order.trackingNumber}
                            </div>
                          )}
                          {order.estimatedDelivery && (
                            <div className="mt-1 text-sm text-gray-600">
                              <span className="font-medium">
                                Est. Delivery:
                              </span>{" "}
                              {order.estimatedDelivery}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/profile/orders/${order.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                          {order.status === "shipped" && (
                            <Button variant="outline" size="sm">
                              <Truck className="h-4 w-4 mr-2" />
                              Track Package
                            </Button>
                          )}
                          {order.status === "delivered" && (
                            <Button variant="outline" size="sm">
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Reorder
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      <div className="border-t pt-4">
                        <div className="flex items-center gap-4">
                          {order.products.slice(0, 3).map((product, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                                  {product.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Qty: {product.quantity} • $
                                  {product.price.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.products.length > 3 && (
                            <div className="text-sm text-gray-500">
                              +{order.products.length - 3} more item
                              {order.products.length - 3 > 1 ? "s" : ""}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No orders found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                  <Link href="/products">
                    <Button>Start Shopping</Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="returns" className="mt-6">
              <Card>
                <CardContent className="p-12 text-center">
                  <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No returns or refunds
                  </h3>
                  <p className="text-gray-600">
                    You haven't initiated any returns or refunds yet.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
