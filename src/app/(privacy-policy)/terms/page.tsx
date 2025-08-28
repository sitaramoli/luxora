"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { platformInfo } from "@/constants";

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
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
                    1. Acceptance of Terms
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    By accessing and using the LUXE platform, you accept and
                    agree to be bound by the terms and provision of this
                    agreement. If you do not agree to abide by the above, please
                    do not use this service.
                  </p>
                </section>

                <Separator className="my-8" />

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    2. Use License
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Permission is granted to temporarily download one copy of
                    the materials on LUXE's website for personal, non-commercial
                    transitory viewing only. This is the grant of a license, not
                    a transfer of title, and under this license you may not:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>modify or copy the materials</li>
                    <li>
                      use the materials for any commercial purpose or for any
                      public display
                    </li>
                    <li>
                      attempt to reverse engineer any software contained on the
                      website
                    </li>
                    <li>
                      remove any copyright or other proprietary notations from
                      the materials
                    </li>
                  </ul>
                </section>

                <Separator className="my-8" />

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    3. Product Information and Pricing
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We strive to provide accurate product descriptions and
                    pricing information. However, we do not warrant that product
                    descriptions or other content is accurate, complete,
                    reliable, current, or error-free.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    All prices are subject to change without notice. We reserve
                    the right to modify or discontinue products at any time
                    without notice.
                  </p>
                </section>

                <Separator className="my-8" />

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    4. User Accounts
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    When you create an account with us, you must provide
                    information that is accurate, complete, and current at all
                    times. You are responsible for safeguarding the password and
                    for all activities that occur under your account.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You agree not to disclose your password to any third party
                    and to take sole responsibility for activities and actions
                    under your password, whether or not you have authorized such
                    activities or actions.
                  </p>
                </section>

                <Separator className="my-8" />

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    5. Purchases and Payment
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    All purchases are subject to product availability. We
                    reserve the right to refuse or cancel any order for any
                    reason. Payment must be received by us before we dispatch
                    your order.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We accept various forms of payment as indicated on our
                    website. All transactions are processed securely through our
                    payment partners.
                  </p>
                </section>

                <Separator className="my-8" />

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    6. Shipping and Delivery
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We will arrange for shipment of purchased products to you.
                    Title and risk of loss pass to you upon delivery to the
                    carrier. Shipping and delivery dates are estimates only.
                  </p>
                </section>

                <Separator className="my-8" />

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    7. Returns and Refunds
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We offer a 30-day return policy for most items. Items must
                    be returned in their original condition with all tags
                    attached. Some items may not be eligible for return due to
                    hygiene or safety reasons.
                  </p>
                </section>

                <Separator className="my-8" />

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    8. Privacy Policy
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Your privacy is important to us. Please review our Privacy
                    Policy, which also governs your use of the website, to
                    understand our practices.
                  </p>
                </section>

                <Separator className="my-8" />

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    9. Limitation of Liability
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    In no event shall LUXE or its suppliers be liable for any
                    damages (including, without limitation, damages for loss of
                    data or profit, or due to business interruption) arising out
                    of the use or inability to use the materials on LUXE's
                    website.
                  </p>
                </section>

                <Separator className="my-8" />

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    10. Contact Information
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    If you have any questions about these Terms of Service,
                    please contact us at:
                  </p>
                  <div className="mt-4 space-y-2 text-gray-700">
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

export default TermsPage;
