import { NextResponse, type NextRequest } from 'next/server';

import { auth } from '@/auth';
import { getUserRecentOrders } from '@/lib/services/orders';
import { getPreferences, getUserData } from '@/lib/services/users';

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'getEditProfileData':
        const [user, preference] = await Promise.all([
          getUserData(session.user.id),
          getPreferences(session.user.id),
        ]);

        if (!user) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({
          user,
          preferences: preference,
        });

      case 'getProfileDataAndRecentOrders':
        const [userProfile, recentOrders] = await Promise.all([
          getUserData(session.user.id),
          getUserRecentOrders(session.user.id),
        ]);

        if (!userProfile) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          userProfile,
          recentOrders,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid data type specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
