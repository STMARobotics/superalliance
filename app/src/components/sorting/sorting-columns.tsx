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
    accessorKey: "avgTotalNotes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average Total Notes" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("avgTotalNotes")}</div>
    ),
  },
  {
    accessorKey: "avgAutoNotes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average Auto Notes" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("avgAutoNotes")}</div>
    ),
  },
  {
    accessorKey: "avgTeleNotes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average Tele Notes" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("avgTeleNotes")}</div>
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
    accessorKey: "avgAutoAmpsNotes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average Auto Amps Score" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("avgAutoAmpsNotes")}</div>
    ),
  },
  {
    accessorKey: "avgAutoSpeakersNotes",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Average Auto Speakers Score"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("avgAutoSpeakersNotes")}</div>
    ),
  },
  {
    accessorKey: "avgTeleAmpsNotes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average Tele Amps Score" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("avgTeleAmpsNotes")}</div>
    ),
  },
  {
    accessorKey: "avgTeleSpeakersNotes",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Average Tele Speakers Score"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("avgTeleSpeakersNotes")}</div>
    ),
  },
  {
    accessorKey: "avgTeleAmplifiedSpeakersNotes",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Average Tele Amplified Speakers Score"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">
        {row.getValue("avgTeleAmplifiedSpeakersNotes")}
      </div>
    ),
  },
  {
    accessorKey: "avgTeleTrapsNotes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average Tele Traps Score" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("avgTeleTrapsNotes")}</div>
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
    accessorKey: "onstagePercentage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Onstage Percentage" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("onstagePercentage")}%</div>
    ),
  },
  {
    accessorKey: "onstageSpotlitPercentage",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Onstage Spotlit Percentage"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">
        {row.getValue("onstageSpotlitPercentage")}%
      </div>
    ),
  },
  {
    accessorKey: "harmonyPercentage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Harmony Percentage" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("harmonyPercentage")}%</div>
    ),
  },
  {
    accessorKey: "selfSpotlitPercentage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Self Spotlit Percentage" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("selfSpotlitPercentage")}%</div>
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
    accessorKey: "stockpilePercentage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stockpile Percentage" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("stockpilePercentage")}%</div>
    ),
  },
  {
    accessorKey: "underStagePercentage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Under Stage Percentage" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("underStagePercentage")}%</div>
    ),
  },
  {
    id: "actions",
    cell: () => <DataTableRowActions />,
  },
];
