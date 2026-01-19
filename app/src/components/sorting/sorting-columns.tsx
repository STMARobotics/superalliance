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
    accessorKey: "avgTotalFuel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average Total Fuel" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("avgTotalFuel")}</div>
    ),
  },
  {
    accessorKey: "avgAutoFuel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average Auto Fuel" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("avgAutoFuel")}</div>
    ),
  },
  {
    accessorKey: "avgTeleFuel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average Tele Fuel" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("avgTeleFuel")}</div>
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
    accessorKey: "autoPercentage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Auto Percentage" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("autoPercentage")}%</div>
    ),
  },
  {
    accessorKey: "bumpPercentage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bump Percentage" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("bumpPercentage")}%</div>
    ),
  },
  {
    accessorKey: "trenchPercentage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trench Percentage" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("trenchPercentage")}%</div>
    ),
  },
  {
    accessorKey: "shuttlePercentage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Shuttle Percentage" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("shuttlePercentage")}%</div>
    ),
  },
  {
    accessorKey: "moveWhileShootPercentage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Move While Shoot" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue<number>("moveWhileShootPercentage") > 0 ? "Yes" : "No"}</div>
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
