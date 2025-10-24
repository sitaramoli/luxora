'use server';

import { db } from '@/database/drizzle';
import { merchants, users } from '@/database/schema';
import { eq, sql } from 'drizzle-orm';

export interface MerchantSettings {
  // Store Information
  storeName: string;
  storeDescription: string;
  storeSlug: string;
  category: string;
  website?: string;
  phone: string;
  email: string;
  address: string;
  
  // Business Information
  businessName?: string;
  isVerified: boolean;
  founded?: string;
  taxId?: string;
  businessLicense?: string;
  
  // Store Status
  status: string;
  maintenanceMode: boolean;
  vacationMode: boolean;
  vacationMessage?: string;
  
  // Images
  logo?: string;  // Store logo
  image?: string; // Store image
  coverImage?: string;
  
  // SEO Settings
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  
  // Payment Settings
  paymentMethods?: string[];
  currency?: string;
  taxRate?: number;
  paymentProcessingFee?: number;
  
  // Shipping Settings
  freeShippingThreshold?: number;
  standardShippingCost?: number;
  expressShippingCost?: number;
  internationalShipping?: boolean;
  shippingZones?: Record<string, any>[];
  processingTime?: string;
  
  // Notification Settings
  emailNewOrders?: boolean;
  emailLowStock?: boolean;
  emailCustomerMessages?: boolean;
  emailPromotions?: boolean;
  smsUrgentAlerts?: boolean;
  smsDailySummary?: boolean;
  pushNotifications?: boolean;
  
  // Store Policies
  returnPolicy?: string;
  shippingPolicy?: string;
  privacyPolicy?: string;
  termsOfService?: string;
  refundPolicy?: string;
  
  // Advanced Settings
  apiKey?: string;
  webhookUrl?: string;
  customDomain?: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  customCss?: string;
  customJs?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt?: Date;
}

export interface MerchantSettingsUpdate {
  // Store Information
  storeName?: string;
  storeDescription?: string;
  storeSlug?: string;
  category?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  businessName?: string;
  founded?: string;
  taxId?: string;
  businessLicense?: string;
  status?: string;
  maintenanceMode?: boolean;
  vacationMode?: boolean;
  vacationMessage?: string;
  logo?: string;
  image?: string;
  coverImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  
  // Payment Settings
  paymentMethods?: string[];
  currency?: string;
  taxRate?: number;
  paymentProcessingFee?: number;
  
  // Shipping Settings
  freeShippingThreshold?: number;
  standardShippingCost?: number;
  expressShippingCost?: number;
  internationalShipping?: boolean;
  shippingZones?: Record<string, any>[];
  processingTime?: string;
  
  // Notification Settings
  emailNewOrders?: boolean;
  emailLowStock?: boolean;
  emailCustomerMessages?: boolean;
  emailPromotions?: boolean;
  smsUrgentAlerts?: boolean;
  smsDailySummary?: boolean;
  pushNotifications?: boolean;
  
  // Store Policies
  returnPolicy?: string;
  shippingPolicy?: string;
  privacyPolicy?: string;
  termsOfService?: string;
  refundPolicy?: string;
  
  // Advanced Settings
  apiKey?: string;
  webhookUrl?: string;
  customDomain?: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  customCss?: string;
  customJs?: string;
}

export const getMerchantSettings = async (merchantId: string): Promise<MerchantSettings | null> => {
  try {
    const result = await db
      .select({
        // Store Information
        storeName: merchants.name,
        storeDescription: merchants.description,
        storeSlug: merchants.slug,
        category: merchants.category,
        website: merchants.website,
        phone: merchants.phone,
        email: merchants.email,
        address: merchants.address,
        businessName: merchants.name, // Using name as business name for now
        isVerified: sql<boolean>`CASE WHEN status = 'ACTIVE' THEN TRUE ELSE FALSE END`,
        founded: merchants.founded,
        taxId: merchants.taxId,
        businessLicense: merchants.businessLicense,
        status: merchants.status,
        maintenanceMode: merchants.maintenanceMode,
        vacationMode: merchants.vacationMode,
        vacationMessage: merchants.vacationMessage,
        logo: merchants.logo,
        image: merchants.image,
        coverImage: merchants.coverImage,
        metaTitle: merchants.metaTitle,
        metaDescription: merchants.metaDescription,
        keywords: merchants.keywords,
        
        // Payment Settings
        paymentMethods: merchants.paymentMethods,
        currency: merchants.currency,
        taxRate: merchants.taxRate,
        paymentProcessingFee: merchants.paymentProcessingFee,
        
        // Shipping Settings
        freeShippingThreshold: merchants.freeShippingThreshold,
        standardShippingCost: merchants.standardShippingCost,
        expressShippingCost: merchants.expressShippingCost,
        internationalShipping: merchants.internationalShipping,
        shippingZones: merchants.shippingZones,
        processingTime: merchants.processingTime,
        
        // Notification Settings
        emailNewOrders: merchants.emailNewOrders,
        emailLowStock: merchants.emailLowStock,
        emailCustomerMessages: merchants.emailCustomerMessages,
        emailPromotions: merchants.emailPromotions,
        smsUrgentAlerts: merchants.smsUrgentAlerts,
        smsDailySummary: merchants.smsDailySummary,
        pushNotifications: merchants.pushNotifications,
        
        // Store Policies
        returnPolicy: merchants.returnPolicy,
        shippingPolicy: merchants.shippingPolicy,
        privacyPolicy: merchants.privacyPolicy,
        termsOfService: merchants.termsOfService,
        refundPolicy: merchants.refundPolicy,
        
        // Advanced Settings
        apiKey: merchants.apiKey,
        webhookUrl: merchants.webhookUrl,
        customDomain: merchants.customDomain,
        googleAnalyticsId: merchants.googleAnalyticsId,
        facebookPixelId: merchants.facebookPixelId,
        customCss: merchants.customCss,
        customJs: merchants.customJs,
        
        createdAt: merchants.createdAt,
        updatedAt: merchants.updatedAt,
      })
      .from(merchants)
      .where(eq(merchants.id, merchantId))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const merchantData = result[0];
    
    // Transform and convert fields properly (null to undefined, string/number conversions)
    const settings: MerchantSettings = {
      // Store Information
      storeName: merchantData.storeName,
      storeDescription: merchantData.storeDescription,
      storeSlug: merchantData.storeSlug,
      category: merchantData.category,
      website: merchantData.website || undefined,
      phone: merchantData.phone,
      email: merchantData.email,
      address: merchantData.address,
      businessName: merchantData.businessName,
      isVerified: merchantData.isVerified,
      founded: merchantData.founded || undefined,
      taxId: merchantData.taxId || undefined,
      businessLicense: merchantData.businessLicense || undefined,
      status: merchantData.status,
      maintenanceMode: merchantData.maintenanceMode,
      vacationMode: merchantData.vacationMode,
      vacationMessage: merchantData.vacationMessage || undefined,
      logo: merchantData.logo || undefined,
      image: merchantData.image || undefined,
      coverImage: merchantData.coverImage || undefined,
      metaTitle: merchantData.metaTitle || undefined,
      metaDescription: merchantData.metaDescription || undefined,
      keywords: merchantData.keywords || undefined,
      
      // Payment Settings (convert to proper types)
      paymentMethods: merchantData.paymentMethods || undefined,
      currency: merchantData.currency || undefined,
      taxRate: merchantData.taxRate ? parseFloat(merchantData.taxRate.toString()) : 0,
      paymentProcessingFee: merchantData.paymentProcessingFee ? parseFloat(merchantData.paymentProcessingFee.toString()) : undefined,
      
      // Shipping Settings (convert to proper types)
      freeShippingThreshold: merchantData.freeShippingThreshold ? parseInt(merchantData.freeShippingThreshold.toString()) : undefined,
      standardShippingCost: merchantData.standardShippingCost ? parseInt(merchantData.standardShippingCost.toString()) : undefined,
      expressShippingCost: merchantData.expressShippingCost ? parseInt(merchantData.expressShippingCost.toString()) : undefined,
      internationalShipping: merchantData.internationalShipping ?? undefined,
      shippingZones: merchantData.shippingZones || undefined,
      processingTime: merchantData.processingTime || undefined,
      
      // Notification Settings
      emailNewOrders: merchantData.emailNewOrders ?? undefined,
      emailLowStock: merchantData.emailLowStock ?? undefined,
      emailCustomerMessages: merchantData.emailCustomerMessages ?? undefined,
      emailPromotions: merchantData.emailPromotions ?? undefined,
      smsUrgentAlerts: merchantData.smsUrgentAlerts ?? undefined,
      smsDailySummary: merchantData.smsDailySummary ?? undefined,
      pushNotifications: merchantData.pushNotifications ?? undefined,
      
      // Store Policies
      returnPolicy: merchantData.returnPolicy || undefined,
      shippingPolicy: merchantData.shippingPolicy || undefined,
      privacyPolicy: merchantData.privacyPolicy || undefined,
      termsOfService: merchantData.termsOfService || undefined,
      refundPolicy: merchantData.refundPolicy || undefined,
      
      // Advanced Settings
      apiKey: merchantData.apiKey || undefined,
      webhookUrl: merchantData.webhookUrl || undefined,
      customDomain: merchantData.customDomain || undefined,
      googleAnalyticsId: merchantData.googleAnalyticsId || undefined,
      facebookPixelId: merchantData.facebookPixelId || undefined,
      customCss: merchantData.customCss || undefined,
      customJs: merchantData.customJs || undefined,
      
      createdAt: merchantData.createdAt,
      updatedAt: merchantData.updatedAt,
    };
    
    return settings;
  } catch (error) {
    console.error('Error fetching merchant settings:', error);
    return null;
  }
};

export const updateMerchantSettings = async (
  merchantId: string,
  updates: MerchantSettingsUpdate
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Build the update object with only the fields that exist in the schema
    const updateData: any = {};
    
    // Store Information
    if (updates.storeName !== undefined) updateData.name = updates.storeName;
    if (updates.storeDescription !== undefined) updateData.description = updates.storeDescription;
    if (updates.storeSlug !== undefined) updateData.slug = updates.storeSlug;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.website !== undefined) updateData.website = updates.website;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.address !== undefined) updateData.address = updates.address;
    if (updates.founded !== undefined) updateData.founded = updates.founded;
    if (updates.taxId !== undefined) updateData.taxId = updates.taxId;
    if (updates.businessLicense !== undefined) updateData.businessLicense = updates.businessLicense;
    if (updates.maintenanceMode !== undefined) updateData.maintenanceMode = updates.maintenanceMode;
    if (updates.vacationMode !== undefined) updateData.vacationMode = updates.vacationMode;
    if (updates.vacationMessage !== undefined) updateData.vacationMessage = updates.vacationMessage;
    if (updates.logo !== undefined) updateData.logo = updates.logo;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.image !== undefined) updateData.image = updates.image;
    if (updates.coverImage !== undefined) updateData.coverImage = updates.coverImage;
    if (updates.metaTitle !== undefined) updateData.metaTitle = updates.metaTitle;
    if (updates.metaDescription !== undefined) updateData.metaDescription = updates.metaDescription;
    if (updates.keywords !== undefined) updateData.keywords = updates.keywords;
    
    // Payment Settings
    if (updates.paymentMethods !== undefined) updateData.paymentMethods = updates.paymentMethods;
    if (updates.currency !== undefined) updateData.currency = updates.currency;
    if (updates.taxRate !== undefined) updateData.taxRate = updates.taxRate;
    if (updates.paymentProcessingFee !== undefined) updateData.paymentProcessingFee = updates.paymentProcessingFee;
    
    // Shipping Settings
    if (updates.freeShippingThreshold !== undefined) updateData.freeShippingThreshold = updates.freeShippingThreshold;
    if (updates.standardShippingCost !== undefined) updateData.standardShippingCost = updates.standardShippingCost;
    if (updates.expressShippingCost !== undefined) updateData.expressShippingCost = updates.expressShippingCost;
    if (updates.internationalShipping !== undefined) updateData.internationalShipping = updates.internationalShipping;
    if (updates.shippingZones !== undefined) updateData.shippingZones = updates.shippingZones;
    if (updates.processingTime !== undefined) updateData.processingTime = updates.processingTime;
    
    // Notification Settings
    if (updates.emailNewOrders !== undefined) updateData.emailNewOrders = updates.emailNewOrders;
    if (updates.emailLowStock !== undefined) updateData.emailLowStock = updates.emailLowStock;
    if (updates.emailCustomerMessages !== undefined) updateData.emailCustomerMessages = updates.emailCustomerMessages;
    if (updates.emailPromotions !== undefined) updateData.emailPromotions = updates.emailPromotions;
    if (updates.smsUrgentAlerts !== undefined) updateData.smsUrgentAlerts = updates.smsUrgentAlerts;
    if (updates.smsDailySummary !== undefined) updateData.smsDailySummary = updates.smsDailySummary;
    if (updates.pushNotifications !== undefined) updateData.pushNotifications = updates.pushNotifications;
    
    // Store Policies
    if (updates.returnPolicy !== undefined) updateData.returnPolicy = updates.returnPolicy;
    if (updates.shippingPolicy !== undefined) updateData.shippingPolicy = updates.shippingPolicy;
    if (updates.privacyPolicy !== undefined) updateData.privacyPolicy = updates.privacyPolicy;
    if (updates.termsOfService !== undefined) updateData.termsOfService = updates.termsOfService;
    if (updates.refundPolicy !== undefined) updateData.refundPolicy = updates.refundPolicy;
    
    // Advanced Settings
    if (updates.apiKey !== undefined) updateData.apiKey = updates.apiKey;
    if (updates.webhookUrl !== undefined) updateData.webhookUrl = updates.webhookUrl;
    if (updates.customDomain !== undefined) updateData.customDomain = updates.customDomain;
    if (updates.googleAnalyticsId !== undefined) updateData.googleAnalyticsId = updates.googleAnalyticsId;
    if (updates.facebookPixelId !== undefined) updateData.facebookPixelId = updates.facebookPixelId;
    if (updates.customCss !== undefined) updateData.customCss = updates.customCss;
    if (updates.customJs !== undefined) updateData.customJs = updates.customJs;

    // Only update if we have changes
    if (Object.keys(updateData).length === 0) {
      return { success: true };
    }

    await db
      .update(merchants)
      .set(updateData)
      .where(eq(merchants.id, merchantId));

    return { success: true };
  } catch (error) {
    console.error('Error updating merchant settings:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update settings' 
    };
  }
};

export const getMerchantStatistics = async (merchantId: string) => {
  try {
    // Get product count
    const productStats = await db.execute(sql`
      SELECT COUNT(*) as total_products
      FROM products 
      WHERE merchant_id = ${merchantId}
    `);

    // Get order stats (using the same query structure as before)
    const orderStats = await db.execute(sql`
      SELECT 
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(AVG(CASE WHEN r.rating IS NOT NULL THEN r.rating END), 0) as avg_rating
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id::integer = p.id
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE oi.brand_id = ${merchantId}
    `);

    const productResult = productStats.rows?.[0] as any || {};
    const orderResult = orderStats.rows?.[0] as any || {};
    
    const productCount = productResult.total_products || 0;
    const monthlyOrders = orderResult.total_orders || 0;
    const storeRating = orderResult.avg_rating || 4.9; // Default rating

    return {
      totalProducts: parseInt(productCount.toString()),
      monthlyOrders: parseInt(monthlyOrders.toString()),
      storeRating: parseFloat(storeRating.toString()).toFixed(1),
      storeStatus: 'Active'
    };
  } catch (error) {
    console.error('Error fetching merchant statistics:', error);
    return {
      totalProducts: 0,
      monthlyOrders: 0,
      storeRating: '0.0',
      storeStatus: 'Unknown'
    };
  }
};

export const validateSlugAvailability = async (
  slug: string, 
  currentMerchantId: string
): Promise<{ available: boolean }> => {
  try {
    const result = await db
      .select({ id: merchants.id })
      .from(merchants)
      .where(eq(merchants.slug, slug))
      .limit(1);

    // Slug is available if no merchant uses it, or if it's the current merchant
    const available = result.length === 0 || result[0].id === currentMerchantId;
    
    return { available };
  } catch (error) {
    console.error('Error validating slug availability:', error);
    return { available: false };
  }
};

export const deactivateMerchant = async (merchantId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await db
      .update(merchants)
      .set({ status: 'SUSPENDED' })
      .where(eq(merchants.id, merchantId));

    return { success: true };
  } catch (error) {
    console.error('Error deactivating merchant:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to deactivate merchant' 
    };
  }
};

export const deleteMerchant = async (merchantId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // In a real application, you'd want to handle this more carefully:
    // 1. Archive/backup data
    // 2. Handle related orders, products, etc.
    // 3. Notify customers
    // 4. Handle payments/refunds
    
    // For now, we'll just mark as suspended instead of actual deletion
    await db
      .update(merchants)
      .set({ status: 'SUSPENDED' })
      .where(eq(merchants.id, merchantId));

    return { success: true };
  } catch (error) {
    console.error('Error deleting merchant:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete merchant' 
    };
  }
};