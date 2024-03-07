import FormView from "@/components/form-view";
import FormList from "@/components/forms/form-list";
import SelectionDND from "@/components/selection/selection-dnd";
import SelectionTeamView from "@/components/selection/selection-team-view";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";
import { getPitFormByTeam } from "@/lib/superallianceapi";
import { Drawer, Modal, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Download, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
      <div className="w-full flex flex-row items-center justify-center pb-4 gap-2">
        <Button>
          <Download className="mr-2 h-4 w-4" /> Load Teams
        </Button>
        <Button>
          <Save className="mr-2 h-4 w-4" /> Save Teams
        </Button>
      </div>
      <div className="h-full flex justify-center items-center px-3">
        {teams?.length > 0 && (
          <SelectionDND
            propTeams={selectedEvent !== "all" ? eventTeams : teams}
            setSelectedTeam={setSelectedTeam}
          />
        )}
        {selectedTeam !== "" && totalAggregation && (
          <>
            <SelectionTeamView
              teams={teams}
              aggregationData={
                selectedEvent !== "all"
                  ? eventAggregation?.filter((team: any) => {
                      return team._id == Number(selectedTeam);
                    })[0]
                  : totalAggregation?.filter((team: any) => {
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
                forms={
                  selectedEvent !== "all"
                    ? eventForms?.filter(
                        (form: any) => form.teamNumber == selectedTeam
                      )
                    : forms?.filter(
                        (form: any) => form.teamNumber == selectedTeam
                      )
                }
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
      </div>
    </div>
  );
}

export default TeamSelection;
