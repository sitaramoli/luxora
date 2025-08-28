import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  brands,
  customerService,
  legal,
  platformInfo,
  quickLinks,
} from "@/constants";

const Footer = () => {
  // TODO: fetch brands from database
  const socialLinks = [
    {
      label: "Facebook",
      href: platformInfo.socialLinks.facebook,
      icon: Facebook,
    },
    {
      label: "Twitter",
      href: platformInfo.socialLinks.twitter,
      icon: Twitter,
    },
    {
      label: "Instagram",
      href: platformInfo.socialLinks.instagram,
      icon: Instagram,
    },
    {
      label: "Youtube",
      href: platformInfo.socialLinks.youtube,
      icon: Youtube,
    },
  ];
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
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
                  className="p-2 text-gray-400 hover:bg-gray-500 rounded-xl"
                  aria-label={label}
                >
                  <Icon />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              {customerService.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Featured Brands */}
          <div>
            <h3 className="font-semibold mb-4">Featured Brands</h3>
            <ul className="space-y-2">
              {brands.map(({ name, slug }) => (
                <li key={slug}>
                  <Link
                    href={`/brands/${slug}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Stay Connected</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for exclusive offers and the latest
              luxury fashion news.
            </p>
            <div className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-white focus:ring-white"
              />
              <Button
                variant="outline"
                className="border-white text-white bg-gray-900 hover:bg-white hover:text-black"
              >
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-400">
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
          <p className="text-sm text-gray-400">
            © {year} Luxora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
