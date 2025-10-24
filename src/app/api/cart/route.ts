import { NextRequest, NextResponse } from 'next/server';
import { getCart, addToCart, getCartItemCount, updateCartItemQuantity, removeFromCart, clearCart } from '@/lib/services/cart';

// GET - Get cart items and count
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countOnly = searchParams.get('countOnly') === 'true';
    
    if (countOnly) {
      const result = await getCartItemCount();
      if (!result.success) {
        return NextResponse.json({ count: 0 }); // Return 0 for unauthenticated users
      }
      return NextResponse.json({ count: result.count });
    }
    
    const result = await getCart();
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to get cart' },
        { status: result.error === 'Authentication required' ? 401 : 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in cart GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity = 1, selectedColor, selectedSize } = body;

    if (!productId || typeof productId !== 'number') {
      return NextResponse.json(
        { error: 'Product ID is required and must be a number' },
        { status: 400 }
      );
    }

    const result = await addToCart({
      productId,
      quantity,
      selectedColor,
      selectedSize,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to add to cart' },
        { status: result.error === 'Authentication required' ? 401 : 400 }
      );
    }

    return NextResponse.json({ success: true, message: 'Item added to cart' });
  } catch (error) {
    console.error('Error in cart POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartItemId, quantity } = body;

    if (!cartItemId || typeof quantity !== 'number') {
      return NextResponse.json(
        { error: 'Cart item ID and quantity are required' },
        { status: 400 }
      );
    }

    const result = await updateCartItemQuantity({
      cartItemId,
      quantity,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to update cart item' },
        { status: result.error === 'Authentication required' ? 401 : 400 }
      );
    }

    return NextResponse.json({ success: true, message: 'Cart item updated' });
  } catch (error) {
    console.error('Error in cart PUT API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove cart item or clear entire cart
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartItemId, clearAll } = body;

    if (clearAll) {
      const result = await clearCart();
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to clear cart' },
          { status: result.error === 'Authentication required' ? 401 : 500 }
        );
      }

      return NextResponse.json({ success: true, message: 'Cart cleared' });
    }

    if (!cartItemId) {
      return NextResponse.json(
        { error: 'Cart item ID is required' },
        { status: 400 }
      );
    }

    const result = await removeFromCart(cartItemId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to remove cart item' },
        { status: result.error === 'Authentication required' ? 401 : 400 }
      );
    }

    return NextResponse.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error in cart DELETE API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
