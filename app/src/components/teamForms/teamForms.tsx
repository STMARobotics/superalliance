import { useEffect, useState } from "react";
import FormList from "@/components/forms/form-list";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import FormView from "@/components/form-view";
import { Drawer, ScrollArea } from "@mantine/core";
import { Separator } from "@/components/ui/separator";
import {
  ArrowDownUp,
  FileDigit,
  Home,
  ScatterChart,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FormNav } from "@/components/forms/form-nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EventSwitcher } from "../event-switcher";
import { useLocation } from "react-router-dom";
import TeamList from "./team-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import PitFormView from "../pit-form-view";
import { useSuperAllianceApi } from "@/lib/superallianceapi";

function TeamForms({
  forms,
  teams,
  events,
  event,
}: {
  forms: any;
  teams: any;
  events: any;
  event: any;
}) {
  const [selectedTeam, setSelectedTeam] = useState<any>("");
  const [selectedForm, setSelectedForm] = useState<any>("");
  const [pitFormData, setPitFormData] = useState<any>({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchContent, setSearchContent] = useState("");
  const [teamFormsOpened, setTeamFormsOpened] = useState(false);
  const { getPitFormByTeam } = useSuperAllianceApi();
  const pathname = useLocation().pathname;
  const handleSearch = (e: any) => {
    e.preventDefault();
    setSearchContent(e.target.value);
  };
  useEffect(() => {
    if (selectedForm) return setTeamFormsOpened(true);
  }, [selectedForm]);
  useEffect(() => {
    (async function () {
      if (!selectedTeam) return;
      const pitForm = await getPitFormByTeam(event, selectedTeam).catch(() => null);
      setPitFormData(pitForm);
    })();
  }, [selectedTeam]);
  return (
    <>
      <Drawer
        offset={8}
        radius="md"
        opened={teamFormsOpened}
        position="right"
        onClose={() => {
          setSelectedForm("");
          setTeamFormsOpened(false);
        }}
        title="Form View"
      >
        {selectedForm ? (
          <FormView
            formData={forms.filter((form: any) => form._id == selectedForm)[0]}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl font-bold">No form selected</h1>
            <p className="text-xl text-center text-muted-foreground">
              Select a form from the list to view it
            </p>
          </div>
        )}
      </Drawer>
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full items-stretch"
        >
          <ResizablePanel
            collapsible={true}
            minSize={15}
            maxSize={20}
            defaultSize={265}
            onCollapse={() => setIsCollapsed(true)}
            onExpand={() => setIsCollapsed(false)}
            className={cn(
              isCollapsed &&
                "min-w-[50px] transition-all duration-300 ease-in-out"
            )}
          >
            <div
              className={cn(
                "flex h-[52px] items-center justify-center",
                isCollapsed ? "h-[52px]" : "px-2"
              )}
            >
              {events && (
                <EventSwitcher isCollapsed={isCollapsed} events={events} />
              )}
            </div>
            <Separator />
            <FormNav
              isCollapsed={isCollapsed}
              links={[
                {
                  title: "Forms",
                  label: forms?.length > 0 ? forms?.length : "",
                  icon: Home,
                  variant: pathname == "/data/forms" ? "default" : "ghost",
                  link: "/data/forms",
                },
                {
                  title: "Teams",
                  label: teams?.length > 0 ? teams?.length : "",
                  icon: FileDigit,
                  variant: pathname == "/data/teams" ? "default" : "ghost",
                  link: "/data/teams",
                },
                {
                  title: "Sorting",
                  label: "",
                  icon: ArrowDownUp,
                  variant: pathname == "/data/sorting" ? "default" : "ghost",
                  link: "/data/sorting",
                },
                {
                  title: "Team Projections",
                  label: "",
                  icon: ScatterChart,
                  variant:
                    pathname == "/data/team/projections" ? "default" : "ghost",
                  link: "/data/team/projections",
                },
              ]}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={30} defaultSize={440}>
            <div className="bg-background/95 p-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    className="pl-8"
                    value={searchContent}
                    onChange={handleSearch}
                  />
                </div>
              </form>
            </div>
            <ScrollArea className="h-[calc(100vh-5.75rem-52px)]" w={"100%"}>
              <TeamList
                teams={teams?.filter((team: any) => {
                  if (searchContent == "") return true;
                  else
                    return (
                      team.teamNumber.toString().includes(searchContent) ||
                      team.teamName
                        .toLowerCase()
                        .includes(searchContent.toLowerCase())
                    );
                })}
                selectedTeam={selectedTeam}
                setSelectedTeam={setSelectedTeam}
              />
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={30} defaultSize={655}>
            {selectedTeam ? (
              <Tabs defaultValue="stand">
                <div className="flex items-center px-4 py-2">
                  <h1 className="text-xl font-bold">Forms</h1>
                  <TabsList className="ml-auto">
                    <TabsTrigger
                      value="stand"
                      className="text-zinc-600 dark:text-zinc-200"
                    >
                      Stand Forms
                    </TabsTrigger>
                    <TabsTrigger
                      value="pit"
                      className="text-zinc-600 dark:text-zinc-200"
                    >
                      Pit Form
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="stand" className="m-0">
                  <ScrollArea className="h-[calc(100vh-7.85rem)]">
                    <FormList
                      forms={forms?.filter(
                        (form: any) => form.teamNumber == selectedTeam
                      )}
                      selectedForm={selectedForm}
                      setSelectedForm={setSelectedForm}
                      teamsPage={true}
                    />
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="pit" className="m-0">
                  {pitFormData ? (
                    <PitFormView pitFormData={pitFormData} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <h1 className="text-4xl font-bold">No pit form found!</h1>
                      <p className="text-xl text-center text-muted-foreground">
                        Please submit a pit form for this team!
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-4xl font-bold">No team selected</h1>
                <p className="text-xl text-center text-muted-foreground">
                  Select a team from the list to view it
                </p>
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </>
  );
}

export default TeamForms;
