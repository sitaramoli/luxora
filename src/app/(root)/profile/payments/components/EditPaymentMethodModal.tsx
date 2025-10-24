'use client';

import { Edit } from 'lucide-react';
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
import type { PaymentMethod, Address } from '@/database/schema';

import EditPaymentMethodForm from './EditPaymentMethodForm';

interface EditPaymentMethodModalProps {
  paymentMethod: PaymentMethod;
  billingAddress: Address | null;
  addresses: Address[];
  children: React.ReactNode;
}

const EditPaymentMethodModal: React.FC<EditPaymentMethodModalProps> = ({
  paymentMethod,
  billingAddress,
  addresses,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setIsOpen(false);
    router.refresh(); // Refresh the page to show the updated payment method
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Payment Method
          </DialogTitle>
          <DialogDescription>
            Update your payment method information. Changes will be saved to
            your account.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)] px-6">
          <EditPaymentMethodForm
            paymentMethod={paymentMethod}
            billingAddress={billingAddress}
            addresses={addresses}
            onSuccess={handleSuccess}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditPaymentMethodModal;
