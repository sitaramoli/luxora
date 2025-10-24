export const PRODUCT_STATUSES = [
  { value: 'all', label: 'All Status' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ARCHIVED', label: 'Archived' },
] as const;

export const STOCK_STATUSES = {
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  LOW_STOCK: 'LOW_STOCK',
  IN_STOCK: 'IN_STOCK',
  OVER_STOCK: 'OVER_STOCK',
} as const;

export const DEFAULT_CATEGORIES = [
  'Clothing',
  'Bags',
  'Shoes', 
  'Jewelry',
  'Watches',
  'Accessories',
  'Beauty',
  'Home & Decor',
] as const;

export const PAGINATION_PAGE_SIZE = 20;

export type ProductStatus = typeof PRODUCT_STATUSES[number]['value'];
export type StockStatus = keyof typeof STOCK_STATUSES;