'use client';

import {
  Search,
  ShoppingBag,
  RotateCcw,
  CreditCard,
  Shield,
  User,
  Store,
  ChevronRight,
  MessageSquare,
  Phone,
  Mail,
} from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const helpCategories = [
    {
      id: 'orders',
      title: 'Orders & Shipping',
      description: 'Track orders, shipping info, and delivery',
      icon: ShoppingBag,
      color: 'bg-blue-100 text-blue-800',
      articles: [
        { title: 'How to track my order', views: 1234 },
        { title: 'Shipping methods and costs', views: 987 },
        { title: 'Order processing times', views: 756 },
        { title: 'International shipping', views: 543 },
      ],
    },
    {
      id: 'returns',
      title: 'Returns & Exchanges',
      description: 'Return policy, exchanges, and refunds',
      icon: RotateCcw,
      color: 'bg-green-100 text-green-800',
      articles: [
        { title: 'How to return an item', views: 2134 },
        { title: 'Exchange policy', views: 1456 },
        { title: 'Refund processing times', views: 1123 },
        { title: 'Return shipping labels', views: 876 },
      ],
    },
    {
      id: 'payments',
      title: 'Payments & Billing',
      description: 'Payment methods, billing, and invoices',
      icon: CreditCard,
      color: 'bg-purple-100 text-purple-800',
      articles: [
        { title: 'Accepted payment methods', views: 1876 },
        { title: 'Payment security', views: 1234 },
        { title: 'Billing address changes', views: 987 },
        { title: 'Invoice and receipt requests', views: 654 },
      ],
    },
    {
      id: 'account',
      title: 'Account & Profile',
      description: 'Account settings, profile, and security',
      icon: User,
      color: 'bg-yellow-100 text-yellow-800',
      articles: [
        { title: 'Update profile information', views: 1543 },
        { title: 'Change password', views: 1234 },
        { title: 'Manage addresses', views: 1098 },
        { title: 'Notification preferences', views: 876 },
      ],
    },
    {
      id: 'products',
      title: 'Products & Authenticity',
      description: 'Product info, authenticity, and quality',
      icon: Shield,
      color: 'bg-red-100 text-red-800',
      articles: [
        { title: 'Product authenticity guarantee', views: 2345 },
        { title: 'Size guides and fitting', views: 1876 },
        { title: 'Product care instructions', views: 1234 },
        { title: 'Quality assurance process', views: 987 },
      ],
    },
    {
      id: 'merchant',
      title: 'Merchant Information',
      description: 'Becoming a merchant, policies, and support',
      icon: Store,
      color: 'bg-indigo-100 text-indigo-800',
      articles: [
        { title: 'How to become a merchant', views: 3456 },
        { title: 'Merchant application process', views: 2134 },
        { title: 'Commission structure', views: 1876 },
        { title: 'Merchant support resources', views: 1234 },
      ],
    },
  ];

  const popularArticles = [
    { title: 'How to track my order', category: 'Orders', views: 5432 },
    {
      title: 'Product authenticity guarantee',
      category: 'Products',
      views: 4321,
    },
    { title: 'How to return an item', category: 'Returns', views: 3210 },
    { title: 'Accepted payment methods', category: 'Payments', views: 2987 },
    { title: 'How to become a merchant', category: 'Merchant', views: 2654 },
  ];

  const filteredCategories = helpCategories.filter(
    category =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.articles.some(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find answers to common questions or get in touch with our support
            team
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg border-gray-200 focus:border-black focus:ring-black"
            />
          </div>
        </div>

        {!selectedCategory ? (
          <>
            {/* Help Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filteredCategories.map(category => (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${category.color}`}
                      >
                        <category.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {category.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {category.articles.slice(0, 3).map((article, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-700">{article.title}</span>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Popular Articles */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Popular Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularArticles.map((article, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {article.category}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {article.views} views
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Category Detail View */
          <div>
            <Button
              variant="outline"
              onClick={() => setSelectedCategory(null)}
              className="mb-6"
            >
              ← Back to Categories
            </Button>

            {(() => {
              const category = helpCategories.find(
                c => c.id === selectedCategory
              );
              return category ? (
                <div className="mb-16">
                  <div className="flex items-center gap-4 mb-8">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${category.color}`}
                    >
                      <category.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {category.title}
                      </h1>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {category.articles.map((article, index) => (
                      <Card
                        key={index}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {article.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {article.views} views
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}

        {/* Contact Support */}
        <div className="bg-black text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-gray-300 mb-6">
            Our support team is here to assist you with any questions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              className="border-white text-white bg-black hover:bg-white hover:text-black"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Start Live Chat
            </Button>
            <Button
              variant="outline"
              className="border-white text-white bg-black hover:bg-white hover:text-black"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button
              variant="outline"
              className="border-white text-white bg-black hover:bg-white hover:text-black"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
