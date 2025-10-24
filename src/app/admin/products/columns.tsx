'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

import { DataTableColumnHeader } from '@/components/DataTableColumnHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export type AdminProductRow = {
  id: string; // string for uniform selection handling
  name: string;
  merchantName: string | null;
  category: string;
  price: string; // decimal as string
  stockCount: number;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  createdAt: string | Date | null;
};

export const columns: ColumnDef<AdminProductRow>[] = [
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
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: 'merchantName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Merchant" />
    ),
    cell: ({ row }) => row.original.merchantName ?? '-',
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => `$${Number(row.original.price).toFixed(2)}`,
  },
  {
    accessorKey: 'stockCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <Badge variant="outline">{row.original.status}</Badge>,
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
        onClick={() =>
          window.open(`/admin/products/${row.original.id}`, '_self')
        }
        variant="ghost"
        className="h-8 w-8 p-0"
      >
        <Eye />
      </Button>
    ),
  },
];
