'use client';

import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Gift,
  Truck,
  Shield,
  CreditCard,
  Loader,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { PageLoader } from '@/components/PageLoader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { dispatchCartUpdated } from '@/lib/events';
import { formatPrice } from '@/lib/utils';

interface CartItem {
  id: string;
  productId: number;
  quantity: number;
  selectedColor?: string | null;
  selectedSize?: string | null;
  product: {
    id: number;
    name: string;
    price: string;
    images: string[] | null;
    brandName: string | null;
  };
}

interface CartData {
  items: CartItem[];
  totalItems: number;
  totalAmount: string;
}

const CartContent = () => {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isPromoLoading, setIsPromoLoading] = useState(false);

  // Fetch cart data
  const fetchCartData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/cart');

      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to sign-in if not authenticated
          window.location.href = '/sign-in?callbackUrl=/cart';
          return;
        }
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      setCartData(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load your cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(cartItemId);
      return;
    }

    try {
      setUpdatingItems(prev => new Set(prev).add(cartItemId));

      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItemId, quantity: newQuantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update quantity');
      }

      // Update local state
      setCartData(prev => {
        if (!prev) return prev;

        const updatedItems = prev.items.map(item =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        );

        const totalItems = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const totalAmount = updatedItems.reduce((sum, item) => {
          return sum + parseFloat(item.product.price) * item.quantity;
        }, 0);

        return {
          items: updatedItems,
          totalItems,
          totalAmount: totalAmount.toFixed(2),
        };
      });

      // Update header cart count
      dispatchCartUpdated();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update quantity'
      );
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  // Remove item from cart
  const removeItem = async (cartItemId: string) => {
    try {
      setRemovingItems(prev => new Set(prev).add(cartItemId));

      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItemId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove item');
      }

      // Update local state
      setCartData(prev => {
        if (!prev) return prev;

        const updatedItems = prev.items.filter(item => item.id !== cartItemId);
        const totalItems = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const totalAmount = updatedItems.reduce((sum, item) => {
          return sum + parseFloat(item.product.price) * item.quantity;
        }, 0);

        return {
          items: updatedItems,
          totalItems,
          totalAmount: totalAmount.toFixed(2),
        };
      });

      toast.success('Item removed from cart');

      // Update header cart count
      dispatchCartUpdated();
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to remove item'
      );
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  // Handle promo code
  const handlePromoCode = async () => {
    setIsPromoLoading(true);
    try {
      // Simulate promo code validation
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (promoCode.toLowerCase() === 'luxury10') {
        setIsPromoApplied(true);
        toast.success('Promo code applied! 10% discount');
      } else {
        toast.error('Invalid promo code');
      }
    } catch (error) {
      toast.error('Failed to apply promo code');
    } finally {
      setIsPromoLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  // Calculate totals
  const subtotal = cartData ? parseFloat(cartData.totalAmount) : 0;
  const shippingCost = subtotal > 500 ? 0 : 25;
  const tax = subtotal * 0.08;
  const discount = isPromoApplied ? subtotal * 0.1 : 0;
  const finalTotal = subtotal + shippingCost + tax - discount;

  if (isLoading) {
    return <PageLoader isLoading={isLoading} />;
  }

  if (!cartData || cartData.items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-8">
          Discover our luxury collection and add items to your cart
        </p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600">
          {cartData.totalItems} item{cartData.totalItems > 1 ? 's' : ''} in your
          cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {cartData.items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-20 h-20 relative rounded-md overflow-hidden bg-white">
                      <Image
                        src={
                          Array.isArray(item.product.images) &&
                          item.product.images.length > 0
                            ? item.product.images[0]
                            : '/placeholder-product.jpg'
                        }
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.product.brandName || 'Unknown Brand'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {item.selectedSize && (
                          <Badge variant="secondary" className="text-xs">
                            Size: {item.selectedSize}
                          </Badge>
                        )}
                        {item.selectedColor && (
                          <Badge variant="secondary" className="text-xs">
                            Color: {item.selectedColor}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={
                          item.quantity <= 1 || updatingItems.has(item.id)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="px-3 py-1 bg-white rounded border min-w-[40px] text-center">
                        {updatingItems.has(item.id) ? (
                          <Loader className="h-3 w-3 animate-spin mx-auto" />
                        ) : (
                          item.quantity
                        )}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={updatingItems.has(item.id)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(
                          parseFloat(item.product.price) * item.quantity
                        )}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={removingItems.has(item.id)}
                      >
                        {removingItems.has(item.id) ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Promo Code */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Gift className="h-5 w-5 text-gray-400" />
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    disabled={isPromoApplied || isPromoLoading}
                  />
                  <Button
                    variant="outline"
                    onClick={handlePromoCode}
                    disabled={isPromoApplied || !promoCode || isPromoLoading}
                  >
                    {isPromoLoading ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : isPromoApplied ? (
                      'Applied'
                    ) : (
                      'Apply'
                    )}
                  </Button>
                </div>
              </div>
              {isPromoApplied && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <Gift className="h-3 w-3" />
                  Promo code applied! 10% discount
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">{formatPrice(tax)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount (10%)</span>
                  <span className="font-semibold">
                    -{formatPrice(discount)}
                  </span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>

              <Button className="w-full" size="lg">
                <CreditCard className="h-5 w-5 mr-2" />
                Proceed to Checkout
              </Button>

              {/* Service Info */}
              <div className="space-y-3 pt-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span>Free shipping over $500</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Secure checkout</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Continue Shopping */}
          <div className="mt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartContent;
