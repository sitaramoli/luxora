'use client';

import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import Link from 'next/link';
import React, { memo, useMemo, useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  brands,
  customerService,
  legal,
  platformInfo,
  quickLinks,
} from '@/constants';

const Footer = memo(() => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Memoize social links to prevent recreation on every render
  const socialLinks = useMemo(
    () => [
      {
        label: 'Facebook',
        href: platformInfo.socialLinks.facebook,
        icon: Facebook,
      },
      {
        label: 'Twitter',
        href: platformInfo.socialLinks.twitter,
        icon: Twitter,
      },
      {
        label: 'Instagram',
        href: platformInfo.socialLinks.instagram,
        icon: Instagram,
      },
      {
        label: 'Youtube',
        href: platformInfo.socialLinks.youtube,
        icon: Youtube,
      },
    ],
    []
  );

  // Memoize current year to prevent recalculation
  const year = useMemo(() => new Date().getFullYear(), []);

  // Newsletter subscription handler
  const handleNewsletterSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;

      setIsSubscribing(true);
      try {
        // TODO: Implement newsletter subscription API call
        console.log('Subscribing email:', email);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEmail('');
        // TODO: Show success toast
      } catch (error) {
        console.error('Newsletter subscription failed:', error);
        // TODO: Show error toast
      } finally {
        setIsSubscribing(false);
      }
    },
    [email]
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    },
    []
  );
  return (
    <footer className="text-white bg-gradient-to-b from-black via-gray-950 to-black border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-bold hidden md:block">Luxora</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              The world&#39;s premier destination for luxury fashion and
              accessories. Discover exclusive collections from the most
              prestigious brands.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="p-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition-colors"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white/90">Company</h3>
            <ul className="space-y-2">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4 text-white/90">
              Customer Service
            </h3>
            <ul className="space-y-2">
              {customerService.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Featured Brands */}
          <div>
            <h3 className="font-semibold mb-4 text-white/90">
              Featured Brands
            </h3>
            <ul className="space-y-2">
              {brands.map(({ name, slug }) => (
                <li key={slug}>
                  <Link
                    href={`/brands/${slug}`}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4 text-white/90">Stay Connected</h3>
            <p className="text-white/60 text-sm mb-4">
              Subscribe to our newsletter for exclusive offers and the latest
              luxury fashion news.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col space-y-2"
            >
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={handleEmailChange}
                disabled={isSubscribing}
                required
                className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white focus:ring-white disabled:opacity-50"
              />
              <Button
                type="submit"
                variant="outline"
                disabled={isSubscribing || !email.trim()}
                className="border-white text-white bg-black hover:bg-white hover:text-black disabled:opacity-50"
              >
                <Mail className="h-4 w-4 mr-2" />
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-10 bg-white/10" />

        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap items-center space-x-6 text-sm text-white/60">
            {legal.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
          <p className="text-sm text-white/60">
            © {year} Luxora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
