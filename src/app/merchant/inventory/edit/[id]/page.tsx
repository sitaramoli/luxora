'use client';

import {
  ArrowLeft,
  Upload,
  X,
  Save,
  Image as ImageIcon,
  Package,
  Tag,
  Plus,
  DollarSign,
  Archive,
  Loader,
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  getMerchantProduct,
  updateMerchantProduct,
  uploadImages,
} from '@/lib/services/products';

interface Product {
  id: number;
  name: string;
  description: string;
  shortDescription?: string | null;
  category: string;
  price: string;
  originalPrice: string;
  sku: string;
  barcode?: string | null;
  weight?: string | null;
  length?: string | null;
  width?: string | null;
  height?: string | null;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  stockCount: number;
  minStock: number;
  maxStock: number;
  tags: string[] | null;
  sizes: string[] | null;
  colors: { name: string; value: string }[] | null;
  features: string[] | null;
  images: string[] | null;
  isFeatured: boolean;
  onSale: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

const EditProductPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.id as string);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    price: '',
    originalPrice: '',
    sku: '',
    barcode: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
    },
    stockCount: '',
    minStock: '',
    maxStock: '',
    status: 'DRAFT' as 'ACTIVE' | 'DRAFT' | 'ARCHIVED',
    tags: [] as string[],
    sizes: [] as string[],
    colors: [] as { name: string; value: string }[],
    features: [] as string[],
    images: [] as string[],
    onSale: false,
    isFeatured: false,
  });

  const [newTag, setNewTag] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState({ name: '', value: '#000000' });
  const [newFeature, setNewFeature] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  // Load product data on component mount
  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      const result = await getMerchantProduct(productId);
      if (result.success && result.data) {
        const product = result.data;
        setProductData({
          name: product.name,
          description: product.description,
          shortDescription: product.shortDescription || '',
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice,
          sku: product.sku,
          barcode: product.barcode || '',
          weight: product.weight || '',
          dimensions: {
            length: product.length || '',
            width: product.width || '',
            height: product.height || '',
          },
          stockCount: product.stockCount.toString(),
          minStock: product.minStock.toString(),
          maxStock: product.maxStock.toString(),
          status: product.status,
          tags: product.tags || [],
          sizes: product.sizes || [],
          colors: (product.colors as { name: string; value: string }[]) || [],
          features: product.features || [],
          images: product.images || [],
          onSale: product.onSale,
          isFeatured: product.isFeatured,
        });
      } else {
        toast.error(result.error || 'Failed to load product');
        router.push('/merchant/inventory');
      }
    } catch (error) {
      toast.error('Failed to load product');
      console.error('Error loading product:', error);
      router.push('/merchant/inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes('.')) {
      const keys = field.split('.');

      setProductData(prev => {
        const updated = { ...prev };
        let current: Record<string, any> = updated;

        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (
            !(key in current) ||
            typeof current[key] !== 'object' ||
            current[key] === null
          ) {
            current[key] = {};
          }
          current = current[key];
        }

        current[keys[keys.length - 1]] = value;
        return updated;
      });
    } else {
      setProductData(prev => ({ ...prev, [field]: value }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !productData.tags.includes(newTag.trim())) {
      setProductData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProductData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const addSize = () => {
    if (newSize.trim() && !productData.sizes.includes(newSize.trim())) {
      setProductData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()],
      }));
      setNewSize('');
    }
  };

  const removeSize = (sizeToRemove: string) => {
    setProductData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(size => size !== sizeToRemove),
    }));
  };

  const addColor = () => {
    if (newColor.name.trim()) {
      setProductData(prev => ({
        ...prev,
        colors: [...prev.colors, { ...newColor }],
      }));
      setNewColor({ name: '', value: '#000000' });
    }
  };

  const removeColor = (colorToRemove: { name: string; value: string }) => {
    setProductData(prev => ({
      ...prev,
      colors: prev.colors.filter(color => color.name !== colorToRemove.name),
    }));
  };

  const addFeature = () => {
    if (
      newFeature.trim() &&
      !productData.features.includes(newFeature.trim())
    ) {
      setProductData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setProductData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove),
    }));
  };

  const handleFileSelection = (files: FileList) => {
    const newFiles = Array.from(files);
    setSelectedImages(prev => [...prev, ...newFiles]);
  };

  const removeImage = (index: number, isSelectedImage: boolean) => {
    if (isSelectedImage) {
      setSelectedImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setProductData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED') => {
    setIsSubmitting(true);
    const uploadedImageUrls: string[] = [...productData.images];

    if (selectedImages.length > 0) {
      const formData = new FormData();
      selectedImages.forEach(file => {
        formData.append('images', file);
      });

      const uploadResult = await uploadImages(formData, productData.name);

      if (!uploadResult.success || !uploadResult.urls) {
        toast.error('Image Upload Failed', {
          description: uploadResult.error || 'Could not upload images.',
        });
        setIsSubmitting(false);
        return;
      }
      uploadedImageUrls.push(...uploadResult.urls);
    }

    try {
      const updateData = {
        name: productData.name,
        description: productData.description,
        shortDescription: productData.shortDescription || null,
        category: productData.category,
        sku: productData.sku,
        barcode: productData.barcode || null,
        status,
        price: parseFloat(productData.price).toString(),
        originalPrice: parseFloat(productData.originalPrice).toString(),
        stockCount: parseInt(productData.stockCount, 10) || 0,
        minStock: parseInt(productData.minStock, 10) || 0,
        maxStock: parseInt(productData.maxStock, 10) || 0,
        weight: productData.weight
          ? parseFloat(productData.weight).toString()
          : null,
        length: productData.dimensions.length
          ? productData.dimensions.length.toString()
          : null,
        width: productData.dimensions.width
          ? productData.dimensions.width.toString()
          : null,
        height: productData.dimensions.height
          ? productData.dimensions.height.toString()
          : null,
        sizes: productData.sizes,
        colors: productData.colors,
        features: productData.features,
        tags: productData.tags,
        images: uploadedImageUrls,
        onSale: productData.onSale,
        isFeatured: productData.isFeatured,
      };

      const result = await updateMerchantProduct(productId, updateData);

      if (result.success) {
        toast.success('Success', {
          description: 'Product updated successfully',
        });
        router.push('/merchant/inventory');
      } else {
        toast.error('Error', {
          description: result.error || 'Failed to update product',
        });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error', {
        description: 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Clothing',
    'Bags',
    'Shoes',
    'Jewelry',
    'Watches',
    'Accessories',
    'Beauty',
    'Home & Decor',
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </div>
    );
  }

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
            Edit Product
          </h1>
          <p className="text-gray-600">Update your product listing details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
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
                          onChange={e =>
                            handleInputChange('name', e.target.value)
                          }
                          placeholder="Enter product name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={productData.category}
                          onValueChange={value =>
                            handleInputChange('category', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
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
                        Short Description (Optional)
                      </Label>
                      <Input
                        id="shortDescription"
                        value={productData.shortDescription}
                        onChange={e =>
                          handleInputChange('shortDescription', e.target.value)
                        }
                        placeholder="Brief product description for listings"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Full Description *</Label>
                      <Textarea
                        id="description"
                        value={productData.description}
                        onChange={e =>
                          handleInputChange('description', e.target.value)
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
                            min={0}
                            value={productData.price}
                            onChange={e =>
                              handleInputChange('price', e.target.value)
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
                            min={0}
                            value={productData.originalPrice}
                            onChange={e =>
                              handleInputChange('originalPrice', e.target.value)
                            }
                            placeholder="0.00"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="onSale">On Sale (Optional)</Label>
                        <Switch
                          checked={productData.onSale}
                          onCheckedChange={checked =>
                            handleInputChange('onSale', checked)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="isFeatured">
                          Featured Product (Optional)
                        </Label>
                        <Switch
                          checked={productData.isFeatured}
                          onCheckedChange={checked =>
                            handleInputChange('isFeatured', checked)
                          }
                        />
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
                          Sizes (Optional)
                        </Label>
                        <div className="flex gap-2 mb-3">
                          <Input
                            value={newSize}
                            onChange={e => setNewSize(e.target.value)}
                            placeholder="Add size (e.g., S, M, L)"
                            onKeyDown={e => e.key === 'Enter' && addSize()}
                          />
                          <Button onClick={addSize} type="button">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {productData.sizes.map(size => (
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
                          Colors (Optional)
                        </Label>
                        <div className="flex gap-2 mb-3">
                          <Input
                            value={newColor.name}
                            onChange={e =>
                              setNewColor(prev => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            placeholder="Color name"
                          />
                          <input
                            type="color"
                            value={newColor.value}
                            onChange={e =>
                              setNewColor(prev => ({
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
                          {productData.colors.map(color => (
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
                                className="h-3 w-3 cursor-pointer text-gray-500 hover:text-red-500"
                                onClick={() => removeColor(color)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Product Features *
                        </Label>
                        <div className="flex gap-2 mb-3">
                          <Input
                            value={newFeature}
                            onChange={e => setNewFeature(e.target.value)}
                            placeholder="Add product feature"
                            onKeyDown={e => e.key === 'Enter' && addFeature()}
                          />
                          <Button onClick={addFeature} type="button">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {productData.features.map(feature => (
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
                          <Label htmlFor="sku">SKU *</Label>
                          <Input
                            id="sku"
                            value={productData.sku}
                            onChange={e =>
                              handleInputChange('sku', e.target.value)
                            }
                            placeholder="Product SKU"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="barcode">Barcode (Optional)</Label>
                          <Input
                            id="barcode"
                            value={productData.barcode}
                            onChange={e =>
                              handleInputChange('barcode', e.target.value)
                            }
                            placeholder="Product barcode"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg) (Optional)</Label>
                        <Input
                          id="weight"
                          type="number"
                          min={0}
                          value={productData.weight}
                          onChange={e =>
                            handleInputChange('weight', e.target.value)
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
                            <Label htmlFor="length">Length (Optional)</Label>
                            <Input
                              id="length"
                              type="number"
                              min={0}
                              value={productData.dimensions.length}
                              onChange={e =>
                                handleInputChange(
                                  'dimensions.length',
                                  e.target.value
                                )
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="width">Width (Optional)</Label>
                            <Input
                              id="width"
                              type="number"
                              min={0}
                              value={productData.dimensions.width}
                              onChange={e =>
                                handleInputChange(
                                  'dimensions.width',
                                  e.target.value
                                )
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="height">Height (Optional)</Label>
                            <Input
                              id="height"
                              type="number"
                              min={0}
                              value={productData.dimensions.height}
                              onChange={e =>
                                handleInputChange(
                                  'dimensions.height',
                                  e.target.value
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
                        <Label htmlFor="stockCount">Current Stock *</Label>
                        <Input
                          id="stockCount"
                          min={0}
                          type="number"
                          value={productData.stockCount}
                          onChange={e =>
                            handleInputChange('stockCount', e.target.value)
                          }
                          placeholder="0"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minStock">Minimum Stock Alert *</Label>
                        <Input
                          id="minStock"
                          min={0}
                          type="number"
                          value={productData.minStock}
                          onChange={e =>
                            handleInputChange('minStock', e.target.value)
                          }
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxStock">Maximum Stock *</Label>
                        <Input
                          id="maxStock"
                          type="number"
                          min={0}
                          value={productData.maxStock}
                          onChange={e =>
                            handleInputChange('maxStock', e.target.value)
                          }
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Tags (Optional)
                      </Label>
                      <div className="flex gap-2 mb-3">
                        <Input
                          value={newTag}
                          onChange={e => setNewTag(e.target.value)}
                          placeholder="Add tag"
                          onKeyDown={e => e.key === 'Enter' && addTag()}
                        />
                        <Button onClick={addTag} type="button">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {productData.tags.map(tag => (
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
                    <CardTitle>Product Images *</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <label
                        htmlFor="productImages"
                        className={`cursor-pointer flex flex-col items-center ${
                          isSubmitting ? 'opacity-50 pointer-events-none' : ''
                        }`}
                      >
                        <input
                          type="file"
                          id="productImages"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={e =>
                            e.target.files &&
                            handleFileSelection(e.target.files)
                          }
                          disabled={isSubmitting}
                        />
                        <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Upload Additional Images
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Add more images or replace existing ones
                        </p>
                        <div className="px-4 py-2 flex items-center justify-center border-2 border-gray-300 rounded-md">
                          <Upload className="h-4 w-4 mr-2" />
                          <p>Choose Files</p>
                        </div>
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        Supported formats: JPG, PNG, WebP. Max size: 5MB per
                        image.
                      </p>
                    </div>

                    {/* Preview existing images */}
                    {productData.images.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mt-6 mb-3">
                          Current Images
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {productData.images.map((imgUrl, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={imgUrl}
                                alt={`Current ${index}`}
                                className="w-full h-40 object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index, false)}
                                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Preview new selected files */}
                    {selectedImages.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mt-6 mb-3">
                          New Images to Upload
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {selectedImages.map((file, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`New ${index}`}
                                className="w-full h-40 object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index, true)}
                                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => handleSubmit('DRAFT')}
                    variant="outline"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button
                    onClick={() => handleSubmit('ARCHIVED')}
                    variant="outline"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Save as Archive
                  </Button>
                  <Button
                    onClick={() => handleSubmit('ACTIVE')}
                    className="w-full bg-black text-white hover:bg-gray-800"
                    disabled={isSubmitting}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Updating...' : 'Update & Publish'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
