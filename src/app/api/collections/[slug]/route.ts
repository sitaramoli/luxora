import { type NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import {
  fetchCollectionById,
  fetchCollectionBySlug,
  fetchCollectionProducts,
  updateCollection,
  deleteCollection,
} from '@/lib/services/collections';

interface RouteContext {
  params: {
    slug: string;
  };
}

// GET - Fetch single collection by ID or slug
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { searchParams } = new URL(request.url);
    const { slug } = context.params;
    const session = await auth();

    // Check if this is a slug-based request (public) or ID-based (admin)
    const bySlug = searchParams.get('bySlug') === 'true';
    const includeProducts = searchParams.get('includeProducts') === 'true';
    const isAdmin = searchParams.get('admin') === 'true';

    if (isAdmin && (!session?.user?.id || session.user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    // Fetch collection
    let collectionResult;
    if (bySlug && !isAdmin) {
      // Public request using slug
      collectionResult = await fetchCollectionBySlug(slug);
    } else {
      // Admin request using ID (slug parameter contains ID for admin requests)
      collectionResult = await fetchCollectionById(slug);
    }

    if (!collectionResult.success) {
      return NextResponse.json(
        { error: collectionResult.error || 'Collection not found' },
        { status: 404 }
      );
    }

    const responseData: any = {
      collection: collectionResult.data,
    };

    // Optionally include products
    if (includeProducts) {
      const productsResult = await fetchCollectionProducts(
        collectionResult.data.id
      );
      if (productsResult.success) {
        responseData.products = productsResult.data;
      }
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in collection GET route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update collection (admin only)
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

    const result = await updateCollection(slug, body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to update collection' },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in collection PUT route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete collection (admin only)
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

    const result = await deleteCollection(slug);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to delete collection' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in collection DELETE route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
