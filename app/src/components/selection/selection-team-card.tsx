import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader } from "@/components/ui/card";
import { cva } from "class-variance-authority";
import { Badge } from "@/components/ui/badge";
import { ColumnId } from "@/components/selection/selection-dnd";
import { toast } from "sonner";

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
  printMode?: boolean;
  compareMode?: boolean;
  leftTeam?: UniqueIdentifier;
  rightTeam?: UniqueIdentifier;
  setLeftTeam?: (teamId: UniqueIdentifier) => void;
  setRightTeam?: (teamId: UniqueIdentifier) => void;
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
  printMode,
  compareMode,
  leftTeam,
  rightTeam,
  setLeftTeam,
  setRightTeam,
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
      selected: {
        left: "bg-white text-black",
        right: "bg-white text-black",
      },
    },
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={
        compareMode
          ? () => {
              if (leftTeam == team.id || rightTeam == team.id)
                return toast.error("Team already selected");
              if (!leftTeam) {
                setLeftTeam!(team.id);
              } else if (!rightTeam) {
                setRightTeam!(team.id);
              }
            }
          : () => setSelectedTeam!(team.id)
      }
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        selected: compareMode
          ? leftTeam == team.id
            ? "left"
            : rightTeam == team.id
            ? "right"
            : undefined
          : undefined,
      })}
    >
      <CardHeader className="px-3 py-3 space-between flex flex-row border-secondary relative">
        <span>
          {compareMode && (
            <>
              {leftTeam == team.id ? (
                <span className="text-red-500 font-bold">#1{"  "}</span>
              ) : rightTeam == team.id ? (
                <span className="text-red-500 font-bold">#2{"  "}</span>
              ) : null}
            </>
          )}
          {team.teamNumber} -{" "}
          <span
            className={`${
              compareMode && (leftTeam == team.id || rightTeam == team.id)
                ? "text-black"
                : "text-secondary-foreground/65"
            }`}
          >
            {team?.teamName}
          </span>
        </span>
        {!printMode && (
          <Badge
            variant={"outline"}
            className={`ml-auto font-semibold h-6 ${
              compareMode &&
              (leftTeam == team.id || rightTeam == team.id) &&
              "text-black"
            }`}
          >
            {index ? index : "#"}
          </Badge>
        )}
      </CardHeader>
    </Card>
  );
}
