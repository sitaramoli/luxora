import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserAddressesAction } from '@/lib/actions/addresses';

import AddAddressModal from './components/AddAddressModal';
import AddressCard from './components/AddressCard';

const AddressPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const result = await getUserAddressesAction();

  if (!result.success) {
    throw new Error(result.error || 'Failed to load addresses');
  }

  const addresses = result.data || [];

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
                My Addresses
              </h1>
              <p className="text-gray-600">Manage your delivery addresses</p>
            </div>
          </div>
          <AddAddressModal>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </AddAddressModal>
        </div>

        {/* Addresses Grid */}
        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map(address => (
              <AddressCard key={address.id} address={address} />
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
                  No addresses found
                </h3>
                <p className="text-gray-600 mb-6">
                  Add your first delivery address to get started with faster
                  checkout.
                </p>
                <AddAddressModal>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Address
                  </Button>
                </AddAddressModal>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Address Management Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Default Address
                </h4>
                <p className="text-sm text-gray-600">
                  Set a default address for faster checkout. It will be
                  automatically selected during your orders.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Multiple Addresses
                </h4>
                <p className="text-sm text-gray-600">
                  Add multiple addresses for different locations like home,
                  work, or gift deliveries.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Address Types
                </h4>
                <p className="text-sm text-gray-600">
                  Organize your addresses by type (Home, Work, Other) for easy
                  identification.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Security</h4>
                <p className="text-sm text-gray-600">
                  Your addresses are securely stored and only used for order
                  delivery purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddressPage;
