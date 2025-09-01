"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

const Page: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const [storeSettings, setStoreSettings] = useState({
    // Store Information
    storeName: "Chanel",
    storeDescription: "Timeless elegance and sophisticated luxury fashion.",
    storeSlug: "chanel-official",
    category: "Fashion",
    website: "https://chanel.com",
    phone: "+33 1 44 50 73 00",
    email: "contact@chanel.com",
    address: "135 Avenue Charles de Gaulle, 92200 Neuilly-sur-Seine, France",

    // Business Information
    businessName: "Chanel S.A.",
    taxId: "FR12345678901",
    businessLicense: "BL-2023-001",

    // Payment Settings
    paymentMethods: ["credit_card", "paypal", "bank_transfer"],
    currency: "USD",
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
    returnPolicy: "30-day return policy for all items in original condition.",
    shippingPolicy:
      "Free shipping on orders over $500. Express shipping available.",
    privacyPolicy:
      "We protect your personal information and never share it with third parties.",

    // SEO Settings
    metaTitle: "Chanel - Luxury Fashion & Accessories",
    metaDescription:
      "Discover timeless elegance with Chanel luxury fashion and accessories.",
    keywords: "chanel, luxury fashion, designer bags, haute couture",

    // API Settings
    apiKey: "sk_live_51234567890abcdef",
    webhookUrl: "https://api.chanel.com/webhooks",

    // Store Status
    storeStatus: "ACTIVE",
    maintenanceMode: false,
    vacationMode: false,
    vacationMessage: "",
  });

  const handleInputChange = (section: string, field: string, value: any) => {
    setStoreSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleDirectChange = (field: string, value: any) => {
    setStoreSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Here you would save it to your API
    console.log("Saving store settings:", storeSettings);
    setIsEditing(false);
  };

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
            <Button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className={isEditing ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                "Edit Settings"
              )}
            </Button>
          </div>
        </div>

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
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
                          onChange={(e) =>
                            handleDirectChange("storeName", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="storeSlug">Store URL Slug</Label>
                        <Input
                          id="storeSlug"
                          value={storeSettings.storeSlug}
                          onChange={(e) =>
                            handleDirectChange("storeSlug", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="storeDescription">
                        Store Description
                      </Label>
                      <Textarea
                        id="storeDescription"
                        value={storeSettings.storeDescription}
                        onChange={(e) =>
                          handleDirectChange("storeDescription", e.target.value)
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
                          onValueChange={(value) =>
                            handleDirectChange("category", value)
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
                          onChange={(e) =>
                            handleDirectChange("website", e.target.value)
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
                            onChange={(e) =>
                              handleDirectChange("email", e.target.value)
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
                            onChange={(e) =>
                              handleDirectChange("phone", e.target.value)
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
                          onChange={(e) =>
                            handleDirectChange("address", e.target.value)
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
                      <Label htmlFor="businessName">Legal Business Name</Label>
                      <Input
                        id="businessName"
                        value={storeSettings.businessName}
                        onChange={(e) =>
                          handleDirectChange("businessName", e.target.value)
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
                          onChange={(e) =>
                            handleDirectChange("taxId", e.target.value)
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
                          onChange={(e) =>
                            handleDirectChange(
                              "businessLicense",
                              e.target.value,
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
                          storeSettings.storeStatus === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {storeSettings.storeStatus}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <Switch
                        id="maintenanceMode"
                        checked={storeSettings.maintenanceMode}
                        onCheckedChange={(checked) =>
                          handleDirectChange("maintenanceMode", checked)
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="vacationMode">Vacation Mode</Label>
                      <Switch
                        id="vacationMode"
                        checked={storeSettings.vacationMode}
                        onCheckedChange={(checked) =>
                          handleDirectChange("vacationMode", checked)
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
                          onChange={(e) =>
                            handleDirectChange(
                              "vacationMessage",
                              e.target.value,
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
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Store className="h-12 w-12 text-gray-400" />
                      </div>
                      <Button variant="outline" disabled={!isEditing}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        Recommended: 200x200px, PNG or JPG
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
                      id: "credit_card",
                      label: "Credit/Debit Cards",
                      icon: CreditCard,
                    },
                    { id: "paypal", label: "PayPal", icon: Globe },
                    {
                      id: "bank_transfer",
                      label: "Bank Transfer",
                      icon: CreditCard,
                    },
                  ].map((method) => (
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
                          method.id,
                        )}
                        onCheckedChange={(checked) => {
                          const methods = checked
                            ? [...storeSettings.paymentMethods, method.id]
                            : storeSettings.paymentMethods.filter(
                                (m) => m !== method.id,
                              );
                          handleDirectChange("paymentMethods", methods);
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
                      onValueChange={(value) =>
                        handleDirectChange("currency", value)
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      value={storeSettings.taxRate}
                      onChange={(e) =>
                        handleDirectChange(
                          "taxRate",
                          parseFloat(e.target.value),
                        )
                      }
                      disabled={!isEditing}
                      step="0.1"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
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
                      onChange={(e) =>
                        handleDirectChange(
                          "freeShippingThreshold",
                          parseInt(e.target.value),
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
                      onChange={(e) =>
                        handleDirectChange(
                          "standardShippingCost",
                          parseInt(e.target.value),
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
                      onChange={(e) =>
                        handleDirectChange(
                          "expressShippingCost",
                          parseInt(e.target.value),
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
                    onCheckedChange={(checked) =>
                      handleDirectChange("internationalShipping", checked)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
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
                            {key.replace(/([A-Z])/g, " $1")}
                          </Label>
                          <p className="text-sm text-gray-600">
                            {key === "newOrders" &&
                              "Get notified when you receive new orders"}
                            {key === "lowStock" &&
                              "Alert when product inventory is running low"}
                            {key === "customerMessages" &&
                              "Notifications for customer inquiries"}
                            {key === "promotions" &&
                              "Marketing and promotional updates"}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) =>
                            handleInputChange(
                              "emailNotifications",
                              key,
                              checked,
                            )
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    ),
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
                            {key.replace(/([A-Z])/g, " $1")}
                          </Label>
                          <p className="text-sm text-gray-600">
                            {key === "urgentAlerts" &&
                              "Critical alerts and urgent notifications"}
                            {key === "dailySummary" &&
                              "Daily summary of store activity"}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) =>
                            handleInputChange("smsNotifications", key, checked)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    ),
                  )}
                </CardContent>
              </Card>
            </div>
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
                      onChange={(e) =>
                        handleDirectChange("returnPolicy", e.target.value)
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
                      onChange={(e) =>
                        handleDirectChange("shippingPolicy", e.target.value)
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
                      onChange={(e) =>
                        handleDirectChange("privacyPolicy", e.target.value)
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
                      onChange={(e) =>
                        handleDirectChange("metaTitle", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                    <p className="text-xs text-gray-500">
                      Recommended: 50-60 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={storeSettings.metaDescription}
                      onChange={(e) =>
                        handleDirectChange("metaDescription", e.target.value)
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
                      onChange={(e) =>
                        handleDirectChange("keywords", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="apiKey"
                        type={showApiKey ? "text" : "password"}
                        value={storeSettings.apiKey}
                        onChange={(e) =>
                          handleDirectChange("apiKey", e.target.value)
                        }
                        disabled={!isEditing}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
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
                      onChange={(e) =>
                        handleDirectChange("webhookUrl", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>

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
                      Temporarily deactivate your store. Your products will be
                      hidden from customers.
                    </p>
                    <Button variant="destructive" size="sm">
                      Deactivate Store
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
                    <Button variant="destructive" size="sm">
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
  );
};

export default Page;
