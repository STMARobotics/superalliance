import FormView from "@/components/form-view";
import FormList from "@/components/forms/form-list";
import SelectionCompare from "@/components/selection/selection-compare";
import SelectionDND from "@/components/selection/selection-dnd";
import SelectionTeamView from "@/components/selection/selection-team-view";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";
import { useSuperAllianceApi } from "@/lib/superallianceapi";
import { Drawer, Modal, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";

type Team = {
  id: string;
  columnId: string;
  teamNumber: string;
  teamName: string;
  rank: string;
};

type ColumnId = "unsorted" | "r1" | "r2" | "r3";

function TeamSelection() {
  const {
    selectedEvent,
    eventTeams,
    eventAggregation,
    eventForms,
  } = useSuperAlliance();
  const [pitFormData, setPitFormData] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState<any>("");
  const [selectedForm, setSelectedForm] = useState<any>("");
  const [formListOpened, setFormListOpened] = useState(false);
  const [formOpened, setFormOpened] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [leftTeam, setLeftTeam] = useState<any>();
  const [rightTeam, setRightTeam] = useState<any>();
  const { getPitFormByTeam } = useSuperAllianceApi();
  
  const [teams, setTeams] = useState<Team[]>([]);
  
  // Initialize teams when eventTeams changes
  useEffect(() => {
    if (eventTeams) {
      setTeams(
        eventTeams.map((team: any) => ({
          id: `${team.teamNumber}`,
          columnId: "unsorted" as ColumnId,
          teamNumber: `${team.teamNumber}`,
          teamName: `${team.teamName}`,
          rank: `${team.teamRank}`,
        }))
      );
    }
  }, [eventTeams]);
  
  // Function to move a team to a specific column at the top
  const moveTeamToColumn = (teamId: string, columnId: string) => {
    setTeams((currentTeams) => {
      const teamIndex = currentTeams.findIndex((t) => t.id === teamId);
      if (teamIndex === -1) return currentTeams;

      const updatedTeams = [...currentTeams];
      const teamToMove = { ...updatedTeams[teamIndex] };
      teamToMove.columnId = columnId as ColumnId;
      
      // Remove from current position
      updatedTeams.splice(teamIndex, 1);
      
      // Find position to insert at top of target column
      const firstTeamInTargetColumn = updatedTeams.findIndex(
        (t) => t.columnId === columnId
      );
      
      if (firstTeamInTargetColumn === -1) {
        // No teams in target column, add to end
        updatedTeams.push(teamToMove);
      } else {
        // Insert at the beginning of target column
        updatedTeams.splice(firstTeamInTargetColumn, 0, teamToMove);
      }
      
      return updatedTeams;
    });
  };

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  useEffect(() => {
    (async function () {
      setPitFormData(
        selectedTeam
          ? await getPitFormByTeam(selectedEvent, selectedTeam).catch(() => null)
          : null
      );
    })();
  }, [selectedTeam]);

  useEffect(() => {
    if (selectedForm) return setFormOpened(true);
  }, [selectedForm]);

  return (
    <div>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center py-8">
        Team Selection
      </h1>
      <div className="h-full flex justify-center items-center w-full">
            <SelectionDND
              teams={teams}
              setTeams={setTeams}
              setSelectedTeam={setSelectedTeam}
              compareMode={compareMode}
              setCompareMode={setCompareMode}
              leftTeam={leftTeam}
              rightTeam={rightTeam}
              setLeftTeam={setLeftTeam}
              setRightTeam={setRightTeam}
            />
            <SelectionCompare
              teams={teams}
              aggregation={eventAggregation}
              compareMode={compareMode}
              setCompareMode={setCompareMode}
              leftTeam={leftTeam}
              rightTeam={rightTeam}
              setLeftTeam={setLeftTeam}
              setRightTeam={setRightTeam}
              moveTeamToColumn={moveTeamToColumn}
            />
            {selectedTeam !== "" && eventAggregation && (
              <>
                <SelectionTeamView
                  teams={teams}
                  aggregationData={
                    eventAggregation?.filter((team: any) => {
                      return team._id == Number(selectedTeam);
                    })[0]
                  }
                  setSelectedTeam={setSelectedTeam}
                  pitFormData={pitFormData}
                  setFormsOpened={setFormListOpened}
                  moveTeamToColumn={moveTeamToColumn}
                />
                <Modal
                  classNames={{
                    content: "bg-[#18181b]",
                    header: "bg-[#18181b]",
                  }}
                  opened={formListOpened}
                  onClose={() => setFormListOpened(false)}
                  title={"Forms"}
                  radius={"lg"}
                  size={"xl"}
                  overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                  }}
                  centered
                >
                  <FormList
                    teamsPage={false}
                    forms={eventForms?.filter(
                      (form: any) => form.teamNumber == selectedTeam
                    )}
                    selectedForm={selectedForm}
                    setSelectedForm={setSelectedForm}
                    selectedEvent={selectedEvent}
                  />
                </Modal>
                <Drawer
                  offset={isMobile ? 0 : 8}
                  radius={isMobile ? "" : "md"}
                  opened={formOpened}
                  position="right"
                  onClose={() => {
                    setSelectedForm("");
                    setFormOpened(false);
                  }}
                  title="Form View"
                >
                  {selectedForm && (
                    <FormView
                      formData={
                        eventForms.filter((form: any) => form._id == selectedForm)[0]
                      }
                    />
                  )}
                </Drawer>
              </>
            )}
      </div>
    </div>
  );
}

export default TeamSelection;
