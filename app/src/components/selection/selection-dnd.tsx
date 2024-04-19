import {
  BoardColumn,
  BoardContainer,
  type Column,
} from "@/components/selection/selection-column";
import { useEffect, useMemo, useState } from "react";
import { Team, TeamCard } from "@/components/selection/selection-team-card";
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
import { Diff, Download, Printer, Save } from "lucide-react";
import { getTeamSelection } from "@/lib/superallianceapi";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "sonner";
import { useMediaQuery } from "@mantine/hooks";
import { em } from "@mantine/core";

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

const SelectionDND = ({
  propTeams,
  setSelectedTeam,
  compareMode,
  setCompareMode,
  leftTeam,
  rightTeam,
  setLeftTeam,
  setRightTeam,
}: {
  propTeams: any[];
  setSelectedTeam: (teamId: UniqueIdentifier) => void;
  compareMode: boolean;
  setCompareMode: (compareMode: boolean) => void;
  leftTeam: any;
  rightTeam: any;
  setLeftTeam: (leftTeam: any) => void;
  setRightTeam: (rightTeam: any) => void;
}) => {
  const initialTeams: Team[] = propTeams.map((team: any) => {
    return {
      id: `${team.teamNumber}`,
      columnId: "unsorted",
      teamNumber: `${team.teamNumber}`,
      teamName: `${team.teamName}`,
      rank: `${team.teamRank}`,
    };
  });

  const { user } = useUser();

  const [columns, setColumns] = useState<any[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [teams, setTeams] = useState<Team[]>(initialTeams);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTeam, setActiveTeam] = useState<Team | null>(null);

  const [printMode, setPrintMode] = useState<boolean>(false);

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  useEffect(() => {
    setTeams(
      propTeams.map((team: any) => {
        return {
          id: `${team.teamNumber}`,
          columnId: "unsorted",
          teamNumber: `${team.teamNumber}`,
          teamName: `${team.teamName}`,
          rank: `${team.teamRank}`,
        };
      })
    );
  }, [propTeams]);

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
        const data = await getTeamSelection();
        toast.success("Team Selection retrieved successfully!");
        const teams = data.teams;
        setTeams(teams);
      } catch {
        toast.error("The team selections failed to retrieve.");
      }
    })();
  };

  const saveSelection = () => {
    (async function () {
      await axios
        .post(`${import.meta.env.VITE_API_URL}/api/teamSelection/save`, {
          teams: teams,
        })
        .then(function () {
          toast.success("Team Selection saved successfully!");
        })
        .catch(function () {
          toast.error("The team selections failed to save.");
        });
    })();
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex flex-row items-center justify-center pb-4 gap-2">
        {user?.organizationMemberships[0]?.role == "org:admin" && (
          <>
            <Button onClick={getApiSelection}>
              <Download className={`h-4 w-4 ${isMobile ? "" : "mr-2"}`} />{" "}
              {isMobile ? null : "Get from DB"}
            </Button>
            <Button onClick={saveSelection}>
              <Save className={`h-4 w-4 ${isMobile ? "" : "mr-2"}`} />
              {isMobile ? null : "Save to DB"}
            </Button>
            <Button
              variant={printMode ? "secondary" : "default"}
              onClick={() => setPrintMode(printMode ? false : true)}
            >
              <Printer className={`h-4 w-4 ${isMobile ? "" : "mr-2"}`} />
              {isMobile ? null : "Print Mode"}
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
              <Diff className={`h-4 w-4 ${isMobile ? "" : "mr-2"}`} />
              {isMobile ? null : "Compare Mode"}
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
        <BoardContainer printMode={printMode}>
          <SortableContext items={columnsId}>
            {columns.map((col) => (
              <BoardColumn
                key={col.id}
                column={col}
                teams={teams
                  .filter((team) => team.columnId === col.id)
                  .sort((a: any, b: any) => a.rank - b.rank)}
                totalTeamCount={teams.length}
                setSelectedTeam={setSelectedTeam}
                printMode={printMode}
                compareMode={compareMode}
                leftTeam={leftTeam}
                rightTeam={rightTeam}
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
                  teams={teams
                    .filter((team) => team.columnId === activeColumn.id)
                    .sort((a: any, b: any) => a.rank - b.rank)}
                  totalTeamCount={teams.length}
                  setSelectedTeam={setSelectedTeam}
                  printMode={printMode}
                  compareMode={compareMode}
                  leftTeam={leftTeam}
                  rightTeam={rightTeam}
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

    const isActiveATeam = activeData?.type === "Team";
    const isOverATeam = activeData?.type === "Team";

    if (!isActiveATeam) return;

    // Im dropping a Team over another Team
    if (isActiveATeam && isOverATeam) {
      setTeams((teams) => {
        const activeIndex = teams.findIndex((t) => t.id === activeId);
        const overIndex = teams.findIndex((t) => t.id === overId);
        const activeTeam = teams[activeIndex];
        const overTeam = teams[overIndex];
        if (
          activeTeam &&
          overTeam &&
          activeTeam.columnId !== overTeam.columnId
        ) {
          activeTeam.columnId = overTeam.columnId;
          return arrayMove(
            teams,
            activeIndex,
            overIndex == 0 ? overIndex : overIndex - 1
          );
        }

        return arrayMove(teams, activeIndex, overIndex);
      });
    }

    const isOverAColumn = overData?.type === "Column";

    // Im dropping a Team over a column
    if (isActiveATeam && isOverAColumn) {
      setTeams((teams) => {
        const activeIndex = teams.findIndex((t) => t.id === activeId);
        const activeTeam = teams[activeIndex];
        if (activeTeam) {
          activeTeam.columnId = overId as ColumnId;
          return arrayMove(teams, activeIndex, activeIndex);
        }
        return teams;
      });
    }
  }
};

export default SelectionDND;
