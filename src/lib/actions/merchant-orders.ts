'use server';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { 
  getMerchantOrders, 
  getMerchantOrderById, 
  updateOrderStatus,
  getMerchantOrderStats,
  exportMerchantOrders
} from '@/lib/services/orders';

export async function getMerchantOrdersAction(filters?: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/merchant');
  }

  try {
    const orders = await getMerchantOrders(session.user.merchantId, filters);
    return {
      success: true,
      data: orders,
    };
  } catch (error) {
    console.error('Error fetching merchant orders:', error);
    return {
      success: false,
      error: 'Failed to fetch orders',
    };
  }
}

export async function getMerchantOrderByIdAction(orderId: string) {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/merchant');
  }

  try {
    const order = await getMerchantOrderById(session.user.merchantId, orderId);
    
    if (!order) {
      return {
        success: false,
        error: 'Order not found',
      };
    }

    return {
      success: true,
      data: order,
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return {
      success: false,
      error: 'Failed to fetch order',
    };
  }
}

export async function updateOrderStatusAction(orderId: string, newStatus: string) {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/merchant');
  }

  try {
    const result = await updateOrderStatus(
      session.user.merchantId, 
      orderId, 
      newStatus
    );
    
    return result;
  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      success: false,
      error: 'Failed to update order status',
    };
  }
}

export async function getMerchantOrderStatsAction() {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/merchant');
  }

  try {
    const stats = await getMerchantOrderStats(session.user.merchantId);
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

export async function exportOrdersAction(filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/merchant');
  }

  try {
    const orders = await exportMerchantOrders(session.user.merchantId, filters);
    
    // Convert to CSV format
    if (orders.length === 0) {
      return {
        success: false,
        error: 'No orders found to export',
      };
    }

    const headers = [
      'Order ID',
      'Order Date', 
      'Customer Name',
      'Customer Email',
      'Status',
      'Total',
      'Payment Method',
      'Shipping Address',
      'Product Name',
      'Product SKU',
      'Quantity',
      'Item Price',
      'Item Total',
      'Size',
      'Color'
    ];

    const csvRows = [
      headers.join(','),
      ...orders.map(order => [
        order.orderId,
        new Date(order.orderDate!).toLocaleDateString(),
        order.customerName,
        order.customerEmail,
        order.status,
        order.total,
        order.paymentMethod || '',
        `"${order.shippingAddress}"`,
        order.productName,
        order.productSku,
        order.quantity,
        order.itemPrice,
        order.itemTotal,
        order.size || '',
        order.color || ''
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');

    return {
      success: true,
      data: {
        csv: csvContent,
        filename: `orders-export-${new Date().toISOString().split('T')[0]}.csv`
      },
    };
  } catch (error) {
    console.error('Error exporting orders:', error);
    return {
      success: false,
      error: 'Failed to export orders',
    };
  }
}