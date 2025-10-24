'use client';

import React, { memo, useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from 'recharts';

// Color palette for charts
const COLORS = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',
  gray: '#6B7280',
  purple: '#8B5CF6',
  pink: '#EC4899',
  indigo: '#6366F1',
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.success,
  COLORS.warning,
  COLORS.danger,
  COLORS.info,
  COLORS.purple,
  COLORS.pink,
];

// Custom tooltip component
const CustomTooltip = memo(({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
});

CustomTooltip.displayName = 'CustomTooltip';

// Revenue Chart Component
interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
    orders: number;
    customers: number;
  }>;
}

export const RevenueChart: React.FC<RevenueChartProps> = memo(({ data }) => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8} />
              <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={COLORS.primary}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

RevenueChart.displayName = 'RevenueChart';

// Orders Chart Component
interface OrdersChartProps {
  data: Array<{
    day: string;
    orders: number;
    completed: number;
    pending: number;
  }>;
}

export const OrdersChart: React.FC<OrdersChartProps> = memo(({ data }) => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="orders"
            stroke={COLORS.primary}
            strokeWidth={2}
            dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="completed"
            stroke={COLORS.success}
            strokeWidth={2}
            dot={{ fill: COLORS.success, strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="pending"
            stroke={COLORS.warning}
            strokeWidth={2}
            dot={{ fill: COLORS.warning, strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

OrdersChart.displayName = 'OrdersChart';

// Sales Distribution Chart
interface SalesDistributionProps {
  data: Array<{
    category: string;
    value: number;
    color?: string;
  }>;
}

export const SalesDistributionChart: React.FC<SalesDistributionProps> = memo(
  ({ data }) => {
    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: { name: string; percent: number }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
);

SalesDistributionChart.displayName = 'SalesDistributionChart';

// Top Products Chart
interface TopProductsProps {
  data: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
}

export const TopProductsChart: React.FC<TopProductsProps> = memo(({ data }) => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="sales" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

TopProductsChart.displayName = 'TopProductsChart';

// Performance Metrics Chart
interface PerformanceMetricsProps {
  data: Array<{
    metric: string;
    value: number;
    target: number;
  }>;
}

export const PerformanceMetricsChart: React.FC<PerformanceMetricsProps> = memo(
  ({ data }) => {
    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="80%"
            data={data}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={10}
              fill={COLORS.primary}
            />
            <Tooltip />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    );
  }
);

PerformanceMetricsChart.displayName = 'PerformanceMetricsChart';

// Customer Satisfaction Chart
interface CustomerSatisfactionProps {
  data: Array<{
    rating: string;
    count: number;
    percentage: number;
  }>;
}

export const CustomerSatisfactionChart: React.FC<CustomerSatisfactionProps> =
  memo(({ data }) => {
    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="horizontal"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="rating" type="category" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill={COLORS.success} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  });

CustomerSatisfactionChart.displayName = 'CustomerSatisfactionChart';

// Growth Trend Chart
interface GrowthTrendProps {
  data: Array<{
    period: string;
    growth: number;
    previous: number;
  }>;
}

export const GrowthTrendChart: React.FC<GrowthTrendProps> = memo(({ data }) => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="growth"
            stroke={COLORS.success}
            strokeWidth={3}
            dot={{ fill: COLORS.success, strokeWidth: 2, r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="previous"
            stroke={COLORS.gray}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: COLORS.gray, strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

GrowthTrendChart.displayName = 'GrowthTrendChart';

// Mini Chart Component for Stats Cards
interface MiniChartProps {
  data: Array<{ value: number }>;
  color?: string;
  type?: 'line' | 'area';
}

export const MiniChart: React.FC<MiniChartProps> = memo(
  ({ data, color = COLORS.primary, type = 'line' }) => {
    return (
      <div className="h-12 w-20">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart
              data={data}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <defs>
                <linearGradient id="miniGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fill="url(#miniGradient)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          ) : (
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                fill="none"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  }
);

MiniChart.displayName = 'MiniChart';
