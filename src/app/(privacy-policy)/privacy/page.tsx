'use client';

import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { platformInfo } from '@/constants';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600">
            Last updated: January 15, 2024
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-0">
            <CardContent className="p-8">
              <div className="prose max-w-none">
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    1. Information We Collect
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We collect information you provide directly to us, such as
                    when you create an account, make a purchase, or contact us
                    for support. This may include:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Name, email address, and contact information</li>
                    <li>Billing and shipping addresses</li>
                    <li>
                      Payment information (processed securely by our payment
                      partners)
                    </li>
                    <li>Purchase history and preferences</li>
                    <li>Communications with our customer service team</li>
                  </ul>
                </section>

                <Separator className="my-8" />

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    2. How We Use Your Information
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Process and fulfill your orders</li>
                    <li>Communicate with you about your orders and account</li>
                    <li>Provide customer support</li>
                    <li>
                      Send you promotional communications (with your consent)
                    </li>
                    <li>Improve our products and services</li>
                    <li>Prevent fraud and ensure platform security</li>
                  </ul>
                </section>

                <Separator className="my-8" />

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    3. Information Sharing
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We do not sell, trade, or otherwise transfer your personal
                    information to third parties except as described in this
                    policy:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>With merchants to fulfill your orders</li>
                    <li>With service providers who assist in our operations</li>
                    <li>When required by law or to protect our rights</li>
                    <li>
                      In connection with a business transfer or acquisition
                    </li>
                  </ul>
                </section>

                <Separator className="my-8" />

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    4. Data Security
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We implement appropriate security measures to protect your
                    personal information against unauthorized access,
                    alteration, disclosure, or destruction. This includes:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>SSL encryption for data transmission</li>
                    <li>Secure servers and databases</li>
                    <li>Regular security audits and updates</li>
                    <li>Limited access to personal information</li>
                  </ul>
                </section>

                <Separator className="my-8" />

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    5. Cookies and Tracking
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We use cookies and similar tracking technologies to enhance
                    your experience on our website. You can control cookie
                    settings through your browser preferences.
                  </p>
                </section>

                <Separator className="my-8" />

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    6. Your Rights
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Access and update your personal information</li>
                    <li>Delete your account and personal data</li>
                    <li>Opt out of marketing communications</li>
                    <li>Request a copy of your data</li>
                    <li>File a complaint with relevant authorities</li>
                  </ul>
                </section>

                <Separator className="my-8" />

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    7. Children's Privacy
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Our service is not intended for children under 13 years of
                    age. We do not knowingly collect personal information from
                    children under 13.
                  </p>
                </section>

                <Separator className="my-8" />

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    8. Changes to Privacy Policy
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    We may update this privacy policy from time to time. We will
                    notify you of any changes by posting the new privacy policy
                    on this page and updating the "last updated" date.
                  </p>
                </section>

                <Separator className="my-8" />

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    9. Contact Us
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you have any questions about this Privacy Policy, please
                    contact us:
                  </p>
                  <div className="space-y-2 text-gray-700">
                    <p>Email: {platformInfo.contact.email}</p>
                    <p>Phone: {platformInfo.contact.phone}</p>
                    <p>Address: {platformInfo.contact.address}</p>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
