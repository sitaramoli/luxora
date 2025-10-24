import { redirect } from 'next/navigation';
import React from 'react';

import { auth } from '@/auth';
import DynamicHeader from '@/components/DynamicHeader';
import Footer from '@/components/Footer';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (session) redirect('/');
  return (
    <main className="min-h-screen w-full flex flex-col">
      <DynamicHeader session={session} />
      <section className="flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {children}
        </div>
      </section>
      <Footer />
    </main>
  );
};
export default Layout;
