import React, { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/services/users";
import Sidebar from "@/components/merchant/Sidebar";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const userRole = await getUserRole(session.user.id);
  const isMerchant = userRole === "MERCHANT";
  if (!isMerchant) redirect("/");
  return (
    <main className="min-h-screen w-full flex flex-row">
      <Sidebar session={session} />
      {children}
    </main>
  );
};
export default Layout;
