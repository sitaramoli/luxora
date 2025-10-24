'use client';

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
  Smartphone,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Notification, NotificationPreferences } from '@/database/schema';
import {
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
  deleteNotificationAction,
  bulkUpdateNotificationsAction,
  updateUserNotificationPreferencesAction,
  getUserNotificationsAction,
} from '@/lib/actions/notifications';

interface NotificationsClientProps {
  initialNotifications: {
    notifications: Notification[];
    totalCount: number;
    hasMore: boolean;
  };
  initialPreferences: NotificationPreferences | null;
  searchParams: {
    page?: string;
    type?: string;
    status?: string;
  };
  userId: string;
}

export default function NotificationsClient({
  initialNotifications,
  initialPreferences,
  searchParams,
}: NotificationsClientProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const [notifications, setNotifications] = useState(
    initialNotifications.notifications
  );
  const [totalCount, setTotalCount] = useState(initialNotifications.totalCount);
  const [hasMore, setHasMore] = useState(initialNotifications.hasMore);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );

  const refreshNotifications = useCallback(
    async (filters?: {
      type?: string;
      status?: string;
      showToast?: boolean;
    }) => {
      try {
        setRefreshing(true);
        const queryParams: any = {
          limit: 20,
          offset: 0,
          orderBy: 'createdAt',
          orderDirection: 'desc',
        };

        // Use explicit filter values if provided, otherwise fall back to searchParams
        const typeFilter =
          filters?.type !== undefined ? filters.type : searchParams.type;
        const statusFilter =
          filters?.status !== undefined ? filters.status : searchParams.status;

        if (typeFilter && typeFilter !== 'all') {
          queryParams.type = typeFilter;
        }

        if (statusFilter && statusFilter !== 'all') {
          queryParams.status = statusFilter;
        }

        const result = await getUserNotificationsAction(queryParams);

        if (result.success && result.data) {
          // Always replace notifications when we're doing a filter refresh
          // This ensures that filtering works correctly
          if (filters && filters.showToast === false) {
            // This is a filter change, replace all notifications
            setNotifications(result.data.notifications);
            setTotalCount(result.data.totalCount);
            setHasMore(result.data.hasMore);
          } else {
            // This is a refresh, check for new notifications
            const currentIds = new Set(notifications.map(n => n.id));
            const newNotifications = result.data.notifications.filter(
              (n: Notification) => !currentIds.has(n.id)
            );

            if (newNotifications.length > 0) {
              setNotifications(prev => [...newNotifications, ...prev]);
              setTotalCount(prev => prev + newNotifications.length);

              // Show toast for new notifications
              if (filters?.showToast !== false) {
                if (newNotifications.length === 1) {
                  toast.success('New notification received');
                } else {
                  toast.success(
                    `${newNotifications.length} new notifications received`
                  );
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error refreshing notifications:', error);
        if (filters?.showToast !== false) {
          toast.error('Failed to refresh notifications');
        }
      } finally {
        setRefreshing(false);
      }
    },
    [notifications, searchParams]
  );

  const refreshUnreadCount = useCallback(
    () => refreshNotifications({ showToast: true }),
    [refreshNotifications]
  );

  // Real-time polling for new notifications
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      await refreshUnreadCount();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(pollInterval);
  }, [refreshUnreadCount]);

  const handleMarkAsRead = async (id: string) => {
    try {
      setLoading(true);
      const result = await markNotificationAsReadAction(id);

      if (result.success) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === id
              ? { ...notif, status: 'READ' as any, readAt: new Date() }
              : notif
          )
        );
        toast.success('Notification marked as read');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to mark notification as read');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);
      const result = await markAllNotificationsAsReadAction();

      if (result.success) {
        setNotifications(prev =>
          prev.map(notif => ({
            ...notif,
            status: 'READ' as any,
            readAt: new Date(),
          }))
        );
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      setLoading(true);
      const result = await deleteNotificationAction(id);

      if (result.success) {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
        setTotalCount(prev => prev - 1);
        toast.success('Notification deleted');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to delete notification');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (
    action: 'mark_read' | 'mark_unread' | 'archive' | 'delete'
  ) => {
    if (selectedNotifications.length === 0) {
      toast.error('No notifications selected');
      return;
    }

    try {
      setLoading(true);
      const result = await bulkUpdateNotificationsAction({
        notificationIds: selectedNotifications,
        action,
      });

      if (result.success) {
        if (action === 'delete') {
          setNotifications(prev =>
            prev.filter(notif => !selectedNotifications.includes(notif.id))
          );
          setTotalCount(prev => prev - selectedNotifications.length);
        } else {
          // Update notification statuses
          setNotifications(prev =>
            prev.map(notif => {
              if (selectedNotifications.includes(notif.id)) {
                const updates: Partial<Notification> = {};
                switch (action) {
                  case 'mark_read':
                    updates.status = 'READ' as any;
                    updates.readAt = new Date();
                    break;
                  case 'mark_unread':
                    updates.status = 'PENDING' as any;
                    updates.readAt = null;
                    break;
                  case 'archive':
                    updates.status = 'ARCHIVED' as any;
                    updates.archivedAt = new Date();
                    break;
                }
                return { ...notif, ...updates };
              }
              return notif;
            })
          );
        }

        setSelectedNotifications([]);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(`Failed to ${action.replace('_', ' ')} notifications`);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = async (field: string, value: boolean) => {
    if (!preferences) return;

    try {
      const updateData = { [field]: value };
      const result = await updateUserNotificationPreferencesAction(updateData);

      if (result.success) {
        setPreferences(result.data);
        toast.success('Preferences updated');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update preferences');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ORDER_UPDATE':
      case 'ORDER_SHIPPED':
      case 'ORDER_DELIVERED':
      case 'ORDER_CANCELLED':
        return <Package className="h-4 w-4" />;
      case 'PROMOTION':
      case 'SALE':
        return <Gift className="h-4 w-4" />;
      case 'PRICE_DROP':
      case 'WISHLIST_ITEM_AVAILABLE':
        return <Heart className="h-4 w-4" />;
      case 'REVIEW_REQUEST':
        return <Star className="h-4 w-4" />;
      case 'SYSTEM_ALERT':
      case 'SECURITY_ALERT':
        return <Settings className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'ORDER_UPDATE':
      case 'ORDER_SHIPPED':
      case 'ORDER_DELIVERED':
        return 'bg-blue-100 text-blue-800';
      case 'ORDER_CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'PROMOTION':
      case 'SALE':
        return 'bg-green-100 text-green-800';
      case 'PRICE_DROP':
      case 'WISHLIST_ITEM_AVAILABLE':
        return 'bg-red-100 text-red-800';
      case 'REVIEW_REQUEST':
        return 'bg-yellow-100 text-yellow-800';
      case 'SYSTEM_ALERT':
      case 'SECURITY_ALERT':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => n.status === 'PENDING').length;
  const isAllSelected = selectedNotifications.length === notifications.length;

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

            <Button
              variant="outline"
              onClick={() => refreshNotifications({ showToast: false })}
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
              />
              Refresh
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

            <div className="flex gap-2">
              {selectedNotifications.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('mark_read')}
                    disabled={loading}
                  >
                    Mark Read
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('archive')}
                    disabled={loading}
                  >
                    Archive
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleBulkAction('delete')}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </div>
              )}

              {unreadCount > 0 && (
                <Button onClick={handleMarkAllAsRead} disabled={loading}>
                  <Check className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="mt-6">
            {/* Filter Controls - Always Visible */}
            <div className="mb-4 p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {notifications.length > 0 && (
                    <>
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={checked => {
                          if (checked) {
                            setSelectedNotifications(
                              notifications.map(n => n.id)
                            );
                          } else {
                            setSelectedNotifications([]);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-600">
                        {selectedNotifications.length === 0
                          ? 'Select notifications'
                          : `${selectedNotifications.length} selected`}
                      </span>
                    </>
                  )}
                  {notifications.length === 0 && (
                    <span className="text-sm text-gray-600">
                      {(searchParams.type && searchParams.type !== 'all') ||
                      (searchParams.status && searchParams.status !== 'all')
                        ? 'No notifications match the current filter'
                        : 'No notifications available'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={searchParams.type || 'all'}
                    onValueChange={async value => {
                      const params = new URLSearchParams(urlSearchParams);
                      const newType = value === 'all' ? undefined : value;

                      if (value === 'all') {
                        params.delete('type');
                      } else {
                        params.set('type', value);
                      }

                      // Update URL
                      router.push(`?${params.toString()}`);

                      // Refresh data immediately
                      await refreshNotifications({
                        type: newType,
                        status:
                          searchParams.status === 'all'
                            ? undefined
                            : searchParams.status,
                        showToast: false,
                      });
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="ORDER_UPDATE">Orders</SelectItem>
                      <SelectItem value="PROMOTION">Promotions</SelectItem>
                      <SelectItem value="PRICE_DROP">Wishlist</SelectItem>
                      <SelectItem value="REVIEW_REQUEST">Reviews</SelectItem>
                      <SelectItem value="SYSTEM_ALERT">System</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={searchParams.status || 'all'}
                    onValueChange={async value => {
                      const params = new URLSearchParams(urlSearchParams);
                      const newStatus = value === 'all' ? undefined : value;

                      if (value === 'all') {
                        params.delete('status');
                      } else {
                        params.set('status', value);
                      }

                      // Update URL
                      router.push(`?${params.toString()}`);

                      // Refresh data immediately
                      await refreshNotifications({
                        type:
                          searchParams.type === 'all'
                            ? undefined
                            : searchParams.type,
                        status: newStatus,
                        showToast: false,
                      });
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="PENDING">Unread</SelectItem>
                      <SelectItem value="READ">Read</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {notifications.map(notification => (
                <Card
                  key={notification.id}
                  className={
                    notification.status === 'PENDING'
                      ? 'ring-2 ring-blue-200'
                      : ''
                  }
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Checkbox
                          checked={selectedNotifications.includes(
                            notification.id
                          )}
                          onCheckedChange={checked => {
                            if (checked) {
                              setSelectedNotifications(prev => [
                                ...prev,
                                notification.id,
                              ]);
                            } else {
                              setSelectedNotifications(prev =>
                                prev.filter(id => id !== notification.id)
                              );
                            }
                          }}
                        />

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
                            {notification.status === 'PENDING' && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-gray-700 mb-2">
                            {notification.body}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {formatTimestamp(notification.createdAt)}
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
                        {notification.status === 'PENDING' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={loading}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDeleteNotification(notification.id)
                          }
                          disabled={loading}
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
            {preferences && (
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
                        key: 'emailOrderUpdates',
                        label: 'Order Updates',
                        description:
                          'Shipping, delivery, and order status updates',
                      },
                      {
                        key: 'emailPromotions',
                        label: 'Promotions & Sales',
                        description: 'Special offers and exclusive deals',
                      },
                      {
                        key: 'emailWishlistAlerts',
                        label: 'Wishlist Alerts',
                        description: 'Price drops and availability updates',
                      },
                      {
                        key: 'emailReviewRequests',
                        label: 'Review Requests',
                        description: 'Invitations to review your purchases',
                      },
                      {
                        key: 'emailSystemNotifications',
                        label: 'System Notifications',
                        description: 'Account security and system updates',
                      },
                      {
                        key: 'emailNewsletter',
                        label: 'Newsletter',
                        description: 'Weekly luxury fashion news and trends',
                      },
                      {
                        key: 'emailSecurityAlerts',
                        label: 'Security Alerts',
                        description: 'Important security notifications',
                      },
                    ].map(pref => (
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
                            preferences[
                              pref.key as keyof typeof preferences
                            ] as boolean
                          }
                          onCheckedChange={checked =>
                            handlePreferenceChange(pref.key, !!checked)
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Push Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      Push Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        key: 'pushOrderUpdates',
                        label: 'Order Updates',
                        description:
                          'Shipping, delivery, and order status updates',
                      },
                      {
                        key: 'pushPromotions',
                        label: 'Promotions & Sales',
                        description: 'Special offers and exclusive deals',
                      },
                      {
                        key: 'pushWishlistAlerts',
                        label: 'Wishlist Alerts',
                        description: 'Price drops and availability updates',
                      },
                      {
                        key: 'pushReviewRequests',
                        label: 'Review Requests',
                        description: 'Invitations to review your purchases',
                      },
                      {
                        key: 'pushSystemNotifications',
                        label: 'System Notifications',
                        description: 'Account security and system updates',
                      },
                      {
                        key: 'pushSecurityAlerts',
                        label: 'Security Alerts',
                        description: 'Important security notifications',
                      },
                    ].map(pref => (
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
                            preferences[
                              pref.key as keyof typeof preferences
                            ] as boolean
                          }
                          onCheckedChange={checked =>
                            handlePreferenceChange(pref.key, !!checked)
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* SMS Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      SMS Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        key: 'smsOrderUpdates',
                        label: 'Order Updates',
                        description: 'Critical shipping and delivery updates',
                      },
                      {
                        key: 'smsPromotions',
                        label: 'Promotions & Sales',
                        description: 'Flash sales and limited-time offers',
                      },
                      {
                        key: 'smsWishlistAlerts',
                        label: 'Wishlist Alerts',
                        description: 'Urgent price drops and low stock alerts',
                      },
                      {
                        key: 'smsSecurityAlerts',
                        label: 'Security Alerts',
                        description: 'Critical security notifications',
                      },
                    ].map(pref => (
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
                            preferences[
                              pref.key as keyof typeof preferences
                            ] as boolean
                          }
                          onCheckedChange={checked =>
                            handlePreferenceChange(pref.key, !!checked)
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
