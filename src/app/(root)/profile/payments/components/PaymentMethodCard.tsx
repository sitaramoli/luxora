'use client';

import { CreditCard, Edit, Star, MapPin } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { PaymentMethod, Address } from '@/database/schema';
import {
  deletePaymentMethodAction,
  setDefaultPaymentMethodAction,
} from '@/lib/actions/payment-methods';

import ConfirmDeletePaymentDialog from './ConfirmDeletePaymentDialog';
import EditPaymentMethodModal from './EditPaymentMethodModal';

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  billingAddress: Address | null;
  addresses: Address[];
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  paymentMethod,
  billingAddress,
  addresses,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingDefault, setIsSettingDefault] = useState(false);

  const getCardBrandColor = (brand: string | null) => {
    if (!brand) return 'bg-gray-100 text-gray-800';

    switch (brand.toLowerCase()) {
      case 'visa':
        return 'bg-blue-100 text-blue-800';
      case 'mastercard':
        return 'bg-red-100 text-red-800';
      case 'american_express':
        return 'bg-green-100 text-green-800';
      case 'discover':
        return 'bg-orange-100 text-orange-800';
      case 'jcb':
        return 'bg-purple-100 text-purple-800';
      case 'diners_club':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'credit_card':
      case 'debit_card':
        return <CreditCard className="h-5 w-5" />;
      case 'paypal':
        return '💰';
      case 'apple_pay':
        return '🍎';
      case 'google_pay':
        return '🌐';
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deletePaymentMethodAction(paymentMethod.id);
      if (!result.success) {
        toast.error(result.error || 'Failed to delete payment method');
      } else {
        toast.success('Payment method deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('Failed to delete payment method');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetDefault = async () => {
    setIsSettingDefault(true);
    try {
      const result = await setDefaultPaymentMethodAction(paymentMethod.id);
      if (!result.success) {
        toast.error(result.error || 'Failed to set default payment method');
      } else {
        toast.success('Default payment method updated successfully');
      }
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast.error('Failed to set default payment method');
    } finally {
      setIsSettingDefault(false);
    }
  };

  const formatCardType = (type: string, brand: string | null) => {
    if (['CREDIT_CARD', 'DEBIT_CARD'].includes(type) && brand) {
      return brand
        .replace('_', ' ')
        .toLowerCase()
        .replace(/\b\w/g, l => l.toUpperCase());
    }
    return type
      .replace('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card className={paymentMethod.isDefault ? 'ring-2 ring-blue-500' : ''}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${getCardBrandColor(paymentMethod.cardBrand)}`}
            >
              {getPaymentMethodIcon(paymentMethod.type)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {['CREDIT_CARD', 'DEBIT_CARD'].includes(paymentMethod.type)
                  ? `${formatCardType(paymentMethod.type, paymentMethod.cardBrand)} ••••${paymentMethod.cardNumberLast4}`
                  : formatCardType(paymentMethod.type, paymentMethod.cardBrand)}
              </h3>
              {paymentMethod.cardholderName && (
                <p className="text-sm text-gray-600">
                  {paymentMethod.cardholderName}
                </p>
              )}
              {paymentMethod.expiryMonth && paymentMethod.expiryYear && (
                <p className="text-sm text-gray-500">
                  Expires {String(paymentMethod.expiryMonth).padStart(2, '0')}/
                  {paymentMethod.expiryYear}
                </p>
              )}
            </div>
          </div>
          {paymentMethod.isDefault && (
            <Badge className="bg-blue-500 text-white flex items-center gap-1">
              <Star className="h-3 w-3" />
              Default
            </Badge>
          )}
        </div>

        {/* Billing Address */}
        {billingAddress && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Billing Address
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <div>{billingAddress.addressLine1}</div>
              {billingAddress.addressLine2 && (
                <div>{billingAddress.addressLine2}</div>
              )}
              <div>
                {billingAddress.city}, {billingAddress.state}{' '}
                {billingAddress.postalCode}
              </div>
              <div>{billingAddress.country}</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <EditPaymentMethodModal
            paymentMethod={paymentMethod}
            billingAddress={billingAddress}
            addresses={addresses}
          >
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </EditPaymentMethodModal>

          {!paymentMethod.isDefault && (
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

          <ConfirmDeletePaymentDialog
            paymentMethod={paymentMethod}
            onConfirm={handleDelete}
            isDeleting={isDeleting}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard;
