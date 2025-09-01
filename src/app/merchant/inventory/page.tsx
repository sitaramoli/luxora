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
} from "lucide-react";
import { inventoryData } from "@/constants/merchant-data";
import { getProductStatusColor } from "@/lib/utils";
import { useRouter } from "next/navigation";

const Page: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

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

  const handleStockUpdate = (productId: string, newStock: number) => {
    // Here you would update the stock via API
    console.log(`Updating stock for ${productId} to ${newStock}`);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on products:`, selectedProducts);
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Inventory Management
          </h1>
          <p className="text-gray-600">
            Monitor and manage your product inventory
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Stock Value
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalStockValue.toLocaleString()}
                  </p>
                </div>
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Low Stock Alerts
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {lowStockItems}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalProducts}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg Stock Level
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {avgStockLevel.toFixed(1)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-gray-400" />
              </div>
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
            {/* Filters and Actions */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-col lg:flex-row gap-4 items-center flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search products..."
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
                        <SelectItem value="in_stock">In Stock</SelectItem>
                        <SelectItem value="low_stock">Low Stock</SelectItem>
                        <SelectItem value="out_of_stock">
                          Out of Stock
                        </SelectItem>
                        <SelectItem value="overstock">Overstock</SelectItem>
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
                    <Button
                      onClick={() => router.push("/merchant/inventory/add")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
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

            {/* Inventory Table */}
            <div className="space-y-4">
              {filteredInventory.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
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
                        className="h-4 w-4"
                      />

                      <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
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
                          <div>
                            <span className="font-medium">SKU:</span> {item.sku}
                          </div>
                          <div>
                            <span className="font-medium">Category:</span>{" "}
                            {item.category}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span>{" "}
                            {item.location}
                          </div>
                          <div>
                            <span className="font-medium">Supplier:</span>{" "}
                            {item.supplier}
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">
                          Current Stock
                        </p>
                        <div className="flex items-center gap-2">
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
                          <span className="font-bold text-lg min-w-[40px]">
                            {item.currentStock}
                          </span>
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
                        <p className="text-xs text-gray-500 mt-1">
                          Min: {item.minStock} | Max: {item.maxStock}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">
                          Stock Value
                        </p>
                        <p className="font-bold text-lg">
                          ${item.stockValue.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Cost: ${item.cost}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">
                          30-Day Sales
                        </p>
                        <p className="font-bold text-lg">{item.sales30Days}</p>
                        <p className="text-xs text-green-600">
                          ${item.revenue30Days.toLocaleString()}
                        </p>
                      </div>

                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
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
