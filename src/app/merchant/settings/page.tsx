'use client';

import {
  Save,
  Store,
  CreditCard,
  Globe,
  Mail,
  Phone,
  MapPin,
  Upload,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  getMerchantSettingsAction,
  updateMerchantSettingsAction,
  getMerchantStatisticsAction,
  exportMerchantSettingsAction,
  uploadMerchantImageAction,
  deactivateMerchantAction,
  deleteMerchantAction,
  updatePaymentSettingsAction,
  updateShippingSettingsAction,
  updateNotificationSettingsAction,
  updatePolicySettingsAction,
  updateAdvancedSettingsAction,
} from '@/lib/actions/merchant-settings';

const Page: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [statistics, setStatistics] = useState({
    totalProducts: 0,
    monthlyOrders: 0,
    storeRating: '0.0',
    storeStatus: 'Loading...',
  });

  const [storeSettings, setStoreSettings] = useState({
    // Store Information
    storeName: 'Chanel',
    storeDescription: 'Timeless elegance and sophisticated luxury fashion.',
    storeSlug: 'chanel-official',
    category: 'Fashion',
    website: 'https://chanel.com',
    phone: '+33 1 44 50 73 00',
    email: 'contact@chanel.com',
    address: '135 Avenue Charles de Gaulle, 92200 Neuilly-sur-Seine, France',

    // Business Information
    businessName: 'Chanel S.A.',
    taxId: 'FR12345678901',
    businessLicense: 'BL-2023-001',

    // Payment Settings
    paymentMethods: ['credit_card', 'paypal', 'bank_transfer'],
    currency: 'USD',
    taxRate: 8.5,

    // Shipping Settings
    freeShippingThreshold: 500,
    standardShippingCost: 25,
    expressShippingCost: 50,
    internationalShipping: true,

    // Notification Settings
    emailNotifications: {
      newOrders: true,
      lowStock: true,
      customerMessages: true,
      promotions: false,
    },
    smsNotifications: {
      urgentAlerts: true,
      dailySummary: false,
    },

    // Store Policies
    returnPolicy: '30-day return policy for all items in original condition.',
    shippingPolicy:
      'Free shipping on orders over $500. Express shipping available.',
    privacyPolicy:
      'We protect your personal information and never share it with third parties.',

    // SEO Settings
    metaTitle: 'Chanel - Luxury Fashion & Accessories',
    metaDescription:
      'Discover timeless elegance with Chanel luxury fashion and accessories.',
    keywords: 'chanel, luxury fashion, designer bags, haute couture',

    // API Settings
    apiKey: 'sk_live_51234567890abcdef',
    webhookUrl: 'https://api.chanel.com/webhooks',

    // Store Status
    storeStatus: 'ACTIVE',
    maintenanceMode: false,
    vacationMode: false,
    vacationMessage: '',

    // Store Images
    logoUrl: '',
    coverImageUrl: '',
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      try {
        const [settingsResult, statsResult] = await Promise.all([
          getMerchantSettingsAction(),
          getMerchantStatisticsAction(),
        ]);

        if (settingsResult.success && settingsResult.data) {
          const settings = settingsResult.data;
          setStoreSettings({
            // Store Information
            storeName: settings.storeName,
            storeDescription: settings.storeDescription,
            storeSlug: settings.storeSlug,
            category: settings.category,
            website: settings.website || '',
            phone: settings.phone,
            email: settings.email,
            address: settings.address,

            // Business Information
            businessName: settings.businessName || settings.storeName,
            taxId: settings.taxId || '',
            businessLicense: settings.businessLicense || '',

            // Payment Settings
            paymentMethods: settings.paymentMethods || [
              'credit_card',
              'paypal',
            ],
            currency: settings.currency || 'USD',
            taxRate: settings.taxRate || 8.5,

            // Shipping Settings
            freeShippingThreshold: settings.freeShippingThreshold || 500,
            standardShippingCost: settings.standardShippingCost || 25,
            expressShippingCost: settings.expressShippingCost || 50,
            internationalShipping: settings.internationalShipping ?? true,

            // Notification Settings
            emailNotifications: {
              newOrders: settings.emailNewOrders ?? true,
              lowStock: settings.emailLowStock ?? true,
              customerMessages: settings.emailCustomerMessages ?? true,
              promotions: settings.emailPromotions ?? false,
            },
            smsNotifications: {
              urgentAlerts: settings.smsUrgentAlerts ?? true,
              dailySummary: settings.smsDailySummary ?? false,
            },

            // Store Policies
            returnPolicy:
              settings.returnPolicy ||
              '30-day return policy for all items in original condition.',
            shippingPolicy:
              settings.shippingPolicy ||
              'Free shipping on orders over $500. Express shipping available.',
            privacyPolicy:
              settings.privacyPolicy ||
              'We protect your personal information and never share it with third parties.',

            // SEO Settings
            metaTitle:
              settings.metaTitle ||
              `${settings.storeName} - Luxury Fashion & Accessories`,
            metaDescription:
              settings.metaDescription || settings.storeDescription,
            keywords:
              settings.keywords ||
              `${settings.storeName.toLowerCase()}, luxury fashion, designer`,

            // API Settings (mock data for now)
            apiKey: 'sk_live_••••••••••••••••',
            webhookUrl: `https://api.${settings.storeSlug}.com/webhooks`,

            // Store Status
            storeStatus: settings.status,
            maintenanceMode: settings.maintenanceMode,
            vacationMode: settings.vacationMode,
            vacationMessage: settings.vacationMessage || '',

            // Store Images
            logoUrl: settings.logo || settings.image || '', // Use logo first, fallback to image
            coverImageUrl: settings.coverImage || '',
          });
        } else {
          toast.error(settingsResult.error || 'Failed to load settings');
        }

        if (statsResult.success && statsResult.data) {
          setStatistics(statsResult.data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load merchant data');
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (section: string, field: string, value: any) => {
    setStoreSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as any),
        [field]: value,
      },
    }));
  };

  const handleDirectChange = (field: string, value: any) => {
    setStoreSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        storeName: storeSettings.storeName,
        storeDescription: storeSettings.storeDescription,
        storeSlug: storeSettings.storeSlug,
        category: storeSettings.category,
        website: storeSettings.website,
        phone: storeSettings.phone,
        email: storeSettings.email,
        address: storeSettings.address,
        businessName: storeSettings.businessName,
        taxId: storeSettings.taxId,
        businessLicense: storeSettings.businessLicense,
        founded: '2020-01-01', // Using default for now
        status: storeSettings.storeStatus,
        maintenanceMode: storeSettings.maintenanceMode,
        vacationMode: storeSettings.vacationMode,
        vacationMessage: storeSettings.vacationMessage,
        metaTitle: storeSettings.metaTitle,
        metaDescription: storeSettings.metaDescription,
        keywords: storeSettings.keywords,
      };

      const result = await updateMerchantSettingsAction(updateData);

      if (result.success) {
        toast.success(result.message || 'Settings updated successfully');
        setIsEditing(false);
      } else {
        toast.error(result.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportSettings = async () => {
    try {
      const result = await exportMerchantSettingsAction();

      if (result.success && result.data) {
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(result.data.json)}`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', result.data.filename);
        linkElement.click();
        toast.success('Settings exported successfully');
      } else {
        toast.error(result.error || 'Failed to export settings');
      }
    } catch (error) {
      console.error('Error exporting settings:', error);
      toast.error('Failed to export settings');
    }
  };

  const handleRefresh = async (showMessage = true) => {
    try {
      const [settingsResult, statsResult] = await Promise.all([
        getMerchantSettingsAction(),
        getMerchantStatisticsAction(),
      ]);

      if (settingsResult.success && settingsResult.data) {
        // Update settings with fresh data
        const settings = settingsResult.data;
        setStoreSettings(prev => ({
          ...prev,
          // Store Information
          storeName: settings.storeName,
          storeDescription: settings.storeDescription,
          storeSlug: settings.storeSlug,
          category: settings.category,
          website: settings.website || '',
          phone: settings.phone,
          email: settings.email,
          address: settings.address,

          // Business Information
          businessName: settings.businessName || settings.storeName,
          taxId: settings.taxId || '',
          businessLicense: settings.businessLicense || '',

          // Payment Settings
          paymentMethods: settings.paymentMethods || prev.paymentMethods,
          currency: settings.currency || prev.currency,
          taxRate: settings.taxRate || prev.taxRate,

          // Shipping Settings
          freeShippingThreshold:
            settings.freeShippingThreshold || prev.freeShippingThreshold,
          standardShippingCost:
            settings.standardShippingCost || prev.standardShippingCost,
          expressShippingCost:
            settings.expressShippingCost || prev.expressShippingCost,
          internationalShipping:
            settings.internationalShipping ?? prev.internationalShipping,

          // Notification Settings
          emailNotifications: {
            newOrders:
              settings.emailNewOrders ?? prev.emailNotifications.newOrders,
            lowStock:
              settings.emailLowStock ?? prev.emailNotifications.lowStock,
            customerMessages:
              settings.emailCustomerMessages ??
              prev.emailNotifications.customerMessages,
            promotions:
              settings.emailPromotions ?? prev.emailNotifications.promotions,
          },
          smsNotifications: {
            urgentAlerts:
              settings.smsUrgentAlerts ?? prev.smsNotifications.urgentAlerts,
            dailySummary:
              settings.smsDailySummary ?? prev.smsNotifications.dailySummary,
          },

          // Store Policies
          returnPolicy: settings.returnPolicy || prev.returnPolicy,
          shippingPolicy: settings.shippingPolicy || prev.shippingPolicy,
          privacyPolicy: settings.privacyPolicy || prev.privacyPolicy,

          // Store Status
          storeStatus: settings.status,
          maintenanceMode: settings.maintenanceMode,
          vacationMode: settings.vacationMode,
          vacationMessage: settings.vacationMessage || '',

          // Store Images
          logoUrl: settings.logo || settings.image || '',
          coverImageUrl: settings.coverImage || '',
        }));
      }

      if (statsResult.success && statsResult.data) {
        setStatistics(statsResult.data);
      }

      if (showMessage) {
        toast.success('Data refreshed successfully');
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      if (showMessage) {
        toast.error('Failed to refresh data');
      }
    }
  };

  const handleImageUpload = async (imageType: 'logo' | 'cover', file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const result = await uploadMerchantImageAction(imageType, formData);

      if (result.success && result.data) {
        toast.success(result.data.message);
        // Update the store settings with the new image URL
        if (imageType === 'logo') {
          setStoreSettings(prev => ({
            ...prev,
            logoUrl: result.data.imageUrl,
          }));
        } else {
          setStoreSettings(prev => ({
            ...prev,
            coverImageUrl: result.data.imageUrl,
          }));
        }
      } else {
        toast.error(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleLogoUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleImageUpload('logo', file);
      }
    };
    input.click();
  };

  const handlePaymentSave = async () => {
    console.log('Payment save clicked');
    console.log('Payment update data:', {
      paymentMethods: storeSettings.paymentMethods,
      currency: storeSettings.currency,
      taxRate: storeSettings.taxRate,
    });
    setIsLoading(true);
    try {
      const updateData = {
        paymentMethods: storeSettings.paymentMethods,
        currency: storeSettings.currency,
        taxRate: storeSettings.taxRate,
      };

      const result = await updatePaymentSettingsAction(updateData);

      if (result.success) {
        toast.success(
          result.message || 'Payment settings updated successfully'
        );
        // Refresh data to show changes
        await handleRefresh(false);
      } else {
        toast.error(result.error || 'Failed to save payment settings');
      }
    } catch (error) {
      console.error('Error saving payment settings:', error);
      toast.error('Failed to save payment settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShippingSave = async () => {
    console.log('Shipping save clicked');
    console.log('Shipping update data:', {
      freeShippingThreshold: storeSettings.freeShippingThreshold,
      standardShippingCost: storeSettings.standardShippingCost,
      expressShippingCost: storeSettings.expressShippingCost,
      internationalShipping: storeSettings.internationalShipping,
    });
    setIsLoading(true);
    try {
      const updateData = {
        freeShippingThreshold: storeSettings.freeShippingThreshold,
        standardShippingCost: storeSettings.standardShippingCost,
        expressShippingCost: storeSettings.expressShippingCost,
        internationalShipping: storeSettings.internationalShipping,
      };

      const result = await updateShippingSettingsAction(updateData);

      if (result.success) {
        toast.success(
          result.message || 'Shipping settings updated successfully'
        );
        // Refresh data to show changes
        await handleRefresh(false);
      } else {
        toast.error(result.error || 'Failed to save shipping settings');
      }
    } catch (error) {
      console.error('Error saving shipping settings:', error);
      toast.error('Failed to save shipping settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationsSave = async () => {
    console.log('Notifications save clicked');
    console.log('Notifications update data:', {
      emailNewOrders: storeSettings.emailNotifications.newOrders,
      emailLowStock: storeSettings.emailNotifications.lowStock,
      emailCustomerMessages: storeSettings.emailNotifications.customerMessages,
      emailPromotions: storeSettings.emailNotifications.promotions,
      smsUrgentAlerts: storeSettings.smsNotifications.urgentAlerts,
      smsDailySummary: storeSettings.smsNotifications.dailySummary,
    });
    setIsLoading(true);
    try {
      const updateData = {
        emailNewOrders: storeSettings.emailNotifications.newOrders,
        emailLowStock: storeSettings.emailNotifications.lowStock,
        emailCustomerMessages:
          storeSettings.emailNotifications.customerMessages,
        emailPromotions: storeSettings.emailNotifications.promotions,
        smsUrgentAlerts: storeSettings.smsNotifications.urgentAlerts,
        smsDailySummary: storeSettings.smsNotifications.dailySummary,
      };

      const result = await updateNotificationSettingsAction(updateData);

      if (result.success) {
        toast.success(
          result.message || 'Notification settings updated successfully'
        );
        // Refresh data to show changes
        await handleRefresh(false);
      } else {
        toast.error(result.error || 'Failed to save notification settings');
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error('Failed to save notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePoliciesSave = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        returnPolicy: storeSettings.returnPolicy,
        shippingPolicy: storeSettings.shippingPolicy,
        privacyPolicy: storeSettings.privacyPolicy,
        metaTitle: storeSettings.metaTitle,
        metaDescription: storeSettings.metaDescription,
        keywords: storeSettings.keywords,
      };

      const result = await updatePolicySettingsAction(updateData);

      if (result.success) {
        toast.success(result.message || 'Policy settings updated successfully');
        // Refresh data to show changes
        await handleRefresh(false);
      } else {
        toast.error(result.error || 'Failed to save policy settings');
      }
    } catch (error) {
      console.error('Error saving policy settings:', error);
      toast.error('Failed to save policy settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdvancedSave = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        maintenanceMode: storeSettings.maintenanceMode,
        vacationMode: storeSettings.vacationMode,
        vacationMessage: storeSettings.vacationMessage,
        apiKey: storeSettings.apiKey,
        webhookUrl: storeSettings.webhookUrl,
      };

      const result = await updateAdvancedSettingsAction(updateData);

      if (result.success) {
        toast.success(
          result.message || 'Advanced settings updated successfully'
        );
        // Refresh data to show changes
        await handleRefresh(false);
      } else {
        toast.error(result.error || 'Failed to save advanced settings');
      }
    } catch (error) {
      console.error('Error saving advanced settings:', error);
      toast.error('Failed to save advanced settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDangerousAction = async (action: 'deactivate' | 'delete') => {
    const confirmMessage =
      action === 'deactivate'
        ? 'Are you sure you want to deactivate your store? Your products will be hidden from customers.'
        : 'Are you sure you want to delete your store? This action cannot be undone and will permanently remove all your data.';

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      if (action === 'deactivate') {
        const result = await deactivateMerchantAction();
        if (result.success) {
          toast.success(result.message || 'Store deactivated successfully');
          setStoreSettings(prev => ({ ...prev, storeStatus: 'SUSPENDED' }));
        } else {
          toast.error(result.error || 'Failed to deactivate store');
        }
      } else {
        // Delete action will redirect, so no need to handle response
        await deleteMerchantAction();
      }
    } catch (error) {
      console.error(`Error ${action}ing merchant:`, error);
      toast.error(`Failed to ${action} store`);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 w-full flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading merchant settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Store Settings
              </h1>
              <p className="text-gray-600">
                Manage your store configuration and preferences
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsLoading(true);
                  handleRefresh(true).finally(() => setIsLoading(false));
                }}
                disabled={isLoading || isLoadingData}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" onClick={handleExportSettings}>
                <Download className="h-4 w-4 mr-2" />
                Export Settings
              </Button>
              <Button
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                disabled={isLoading}
                className={isEditing ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </>
                ) : (
                  'Edit Settings'
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="store" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="store">Store Info</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="store" className="mt-6">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Store Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="storeName">Store Name</Label>
                          <Input
                            id="storeName"
                            value={storeSettings.storeName}
                            onChange={e =>
                              handleDirectChange('storeName', e.target.value)
                            }
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="storeSlug">Store URL Slug</Label>
                          <Input
                            id="storeSlug"
                            value={storeSettings.storeSlug}
                            onChange={e => {
                              const slug = e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9-]/g, '-')
                                .replace(/-+/g, '-');
                              handleDirectChange('storeSlug', slug);
                            }}
                            disabled={!isEditing}
                            placeholder="my-store-name"
                          />
                          <p className="text-xs text-gray-500">
                            This will be your store URL: yourstore.com/store/
                            {storeSettings.storeSlug}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="storeDescription">
                          Store Description
                        </Label>
                        <Textarea
                          id="storeDescription"
                          value={storeSettings.storeDescription}
                          onChange={e =>
                            handleDirectChange(
                              'storeDescription',
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={storeSettings.category}
                            onValueChange={value =>
                              handleDirectChange('category', value)
                            }
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Fashion">Fashion</SelectItem>
                              <SelectItem value="Jewelry">Jewelry</SelectItem>
                              <SelectItem value="Watches">Watches</SelectItem>
                              <SelectItem value="Beauty">Beauty</SelectItem>
                              <SelectItem value="Home">Home & Decor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={storeSettings.website}
                            onChange={e =>
                              handleDirectChange('website', e.target.value)
                            }
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              id="email"
                              value={storeSettings.email}
                              onChange={e =>
                                handleDirectChange('email', e.target.value)
                              }
                              disabled={!isEditing}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              id="phone"
                              value={storeSettings.phone}
                              onChange={e =>
                                handleDirectChange('phone', e.target.value)
                              }
                              disabled={!isEditing}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Business Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                          <Textarea
                            id="address"
                            value={storeSettings.address}
                            onChange={e =>
                              handleDirectChange('address', e.target.value)
                            }
                            disabled={!isEditing}
                            className="pl-10"
                            rows={2}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Business Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Business Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">
                          Legal Business Name
                        </Label>
                        <Input
                          id="businessName"
                          value={storeSettings.businessName}
                          onChange={e =>
                            handleDirectChange('businessName', e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="taxId">Tax ID</Label>
                          <Input
                            id="taxId"
                            value={storeSettings.taxId}
                            onChange={e =>
                              handleDirectChange('taxId', e.target.value)
                            }
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="businessLicense">
                            Business License
                          </Label>
                          <Input
                            id="businessLicense"
                            value={storeSettings.businessLicense}
                            onChange={e =>
                              handleDirectChange(
                                'businessLicense',
                                e.target.value
                              )
                            }
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Store Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Store Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="storeStatus">Store Status</Label>
                        <Badge
                          className={
                            storeSettings.storeStatus === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {storeSettings.storeStatus}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="maintenanceMode">
                          Maintenance Mode
                        </Label>
                        <Switch
                          id="maintenanceMode"
                          checked={storeSettings.maintenanceMode}
                          onCheckedChange={checked =>
                            handleDirectChange('maintenanceMode', checked)
                          }
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="vacationMode">Vacation Mode</Label>
                        <Switch
                          id="vacationMode"
                          checked={storeSettings.vacationMode}
                          onCheckedChange={checked =>
                            handleDirectChange('vacationMode', checked)
                          }
                          disabled={!isEditing}
                        />
                      </div>

                      {storeSettings.vacationMode && (
                        <div className="space-y-2">
                          <Label htmlFor="vacationMessage">
                            Vacation Message
                          </Label>
                          <Textarea
                            id="vacationMessage"
                            value={storeSettings.vacationMessage}
                            onChange={e =>
                              handleDirectChange(
                                'vacationMessage',
                                e.target.value
                              )
                            }
                            disabled={!isEditing}
                            rows={3}
                            placeholder="We're temporarily closed..."
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Store Logo */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Store Logo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                          {storeSettings.logoUrl ? (
                            <img
                              src={storeSettings.logoUrl}
                              alt="Store Logo"
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <Store className="h-12 w-12 text-gray-400" />
                          )}
                        </div>
                        <Button
                          variant="outline"
                          disabled={!isEditing}
                          onClick={handleLogoUploadClick}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {storeSettings.logoUrl
                            ? 'Change Logo'
                            : 'Upload Logo'}
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">
                          Recommended: 200x200px, PNG or JPG (max 5MB)
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="payment" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Methods</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        {
                          id: 'credit_card',
                          label: 'Credit/Debit Cards',
                          icon: CreditCard,
                        },
                        { id: 'paypal', label: 'PayPal', icon: Globe },
                        {
                          id: 'bank_transfer',
                          label: 'Bank Transfer',
                          icon: CreditCard,
                        },
                      ].map(method => (
                        <div
                          key={method.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <method.icon className="h-5 w-5 text-gray-600" />
                            <span>{method.label}</span>
                          </div>
                          <Switch
                            checked={storeSettings.paymentMethods.includes(
                              method.id
                            )}
                            onCheckedChange={checked => {
                              const methods = checked
                                ? [...storeSettings.paymentMethods, method.id]
                                : storeSettings.paymentMethods.filter(
                                    m => m !== method.id
                                  );
                              handleDirectChange('paymentMethods', methods);
                            }}
                            disabled={!isEditing}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Currency & Tax Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="currency">Default Currency</Label>
                        <Select
                          value={storeSettings.currency}
                          onValueChange={value =>
                            handleDirectChange('currency', value)
                          }
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">
                              GBP - British Pound
                            </SelectItem>
                            <SelectItem value="JPY">
                              JPY - Japanese Yen
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="taxRate">Tax Rate (%)</Label>
                        <Input
                          id="taxRate"
                          type="number"
                          value={storeSettings.taxRate}
                          onChange={e =>
                            handleDirectChange(
                              'taxRate',
                              parseFloat(e.target.value)
                            )
                          }
                          disabled={!isEditing}
                          step="0.1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handlePaymentSave} disabled={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Payment Settings
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="shipping" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="freeShippingThreshold">
                          Free Shipping Threshold ($)
                        </Label>
                        <Input
                          id="freeShippingThreshold"
                          type="number"
                          value={storeSettings.freeShippingThreshold}
                          onChange={e =>
                            handleDirectChange(
                              'freeShippingThreshold',
                              parseInt(e.target.value)
                            )
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="standardShippingCost">
                          Standard Shipping ($)
                        </Label>
                        <Input
                          id="standardShippingCost"
                          type="number"
                          value={storeSettings.standardShippingCost}
                          onChange={e =>
                            handleDirectChange(
                              'standardShippingCost',
                              parseInt(e.target.value)
                            )
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expressShippingCost">
                          Express Shipping ($)
                        </Label>
                        <Input
                          id="expressShippingCost"
                          type="number"
                          value={storeSettings.expressShippingCost}
                          onChange={e =>
                            handleDirectChange(
                              'expressShippingCost',
                              parseInt(e.target.value)
                            )
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="internationalShipping">
                          International Shipping
                        </Label>
                        <p className="text-sm text-gray-600">
                          Allow shipping to international destinations
                        </p>
                      </div>
                      <Switch
                        id="internationalShipping"
                        checked={storeSettings.internationalShipping}
                        onCheckedChange={checked =>
                          handleDirectChange('internationalShipping', checked)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Save Button */}
                {isEditing && (
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleShippingSave} disabled={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Shipping Settings
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="notifications" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Email Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(storeSettings.emailNotifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <Label className="capitalize">
                                {key.replace(/([A-Z])/g, ' $1')}
                              </Label>
                              <p className="text-sm text-gray-600">
                                {key === 'newOrders' &&
                                  'Get notified when you receive new orders'}
                                {key === 'lowStock' &&
                                  'Alert when product inventory is running low'}
                                {key === 'customerMessages' &&
                                  'Notifications for customer inquiries'}
                                {key === 'promotions' &&
                                  'Marketing and promotional updates'}
                              </p>
                            </div>
                            <Switch
                              checked={value}
                              onCheckedChange={checked =>
                                handleInputChange(
                                  'emailNotifications',
                                  key,
                                  checked
                                )
                              }
                              disabled={!isEditing}
                            />
                          </div>
                        )
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>SMS Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(storeSettings.smsNotifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <Label className="capitalize">
                                {key.replace(/([A-Z])/g, ' $1')}
                              </Label>
                              <p className="text-sm text-gray-600">
                                {key === 'urgentAlerts' &&
                                  'Critical alerts and urgent notifications'}
                                {key === 'dailySummary' &&
                                  'Daily summary of store activity'}
                              </p>
                            </div>
                            <Switch
                              checked={value}
                              onCheckedChange={checked =>
                                handleInputChange(
                                  'smsNotifications',
                                  key,
                                  checked
                                )
                              }
                              disabled={!isEditing}
                            />
                          </div>
                        )
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={handleNotificationsSave}
                      disabled={isLoading}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Notification Settings
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="policies" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Store Policies</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="returnPolicy">Return Policy</Label>
                        <Textarea
                          id="returnPolicy"
                          value={storeSettings.returnPolicy}
                          onChange={e =>
                            handleDirectChange('returnPolicy', e.target.value)
                          }
                          disabled={!isEditing}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="shippingPolicy">Shipping Policy</Label>
                        <Textarea
                          id="shippingPolicy"
                          value={storeSettings.shippingPolicy}
                          onChange={e =>
                            handleDirectChange('shippingPolicy', e.target.value)
                          }
                          disabled={!isEditing}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="privacyPolicy">Privacy Policy</Label>
                        <Textarea
                          id="privacyPolicy"
                          value={storeSettings.privacyPolicy}
                          onChange={e =>
                            handleDirectChange('privacyPolicy', e.target.value)
                          }
                          disabled={!isEditing}
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>SEO Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="metaTitle">Meta Title</Label>
                        <Input
                          id="metaTitle"
                          value={storeSettings.metaTitle}
                          onChange={e =>
                            handleDirectChange('metaTitle', e.target.value)
                          }
                          disabled={!isEditing}
                        />
                        <p className="text-xs text-gray-500">
                          Recommended: 50-60 characters
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="metaDescription">
                          Meta Description
                        </Label>
                        <Textarea
                          id="metaDescription"
                          value={storeSettings.metaDescription}
                          onChange={e =>
                            handleDirectChange(
                              'metaDescription',
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          rows={3}
                        />
                        <p className="text-xs text-gray-500">
                          Recommended: 150-160 characters
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="keywords">Keywords</Label>
                        <Input
                          id="keywords"
                          value={storeSettings.keywords}
                          onChange={e =>
                            handleDirectChange('keywords', e.target.value)
                          }
                          disabled={!isEditing}
                          placeholder="keyword1, keyword2, keyword3"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handlePoliciesSave} disabled={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Policy Settings
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="advanced" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>API Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="apiKey">API Key</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="apiKey"
                            type={showApiKey ? 'text' : 'password'}
                            value={storeSettings.apiKey}
                            onChange={e =>
                              handleDirectChange('apiKey', e.target.value)
                            }
                            disabled={!isEditing}
                            placeholder="sk_live_••••••••••••••••"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowApiKey(!showApiKey)}
                            type="button"
                          >
                            {showApiKey ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="webhookUrl">Webhook URL</Label>
                        <Input
                          id="webhookUrl"
                          value={storeSettings.webhookUrl}
                          onChange={e =>
                            handleDirectChange('webhookUrl', e.target.value)
                          }
                          disabled={!isEditing}
                          placeholder="https://api.yourstore.com/webhooks"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Store Modes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <Label htmlFor="maintenanceMode">
                            Maintenance Mode
                          </Label>
                          <p className="text-sm text-gray-600">
                            Temporarily disable your store for maintenance
                          </p>
                        </div>
                        <Switch
                          id="maintenanceMode"
                          checked={storeSettings.maintenanceMode}
                          onCheckedChange={checked =>
                            handleDirectChange('maintenanceMode', checked)
                          }
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <Label htmlFor="vacationMode">Vacation Mode</Label>
                          <p className="text-sm text-gray-600">
                            Temporarily close your store for vacation
                          </p>
                        </div>
                        <Switch
                          id="vacationMode"
                          checked={storeSettings.vacationMode}
                          onCheckedChange={checked =>
                            handleDirectChange('vacationMode', checked)
                          }
                          disabled={!isEditing}
                        />
                      </div>

                      {storeSettings.vacationMode && (
                        <div className="space-y-2 ml-4">
                          <Label htmlFor="vacationMessage">
                            Vacation Message
                          </Label>
                          <Textarea
                            id="vacationMessage"
                            value={storeSettings.vacationMessage}
                            onChange={e =>
                              handleDirectChange(
                                'vacationMessage',
                                e.target.value
                              )
                            }
                            disabled={!isEditing}
                            rows={3}
                            placeholder="We're temporarily closed for vacation. We'll be back soon!"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Save Button */}
                  {isEditing && (
                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleAdvancedSave} disabled={isLoading}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Advanced Settings
                      </Button>
                    </div>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle>Danger Zone</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                        <h4 className="font-medium text-red-900 mb-2">
                          Deactivate Store
                        </h4>
                        <p className="text-sm text-red-700 mb-4">
                          Temporarily deactivate your store. Your products will
                          be hidden from customers.
                        </p>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDangerousAction('deactivate')}
                          disabled={storeSettings.storeStatus === 'SUSPENDED'}
                        >
                          {storeSettings.storeStatus === 'SUSPENDED'
                            ? 'Already Deactivated'
                            : 'Deactivate Store'}
                        </Button>
                      </div>

                      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                        <h4 className="font-medium text-red-900 mb-2">
                          Delete Store
                        </h4>
                        <p className="text-sm text-red-700 mb-4">
                          Permanently delete your store and all associated data.
                          This action cannot be undone.
                        </p>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDangerousAction('delete')}
                        >
                          Delete Store
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
