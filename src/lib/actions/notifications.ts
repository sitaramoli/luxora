'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { auth } from '@/auth';
import { 
  createNotificationSchema,
  updateNotificationSchema,
  queryNotificationsSchema,
  bulkUpdateNotificationsSchema,
  updateNotificationPreferencesSchema,
  notificationTemplateSchema,
  updateNotificationTemplateSchema,
} from '@/lib/validations/notifications';

import {
  createNotification,
  getUserNotifications,
  updateNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  bulkUpdateNotifications,
  deleteNotification,
  getUnreadNotificationsCount,
  getUserNotificationPreferences,
  updateUserNotificationPreferences,
  createNotificationTemplate,
  getAllNotificationTemplates,
  updateNotificationTemplate,
  deleteNotificationTemplate,
  getUserNotificationStats,
  getNotificationById,
} from '@/lib/services/notifications';

type FormState = {
  success: boolean;
  message: string;
  data?: any;
  errors?: any;
};

// ====================
// NOTIFICATION ACTIONS
// ====================

/**
 * Create a new notification
 */
export async function createNotificationAction(
  input: z.infer<typeof createNotificationSchema>
): Promise<FormState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'Authentication required' };
    }

    // Validate input
    const validatedData = createNotificationSchema.parse(input);

    // Create notification
    const notification = await createNotification(validatedData);

    // Revalidate notifications page
    revalidatePath('/notifications');

    return {
      success: true,
      message: 'Notification created successfully',
      data: notification,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Invalid input data',
        errors: error.flatten().fieldErrors,
      };
    }

    console.error('Error creating notification:', error);
    return {
      success: false,
      message: 'Failed to create notification',
    };
  }
}

/**
 * Get user notifications with pagination and filtering
 */
export async function getUserNotificationsAction(
  input?: z.infer<typeof queryNotificationsSchema>
): Promise<FormState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'Authentication required' };
    }

    // Use default values if no input provided
    const params = {
      limit: 20,
      offset: 0,
      orderBy: 'createdAt',
      orderDirection: 'desc',
      ...input,
    } as const;

    // Validate input
    const validatedParams = queryNotificationsSchema.parse(params);

    // Get notifications
    const result = await getUserNotifications({
      ...validatedParams,
      userId: session.user.id,
    });

    return {
      success: true,
      message: 'Notifications retrieved successfully',
      data: result,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Invalid query parameters',
        errors: error.flatten().fieldErrors,
      };
    }

    console.error('Error getting notifications:', error);
    return {
      success: false,
      message: 'Failed to retrieve notifications',
    };
  }
}

/**
 * Update a notification
 */
export async function updateNotificationAction(
  input: z.infer<typeof updateNotificationSchema>
): Promise<FormState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'Authentication required' };
    }

    // Validate input
    const validatedData = updateNotificationSchema.parse(input);

    // Update notification
    const notification = await updateNotification(
      validatedData.id,
      session.user.id,
      validatedData
    );

    if (!notification) {
      return { success: false, message: 'Notification not found or access denied' };
    }

    // Revalidate notifications page
    revalidatePath('/notifications');

    return {
      success: true,
      message: 'Notification updated successfully',
      data: notification,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Invalid input data',
        errors: error.flatten().fieldErrors,
      };
    }

    console.error('Error updating notification:', error);
    return {
      success: false,
      message: 'Failed to update notification',
    };
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsReadAction(notificationId: string): Promise<FormState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'Authentication required' };
    }

    const success = await markNotificationAsRead(notificationId, session.user.id);

    if (!success) {
      return { success: false, message: 'Notification not found or access denied' };
    }

    // Revalidate notifications page
    revalidatePath('/notifications');

    return {
      success: true,
      message: 'Notification marked as read',
    };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return {
      success: false,
      message: 'Failed to mark notification as read',
    };
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsReadAction(): Promise<FormState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'Authentication required' };
    }

    const updatedCount = await markAllNotificationsAsRead(session.user.id);

    // Revalidate notifications page
    revalidatePath('/notifications');

    return {
      success: true,
      message: `Marked ${updatedCount} notifications as read`,
      data: { updatedCount },
    };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return {
      success: false,
      message: 'Failed to mark all notifications as read',
    };
  }
}

/**
 * Bulk update notifications
 */
export async function bulkUpdateNotificationsAction(
  input: z.infer<typeof bulkUpdateNotificationsSchema>
): Promise<FormState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'Authentication required' };
    }

    // Validate input
    const validatedData = bulkUpdateNotificationsSchema.parse(input);

    const updatedCount = await bulkUpdateNotifications(
      validatedData.notificationIds,
      session.user.id,
      validatedData.action
    );

    // Revalidate notifications page
    revalidatePath('/notifications');

    return {
      success: true,
      message: `Successfully ${validatedData.action.replace('_', ' ')} ${updatedCount} notifications`,
      data: { updatedCount },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Invalid input data',
        errors: error.flatten().fieldErrors,
      };
    }

    console.error('Error bulk updating notifications:', error);
    return {
      success: false,
      message: 'Failed to update notifications',
    };
  }
}

/**
 * Delete a notification
 */
export async function deleteNotificationAction(notificationId: string): Promise<FormState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'Authentication required' };
    }

    const success = await deleteNotification(notificationId, session.user.id);

    if (!success) {
      return { success: false, message: 'Notification not found or access denied' };
    }

    // Revalidate notifications page
    revalidatePath('/notifications');

    return {
      success: true,
      message: 'Notification deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return {
      success: false,
      message: 'Failed to delete notification',
    };
  }
}

/**
 * Get unread notifications count
 */
export async function getUnreadNotificationsCountAction(): Promise<FormState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'Authentication required' };
    }

    const count = await getUnreadNotificationsCount(session.user.id);

    return {
      success: true,
      message: 'Unread count retrieved successfully',
      data: { count },
    };
  } catch (error) {
    console.error('Error getting unread count:', error);
    return {
      success: false,
      message: 'Failed to get unread count',
    };
  }
}

/**
 * Get notification statistics
 */
export async function getUserNotificationStatsAction(): Promise<FormState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'Authentication required' };
    }

    const stats = await getUserNotificationStats(session.user.id);

    return {
      success: true,
      message: 'Statistics retrieved successfully',
      data: stats,
    };
  } catch (error) {
    console.error('Error getting notification stats:', error);
    return {
      success: false,
      message: 'Failed to get notification statistics',
    };
  }
}

// ====================
// NOTIFICATION PREFERENCES ACTIONS
// ====================

/**
 * Get user notification preferences
 */
export async function getUserNotificationPreferencesAction(): Promise<FormState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'Authentication required' };
    }

    const preferences = await getUserNotificationPreferences(session.user.id);

    return {
      success: true,
      message: 'Preferences retrieved successfully',
      data: preferences,
    };
  } catch (error) {
    console.error('Error getting notification preferences:', error);
    return {
      success: false,
      message: 'Failed to get notification preferences',
    };
  }
}

/**
 * Update user notification preferences
 */
export async function updateUserNotificationPreferencesAction(
  input: z.infer<typeof updateNotificationPreferencesSchema>
): Promise<FormState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'Authentication required' };
    }

    // Validate input
    const validatedData = updateNotificationPreferencesSchema.parse(input);

    const preferences = await updateUserNotificationPreferences(
      session.user.id,
      validatedData
    );

    if (!preferences) {
      return { success: false, message: 'Failed to update preferences' };
    }

    // Revalidate notifications preferences page
    revalidatePath('/notifications/preferences');

    return {
      success: true,
      message: 'Notification preferences updated successfully',
      data: preferences,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Invalid preference data',
        errors: error.flatten().fieldErrors,
      };
    }

    console.error('Error updating notification preferences:', error);
    return {
      success: false,
      message: 'Failed to update notification preferences',
    };
  }
}

// ====================
// NOTIFICATION TEMPLATES ACTIONS (Admin only)
// ====================

/**
 * Create notification template (Admin only)
 */
export async function createNotificationTemplateAction(
  input: z.infer<typeof notificationTemplateSchema>
): Promise<FormState> {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return { success: false, message: 'Admin access required' };
    }

    // Validate input
    const validatedData = notificationTemplateSchema.parse(input);

    const template = await createNotificationTemplate(validatedData);

    // Revalidate admin templates page
    revalidatePath('/admin/notifications/templates');

    return {
      success: true,
      message: 'Notification template created successfully',
      data: template,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Invalid template data',
        errors: error.flatten().fieldErrors,
      };
    }

    console.error('Error creating notification template:', error);
    return {
      success: false,
      message: 'Failed to create notification template',
    };
  }
}

/**
 * Get all notification templates (Admin only)
 */
export async function getAllNotificationTemplatesAction(activeOnly: boolean = false): Promise<FormState> {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return { success: false, message: 'Admin access required' };
    }

    const templates = await getAllNotificationTemplates(activeOnly);

    return {
      success: true,
      message: 'Templates retrieved successfully',
      data: templates,
    };
  } catch (error) {
    console.error('Error getting notification templates:', error);
    return {
      success: false,
      message: 'Failed to get notification templates',
    };
  }
}

/**
 * Update notification template (Admin only)
 */
export async function updateNotificationTemplateAction(
  templateId: string,
  input: z.infer<typeof updateNotificationTemplateSchema>
): Promise<FormState> {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return { success: false, message: 'Admin access required' };
    }

    // Validate input
    const validatedData = updateNotificationTemplateSchema.parse(input);

    const template = await updateNotificationTemplate(templateId, validatedData);

    if (!template) {
      return { success: false, message: 'Template not found' };
    }

    // Revalidate admin templates page
    revalidatePath('/admin/notifications/templates');

    return {
      success: true,
      message: 'Notification template updated successfully',
      data: template,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Invalid template data',
        errors: error.flatten().fieldErrors,
      };
    }

    console.error('Error updating notification template:', error);
    return {
      success: false,
      message: 'Failed to update notification template',
    };
  }
}

/**
 * Delete notification template (Admin only)
 */
export async function deleteNotificationTemplateAction(templateId: string): Promise<FormState> {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return { success: false, message: 'Admin access required' };
    }

    const success = await deleteNotificationTemplate(templateId);

    if (!success) {
      return { success: false, message: 'Template not found' };
    }

    // Revalidate admin templates page
    revalidatePath('/admin/notifications/templates');

    return {
      success: true,
      message: 'Notification template deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting notification template:', error);
    return {
      success: false,
      message: 'Failed to delete notification template',
    };
  }
}

// ====================
// UTILITY ACTIONS
// ====================

/**
 * Get single notification details
 */
export async function getNotificationByIdAction(notificationId: string): Promise<FormState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'Authentication required' };
    }

    const notification = await getNotificationById(notificationId, session.user.id);

    if (!notification) {
      return { success: false, message: 'Notification not found or access denied' };
    }

    return {
      success: true,
      message: 'Notification retrieved successfully',
      data: notification,
    };
  } catch (error) {
    console.error('Error getting notification:', error);
    return {
      success: false,
      message: 'Failed to get notification',
    };
  }
}