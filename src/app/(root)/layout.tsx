import { redirect } from 'next/navigation';
import React from 'react';

import { auth } from '@/auth';
import DynamicHeader from '@/components/DynamicHeader';
import Footer from '@/components/Footer';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session) redirect('/sign-in');
  return (
    <main className="min-h-screen">
      <DynamicHeader session={session} />
      {children}
      <Footer />
    </main>
  );
};
export default Layout;
