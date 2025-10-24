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
import { adminUpdateOrdersStatus } from '@/lib/actions/admin';

import { columns, type AdminOrderRow } from './columns';

export default function OrdersTableClient({ data }: { data: AdminOrderRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      toolbar={({ table }) => {
        const selected = table
          .getFilteredSelectedRowModel()
          .rows.map((r: any) => r.original.id) as string[];

        async function bulkStatus(
          v:
            | 'PENDING'
            | 'PROCESSING'
            | 'SHIPPED'
            | 'DELIVERED'
            | 'CANCELLED'
            | 'REFUNDED'
        ) {
          if (selected.length === 0) return;
          try {
            await adminUpdateOrdersStatus({ ids: selected, status: v });
            toast.success('Updated status');
          } catch (e: any) {
            toast.error(e?.message ?? 'Failed');
          }
        }

        return (
          <div className="w-full flex items-center justify-end gap-2">
            <Select onValueChange={v => bulkStatus(v as any)}>
              <SelectTrigger className="h-8 w-[200px]">
                <SelectValue placeholder="Bulk: Set status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
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
