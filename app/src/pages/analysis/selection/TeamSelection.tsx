import FormView from "@/components/form-view";
import FormList from "@/components/forms/form-list";
import SelectionDND from "@/components/selection/selection-dnd";
import SelectionTeamView from "@/components/selection/selection-team-view";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";
import { getPitFormByTeam } from "@/lib/superallianceapi";
import { Drawer, Modal, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";

function TeamSelection() {
  const {
    teams,
    totalAggregation,
    forms,
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

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  useEffect(() => {
    (async function () {
      setPitFormData(
        selectedTeam
          ? await getPitFormByTeam(selectedTeam).catch(() => null)
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
      <div className="h-full flex justify-center items-center px-3">
        {selectedEvent == "all" ? (
          <>
            {teams?.length > 0 && (
              <SelectionDND
                propTeams={teams}
                setSelectedTeam={setSelectedTeam}
              />
            )}
          </>
        ) : (
          <>
            {eventTeams?.length > 0 && (
              <SelectionDND
                propTeams={eventTeams}
                setSelectedTeam={setSelectedTeam}
              />
            )}
          </>
        )}
        {selectedEvent !== "all" ? (
          <>
            {selectedTeam !== "" && eventAggregation && (
              <>
                <SelectionTeamView
                  teams={eventTeams}
                  aggregationData={
                    eventAggregation?.filter((team: any) => {
                      return team._id == Number(selectedTeam);
                    })[0]
                  }
                  setSelectedTeam={setSelectedTeam}
                  pitFormData={pitFormData}
                  setFormsOpened={setFormListOpened}
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
                        forms.filter((form: any) => form._id == selectedForm)[0]
                      }
                    />
                  )}
                </Drawer>
              </>
            )}
          </>
        ) : (
          <>
            {selectedTeam !== "" && totalAggregation && (
              <>
                <SelectionTeamView
                  teams={teams}
                  aggregationData={
                    totalAggregation?.filter((team: any) => {
                      return team._id == Number(selectedTeam);
                    })[0]
                  }
                  setSelectedTeam={setSelectedTeam}
                  pitFormData={pitFormData}
                  setFormsOpened={setFormListOpened}
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
                    forms={forms?.filter(
                      (form: any) => form.teamNumber == selectedTeam
                    )}
                    selectedForm={selectedForm}
                    setSelectedForm={setSelectedForm}
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
                        forms.filter((form: any) => form._id == selectedForm)[0]
                      }
                    />
                  )}
                </Drawer>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TeamSelection;
