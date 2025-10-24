'use client';

import { format } from 'date-fns';
import { Calendar, Shield, Edit, ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { PageLoader } from '@/components/PageLoader';
import { PasswordForm } from '@/components/PasswordForm';
import { ProfileForm } from '@/components/ProfileForm';
import { ProfilePictureUpload } from '@/components/ProfilePictureUpload';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { emailNotifications } from '@/constants';
import { updateProfileImageAction } from '@/lib/actions/profile';
import type { UserProfile } from '@/types';

interface UserPreferences {
  [key: string]: boolean;
}

const Page = () => {
  const { status } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(
            '/api/profile?action=getEditProfileData'
          );
          if (!response.ok) throw new Error('Failed to fetch profile data');
          const data = await response.json();
          setUser(data.user);
          setPreferences(data.preferences);
        } catch (error) {
          console.error(error);
          toast.error('Could not load your profile.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [status]);

  const handlePreferenceChange = (field: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileSuccess = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleImageChange = async (imagePath: string) => {
    try {
      const result = await updateProfileImageAction(imagePath);
      if (result.success && result.data) {
        setUser(result.data);
        toast.success('Profile picture updated successfully!');
      } else {
        toast.error(result.error || 'Failed to update profile picture');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error('Failed to update profile picture');
    }
  };

  const handleSavePreferences = () => {
    // TODO: Add API call to update preferences
    toast.success('Preferences saved successfully!');
  };

  return (
    <>
      <PageLoader isLoading={status === 'loading' || isLoading} />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Edit Profile
            </h1>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6 text-center">
                  <ProfilePictureUpload
                    currentImage={user?.image}
                    userName={user?.fullName}
                    onImageChange={handleImageChange}
                    isLoading={isLoading}
                  />
                  <h2 className="text-xl font-bold text-gray-900 mb-2 mt-4">
                    {user?.fullName}
                  </h2>
                  <p className="text-gray-600 mb-2">{user?.email}</p>
                  <Badge className="mb-4 capitalize">{user?.role}</Badge>
                  <div className="space-y-2 text-sm text-gray-600">
                    {/* **FIX**: Conditionally render date */}
                    {user?.createdAt && (
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Member since{' '}
                          {format(new Date(user.createdAt), 'MMMM yyyy')}
                        </span>
                      </div>
                    )}
                    {user?.isVerified && (
                      <div className="flex items-center justify-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span>Verified Account</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-3">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">Profile Info</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Personal Information</CardTitle>
                        {!isEditing && (
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(true)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isEditing && user ? (
                        <ProfileForm
                          user={user}
                          onCancel={() => setIsEditing(false)}
                          onSuccess={handleProfileSuccess}
                          onImageChange={handleImageChange}
                        />
                      ) : (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-500">
                                Full Name
                              </p>
                              <p className="text-gray-900">
                                {user?.fullName || 'Not provided'}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-500">
                                Email Address
                              </p>
                              <p className="text-gray-900">
                                {user?.email || 'Not provided'}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-500">
                                Phone
                              </p>
                              <p className="text-gray-900">
                                {user?.phone || 'Not provided'}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-500">
                                Gender
                              </p>
                              <p className="text-gray-900 capitalize">
                                {user?.gender?.toLowerCase() || 'Not provided'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Update your password to keep your account secure
                        </p>
                      </CardHeader>
                      <CardContent>
                        <PasswordForm />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Two-Factor Authentication</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">Authenticator App</h4>
                            <p className="text-sm text-gray-600">
                              Use an authenticator app for additional security
                            </p>
                          </div>
                          <Button variant="outline" disabled>
                            Coming Soon
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="preferences" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Email Notifications</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Choose which email notifications you'd like to receive
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {emailNotifications.map(pref => (
                        <div
                          key={pref.key}
                          className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1 pr-4">
                            <h4 className="font-medium text-gray-900">
                              {pref.label}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {pref.description}
                            </p>
                          </div>
                          <Checkbox
                            checked={preferences[pref.key] || false}
                            onCheckedChange={checked =>
                              handlePreferenceChange(pref.key, !!checked)
                            }
                            className="mt-1"
                          />
                        </div>
                      ))}
                      <div className="flex justify-end pt-6 border-t">
                        <Button onClick={handleSavePreferences}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Preferences
                        </Button>
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
