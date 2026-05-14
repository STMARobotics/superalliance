import {
  BoardColumn,
  BoardContainer,
  type ColumnDragData,
  type Column,
} from "@/components/selection/selection-column";
import { Dispatch, SetStateAction, useMemo, useState, useRef, useEffect } from "react";
import {
  Team,
  TeamCard,
  type TeamDragData,
} from "@/components/selection/selection-team-card";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { coordinateGetter } from "@/components/selection/multipleContainersKeyboardPreset";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { hasDraggableData } from "@/components/selection/selection-utils";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Scale, Download, CloudDownload, CloudUpload } from "lucide-react";
import { useSuperAllianceApi } from "@/lib/superallianceapi";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider.tsx";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useMediaQuery } from "@mantine/hooks";
import { em } from "@mantine/core";
import { appConfig } from "@/config/app";

const defaultCols = [
  {
    id: "unsorted" as const,
    title: "Unsorted",
  },
  {
    id: "r1" as const,
    title: "R1",
  },
  {
    id: "r2" as const,
    title: "R2",
  },
  {
    id: "r3" as const,
    title: "R3",
  },
] satisfies Column[];

export type ColumnId = (typeof defaultCols)[number]["id"];
type PendingDragData = TeamDragData | ColumnDragData;
type PendingDragOver = {
  activeId: UniqueIdentifier;
  overId: UniqueIdentifier;
  activeData: PendingDragData;
  overData: PendingDragData;
};

const SelectionDND = ({
  teams,
  setTeams,
  setSelectedTeam,
  compareMode,
  setCompareMode,
  leftTeam,
  rightTeam,
  setLeftTeam,
  setRightTeam,
}: {
  teams: Team[];
  setTeams: Dispatch<SetStateAction<Team[]>>;
  setSelectedTeam: (teamId: UniqueIdentifier) => void;
  compareMode: boolean;
  setCompareMode: (compareMode: boolean) => void;
  leftTeam: UniqueIdentifier | null | undefined;
  rightTeam: UniqueIdentifier | null | undefined;
  setLeftTeam: Dispatch<SetStateAction<UniqueIdentifier | null | undefined>>;
  setRightTeam: Dispatch<SetStateAction<UniqueIdentifier | null | undefined>>;
}) => {

  const { user } = useUser();
  const { selectedEvent } = useSuperAlliance();
  const { getTeamSelection, saveTeamSelection, exportTeamSelection } = useSuperAllianceApi();

  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const dragOverFrameRef = useRef<number | null>(null);
  const pendingDragOverRef = useRef<PendingDragOver | null>(null);

  const applyDragOverUpdate = (
    currentTeams: Team[],
    pending: PendingDragOver
  ): Team[] => {
    const { activeId, overId, activeData, overData } = pending;

    if (activeData?.type !== "Team") {
      return currentTeams;
    }

    if (overData?.type === "Column") {
      const activeIndex = currentTeams.findIndex((t) => t.id === activeId);
      if (activeIndex === -1) {
        return currentTeams;
      }

      const activeTeam = currentTeams[activeIndex];
      if (!activeTeam || activeTeam.columnId === overId) {
        return currentTeams;
      }

      const nextTeams = [...currentTeams];
      nextTeams[activeIndex] = { ...activeTeam, columnId: overId as ColumnId };
      return nextTeams;
    }

    if (overData?.type !== "Team") {
      return currentTeams;
    }

    const activeIndex = currentTeams.findIndex((t) => t.id === activeId);
    const overIndex = currentTeams.findIndex((t) => t.id === overId);

    if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
      return currentTeams;
    }

    const nextTeams = [...currentTeams];
    const activeTeam = nextTeams[activeIndex];
    const overTeam = nextTeams[overIndex];

    if (!activeTeam || !overTeam) {
      return currentTeams;
    }

    if (activeTeam.columnId !== overTeam.columnId) {
      nextTeams[activeIndex] = { ...activeTeam, columnId: overTeam.columnId };
      return arrayMove(
        nextTeams,
        activeIndex,
        overIndex === 0 ? overIndex : overIndex - 1
      );
    }

    return arrayMove(nextTeams, activeIndex, overIndex);
  };

  const processPendingDragOver = () => {
    const pending = pendingDragOverRef.current;
    if (!pending) return;
    pendingDragOverRef.current = null;
    setTeams((currentTeams) => applyDragOverUpdate(currentTeams, pending));
  };

  const sortUnsortedTeams = (sortBy: "number" | "rank") => {
    const unsortedTeams = teams.filter((team) => team.columnId === "unsorted");

    if (unsortedTeams.length < 2) {
      return;
    }

    const sortedUnsortedTeams = [...unsortedTeams].sort((a, b) => {
      if (sortBy === "number") {
        return Number(a.teamNumber) - Number(b.teamNumber);
      }

      const aRank = Number(a.rank);
      const bRank = Number(b.rank);
      const aHasRank = Number.isFinite(aRank) && aRank > 0;
      const bHasRank = Number.isFinite(bRank) && bRank > 0;

      if (aHasRank && bHasRank) {
        return aRank - bRank;
      }

      if (aHasRank) {
        return -1;
      }

      if (bHasRank) {
        return 1;
      }

      return 0;
    });

    let unsortedIndex = 0;
    setTeams(
      teams.map((team) => {
        if (team.columnId !== "unsorted") {
          return team;
        }

        const nextTeam = sortedUnsortedTeams[unsortedIndex];
        unsortedIndex += 1;
        return nextTeam;
      })
    );
  };

  useEffect(() => {
    return () => {
      if (dragOverFrameRef.current !== null) {
        cancelAnimationFrame(dragOverFrameRef.current);
        dragOverFrameRef.current = null;
      }
    };
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 0.05,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 0.05,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    })
  );

  const getApiSelection = () => {
    (async function () {
      try {
        const data = await getTeamSelection(appConfig.year, selectedEvent);
        toast.success("Team Selection retrieved successfully!");
        const teams = data.teams || [];
        setTeams(teams);
      } catch {
        toast.error("The team selections failed to retrieve.");
      }
    })();
  };

  const saveSelection = () => {
    (async function () {
      try {
        await saveTeamSelection(appConfig.year, selectedEvent!, teams);
        toast.success("Team Selection saved successfully!");
      } catch {
        toast.error("The team selections failed to save.");
      }
    })();
  };

  const exportSelection = () => {
    (async function () {
      try {
        // Save current selection so we export the latest data
        await saveTeamSelection(appConfig.year, selectedEvent!, teams);
        
        // Export the saved data
        const blob = await exportTeamSelection(appConfig.year, selectedEvent!);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `team-selection-${selectedEvent}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success("Team Selection saved and exported successfully!");
      } catch {
        toast.error("The team selection save/export failed.");
      }
    })();
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex flex-row items-center justify-center pb-4 gap-2">
        {user?.publicMetadata.role == "admin"  && (
          <>
            <Button onClick={getApiSelection}>
              <CloudDownload className={`h-4 w-4 ${isMobile ? "" : "mr-2"}`} />{" "}
              {isMobile ? null : "Load"}
            </Button>
            <Button onClick={saveSelection}>
              <CloudUpload className={`h-4 w-4 ${isMobile ? "" : "mr-2"}`} />
              {isMobile ? null : "Save"}
            </Button>
            <Button
              variant={"default"}
              onClick={exportSelection}
            >
              <Download className={`h-4 w-4 ${isMobile ? "" : "mr-2"}`} />
              {isMobile ? null : "Export"}
            </Button>
            <Button
              variant={compareMode ? "secondary" : "default"}
              onClick={() => {
                if (compareMode) {
                  setLeftTeam(null);
                  setRightTeam(null);
                }
                setCompareMode(compareMode ? false : true);
              }}
            >
              <Scale className={`h-4 w-4 ${isMobile ? "" : "mr-2"}`} />
              {isMobile ? null : "Compare"}
            </Button>
          </>
        )}
      </div>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <BoardContainer>
          <SortableContext items={columnsId}>
            {columns.map((col) => (
              <BoardColumn
                key={col.id}
                column={col}
                teams={teams.filter((team) => team.columnId === col.id)}
                totalTeamCount={teams.length}
                onSortByNumber={
                  col.id === "unsorted"
                    ? () => sortUnsortedTeams("number")
                    : undefined
                }
                onSortByRank={
                  col.id === "unsorted"
                    ? () => sortUnsortedTeams("rank")
                    : undefined
                }
                setSelectedTeam={setSelectedTeam}
                compareMode={compareMode}
                leftTeam={leftTeam ?? undefined}
                rightTeam={rightTeam ?? undefined}
                setLeftTeam={setLeftTeam}
                setRightTeam={setRightTeam}
              />
            ))}
          </SortableContext>
        </BoardContainer>

        {"document" in window &&
          createPortal(
            <DragOverlay>
              {activeColumn && (
                <BoardColumn
                  column={activeColumn}
                  teams={teams.filter(
                    (team) => team.columnId === activeColumn.id
                  )}
                  totalTeamCount={teams.length}
                  setSelectedTeam={setSelectedTeam}
                  compareMode={compareMode}
                  leftTeam={leftTeam ?? undefined}
                  rightTeam={rightTeam ?? undefined}
                  setLeftTeam={setLeftTeam}
                  setRightTeam={setRightTeam}
                />
              )}
              {activeTeam && <TeamCard team={activeTeam} isOverlay />}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </div>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === "Column") {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === "Team") {
      setActiveTeam(data.team);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    if (dragOverFrameRef.current !== null) {
      cancelAnimationFrame(dragOverFrameRef.current);
      dragOverFrameRef.current = null;
    }
    processPendingDragOver();

    setActiveColumn(null);
    setActiveTeam(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === "Column";
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;
    if (!activeData || !overData) return;

    // Collect the drag over event data instead of processing immediately
    pendingDragOverRef.current = {
      activeId,
      overId,
      activeData,
      overData,
    };

    if (dragOverFrameRef.current !== null) {
      return;
    }

    dragOverFrameRef.current = requestAnimationFrame(() => {
      dragOverFrameRef.current = null;
      processPendingDragOver();
    });
  }
};

export default SelectionDND;
