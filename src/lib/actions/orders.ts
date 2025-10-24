'use server';

import { auth } from '@/auth';
import { getUserRecentOrders } from '@/lib/services/orders';
import { redirect } from 'next/navigation';

export async function getAllUserOrders() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    // For now, we'll use getUserRecentOrders but this could be extended
    // to get all orders with pagination if needed
    const orders = await getUserRecentOrders(session.user.id);

    return {
      success: true,
      data: {
        orders,
      },
    };
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return {
      success: false,
      error: 'Failed to fetch orders',
    };
  }
}

export async function getOrderById(orderId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    // This would need to be implemented in the orders service
    // For now, return a placeholder
    return {
      success: false,
      error: 'Order details not implemented yet',
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return {
      success: false,
      error: 'Failed to fetch order details',
    };
  }
}

export async function getUserOrderStats() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    const orders = await getUserRecentOrders(session.user.id);
    
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'PENDING').length,
      processing: orders.filter(o => o.status === 'PROCESSING').length,
      shipped: orders.filter(o => o.status === 'SHIPPED').length,
      delivered: orders.filter(o => o.status === 'DELIVERED').length,
      cancelled: orders.filter(o => o.status === 'CANCELLED').length,
    };

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error('Error fetching order stats:', error);
    return {
      success: false,
      error: 'Failed to fetch order statistics',
    };
  }
}