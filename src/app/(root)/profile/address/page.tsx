"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Home,
  Building,
  Save,
  X,
} from "lucide-react";
import { Address } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/constants";
import { Checkbox } from "@/components/ui/checkbox";

const AddressPage: React.FC = () => {
  const router = useRouter();
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      type: "home",
      name: "Home Address",
      street: "123 Fifth Avenue, Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      phone: "+1 (555) 123-4567",
      isDefault: true,
    },
    {
      id: "2",
      type: "work",
      name: "Office",
      street: "456 Business Plaza, Suite 200",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      country: "United States",
      phone: "+1 (555) 987-6543",
      isDefault: false,
    },
  ]);

  const [newAddress, setNewAddress] = useState<Omit<Address, "id">>({
    type: "home",
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
    isDefault: false,
  });

  const handleAddAddress = () => {
    const address: Address = {
      ...newAddress,
      id: Date.now().toString(),
    };
    setAddresses((prev) => [...prev, address]);
    setNewAddress({
      type: "home",
      name: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      phone: "",
      isDefault: false,
    });
    setIsAddingAddress(false);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    );
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="h-4 w-4" />;
      case "work":
        return <Building className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getAddressTypeColor = (type: string) => {
    switch (type) {
      case "home":
        return "bg-green-100 text-green-800";
      case "work":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" onClick={() => router.push("/profile")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Manage Addresses
              </h1>
              <p className="text-gray-600">
                Add and manage your shipping addresses
              </p>
            </div>
            <Button onClick={() => setIsAddingAddress(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </div>
        </div>

        {/* Add Address Form */}
        {isAddingAddress && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add New Address</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingAddress(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Address Name</Label>
                  <Input
                    id="name"
                    value={newAddress.name}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="e.g. Home, Office"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Address Type</Label>
                  <Select
                    value={newAddress.type}
                    onValueChange={(value: "home" | "work" | "other") =>
                      setNewAddress((prev) => ({
                        ...prev,
                        type: value,
                      }))
                    }
                  >
                    <SelectTrigger id="type" className="w-full">
                      <SelectValue placeholder="Select an address type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={newAddress.street}
                  onChange={(e) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      street: e.target.value,
                    }))
                  }
                  placeholder="123 Main Street, Apt 4B"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    placeholder="New York"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={newAddress.state}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                    placeholder="NY"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={newAddress.zipCode}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        zipCode: e.target.value,
                      }))
                    }
                    placeholder="10001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={newAddress.country}
                    onValueChange={(value) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        country: value,
                      }))
                    }
                  >
                    <SelectTrigger id="country" className="w-full">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newAddress.phone}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="isDefault"
                  checked={newAddress.isDefault}
                  onCheckedChange={(checked) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      isDefault: !!checked,
                    }))
                  }
                />
                <Label
                  htmlFor="isDefault"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Set as default address
                </Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddAddress}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Address
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingAddress(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Address List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className={address.isDefault ? "ring-2 ring-black" : ""}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-full ${getAddressTypeColor(address.type)}`}
                    >
                      {getAddressIcon(address.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {address.name}
                      </h3>
                      <Badge variant="secondary" className="capitalize">
                        {address.type}
                      </Badge>
                    </div>
                  </div>
                  {address.isDefault && (
                    <Badge className="bg-black text-white">Default</Badge>
                  )}
                </div>

                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p>{address.country}</p>
                  {address.phone && <p>{address.phone}</p>}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={address.isDefault}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {addresses.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No addresses added
            </h3>
            <p className="text-gray-600 mb-6">
              Add your first shipping address to get started
            </p>
            <Button onClick={() => setIsAddingAddress(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressPage;
