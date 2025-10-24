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
import { adminUpdateMerchantStatus } from '@/lib/actions/admin';

import { columns, type AdminMerchantRow } from './Columns';

export default function MerchantsTableClient({
  data,
}: {
  data: AdminMerchantRow[];
}) {
  return (
    <DataTable
      columns={columns}
      data={data}
      toolbar={({ table }) => {
        const selected = table
          .getFilteredSelectedRowModel()
          .rows.map((r: any) => r.original.id) as string[];

        async function bulkSet(
          status: 'ACTIVE' | 'PENDING' | 'UNDER_REVIEW' | 'SUSPENDED'
        ) {
          if (selected.length === 0) return;
          try {
            await adminUpdateMerchantStatus({ ids: selected, status });
            toast.success('Updated');
          } catch (e: any) {
            toast.error(e?.message ?? 'Failed to update');
          }
        }

        return (
          <div className="w-full flex items-center justify-end gap-2">
            <Select onValueChange={v => bulkSet(v as any)}>
              <SelectTrigger className="h-8 w-[200px]">
                <SelectValue placeholder="Bulk: Set status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Activate</SelectItem>
                <SelectItem value="PENDING">Mark Pending</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                <SelectItem value="SUSPENDED">Suspend</SelectItem>
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
