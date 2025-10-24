import { redirect } from 'next/navigation';
import React from 'react';

import { auth } from '@/auth';
import DynamicHeader from '@/components/DynamicHeader';
import Footer from '@/components/Footer';
import Sidebar from '@/components/merchant/Sidebar';
import { getUserRole } from '@/lib/services/users';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session?.user?.id) redirect('/sign-in');

  const userRole = await getUserRole(session.user.id);
  const isMerchant = userRole === 'MERCHANT';
  if (!isMerchant || userRole === null) redirect('/');
  return (
    <main className="min-h-screen w-full flex flex-col">
      <DynamicHeader session={session} />
      <div className="w-full flex flex-row">
        <Sidebar session={session} />
        <div className="flex-1">{children}</div>
      </div>
      <Footer />
    </main>
  );
};
export default Layout;
