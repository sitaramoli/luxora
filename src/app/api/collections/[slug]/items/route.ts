import { type NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import {
  fetchCollectionProducts,
  addProductToCollection,
  removeProductFromCollection,
  updateCollectionItem,
} from '@/lib/services/collections';

interface RouteContext {
  params: {
    slug: string;
  };
}

// GET - Fetch products in collection
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = context.params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    const result = await fetchCollectionProducts(slug, limit);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch collection products' },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in collection items GET route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add product to collection (admin only)
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { slug } = context.params;
    const body = await request.json();

    // Add collection ID to the request body
    const dataWithCollectionId = {
      ...body,
      collectionId: slug,
    };

    const result = await addProductToCollection(dataWithCollectionId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to add product to collection' },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('Error in collection items POST route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove product from collection (admin only)
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { slug } = context.params;
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const result = await removeProductFromCollection(slug, parseInt(productId));

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to remove product from collection' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in collection items DELETE route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update collection item (admin only)
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { slug } = context.params;
    const body = await request.json();
    const { productId, ...updates } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const result = await updateCollectionItem(
      slug,
      parseInt(productId),
      updates
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to update collection item' },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in collection items PUT route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
