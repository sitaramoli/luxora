// Dashboard data constants for charts and analytics

// Revenue data for charts
export const revenueData = [
  { month: 'Jan', revenue: 45000, orders: 120, customers: 89 },
  { month: 'Feb', revenue: 52000, orders: 135, customers: 95 },
  { month: 'Mar', revenue: 48000, orders: 128, customers: 92 },
  { month: 'Apr', revenue: 61000, orders: 155, customers: 110 },
  { month: 'May', revenue: 55000, orders: 142, customers: 98 },
  { month: 'Jun', revenue: 67000, orders: 168, customers: 125 },
  { month: 'Jul', revenue: 72000, orders: 180, customers: 135 },
  { month: 'Aug', revenue: 69000, orders: 175, customers: 128 },
  { month: 'Sep', revenue: 75000, orders: 190, customers: 142 },
  { month: 'Oct', revenue: 82000, orders: 205, customers: 158 },
  { month: 'Nov', revenue: 78000, orders: 195, customers: 148 },
  { month: 'Dec', revenue: 85000, orders: 215, customers: 165 },
];

// Orders data for charts
export const ordersData = [
  { day: 'Mon', orders: 45, completed: 42, pending: 3 },
  { day: 'Tue', orders: 52, completed: 48, pending: 4 },
  { day: 'Wed', orders: 38, completed: 35, pending: 3 },
  { day: 'Thu', orders: 61, completed: 58, pending: 3 },
  { day: 'Fri', orders: 55, completed: 52, pending: 3 },
  { day: 'Sat', orders: 48, completed: 45, pending: 3 },
  { day: 'Sun', orders: 42, completed: 40, pending: 2 },
];

// Sales distribution data
export const salesDistributionData = [
  { category: 'Fashion', value: 35, color: '#3B82F6' },
  { category: 'Jewelry', value: 25, color: '#8B5CF6' },
  { category: 'Watches', value: 20, color: '#10B981' },
  { category: 'Accessories', value: 15, color: '#F59E0B' },
  { category: 'Beauty', value: 5, color: '#EF4444' },
];

// Top products data
export const topProductsData = [
  { name: 'Diamond Ring', sales: 45, revenue: 125000 },
  { name: 'Luxury Watch', sales: 38, revenue: 95000 },
  { name: 'Designer Bag', sales: 32, revenue: 78000 },
  { name: 'Gold Necklace', sales: 28, revenue: 65000 },
  { name: 'Silk Scarf', sales: 25, revenue: 45000 },
];

// Performance metrics data
export const performanceMetricsData = [
  { metric: 'Revenue Target', value: 85, target: 100 },
  { metric: 'Order Fulfillment', value: 92, target: 100 },
  { metric: 'Customer Satisfaction', value: 96, target: 100 },
  { metric: 'Inventory Turnover', value: 78, target: 100 },
];

// Customer satisfaction data
export const customerSatisfactionData = [
  { rating: '5 Stars', count: 245, percentage: 68 },
  { rating: '4 Stars', count: 89, percentage: 25 },
  { rating: '3 Stars', count: 18, percentage: 5 },
  { rating: '2 Stars', count: 6, percentage: 2 },
  { rating: '1 Star', count: 2, percentage: 1 },
];

// Growth trend data
export const growthTrendData = [
  { period: 'Q1', growth: 15, previous: 12 },
  { period: 'Q2', growth: 23, previous: 18 },
  { period: 'Q3', growth: 31, previous: 25 },
  { period: 'Q4', growth: 28, previous: 22 },
];

// Activity feed data
export const adminActivityData = [
  {
    id: '1',
    type: 'user' as const,
    title: 'New merchant application',
    description: 'Luxury Timepieces Co. has submitted their application',
    timestamp: '2 hours ago',
    status: 'Pending',
    user: 'System',
  },
  {
    id: '2',
    type: 'order' as const,
    title: 'High-value order completed',
    description: 'Order #ORD-001 for $2,850 has been successfully completed',
    timestamp: '4 hours ago',
    status: 'Completed',
    amount: '$2,850',
  },
  {
    id: '3',
    type: 'alert' as const,
    title: 'Product review flagged',
    description: 'Review for Diamond Necklace requires moderation',
    timestamp: '6 hours ago',
    status: 'Under Review',
  },
  {
    id: '4',
    type: 'success' as const,
    title: 'New luxury brand verified',
    description: 'Cartier has been successfully verified and activated',
    timestamp: '1 day ago',
    status: 'Verified',
  },
  {
    id: '5',
    type: 'order' as const,
    title: 'Bulk order received',
    description: 'Order #ORD-002 for $5,200 from corporate client',
    timestamp: '1 day ago',
    status: 'Processing',
    amount: '$5,200',
  },
];

export const merchantActivityData = [
  {
    id: '1',
    type: 'order' as const,
    title: 'New order received',
    description: 'Order #ORD-003 for Luxury Watch Collection',
    timestamp: '1 hour ago',
    status: 'Pending',
    amount: '$1,250',
  },
  {
    id: '2',
    type: 'success' as const,
    title: 'Product approved',
    description: 'Diamond Ring has been approved and is now live',
    timestamp: '3 hours ago',
    status: 'Approved',
  },
  {
    id: '3',
    type: 'user' as const,
    title: 'New customer review',
    description: '5-star review received for Gold Necklace',
    timestamp: '5 hours ago',
    status: 'Published',
  },
  {
    id: '4',
    type: 'order' as const,
    title: 'Order shipped',
    description: 'Order #ORD-004 has been shipped to customer',
    timestamp: '1 day ago',
    status: 'Shipped',
    amount: '$890',
  },
  {
    id: '5',
    type: 'warning' as const,
    title: 'Low stock alert',
    description: 'Silk Scarf is running low on inventory',
    timestamp: '2 days ago',
    status: 'Alert',
  },
];

// Chart data for mini charts in stat cards
export const miniChartData = {
  revenue: [
    { value: 45 },
    { value: 52 },
    { value: 48 },
    { value: 61 },
    { value: 55 },
    { value: 67 },
    { value: 72 },
  ],
  orders: [
    { value: 120 },
    { value: 135 },
    { value: 128 },
    { value: 155 },
    { value: 142 },
    { value: 168 },
    { value: 180 },
  ],
  customers: [
    { value: 89 },
    { value: 95 },
    { value: 92 },
    { value: 110 },
    { value: 98 },
    { value: 125 },
    { value: 135 },
  ],
  growth: [
    { value: 15 },
    { value: 23 },
    { value: 31 },
    { value: 28 },
    { value: 35 },
    { value: 42 },
    { value: 38 },
  ],
};

// Real-time metrics data
export const realTimeMetrics = {
  onlineUsers: 1247,
  activeOrders: 23,
  pendingReviews: 8,
  systemHealth: 99.9,
};
