"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Save, Lock, Bell, Globe } from "lucide-react";
import { useSession } from "next-auth/react";

import { PageLoader } from "@/components/PageLoader";
import { Checkbox } from "@/components/ui/checkbox";

const Page: React.FC = () => {
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          //   TODO: Fetch
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [status]);

  const handleSavePreference = async () => {};

  const recentActivity = [
    {
      action: "Approved merchant application",
      target: "Luxury Timepieces Co.",
      time: "2 hours ago",
    },
    {
      action: "Updated platform settings",
      target: "Security policies",
      time: "4 hours ago",
    },
    {
      action: "Reviewed product listing",
      target: "Diamond Necklace",
      time: "6 hours ago",
    },
    {
      action: "Processed user report",
      target: "User complaint #1234",
      time: "1 day ago",
    },
  ];

  return (
    <>
      <PageLoader isLoading={status === "loading" || isLoading} />
      <div className="min-h-screen bg-gray-50 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">
              Manage your administrator account and platform settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="security" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="security" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Lock className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="font-medium">Password</p>
                              <p className="text-sm text-gray-600">
                                Last changed 30 days ago
                              </p>
                            </div>
                          </div>
                          <Button variant="outline">Change Password</Button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="font-medium">
                                Two-Factor Authentication
                              </p>
                              <p className="text-sm text-gray-600">
                                Add an extra layer of security
                              </p>
                            </div>
                          </div>
                          <Button variant="outline">Enable 2FA</Button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Globe className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="font-medium">Login Sessions</p>
                              <p className="text-sm text-gray-600">
                                Manage your active sessions
                              </p>
                            </div>
                          </div>
                          <Button variant="outline">View Sessions</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        {[
                          {
                            title: "New merchant applications",
                            description:
                              "Get notified when merchants apply to join",
                          },
                          {
                            title: "High-value orders",
                            description: "Alerts for orders above $10,000",
                          },
                          {
                            title: "System alerts",
                            description: "Important platform notifications",
                          },
                          {
                            title: "User reports",
                            description: "When users report issues or content",
                          },
                          {
                            title: "Weekly reports",
                            description: "Platform performance summaries",
                          },
                        ].map((notification, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Bell className="h-5 w-5 text-gray-600" />
                              <div>
                                <p className="font-medium">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {notification.description}
                                </p>
                              </div>
                            </div>
                            <Checkbox defaultChecked />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end mt-4 space-x-2">
                        <Button
                          variant="outline"
                          onClick={handleSavePreference}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Preferences
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {activity.action}
                              </p>
                              <p className="text-sm text-gray-600">
                                {activity.target}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {activity.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
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
