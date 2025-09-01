"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { cn } from "@/lib/utils";
import { AccountStatus, Merchant } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { changeMerchantAccountStatus } from "@/lib/services/merchants";
import { useTransition } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS: AccountStatus[] = [
  "ACTIVE",
  "PENDING",
  "UNDER_REVIEW",
  "SUSPENDED",
];

const getClassName = (status: AccountStatus) => {
  return {
    ACTIVE:
      "bg-green-100 text-green-800 focus:bg-green-100 focus:text-green-800",
    PENDING:
      "bg-yellow-100 text-yellow-800 focus:bg-yellow-100 focus:text-yellow-800",
    UNDER_REVIEW:
      "bg-blue-100 text-blue-800 focus:bg-blue-100 focus:text-blue-800",
    SUSPENDED: "bg-red-100 text-red-800 focus:bg-red-100 focus:text-red-800",
  }[status];
};

export const columns: ColumnDef<Merchant>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
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
    accessorKey: "email",
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const currentStatus = row.getValue("status") as AccountStatus;
      const className = getClassName(currentStatus);
      const [isPending, startTransition] = useTransition();

      const handleStatusChange = async (newStatus: AccountStatus) => {
        const response = await changeMerchantAccountStatus(
          row.original.id,
          newStatus,
        );
        if (!response.success) {
          toast.error("Error", {
            description: response.message,
          });
          return;
        }
        toast.success("Success", { description: response.message });
      };

      return (
        <Select value={currentStatus} onValueChange={handleStatusChange}>
          <SelectTrigger
            className={cn(
              "w-full capitalize border-none [&>svg]:hidden",
              className,
            )}
          >
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem
                key={status}
                value={status}
                className={cn("capitalize mb-2", getClassName(status))}
              >
                {status.replace("_", " ").toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },
  {
    accessorKey: "totalProducts",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Products" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.totalProducts}</div>;
    },
  },
  {
    accessorKey: "totalSales",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Sales" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.totalSales}</div>;
    },
  },
  {
    accessorKey: "joinDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Join Date" />
    ),
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Action"} />
    ),
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <Button
          onClick={() => router.push(`/admin/merchants/${row.original.id}`)}
          variant="ghost"
          className="h-8 w-8 p-0"
        >
          <Eye />
        </Button>
      );
    },
  },
];
