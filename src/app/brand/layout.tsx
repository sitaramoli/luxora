import React, { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserRole } from "@/types";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const isMerchant = session?.user?.role === "MERCHANT";
  if (!isMerchant) redirect("/");

  return <main>{children}</main>;
};
export default Layout;
