"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTableColumnHeader } from "./DataTableColumnHeader";

export type Sale = {
  id: number;
  createdAt: string;
  salePrice: string;
  buyerEmail: string;
  buyerName: string;
  status: "pending" | "completed" | "refunded" | "failed" | "refundpending";
};

export const columns: ColumnDef<Sale>[] = [
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Id" />
  //   ),
  // },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
  },
  {
    accessorKey: "salePrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sale Price" />
    ),
  },
  {
    accessorKey: "buyerEmail",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Buyer Email" />
    ),
  },
  {
    accessorKey: "buyerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Buyer Name" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: "saleDetails",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sale Details" />
    ),
    cell: ({ row }) => {
      const sale = row.original;
      return <Link href={`/sale/${sale.id}`}>View More</Link>;
    },
  },
];
