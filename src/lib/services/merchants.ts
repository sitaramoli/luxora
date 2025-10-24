'use server';

import { AccountStatus } from '@/types';
import { db } from '@/database/drizzle';
import { merchants, products } from '@/database/schema';
import { eq, desc, sql, count } from 'drizzle-orm';

export const getAllMerchantDetails = async () => {
  return [
    {
      id: 'VEN-001',
      name: 'Chanel',
      email: 'contact@chanel.com',
      category: 'Fashion',
      status: 'ACTIVE',
      createdAt: '2023-01-15',
      totalProducts: 245,
      totalSales: '$1,247,392',
      rating: 4.9,
      verified: true,
      description: 'Timeless elegance and sophisticated luxury fashion.',
      website: 'https://chanel.com',
      phone: '+33 1 44 50 73 00',
      address: '135 Avenue Charles de Gaulle, 92200 Neuilly-sur-Seine, France',
      commission: 15,
      lastActive: '2024-01-15',
    },
    {
      id: 'VEN-002',
      name: 'Gucci',
      email: 'info@gucci.com',
      category: 'Fashion',
      status: 'ACTIVE',
      createdAt: '2023-02-20',
      totalProducts: 189,
      totalSales: '$892,156',
      rating: 4.8,
      verified: true,
      description: 'Italian luxury fashion house known for leather goods.',
      website: 'https://gucci.com',
      phone: '+39 055 75921',
      address: 'Via Tornabuoni 73/R, 50123 Florence, Italy',
      commission: 18,
      lastActive: '2024-01-14',
    },

    {
      id: 'VEN-003',
      name: 'Hermès',
      email: 'contact@hermes.com',
      category: 'Luxury Goods',
      status: 'ACTIVE',
      createdAt: '2023-01-10',
      totalProducts: 156,
      totalSales: '$2,156,789',
      rating: 4.9,
      verified: true,
      description: 'French luxury goods manufacturer specializing in leather.',
      website: 'https://hermes.com',
      phone: '+33 1 40 17 47 17',
      address: '24 Rue du Faubourg Saint-Honoré, 75008 Paris, France',
      commission: 12,
      lastActive: '2024-01-15',
    },
    {
      id: 'VEN-004',
      name: 'Luxury Timepieces Co.',
      email: 'info@luxurytimepieces.com',
      category: 'Watches',
      status: 'PENDING',
      createdAt: '2024-01-10',
      totalProducts: 0,
      totalSales: '$0',
      rating: 0,
      verified: false,
      description: 'Premium watch retailer specializing in Swiss timepieces.',
      website: 'https://luxurytimepieces.com',
      phone: '+1 555 123 4567',
      address: '123 Watch Street, New York, NY 10001',
      commission: 20,
      lastActive: '2024-01-10',
    },
    {
      id: 'VEN-005',
      name: 'Elite Fashion House',
      email: 'contact@elitefashion.com',
      category: 'Clothing',
      status: 'UNDER_REVIEW',
      createdAt: '2024-01-12',
      totalProducts: 0,
      totalSales: '$0',
      rating: 0,
      verified: false,
      description: 'Contemporary fashion brand with modern designs.',
      website: 'https://elitefashion.com',
      phone: '+1 555 987 6543',
      address: '456 Fashion Ave, Los Angeles, CA 90210',
      commission: 25,
      lastActive: '2024-01-12',
    },
    {
      id: 'VEN-006',
      name: 'Diamond Dynasty',
      email: 'sales@diamonddynasty.com',
      category: 'Jewelry',
      status: 'SUSPENDED',
      createdAt: '2023-08-15',
      totalProducts: 45,
      totalSales: '$156,789',
      rating: 3.8,
      verified: false,
      description: 'Fine jewelry and diamond specialist.',
      website: 'https://diamonddynasty.com',
      phone: '+1 555 456 7890',
      address: '789 Diamond District, New York, NY 10036',
      commission: 22,
      lastActive: '2023-12-20',
    },
  ];
};

export const changeMerchantAccountStatus = async (
  id: string,
  newStatus: AccountStatus
) => {
  try {
    await db
      .update(merchants)
      .set({ status: newStatus })
      .where(eq(merchants.id, id));
    return { success: true, message: 'Status updated successfully.' };
  } catch (error) {
    console.error('Error updating status:', error);
    return { success: false, message: 'Failed to update status.' };
  }
};

export const fetchFeaturedMerchants = async (limit = 6) => {
  try {
    // First get the featured merchants
    const featuredMerchants = await db
      .select({
        id: merchants.id,
        name: merchants.name,
        description: merchants.description,
        shortDescription: merchants.shortDescription,
        category: merchants.category,
        image: merchants.image,
        logo: merchants.logo,
        coverImage: merchants.coverImage,
        isFeatured: merchants.isFeatured,
        status: merchants.status,
        createdAt: merchants.createdAt,
      })
      .from(merchants)
      .where(eq(merchants.isFeatured, true))
      .orderBy(desc(merchants.createdAt))
      .limit(limit);

    // Then get product counts for each merchant
    const merchantsWithCounts = await Promise.all(
      featuredMerchants.map(async (merchant) => {
        const productCountResult = await db
          .select({ count: count() })
          .from(products)
          .where(eq(products.merchantId, merchant.id));
        
        return {
          ...merchant,
          productCount: productCountResult[0]?.count || 0,
        };
      })
    );

    return { success: true, data: merchantsWithCounts };
  } catch (error) {
    console.error('Error fetching featured merchants:', error);
    return { success: false, error: 'Failed to fetch featured merchants.' };
  }
};

export interface PaginatedBrandsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  sortBy?: 'name' | 'productCount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedBrandsResponse {
  success: boolean;
  data?: {
    brands: Array<{
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
      productCount: number;
    }>;
    pagination: {
      currentPage: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  };
  error?: string;
}

export const fetchPaginatedBrands = async ({
  page = 1,
  pageSize = 20,
  search = '',
  category = '',
  sortBy = 'productCount',
  sortOrder = 'desc',
}: PaginatedBrandsParams): Promise<PaginatedBrandsResponse> => {
  try {
    const offset = (page - 1) * pageSize;

    // First get all active merchants
    let merchantsQuery = db
      .select({
        id: merchants.id,
        name: merchants.name,
        description: merchants.description,
        shortDescription: merchants.shortDescription,
        category: merchants.category,
        image: merchants.image,
        logo: merchants.logo,
        coverImage: merchants.coverImage,
        isFeatured: merchants.isFeatured,
        status: merchants.status,
        createdAt: merchants.createdAt,
      })
      .from(merchants)
      .where(eq(merchants.status, 'ACTIVE'))
      .$dynamic();

    // Add search filter if provided
    if (search) {
      merchantsQuery = merchantsQuery.where(
        sql`LOWER(${merchants.name}) LIKE LOWER(${`%${search}%`}) OR LOWER(${merchants.description}) LIKE LOWER(${`%${search}%`})`
      );
    }

    // Add category filter if provided
    if (category && category !== 'all') {
      merchantsQuery = merchantsQuery.where(
        sql`LOWER(${merchants.category}) = LOWER(${category})`
      );
    }

    // Get total count first
    const totalCountQuery = db
      .select({ count: count() })
      .from(merchants)
      .where(eq(merchants.status, 'ACTIVE'))
      .$dynamic();

    if (search) {
      totalCountQuery.where(
        sql`LOWER(${merchants.name}) LIKE LOWER(${`%${search}%`}) OR LOWER(${merchants.description}) LIKE LOWER(${`%${search}%`})`
      );
    }

    if (category && category !== 'all') {
      totalCountQuery.where(
        sql`LOWER(${merchants.category}) = LOWER(${category})`
      );
    }

    // Execute merchants query and total count query
    const [merchantsResult, totalCountResult] = await Promise.all([
      merchantsQuery,
      totalCountQuery,
    ]);

    // Now get product counts for each merchant
    const merchantsWithCounts = await Promise.all(
      merchantsResult.map(async (merchant) => {
        const productCountResult = await db
          .select({ count: count() })
          .from(products)
          .where(eq(products.merchantId, merchant.id));
        
        return {
          ...merchant,
          productCount: productCountResult[0]?.count || 0,
        };
      })
    );

    // Sort the results
    merchantsWithCounts.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return sortOrder === 'desc' 
            ? b.name.localeCompare(a.name)
            : a.name.localeCompare(b.name);
        case 'createdAt':
          return sortOrder === 'desc'
            ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'productCount':
        default:
          return sortOrder === 'desc'
            ? b.productCount - a.productCount
            : a.productCount - b.productCount;
      }
    });

    // Apply pagination
    const paginatedResults = merchantsWithCounts.slice(offset, offset + pageSize);

    const totalItems = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      success: true,
      data: {
        brands: paginatedResults,
        pagination: {
          currentPage: page,
          pageSize,
          totalItems,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching paginated brands:', error);
    return {
      success: false,
      error: 'Failed to fetch brands.',
    };
  }
};

export const fetchBrandByIdWithProducts = async (id: string) => {
  try {
    // Fetch brand (merchant) details
    const [brand] = await db
      .select({
        id: merchants.id,
        name: merchants.name,
        description: merchants.description,
        shortDescription: merchants.shortDescription,
        category: merchants.category,
        image: merchants.image,
        logo: merchants.logo,
        coverImage: merchants.coverImage,
        isFeatured: merchants.isFeatured,
        status: merchants.status,
        createdAt: merchants.createdAt,
      })
      .from(merchants)
      .where(eq(merchants.id, id))
      .limit(1);

    if (!brand) {
      return { success: false, error: 'Brand not found' };
    }

    // Get product count
    const countRes = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.merchantId, brand.id));

    const productCount = countRes[0]?.count || 0;

    // Fetch products for the brand (limit for page rendering)
    const brandProducts = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        originalPrice: products.originalPrice,
        images: products.images,
        featured: products.isFeatured,
        onSale: products.onSale,
        stockCount: products.stockCount,
        createdAt: products.createdAt,
        brandName: merchants.name,
        brandSlug: merchants.slug,
      })
      .from(products)
      .leftJoin(merchants, eq(products.merchantId, merchants.id))
      .where(eq(products.merchantId, brand.id))
      .orderBy(desc(products.createdAt))
      .limit(24);

    return {
      success: true,
      data: {
        brand: { ...brand, productCount },
        products: brandProducts,
      },
    };
  } catch (error) {
    console.error('Error fetching brand details:', error);
    return { success: false, error: 'Failed to fetch brand details' };
  }
};
