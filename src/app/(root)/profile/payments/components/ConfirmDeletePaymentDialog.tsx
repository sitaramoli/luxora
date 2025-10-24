'use client';

import { AlertTriangle, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { PaymentMethod } from '@/database/schema';

interface ConfirmDeletePaymentDialogProps {
  paymentMethod: PaymentMethod;
  onConfirm: () => void;
  isDeleting: boolean;
}

const ConfirmDeletePaymentDialog: React.FC<ConfirmDeletePaymentDialogProps> = ({
  paymentMethod,
  onConfirm,
  isDeleting,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={isDeleting || paymentMethod.isDefault}
          title={
            paymentMethod.isDefault
              ? 'Cannot delete default payment method'
              : undefined
          }
        >
          <Trash2 className="h-4 w-4" />
          {isDeleting ? 'Deleting...' : ''}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Payment Method
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this payment method? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeletePaymentDialog;
