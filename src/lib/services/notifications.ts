import { and, asc, desc, eq, gte, lte, sql, count, inArray } from 'drizzle-orm';

import { db } from '@/database/drizzle';
import { 
  notifications, 
  notificationPreferences, 
  notificationTemplates, 
  notificationDeliveries,
  users,
  type Notification,
  type NotificationPreferences,
  type NotificationTemplate,
  type NotificationDelivery,
  type NewNotification,
  type NewNotificationPreferences,
  type NewNotificationTemplate,
  type NewNotificationDelivery,
} from '@/database/schema';

import type {
  CreateNotificationInput,
  UpdateNotificationInput,
  QueryNotificationsInput,
  NotificationPreferencesInput,
  UpdateNotificationPreferencesInput,
  NotificationTemplateInput,
  UpdateNotificationTemplateInput,
  NotificationDeliveryInput,
} from '@/lib/validations/notifications';

// ====================
// NOTIFICATION CRUD OPERATIONS
// ====================

/**
 * Create a new notification
 */
export async function createNotification(data: CreateNotificationInput): Promise<Notification> {
  const notificationData: NewNotification = {
    userId: data.userId,
    type: data.type,
    priority: data.priority,
    channel: data.channel,
    title: data.title,
    body: data.body,
    data: data.data,
    actionUrl: data.actionUrl || null,
    actionText: data.actionText || null,
    imageUrl: data.imageUrl || null,
    orderId: data.orderId || null,
    productId: data.productId || null,
    merchantId: data.merchantId || null,
    scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
    expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    isGlobal: data.isGlobal,
  };

  const [notification] = await db.insert(notifications).values(notificationData).returning();
  return notification;
}

/**
 * Get notification by ID
 */
export async function getNotificationById(id: string, userId?: string): Promise<Notification | null> {
  const conditions = [eq(notifications.id, id)];
  if (userId) {
    conditions.push(eq(notifications.userId, userId));
  }

  const [notification] = await db
    .select()
    .from(notifications)
    .where(and(...conditions))
    .limit(1);

  return notification || null;
}

/**
 * Get notifications for a user with filtering and pagination
 */
export async function getUserNotifications(params: QueryNotificationsInput & { userId: string }) {
  const conditions = [eq(notifications.userId, params.userId)];

  // Add filters
  if (params.type) {
    conditions.push(eq(notifications.type, params.type));
  }
  if (params.status) {
    conditions.push(eq(notifications.status, params.status));
  }
  if (params.priority) {
    conditions.push(eq(notifications.priority, params.priority));
  }
  if (params.channel) {
    conditions.push(eq(notifications.channel, params.channel));
  }
  if (params.startDate) {
    conditions.push(gte(notifications.createdAt, new Date(params.startDate)));
  }
  if (params.endDate) {
    conditions.push(lte(notifications.createdAt, new Date(params.endDate)));
  }

  // Build order clause
  const orderDirection = params.orderDirection === 'asc' ? asc : desc;
  const orderColumn = params.orderBy === 'createdAt' ? notifications.createdAt
    : params.orderBy === 'updatedAt' ? notifications.updatedAt
    : params.orderBy === 'priority' ? notifications.priority
    : notifications.createdAt; // default fallback

  // Get total count
  const [{ totalCount }] = await db
    .select({ totalCount: count() })
    .from(notifications)
    .where(and(...conditions));

  // Get notifications
  const results = await db
    .select()
    .from(notifications)
    .where(and(...conditions))
    .orderBy(orderDirection(orderColumn))
    .limit(params.limit)
    .offset(params.offset);

  return {
    notifications: results,
    totalCount,
    hasMore: params.offset + params.limit < totalCount,
  };
}

/**
 * Get unread notifications count for a user
 */
export async function getUnreadNotificationsCount(userId: string): Promise<number> {
  const [{ count: unreadCount }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.status, 'PENDING')
      )
    );

  return unreadCount;
}

/**
 * Update notification
 */
export async function updateNotification(
  id: string, 
  userId: string, 
  data: Omit<UpdateNotificationInput, 'id'>
): Promise<Notification | null> {
  const updateData: Partial<Notification> = {};

  if (data.status) {
    updateData.status = data.status;
    if (data.status === 'READ') {
      updateData.readAt = new Date();
    } else if (data.status === 'ARCHIVED') {
      updateData.archivedAt = new Date();
    }
  }

  if (data.readAt !== undefined) {
    updateData.readAt = data.readAt ? new Date(data.readAt) : null;
  }

  if (data.archivedAt !== undefined) {
    updateData.archivedAt = data.archivedAt ? new Date(data.archivedAt) : null;
  }

  updateData.updatedAt = new Date();

  const [updatedNotification] = await db
    .update(notifications)
    .set(updateData)
    .where(
      and(
        eq(notifications.id, id),
        eq(notifications.userId, userId)
      )
    )
    .returning();

  return updatedNotification || null;
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(id: string, userId: string): Promise<boolean> {
  const result = await db
    .update(notifications)
    .set({ 
      status: 'READ',
      readAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(notifications.id, id),
        eq(notifications.userId, userId)
      )
    );

  return result.rowCount > 0;
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string): Promise<number> {
  const result = await db
    .update(notifications)
    .set({ 
      status: 'READ',
      readAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.status, 'PENDING')
      )
    );

  return result.rowCount;
}

/**
 * Bulk update notifications
 */
export async function bulkUpdateNotifications(
  notificationIds: string[], 
  userId: string, 
  action: 'mark_read' | 'mark_unread' | 'archive' | 'delete'
): Promise<number> {
  const conditions = [
    inArray(notifications.id, notificationIds),
    eq(notifications.userId, userId)
  ];

  if (action === 'delete') {
    const result = await db
      .delete(notifications)
      .where(and(...conditions));
    return result.rowCount;
  }

  const updateData: Partial<Notification> = { updatedAt: new Date() };

  switch (action) {
    case 'mark_read':
      updateData.status = 'READ';
      updateData.readAt = new Date();
      break;
    case 'mark_unread':
      updateData.status = 'PENDING';
      updateData.readAt = null;
      break;
    case 'archive':
      updateData.status = 'ARCHIVED';
      updateData.archivedAt = new Date();
      break;
  }

  const result = await db
    .update(notifications)
    .set(updateData)
    .where(and(...conditions));

  return result.rowCount;
}

/**
 * Delete notification
 */
export async function deleteNotification(id: string, userId: string): Promise<boolean> {
  const result = await db
    .delete(notifications)
    .where(
      and(
        eq(notifications.id, id),
        eq(notifications.userId, userId)
      )
    );

  return result.rowCount > 0;
}

// ====================
// NOTIFICATION PREFERENCES CRUD OPERATIONS
// ====================

/**
 * Get or create user notification preferences
 */
export async function getUserNotificationPreferences(userId: string): Promise<NotificationPreferences> {
  let [preferences] = await db
    .select()
    .from(notificationPreferences)
    .where(eq(notificationPreferences.userId, userId))
    .limit(1);

  // Create default preferences if they don't exist
  if (!preferences) {
    const defaultPreferences: NewNotificationPreferences = {
      userId,
      emailOrderUpdates: true,
      emailPromotions: false,
      emailWishlistAlerts: true,
      emailReviewRequests: true,
      emailSystemNotifications: true,
      emailNewsletter: true,
      emailSecurityAlerts: true,
      pushOrderUpdates: true,
      pushPromotions: false,
      pushWishlistAlerts: true,
      pushReviewRequests: false,
      pushSystemNotifications: true,
      pushSecurityAlerts: true,
      smsOrderUpdates: true,
      smsPromotions: false,
      smsWishlistAlerts: false,
      smsReviewRequests: false,
      smsSystemNotifications: false,
      smsSecurityAlerts: true,
      inAppOrderUpdates: true,
      inAppPromotions: true,
      inAppWishlistAlerts: true,
      inAppReviewRequests: true,
      inAppSystemNotifications: true,
      inAppSecurityAlerts: true,
      timezone: 'America/New_York',
      language: 'en',
    };

    [preferences] = await db
      .insert(notificationPreferences)
      .values(defaultPreferences)
      .returning();
  }

  return preferences;
}

/**
 * Update user notification preferences
 */
export async function updateUserNotificationPreferences(
  userId: string, 
  data: UpdateNotificationPreferencesInput
): Promise<NotificationPreferences | null> {
  const updateData = {
    ...data,
    updatedAt: new Date(),
  };

  const [updatedPreferences] = await db
    .update(notificationPreferences)
    .set(updateData)
    .where(eq(notificationPreferences.userId, userId))
    .returning();

  return updatedPreferences || null;
}

// ====================
// NOTIFICATION TEMPLATES CRUD OPERATIONS
// ====================

/**
 * Create notification template
 */
export async function createNotificationTemplate(data: NotificationTemplateInput): Promise<NotificationTemplate> {
  const templateData: NewNotificationTemplate = {
    type: data.type,
    name: data.name,
    subject: data.subject || null,
    title: data.title,
    body: data.body,
    htmlBody: data.htmlBody || null,
    variables: data.variables as Record<string, string>,
    isActive: data.isActive,
  };

  const [template] = await db.insert(notificationTemplates).values(templateData).returning();
  return template;
}

/**
 * Get notification template by ID
 */
export async function getNotificationTemplateById(id: string): Promise<NotificationTemplate | null> {
  const [template] = await db
    .select()
    .from(notificationTemplates)
    .where(eq(notificationTemplates.id, id))
    .limit(1);

  return template || null;
}

/**
 * Get notification template by type
 */
export async function getNotificationTemplateByType(type: string): Promise<NotificationTemplate | null> {
  const [template] = await db
    .select()
    .from(notificationTemplates)
    .where(
      and(
        eq(notificationTemplates.type, type as any),
        eq(notificationTemplates.isActive, true)
      )
    )
    .limit(1);

  return template || null;
}

/**
 * Get all notification templates
 */
export async function getAllNotificationTemplates(activeOnly: boolean = false): Promise<NotificationTemplate[]> {
  const conditions = activeOnly ? [eq(notificationTemplates.isActive, true)] : [];

  return await db
    .select()
    .from(notificationTemplates)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(notificationTemplates.type), asc(notificationTemplates.name));
}

/**
 * Update notification template
 */
export async function updateNotificationTemplate(
  id: string, 
  data: UpdateNotificationTemplateInput
): Promise<NotificationTemplate | null> {
  const updateData = {
    ...data,
    variables: data.variables as Record<string, string> | undefined,
    updatedAt: new Date(),
  };

  const [updatedTemplate] = await db
    .update(notificationTemplates)
    .set(updateData)
    .where(eq(notificationTemplates.id, id))
    .returning();

  return updatedTemplate || null;
}

/**
 * Delete notification template
 */
export async function deleteNotificationTemplate(id: string): Promise<boolean> {
  const result = await db
    .delete(notificationTemplates)
    .where(eq(notificationTemplates.id, id));

  return result.rowCount > 0;
}

// ====================
// NOTIFICATION DELIVERIES
// ====================

/**
 * Create notification delivery record
 */
export async function createNotificationDelivery(data: NotificationDeliveryInput): Promise<NotificationDelivery> {
  const deliveryData: NewNotificationDelivery = {
    notificationId: data.notificationId,
    channel: data.channel,
    recipient: data.recipient,
    status: data.status,
    externalId: data.externalId || null,
    errorMessage: data.errorMessage || null,
    attempts: 0,
  };

  const [delivery] = await db.insert(notificationDeliveries).values(deliveryData).returning();
  return delivery;
}

/**
 * Update notification delivery status
 */
export async function updateNotificationDeliveryStatus(
  id: string,
  status: 'SENT' | 'FAILED',
  externalId?: string,
  errorMessage?: string
): Promise<boolean> {
  const updateData: Partial<NotificationDelivery> = {
    status: status as any,
    updatedAt: new Date(),
    lastAttemptAt: new Date(),
  };

  if (status === 'SENT') {
    updateData.deliveredAt = new Date();
  }

  if (externalId) {
    updateData.externalId = externalId;
  }

  if (errorMessage) {
    updateData.errorMessage = errorMessage;
  }

  const result = await db
    .update(notificationDeliveries)
    .set(updateData)
    .where(eq(notificationDeliveries.id, id));

  return result.rowCount > 0;
}

/**
 * Increment delivery attempt count
 */
export async function incrementDeliveryAttempt(id: string): Promise<boolean> {
  const result = await db
    .update(notificationDeliveries)
    .set({
      attempts: sql`${notificationDeliveries.attempts} + 1`,
      lastAttemptAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(notificationDeliveries.id, id));

  return result.rowCount > 0;
}

// ====================
// UTILITY FUNCTIONS
// ====================

/**
 * Get scheduled notifications that need to be sent
 */
export async function getScheduledNotifications(limit: number = 100): Promise<Notification[]> {
  return await db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.status, 'PENDING'),
        lte(notifications.scheduledFor, new Date())
      )
    )
    .orderBy(asc(notifications.scheduledFor))
    .limit(limit);
}

/**
 * Clean up expired notifications
 */
export async function cleanupExpiredNotifications(): Promise<number> {
  const result = await db
    .delete(notifications)
    .where(
      and(
        lte(notifications.expiresAt, new Date()),
        eq(notifications.status, 'PENDING')
      )
    );

  return result.rowCount;
}

/**
 * Get notification statistics for a user
 */
export async function getUserNotificationStats(userId: string) {
  const [stats] = await db
    .select({
      total: sql<number>`count(*)`,
      unread: sql<number>`sum(case when ${notifications.status} = 'PENDING' then 1 else 0 end)`,
      read: sql<number>`sum(case when ${notifications.status} = 'read' then 1 else 0 end)`,
      archived: sql<number>`sum(case when ${notifications.status} = 'ARCHIVED' then 1 else 0 end)`,
    })
    .from(notifications)
    .where(eq(notifications.userId, userId));

  return {
    total: stats.total,
    unread: stats.unread,
    read: stats.read,
    archived: stats.archived,
  };
}