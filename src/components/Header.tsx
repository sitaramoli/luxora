'use client';

import {
  Heart,
  Menu,
  Search,
  ShoppingCart,
  X,
  User,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import React, { useState, memo, useCallback, useMemo } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { navItems } from '@/constants';
import config from '@/lib/config';
import { cn, getInitials } from '@/lib/utils';
import type { UserRole } from '@/types';

interface Props {
  session: Session;
  wishlistItems: number;
  cartItems: number;
}

const Header = memo((props: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  // Memoize user role and dashboard access
  const userRole: UserRole = props.session?.user?.role;
  const canViewDashboard = useMemo(
    () => userRole && (userRole === 'ADMIN' || userRole === 'MERCHANT'),
    [userRole]
  );

  // Memoize user initials
  const userInitials = useMemo(
    () => getInitials(props.session?.user?.name || 'U'),
    [props.session?.user?.name]
  );

  // Memoize profile image URL with enhanced logic
  const profileImageUrl = useMemo(() => {
    const userImage = props.session?.user?.image;

    if (!userImage || imageError) {
      return null;
    }

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Header Profile Image:', {
        userImage,
        imagekitEndpoint: config.env.imagekit.urlEndpoint,
        isImagekitPath: userImage.startsWith('/profile-pictures'),
      });
    }

    // Handle ImageKit URLs for uploaded profile pictures
    if (userImage.startsWith('/profile-pictures')) {
      return `${config.env.imagekit.urlEndpoint}${userImage}`;
    }

    // Handle external URLs (OAuth providers, etc.)
    if (userImage.startsWith('http')) {
      return userImage;
    }

    // Handle relative paths by converting to ImageKit URL
    return `${config.env.imagekit.urlEndpoint}${userImage}`;
  }, [props.session?.user?.image, imageError]);

  // Memoize dashboard route
  const dashboardRoute = useMemo(
    () => `/${userRole?.toLowerCase()}`,
    [userRole]
  );

  // Memoize badge width calculations
  const wishlistBadgeWidth = useMemo(
    () =>
      props.wishlistItems > 99
        ? 'w-6'
        : props.wishlistItems > 9
          ? 'w-5'
          : 'w-4',
    [props.wishlistItems]
  );

  const cartBadgeWidth = useMemo(
    () => (props.cartItems > 99 ? 'w-6' : props.cartItems > 9 ? 'w-5' : 'w-4'),
    [props.cartItems]
  );

  // Optimized callbacks
  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleSearchSubmit = useCallback(() => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [searchQuery, router]);

  const handleProfileClick = useCallback(() => {
    router.push('/profile');
  }, [router]);

  const handleDashboardClick = useCallback(() => {
    router.push(dashboardRoute);
  }, [router, dashboardRoute]);

  const handleSignOut = useCallback(() => {
    signOut();
  }, []);

  const handleImageError = useCallback(() => {
    console.warn('Profile image failed to load:', props.session?.user?.image);
    setImageError(true);
  }, [props.session?.user?.image]);

  const handleImageLoad = useCallback(() => {
    setImageError(false);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-to-b from-black/80 via-black/70 to-black/80 backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">L</span>
            </div>
            <span className="text-xl font-bold text-white uppercase hidden md:block">
              Luxora
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white/80 hover:text-white transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden sm:flex items-center relative">
              <Input
                type="text"
                placeholder="Search luxury items..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={e => e.key === 'Enter' && handleSearchSubmit()}
                className="pr-10 w-64 bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white focus:ring-white"
              />
              <Search
                onClick={handleSearchSubmit}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4 cursor-pointer hover:text-white transition-colors"
                aria-label="Search"
              />
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 rounded-full p-0 relative hover:bg-white/10"
                    aria-label="Open profile menu"
                  >
                    <Avatar className="h-8 w-8 border border-white/20">
                      {profileImageUrl && !imageError ? (
                        <AvatarImage
                          src={profileImageUrl}
                          alt={`${props.session?.user?.name || 'User'} profile picture`}
                          className="object-cover"
                          onError={handleImageError}
                          onLoad={handleImageLoad}
                        />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-300 text-black font-medium text-sm">
                          {userInitials}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 h-2 w-2 bg-green-400 border border-black rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {props.session?.user?.name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {props.session?.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={handleProfileClick}
                      className="cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    {canViewDashboard && (
                      <DropdownMenuItem
                        onClick={handleDashboardClick}
                        className="cursor-pointer"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer"
                  >
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Wishlist */}
              <Link href="/wishlist">
                <Button variant="ghost" size="sm" className="p-2 relative text-white hover:bg-white/10">
                  <Heart className="h-5 w-5" />
                  {props.wishlistItems > 0 && (
                    <Badge
                      className={cn(
                        'absolute -top-1 -right-1 h-4 p-0 flex items-center justify-center text-xs bg-red-500',
                        wishlistBadgeWidth
                      )}
                    >
                      {props.wishlistItems > 99 ? '99+' : props.wishlistItems}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="p-2 relative text-white hover:bg-white/10">
                  <ShoppingCart className="h-5 w-5" />
                  {props.cartItems > 0 && (
                    <Badge
                      className={cn(
                        'absolute -top-1 -right-1 h-4 p-0 flex items-center justify-center text-xs bg-yellow-300 text-black',
                        cartBadgeWidth
                      )}
                    >
                      {props.cartItems > 99 ? '99+' : props.cartItems}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2 text-white hover:bg-white/10"
                onClick={handleMenuToggle}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-2">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-2 text-white/80 hover:text-white transition-colors font-medium"
                  onClick={handleMenuClose}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile search */}
            <div className="mt-4 relative">
              <Input
                type="text"
                placeholder="Search luxury items..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={e => e.key === 'Enter' && handleSearchSubmit()}
                className="pr-10 w-full bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white focus:ring-white"
              />
              <Search
                onClick={handleSearchSubmit}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4 cursor-pointer hover:text-white transition-colors"
                aria-label="Search"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
