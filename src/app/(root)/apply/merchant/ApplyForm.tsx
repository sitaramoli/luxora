'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { submitMerchantApplicationAction } from '@/lib/actions/merchant-applications';

const schema = z.object({
  storeName: z.string().min(2, 'Store name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Phone is required'),
  category: z.string().min(2, 'Category is required'),
  description: z.string().min(20, 'Please provide a detailed description'),
  shortDescription: z.string().min(10, 'Short description is required'),
  website: z.url().optional().or(z.literal('')),
  address: z.string().min(5, 'Address is required'),
  logo: z.url().optional().or(z.literal('')),
  coverImage: z.string().url('Cover image URL is required'),
  image: z.url('Primary image URL is required'),
  founded: z.string().min(4, 'Founded date is required'),
  taxId: z.string().optional(),
  businessLicense: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ApplyForm({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: userEmail },
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      const res = await submitMerchantApplicationAction({
        storeName: data.storeName,
        email: data.email,
        phone: data.phone,
        category: data.category,
        description: data.description,
        shortDescription: data.shortDescription,
        website: data.website || undefined,
        address: data.address,
        logo: data.logo || undefined,
        coverImage: data.coverImage,
        image: data.image,
        founded: data.founded,
        taxId: data.taxId || undefined,
        businessLicense: data.businessLicense || undefined,
      });

      if (res.success) {
        toast.success('Application submitted! We will review it shortly.');
        router.push('/');
      } else {
        toast.error(res.error || 'Failed to submit application');
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 rounded-lg border"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Store Name</Label>
          <Input {...register('storeName')} placeholder="e.g., Luxe Couture" />
          {errors.storeName && (
            <p className="text-sm text-red-600 mt-1">
              {errors.storeName.message}
            </p>
          )}
        </div>
        <div>
          <Label>Category</Label>
          <Input {...register('category')} placeholder="e.g., Fashion" />
          {errors.category && (
            <p className="text-sm text-red-600 mt-1">
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Contact Email</Label>
          <Input {...register('email')} type="email" />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label>Phone</Label>
          <Input {...register('phone')} placeholder="+1 555 123 4567" />
          {errors.phone && (
            <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label>Website (optional)</Label>
        <Input {...register('website')} placeholder="https://example.com" />
        {errors.website && (
          <p className="text-sm text-red-600 mt-1">
            {errors.website.message as string}
          </p>
        )}
      </div>

      <div>
        <Label>Address</Label>
        <Textarea {...register('address')} rows={2} />
        {errors.address && (
          <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
        )}
      </div>

      <div>
        <Label>Short Description</Label>
        <Textarea {...register('shortDescription')} rows={2} />
        {errors.shortDescription && (
          <p className="text-sm text-red-600 mt-1">
            {errors.shortDescription.message}
          </p>
        )}
      </div>

      <div>
        <Label>Detailed Description</Label>
        <Textarea {...register('description')} rows={4} />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Cover Image URL</Label>
          <Input {...register('coverImage')} placeholder="https://..." />
          {errors.coverImage && (
            <p className="text-sm text-red-600 mt-1">
              {errors.coverImage.message}
            </p>
          )}
        </div>
        <div>
          <Label>Primary Image URL</Label>
          <Input {...register('image')} placeholder="https://..." />
          {errors.image && (
            <p className="text-sm text-red-600 mt-1">{errors.image.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Logo URL (optional)</Label>
          <Input {...register('logo')} placeholder="https://..." />
          {errors.logo && (
            <p className="text-sm text-red-600 mt-1">
              {errors.logo.message as string}
            </p>
          )}
        </div>
        <div>
          <Label>Founded (YYYY-MM-DD)</Label>
          <Input {...register('founded')} placeholder="2020-01-01" />
          {errors.founded && (
            <p className="text-sm text-red-600 mt-1">
              {errors.founded.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Tax ID (optional)</Label>
          <Input {...register('taxId')} />
        </div>
        <div>
          <Label>Business License (optional)</Label>
          <Input {...register('businessLicense')} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Submitting...' : 'Submit Application'}
        </Button>
      </div>
    </form>
  );
}
