"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Save, 
  Lock, 
  Bell, 
  Globe, 
  Settings,
  Database,
  Mail,
  CreditCard,
  Users,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff
} from "lucide-react";
import { useSession } from "next-auth/react";
import { PageLoader } from "@/components/PageLoader";
import { Checkbox } from "@/components/ui/checkbox";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import {
  adminActivityData,
  miniChartData
} from "@/constants/dashboard-data";

const Page: React.FC = () => {
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    platformName: "Luxora",
    platformEmail: "admin@luxora.com",
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireStrongPassword: true,
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: 365,
    analyticsEnabled: true,
    errorReporting: true,
    debugMode: false,
  });

  useEffect(() => {
    if (status === "authenticated") {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          // TODO: Fetch settings from API
        } catch (error) {
          console.error("Error fetching settings:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [status]);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // TODO: Save settings to API
      console.log("Saving settings:", settings);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'luxora-settings.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  

  return (
    <>
      <PageLoader isLoading={status === "loading" || isLoading} />
      <div className="min-h-screen bg-gray-50 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                <p className="text-gray-600">
                  Manage your administrator account and platform settings
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleExportSettings}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Settings
                </Button>
                <Button onClick={handleSaveSettings} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>

          {/* System Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="System Health"
              value="99.9%"
              change={0.1}
              changeType="positive"
              icon={<CheckCircle className="h-5 w-5" />}
              chartData={miniChartData.growth}
              color="#10B981"
              subtitle="Uptime"
            />
            <StatCard
              title="Active Users"
              value="1,247"
              change={5.2}
              changeType="positive"
              icon={<Users className="h-5 w-5" />}
              chartData={miniChartData.customers}
              color="#3B82F6"
              subtitle="Online now"
            />
            <StatCard
              title="Database Size"
              value="2.4GB"
              change={12.5}
              changeType="positive"
              icon={<Database className="h-5 w-5" />}
              chartData={miniChartData.orders}
              color="#8B5CF6"
              subtitle="Storage used"
            />
            <StatCard
              title="Last Backup"
              value="2h ago"
              change={0}
              changeType="neutral"
              icon={<Upload className="h-5 w-5" />}
              chartData={miniChartData.revenue}
              color="#F59E0B"
              subtitle="Auto backup"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        General Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="platformName">Platform Name</Label>
                          <Input
                            id="platformName"
                            value={settings.platformName}
                            onChange={(e) => setSettings({...settings, platformName: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="platformEmail">Platform Email</Label>
                          <Input
                            id="platformEmail"
                            type="email"
                            value={settings.platformEmail}
                            onChange={(e) => setSettings({...settings, platformEmail: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Globe className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="font-medium">Maintenance Mode</p>
                              <p className="text-sm text-gray-600">
                                Temporarily disable the platform for maintenance
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings.maintenanceMode}
                            onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="font-medium">User Registration</p>
                              <p className="text-sm text-gray-600">
                                Allow new users to register on the platform
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings.registrationEnabled}
                            onCheckedChange={(checked) => setSettings({...settings, registrationEnabled: checked})}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Security Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                          <Input
                            id="sessionTimeout"
                            type="number"
                            value={settings.sessionTimeout}
                            onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                          <Input
                            id="maxLoginAttempts"
                            type="number"
                            value={settings.maxLoginAttempts}
                            onChange={(e) => setSettings({...settings, maxLoginAttempts: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="font-medium">Two-Factor Authentication</p>
                              <p className="text-sm text-gray-600">
                                Require 2FA for all admin accounts
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings.twoFactorAuth}
                            onCheckedChange={(checked) => setSettings({...settings, twoFactorAuth: checked})}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Lock className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="font-medium">Strong Password Requirements</p>
                              <p className="text-sm text-gray-600">
                                Enforce complex password policies
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings.requireStrongPassword}
                            onCheckedChange={(checked) => setSettings({...settings, requireStrongPassword: checked})}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notification Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="font-medium">Email Notifications</p>
                              <p className="text-sm text-gray-600">
                                Receive notifications via email
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings.emailNotifications}
                            onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Bell className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="font-medium">SMS Notifications</p>
                              <p className="text-sm text-gray-600">
                                Receive critical alerts via SMS
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings.smsNotifications}
                            onCheckedChange={(checked) => setSettings({...settings, smsNotifications: checked})}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="system" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        System Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="dataRetention">Data Retention (days)</Label>
                          <Input
                            id="dataRetention"
                            type="number"
                            value={settings.dataRetention}
                            onChange={(e) => setSettings({...settings, dataRetention: parseInt(e.target.value)})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="backupFrequency">Backup Frequency</Label>
                          <select
                            id="backupFrequency"
                            value={settings.backupFrequency}
                            onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Database className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="font-medium">Auto Backup</p>
                              <p className="text-sm text-gray-600">
                                Automatically backup system data
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings.autoBackup}
                            onCheckedChange={(checked) => setSettings({...settings, autoBackup: checked})}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="font-medium">Error Reporting</p>
                              <p className="text-sm text-gray-600">
                                Send error reports to development team
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings.errorReporting}
                            onCheckedChange={(checked) => setSettings({...settings, errorReporting: checked})}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Settings className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="font-medium">Debug Mode</p>
                              <p className="text-sm text-gray-600">
                                Enable detailed logging and debugging
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={settings.debugMode}
                            onCheckedChange={(checked) => setSettings({...settings, debugMode: checked})}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="mt-6">
                  <ActivityFeed
                    activities={adminActivityData}
                    title="Recent Activity"
                    onViewAll={() => console.log("View all activity")}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
