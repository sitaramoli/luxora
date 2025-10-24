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
import type { Address } from '@/database/schema';

interface ConfirmDeleteDialogProps {
  address: Address;
  onConfirm: () => void;
  isDeleting: boolean;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  address,
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
          disabled={isDeleting || address.isDefault}
          title={
            address.isDefault ? 'Cannot delete default address' : undefined
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
            Delete Address
          </DialogTitle>
          <DialogDescription className="space-y-3">
            <p>
              Are you sure you want to delete this address? This action cannot
              be undone.
            </p>
            <div className="bg-gray-50 p-3 rounded-md border text-sm">
              <div className="font-medium text-gray-900">
                {address.fullName}
              </div>
              <div className="text-gray-600">
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <div>{address.addressLine2}</div>}
                <p>
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p>{address.country}</p>
              </div>
            </div>
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
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Address
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
