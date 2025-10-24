'use server';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { 
  getMerchantSettings,
  updateMerchantSettings,
  getMerchantStatistics,
  validateSlugAvailability,
  deactivateMerchant,
  deleteMerchant,
  MerchantSettingsUpdate
} from '@/lib/services/merchant-settings';
import { revalidatePath } from 'next/cache';
import config from '@/lib/config';
import ImageKit from 'imagekit';
import crypto from 'crypto';

export async function getMerchantSettingsAction() {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/merchant');
  }

  try {
    const settings = await getMerchantSettings(session.user.merchantId);
    
    if (!settings) {
      return {
        success: false,
        error: 'Merchant settings not found',
      };
    }

    return {
      success: true,
      data: settings,
    };
  } catch (error) {
    console.error('Error fetching merchant settings:', error);
    return {
      success: false,
      error: 'Failed to fetch merchant settings',
    };
  }
}

export async function updateMerchantSettingsAction(updates: MerchantSettingsUpdate) {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/merchant');
  }

  try {
    // Validate slug availability if slug is being updated
    if (updates.storeSlug) {
      const slugCheck = await validateSlugAvailability(updates.storeSlug, session.user.merchantId);
      if (!slugCheck.available) {
        return {
          success: false,
          error: 'This store URL slug is already taken. Please choose a different one.',
        };
      }
    }

    const result = await updateMerchantSettings(session.user.merchantId, updates);
    
    if (result.success) {
      // Revalidate the settings page to show updated data
      revalidatePath('/merchant/settings');
      
      return {
        success: true,
        message: 'Settings updated successfully',
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to update settings',
      };
    }
  } catch (error) {
    console.error('Error updating merchant settings:', error);
    return {
      success: false,
      error: 'Failed to update settings',
    };
  }
}

export async function getMerchantStatisticsAction() {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/merchant');
  }

  try {
    const stats = await getMerchantStatistics(session.user.merchantId);
    
    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error('Error fetching merchant statistics:', error);
    return {
      success: false,
      error: 'Failed to fetch statistics',
    };
  }
}

export async function checkSlugAvailabilityAction(slug: string) {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/merchant');
  }

  try {
    const result = await validateSlugAvailability(slug, session.user.merchantId);
    
    return {
      success: true,
      available: result.available,
    };
  } catch (error) {
    console.error('Error checking slug availability:', error);
    return {
      success: false,
      error: 'Failed to check slug availability',
    };
  }
}

export async function exportMerchantSettingsAction() {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/merchant');
  }

  try {
    const settings = await getMerchantSettings(session.user.merchantId);
    const stats = await getMerchantStatistics(session.user.merchantId);
    
    if (!settings) {
      return {
        success: false,
        error: 'Settings not found',
      };
    }

    const exportData = {
      settings,
      statistics: stats,
      exportedAt: new Date().toISOString(),
      merchantId: session.user.merchantId,
    };

    return {
      success: true,
      data: {
        json: JSON.stringify(exportData, null, 2),
        filename: `merchant-settings-${new Date().toISOString().split('T')[0]}.json`
      },
    };
  } catch (error) {
    console.error('Error exporting merchant settings:', error);
    return {
      success: false,
      error: 'Failed to export settings',
    };
  }
}

export async function deactivateMerchantAction() {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/merchant');
  }

  try {
    const result = await deactivateMerchant(session.user.merchantId);
    
    if (result.success) {
      revalidatePath('/merchant/settings');
      return {
        success: true,
        message: 'Merchant account has been deactivated',
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to deactivate merchant',
      };
    }
  } catch (error) {
    console.error('Error deactivating merchant:', error);
    return {
      success: false,
      error: 'Failed to deactivate merchant',
    };
  }
}

export async function deleteMerchantAction() {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/merchant');
  }

  try {
    const result = await deleteMerchant(session.user.merchantId);
    
    if (result.success) {
      // Redirect to sign out page since merchant is deleted
      redirect('/api/auth/signout');
    } else {
      return {
        success: false,
        error: result.error || 'Failed to delete merchant',
      };
    }
  } catch (error) {
    console.error('Error deleting merchant:', error);
    return {
      success: false,
      error: 'Failed to delete merchant',
    };
  }
}

export async function updatePaymentSettingsAction(updates: {
  paymentMethods?: string[];
  currency?: string;
  taxRate?: number;
  paymentProcessingFee?: number;
}) {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/merchant');
  }

  try {
    const result = await updateMerchantSettings(session.user.merchantId, updates);
    
    if (result.success) {
      revalidatePath('/merchant/settings');
      return {
        success: true,
        message: 'Payment settings updated successfully',
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to update payment settings',
      };
    }
  } catch (error) {
    console.error('Error updating payment settings:', error);
    return {
      success: false,
      error: 'Failed to update payment settings',
    };
  }
}

export async function updateShippingSettingsAction(updates: {
  freeShippingThreshold?: number;
  standardShippingCost?: number;
  expressShippingCost?: number;
  internationalShipping?: boolean;
  shippingZones?: Record<string, any>[];
  processingTime?: string;
}) {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/merchant');
  }

  try {
    const result = await updateMerchantSettings(session.user.merchantId, updates);
    
    if (result.success) {
      revalidatePath('/merchant/settings');
      return {
        success: true,
        message: 'Shipping settings updated successfully',
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to update shipping settings',
      };
    }
  } catch (error) {
    console.error('Error updating shipping settings:', error);
    return {
      success: false,
      error: 'Failed to update shipping settings',
    };
  }
}

export async function updateNotificationSettingsAction(updates: {
  emailNewOrders?: boolean;
  emailLowStock?: boolean;
  emailCustomerMessages?: boolean;
  emailPromotions?: boolean;
  smsUrgentAlerts?: boolean;
  smsDailySummary?: boolean;
  pushNotifications?: boolean;
}) {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/merchant');
  }

  try {
    const result = await updateMerchantSettings(session.user.merchantId, updates);
    
    if (result.success) {
      revalidatePath('/merchant/settings');
      return {
        success: true,
        message: 'Notification settings updated successfully',
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to update notification settings',
      };
    }
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return {
      success: false,
      error: 'Failed to update notification settings',
    };
  }
}

export async function updatePolicySettingsAction(updates: {
  returnPolicy?: string;
  shippingPolicy?: string;
  privacyPolicy?: string;
  termsOfService?: string;
  refundPolicy?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}) {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/merchant');
  }

  try {
    const result = await updateMerchantSettings(session.user.merchantId, updates);
    
    if (result.success) {
      revalidatePath('/merchant/settings');
      return {
        success: true,
        message: 'Store policies updated successfully',
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to update store policies',
      };
    }
  } catch (error) {
    console.error('Error updating store policies:', error);
    return {
      success: false,
      error: 'Failed to update store policies',
    };
  }
}

export async function updateAdvancedSettingsAction(updates: {
  maintenanceMode?: boolean;
  vacationMode?: boolean;
  vacationMessage?: string;
  apiKey?: string;
  webhookUrl?: string;
  customDomain?: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  customCss?: string;
  customJs?: string;
}) {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/merchant');
  }

  try {
    const result = await updateMerchantSettings(session.user.merchantId, updates);
    
    if (result.success) {
      revalidatePath('/merchant/settings');
      return {
        success: true,
        message: 'Advanced settings updated successfully',
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to update advanced settings',
      };
    }
  } catch (error) {
    console.error('Error updating advanced settings:', error);
    return {
      success: false,
      error: 'Failed to update advanced settings',
    };
  }
}

export async function uploadMerchantImageAction(
  imageType: 'logo' | 'cover',
  formData: FormData
) {
  const session = await auth();
  
  if (!session?.user?.merchantId) {
    redirect('/merchant');
  }

  try {
    const file = formData.get('image') as File;
    
    if (!file || file.size === 0) {
      return {
        success: false,
        error: 'No image file provided',
      };
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'File must be an image',
      };
    }

    // Validate file size (5MB max for logo, 10MB for cover)
    const maxSize = imageType === 'logo' ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        error: `Image file too large. Maximum size is ${imageType === 'logo' ? '5MB' : '10MB'}.`,
      };
    }

    // Initialize ImageKit
    const imagekit = new ImageKit({
      publicKey: config.env.imagekit.publicKey,
      privateKey: config.env.imagekit.privateKey,
      urlEndpoint: config.env.imagekit.urlEndpoint,
    });
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Upload to ImageKit
    const uploadResult = await imagekit.upload({
      file: buffer,
      fileName: `${imageType}-${session.user.merchantId}-${Date.now()}.${file.name.split('.').pop()}`,
      folder: `/merchants/${session.user.merchantId}/${imageType}s`,
      useUniqueFileName: true,
      transformation: {
        pre: imageType === 'logo' 
          ? 'w-200,h-200,c-maintain_ratio'
          : 'w-800,h-400,c-maintain_ratio'
      },
    });
    
    // Update merchant with new image URL
    const updateData = imageType === 'logo' 
      ? { image: uploadResult.url }
      : { coverImage: uploadResult.url };
    
    const result = await updateMerchantSettings(session.user.merchantId, updateData);
    
    if (result.success) {
      revalidatePath('/merchant/settings');
      return {
        success: true,
        data: {
          imageUrl: uploadResult.url,
          filePath: uploadResult.filePath,
          message: `${imageType === 'logo' ? 'Logo' : 'Cover image'} uploaded successfully`,
        },
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to update image',
      };
    }
  } catch (error) {
    console.error('Error uploading merchant image:', error);
    return {
      success: false,
      error: 'Failed to upload image',
    };
  }
}
