"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MiniChart } from './ChartComponents';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  chartData?: Array<{ value: number }>;
  chartType?: 'line' | 'area';
  color?: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  chartData,
  chartType = 'line',
  color = '#3B82F6',
  subtitle,
  badge,
}) => {
  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="h-3 w-3" />;
      case 'negative':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          {badge && (
            <Badge variant={badge.variant || 'secondary'} className="text-xs">
              {badge.text}
            </Badge>
          )}
          {icon && (
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
              {icon}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">
              {value}
            </div>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
            {change !== undefined && (
              <div className={`flex items-center gap-1 text-xs ${getChangeColor()}`}>
                {getChangeIcon()}
                <span>{Math.abs(change)}% from last month</span>
              </div>
            )}
          </div>
          {chartData && (
            <div className="flex items-end">
              <MiniChart 
                data={chartData} 
                color={color} 
                type={chartType}
              />
            </div>
          )}
        </div>
      </CardContent>
      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{ 
          background: `linear-gradient(135deg, ${color} 0%, transparent 100%)` 
        }}
      />
    </Card>
  );
};
