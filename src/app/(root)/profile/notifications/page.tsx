import { redirect } from 'next/navigation';
import React from 'react';

import { auth } from '@/auth';
import {
  getUserNotificationsAction,
  getUserNotificationPreferencesAction,
} from '@/lib/actions/notifications';

import NotificationsClient from './notifications-client';

interface NotificationsPageProps {
  searchParams: Promise<{
    page?: string;
    type?: string;
    status?: string;
  }>;
}

export default async function NotificationsPage({
  searchParams,
}: NotificationsPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  // Await and parse search params for pagination and filtering
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  // Fetch notifications and preferences in parallel
  const [notificationsResult, preferencesResult] = await Promise.all([
    getUserNotificationsAction({
      limit,
      offset,
      type: params.type as any,
      status: params.status as any,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    }),
    getUserNotificationPreferencesAction(),
  ]);

  // Handle errors
  if (!notificationsResult.success) {
    console.error(
      'Failed to fetch notifications:',
      notificationsResult.message
    );
  }

  if (!preferencesResult.success) {
    console.error('Failed to fetch preferences:', preferencesResult.message);
  }

  // Pass data to client component
  return (
    <NotificationsClient
      initialNotifications={
        notificationsResult.data || {
          notifications: [],
          totalCount: 0,
          hasMore: false,
        }
      }
      initialPreferences={preferencesResult.data}
      searchParams={params}
      userId={session.user.id}
    />
  );
}
