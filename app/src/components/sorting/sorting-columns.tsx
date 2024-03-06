"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/sorting/sorting-column-header";
import { DataTableRowActions } from "@/components/sorting/sorting-row-actions";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Team #" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("_id")}</div>,
  },
  {
    accessorKey: "totalScore",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Score" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("totalScore")}</div>
    ),
  },
  {
    accessorKey: "totalScore",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Score" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("totalScore")}</div>
    ),
  },
  {
    id: "actions",
    cell: () => <DataTableRowActions />,
  },
];
