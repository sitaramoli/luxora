import { type NextRequest, NextResponse } from 'next/server';

import { fetchPaginatedProducts } from '@/lib/services/products';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const brandId = searchParams.get('brandId') || '';
    const minPrice = searchParams.get('minPrice')
      ? parseFloat(searchParams.get('minPrice')!)
      : undefined;
    const maxPrice = searchParams.get('maxPrice')
      ? parseFloat(searchParams.get('maxPrice')!)
      : undefined;
    const sortBy = (searchParams.get('sortBy') || 'featured') as
      | 'featured'
      | 'price'
      | 'createdAt'
      | 'name'
      | 'popularity';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as
      | 'asc'
      | 'desc';
    const onSale =
      searchParams.get('onSale') === 'true'
        ? true
        : searchParams.get('onSale') === 'false'
          ? false
          : undefined;
    const isNew =
      searchParams.get('isNew') === 'true'
        ? true
        : searchParams.get('isNew') === 'false'
          ? false
          : undefined;

    const result = await fetchPaginatedProducts({
      page,
      pageSize,
      search,
      category,
      brandId,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      onSale,
      isNew,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch products' },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in products API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
