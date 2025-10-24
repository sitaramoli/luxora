'use server';

import { db } from '@/database/drizzle';
import { orders, orderItems, products, users, merchants } from '@/database/schema';
import { desc, eq, and, like, sql, ilike, asc } from 'drizzle-orm';

// Customer order services
export const getUserRecentOrders = async (userId: string) => {
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .limit(5)
    .orderBy(desc(orders.createdAt));
};

export const getUsersAllOrders = async (userId: string) => {
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
};

// Merchant order services
export const getMerchantOrders = async (
  merchantId: string,
  filters?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }
) => {
  const { status, search, limit = 50, offset = 0 } = filters || {};

  const query = db
    .select({
      id: orders.id,
      total: orders.total,
      status: orders.status,
      shippingAddress: orders.shippingAddress,
      paymentMethod: orders.paymentMethod,
      paymentId: orders.paymentId,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      customer: {
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        phone: users.phone,
      },
      orderItems: sql`
        COALESCE(
          json_agg(
            json_build_object(
              'id', ${orderItems.id},
              'quantity', ${orderItems.quantity},
              'price', ${orderItems.price},
              'total', ${orderItems.total},
              'color', ${orderItems.color},
              'size', ${orderItems.size},
              'product', json_build_object(
                'id', ${products.id},
                'name', ${products.name},
                'sku', ${products.sku}
              )
            )
          ) FILTER (WHERE ${orderItems.id} IS NOT NULL),
          '[]'::json
        )
      `,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .leftJoin(products, sql`${orderItems.productId}::integer = ${products.id}`)
    .where(
      and(
        eq(orderItems.brandId, merchantId),
        status ? eq(orders.status, status as any) : undefined,
        search
          ? sql`(
              ${orders.id} ILIKE ${`%${search}%`} OR
              ${users.fullName} ILIKE ${`%${search}%`} OR
              ${users.email} ILIKE ${`%${search}%`}
            )`
          : undefined
      )
    )
    .groupBy(
      orders.id,
      orders.total,
      orders.status,
      orders.shippingAddress,
      orders.paymentMethod,
      orders.paymentId,
      orders.createdAt,
      orders.updatedAt,
      users.id,
      users.fullName,
      users.email,
      users.phone
    )
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset);

  return query;
};

export const getMerchantOrderById = async (merchantId: string, orderId: string) => {
  const result = await db
    .select({
      id: orders.id,
      total: orders.total,
      status: orders.status,
      shippingAddress: orders.shippingAddress,
      paymentMethod: orders.paymentMethod,
      paymentId: orders.paymentId,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      customer: {
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        phone: users.phone,
      },
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .where(
      and(
        eq(orders.id, orderId),
        eq(orderItems.brandId, merchantId)
      )
    )
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  // Get order items separately for better structure
  const items = await db
    .select({
      id: orderItems.id,
      quantity: orderItems.quantity,
      price: orderItems.price,
      total: orderItems.total,
      color: orderItems.color,
      size: orderItems.size,
      product: {
        id: products.id,
        name: products.name,
        sku: products.sku,
        images: products.images,
      },
    })
    .from(orderItems)
    .leftJoin(products, sql`${orderItems.productId}::integer = ${products.id}`)
    .where(
      and(
        eq(orderItems.orderId, orderId),
        eq(orderItems.brandId, merchantId)
      )
    );

  return {
    ...result[0],
    items,
  };
};

export const updateOrderStatus = async (
  merchantId: string,
  orderId: string,
  newStatus: string
) => {
  try {
    // First verify this order belongs to the merchant
    const orderExists = await db
      .select({ id: orders.id })
      .from(orders)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(
        and(
          eq(orders.id, orderId),
          eq(orderItems.brandId, merchantId)
        )
      )
      .limit(1);

    if (orderExists.length === 0) {
      return {
        success: false,
        error: 'Order not found or access denied',
      };
    }

    // Update the order status
    await db
      .update(orders)
      .set({
        status: newStatus as any,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    return {
      success: true,
      message: 'Order status updated successfully',
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      success: false,
      error: 'Failed to update order status',
    };
  }
};

export const getMerchantOrderStats = async (merchantId: string) => {
  try {
    const stats = await db
      .select({
        totalOrders: sql<number>`COUNT(DISTINCT ${orders.id})`
          .mapWith(Number),
        totalRevenue: sql<number>`COALESCE(SUM(${orderItems.total}), 0)`
          .mapWith(Number),
        pendingOrders: sql<number>`
          COUNT(DISTINCT CASE WHEN ${orders.status} = 'PENDING' THEN ${orders.id} END)
        `
          .mapWith(Number),
        processingOrders: sql<number>`
          COUNT(DISTINCT CASE WHEN ${orders.status} = 'PROCESSING' THEN ${orders.id} END)
        `
          .mapWith(Number),
        shippedOrders: sql<number>`
          COUNT(DISTINCT CASE WHEN ${orders.status} = 'SHIPPED' THEN ${orders.id} END)
        `
          .mapWith(Number),
        deliveredOrders: sql<number>`
          COUNT(DISTINCT CASE WHEN ${orders.status} = 'DELIVERED' THEN ${orders.id} END)
        `
          .mapWith(Number),
        cancelledOrders: sql<number>`
          COUNT(DISTINCT CASE WHEN ${orders.status} = 'CANCELLED' THEN ${orders.id} END)
        `
          .mapWith(Number),
      })
      .from(orders)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(eq(orderItems.brandId, merchantId))
      .groupBy(/* no grouping needed for aggregates */);

    return stats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      processingOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
    };
  } catch (error) {
    console.error('Error fetching merchant order stats:', error);
    return {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      processingOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
    };
  }
};

// Export order data for CSV/Excel
export const exportMerchantOrders = async (
  merchantId: string,
  filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }
) => {
  const { status, startDate, endDate } = filters || {};

  const conditions = [
    eq(orderItems.brandId, merchantId),
    status ? eq(orders.status, status as any) : undefined,
    startDate ? sql`${orders.createdAt} >= ${startDate}` : undefined,
    endDate ? sql`${orders.createdAt} <= ${endDate}` : undefined,
  ].filter(Boolean);

  return db
    .select({
      orderId: orders.id,
      orderDate: orders.createdAt,
      customerName: users.fullName,
      customerEmail: users.email,
      status: orders.status,
      total: orders.total,
      paymentMethod: orders.paymentMethod,
      shippingAddress: orders.shippingAddress,
      productName: products.name,
      productSku: products.sku,
      quantity: orderItems.quantity,
      itemPrice: orderItems.price,
      itemTotal: orderItems.total,
      size: orderItems.size,
      color: orderItems.color,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .leftJoin(products, sql`${orderItems.productId}::integer = ${products.id}`)
    .where(and(...conditions))
    .orderBy(desc(orders.createdAt));
};
