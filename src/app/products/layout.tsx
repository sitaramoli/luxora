import React from 'react';

import { auth } from '@/auth';
import DynamicHeader from '@/components/DynamicHeader';
import Footer from '@/components/Footer';

const ProductsLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <main className="min-h-screen">
      <DynamicHeader session={session} />
      {children}
      <Footer />
    </main>
  );
};

export default ProductsLayout;
