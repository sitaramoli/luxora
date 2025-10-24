'use client';

import { toast } from 'sonner';

import { DataTable } from '@/components/admin/data-table/DataTable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  adminUpdateUserRole,
  adminUpdateUserStatus,
} from '@/lib/actions/admin';

import { columns, type AdminUserRow } from './columns';

export default function UsersTableClient({ data }: { data: AdminUserRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      toolbar={({ table }) => {
        const selected = table
          .getFilteredSelectedRowModel()
          .rows.map((r: any) => r.original.id) as string[];

        async function bulkStatus(
          v: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'UNDER_REVIEW'
        ) {
          if (selected.length === 0) return;
          try {
            await adminUpdateUserStatus({ ids: selected, status: v });
            toast.success('Updated status');
          } catch (e: any) {
            toast.error(e?.message ?? 'Failed');
          }
        }
        async function bulkRole(v: 'CUSTOMER' | 'ADMIN' | 'MERCHANT') {
          if (selected.length === 0) return;
          try {
            await adminUpdateUserRole({ ids: selected, role: v });
            toast.success('Updated role');
          } catch (e: any) {
            toast.error(e?.message ?? 'Failed');
          }
        }

        return (
          <div className="w-full flex items-center justify-end gap-2">
            <Select onValueChange={v => bulkStatus(v as any)}>
              <SelectTrigger className="h-8 w-[170px]">
                <SelectValue placeholder="Bulk: Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="SUSPENDED">Suspend</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={v => bulkRole(v as any)}>
              <SelectTrigger className="h-8 w-[170px]">
                <SelectValue placeholder="Bulk: Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
                <SelectItem value="MERCHANT">Merchant</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} selected
            </div>
          </div>
        );
      }}
    />
  );
}
