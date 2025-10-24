'use server';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import {
  getMerchantDashboardStats,
  getMerchantRecentOrders,
  getMerchantTopProducts,
  getMerchantChartData,
  getMerchantInfo,
  getMerchantActivityFeed,
  type DashboardStats,
  type RecentOrder,
  type TopProduct,
  type ChartData,
  type ActivityItem,
} from '@/lib/services/merchant-dashboard';

/**
 * Get complete dashboard data for authenticated merchant
 */
export async function getDashboardDataAction(): Promise<{
  success: boolean;
  data?: {
    stats: DashboardStats;
    recentOrders: RecentOrder[];
    topProducts: TopProduct[];
    chartData: ChartData;
    activityFeed: ActivityItem[];
    merchantInfo: {
      name: string;
      email: string;
      category: string;
      status: string;
      createdAt: Date;
    } | null;
  };
  error?: string;
}> {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/sign-in');
  }

  try {
    const [stats, recentOrders, topProducts, chartData, activityFeed, merchantInfo] = await Promise.all([
      getMerchantDashboardStats(session.user.merchantId),
      getMerchantRecentOrders(session.user.merchantId, 5),
      getMerchantTopProducts(session.user.merchantId, 5),
      getMerchantChartData(session.user.merchantId),
      getMerchantActivityFeed(session.user.merchantId, 10),
      getMerchantInfo(session.user.merchantId),
    ]);

    return {
      success: true,
      data: {
        stats,
        recentOrders,
        topProducts,
        chartData,
        activityFeed,
        merchantInfo,
      },
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      success: false,
      error: 'Failed to load dashboard data',
    };
  }
}

/**
 * Get dashboard statistics for authenticated merchant
 */
export async function getDashboardStatsAction(): Promise<{
  success: boolean;
  data?: DashboardStats;
  error?: string;
}> {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/sign-in');
  }

  try {
    const stats = await getMerchantDashboardStats(session.user.merchantId);
    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      success: false,
      error: 'Failed to load dashboard statistics',
    };
  }
}

/**
 * Get recent orders for authenticated merchant
 */
export async function getRecentOrdersAction(limit: number = 5): Promise<{
  success: boolean;
  data?: RecentOrder[];
  error?: string;
}> {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/sign-in');
  }

  try {
    const recentOrders = await getMerchantRecentOrders(session.user.merchantId, limit);
    return {
      success: true,
      data: recentOrders,
    };
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    return {
      success: false,
      error: 'Failed to load recent orders',
    };
  }
}

/**
 * Get top products for authenticated merchant
 */
export async function getTopProductsAction(limit: number = 5): Promise<{
  success: boolean;
  data?: TopProduct[];
  error?: string;
}> {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/sign-in');
  }

  try {
    const topProducts = await getMerchantTopProducts(session.user.merchantId, limit);
    return {
      success: true,
      data: topProducts,
    };
  } catch (error) {
    console.error('Error fetching top products:', error);
    return {
      success: false,
      error: 'Failed to load top products',
    };
  }
}

/**
 * Get chart data for authenticated merchant
 */
export async function getChartDataAction(): Promise<{
  success: boolean;
  data?: ChartData;
  error?: string;
}> {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/sign-in');
  }

  try {
    const chartData = await getMerchantChartData(session.user.merchantId);
    return {
      success: true,
      data: chartData,
    };
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return {
      success: false,
      error: 'Failed to load chart data',
    };
  }
}

/**
 * Get merchant activity feed for authenticated merchant
 */
export async function getMerchantActivityAction(limit: number = 10): Promise<{
  success: boolean;
  data?: ActivityItem[];
  error?: string;
}> {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/sign-in');
  }

  try {
    const activityFeed = await getMerchantActivityFeed(session.user.merchantId, limit);
    return {
      success: true,
      data: activityFeed,
    };
  } catch (error) {
    console.error('Error fetching merchant activity feed:', error);
    return {
      success: false,
      error: 'Failed to load activity feed',
    };
  }
}

/**
 * Get merchant info for authenticated merchant
 */
export async function getMerchantInfoAction() {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/sign-in');
  }

  try {
    const merchantInfo = await getMerchantInfo(session.user.merchantId);
    return {
      success: true,
      data: merchantInfo,
    };
  } catch (error) {
    console.error('Error fetching merchant info:', error);
    return {
      success: false,
      error: 'Failed to load merchant information',
    };
  }
}
