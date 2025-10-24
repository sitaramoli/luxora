"use server";

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import {
  submitMerchantApplication,
  approveMerchantApplication,
  rejectMerchantApplication,
  listPendingMerchantApplications,
  MerchantApplicationInput,
} from '@/lib/services/merchant-applications';

export async function submitMerchantApplicationAction(input: MerchantApplicationInput) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    const res = await submitMerchantApplication(session.user.id, input);
    return res;
  } catch (error) {
    console.error('Error submitting application:', error);
    return { success: false, error: 'Failed to submit application' };
  }
}

export async function listPendingMerchantApplicationsAction(params?: { search?: string; limit?: number; offset?: number }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/sign-in');
  }
  try {
    return await listPendingMerchantApplications(params);
  } catch (error) {
    console.error('Error listing applications:', error);
    return { items: [], total: 0 };
  }
}

export async function approveMerchantApplicationAction(applicationId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/sign-in');
  }
  try {
    const res = await approveMerchantApplication(applicationId, session.user.id);
    revalidatePath('/admin/merchants');
    return res;
  } catch (error) {
    console.error('Error approving application:', error);
    return { success: false, error: 'Failed to approve application' };
  }
}

export async function rejectMerchantApplicationAction(applicationId: string, reason?: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/sign-in');
  }
  try {
    const res = await rejectMerchantApplication(applicationId, session.user.id, reason);
    revalidatePath('/admin/merchants');
    return res;
  } catch (error) {
    console.error('Error rejecting application:', error);
    return { success: false, error: 'Failed to reject application' };
  }
}
