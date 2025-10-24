'use client';

import type { Session } from 'next-auth';
import React, { useState, useEffect } from 'react';

import Header from './Header';

interface DynamicHeaderProps {
  session: Session | null;
}

const DynamicHeader: React.FC<DynamicHeaderProps> = ({ session }) => {
  const [cartItems, setCartItems] = useState(0);
  const [wishlistItems, setWishlistItems] = useState(0);

  // Function to fetch cart count
  const fetchCartCount = async () => {
    try {
      if (!session?.user?.id) {
        setCartItems(0);
        return;
      }

      const response = await fetch('/api/cart?countOnly=true');
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartItems(0);
    }
  };

  // Function to fetch wishlist count
  const fetchWishlistCount = async () => {
    try {
      if (!session?.user?.id) {
        setWishlistItems(0);
        return;
      }

      const response = await fetch('/api/wishlist?countOnly=true');
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching wishlist count:', error);
      setWishlistItems(0);
    }
  };

  // Function to update both counts
  const updateCounts = () => {
    fetchCartCount();
    fetchWishlistCount();
  };

  // Fetch initial counts
  useEffect(() => {
    updateCounts();
  }, [session?.user?.id]);

  // Listen for cart and wishlist updates
  useEffect(() => {
    const handleCartUpdate = () => {
      if (session?.user?.id) {
        fetchCartCount();
      }
    };

    const handleWishlistUpdate = () => {
      if (session?.user?.id) {
        fetchWishlistCount();
      }
    };

    // Add event listeners
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  if (!session) {
    return <Header session={{} as Session} cartItems={0} wishlistItems={0} />;
  }

  return (
    <Header
      session={session}
      cartItems={cartItems}
      wishlistItems={wishlistItems}
    />
  );
};

export default DynamicHeader;
