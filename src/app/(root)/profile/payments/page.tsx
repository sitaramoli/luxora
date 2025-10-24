import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserPaymentMethodsWithAddressesAction } from '@/lib/actions/payment-methods';

import AddPaymentMethodModal from './components/AddPaymentMethodModal';
import PaymentMethodCard from './components/PaymentMethodCard';

const PaymentsPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const result = await getUserPaymentMethodsWithAddressesAction();

  if (!result.success) {
    throw new Error(result.error || 'Failed to load payment methods');
  }

  const { paymentMethods, addresses } = result.data || {
    paymentMethods: [],
    addresses: [],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Payment Methods
              </h1>
              <p className="text-gray-600">
                Manage your payment methods and billing information
              </p>
            </div>
          </div>
          <AddPaymentMethodModal addresses={addresses}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </AddPaymentMethodModal>
        </div>

        {/* Payment Methods Grid */}
        {paymentMethods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.map(({ paymentMethod, billingAddress }) => (
              <PaymentMethodCard
                key={paymentMethod.id}
                paymentMethod={paymentMethod}
                billingAddress={billingAddress}
                addresses={addresses}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No payment methods found
                </h3>
                <p className="text-gray-600 mb-6">
                  Add your first payment method to make checkout faster and
                  easier.
                </p>
                <AddPaymentMethodModal addresses={addresses}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Payment Method
                  </Button>
                </AddPaymentMethodModal>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security & Info Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">
              Payment Security & Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  🔒 Secure Storage
                </h4>
                <p className="text-sm text-gray-600">
                  Your payment information is encrypted and stored securely. We
                  only store the last 4 digits of your card number.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  💳 Supported Cards
                </h4>
                <p className="text-sm text-gray-600">
                  We accept Visa, Mastercard, American Express, Discover, JCB,
                  and Diners Club cards.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  🏠 Billing Address
                </h4>
                <p className="text-sm text-gray-600">
                  Link your payment methods to your addresses for accurate
                  billing and fraud prevention.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  ⚡ Quick Checkout
                </h4>
                <p className="text-sm text-gray-600">
                  Set a default payment method for faster checkout. You can
                  change it at any time during purchase.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentsPage;
