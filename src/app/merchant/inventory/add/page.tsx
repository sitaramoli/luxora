"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Save,
  Eye,
  Image as ImageIcon,
  Package,
  DollarSign,
  Tag,
} from "lucide-react";
import { useSession } from "next-auth/react";

const AddProductPage: React.FC = () => {
  const { data } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    category: "",
    brand: data?.user?.name || "",
    price: "",
    originalPrice: "",
    sku: "",
    barcode: "",
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
    stock: "",
    minStock: "",
    maxStock: "",
    status: "DRAFT",
    tags: [] as string[],
    sizes: [] as string[],
    colors: [] as { name: string; value: string }[],
    features: [] as string[],
    images: [] as string[],
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  const [newTag, setNewTag] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState({ name: "", value: "#000000" });
  const [newFeature, setNewFeature] = useState("");

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const keys = field.split(".");

      setProductData((prev) => {
        const updated = { ...prev };
        let current: any = updated;

        // Navigate to the parent object
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (
            !(key in current) ||
            typeof current[key] !== "object" ||
            current[key] === null
          ) {
            current[key] = {};
          }
          current = current[key];
        }

        // Set the final value
        current[keys[keys.length - 1]] = value;
        return updated;
      });
    } else {
      setProductData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !productData.tags.includes(newTag.trim())) {
      setProductData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProductData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addSize = () => {
    if (newSize.trim() && !productData.sizes.includes(newSize.trim())) {
      setProductData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()],
      }));
      setNewSize("");
    }
  };

  const removeSize = (sizeToRemove: string) => {
    setProductData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((size) => size !== sizeToRemove),
    }));
  };

  const addColor = () => {
    if (newColor.name.trim()) {
      setProductData((prev) => ({
        ...prev,
        colors: [...prev.colors, { ...newColor }],
      }));
      setNewColor({ name: "", value: "#000000" });
    }
  };

  const removeColor = (colorToRemove: { name: string; value: string }) => {
    setProductData((prev) => ({
      ...prev,
      colors: prev.colors.filter((color) => color.name !== colorToRemove.name),
    }));
  };

  const addFeature = () => {
    if (
      newFeature.trim() &&
      !productData.features.includes(newFeature.trim())
    ) {
      setProductData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setProductData((prev) => ({
      ...prev,
      features: prev.features.filter((feature) => feature !== featureToRemove),
    }));
  };

  const handleSubmit = async (status: "DRAFT" | "ACTIVE") => {
    setIsSubmitting(true);
    try {
      // Here you would submit to your API
      const submitData = { ...productData, status };
      console.log("Submitting product:", submitData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/merchant/inventory");
    } catch (error) {
      console.error("Error submitting product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    "Clothing",
    "Bags",
    "Shoes",
    "Jewelry",
    "Watches",
    "Accessories",
    "Beauty",
    "Home & Decor",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Product
          </h1>
          <p className="text-gray-600">
            Create a new product listing for your store
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                          id="name"
                          value={productData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="Enter product name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={productData.category}
                          onValueChange={(value) =>
                            handleInputChange("category", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category}
                                value={category.toLowerCase()}
                              >
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shortDescription">
                        Short Description
                      </Label>
                      <Input
                        id="shortDescription"
                        value={productData.shortDescription}
                        onChange={(e) =>
                          handleInputChange("shortDescription", e.target.value)
                        }
                        placeholder="Brief product description for listings"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Full Description *</Label>
                      <Textarea
                        id="description"
                        value={productData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder="Detailed product description"
                        rows={6}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="price"
                            type="number"
                            value={productData.price}
                            onChange={(e) =>
                              handleInputChange("price", e.target.value)
                            }
                            placeholder="0.00"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="originalPrice">
                          Original Price (Optional)
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="originalPrice"
                            type="number"
                            value={productData.originalPrice}
                            onChange={(e) =>
                              handleInputChange("originalPrice", e.target.value)
                            }
                            placeholder="0.00"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="mt-6">
                <div className="space-y-6">
                  {/* Product Variants */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Variants</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Sizes */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Sizes
                        </Label>
                        <div className="flex gap-2 mb-3">
                          <Input
                            value={newSize}
                            onChange={(e) => setNewSize(e.target.value)}
                            placeholder="Add size (e.g., S, M, L)"
                            onKeyPress={(e) => e.key === "Enter" && addSize()}
                          />
                          <Button onClick={addSize} type="button">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {productData.sizes.map((size) => (
                            <Badge
                              key={size}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {size}
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => removeSize(size)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Colors */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Colors
                        </Label>
                        <div className="flex gap-2 mb-3">
                          <Input
                            value={newColor.name}
                            onChange={(e) =>
                              setNewColor((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            placeholder="Color name"
                          />
                          <input
                            type="color"
                            value={newColor.value}
                            onChange={(e) =>
                              setNewColor((prev) => ({
                                ...prev,
                                value: e.target.value,
                              }))
                            }
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Button onClick={addColor} type="button">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {productData.colors.map((color) => (
                            <Badge
                              key={color.name}
                              variant="secondary"
                              className="flex items-center gap-2"
                            >
                              <div
                                className="w-3 h-3 rounded-full border"
                                style={{ backgroundColor: color.value }}
                              />
                              {color.name}
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => removeColor(color)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Product Features
                        </Label>
                        <div className="flex gap-2 mb-3">
                          <Input
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            placeholder="Add product feature"
                            onKeyPress={(e) =>
                              e.key === "Enter" && addFeature()
                            }
                          />
                          <Button onClick={addFeature} type="button">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {productData.features.map((feature) => (
                            <div
                              key={feature}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded"
                            >
                              <span className="text-sm">{feature}</span>
                              <X
                                className="h-4 w-4 cursor-pointer text-gray-500 hover:text-red-500"
                                onClick={() => removeFeature(feature)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Product Specifications */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Specifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="sku">SKU</Label>
                          <Input
                            id="sku"
                            value={productData.sku}
                            onChange={(e) =>
                              handleInputChange("sku", e.target.value)
                            }
                            placeholder="Product SKU"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="barcode">Barcode</Label>
                          <Input
                            id="barcode"
                            value={productData.barcode}
                            onChange={(e) =>
                              handleInputChange("barcode", e.target.value)
                            }
                            placeholder="Product barcode"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          value={productData.weight}
                          onChange={(e) =>
                            handleInputChange("weight", e.target.value)
                          }
                          placeholder="0.0"
                          step="0.1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Dimensions (cm)
                        </Label>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="length">Length</Label>
                            <Input
                              id="length"
                              type="number"
                              value={productData.dimensions.length}
                              onChange={(e) =>
                                handleInputChange(
                                  "dimensions.length",
                                  e.target.value,
                                )
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="width">Width</Label>
                            <Input
                              id="width"
                              type="number"
                              value={productData.dimensions.width}
                              onChange={(e) =>
                                handleInputChange(
                                  "dimensions.width",
                                  e.target.value,
                                )
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="height">Height</Label>
                            <Input
                              id="height"
                              type="number"
                              value={productData.dimensions.height}
                              onChange={(e) =>
                                handleInputChange(
                                  "dimensions.height",
                                  e.target.value,
                                )
                              }
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="inventory" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="stock">Current Stock *</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={productData.stock}
                          onChange={(e) =>
                            handleInputChange("stock", e.target.value)
                          }
                          placeholder="0"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minStock">Minimum Stock Alert</Label>
                        <Input
                          id="minStock"
                          type="number"
                          value={productData.minStock}
                          onChange={(e) =>
                            handleInputChange("minStock", e.target.value)
                          }
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxStock">Maximum Stock</Label>
                        <Input
                          id="maxStock"
                          type="number"
                          value={productData.maxStock}
                          onChange={(e) =>
                            handleInputChange("maxStock", e.target.value)
                          }
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Tags
                      </Label>
                      <div className="flex gap-2 mb-3">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add tag"
                          onKeyPress={(e) => e.key === "Enter" && addTag()}
                        />
                        <Button onClick={addTag} type="button">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {productData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => removeTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="media" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Upload Product Images
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Drag and drop images here, or click to browse
                      </p>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Files
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        Supported formats: JPG, PNG, WebP. Max size: 5MB per
                        image.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>SEO Optimization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="seoTitle">SEO Title</Label>
                      <Input
                        id="seoTitle"
                        value={productData.seoTitle}
                        onChange={(e) =>
                          handleInputChange("seoTitle", e.target.value)
                        }
                        placeholder="SEO optimized title"
                      />
                      <p className="text-xs text-gray-500">
                        Recommended: 50-60 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seoDescription">Meta Description</Label>
                      <Textarea
                        id="seoDescription"
                        value={productData.seoDescription}
                        onChange={(e) =>
                          handleInputChange("seoDescription", e.target.value)
                        }
                        placeholder="SEO meta description"
                        rows={3}
                      />
                      <p className="text-xs text-gray-500">
                        Recommended: 150-160 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seoKeywords">Keywords</Label>
                      <Input
                        id="seoKeywords"
                        value={productData.seoKeywords}
                        onChange={(e) =>
                          handleInputChange("seoKeywords", e.target.value)
                        }
                        placeholder="keyword1, keyword2, keyword3"
                      />
                      <p className="text-xs text-gray-500">
                        Separate keywords with commas
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Product Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={productData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => handleSubmit("DRAFT")}
                    variant="outline"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button
                    onClick={() => handleSubmit("ACTIVE")}
                    className="w-full bg-black text-white hover:bg-gray-800"
                    disabled={isSubmitting}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Publishing..." : "Publish Product"}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Tips</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-2">
                  <p>• Use high-quality images for better conversion</p>
                  <p>• Write detailed descriptions with key features</p>
                  <p>• Set competitive pricing based on market research</p>
                  <p>• Use relevant tags for better discoverability</p>
                  <p>• Keep inventory levels updated</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
