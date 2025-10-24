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
import { fetchAdminProducts } from '@/lib/services/admin';

import type { AdminProductRow } from './columns';
import ProductsTableClient from './TableClient';

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

  const { items, pagination } = await fetchAdminProducts({
    search,
    status: status as any,
    category,
    page,
    pageSize,
  });
  const data: AdminProductRow[] = items.map((p: any) => ({
    id: String(p.id),
    name: p.name,
    merchantName: p.merchantName ?? null,
    category: p.category,
    price: p.price as any,
    stockCount: p.stockCount,
    status: p.status as any,
    createdAt: p.createdAt,
  }));

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Product Management</h1>
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
                  placeholder="Search products..."
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
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
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

        <ProductsTableClient data={data} />
        {pagination && (
          <ServerPagination
            basePath="/admin/products"
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
