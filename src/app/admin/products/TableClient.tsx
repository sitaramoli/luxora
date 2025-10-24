'use client';

import { toast } from 'sonner';

import { DataTable } from '@/components/admin/data-table/DataTable';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  adminDeleteProducts,
  adminUpdateProductStatus,
} from '@/lib/actions/admin';

import { columns, type AdminProductRow } from './columns';

export default function ProductsTableClient({
  data,
}: {
  data: AdminProductRow[];
}) {
  return (
    <DataTable
      columns={columns}
      data={data}
      toolbar={({ table }) => {
        const selected = table
          .getFilteredSelectedRowModel()
          .rows.map((r: any) => r.original.id) as string[];

        async function bulkStatus(v: 'ACTIVE' | 'DRAFT' | 'ARCHIVED') {
          if (selected.length === 0) return;
          try {
            await adminUpdateProductStatus({ ids: selected, status: v });
            toast.success('Updated status');
          } catch (e: any) {
            toast.error(e?.message ?? 'Failed');
          }
        }

        async function bulkDelete() {
          if (selected.length === 0) return;
          try {
            await adminDeleteProducts({ ids: selected });
            toast.success('Deleted');
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
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ARCHIVED">Archive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="destructive" size="sm" onClick={bulkDelete}>
              Delete Selected
            </Button>
            <div className="text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} selected
            </div>
          </div>
        );
      }}
    />
  );
}
