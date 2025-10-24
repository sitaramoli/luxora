// Database merchant type (from service)
export interface DatabaseMerchant {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  image: string;
  logo: string | null;
  coverImage: string;
  isFeatured: boolean;
  status: string;
  createdAt: Date;
  productCount?: number; // This will be calculated via JOIN or separate query
}

// Transformed brand type for UI components
export interface Brand {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  category: string;
  isVerified: boolean;
}

// Transform database merchant to UI brand format
export function transformDatabaseMerchant(dbMerchant: DatabaseMerchant): Brand {
  return {
    id: dbMerchant.id,
    name: dbMerchant.name,
    description: dbMerchant.description,
    image: dbMerchant.image,
    productCount: dbMerchant.productCount || 0,
    category: dbMerchant.category,
    isVerified: dbMerchant.status === 'ACTIVE',
  };
}