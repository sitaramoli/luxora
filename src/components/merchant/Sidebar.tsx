'use client';

import React, { memo, useMemo } from 'react';
import Link from 'next/link';
import { cn, getInitials } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Session } from 'next-auth';
import { HomeIcon, LibraryBig, Package, Settings, Activity } from 'lucide-react';

interface SidebarProps {
  session: Session;
}

const Sidebar = memo(({ session }: SidebarProps) => {
  const pathName = usePathname();

  // Memoize sidebar links to prevent recreation
  const merchantSideBarLinks = useMemo(
    () => [
      { icon: HomeIcon, text: 'Home', route: '/merchant' },
      { icon: Package, text: 'Inventory', route: '/merchant/inventory' },
      { icon: LibraryBig, text: 'Orders', route: '/merchant/orders' },
      { icon: Activity, text: 'Activity', route: '/merchant/activity' },
      { icon: Settings, text: 'Settings', route: '/merchant/settings' },
    ],
    []
  );

  // Memoize user initials
  const userInitials = useMemo(
    () => getInitials(session?.user?.name || 'U'),
    [session?.user?.name]
  );

  return (
    <div className="sticky left-0 top-0 flex h-dvh flex-col justify-between bg-white px-5 pb-5 pt-10">
      <div>
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="text-xl font-bold text-black uppercase hidden md:block">
            Luxora
          </span>
        </Link>
        <nav
          className="mt-10 flex flex-col gap-5"
          role="navigation"
          aria-label="Merchant Navigation"
        >
          {merchantSideBarLinks.map(({ route, icon: Icon, text }) => {
            const isSelected =
              (route !== '/merchant' &&
                pathName.includes(route) &&
                route.length > 1) ||
              pathName === route;

            return (
              <Link
                href={route}
                key={route}
                className={cn(
                  'flex flex-row items-center w-full gap-2 rounded-lg px-5 py-3.5 max-md:justify-center transition-colors hover:bg-gray-100',
                  isSelected && 'bg-gray-800 shadow-sm hover:bg-gray-800'
                )}
                aria-current={isSelected ? 'page' : undefined}
              >
                <div className="relative size-5" role="img" aria-hidden="true">
                  <Icon
                    className={`${isSelected ? 'brightness-0 invert' : ''} object-contain`}
                  />
                </div>
                <p
                  className={cn(
                    'text-base font-medium max-md:hidden',
                    isSelected ? 'text-white' : 'text-black'
                  )}
                >
                  {text}
                </p>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="my-8 flex w-full flex-row gap-2 rounded-full border border-gray-200 px-6 py-2 shadow-sm max-md:px-2">
        <Avatar>
          <AvatarFallback className="bg-amber-100">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col max-md:hidden">
          <p className="font-semibold text-gray-900">{session?.user?.name}</p>
          <p className="text-gray-500 text-xs">{session?.user?.email}</p>
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = 'MerchantSidebar';

export default Sidebar;
