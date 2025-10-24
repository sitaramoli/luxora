'use server';

import { auth } from '@/auth';
import { getUserData, getPreferences } from '@/lib/services/users';
import { getUserRecentOrders } from '@/lib/services/orders';
import { redirect } from 'next/navigation';

export async function getEditProfileData() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    const [user, preferences] = await Promise.all([
      getUserData(session.user.id),
      getPreferences(session.user.id),
    ]);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      success: true,
      data: {
        user,
        preferences,
      },
    };
  } catch (error) {
    console.error('Error fetching edit profile data:', error);
    return {
      success: false,
      error: 'Failed to fetch profile data',
    };
  }
}

export async function getProfileDataAndRecentOrders() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    const [userProfile, recentOrders] = await Promise.all([
      getUserData(session.user.id),
      getUserRecentOrders(session.user.id),
    ]);

    if (!userProfile) {
      throw new Error('User not found');
    }

    // Calculate account stats
    const totalOrders = recentOrders.length;
    const totalSpent = recentOrders.reduce((sum, order) => {
      return sum + parseFloat(order.total.toString());
    }, 0);

    const accountStats = {
      totalOrders,
      totalSpent,
    };

    return {
      success: true,
      data: {
        userProfile,
        recentOrders,
        accountStats,
      },
    };
  } catch (error) {
    console.error('Error fetching profile data and recent orders:', error);
    return {
      success: false,
      error: 'Failed to fetch profile data',
    };
  }
}

export async function getUserProfileData() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    const userProfile = await getUserData(session.user.id);

    if (!userProfile) {
      throw new Error('User not found');
    }

    return {
      success: true,
      data: userProfile,
    };
  } catch (error) {
    console.error('Error fetching user profile data:', error);
    return {
      success: false,
      error: 'Failed to fetch user profile',
    };
  }
}