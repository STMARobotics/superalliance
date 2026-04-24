"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ColumnFiltersState } from "@tanstack/react-table";

interface SortingFilterPanelProps {
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: (filters: ColumnFiltersState) => void;
}

interface FilterableColumn {
  id: string;
  label: string;
  hasAnyToggle?: boolean;
  hasNoneToggle?: boolean;
}

const ALL_COLUMNS: FilterableColumn[] = [
  { id: "avgTotalFuel", label: "Avg Total Fuel" },
  { id: "avgAutoFuel", label: "Avg Auto Fuel" },
  { id: "avgTeleFuel", label: "Avg Tele Fuel" },
  { id: "criticalCount", label: "Total Crits"},
  { id: "avgRP", label: "Avg RP" },
  { id: "winPercentage", label: "Win %" },
  { id: "autoPercentage", label: "Auto %" },
  { id: "bumpPercentage", label: "Bump %"},
  { id: "trenchPercentage", label: "Trench %" },
  { id: "shuttlePercentage", label: "Shuttle %"},
  { id: "moveWhileShootPercentage", label: "Move & Shoot %" },
  { id: "defensePercentage", label: "Defense %"},
  { id: "defendedAgainstPercentage", label: "Defended Against %" },
];

type FilterValue = [number | undefined, number | undefined, boolean | undefined, boolean | undefined];

export function SortingFilterPanel({
  columnFilters,
  onColumnFiltersChange,
}: SortingFilterPanelProps) {
  const [addedColumns, setAddedColumns] = useState<string[]>([]);

  const availableColumns = ALL_COLUMNS.filter(
    (col) => !addedColumns.includes(col.id)
  );

  function addColumn(id: string) {
    if (id) setAddedColumns((prev) => [...prev, id]);
  }

  function removeColumn(id: string) {
    setAddedColumns((prev) => prev.filter((c) => c !== id));
    onColumnFiltersChange(columnFilters.filter((f) => f.id !== id));
  }

  function clearAll() {
    setAddedColumns([]);
    onColumnFiltersChange([]);
  }

  function getFilterValue(id: string): FilterValue {
    const f = columnFilters.find((f) => f.id === id);
    if (!f) return [undefined, undefined, undefined, undefined];
    return f.value as FilterValue;
  }

  function updateFilter(id: string, next: FilterValue) {
    const [min, max, hasAny, hasNone] = next;
    const filtered = columnFilters.filter((f) => f.id !== id);
    if (min !== undefined || max !== undefined || hasAny || hasNone) {
      filtered.push({ id, value: next });
    }
    onColumnFiltersChange(filtered);
  }

  function handleInput(id: string, bound: "min" | "max", raw: string) {
    const [curMin, curMax, curHasAny, curHasNone] = getFilterValue(id);
    const parsed = raw === "" ? undefined : Number(raw);
    updateFilter(
      id,
      bound === "min"
        ? [parsed, curMax, curHasAny, curHasNone]
        : [curMin, parsed, curHasAny, curHasNone]
    );
  }

  const activeCount = columnFilters.length;

  return (
    <div className="px-2 py-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Filters
          {activeCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] w-4 h-4">
              {activeCount}
            </span>
          )}
        </span>
        {addedColumns.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {addedColumns.map((id) => {
        const col = ALL_COLUMNS.find((c) => c.id === id)!;
        const [min, max] = getFilterValue(id);
        return (
          <div key={id} className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-foreground/80">{col.label}</p>
              <button
                onClick={() => removeColumn(id)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={12} />
              </button>
            </div>
            <div className="flex gap-1">
              <input
                type="number"
                placeholder="Min"
                value={min ?? ""}
                onChange={(e) => handleInput(id, "min", e.target.value)}
                className="w-full rounded border border-input bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <input
                type="number"
                placeholder="Max"
                value={max ?? ""}
                onChange={(e) => handleInput(id, "max", e.target.value)}
                className="w-full rounded border border-input bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
        );
      })}

      {availableColumns.length > 0 && (
        <select
          value=""
          onChange={(e) => addColumn(e.target.value)}
          className="w-full rounded border border-input bg-background px-2 py-1 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
        >
          <option value="" disabled>
            + Add filter...
          </option>
          {availableColumns.map((col) => (
            <option key={col.id} value={col.id}>
              {col.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
