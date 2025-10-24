'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Users,
  Package,
  Settings,
  BarChart3,
  FileText,
  Bell,
  Download,
  Upload,
  Eye,
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  color?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
  columns?: 2 | 3 | 4;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  title = 'Quick Actions',
  columns = 3,
}) => {
  const getGridCols = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid ${getGridCols()} gap-4`}>
          {actions.map(action => (
            <Button
              key={action.id}
              variant={action.variant || 'outline'}
              className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all duration-200"
              onClick={action.onClick}
            >
              <div
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: action.color
                    ? `${action.color}20`
                    : undefined,
                  color: action.color || undefined,
                }}
              >
                {action.icon}
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {action.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Predefined action sets for different user types
export const getAdminQuickActions = (
  onAction: (action: string) => void
): QuickAction[] => [
  {
    id: 'add-merchant',
    title: 'Add Merchant',
    description: 'Onboard new merchant',
    icon: <Plus className="h-4 w-4" />,
    onClick: () => onAction('add-merchant'),
    color: '#3B82F6',
  },
  {
    id: 'view-users',
    title: 'Manage Users',
    description: 'User management',
    icon: <Users className="h-4 w-4" />,
    onClick: () => onAction('view-users'),
    color: '#10B981',
  },
  {
    id: 'view-analytics',
    title: 'Analytics',
    description: 'Platform insights',
    icon: <BarChart3 className="h-4 w-4" />,
    onClick: () => onAction('view-analytics'),
    color: '#8B5CF6',
  },
  {
    id: 'generate-report',
    title: 'Generate Report',
    description: 'Export data',
    icon: <FileText className="h-4 w-4" />,
    onClick: () => onAction('generate-report'),
    color: '#F59E0B',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Manage alerts',
    icon: <Bell className="h-4 w-4" />,
    onClick: () => onAction('notifications'),
    color: '#EF4444',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Platform config',
    icon: <Settings className="h-4 w-4" />,
    onClick: () => onAction('settings'),
    color: '#6B7280',
  },
];

export const getMerchantQuickActions = (
  onAction: (action: string) => void
): QuickAction[] => [
  {
    id: 'add-product',
    title: 'Add Product',
    description: 'New inventory item',
    icon: <Plus className="h-4 w-4" />,
    onClick: () => onAction('add-product'),
    color: '#3B82F6',
  },
  {
    id: 'view-orders',
    title: 'View Orders',
    description: 'Order management',
    icon: <Package className="h-4 w-4" />,
    onClick: () => onAction('view-orders'),
    color: '#10B981',
  },
  {
    id: 'view-analytics',
    title: 'Analytics',
    description: 'Store insights',
    icon: <BarChart3 className="h-4 w-4" />,
    onClick: () => onAction('view-analytics'),
    color: '#8B5CF6',
  },
  {
    id: 'export-data',
    title: 'Export Data',
    description: 'Download reports',
    icon: <Download className="h-4 w-4" />,
    onClick: () => onAction('export-data'),
    color: '#F59E0B',
  },
  {
    id: 'import-products',
    title: 'Import Products',
    description: 'Bulk upload',
    icon: <Upload className="h-4 w-4" />,
    onClick: () => onAction('import-products'),
    color: '#06B6D4',
  },
  {
    id: 'preview-store',
    title: 'Preview Store',
    description: 'View storefront',
    icon: <Eye className="h-4 w-4" />,
    onClick: () => onAction('preview-store'),
    color: '#EC4899',
  },
];
