import React, { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const isAdmin = session?.user?.role === "ADMIN";
  if (!isAdmin) redirect("/");

  return <main>{children}</main>;
};
export default Layout;
