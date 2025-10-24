'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

import { DataTableColumnHeader } from '@/components/DataTableColumnHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export type AdminOrderRow = {
  id: string;
  customerName: string | null;
  customerEmail: string | null;
  merchantName: string | null;
  status:
    | 'PENDING'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'REFUNDED';
  total: string; // decimal
  createdAt: string | Date | null;
  itemCount: number;
};

export const columns: ColumnDef<AdminOrderRow>[] = [
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
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order ID" />
    ),
  },
  {
    accessorKey: 'customerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => row.original.customerName ?? '-',
  },
  {
    accessorKey: 'merchantName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Merchant" />
    ),
    cell: ({ row }) => row.original.merchantName ?? '-',
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <Badge variant="outline">{row.original.status}</Badge>,
  },
  {
    accessorKey: 'total',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => `$${Number(row.original.total).toFixed(2)}`,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
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
    cell: ({ row }) => (
      <Button
        onClick={() => window.open(`/admin/orders/${row.original.id}`, '_self')}
        variant="ghost"
        className="h-8 w-8 p-0"
      >
        <Eye />
      </Button>
    ),
  },
];
