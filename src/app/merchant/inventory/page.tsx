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
import Image from "next/image";
import {
  Search,
  Edit,
  AlertTriangle,
  TrendingUp,
  Package,
  Plus,
  Minus,
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  Eye,
  MoreVertical,
  Calendar,
  Tag,
  Store,
  Clock,
  DollarSign,
  ShoppingCart,
  Star
} from "lucide-react";
import { inventoryData } from "@/constants/merchant-data";
import { getProductStatusColor } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  SalesDistributionChart,
  TopProductsChart
} from "@/components/dashboard/ChartComponents";
import {
  salesDistributionData,
  topProductsData,
  miniChartData
} from "@/constants/dashboard-data";

const Page: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "LOW_STOCK":
      case "OUT_OF_STOCK":
        return <AlertTriangle className="h-4 w-4" />;
      case "OVER_STOCK":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredInventory = inventoryData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" ||
      item.category.toLowerCase() === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalStockValue = inventoryData.reduce(
    (sum, item) => sum + item.stockValue,
    0,
  );
  const lowStockItems = inventoryData.filter(
    (item) => item.status === "LOW_STOCK" || item.status === "OUT_OF_STOCK",
  ).length;
  const totalProducts = inventoryData.length;
  const avgStockLevel =
    inventoryData.reduce((sum, item) => sum + item.currentStock, 0) /
    totalProducts;
  const totalRevenue = inventoryData.reduce((sum, item) => sum + item.revenue30Days, 0);

  const handleStockUpdate = (productId: string, newStock: number) => {
    // Here you would update the stock via API
    console.log(`Updating stock for ${productId} to ${newStock}`);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on products:`, selectedProducts);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Inventory Management
              </h1>
              <p className="text-gray-600">
                Monitor and manage your product inventory
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={() => router.push("/merchant/inventory/add")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Stock Value"
            value={`$${(totalStockValue / 1000).toFixed(0)}K`}
            change={8.2}
            changeType="positive"
            icon={<Package className="h-5 w-5" />}
            chartData={miniChartData.revenue}
            chartType="area"
            color="#3B82F6"
            subtitle="Current inventory value"
          />
          <StatCard
            title="Low Stock Alerts"
            value={lowStockItems.toString()}
            change={-12.5}
            changeType="negative"
            icon={<AlertTriangle className="h-5 w-5" />}
            chartData={miniChartData.orders}
            color="#EF4444"
            subtitle="Items need restocking"
          />
          <StatCard
            title="Total Products"
            value={totalProducts.toString()}
            change={15.3}
            changeType="positive"
            icon={<BarChart3 className="h-5 w-5" />}
            chartData={miniChartData.customers}
            color="#10B981"
            subtitle="Active products"
          />
          <StatCard
            title="30-Day Revenue"
            value={`$${(totalRevenue / 1000).toFixed(0)}K`}
            change={22.1}
            changeType="positive"
            icon={<DollarSign className="h-5 w-5" />}
            chartData={miniChartData.growth}
            color="#8B5CF6"
            subtitle="From inventory sales"
          />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Inventory Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Inventory Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SalesDistributionChart data={salesDistributionData} />
            </CardContent>
          </Card>

          {/* Top Performing Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Top Performing Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TopProductsChart data={topProductsData} />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inventory">Inventory List</TabsTrigger>
            <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="mt-6">
            {/* Enhanced Filters and Actions */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-col lg:flex-row gap-4 items-center flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search products by name or SKU..."
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
                        <SelectItem value="IN_STOCK">In Stock</SelectItem>
                        <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                        <SelectItem value="OUT_OF_STOCK">
                          Out of Stock
                        </SelectItem>
                        <SelectItem value="OVER_STOCK">Overstock</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="dresses">Dresses</SelectItem>
                        <SelectItem value="bags">Bags</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="outerwear">Outerwear</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                {selectedProducts.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-800">
                        {selectedProducts.length} product(s) selected
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBulkAction("update_stock")}
                        >
                          Update Stock
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBulkAction("export")}
                        >
                          Export Selected
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Inventory List */}
            <div className="space-y-4">
              {filteredInventory.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts([...selectedProducts, item.id]);
                          } else {
                            setSelectedProducts(
                              selectedProducts.filter((id) => id !== item.id),
                            );
                          }
                        }}
                        className="h-4 w-4 mt-2"
                      />

                      <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {item.name}
                              </h3>
                              <Badge className={getProductStatusColor(item.status)}>
                                {getStatusIcon(item.status)}
                                <span className="ml-1">
                                  {item.status.split("_").join(" ")}
                                </span>
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Tag className="h-4 w-4" />
                                <span>SKU: {item.sku}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Store className="h-4 w-4" />
                                <span>{item.category}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{item.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Package className="h-4 w-4" />
                                <span>{item.supplier}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Stock Management */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-gray-600">
                                Stock Level
                              </p>
                              <span className="text-lg font-bold text-gray-900">
                                {item.currentStock}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleStockUpdate(item.id, item.currentStock - 1)
                                }
                                disabled={item.currentStock <= 0}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleStockUpdate(item.id, item.currentStock + 1)
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500">
                              Min: {item.minStock} | Max: {item.maxStock}
                            </p>
                          </div>

                          {/* Financial Info */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Stock Value</span>
                                <span className="font-semibold">
                                  ${item.stockValue.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Cost</span>
                                <span className="text-sm">${item.cost}</span>
                              </div>
                            </div>
                          </div>

                          {/* Sales Performance */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">30-Day Sales</span>
                                <span className="font-semibold">{item.sales30Days}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Revenue</span>
                                <span className="text-sm text-green-600">
                                  ${item.revenue30Days.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Stock Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryData
                    .filter(
                      (item) =>
                        item.status === "LOW_STOCK" ||
                        item.status === "OUT_OF_STOCK",
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200"
                      >
                        <div className="flex items-center gap-4">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Current stock: {item.currentStock} | Minimum:{" "}
                              {item.minStock}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Reorder
                          </Button>
                          <Button size="sm">Update Stock</Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Turnover</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Average Turnover Rate
                      </span>
                      <span className="font-semibold">2.4x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Days in Inventory</span>
                      <span className="font-semibold">152 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fast Moving Items</span>
                      <span className="font-semibold">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Slow Moving Items</span>
                      <span className="font-semibold">3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stock Valuation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Stock Value</span>
                      <span className="font-semibold">
                        ${totalStockValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dead Stock Value</span>
                      <span className="font-semibold text-red-600">$5,250</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Overstock Value</span>
                      <span className="font-semibold text-blue-600">
                        $28,350
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Healthy Stock Value</span>
                      <span className="font-semibold text-green-600">
                        $47,850
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
