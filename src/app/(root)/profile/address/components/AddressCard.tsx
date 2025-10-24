'use client';

import { Edit, MapPin, Home, Building, Star } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Address } from '@/database/schema';
import {
  deleteAddressAction,
  setDefaultAddressAction,
} from '@/lib/actions/addresses';

import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import EditAddressModal from './EditAddressModal';

interface AddressCardProps {
  address: Address;
}

const AddressCard: React.FC<AddressCardProps> = ({ address }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingDefault, setIsSettingDefault] = useState(false);

  const getAddressIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'home':
        return <Home className="h-4 w-4" />;
      case 'work':
        return <Building className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getAddressTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'home':
        return 'bg-green-100 text-green-800';
      case 'work':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAddressAction(address.id);
      if (!result.success) {
        toast.error(result.error || 'Failed to delete address');
      } else {
        toast.success('Address deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetDefault = async () => {
    setIsSettingDefault(true);
    try {
      const result = await setDefaultAddressAction(address.id);
      if (!result.success) {
        toast.error(result.error || 'Failed to set default address');
      } else {
        toast.success('Default address updated successfully');
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to set default address');
    } finally {
      setIsSettingDefault(false);
    }
  };

  return (
    <Card className={address.isDefault ? 'ring-2 ring-blue-500' : ''}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${getAddressTypeColor(address.type)}`}
            >
              {getAddressIcon(address.type)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {address.fullName}
              </h3>
              <Badge variant="secondary" className="capitalize mt-1">
                {address.type.toLowerCase()}
              </Badge>
            </div>
          </div>
          {address.isDefault && (
            <Badge className="bg-blue-500 text-white flex items-center gap-1">
              <Star className="h-3 w-3" />
              Default
            </Badge>
          )}
        </div>

        <div className="space-y-1 text-sm text-gray-600 mb-4">
          <p className="font-medium">{address.addressLine1}</p>
          {address.addressLine2 && <p>{address.addressLine2}</p>}
          <p>
            {address.city}, {address.state} {address.postalCode}
          </p>
          <p>{address.country}</p>
          {address.phone && (
            <p className="flex items-center gap-1 mt-2">
              <span className="font-medium">Phone:</span> {address.phone}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <EditAddressModal address={address}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </EditAddressModal>

          {!address.isDefault && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSetDefault}
              disabled={isSettingDefault}
            >
              <Star className="h-4 w-4 mr-2" />
              {isSettingDefault ? 'Setting...' : 'Set Default'}
            </Button>
          )}

          <ConfirmDeleteDialog
            address={address}
            onConfirm={handleDelete}
            isDeleting={isDeleting}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressCard;
