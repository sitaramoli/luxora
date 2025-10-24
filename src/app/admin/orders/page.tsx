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
import { fetchAdminOrders } from '@/lib/services/admin';

import type { AdminOrderRow } from './columns';
import OrdersTableClient from './TableClient';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    page?: string;
    pageSize?: string;
  }>;
}) {
  const sp = await searchParams;
  const search = sp?.q ?? '';
  const status = sp?.status ?? 'all';
  const page = Number(sp?.page ?? '1');
  const pageSize = Number(sp?.pageSize ?? '20');

  const { items, pagination } = await fetchAdminOrders({
    search,
    status: status as any,
    page,
    pageSize,
  });
  const data: AdminOrderRow[] = items.map((o: any) => ({
    id: o.id,
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    merchantName: o.merchantName,
    status: o.status as any,
    total: o.total,
    createdAt: o.createdAt,
    itemCount: Number(o.itemCount ?? 0),
  }));

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Order Management</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <form className="flex flex-wrap items-center gap-3" method="GET">
              <div className="flex-1 min-w-[240px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  name="q"
                  placeholder="Search orders..."
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
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" variant="outline">
                Apply
              </Button>
            </form>
          </CardContent>
        </Card>

        <OrdersTableClient data={data} />
        {pagination && (
          <ServerPagination
            basePath="/admin/orders"
            page={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            extraParams={{ q: search, status }}
          />
        )}
      </div>
    </div>
  );
}
