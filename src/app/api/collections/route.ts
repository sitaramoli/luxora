import { type NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import {
  fetchCollections,
  fetchPublicCollections,
  createCollection,
} from '@/lib/services/collections';

// GET - Fetch collections (admin or public based on query params)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const session = await auth();

    // Check if this is an admin request
    const isAdmin = searchParams.get('admin') === 'true';

    if (isAdmin) {
      // Admin endpoint - require admin auth
      if (!session?.user?.id || session.user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Unauthorized. Admin access required.' },
          { status: 401 }
        );
      }

      const page = parseInt(searchParams.get('page') || '1');
      const pageSize = parseInt(searchParams.get('pageSize') || '20');
      const search = searchParams.get('search') || '';
      const status = searchParams.get('status') || '';
      const season = searchParams.get('season') || '';
      const sortBy = (searchParams.get('sortBy') || 'createdAt') as
        | 'createdAt'
        | 'name'
        | 'displayOrder'
        | 'productCount';
      const sortOrder = (searchParams.get('sortOrder') || 'desc') as
        | 'asc'
        | 'desc';
      const isFeatured =
        searchParams.get('isFeatured') === 'true'
          ? true
          : searchParams.get('isFeatured') === 'false'
            ? false
            : undefined;

      const result = await fetchCollections({
        page,
        pageSize,
        search,
        status,
        season,
        sortBy,
        sortOrder,
        isFeatured,
      });

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to fetch collections' },
          { status: 500 }
        );
      }

      return NextResponse.json(result.data);
    } else {
      // Public endpoint
      const limit = parseInt(searchParams.get('limit') || '100');
      const featured = searchParams.get('featured') === 'true';

      const result = await fetchPublicCollections({
        limit,
        featured,
      });

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to fetch collections' },
          { status: 500 }
        );
      }

      return NextResponse.json(result.data);
    }
  } catch (error) {
    console.error('Error in collections GET route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new collection (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const result = await createCollection(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create collection' },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('Error in collections POST route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
