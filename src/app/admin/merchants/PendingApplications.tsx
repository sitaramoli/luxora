'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  approveMerchantApplicationAction,
  rejectMerchantApplicationAction,
} from '@/lib/actions/merchant-applications';

interface PendingApplication {
  id: string;
  storeName: string;
  storeSlug: string;
  email: string;
  phone: string;
  category: string;
  createdAt: string | Date;
  userId: string;
  applicantName: string | null;
}

export default function PendingApplications({
  items,
}: {
  items: PendingApplication[];
}) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = (id: string) => {
    startTransition(async () => {
      const res = await approveMerchantApplicationAction(id);
      if (res.success) {
        toast.success('Application approved');
      } else {
        toast.error(res.error || 'Failed to approve');
      }
    });
  };

  const handleReject = (id: string) => {
    startTransition(async () => {
      const res = await rejectMerchantApplicationAction(id);
      if (res.success) {
        toast.success('Application rejected');
      } else {
        toast.error(res.error || 'Failed to reject');
      }
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Pending Applications</h2>
      </div>
      <div className="space-y-3">
        {items.map(app => (
          <div
            key={app.id}
            className="flex items-center justify-between p-4 bg-white border rounded-lg"
          >
            <div>
              <div className="font-medium">{app.storeName}</div>
              <div className="text-sm text-gray-600">
                {app.applicantName ? `${app.applicantName} • ` : ''}
                {app.email} • {app.phone}
              </div>
              <div className="text-xs text-gray-500">
                {typeof app.createdAt === 'string'
                  ? new Date(app.createdAt).toLocaleString()
                  : new Date(app.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleApprove(app.id)}
                disabled={isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
              <Button
                onClick={() => handleReject(app.id)}
                disabled={isPending}
                variant="destructive"
              >
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
