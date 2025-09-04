"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Ban,
  Users,
  Calendar,
  Mail,
  Shield,
  UserPlus,
  Download,
  RefreshCw,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Star,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { users } from "@/constants/user-data";
import { getRoleColor, getStatusColor } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";
import { 
  CustomerSatisfactionChart, 
  TopProductsChart 
} from "@/components/dashboard/ChartComponents";
import {
  customerSatisfactionData,
  topProductsData,
  miniChartData
} from "@/constants/dashboard-data";

const Page: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === "ACTIVE").length;
  const customers = users.filter((user) => user.role === "CUSTOMER").length;
  const merchants = users.filter((user) => user.role === "MERCHANT").length;
  const totalSpent = users.reduce((sum, user) => sum + (user.totalSpent || 0), 0);

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
                User Management
              </h1>
              <p className="text-gray-600">
                Manage and monitor all users on the platform
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={totalUsers.toString()}
            change={12.5}
            changeType="positive"
            icon={<Users className="h-5 w-5" />}
            chartData={miniChartData.customers}
            color="#3B82F6"
            subtitle="Registered users"
          />
          <StatCard
            title="Active Users"
            value={activeUsers.toString()}
            change={8.2}
            changeType="positive"
            icon={<CheckCircle className="h-5 w-5" />}
            chartData={miniChartData.orders}
            color="#10B981"
            subtitle="Currently active"
          />
          <StatCard
            title="Total Revenue"
            value={`$${(totalSpent / 1000).toFixed(0)}K`}
            change={18.5}
            changeType="positive"
            icon={<DollarSign className="h-5 w-5" />}
            chartData={miniChartData.revenue}
            chartType="area"
            color="#8B5CF6"
            subtitle="From all users"
          />
          <StatCard
            title="Customer Satisfaction"
            value="4.8"
            change={5.1}
            changeType="positive"
            icon={<Star className="h-5 w-5" />}
            chartData={miniChartData.growth}
            color="#F59E0B"
            subtitle="Average rating"
          />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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

          {/* User Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                User Activity Trends
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
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                  <SelectItem value="MERCHANT">Merchant</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
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

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={user.avatar || undefined}
                        alt={user.name}
                      />
                      <AvatarFallback className="text-lg">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {user.name}
                        </h3>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-500">Joined: {user.joinDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-500">Last login: {user.lastLogin}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    {user.role === "CUSTOMER" && (
                      <div className="text-right">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <p className="text-lg font-bold text-gray-900">
                              {user.totalOrders}
                            </p>
                            <p className="text-xs text-gray-500">Orders</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-gray-900">
                              ${user.totalSpent?.toLocaleString() || '0'}
                            </p>
                            <p className="text-xs text-gray-500">Total Spent</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      {user.status === "ACTIVE" && user.role !== "ADMIN" && (
                        <Button variant="destructive" size="sm">
                          <Ban className="h-4 w-4 mr-2" />
                          Suspend
                        </Button>
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
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No users found
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
