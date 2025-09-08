"use client";

import React, { useState } from "react";
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
import Image from "next/image";
import {
  Search,
  Edit,
  AlertTriangle,
  TrendingUp,
  Package,
  Plus,
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Tag,
  Store,
  DollarSign,
  MoreHorizontal,
} from "lucide-react";
import { inventoryData } from "@/constants/merchant-data";
import { getProductStatusColor } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/dashboard/StatCard";
import { miniChartData } from "@/constants/dashboard-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@radix-ui/react-menu";
import { Progress } from "@/components/ui/progress";

const Page: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [editedStock, setEditedStock] = useState<{ [key: string]: number }>({});

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
  const totalRevenue = inventoryData.reduce(
    (sum, item) => sum + item.revenue30Days,
    0,
  );

  const handleStockUpdate = (productId: string, newStock: number) => {
    console.log(`Updating stock for ${productId} to ${newStock}`);
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
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
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

        <div className="mt-6">
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
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="IN_STOCK">In Stock</SelectItem>
                      <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                      <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
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
            </CardContent>
          </Card>

          {/* Enhanced Inventory List */}
          <div className="space-y-4">
            {filteredInventory.map((item) => (
              <Card
                key={item.id}
                className="w-full transition-all hover:shadow-lg bg-white border border-slate-200"
              >
                <CardContent className="p-4 md:p-6 grid grid-cols-[auto_1fr] gap-6 items-start">
                  <div className="w-24 h-24 relative rounded-xl overflow-hidden bg-slate-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">
                          {item.name}
                        </h3>
                        <Badge
                          className={`mt-1.5 ${getProductStatusColor(item.status)}`}
                        >
                          {getStatusIcon(item.status)}
                          <span className="ml-1.5">
                            {item.status.split("_").join(" ")}
                          </span>
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-5 w-5 text-slate-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Item</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                      <div className="flex items-center gap-1.5">
                        <Tag className="h-4 w-4" />
                        <span>SKU: {item.sku}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Package className="h-4 w-4" />
                        <span>{item.category}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Store className="h-4 w-4" />
                        <span>{item.supplier}</span>
                      </div>
                    </div>

                    <Separator className="my-4" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-medium text-slate-600">
                            Stock Level
                          </p>
                          <span className="text-lg font-bold text-slate-900">
                            {item.currentStock}
                          </span>
                        </div>
                        <Progress
                          value={(item.currentStock / item.maxStock) * 100}
                          className="h-2"
                        />

                        <div className="flex items-center justify-between mt-1.5">
                          <p className="text-xs text-slate-500">
                            Min: {item.minStock}
                          </p>

                          {/* Editable Stock Input + Save */}
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={editedStock[item.id] ?? item.currentStock}
                              min={0}
                              max={item.maxStock}
                              className="w-20 px-2 py-1 text-sm border rounded-md focus:ring-2 focus:ring-blue-500"
                              onChange={(e) =>
                                setEditedStock({
                                  ...editedStock,
                                  [item.id]: Number(e.target.value),
                                })
                              }
                            />
                            <Button
                              size="sm"
                              variant="default"
                              disabled={
                                item.currentStock === editedStock[item.id] ||
                                !editedStock[item.id]
                              }
                              onClick={() =>
                                handleStockUpdate(
                                  item.id,
                                  editedStock[item.id] ?? item.currentStock,
                                )
                              }
                            >
                              Save
                            </Button>
                          </div>

                          <p className="text-xs text-slate-500">
                            Max: {item.maxStock}
                          </p>
                        </div>
                      </div>

                      {/* Financial Info */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Stock Value
                            </span>
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
                            <span className="text-sm text-gray-600">
                              30-Day Sales
                            </span>
                            <span className="font-semibold">
                              {item.sales30Days}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Revenue
                            </span>
                            <span className="text-sm text-green-600">
                              ${item.revenue30Days.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
