"use server";

import { db } from '@/database/drizzle';
import {
  merchantApplications,
  merchants,
  users,
  ACCOUNT_STATUS_ENUM,
  MERCHANT_APPLICATION_STATUS_ENUM,
} from '@/database/schema';
import { and, eq, ilike, sql } from 'drizzle-orm';

export type MerchantApplicationStatus = (typeof MERCHANT_APPLICATION_STATUS_ENUM.enumValues)[number];

export interface MerchantApplicationInput {
  storeName: string;
  email: string;
  phone: string;
  category: string;
  description: string;
  shortDescription: string;
  website?: string;
  address: string;
  logo?: string;
  coverImage: string;
  image: string;
  founded: string; // ISO date string
  taxId?: string;
  businessLicense?: string;
}

function slugify(input: string) {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return base || 'store';
}

async function ensureUniqueSlug(base: string) {
  let candidate = base;
  let suffix = 1;
  // check against merchants table only; applications can share slug
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await db
      .select({ id: merchants.id })
      .from(merchants)
      .where(eq(merchants.slug, candidate))
      .limit(1);
    if (existing.length === 0) return candidate;
    candidate = `${base}-${suffix++}`;
  }
}

export async function submitMerchantApplication(userId: string, input: MerchantApplicationInput) {
  // Check the user is not already a merchant
  const existingMerchant = await db
    .select({ id: merchants.id })
    .from(merchants)
    .where(eq(merchants.userId, userId))
    .limit(1);
  if (existingMerchant.length > 0) {
    return { success: false, error: 'You already have a merchant account.' };
  }

  // Check if there is a pending application
  const pending = await db
    .select({ id: merchantApplications.id })
    .from(merchantApplications)
    .where(and(eq(merchantApplications.userId, userId), eq(merchantApplications.status, 'PENDING')))
    .limit(1);
  if (pending.length > 0) {
    return { success: false, error: 'You already have a pending application.' };
  }

  const baseSlug = slugify(input.storeName);
  // We do not enforce unique slug at application time, only when approving
  const app = await db
    .insert(merchantApplications)
    .values({
      userId,
      storeName: input.storeName,
      storeSlug: baseSlug,
      email: input.email,
      phone: input.phone,
      category: input.category,
      description: input.description,
      shortDescription: input.shortDescription,
      website: input.website,
      address: input.address,
      logo: input.logo,
      coverImage: input.coverImage,
      image: input.image,
      founded: input.founded as unknown as Date,
      taxId: input.taxId,
      businessLicense: input.businessLicense,
      status: 'PENDING',
    })
    .returning({ id: merchantApplications.id });

  return { success: true, data: { applicationId: app[0].id } };
}

export async function listPendingMerchantApplications(params?: { search?: string; limit?: number; offset?: number }) {
  const { search = '', limit = 20, offset = 0 } = params || {};
  let query = db
    .select({
      id: merchantApplications.id,
      storeName: merchantApplications.storeName,
      storeSlug: merchantApplications.storeSlug,
      email: merchantApplications.email,
      phone: merchantApplications.phone,
      category: merchantApplications.category,
      createdAt: merchantApplications.createdAt,
      userId: merchantApplications.userId,
      applicantName: users.fullName,
    })
    .from(merchantApplications)
    .leftJoin(users, eq(users.id, merchantApplications.userId))
    .where(eq(merchantApplications.status, 'PENDING'))
    .$dynamic();

  if (search) {
    query = query.where(
      sql`LOWER(${merchantApplications.storeName}) LIKE LOWER(${`%${search}%`}) OR LOWER(${users.fullName}) LIKE LOWER(${`%${search}%`}) OR LOWER(${merchantApplications.email}) LIKE LOWER(${`%${search}%`})`
    );
  }

  const rows = await query.limit(limit).offset(offset);
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(merchantApplications)
    .where(eq(merchantApplications.status, 'PENDING'));

  return { items: rows, total: count };
}

export async function approveMerchantApplication(applicationId: string, reviewerUserId: string) {
  // Fetch the application
  const [app] = await db
    .select()
    .from(merchantApplications)
    .where(eq(merchantApplications.id, applicationId))
    .limit(1);
  if (!app) return { success: false, error: 'Application not found' };
  if (app.status !== 'PENDING') return { success: false, error: 'Application already reviewed' };

  // Create a unique slug for merchant
  const uniqueSlug = await ensureUniqueSlug(app.storeSlug);

  // Create merchant record
  const [newMerchant] = await db
    .insert(merchants)
    .values({
      userId: app.userId,
      name: app.storeName,
      slug: uniqueSlug,
      phone: app.phone,
      email: app.email,
      description: app.description,
      shortDescription: app.shortDescription,
      category: app.category,
      website: app.website,
      logo: app.logo,
      coverImage: app.coverImage,
      image: app.image,
      address: app.address,
      taxId: (app as any).taxId || null,
      businessLicense: (app as any).businessLicense || null,
      founded: app.founded as unknown as Date,
      status: 'ACTIVE',
    })
    .returning({ id: merchants.id });

  // Update user role to MERCHANT and set status ACTIVE
  await db
    .update(users)
    .set({ role: 'MERCHANT' as any, status: 'ACTIVE' as any })
    .where(eq(users.id, app.userId));

  // Update application status
  await db
    .update(merchantApplications)
    .set({ status: 'APPROVED' as any, reviewedBy: reviewerUserId, reviewedAt: new Date() })
    .where(eq(merchantApplications.id, applicationId));

  return { success: true, data: { merchantId: newMerchant.id } };
}

export async function rejectMerchantApplication(applicationId: string, reviewerUserId: string, reason?: string) {
  const [app] = await db
    .select()
    .from(merchantApplications)
    .where(eq(merchantApplications.id, applicationId))
    .limit(1);
  if (!app) return { success: false, error: 'Application not found' };
  if (app.status !== 'PENDING') return { success: false, error: 'Application already reviewed' };

  await db
    .update(merchantApplications)
    .set({ status: 'REJECTED' as any, reviewedBy: reviewerUserId, reviewedAt: new Date(), adminNotes: reason })
    .where(eq(merchantApplications.id, applicationId));

  return { success: true };
}
