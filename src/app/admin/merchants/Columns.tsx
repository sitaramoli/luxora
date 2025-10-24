'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

import { DataTableColumnHeader } from '@/components/DataTableColumnHeader';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type AdminMerchantRow = {
  id: string;
  name: string;
  email: string;
  category: string;
  status: 'ACTIVE' | 'PENDING' | 'UNDER_REVIEW' | 'SUSPENDED';
  createdAt: string | Date | null;
  productCount?: number;
};

const getClassName = (
  status: 'ACTIVE' | 'PENDING' | 'UNDER_REVIEW' | 'SUSPENDED'
) => {
  return {
    ACTIVE:
      'bg-green-100 text-green-800 focus:bg-green-100 focus:text-green-800',
    PENDING:
      'bg-yellow-100 text-yellow-800 focus:bg-yellow-100 focus:text-yellow-800',
    UNDER_REVIEW:
      'bg-blue-100 text-blue-800 focus:bg-blue-100 focus:text-blue-800',
    SUSPENDED: 'bg-red-100 text-red-800 focus:bg-red-100 focus:text-red-800',
  }[status];
};

export const columns: ColumnDef<AdminMerchantRow>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Merchant" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="font-medium">{row.original.name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="font-medium">{row.original.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const currentStatus = row.getValue(
        'status'
      ) as AdminMerchantRow['status'];
      const className = getClassName(currentStatus);

      // NOTE: status changes handled by page toolbar bulk actions. Keep read-only here to avoid server coupling.
      return (
        <Select value={currentStatus} disabled>
          <SelectTrigger
            className={cn(
              'w-full capitalize border-none [&>svg]:hidden',
              className
            )}
          >
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            {(['ACTIVE', 'PENDING', 'UNDER_REVIEW', 'SUSPENDED'] as const).map(
              status => (
                <SelectItem
                  key={status}
                  value={status}
                  className={cn('capitalize mb-2', getClassName(status))}
                >
                  {status.replace('_', ' ').toLowerCase()}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },
  {
    accessorKey: 'productCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Products" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">{row.original.productCount ?? 0}</div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined" />
    ),
    cell: ({ row }) => {
      const d = row.original.createdAt
        ? new Date(row.original.createdAt)
        : null;
      return d
        ? d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : '-';
    },
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={'Action'} />
    ),
    cell: ({ row }) => {
      return (
        <Button
          onClick={() =>
            window.open(`/admin/merchants/${row.original.id}`, '_self')
          }
          variant="ghost"
          className="h-8 w-8 p-0"
        >
          <Eye />
        </Button>
      );
    },
  },
];
