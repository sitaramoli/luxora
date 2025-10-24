'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
// Create collection schema
const createCollectionSchema = z.object({
  name: z.string().min(1, 'Collection name is required').max(255, 'Name too long'),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug too long'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().optional(),
  image: z.string().min(1, 'Image URL is required'),
  coverImage: z.string().optional(),
  season: z.enum(['SPRING', 'SUMMER', 'FALL', 'WINTER', 'ALL_SEASON']),
  year: z.string().length(4, 'Year must be 4 digits'),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  displayOrder: z.number().int().min(0),
  metaTitle: z.string().max(255, 'Meta title too long').optional(),
  metaDescription: z.string().optional(),
  tags: z.array(z.string()).optional(),
  priceRangeMin: z.number().min(0).optional(),
  priceRangeMax: z.number().min(0).optional(),
});

type CreateCollectionForm = z.infer<typeof createCollectionSchema>;

interface Props {
  onSuccess: () => void;
}

const CreateCollectionDialog: React.FC<Props> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const form = useForm<CreateCollectionForm>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      image: '',
      coverImage: '',
      season: 'ALL_SEASON',
      year: new Date().getFullYear().toString(),
      status: 'DRAFT',
      isFeatured: false,
      isNew: true,
      displayOrder: 0,
      metaTitle: '',
      metaDescription: '',
      tags: [],
      priceRangeMin: undefined,
      priceRangeMax: undefined,
    },
  });

  const handleGenerateSlug = () => {
    const name = form.getValues('name');
    if (!name) {
      toast({
        title: 'Error',
        description: 'Please enter a collection name first.',
        variant: 'destructive',
      });
      return;
    }

    // Simple client-side slug generation
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
      
    form.setValue('slug', slug);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;

    const currentTags = form.getValues('tags') || [];
    if (!currentTags.includes(tagInput.trim())) {
      form.setValue('tags', [...currentTags, tagInput.trim()]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data: CreateCollectionForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create collection');
      }

      toast({
        title: 'Success',
        description: 'Collection created successfully.',
      });

      onSuccess();
    } catch (error) {
      console.error('Error creating collection:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create collection.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchedTags = form.watch('tags') || [];

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create New Collection</DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter collection name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug *</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input placeholder="collection-slug" {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGenerateSlug}
                    >
                      Generate
                    </Button>
                  </div>
                  <FormDescription>
                    URL-friendly version of the collection name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter detailed collection description"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter brief collection description"
                    className="min-h-[60px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Brief description for collection cards
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Image URL *</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Primary image for the collection
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/cover.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Hero image for collection pages
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="season"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Season *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SPRING">Spring</SelectItem>
                      <SelectItem value="SUMMER">Summer</SelectItem>
                      <SelectItem value="FALL">Fall</SelectItem>
                      <SelectItem value="WINTER">Winter</SelectItem>
                      <SelectItem value="ALL_SEASON">All Season</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year *</FormLabel>
                  <FormControl>
                    <Input placeholder="2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="displayOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Higher numbers appear first
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Featured Collection</FormLabel>
                    <FormDescription>
                      Show in featured sections
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isNew"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>New Collection</FormLabel>
                    <FormDescription>
                      Mark as new arrival
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="priceRangeMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priceRangeMax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Tags */}
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {watchedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watchedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </FormItem>

          {/* SEO Fields */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="metaTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl>
                      <Input placeholder="SEO title for search engines" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metaDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="SEO description for search engines"
                        className="min-h-[60px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Collection'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default CreateCollectionDialog;