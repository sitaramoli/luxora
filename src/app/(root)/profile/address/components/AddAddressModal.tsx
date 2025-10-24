'use client';

import { Plus } from 'lucide-react';
import React, { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import AddressForm from './AddressForm';

interface AddAddressModalProps {
  children: React.ReactNode;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({ children }) => {
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
            <Plus className="h-5 w-5" />
            Add New Address
          </DialogTitle>
          <DialogDescription>
            Add a new delivery address to your account. You can set it as your
            default address for faster checkout.
          </DialogDescription>
        </DialogHeader>
        <AddressForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default AddAddressModal;
