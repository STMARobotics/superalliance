import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext, type UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { Team, TeamCard } from "@/components/selection/selection-team-card";
import { cva } from "class-variance-authority";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export interface Column {
  id: UniqueIdentifier;
  title: string;
}

export type ColumnType = "Column";

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

interface BoardColumnProps {
  column: Column;
  teams: Team[];
  isOverlay?: boolean;
  totalTeamCount: number;
  setSelectedTeam?: (teamId: UniqueIdentifier) => void;
  printMode?: boolean;
  compareMode?: boolean;
  leftTeam?: UniqueIdentifier;
  rightTeam?: UniqueIdentifier;
  setLeftTeam?: (teamId: UniqueIdentifier) => void;
  setRightTeam?: (teamId: UniqueIdentifier) => void;
}

export function BoardColumn({
  column,
  teams,
  isOverlay,
  totalTeamCount,
  setSelectedTeam,
  printMode,
  compareMode,
  leftTeam,
  rightTeam,
  setLeftTeam,
  setRightTeam,
}: BoardColumnProps) {
  const teamsIds = useMemo(() => {
    return teams.map((team) => team.id);
  }, [teams]);

  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    `${
      printMode ? "" : "h-[66vh] max-h-[66vh]"
    } md:w-[22vw] w-[250px] min-w-[150px] max-w-full bg-primary-foreground flex flex-col flex-shrink-0 snap-center`,
    {
      variants: {
        dragging: {
          default: "border-2 border-transparent",
          over: "ring-2 opacity-30",
          overlay: "ring-2 ring-primary",
        },
      },
    }
  );

  return (
    <Card //user-5311fd55-9e43-444f-8b37-5df3602fb2ae-mr26b5rkmq-uc.a.run.app/?p=06e64f9ace
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="p-4 font-semibold border-b-2 text-center flex flex-row space-between items-center">
        <span className="m-auto">
          {column.id == "dnp" && totalTeamCount - 23 > 0
            ? `${column.title} (${teams.length}/${totalTeamCount - 23})`
            : `${column.title} (${teams.length})`}
        </span>
      </CardHeader>
      <ScrollArea>
        <CardContent
          className={`flex flex-grow flex-col gap-2 p-2 ${
            printMode ? "mb-10" : ""
          }`}
        >
          <SortableContext items={teamsIds}>
            {teams.map((team) => {
              return (
                <TeamCard
                  key={team.id}
                  team={team}
                  setSelectedTeam={setSelectedTeam!}
                  printMode={printMode}
                  compareMode={compareMode}
                  leftTeam={leftTeam}
                  rightTeam={rightTeam}
                  setLeftTeam={setLeftTeam}
                  setRightTeam={setRightTeam}
                />
              );
            })}
          </SortableContext>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

export function BoardContainer({
  children,
  printMode,
}: {
  children: React.ReactNode;
  printMode: boolean;
}) {
  const dndContext = useDndContext();

  const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none",
      },
    },
  });

  return (
    <ScrollArea
      className={variations({
        dragging: dndContext.active ? "active" : "default",
      })}
    >
      <div
        className={`flex gap-4 ${
          printMode
            ? "items-start flex-row"
            : "items-center flex-col md:flex-row"
        } justify-center`}
      >
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
