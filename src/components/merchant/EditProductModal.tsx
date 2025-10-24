'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, X, Plus, Minus, Upload } from 'lucide-react';
import { getMerchantProduct, updateMerchantProduct, uploadImages } from '@/lib/services/products';

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
  colors: any[] | null;
  features: string[] | null;
  images: string[] | null;
  isFeatured: boolean;
  onSale: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

const editProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  price: z.string().min(1, 'Price is required'),
  originalPrice: z.string().min(1, 'Original price is required'),
  sku: z.string().min(1, 'SKU is required'),
  barcode: z.string().optional(),
  weight: z.string().optional(),
  length: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']),
  stockCount: z.number().int().min(0, 'Stock count cannot be negative'),
  minStock: z.number().int().min(0, 'Minimum stock cannot be negative'),
  maxStock: z.number().int().min(1, 'Maximum stock must be at least 1'),
  tags: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  isFeatured: z.boolean(),
  onSale: z.boolean(),
});

type EditProductForm = z.infer<typeof editProductSchema>;

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  onProductUpdated: (product: Product) => void;
  categories?: string[];
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  productId,
  onProductUpdated,
  categories = [],
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newSize, setNewSize] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    reset,
  } = useForm<EditProductForm>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      features: [],
      tags: [],
      sizes: [],
      isFeatured: false,
      onSale: false,
      status: 'ACTIVE',
    },
  });

  const watchedFeatures = watch('features') || [];
  const watchedTags = watch('tags') || [];
  const watchedSizes = watch('sizes') || [];

  useEffect(() => {
    if (isOpen && productId) {
      loadProduct();
    }
    // Reset form when modal closes
    if (!isOpen) {
      reset();
      setCurrentProduct(null);
      setUploadedImages([]);
    }
  }, [isOpen, productId, reset]);

  const loadProduct = async () => {
    setIsLoadingProduct(true);
    try {
      const result = await getMerchantProduct(productId);
      if (result.success && result.data) {
        const product = result.data;
        setCurrentProduct(product);
        setUploadedImages(product.images || []);
        
        // Set form values
        setValue('name', product.name);
        setValue('description', product.description);
        setValue('shortDescription', product.shortDescription || '');
        setValue('category', product.category);
        setValue('price', product.price);
        setValue('originalPrice', product.originalPrice);
        setValue('sku', product.sku);
        setValue('barcode', product.barcode || '');
        setValue('weight', product.weight || '');
        setValue('length', product.length || '');
        setValue('width', product.width || '');
        setValue('height', product.height || '');
        setValue('status', product.status);
        setValue('stockCount', product.stockCount);
        setValue('minStock', product.minStock);
        setValue('maxStock', product.maxStock);
        setValue('tags', product.tags || []);
        setValue('sizes', product.sizes || []);
        setValue('features', product.features || []);
        setValue('isFeatured', product.isFeatured);
        setValue('onSale', product.onSale);
      } else {
        toast.error(result.error || 'Failed to load product');
        onClose();
      }
    } catch (error) {
      toast.error('Failed to load product');
      console.error('Error loading product:', error);
      onClose();
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const onSubmit = async (data: EditProductForm) => {
    setIsLoading(true);
    try {
      const updateData = {
        ...data,
        images: uploadedImages.length > 0 ? uploadedImages : currentProduct?.images || [],
        price: parseFloat(data.price).toString(),
        originalPrice: parseFloat(data.originalPrice).toString(),
        weight: data.weight ? parseFloat(data.weight).toString() : null,
        length: data.length ? parseFloat(data.length).toString() : null,
        width: data.width ? parseFloat(data.width).toString() : null,
        height: data.height ? parseFloat(data.height).toString() : null,
        colors: currentProduct?.colors || [],
      };

      const result = await updateMerchantProduct(productId, updateData);
      
      if (result.success && result.data) {
        toast.success('Product updated successfully');
        onProductUpdated(result.data as Product);
        onClose();
      } else {
        toast.error(result.error || 'Failed to update product');
      }
    } catch (error) {
      toast.error('Failed to update product');
      console.error('Error updating product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });

    try {
      const result = await uploadImages(formData, currentProduct?.name || 'product');
      if (result.success && result.urls) {
        setUploadedImages(prev => [...prev, ...result.urls]);
        toast.success(`${result.urls.length} image(s) uploaded successfully`);
      } else {
        toast.error(result.error || 'Failed to upload images');
      }
    } catch (error) {
      toast.error('Failed to upload images');
      console.error('Error uploading images:', error);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      const currentFeatures = getValues('features') || [];
      setValue('features', [...currentFeatures, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const currentFeatures = getValues('features') || [];
    setValue('features', currentFeatures.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim()) {
      const currentTags = getValues('tags') || [];
      setValue('tags', [...currentTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    const currentTags = getValues('tags') || [];
    setValue('tags', currentTags.filter((_, i) => i !== index));
  };

  const addSize = () => {
    if (newSize.trim()) {
      const currentSizes = getValues('sizes') || [];
      setValue('sizes', [...currentSizes, newSize.trim()]);
      setNewSize('');
    }
  };

  const removeSize = (index: number) => {
    const currentSizes = getValues('sizes') || [];
    setValue('sizes', currentSizes.filter((_, i) => i !== index));
  };

  if (isLoadingProduct) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Loading product...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Product: {currentProduct?.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      placeholder="Enter product name"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="description"
                      placeholder="Enter product description"
                      rows={3}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Controller
                  name="shortDescription"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="shortDescription"
                      placeholder="Enter short description"
                      rows={2}
                    />
                  )}
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Pricing & Inventory</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ($) *</Label>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className={errors.price ? 'border-red-500' : ''}
                      />
                    )}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="originalPrice">Original Price ($) *</Label>
                  <Controller
                    name="originalPrice"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="originalPrice"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className={errors.originalPrice ? 'border-red-500' : ''}
                      />
                    )}
                  />
                  {errors.originalPrice && (
                    <p className="text-sm text-red-600 mt-1">{errors.originalPrice.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="stockCount">Stock Count *</Label>
                  <Controller
                    name="stockCount"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="stockCount"
                        type="number"
                        min="0"
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        className={errors.stockCount ? 'border-red-500' : ''}
                      />
                    )}
                  />
                  {errors.stockCount && (
                    <p className="text-sm text-red-600 mt-1">{errors.stockCount.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="minStock">Min Stock *</Label>
                  <Controller
                    name="minStock"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="minStock"
                        type="number"
                        min="0"
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        className={errors.minStock ? 'border-red-500' : ''}
                      />
                    )}
                  />
                  {errors.minStock && (
                    <p className="text-sm text-red-600 mt-1">{errors.minStock.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="maxStock">Max Stock *</Label>
                  <Controller
                    name="maxStock"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="maxStock"
                        type="number"
                        min="1"
                        onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                        className={errors.maxStock ? 'border-red-500' : ''}
                      />
                    )}
                  />
                  {errors.maxStock && (
                    <p className="text-sm text-red-600 mt-1">{errors.maxStock.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU *</Label>
                  <Controller
                    name="sku"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="sku"
                        placeholder="Enter SKU"
                        className={errors.sku ? 'border-red-500' : ''}
                      />
                    )}
                  />
                  {errors.sku && (
                    <p className="text-sm text-red-600 mt-1">{errors.sku.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="barcode">Barcode</Label>
                  <Controller
                    name="barcode"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="barcode"
                        placeholder="Enter barcode"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Controller
                    name="isFeatured"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="isFeatured"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="isFeatured">Featured Product</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Controller
                    name="onSale"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="onSale"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="onSale">On Sale</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <h3 className="text-lg font-medium mb-4">Dimensions</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Controller
                  name="weight"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="weight"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                    />
                  )}
                />
              </div>
              <div>
                <Label htmlFor="length">Length (cm)</Label>
                <Controller
                  name="length"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="length"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                    />
                  )}
                />
              </div>
              <div>
                <Label htmlFor="width">Width (cm)</Label>
                <Controller
                  name="width"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="width"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                    />
                  )}
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Controller
                  name="height"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="height"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-medium mb-4">Features *</h3>
            <div className="space-y-3">
              {watchedFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={feature} readOnly className="flex-1" />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFeature(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={e => setNewFeature(e.target.value)}
                  placeholder="Add a feature"
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {errors.features && (
                <p className="text-sm text-red-600">{errors.features.message}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-lg font-medium mb-4">Tags</h3>
            <div className="space-y-3">
              {watchedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watchedTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="text-lg font-medium mb-4">Sizes</h3>
            <div className="space-y-3">
              {watchedSizes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watchedSizes.map((size, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {size}
                      <button
                        type="button"
                        onClick={() => removeSize(index)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={newSize}
                  onChange={e => setNewSize(e.target.value)}
                  placeholder="Add a size (e.g., S, M, L, XL)"
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSize())}
                />
                <Button type="button" onClick={addSize} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="text-lg font-medium mb-4">Product Images</h3>
            <div className="space-y-4">
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div>
                <label htmlFor="images" className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload product images
                    </p>
                  </div>
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Product
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};