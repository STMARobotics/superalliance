"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/sorting/sorting-column-header";
import { DataTableRowActions } from "@/components/sorting/sorting-row-actions";

const numberRangeFilter: FilterFn<any> = (row, columnId, value) => {
  const [min, max, hasAny, hasNone] = value as [number | undefined, number | undefined, boolean | undefined, boolean | undefined];
  const v = row.getValue<number>(columnId);
  if (hasAny && v <= 0) return false;
  if (hasNone && v > 0) return false;
  if (min !== undefined && v < min) return false;
  if (max !== undefined && v > max) return false;
  return true;
};

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
    filterFn: numberRangeFilter,
    enableColumnFilter: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average Total Fuel" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("avgTotalFuel")}</div>
    ),
  },
  {
    accessorKey: "avgAutoFuel",
    filterFn: numberRangeFilter,
    enableColumnFilter: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average Auto Fuel" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("avgAutoFuel")}</div>
    ),
  },
  {
    accessorKey: "avgTeleFuel",
    filterFn: numberRangeFilter,
    enableColumnFilter: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average Tele Fuel" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("avgTeleFuel")}</div>
    ),
  },
  {
    accessorKey: "criticalCount",
    filterFn: numberRangeFilter,
    enableColumnFilter: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Crits" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("criticalCount")}</div>
    ),
  },
  {
    accessorKey: "avgRP",
    filterFn: numberRangeFilter,
    enableColumnFilter: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average RP" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("avgRP")}</div>,
  },
  {
    accessorKey: "winPercentage",
    filterFn: numberRangeFilter,
    enableColumnFilter: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Win Percentage" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("winPercentage")}%</div>
    ),
  },
  {
    accessorKey: "autoPercentage",
    filterFn: numberRangeFilter,
    enableColumnFilter: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Auto Percentage" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("autoPercentage")}%</div>
    ),
  },
  {
    accessorKey: "bumpPercentage",
    filterFn: numberRangeFilter,
    enableColumnFilter: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bump Percentage" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("bumpPercentage")}%</div>
    ),
  },
  {
    accessorKey: "trenchPercentage",
    filterFn: numberRangeFilter,
    enableColumnFilter: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trench Percentage" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("trenchPercentage")}%</div>
    ),
  },
  {
    accessorKey: "shuttlePercentage",
    filterFn: numberRangeFilter,
    enableColumnFilter: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Shuttle Percentage" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("shuttlePercentage")}%</div>
    ),
  },
  {
    accessorKey: "moveWhileShootPercentage",
    filterFn: numberRangeFilter,
    enableColumnFilter: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Move While Shoot" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue<number>("moveWhileShootPercentage") > 0 ? "Yes" : "No"}</div>
    ),
  },
  {
    accessorKey: "defensePercentage",
    filterFn: numberRangeFilter,
    enableColumnFilter: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Defense Percentage" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("defensePercentage")}%</div>
    ),
  },
  {
    accessorKey: "defendedAgainstPercentage",
    filterFn: numberRangeFilter,
    enableColumnFilter: true,
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
