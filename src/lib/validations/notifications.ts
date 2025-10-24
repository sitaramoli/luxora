import { z } from 'zod';

// Notification type schema
export const notificationTypeSchema = z.enum([
  'ORDER_UPDATE',
  'ORDER_SHIPPED',
  'ORDER_DELIVERED',
  'ORDER_CANCELLED',
  'PAYMENT_SUCCESS',
  'PAYMENT_FAILED',
  'PROMOTION',
  'SALE',
  'PRICE_DROP',
  'WISHLIST_ITEM_AVAILABLE',
  'WISHLIST_PRICE_DROP',
  'REVIEW_REQUEST',
  'REVIEW_RESPONSE',
  'ACCOUNT_SECURITY',
  'PASSWORD_CHANGED',
  'PROFILE_UPDATED',
  'NEWSLETTER',
  'SYSTEM_MAINTENANCE',
  'SYSTEM_UPDATE',
  'WELCOME',
  'BIRTHDAY',
  'ANNIVERSARY',
  'CUSTOM',
]);

// Notification priority schema
export const notificationPrioritySchema = z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']);

// Notification status schema
export const notificationStatusSchema = z.enum(['PENDING', 'SENT', 'READ', 'ARCHIVED', 'FAILED']);

// Notification channel schema
export const notificationChannelSchema = z.enum(['IN_APP', 'EMAIL', 'SMS', 'PUSH']);

// Create notification schema
export const createNotificationSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  type: notificationTypeSchema,
  priority: notificationPrioritySchema.default('NORMAL'),
  channel: notificationChannelSchema.default('IN_APP'),
  title: z.string()
    .min(1, 'Title is required')
    .max(500, 'Title must be 500 characters or less'),
  body: z.string()
    .min(1, 'Body is required')
    .max(5000, 'Body must be 5000 characters or less'),
  data: z.record(z.string(), z.any()).optional().default({}),
  actionUrl: z.string().url('Invalid action URL').optional().or(z.literal('')),
  actionText: z.string().max(100, 'Action text must be 100 characters or less').optional(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  // Related entities
  orderId: z.string().optional(),
  productId: z.number().int().positive().optional(),
  merchantId: z.string().uuid().optional(),
  // Scheduling
  scheduledFor: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  isGlobal: z.boolean().default(false),
});

// Update notification schema
export const updateNotificationSchema = z.object({
  id: z.string().uuid('Invalid notification ID'),
  status: notificationStatusSchema.optional(),
  readAt: z.string().datetime().optional().nullable(),
  archivedAt: z.string().datetime().optional().nullable(),
});

// Bulk update notifications schema
export const bulkUpdateNotificationsSchema = z.object({
  notificationIds: z.array(z.string().uuid()).min(1, 'At least one notification ID is required'),
  action: z.enum(['mark_read', 'mark_unread', 'archive', 'delete']),
});

// Notification preferences schema
export const notificationPreferencesSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  // Email preferences
  emailOrderUpdates: z.boolean().default(true),
  emailPromotions: z.boolean().default(false),
  emailWishlistAlerts: z.boolean().default(true),
  emailReviewRequests: z.boolean().default(true),
  emailSystemNotifications: z.boolean().default(true),
  emailNewsletter: z.boolean().default(true),
  emailSecurityAlerts: z.boolean().default(true),
  // Push notification preferences
  pushOrderUpdates: z.boolean().default(true),
  pushPromotions: z.boolean().default(false),
  pushWishlistAlerts: z.boolean().default(true),
  pushReviewRequests: z.boolean().default(false),
  pushSystemNotifications: z.boolean().default(true),
  pushSecurityAlerts: z.boolean().default(true),
  // SMS preferences
  smsOrderUpdates: z.boolean().default(true),
  smsPromotions: z.boolean().default(false),
  smsWishlistAlerts: z.boolean().default(false),
  smsReviewRequests: z.boolean().default(false),
  smsSystemNotifications: z.boolean().default(false),
  smsSecurityAlerts: z.boolean().default(true),
  // In-app preferences
  inAppOrderUpdates: z.boolean().default(true),
  inAppPromotions: z.boolean().default(true),
  inAppWishlistAlerts: z.boolean().default(true),
  inAppReviewRequests: z.boolean().default(true),
  inAppSystemNotifications: z.boolean().default(true),
  inAppSecurityAlerts: z.boolean().default(true),
  // General preferences
  timezone: z.string().max(100).default('America/New_York'),
  language: z.string().max(10).default('en'),
});

// Update notification preferences schema (partial update)
export const updateNotificationPreferencesSchema = notificationPreferencesSchema.partial().omit({
  userId: true,
});

// Notification template schema
export const notificationTemplateSchema = z.object({
  type: notificationTypeSchema,
  name: z.string()
    .min(1, 'Template name is required')
    .max(255, 'Template name must be 255 characters or less'),
  subject: z.string().max(500, 'Subject must be 500 characters or less').optional(),
  title: z.string()
    .min(1, 'Title is required')
    .max(500, 'Title must be 500 characters or less'),
  body: z.string()
    .min(1, 'Body is required')
    .max(10000, 'Body must be 10000 characters or less'),
  htmlBody: z.string().optional(),
  variables: z.record(z.string(), z.string()).default({}),
  isActive: z.boolean().default(true),
});

// Update notification template schema
export const updateNotificationTemplateSchema = notificationTemplateSchema.partial();

// Query notifications schema
export const queryNotificationsSchema = z.object({
  userId: z.string().uuid().optional(),
  type: notificationTypeSchema.optional(),
  status: notificationStatusSchema.optional(),
  priority: notificationPrioritySchema.optional(),
  channel: notificationChannelSchema.optional(),
  isGlobal: z.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
  orderBy: z.enum(['createdAt', 'updatedAt', 'priority', 'readAt']).default('createdAt'),
  orderDirection: z.enum(['asc', 'desc']).default('desc'),
});

// Notification delivery schema
export const notificationDeliverySchema = z.object({
  notificationId: z.string().uuid('Invalid notification ID'),
  channel: notificationChannelSchema,
  recipient: z.string()
    .min(1, 'Recipient is required')
    .max(255, 'Recipient must be 255 characters or less'),
  status: notificationStatusSchema.default('PENDING'),
  externalId: z.string().max(255).optional(),
  errorMessage: z.string().optional(),
});

// Send notification schema
export const sendNotificationSchema = z.object({
  notification: createNotificationSchema,
  channels: z.array(notificationChannelSchema).min(1, 'At least one channel is required'),
  recipients: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    pushToken: z.string().optional(),
  }).optional(),
  scheduleFor: z.string().datetime().optional(),
});

// Batch send notifications schema
export const batchSendNotificationsSchema = z.object({
  notifications: z.array(sendNotificationSchema).min(1, 'At least one notification is required'),
  globalSettings: z.object({
    priority: notificationPrioritySchema.optional(),
    scheduleFor: z.string().datetime().optional(),
    expiresAt: z.string().datetime().optional(),
  }).optional(),
});

// Export type definitions
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;
export type BulkUpdateNotificationsInput = z.infer<typeof bulkUpdateNotificationsSchema>;
export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>;
export type UpdateNotificationPreferencesInput = z.infer<typeof updateNotificationPreferencesSchema>;
export type NotificationTemplateInput = z.infer<typeof notificationTemplateSchema>;
export type UpdateNotificationTemplateInput = z.infer<typeof updateNotificationTemplateSchema>;
export type QueryNotificationsInput = z.infer<typeof queryNotificationsSchema>;
export type NotificationDeliveryInput = z.infer<typeof notificationDeliverySchema>;
export type SendNotificationInput = z.infer<typeof sendNotificationSchema>;
export type BatchSendNotificationsInput = z.infer<typeof batchSendNotificationsSchema>;

// Export enum types
export type NotificationType = z.infer<typeof notificationTypeSchema>;
export type NotificationPriority = z.infer<typeof notificationPrioritySchema>;
export type NotificationStatus = z.infer<typeof notificationStatusSchema>;
export type NotificationChannel = z.infer<typeof notificationChannelSchema>;