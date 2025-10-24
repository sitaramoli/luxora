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
import { fetchAdminUsers } from '@/lib/services/admin';

import type { AdminUserRow } from './columns';
import UsersTableClient from './TableClient';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    role?: string;
    status?: string;
    page?: string;
    pageSize?: string;
  }>;
}) {
  const sp = await searchParams;
  const search = sp?.q ?? '';
  const role = sp?.role ?? 'all';
  const status = sp?.status ?? 'all';
  const page = Number(sp?.page ?? '1');
  const pageSize = Number(sp?.pageSize ?? '20');

  const { items, pagination } = await fetchAdminUsers({
    search,
    role: role as any,
    status: status as any,
    page,
    pageSize,
  });
  const data: AdminUserRow[] = items.map((u: any) => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    role: u.role as any,
    status: u.status as any,
    createdAt: u.createdAt,
  }));

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">User Management</h1>
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
                  placeholder="Search users..."
                  defaultValue={search}
                  className="pl-9"
                />
              </div>
              <Select name="role" defaultValue={role}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                  <SelectItem value="MERCHANT">Merchant</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select name="status" defaultValue={status}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" variant="outline">
                Apply
              </Button>
            </form>
          </CardContent>
        </Card>

        <UsersTableClient data={data} />
        {pagination && (
          <ServerPagination
            basePath="/admin/users"
            page={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            extraParams={{ q: search, role, status }}
          />
        )}
      </div>
    </div>
  );
}
