import { Active, DataRef, Over } from "@dnd-kit/core";
import { ColumnDragData } from "@/components/selection/selection-column";
import { TeamDragData } from "@/components/selection/selection-team-card";

type DraggableData = ColumnDragData | TeamDragData;

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === "Column" || data?.type === "Team") {
    return true;
  }

  return false;
}
