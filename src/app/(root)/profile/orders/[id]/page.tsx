"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  Download,
  RefreshCw,
  Star,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { platformInfo } from "@/constants";
import { useSession } from "next-auth/react";

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ params }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // TODO: Fetch order data from API
  const getOrderData = (id: string) => {
    const orders = {
      "ORD-001": {
        id: "ORD-001",
        orderNumber: "LX-2024-001",
        date: "2024-01-15T10:30:00Z",
        status: "delivered",
        deliveredDate: "2024-01-18T14:20:00Z",
        total: 3078,
        subtotal: 2850,
        shipping: 0,
        tax: 228,
        merchant: "Versace",
        trackingNumber: "TRK123456789",
        estimatedDelivery: "2024-01-18",
        shippingMethod: "Express Delivery",
        customer: {
          name: "Customer Name",
          email: "email@expample.com",
          phone: "+1 (555) 123-4567",
        },
        shippingAddress: {
          name: "Customer Name",
          street: "123 Fifth Avenue, Apt 4B",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States",
        },
        billingAddress: {
          name: "Customer Name",
          street: "123 Fifth Avenue, Apt 4B",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States",
        },
        paymentMethod: {
          type: "card",
          last4: "4242",
          brand: "Visa",
        },
        products: [
          {
            id: "PRD-001",
            name: "Silk Evening Gown",
            brand: "Versace",
            size: "M",
            color: "Black",
            quantity: 1,
            price: 2850,
            image:
              "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=300",
          },
        ],
        timeline: [
          {
            status: "Order Placed",
            date: "2024-01-15T10:30:00Z",
            completed: true,
          },
          {
            status: "Payment Confirmed",
            date: "2024-01-15T10:35:00Z",
            completed: true,
          },
          {
            status: "Processing",
            date: "2024-01-15T14:00:00Z",
            completed: true,
          },
          { status: "Shipped", date: "2024-01-16T09:15:00Z", completed: true },
          {
            status: "Out for Delivery",
            date: "2024-01-18T08:30:00Z",
            completed: true,
          },
          {
            status: "Delivered",
            date: "2024-01-18T14:20:00Z",
            completed: true,
          },
        ],
      },
    };
    return orders[id as keyof typeof orders] || orders["ORD-001"];
  };

  const order = getOrderData(params.id);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
      case "out for delivery":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "order placed":
      case "payment confirmed":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "shipped":
      case "out for delivery":
        return <Truck className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "order placed":
      case "payment confirmed":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order {order.orderNumber}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Placed on {formatDate(order.date)}
                </span>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 capitalize">{order.status}</span>
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
              {order.status === "delivered" && (
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reorder
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div
                        className={`p-2 rounded-full ${event.completed ? "bg-green-100" : "bg-gray-100"}`}
                      >
                        {event.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`font-medium ${event.completed ? "text-gray-900" : "text-gray-500"}`}
                        >
                          {event.status}
                        </h4>
                        {event.date && (
                          <p className="text-sm text-gray-500">
                            {formatDate(event.date)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {order.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-20 h-20 relative rounded-md overflow-hidden bg-white">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {product.brand}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Size: {product.size}</span>
                          <span>Color: {product.color}</span>
                          <span>Qty: {product.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${product.price.toLocaleString()}
                        </p>
                        {order.status === "delivered" && (
                          <div className="flex gap-1 mt-2">
                            <Button size="sm" variant="outline">
                              <Star className="h-3 w-3 mr-1" />
                              Review
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping & Billing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{order.billingAddress.name}</p>
                    <p>{order.billingAddress.street}</p>
                    <p>
                      {order.billingAddress.city}, {order.billingAddress.state}{" "}
                      {order.billingAddress.zipCode}
                    </p>
                    <p>{order.billingAddress.country}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ${order.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {order.shipping === 0
                      ? "Free"
                      : `$${order.shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    ${order.tax.toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${order.total.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Shipping Method
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shippingMethod}
                  </p>
                </div>
                {order.trackingNumber && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Tracking Number
                    </p>
                    <p className="text-sm text-gray-600 font-mono">
                      {order.trackingNumber}
                    </p>
                    <Button variant="outline" size="sm" className="mt-2 w-full">
                      <Truck className="h-4 w-4 mr-2" />
                      Track Package
                    </Button>
                  </div>
                )}
                {order.estimatedDelivery && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Estimated Delivery
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.estimatedDelivery}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.paymentMethod.brand} ••••{" "}
                      {order.paymentMethod.last4}
                    </p>
                    <p className="text-sm text-gray-600">Payment completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Return Items
                </Button>
                <div className="text-xs text-gray-500 mt-4">
                  <p>Order questions? Contact us at:</p>
                  <p className="flex items-center gap-1 mt-1">
                    <Mail className="h-3 w-3" />
                    <Link href={`mailto:${platformInfo.contact.email}`}>
                      {platformInfo.contact.email}
                    </Link>
                  </p>
                  <p className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {platformInfo.contact.phone}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
