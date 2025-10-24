import Link from 'next/link';

import { auth } from '@/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import config from '@/lib/config';
import { getInitials } from '@/lib/utils';

export default async function TestProfilePage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="container mx-auto p-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>No Active Session</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              You need to sign in to test profile functionality.
            </p>
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userImage = session.user.image;
  const processedImageUrl = !userImage
    ? null
    : userImage.startsWith('/profile-pictures')
      ? `${config.env.imagekit.urlEndpoint}${userImage}`
      : userImage.startsWith('http')
        ? userImage
        : `${config.env.imagekit.urlEndpoint}${userImage}`;

  return (
    <div className="container mx-auto p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Session Debug Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {processedImageUrl ? (
                <AvatarImage
                  src={processedImageUrl}
                  alt={`${session.user.name} profile picture`}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {getInitials(session.user.name || 'U')}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{session.user.name}</h3>
              <p className="text-gray-600">{session.user.email}</p>
              <Badge>{session.user.role}</Badge>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Raw Session Data:</h4>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(session.user, null, 2)}
            </pre>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Image Analysis:</h4>
            <div className="text-sm space-y-1">
              <p>
                <strong>Raw Image Value:</strong> {userImage || 'null'}
              </p>
              <p>
                <strong>Image Type:</strong>{' '}
                {!userImage
                  ? 'No image set'
                  : userImage.startsWith('/profile-pictures')
                    ? 'ImageKit uploaded image'
                    : userImage.startsWith('http')
                      ? 'External URL'
                      : 'Relative path'}
              </p>
              <p>
                <strong>Processed URL:</strong> {processedImageUrl || 'None'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/profile/edit-profile">
              <Button className="w-full" variant="outline">
                Edit Profile & Upload Image
              </Button>
            </Link>
            <Link href="/api/debug/profile-image" target="_blank">
              <Button className="w-full" variant="outline">
                View Debug API
              </Button>
            </Link>
            <Link href="/api/debug/database-users" target="_blank">
              <Button className="w-full" variant="outline">
                View Database Users
              </Button>
            </Link>
            <Link href="/">
              <Button className="w-full">Test Header Display</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ImageKit Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm space-y-1">
              <p>
                <strong>URL Endpoint:</strong> {config.env.imagekit.urlEndpoint}
              </p>
              <p>
                <strong>Public Key:</strong>{' '}
                {config.env.imagekit.publicKey?.substring(0, 10)}...
              </p>
              <p>
                <strong>Configuration Valid:</strong>{' '}
                {config.env.imagekit.urlEndpoint &&
                config.env.imagekit.publicKey
                  ? '✅ Yes'
                  : '❌ Missing'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
