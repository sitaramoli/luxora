"use client";

import React from "react";
import Link from "next/link";
import { cn, getInitials } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";
import {
  Store,
  HomeIcon,
  LibraryBig,
  Package,
  Settings,
  Users,
} from "lucide-react";

const Sidebar = ({ session }: { session: Session }) => {
  const pathName = usePathname();

  const adminSideBarLinks = [
    { icon: HomeIcon, text: "Home", route: "/admin" },
    { icon: Store, text: "Merchants", route: "/admin/merchants" },
    { icon: Users, text: "Users", route: "/admin/users" },
    { icon: Package, text: "Products", route: "/admin/products" },
    { icon: LibraryBig, text: "Orders", route: "/admin/orders" },
    { icon: Settings, text: "Settings", route: "/admin/settings" },
  ];

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
        <div className="mt-10 flex flex-col gap-5">
          {adminSideBarLinks.map(({ route, icon: Icon, text }) => {
            const isSelected =
              (route !== "/admin" &&
                pathName.includes(route) &&
                route.length > 1) ||
              pathName === route;

            return (
              <Link href={route} key={route}>
                <div
                  className={cn(
                    "flex flex-row items-center w-full gap-2 rounded-lg px-5 py-3.5 max-md:justify-center",
                    isSelected && "bg-gray-800 shadow-sm",
                  )}
                >
                  <div className="relative size-5">
                    <Icon
                      className={`${isSelected ? "brightness-0 invert" : ""} object-contain`}
                    />
                  </div>
                  <p
                    className={cn(
                      "text-base font-medium max-md:hidden",
                      isSelected ? "text-white" : "text-black",
                    )}
                  >
                    {text}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="my-8 flex w-full flex-row gap-2 rounded-full border border-light-400 px-6 py-2 shadow-sm max-md:px-2">
        <Avatar>
          <AvatarFallback className="bg-amber-100">
            {getInitials(session?.user?.name || "U")}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col max-md:hidden">
          <p className="font-semibold text-dark-200">{session?.user?.name}</p>
          <p className="text-light-500 text-xs">{session?.user?.email}</p>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
