"use client";

import React, { useState } from "react";
import Link from "next/link";
import { navItems } from "@/constants";
import { Heart, Menu, Search, ShoppingCart, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types";

interface Props {
  session: Session;
  wishlistItems: number;
  cartItems: number;
}

const Header = (props: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const userRole: UserRole = props.session?.user?.role;
  const canViewDashboard =
    userRole && (userRole === "ADMIN" || userRole === "MERCHANT");

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-xl font-bold text-black uppercase hidden md:block">
              Luxora
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-black transition-colors font-medium"
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 w-64 bg-gray-50 border-gray-200 focus:border-black focus:ring-black"
              />
              <Search
                onClick={() => {
                  //TODO: Implement search functionality
                  console.log(searchQuery);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
              />
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-6 w-6">
                    {props.session?.user?.image && (
                      <AvatarImage src={props.session.user.image} />
                    )}
                    <AvatarFallback>
                      {getInitials(props.session?.user?.name || "U")}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="center">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      Profile
                    </DropdownMenuItem>
                    {canViewDashboard && (
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/${userRole.toLowerCase()}`)
                        }
                      >
                        Dashboard
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Wishlist */}
              <Link href="/wishlist">
                <Button variant="ghost" size="sm" className="p-2 relative">
                  <Heart className="h-5 w-5" />
                  {props.wishlistItems > 0 && (
                    <Badge
                      className={cn(
                        "absolute -top-1 -right-1 h-4 p-0 flex items-center justify-center text-xs bg-red-500",
                        props.wishlistItems > 99
                          ? "w-6"
                          : props.wishlistItems > 9
                            ? "w-5"
                            : "w-4",
                      )}
                    >
                      {props.wishlistItems}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="p-2 relative">
                  <ShoppingCart className="h-5 w-5" />
                  {props.cartItems > 0 && (
                    <Badge
                      className={cn(
                        "absolute -top-1 -right-1 h-4 p-0 flex items-center justify-center text-xs bg-black",
                        props.cartItems > 99
                          ? "w-6"
                          : props.cartItems > 9
                            ? "w-5"
                            : "w-4",
                      )}
                    >
                      {props.cartItems}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
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
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-2 text-gray-700 hover:text-black transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 w-full bg-gray-50 border-gray-200 focus:border-black focus:ring-black"
              />
              <Search
                onClick={() => {
                  //TODO: Implement search functionality
                  console.log(searchQuery);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;
