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
    accessorKey: "avgTotalCoral",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average Total Coral" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("avgTotalCoral")}</div>
    ),
  },
  {
    accessorKey: "avgAutoCoral",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average Auto Coral" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("avgAutoCoral")}</div>
    ),
  },
  {
    accessorKey: "avgTeleCoral",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average Tele Coral" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("avgTeleCoral")}</div>
    ),
  },
  {
    accessorKey: "criticalCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Crits" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("criticalCount")}</div>
    ),
  },
  {
    accessorKey: "avgRP",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average RP" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("avgRP")}</div>,
  },
  {
    accessorKey: "winPercentage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Win Percentage" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("winPercentage")}%</div>
    ),
  },
  {
    accessorKey: "avgTotalAlgae",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average Total Algae Score" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("avgTotalAlgae")}</div>
    ),
  },
  {
    accessorKey: "avgProcessedAlgae",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Average Processed Algae Score"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("avgProcessedAlgae")}</div>
    ),
  },
  {
    accessorKey: "avgNetAlgae",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average Net Algae Score" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("avgNetAlgae")}</div>
    ),
  },
  {
    accessorKey: "leavePercentage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leave Percentage" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("leavePercentage")}%</div>
    ),
  },
  {
    accessorKey: "parkPercentage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Park Percentage" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("parkPercentage")}%</div>
    ),
  },
  {
    accessorKey: "defensePercentage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Defense Percentage" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("defensePercentage")}%</div>
    ),
  },
  {
    accessorKey: "defendedAgainstPercentage",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Defended Against Percentage"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">
        {row.getValue("defendedAgainstPercentage")}%
      </div>
    ),
  },
  {
    id: "actions",
    cell: () => <DataTableRowActions />,
  },
];
