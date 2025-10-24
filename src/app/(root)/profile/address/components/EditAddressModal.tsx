'use client';

import { Edit } from 'lucide-react';
import React, { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Address } from '@/database/schema';

import AddressForm from './AddressForm';

interface EditAddressModalProps {
  address: Address;
  children: React.ReactNode;
}

const EditAddressModal: React.FC<EditAddressModalProps> = ({
  address,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Address
          </DialogTitle>
          <DialogDescription>
            Update your address information. Changes will be saved to your
            account.
          </DialogDescription>
        </DialogHeader>
        <AddressForm
          key={address.id}
          address={address}
          onSuccess={handleSuccess}
          isEditing
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditAddressModal;
