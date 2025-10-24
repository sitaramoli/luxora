import { type NextRequest, NextResponse } from 'next/server';

import { fetchPaginatedBrands } from '@/lib/services/merchants';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sortBy = (searchParams.get('sortBy') || 'productCount') as
      | 'name'
      | 'productCount'
      | 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as
      | 'asc'
      | 'desc';

    const result = await fetchPaginatedBrands({
      page,
      pageSize,
      search,
      category,
      sortBy,
      sortOrder,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch brands' },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in brands API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
