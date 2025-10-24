'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

import { DataTableColumnHeader } from '@/components/DataTableColumnHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export type AdminUserRow = {
  id: string;
  fullName: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN' | 'MERCHANT';
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'UNDER_REVIEW';
  createdAt: string | Date | null;
};

export const columns: ColumnDef<AdminUserRow>[] = [
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
    accessorKey: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.fullName}</div>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => <Badge variant="secondary">{row.original.role}</Badge>,
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
    cell: ({ row }) => (
      <Button
        onClick={() => window.open(`/admin/users/${row.original.id}`, '_self')}
        variant="ghost"
        className="h-8 w-8 p-0"
      >
        <Eye />
      </Button>
    ),
  },
];
