import FormView from "@/components/form-view";
import FormList from "@/components/forms/form-list";
import TeamProjections from "@/components/projections/projections";
import SelectionTeamView from "@/components/selection/selection-team-view";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";
import { getPitFormByTeam } from "@/lib/superallianceapi";
import { Drawer, Modal, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";

function DataTeamProjections() {
  const {
    forms,
    teams,
    totalAggregation,
    events,
    selectedEvent,
    eventForms,
    eventTeams,
    eventAggregation,
  } = useSuperAlliance();

  const [selectedTeam, setSelectedTeam] = useState<any>("");
  const [pitFormData, setPitFormData] = useState(null);
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
    <>
      {selectedEvent == "all" ? (
        <>
          {totalAggregation && (
            <div className="h-full flex-col md:flex">
              <TeamProjections
                forms={forms}
                teams={teams}
                events={events}
                aggregation={totalAggregation}
                selectedTeam={selectedTeam}
                setSelectedTeam={setSelectedTeam}
              />
            </div>
          )}
        </>
      ) : (
        <>
          {eventAggregation && (
            <div className="h-full flex-col md:flex">
              <TeamProjections
                forms={eventForms}
                teams={eventTeams}
                events={events}
                aggregation={eventAggregation}
                selectedTeam={selectedTeam}
                setSelectedTeam={setSelectedTeam}
              />
            </div>
          )}
        </>
      )}
      {selectedEvent == "all" ? (
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
      ) : (
        <>
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
      )}
    </>
  );
}

export default DataTeamProjections;
