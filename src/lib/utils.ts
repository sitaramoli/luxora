import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'UNDER_REVIEW':
      return 'bg-orange-100 text-orange-800';
    case 'SUSPENDED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getOrderStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-800';
    case 'SHIPPED':
      return 'bg-purple-100 text-purple-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'PAID':
      return 'bg-green-100 text-green-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'REFUNDED':
      return 'bg-blue-100 text-blue-800';
    case 'FAILED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getProductStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'PENDING_REVIEW':
      return 'bg-yellow-100 text-yellow-800';
    case 'OUT_OF_STOCK':
      return 'bg-red-100 text-red-800';
    case 'LOW_STOCK':
      return 'bg-orange-100 text-orange-800';
    case 'IN_STOCK':
      return 'bg-green-100 text-green-800';
    case 'OVER_STOCK':
      return 'bg-purple-100 text-purple-800';
    case 'DRAFT':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getRoleColor = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'bg-purple-100 text-purple-800';
    case 'MERCHANT':
      return 'bg-blue-100 text-blue-800';
    case 'CUSTOMER':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatSeasonName = (season: string) => {
  return season
    .replace('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
};

export const formatPriceRange = (min: string | null, max: string | null) => {
  if (min && max) {
    return `$${parseFloat(min).toLocaleString()} - $${parseFloat(max).toLocaleString()}`;
  }
  if (min) {
    return `From $${parseFloat(min).toLocaleString()}`;
  }
  if (max) {
    return `Up to $${parseFloat(max).toLocaleString()}`;
  }
  return 'Price varies';
};
