// Database product type (from service)
export interface DatabaseProduct {
  id: number;
  name: string;
  description: string;
  price: string; // Decimal from database comes as string
  originalPrice: string;
  images: string[] | null;
  featured: boolean;
  onSale: boolean;
  stockCount: number;
  createdAt: Date;
  brandName: string | null;
  brandSlug: string | null;
}

// Transformed product type for UI components
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  isNew: boolean;
  isSale: boolean;
}

// Transform database product to UI product format
export function transformDatabaseProduct(dbProduct: DatabaseProduct): Product {
  return {
    id: dbProduct.id.toString(),
    name: dbProduct.name,
    brand: dbProduct.brandName || 'Unknown Brand',
    price: parseFloat(dbProduct.price),
    originalPrice: dbProduct.originalPrice ? parseFloat(dbProduct.originalPrice) : undefined,
    image: dbProduct.images && dbProduct.images.length > 0 ? dbProduct.images[0] : '/images/placeholder-product.jpg',
    rating: 4.5, // TODO: Implement actual ratings from database
    reviewCount: Math.floor(Math.random() * 200) + 10, // TODO: Get actual review count from database
    category: 'Luxury', // TODO: Get actual category from database
    isNew: dbProduct.createdAt ? new Date(dbProduct.createdAt).getTime() > (Date.now() - 30 * 24 * 60 * 60 * 1000) : false, // New if created within last 30 days
    isSale: dbProduct.onSale,
  };
}
