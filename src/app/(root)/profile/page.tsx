import {
  User,
  Heart,
  ShoppingCart,
  Settings,
  Package,
  CreditCard,
  MapPin,
  Bell,
  Calendar,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

import { auth } from '@/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProfileDataAndRecentOrders } from '@/lib/actions/profile-data';
import config from '@/lib/config';
import { getInitials } from '@/lib/utils';

const getStatusColor = (
  status: string
):
  | 'bg-green-100 text-green-800'
  | 'bg-blue-100 text-blue-800'
  | 'bg-yellow-100 text-yellow-800'
  | 'bg-red-100 text-red-800'
  | 'bg-gray-100 text-gray-800' => {
  switch (status.toUpperCase()) {
    case 'DELIVERED':
      return 'bg-green-100 text-green-800';
    case 'SHIPPED':
      return 'bg-blue-100 text-blue-800';
    case 'PROCESSING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const result = await getProfileDataAndRecentOrders();

  if (!result.success) {
    throw new Error(result.error || 'Failed to load profile data');
  }

  const { userProfile, recentOrders, accountStats } = result.data || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">
            Manage your luxury shopping experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    {userProfile?.image ? (
                      userProfile.image.startsWith('/profile-pictures') ? (
                        <AvatarImage
                          src={`${config.env.imagekit.urlEndpoint}${userProfile.image}`}
                          alt="Profile picture"
                          className="object-cover"
                        />
                      ) : (
                        <AvatarImage
                          src={userProfile.image}
                          alt="profile image"
                        />
                      )
                    ) : (
                      <AvatarFallback>
                        {getInitials(userProfile?.fullName || 'U')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {userProfile?.fullName}
                    </h3>
                    <p className="text-gray-600">{userProfile?.email}</p>
                    <Badge className="mt-1 capitalize">
                      {userProfile?.role}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col space-y-3">
                  <Link href="/profile/edit-profile">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                  <Link href="/profile/address">
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      Manage Addresses
                    </Button>
                  </Link>
                  <Link href="/profile/payments">
                    <Button variant="outline" className="w-full justify-start">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Methods
                    </Button>
                  </Link>
                  <Link href="/profile/notifications">
                    <Button variant="outline" className="w-full justify-start">
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/cart">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">
                      Shopping Cart
                    </h3>
                    <p className="text-sm text-gray-600">View your items</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/wishlist">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Heart className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Wishlist</h3>
                    <p className="text-sm text-gray-600">Your saved items</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/profile/orders">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Package className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Orders</h3>
                    <p className="text-sm text-gray-600">Track & manage</p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Orders
                  <Link href="/profile/orders">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders && recentOrders.length > 0 ? (
                    recentOrders.map((order: any) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {order.id}
                            </span>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {order.brand} • {order.items} item
                            {order.items > 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ${order.total.toLocaleString()}
                          </p>
                          <Link href={`/profile/orders/${order.id}`}>
                            <Button
                              variant="link"
                              size="sm"
                              className="mt-1 h-auto p-0"
                            >
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      You have no recent orders.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {accountStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total Orders
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {accountStats.totalOrders}
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
                          Total Spent
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${accountStats.totalSpent.toLocaleString()}
                        </p>
                      </div>
                      <CreditCard className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
