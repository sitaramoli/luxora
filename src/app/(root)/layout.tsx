import React, { ReactNode } from "react";
import { auth } from "@/auth";
import Header from "@/components/Header";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (!session) redirect("/sign-in");
  return (
    <main className="min-h-screen">
      <Header session={session} cartItems={1} wishlistItems={11} />
      {children}
      <Footer />
    </main>
  );
};
export default Layout;
