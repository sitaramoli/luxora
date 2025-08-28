"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  CreditCard,
  Shield,
  Save,
  X,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";

interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "bank";
  cardType?: "visa" | "mastercard" | "amex" | "discover";
  last4?: string;
  expiryMonth?: string;
  expiryYear?: string;
  holderName?: string;
  email?: string;
  bankName?: string;
  accountLast4?: string;
  isDefault: boolean;
}

const PaymentMethodsPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => String(currentYear + i));
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      cardType: "visa",
      last4: "4242",
      expiryMonth: "12",
      expiryYear: "2025",
      holderName: "John Doe",
      isDefault: true,
    },
    {
      id: "2",
      type: "card",
      cardType: "mastercard",
      last4: "8888",
      expiryMonth: "06",
      expiryYear: "2026",
      holderName: "John Doe",
      isDefault: false,
    },
    {
      id: "3",
      type: "paypal",
      email: "john.doe@example.com",
      isDefault: false,
    },
  ]);

  const [newPayment, setNewPayment] = useState({
    type: "card",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    holderName: "",
    email: "",
    isDefault: false,
  });

  const handleAddPayment = () => {
    const payment: PaymentMethod = {
      id: Date.now().toString(),
      type: newPayment.type as "card" | "paypal",
      ...(newPayment.type === "card"
        ? {
            cardType: getCardType(newPayment.cardNumber),
            last4: newPayment.cardNumber.slice(-4),
            expiryMonth: newPayment.expiryMonth,
            expiryYear: newPayment.expiryYear,
            holderName: newPayment.holderName,
          }
        : {
            email: newPayment.email,
          }),
      isDefault: newPayment.isDefault,
    };

    setPaymentMethods((prev) => [...prev, payment]);
    setNewPayment({
      type: "card",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      holderName: "",
      email: "",
      isDefault: false,
    });
    setIsAddingPayment(false);
  };

  const handleDeletePayment = (id: string) => {
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      })),
    );
  };

  const getCardType = (
    cardNumber: string,
  ): "visa" | "mastercard" | "amex" | "discover" => {
    const number = cardNumber.replace(/\s/g, "");
    if (number.startsWith("4")) return "visa";
    if (number.startsWith("5") || number.startsWith("2")) return "mastercard";
    if (number.startsWith("3")) return "amex";
    return "discover";
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Payment Methods
              </h1>
              <p className="text-gray-600">
                Manage your payment methods and billing information
              </p>
            </div>
            <Button onClick={() => setIsAddingPayment(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </div>

        {/* Add Payment Form */}
        {isAddingPayment && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add Payment Method</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingPayment(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Payment Type</Label>
                <RadioGroup
                  value={newPayment.type}
                  onValueChange={(value) =>
                    setNewPayment((prev) => ({
                      ...prev,
                      type: value as "card" | "paypal",
                    }))
                  }
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="r-card" />
                    <Label
                      htmlFor="r-card"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="h-5 w-5" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paypal" id="r-paypal" />
                    <Label htmlFor="r-paypal" className="cursor-pointer">
                      PayPal
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {newPayment.type === "card" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="holderName">Cardholder Name</Label>
                    <Input
                      id="holderName"
                      value={newPayment.holderName}
                      onChange={(e) =>
                        setNewPayment((prev) => ({
                          ...prev,
                          holderName: e.target.value,
                        }))
                      }
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        type={showCardNumber ? "text" : "password"}
                        value={formatCardNumber(newPayment.cardNumber)}
                        onChange={(e) =>
                          setNewPayment((prev) => ({
                            ...prev,
                            cardNumber: e.target.value.replace(/\s/g, ""),
                          }))
                        }
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowCardNumber(!showCardNumber)}
                      >
                        {showCardNumber ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryMonth">Month</Label>
                      <Select
                        value={newPayment.expiryMonth}
                        onValueChange={(value) =>
                          setNewPayment((prev) => ({
                            ...prev,
                            expiryMonth: value,
                          }))
                        }
                      >
                        <SelectTrigger id="expiryMonth" className="w-full">
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryYear">Year</Label>
                      <Select
                        value={newPayment.expiryYear}
                        onValueChange={(value) =>
                          setNewPayment((prev) => ({
                            ...prev,
                            expiryYear: value,
                          }))
                        }
                      >
                        <SelectTrigger id="expiryYear" className="w-full">
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <div className="relative">
                        <Input
                          id="cvv"
                          type={showCVV ? "text" : "password"}
                          value={newPayment.cvv}
                          onChange={(e) =>
                            setNewPayment((prev) => ({
                              ...prev,
                              cvv: e.target.value,
                            }))
                          }
                          placeholder="123"
                          maxLength={4}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowCVV(!showCVV)}
                        >
                          {showCVV ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {newPayment.type === "paypal" && (
                <div className="space-y-2">
                  <Label htmlFor="email">PayPal Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newPayment.email}
                    onChange={(e) =>
                      setNewPayment((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="john.doe@example.com"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDefault"
                  checked={newPayment.isDefault}
                  onCheckedChange={(checked) =>
                    setNewPayment((prev) => ({
                      ...prev,
                      isDefault: !!checked,
                    }))
                  }
                />
                <Label
                  htmlFor="isDefault"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Set as default payment method
                </Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddPayment}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Payment Method
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingPayment(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Methods List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paymentMethods.map((payment) => (
            <Card
              key={payment.id}
              className={payment.isDefault ? "ring-2 ring-black" : ""}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      {payment.type === "card" ? (
                        <CreditCard className="h-5 w-5" />
                      ) : (
                        <span className="text-lg">💰</span>
                      )}
                    </div>
                    <div>
                      {payment.type === "card" ? (
                        <>
                          <h3 className="font-semibold text-gray-900 capitalize">
                            {payment.cardType} •••• {payment.last4}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {payment.holderName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Expires {payment.expiryMonth}/{payment.expiryYear}
                          </p>
                        </>
                      ) : (
                        <>
                          <h3 className="font-semibold text-gray-900">
                            PayPal
                          </h3>
                          <p className="text-sm text-gray-600">
                            {payment.email}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  {payment.isDefault && (
                    <Badge className="bg-black text-white">Default</Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Shield className="h-4 w-4" />
                  <span>Secured with 256-bit SSL encryption</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  {!payment.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(payment.id)}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePayment(payment.id)}
                    disabled={payment.isDefault}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {paymentMethods.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No payment methods added
            </h3>
            <p className="text-gray-600 mb-6">
              Add a payment method to make purchases easier
            </p>
            <Button onClick={() => setIsAddingPayment(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        )}

        {/* Security Notice */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Your payment information is secure
                </h3>
                <p className="text-sm text-gray-600">
                  We use industry-standard encryption to protect your payment
                  details. Your card information is never stored on our servers
                  and is processed securely through our payment partners.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;
