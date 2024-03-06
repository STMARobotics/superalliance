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

const defaultCols = [
  {
    id: "unsorted" as const,
    title: "Unsorted",
  },
  {
    id: "pick" as const,
    title: "Pick",
  },
  {
    id: "plsno" as const,
    title: "Please no",
  },
  {
    id: "dnp" as const,
    title: "Do not pick",
  },
] satisfies Column[];

export type ColumnId = (typeof defaultCols)[number]["id"];

const SelectionDND = ({
  propTeams,
  setSelectedTeam,
}: {
  propTeams: any[];
  setSelectedTeam: (teamId: UniqueIdentifier) => void;
}) => {
  const initialTeams: Team[] = propTeams.map((team: any) => {
    return {
      id: `${team.teamNumber}`,
      columnId: "unsorted",
      teamNumber: `${team.teamNumber}`,
      teamName: `${team.teamName}`,
    };
  });

  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [teams, setTeams] = useState<Team[]>(initialTeams);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTeam, setActiveTeam] = useState<Team | null>(null);

  useEffect(() => {
    setTeams(
      propTeams.map((team: any) => {
        return {
          id: `${team.teamNumber}`,
          columnId: "unsorted",
          teamNumber: `${team.teamNumber}`,
          teamName: `${team.teamName}`,
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

  return (
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
              setSelectedTeam={setSelectedTeam}
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
              />
            )}
            {activeTeam && <TeamCard team={activeTeam} isOverlay />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
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
