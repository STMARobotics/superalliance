import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext, type UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { Team, TeamCard } from "@/components/selection/selection-team-card";
import { cva } from "class-variance-authority";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconListNumbers, IconHash } from "@tabler/icons-react";

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
  onSortByNumber?: () => void;
  onSortByRank?: () => void;
  setSelectedTeam?: (teamId: UniqueIdentifier) => void;
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
  onSortByNumber,
  onSortByRank,
  setSelectedTeam,
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
    "h-[66vh] max-h-[66vh] md:w-[22vw] w-[250px] min-w-[150px] max-w-full bg-primary-foreground flex flex-col shrink-0 snap-center",
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
      <CardHeader className="border-b-2 p-4">
        <div className="flex items-center gap-2 font-semibold">
          <span className="flex-1 text-center">
              {column.id == "r3" && totalTeamCount - 23 > 0
                ? `${column.title} (${teams.length}/${totalTeamCount - 23})`
                : `${column.title} (${teams.length})`}
          </span>
          {column.id === "unsorted" && !isOverlay && (
            <TooltipProvider delayDuration={0}>
              <div className="ml-auto flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={onSortByNumber}
                      aria-label="Sort by team number"
                    >
                      <IconHash className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sort by team number</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={onSortByRank}
                      aria-label="Sort by rank"
                    >
                      <IconListNumbers className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sort by rank</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
      <ScrollArea>
        <CardContent
          className={`flex grow flex-col gap-2 p-2`}
        >
          <SortableContext items={teamsIds}>
            {teams.map((team) => {
              return (
                <TeamCard
                  key={team.id}
                  team={team}
                  setSelectedTeam={setSelectedTeam!}
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
}: {
  children: React.ReactNode;
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
        className={"flex gap-4 items-center flex-col md:flex-row justify-center"}
      >
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
