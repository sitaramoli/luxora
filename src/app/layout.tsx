import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { Toaster } from 'sonner';

import { auth } from '@/auth';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: 'Luxora - Luxury Fashion & Lifestyle',
    template: '%s | Luxora',
  },
  description:
    "Discover premium luxury fashion, accessories, and lifestyle products from the world's most exclusive brands. Shop curated collections of high-end merchandise.",
  keywords: ['luxury', 'fashion', 'premium', 'brands', 'lifestyle', 'shopping'],
  authors: [{ name: 'Luxora Team' }],
  creator: 'Luxora',
  publisher: 'Luxora',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://luxora.com'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Luxora - Luxury Fashion & Lifestyle',
    description:
      "Discover premium luxury fashion, accessories, and lifestyle products from the world's most exclusive brands.",
    siteName: 'Luxora',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxora - Luxury Fashion & Lifestyle',
    description:
      "Discover premium luxury fashion, accessories, and lifestyle products from the world's most exclusive brands.",
    creator: '@luxora',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          {children}
          <Toaster position="top-right" richColors={true} duration={2000} />
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
