"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  MapPin,
  DollarSign,
  Package,
  Star,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  Ban,
} from "lucide-react";
import { cn, getStatusColor } from "@/lib/utils";

interface MerchantData {
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  description: string;
  category: string;
  commission: number;
  status: string;
}

interface Props {
  params: {
    id: string;
  };
}

const Page: React.FC<Props> = ({ params }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [merchantData, setMerchantData] = useState<MerchantData>({
    name: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    description: "",
    category: "",
    commission: 0,
    status: "",
  });

  useEffect(() => {}, []);

  const handleInputChange = (field: string, value: string | number) => {
    setMerchantData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Here you would save to backend
    setIsEditing(false);
  };

  const merchantStats = [
    { label: "Total Products", value: "245", icon: Package },
    { label: "Total Sales", value: "$1,247,392", icon: DollarSign },
    { label: "Rating", value: "4.9", icon: Star },
    {
      label: "Commission",
      value: `${merchantData.commission}%`,
      icon: DollarSign,
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "Sarah Johnson",
      amount: "$2,850",
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: "ORD-002",
      customer: "Michael Chen",
      amount: "$1,200",
      date: "2024-01-14",
      status: "shipped",
    },
    {
      id: "ORD-003",
      customer: "Emma Wilson",
      amount: "$4,500",
      date: "2024-01-13",
      status: "processing",
    },
  ];

  const recentProducts = [
    {
      id: "PRD-001",
      name: "Silk Evening Gown",
      price: "$2,850",
      status: "active",
      date: "2024-01-10",
    },
    {
      id: "PRD-002",
      name: "Leather Handbag",
      price: "$4,200",
      status: "active",
      date: "2024-01-08",
    },
    {
      id: "PRD-003",
      name: "Designer Sunglasses",
      price: "$350",
      status: "pending",
      date: "2024-01-12",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go back
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {merchantData.name}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Merchant ID: {params.id}</span>
                <Badge
                  className={cn(
                    "capitalize",
                    getStatusColor(merchantData.status),
                  )}
                >
                  {merchantData.status.replace("_", " ")}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              {merchantData.status === "PENDING" && (
                <>
                  <Button
                    onClick={() => handleInputChange("status", "ACTIVE")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleInputChange("status", "SUSPENDED")}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}
              {merchantData.status === "active" && (
                <Button
                  variant="destructive"
                  onClick={() => handleInputChange("status", "SUSPENDED")}
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Suspend
                </Button>
              )}
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Merchant
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {merchantStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Merchant Information */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Merchant Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Merchant Name</Label>
                        <Input
                          id="name"
                          value={merchantData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={merchantData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={merchantData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={merchantData.website}
                          onChange={(e) =>
                            handleInputChange("website", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={merchantData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        disabled={!isEditing}
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={merchantData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={merchantData.category}
                          onValueChange={(value) =>
                            handleInputChange("category", value)
                          }
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Fashion">Fashion</SelectItem>
                            <SelectItem value="Luxury Goods">
                              Luxury Goods
                            </SelectItem>
                            <SelectItem value="Watches">Watches</SelectItem>
                            <SelectItem value="Jewelry">Jewelry</SelectItem>
                            <SelectItem value="Clothing">Clothing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="commission">Commission (%)</Label>
                        <Input
                          id="commission"
                          type="number"
                          value={merchantData.commission}
                          onChange={(e) =>
                            handleInputChange(
                              "commission",
                              parseInt(e.target.value),
                            )
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={merchantData.status}
                          onValueChange={(value) =>
                            handleInputChange("status", value)
                          }
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="under_review">
                              Under Review
                            </SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="products" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {product.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {product.id} • Added {product.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold">
                              {product.price}
                            </span>
                            <Badge className={getStatusColor(product.status)}>
                              {product.status}
                            </Badge>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {order.id}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {order.customer} • {order.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold">
                              {order.amount}
                            </span>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <Button variant="outline" size="sm">
                              View
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
                      <CardTitle>Sales Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">This Month</span>
                          <span className="font-semibold">$156,789</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Month</span>
                          <span className="font-semibold">$142,356</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Growth</span>
                          <span className="font-semibold text-green-600">
                            +10.1%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Product Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Products</span>
                          <span className="font-semibold">245</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Active Products</span>
                          <span className="font-semibold">238</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg. Rating</span>
                          <span className="font-semibold">4.9</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{merchantData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{merchantData.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <a
                    href={merchantData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {merchantData.website}
                  </a>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <span>{merchantData.address}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
