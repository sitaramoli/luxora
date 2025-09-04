"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Store,
  TrendingUp,
  DollarSign,
  Star,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Globe,
  MoreVertical,
  Plus,
  Download,
  RefreshCw,
  Clock
} from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with actual data from getAllMerchantDetails
  const merchants = [
    {
      id: "VEN-001",
      name: "Chanel",
      email: "contact@chanel.com",
      category: "Fashion",
      status: "ACTIVE",
      createdAt: "2023-01-15",
      totalProducts: 245,
      totalSales: 1247392,
      rating: 4.9,
      verified: true,
      description: "Timeless elegance and sophisticated luxury fashion.",
      website: "https://chanel.com",
      phone: "+33 1 44 50 73 00",
      address: "135 Avenue Charles de Gaulle, 92200 Neuilly-sur-Seine, France",
      commission: 15,
      lastActive: "2024-01-15",
      avatar: "/images/chanel-logo.jpg",
      monthlyGrowth: 12.5,
      pendingOrders: 23,
      completedOrders: 156,
    },
    {
      id: "VEN-002",
      name: "Gucci",
      email: "info@gucci.com",
      category: "Fashion",
      status: "ACTIVE",
      createdAt: "2023-02-20",
      totalProducts: 189,
      totalSales: 892156,
      rating: 4.8,
      verified: true,
      description: "Italian luxury fashion house known for leather goods.",
      website: "https://gucci.com",
      phone: "+39 055 75921",
      address: "Via Tornabuoni 73/R, 50123 Florence, Italy",
      commission: 18,
      lastActive: "2024-01-14",
      avatar: "/images/gucci-logo.jpg",
      monthlyGrowth: 8.2,
      pendingOrders: 15,
      completedOrders: 134,
    },
    {
      id: "VEN-003",
      name: "Hermès",
      email: "contact@hermes.com",
      category: "Luxury Goods",
      status: "ACTIVE",
      createdAt: "2023-01-10",
      totalProducts: 156,
      totalSales: 2156789,
      rating: 4.9,
      verified: true,
      description: "French luxury goods manufacturer specializing in leather.",
      website: "https://hermes.com",
      phone: "+33 1 40 17 47 17",
      address: "24 Rue du Faubourg Saint-Honoré, 75008 Paris, France",
      commission: 12,
      lastActive: "2024-01-15",
      avatar: "/images/hermes-logo.jpg",
      monthlyGrowth: 15.3,
      pendingOrders: 8,
      completedOrders: 89,
    },
    {
      id: "VEN-004",
      name: "Luxury Timepieces Co.",
      email: "info@luxurytimepieces.com",
      category: "Watches",
      status: "PENDING",
      createdAt: "2024-01-10",
      totalProducts: 0,
      totalSales: 0,
      rating: 0,
      verified: false,
      description: "Premium watch retailer specializing in Swiss timepieces.",
      website: "https://luxurytimepieces.com",
      phone: "+1 555 123 4567",
      address: "123 Watch Street, New York, NY 10001",
      commission: 20,
      lastActive: "2024-01-10",
      avatar: "/images/timepieces-logo.jpg",
      monthlyGrowth: 0,
      pendingOrders: 0,
      completedOrders: 0,
    },
    {
      id: "VEN-005",
      name: "Elite Fashion House",
      email: "contact@elitefashion.com",
      category: "Clothing",
      status: "UNDER_REVIEW",
      createdAt: "2024-01-12",
      totalProducts: 0,
      totalSales: 0,
      rating: 0,
      verified: false,
      description: "Contemporary fashion brand with modern designs.",
      website: "https://elitefashion.com",
      phone: "+1 555 987 6543",
      address: "456 Fashion Ave, Los Angeles, CA 90210",
      commission: 25,
      lastActive: "2024-01-12",
      avatar: "/images/elite-logo.jpg",
      monthlyGrowth: 0,
      pendingOrders: 0,
      completedOrders: 0,
    },
  ];

  const filteredMerchants = merchants.filter((merchant) => {
    const matchesSearch =
      merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || merchant.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || merchant.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalMerchants = merchants.length;
  const activeMerchants = merchants.filter((m) => m.status === "ACTIVE").length;
  const pendingMerchants = merchants.filter((m) => m.status === "PENDING").length;
  const totalRevenue = merchants.reduce((sum, m) => sum + m.totalSales, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "UNDER_REVIEW":
        return "bg-blue-100 text-blue-800";
      case "SUSPENDED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
                Merchant Management
              </h1>
              <p className="text-gray-600">
                Manage and monitor all merchants on the platform
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Merchant
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Merchants"
            value={totalMerchants.toString()}
            change={8.2}
            changeType="positive"
            icon={<Store className="h-5 w-5" />}
            chartData={miniChartData.customers}
            color="#3B82F6"
            subtitle="Active stores"
          />
          <StatCard
            title="Active Merchants"
            value={activeMerchants.toString()}
            change={12.5}
            changeType="positive"
            icon={<CheckCircle className="h-5 w-5" />}
            chartData={miniChartData.orders}
            color="#10B981"
            subtitle="Verified stores"
          />
          <StatCard
            title="Pending Applications"
            value={pendingMerchants.toString()}
            change={-5.1}
            changeType="negative"
            icon={<Clock className="h-5 w-5" />}
            chartData={miniChartData.growth}
            color="#F59E0B"
            subtitle="Awaiting review"
          />
          <StatCard
            title="Total Revenue"
            value={`$${(totalRevenue / 1000000).toFixed(1)}M`}
            change={18.5}
            changeType="positive"
            icon={<DollarSign className="h-5 w-5" />}
            chartData={miniChartData.revenue}
            chartType="area"
            color="#8B5CF6"
            subtitle="From all merchants"
          />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Merchant Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SalesDistributionChart data={salesDistributionData} />
            </CardContent>
          </Card>

          {/* Top Merchants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Top Performing Merchants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TopProductsChart data={topProductsData} />
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search merchants..."
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
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Luxury Goods">Luxury Goods</SelectItem>
                  <SelectItem value="Watches">Watches</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Merchants List */}
        <div className="space-y-4">
          {filteredMerchants.map((merchant) => (
            <Card key={merchant.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={merchant.avatar} alt={merchant.name} />
                      <AvatarFallback className="text-lg">
                        {merchant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {merchant.name}
                        </h3>
                        <Badge className={getStatusColor(merchant.status)}>
                          {merchant.status.replace("_", " ")}
                        </Badge>
                        {merchant.verified && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{merchant.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{merchant.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{merchant.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{merchant.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Globe className="h-4 w-4" />
                          <span>{merchant.website}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-500">Joined: {merchant.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-gray-500">{merchant.rating}/5</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-500">${(merchant.totalSales / 1000).toFixed(0)}K sales</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-4">
                    <div className="text-right">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold text-gray-900">{merchant.totalProducts}</p>
                          <p className="text-xs text-gray-500">Products</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-900">{merchant.pendingOrders}</p>
                          <p className="text-xs text-gray-500">Pending</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-900">{merchant.completedOrders}</p>
                          <p className="text-xs text-gray-500">Completed</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      {merchant.status === "PENDING" && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button variant="destructive" size="sm">
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredMerchants.length === 0 && (
          <div className="text-center py-12">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No merchants found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
