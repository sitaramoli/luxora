import { Search, RefreshCw } from 'lucide-react';

import ServerPagination from '@/components/admin/data-table/ServerPagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { listPendingMerchantApplicationsAction } from '@/lib/actions/merchant-applications';
import { fetchAdminMerchants } from '@/lib/services/admin';

import type { AdminMerchantRow } from './Columns';
import PendingApplications from './PendingApplications';
import MerchantsTableClient from './TableClient';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    category?: string;
    page?: string;
    pageSize?: string;
  }>;
}) {
  const sp = await searchParams;
  const search = sp?.q ?? '';
  const status = sp?.status ?? 'all';
  const category = sp?.category ?? 'all';
  const page = Number(sp?.page ?? '1');
  const pageSize = Number(sp?.pageSize ?? '20');

  const { items, pagination } = await fetchAdminMerchants({
    search,
    status: status as any,
    category,
    page,
    pageSize,
  });
  const data: AdminMerchantRow[] = items.map((m: any) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    category: m.category,
    status: m.status as any,
    createdAt: m.createdAt,
    productCount: m.productCount,
  }));

  const pendingApps = await listPendingMerchantApplicationsAction({
    limit: 10,
  });

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Merchant Management</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>
        </div>

        {pendingApps.items && pendingApps.items.length > 0 && (
          <PendingApplications items={pendingApps.items as any} />
        )}

        <Card className="mb-6">
          <CardContent className="p-4">
            <form className="flex flex-wrap items-center gap-3" method="GET">
              <div className="flex-1 min-w-[240px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  name="q"
                  placeholder="Search merchants..."
                  defaultValue={search}
                  className="pl-9"
                />
              </div>
              <Select name="status" defaultValue={status}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select name="category" defaultValue={category}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" variant="outline">
                Apply
              </Button>
            </form>
          </CardContent>
        </Card>

        <MerchantsTableClient data={data} />
        {pagination && (
          <ServerPagination
            basePath="/admin/merchants"
            page={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            extraParams={{ q: search, status, category }}
          />
        )}
      </div>
    </div>
  );
}
