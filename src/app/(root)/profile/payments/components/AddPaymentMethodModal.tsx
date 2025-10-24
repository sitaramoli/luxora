'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Address } from '@/database/schema';

import AddPaymentMethodForm from './AddPaymentMethodForm';

interface AddPaymentMethodModalProps {
  addresses: Address[];
  children: React.ReactNode;
}

const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
  addresses,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setIsOpen(false);
    router.refresh(); // Refresh the page to show the new payment method
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Payment Method
          </DialogTitle>
          <DialogDescription>
            Add a new payment method to your account. You can set it as your
            default payment method for faster checkout.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)] px-6">
          <AddPaymentMethodForm
            addresses={addresses}
            onSuccess={handleSuccess}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentMethodModal;
