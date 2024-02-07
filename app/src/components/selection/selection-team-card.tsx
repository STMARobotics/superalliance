import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader } from "@/components/ui/card";
import { cva } from "class-variance-authority";
import { Badge } from "@/components/ui/badge";
import { ColumnId } from "@/components/selection/selection-dnd";

export interface Team {
  id: UniqueIdentifier;
  columnId: ColumnId;
  teamNumber: string;
  teamName: string;
}

interface TeamCardProps {
  team: Team;
  isOverlay?: boolean;
  index?: string;
  setSelectedTeam?: (teamId: UniqueIdentifier) => void;
}

export type TeamType = "Team";

export interface TeamDragData {
  type: TeamType;
  team: Team;
}

export function TeamCard({
  team,
  isOverlay,
  index,
  setSelectedTeam,
}: TeamCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: team.id,
    data: {
      type: "Team",
      team,
    } satisfies TeamDragData,
    attributes: {
      roleDescription: "Team",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => setSelectedTeam!(team.id)}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="px-3 py-3 space-between flex flex-row border-secondary relative">
        <span>
          {team.teamNumber} -{" "}
          <span className="text-secondary-foreground/65">{team?.teamName}</span>
        </span>
        <Badge variant={"outline"} className="ml-auto font-semibold h-6">
          {index ? index : "#"}
        </Badge>
      </CardHeader>
    </Card>
  );
}
