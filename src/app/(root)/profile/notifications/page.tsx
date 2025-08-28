"use client";

import React, { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Bell,
  Mail,
  Settings,
  Check,
  X,
  Package,
  Heart,
  Star,
  Gift,
  Calendar,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Checkbox } from "@/components/ui/checkbox";

interface Notification {
  id: string;
  type: "order" | "promotion" | "wishlist" | "review" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

const NotificationsPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "order",
      title: "Order Shipped",
      message:
        "Your order #LX-2024-001 has been shipped and is on its way to you.",
      timestamp: "2024-01-15T10:30:00Z",
      read: false,
      actionUrl: "/profile/orders/LX-2024-001",
    },
    {
      id: "2",
      type: "promotion",
      title: "Exclusive Sale",
      message: "Get 20% off on all Chanel products. Limited time offer!",
      timestamp: "2024-01-14T14:20:00Z",
      read: false,
      actionUrl: "/brands/chanel",
    },
    {
      id: "3",
      type: "wishlist",
      title: "Price Drop Alert",
      message: "The Hermès Leather Handbag in your wishlist is now 15% off.",
      timestamp: "2024-01-13T09:15:00Z",
      read: true,
      actionUrl: "/wishlist",
    },
    {
      id: "4",
      type: "review",
      title: "Review Request",
      message:
        "How was your recent purchase? Share your experience with other customers.",
      timestamp: "2024-01-12T16:45:00Z",
      read: true,
      actionUrl: "/profile/orders",
    },
    {
      id: "5",
      type: "system",
      title: "Account Security",
      message: "Your password was successfully updated.",
      timestamp: "2024-01-10T11:20:00Z",
      read: true,
    },
  ]);

  const [preferences, setPreferences] = useState({
    email: {
      orderUpdates: true,
      promotions: false,
      wishlistAlerts: true,
      reviewRequests: true,
      systemNotifications: true,
      newsletter: true,
    },
    push: {
      orderUpdates: true,
      promotions: false,
      wishlistAlerts: true,
      reviewRequests: false,
      systemNotifications: true,
      newsletter: false,
    },
    sms: {
      orderUpdates: true,
      promotions: false,
      wishlistAlerts: false,
      reviewRequests: false,
      systemNotifications: false,
      newsletter: false,
    },
  });

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="h-4 w-4" />;
      case "promotion":
        return <Gift className="h-4 w-4" />;
      case "wishlist":
        return <Heart className="h-4 w-4" />;
      case "review":
        return <Star className="h-4 w-4" />;
      case "system":
        return <Settings className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-100 text-blue-800";
      case "promotion":
        return "bg-green-100 text-green-800";
      case "wishlist":
        return "bg-red-100 text-red-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      case "system":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const handlePreferenceChange = (
    channel: "email",
    type: string,
    value: boolean,
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [type]: value,
      },
    }));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Notifications
              </h1>
              <p className="text-gray-600">
                Manage your notifications and preferences
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white">
                    {unreadCount} unread
                  </Badge>
                )}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="mt-6">
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={!notification.read ? "ring-2 ring-blue-200" : ""}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-gray-700 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {notification.actionUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(notification.actionUrl!)}
                          >
                            View
                          </Button>
                        )}
                        {!notification.read && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {notifications.length === 0 && (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No notifications
                  </h3>
                  <p className="text-gray-600">
                    You're all caught up! Check back later for updates.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="mt-6">
            <div className="space-y-6">
              {/* Email Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      key: "orderUpdates",
                      label: "Order Updates",
                      description:
                        "Shipping, delivery, and order status updates",
                    },
                    {
                      key: "promotions",
                      label: "Promotions & Sales",
                      description: "Special offers and exclusive deals",
                    },
                    {
                      key: "wishlistAlerts",
                      label: "Wishlist Alerts",
                      description: "Price drops and availability updates",
                    },
                    {
                      key: "reviewRequests",
                      label: "Review Requests",
                      description: "Invitations to review your purchases",
                    },
                    {
                      key: "systemNotifications",
                      label: "System Notifications",
                      description: "Account security and system updates",
                    },
                    {
                      key: "newsletter",
                      label: "Newsletter",
                      description: "Weekly luxury fashion news and trends",
                    },
                  ].map((pref) => (
                    <div
                      key={pref.key}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{pref.label}</h4>
                        <p className="text-sm text-gray-600">
                          {pref.description}
                        </p>
                      </div>
                      <Checkbox
                        checked={
                          preferences.email[
                            pref.key as keyof typeof preferences.email
                          ]
                        }
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("email", pref.key, !!checked)
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NotificationsPage;
