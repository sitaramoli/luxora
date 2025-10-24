'use server';

import { db } from '@/database/drizzle';
import { orders, orderItems, products, users, merchants, reviews } from '@/database/schema';
import { eq, desc, sql, and, gte, lte, count } from 'drizzle-orm';

export interface DashboardStats {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    percentageChange: number;
  };
  orders: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    percentageChange: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  products: {
    total: number;
    active: number;
    outOfStock: number;
    lowStock: number;
  };
  rating: {
    average: number;
    totalReviews: number;
    distribution: {
      [key: number]: number;
    };
  };
  conversion: {
    rate: number;
    views: number;
    purchases: number;
  };
}

export interface RecentOrder {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  total: number;
  status: string;
  createdAt: Date;
  itemsCount: number;
  products: string[];
}

export interface TopProduct {
  id: number;
  name: string;
  totalSales: number;
  revenue: number;
  rating: number;
  reviewCount: number;
  image: string;
}

export interface ActivityItem {
  id: string;
  type: 'order' | 'product' | 'review' | 'inventory' | 'user' | 'success' | 'warning' | 'alert';
  title: string;
  description: string;
  timestamp: string;
  status: string;
  amount?: string;
  relatedId?: string;
  createdAt: Date;
}

export interface ChartData {
  revenueChart: {
    date: string;
    revenue: number;
    orders: number;
  }[];
  ordersChart: {
    date: string;
    orders: number;
    completed: number;
    pending: number;
  }[];
  salesDistribution: {
    category: string;
    value: number;
    color: string;
  }[];
}

/**
 * Get comprehensive dashboard statistics for a merchant
 */
export async function getMerchantDashboardStats(merchantId: string): Promise<DashboardStats> {
  try {
    // Get current date boundaries
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Revenue statistics
    const revenueStats = await db
      .select({
        totalRevenue: sql<number>`COALESCE(SUM(${orderItems.total}), 0)`.mapWith(Number),
        thisMonthRevenue: sql<number>`
          COALESCE(SUM(CASE 
            WHEN ${orders.createdAt} >= ${startOfThisMonth} 
            THEN ${orderItems.total} 
            ELSE 0 
          END), 0)
        `.mapWith(Number),
        lastMonthRevenue: sql<number>`
          COALESCE(SUM(CASE 
            WHEN ${orders.createdAt} >= ${startOfLastMonth} AND ${orders.createdAt} <= ${endOfLastMonth}
            THEN ${orderItems.total} 
            ELSE 0 
          END), 0)
        `.mapWith(Number),
      })
      .from(orders)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(eq(orderItems.brandId, merchantId))
      .groupBy();

    // Orders statistics
    const orderStats = await db
      .select({
        totalOrders: sql<number>`COUNT(DISTINCT ${orders.id})`.mapWith(Number),
        thisMonthOrders: sql<number>`
          COUNT(DISTINCT CASE 
            WHEN ${orders.createdAt} >= ${startOfThisMonth} 
            THEN ${orders.id} 
          END)
        `.mapWith(Number),
        lastMonthOrders: sql<number>`
          COUNT(DISTINCT CASE 
            WHEN ${orders.createdAt} >= ${startOfLastMonth} AND ${orders.createdAt} <= ${endOfLastMonth}
            THEN ${orders.id} 
          END)
        `.mapWith(Number),
        pendingOrders: sql<number>`
          COUNT(DISTINCT CASE WHEN ${orders.status} = 'PENDING' THEN ${orders.id} END)
        `.mapWith(Number),
        processingOrders: sql<number>`
          COUNT(DISTINCT CASE WHEN ${orders.status} = 'PROCESSING' THEN ${orders.id} END)
        `.mapWith(Number),
        shippedOrders: sql<number>`
          COUNT(DISTINCT CASE WHEN ${orders.status} = 'SHIPPED' THEN ${orders.id} END)
        `.mapWith(Number),
        deliveredOrders: sql<number>`
          COUNT(DISTINCT CASE WHEN ${orders.status} = 'DELIVERED' THEN ${orders.id} END)
        `.mapWith(Number),
        cancelledOrders: sql<number>`
          COUNT(DISTINCT CASE WHEN ${orders.status} = 'CANCELLED' THEN ${orders.id} END)
        `.mapWith(Number),
      })
      .from(orders)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(eq(orderItems.brandId, merchantId))
      .groupBy();

    // Products statistics
    const productStats = await db
      .select({
        totalProducts: sql<number>`COUNT(*)`.mapWith(Number),
        activeProducts: sql<number>`
          COUNT(CASE WHEN ${products.status} = 'ACTIVE' THEN 1 END)
        `.mapWith(Number),
        outOfStockProducts: sql<number>`
          COUNT(CASE WHEN ${products.stockCount} = 0 THEN 1 END)
        `.mapWith(Number),
        lowStockProducts: sql<number>`
          COUNT(CASE WHEN ${products.stockCount} > 0 AND ${products.stockCount} <= ${products.minStock} THEN 1 END)
        `.mapWith(Number),
      })
      .from(products)
      .where(eq(products.merchantId, merchantId))
      .groupBy();

    // Rating and reviews statistics
    const ratingStats = await db
      .select({
        averageRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`.mapWith(Number),
        totalReviews: sql<number>`COUNT(${reviews.id})`.mapWith(Number),
        rating5: sql<number>`COUNT(CASE WHEN ${reviews.rating} = 5 THEN 1 END)`.mapWith(Number),
        rating4: sql<number>`COUNT(CASE WHEN ${reviews.rating} = 4 THEN 1 END)`.mapWith(Number),
        rating3: sql<number>`COUNT(CASE WHEN ${reviews.rating} = 3 THEN 1 END)`.mapWith(Number),
        rating2: sql<number>`COUNT(CASE WHEN ${reviews.rating} = 2 THEN 1 END)`.mapWith(Number),
        rating1: sql<number>`COUNT(CASE WHEN ${reviews.rating} = 1 THEN 1 END)`.mapWith(Number),
      })
      .from(reviews)
      .leftJoin(products, eq(reviews.productId, products.id))
      .where(eq(products.merchantId, merchantId))
      .groupBy();

    // Calculate percentage changes
    const revenueChange = revenueStats[0]?.lastMonthRevenue
      ? ((revenueStats[0].thisMonthRevenue - revenueStats[0].lastMonthRevenue) / revenueStats[0].lastMonthRevenue) * 100
      : 0;

    const ordersChange = orderStats[0]?.lastMonthOrders
      ? ((orderStats[0].thisMonthOrders - orderStats[0].lastMonthOrders) / orderStats[0].lastMonthOrders) * 100
      : 0;

    // Mock conversion data (you can implement proper tracking later)
    const conversionRate = 3.2;
    const views = Math.round((orderStats[0]?.totalOrders || 0) / (conversionRate / 100));

    return {
      revenue: {
        total: revenueStats[0]?.totalRevenue || 0,
        thisMonth: revenueStats[0]?.thisMonthRevenue || 0,
        lastMonth: revenueStats[0]?.lastMonthRevenue || 0,
        percentageChange: revenueChange,
      },
      orders: {
        total: orderStats[0]?.totalOrders || 0,
        thisMonth: orderStats[0]?.thisMonthOrders || 0,
        lastMonth: orderStats[0]?.lastMonthOrders || 0,
        percentageChange: ordersChange,
        pending: orderStats[0]?.pendingOrders || 0,
        processing: orderStats[0]?.processingOrders || 0,
        shipped: orderStats[0]?.shippedOrders || 0,
        delivered: orderStats[0]?.deliveredOrders || 0,
        cancelled: orderStats[0]?.cancelledOrders || 0,
      },
      products: {
        total: productStats[0]?.totalProducts || 0,
        active: productStats[0]?.activeProducts || 0,
        outOfStock: productStats[0]?.outOfStockProducts || 0,
        lowStock: productStats[0]?.lowStockProducts || 0,
      },
      rating: {
        average: Math.round((ratingStats[0]?.averageRating || 0) * 10) / 10,
        totalReviews: ratingStats[0]?.totalReviews || 0,
        distribution: {
          5: ratingStats[0]?.rating5 || 0,
          4: ratingStats[0]?.rating4 || 0,
          3: ratingStats[0]?.rating3 || 0,
          2: ratingStats[0]?.rating2 || 0,
          1: ratingStats[0]?.rating1 || 0,
        },
      },
      conversion: {
        rate: conversionRate,
        views: views,
        purchases: orderStats[0]?.totalOrders || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching merchant dashboard stats:', error);
    // Return default stats on error
    return {
      revenue: { total: 0, thisMonth: 0, lastMonth: 0, percentageChange: 0 },
      orders: { total: 0, thisMonth: 0, lastMonth: 0, percentageChange: 0, pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 },
      products: { total: 0, active: 0, outOfStock: 0, lowStock: 0 },
      rating: { average: 0, totalReviews: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } },
      conversion: { rate: 0, views: 0, purchases: 0 },
    };
  }
}

/**
 * Get recent orders for merchant dashboard
 */
export async function getMerchantRecentOrders(merchantId: string, limit: number = 5): Promise<RecentOrder[]> {
  try {
    const recentOrders = await db
      .select({
        id: orders.id,
        customerName: users.fullName,
        customerEmail: users.email,
        total: orders.total,
        status: orders.status,
        createdAt: orders.createdAt,
        orderItems: sql`
          COALESCE(
            json_agg(
              json_build_object(
                'productName', ${products.name},
                'quantity', ${orderItems.quantity}
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
      .where(eq(orderItems.brandId, merchantId))
      .groupBy(orders.id, users.fullName, users.email, orders.total, orders.status, orders.createdAt)
      .orderBy(desc(orders.createdAt))
      .limit(limit);

    return recentOrders.map(order => ({
      id: order.id,
      customer: {
        name: order.customerName || 'Guest',
        email: order.customerEmail || '',
      },
      total: typeof order.total === 'string' ? parseFloat(order.total) : (order.total || 0),
      status: order.status,
      createdAt: order.createdAt || new Date(),
      itemsCount: Array.isArray(order.orderItems) ? order.orderItems.length : 0,
      products: Array.isArray(order.orderItems) 
        ? order.orderItems.map((item: any) => item.productName).filter(Boolean)
        : [],
    }));
  } catch (error) {
    console.error('Error fetching merchant recent orders:', error);
    return [];
  }
}

/**
 * Get top performing products for merchant dashboard
 */
export async function getMerchantTopProducts(merchantId: string, limit: number = 5): Promise<TopProduct[]> {
  try {
    const topProducts = await db
      .select({
        id: products.id,
        name: products.name,
        image: products.images,
        totalSales: sql<number>`COALESCE(SUM(${orderItems.quantity}), 0)`.mapWith(Number),
        revenue: sql<number>`COALESCE(SUM(${orderItems.total}), 0)`.mapWith(Number),
        averageRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`.mapWith(Number),
        reviewCount: sql<number>`COUNT(${reviews.id})`.mapWith(Number),
      })
      .from(products)
      .leftJoin(orderItems, sql`${products.id} = ${orderItems.productId}::integer`)
      .leftJoin(reviews, eq(products.id, reviews.productId))
      .where(eq(products.merchantId, merchantId))
      .groupBy(products.id, products.name, products.images)
      .orderBy(desc(sql`COALESCE(SUM(${orderItems.total}), 0)`))
      .limit(limit);

    return topProducts.map(product => ({
      id: product.id,
      name: product.name,
      totalSales: product.totalSales,
      revenue: product.revenue,
      rating: Math.round(product.averageRating * 10) / 10,
      reviewCount: product.reviewCount,
      image: Array.isArray(product.image) ? product.image[0] || '' : '',
    }));
  } catch (error) {
    console.error('Error fetching merchant top products:', error);
    return [];
  }
}

/**
 * Get chart data for merchant dashboard
 */
export async function getMerchantChartData(merchantId: string): Promise<ChartData> {
  try {
    // Get last 30 days of revenue and orders data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyStats = await db
      .select({
        date: sql<string>`DATE(${orders.createdAt})`,
        revenue: sql<number>`COALESCE(SUM(${orderItems.total}), 0)`.mapWith(Number),
        orders: sql<number>`COUNT(DISTINCT ${orders.id})`.mapWith(Number),
        completed: sql<number>`
          COUNT(DISTINCT CASE WHEN ${orders.status} IN ('DELIVERED') THEN ${orders.id} END)
        `.mapWith(Number),
        pending: sql<number>`
          COUNT(DISTINCT CASE WHEN ${orders.status} IN ('PENDING', 'PROCESSING') THEN ${orders.id} END)
        `.mapWith(Number),
      })
      .from(orders)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(
        and(
          eq(orderItems.brandId, merchantId),
          gte(orders.createdAt, thirtyDaysAgo)
        )
      )
      .groupBy(sql`DATE(${orders.createdAt})`)
      .orderBy(sql`DATE(${orders.createdAt})`);

    // Get product categories distribution
    const categoryDistribution = await db
      .select({
        category: products.category,
        value: sql<number>`COUNT(*)`.mapWith(Number),
      })
      .from(products)
      .where(eq(products.merchantId, merchantId))
      .groupBy(products.category)
      .orderBy(desc(sql`COUNT(*)`));

    // Generate colors for categories
    const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

    return {
      revenueChart: dailyStats.map(stat => ({
        date: stat.date,
        revenue: stat.revenue,
        orders: stat.orders,
      })),
      ordersChart: dailyStats.map(stat => ({
        date: stat.date,
        orders: stat.orders,
        completed: stat.completed,
        pending: stat.pending,
      })),
      salesDistribution: categoryDistribution.map((cat, index) => ({
        category: cat.category,
        value: cat.value,
        color: colors[index % colors.length],
      })),
    };
  } catch (error) {
    console.error('Error fetching merchant chart data:', error);
    return {
      revenueChart: [],
      ordersChart: [],
      salesDistribution: [],
    };
  }
}

/**
 * Get merchant basic info
 */
export async function getMerchantInfo(merchantId: string) {
  try {
    const merchant = await db
      .select({
        name: merchants.name,
        email: merchants.email,
        category: merchants.category,
        status: merchants.status,
        createdAt: merchants.createdAt,
      })
      .from(merchants)
      .where(eq(merchants.id, merchantId))
      .limit(1);

    return merchant[0] || null;
  } catch (error) {
    console.error('Error fetching merchant info:', error);
    return null;
  }
}

/**
 * Get merchant activity feed with recent events
 */
export async function getMerchantActivityFeed(merchantId: string, limit: number = 10): Promise<ActivityItem[]> {
  try {
    const activities: ActivityItem[] = [];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get recent orders
    const recentOrderActivity = await db
      .select({
        id: orders.id,
        status: orders.status,
        total: orders.total,
        createdAt: orders.createdAt,
        customerName: users.fullName,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(
        and(
          eq(orderItems.brandId, merchantId),
          gte(orders.createdAt, sevenDaysAgo)
        )
      )
      .groupBy(orders.id, users.fullName, orders.status, orders.total, orders.createdAt)
      .orderBy(desc(orders.createdAt))
      .limit(5);

    // Convert orders to activity items
    recentOrderActivity.forEach(order => {
      const isNewOrder = order.status === 'PENDING' || order.status === 'PROCESSING';
      const isCompletedOrder = order.status === 'DELIVERED';
      
      activities.push({
        id: `order-${order.id}`,
        type: 'order',
        title: isNewOrder ? 'New order received' : 
               isCompletedOrder ? 'Order completed' : 
               `Order ${order.status.toLowerCase()}`,
        description: `Order #${order.id.slice(-8)} ${order.customerName ? `from ${order.customerName}` : 'from customer'}`,
        timestamp: getRelativeTime(order.createdAt),
        status: order.status,
        amount: `$${order.total ? parseFloat(order.total.toString()).toFixed(2) : '0.00'}`,
        relatedId: order.id,
        createdAt: order.createdAt || new Date(),
      });
    });

    // Get recent product updates
    const recentProducts = await db
      .select({
        id: products.id,
        name: products.name,
        status: products.status,
        stockCount: products.stockCount,
        minStock: products.minStock,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .where(
        and(
          eq(products.merchantId, merchantId),
          gte(products.updatedAt, sevenDaysAgo)
        )
      )
      .orderBy(desc(products.updatedAt))
      .limit(3);

    // Convert products to activity items
    recentProducts.forEach(product => {
      const isLowStock = product.stockCount <= (product.minStock || 5);
      const isNewProduct = product.createdAt && product.updatedAt && 
        Math.abs(product.createdAt.getTime() - product.updatedAt.getTime()) < 60000; // Within 1 minute
      
      if (isLowStock) {
        activities.push({
          id: `inventory-${product.id}`,
          type: 'warning',
          title: 'Low stock alert',
          description: `${product.name} is running low on inventory (${product.stockCount} left)`,
          timestamp: getRelativeTime(product.updatedAt),
          status: 'Alert',
          relatedId: product.id.toString(),
          createdAt: product.updatedAt || new Date(),
        });
      } else if (isNewProduct) {
        activities.push({
          id: `product-new-${product.id}`,
          type: 'success',
          title: 'Product added',
          description: `${product.name} has been added to your inventory`,
          timestamp: getRelativeTime(product.createdAt),
          status: product.status === 'ACTIVE' ? 'Live' : 'Draft',
          relatedId: product.id.toString(),
          createdAt: product.createdAt || new Date(),
        });
      } else {
        activities.push({
          id: `product-update-${product.id}`,
          type: 'product',
          title: 'Product updated',
          description: `${product.name} has been updated`,
          timestamp: getRelativeTime(product.updatedAt),
          status: product.status === 'ACTIVE' ? 'Live' : 'Draft',
          relatedId: product.id.toString(),
          createdAt: product.updatedAt || new Date(),
        });
      }
    });

    // Get recent reviews for merchant's products
    const recentReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        productName: products.name,
        customerName: users.fullName,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .leftJoin(products, eq(reviews.productId, products.id))
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(
        and(
          eq(products.merchantId, merchantId),
          gte(reviews.createdAt, sevenDaysAgo)
        )
      )
      .orderBy(desc(reviews.createdAt))
      .limit(3);

    // Convert reviews to activity items
    recentReviews.forEach(review => {
      activities.push({
        id: `review-${review.id}`,
        type: 'user',
        title: 'New customer review',
        description: `${review.rating}-star review ${review.customerName ? `from ${review.customerName}` : 'received'} for ${review.productName}`,
        timestamp: getRelativeTime(review.createdAt),
        status: 'Published',
        relatedId: review.id.toString(),
        createdAt: review.createdAt || new Date(),
      });
    });

    // Sort all activities by creation date and limit results
    return activities
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
      
  } catch (error) {
    console.error('Error fetching merchant activity feed:', error);
    return [];
  }
}

/**
 * Helper function to get relative time string
 */
function getRelativeTime(date: Date | null): string {
  if (!date) return 'Unknown';
  
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 60) {
    return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  } else {
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  }
}
