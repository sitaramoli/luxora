import { type NextRequest, NextResponse } from 'next/server';

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getWishlistItemCount,
  isInWishlist,
  clearWishlist,
} from '@/lib/services/wishlist';

// GET - Get wishlist items, count, or check if product is in wishlist
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countOnly = searchParams.get('countOnly') === 'true';
    const productId = searchParams.get('productId');

    if (countOnly) {
      const result = await getWishlistItemCount();
      if (!result.success) {
        return NextResponse.json({ count: 0 }); // Return 0 for unauthenticated users
      }
      return NextResponse.json({ count: result.count });
    }

    if (productId) {
      const result = await isInWishlist(parseInt(productId));
      if (!result.success) {
        return NextResponse.json({ inWishlist: false }); // Return false for unauthenticated users
      }
      return NextResponse.json({ inWishlist: result.inWishlist });
    }

    const result = await getWishlist();
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to get wishlist' },
        { status: result.error === 'Authentication required' ? 401 : 500 }
      );
    }

    // Return in the format expected by frontend
    return NextResponse.json({ items: result.data?.items || [] });
  } catch (error) {
    console.error('Error in wishlist GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId } = body;

    if (!productId || typeof productId !== 'number') {
      return NextResponse.json(
        { error: 'Product ID is required and must be a number' },
        { status: 400 }
      );
    }

    const result = await addToWishlist(productId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to add to wishlist' },
        { status: result.error === 'Authentication required' ? 401 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item added to wishlist',
    });
  } catch (error) {
    console.error('Error in wishlist POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from wishlist or clear entire wishlist
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, clearAll } = body;

    if (clearAll) {
      const result = await clearWishlist();

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to clear wishlist' },
          { status: result.error === 'Authentication required' ? 401 : 500 }
        );
      }

      return NextResponse.json({ success: true, message: 'Wishlist cleared' });
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const result = await removeFromWishlist(parseInt(productId));

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to remove from wishlist' },
        { status: result.error === 'Authentication required' ? 401 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item removed from wishlist',
    });
  } catch (error) {
    console.error('Error in wishlist DELETE API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
