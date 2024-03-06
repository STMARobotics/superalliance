import { useState } from "react";
import FormList from "@/components/forms/form-list";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import FormView from "@/components/form-view";
import { Affix, Button, ScrollArea, Transition } from "@mantine/core";
import { Separator } from "@/components/ui/separator";
import { ArrowDownUp, FileDigit, Home, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FormNav } from "@/components/forms/form-nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EventSwitcher } from "../event-switcher";
import { useLocation } from "react-router-dom";
import { IconExternalLink } from "@tabler/icons-react";

function Forms({
  forms,
  teams,
  events,
}: {
  forms: any;
  teams: any;
  events: any;
}) {
  const [selectedForm, setSelectedForm] = useState<any>("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchContent, setSearchContent] = useState("");
  const pathname = useLocation().pathname;
  const newEvents = [{ short_name: "All Events", event_code: "all" }].concat(
    events
  );
  const handleSearch = (e: any) => {
    e.preventDefault();
    setSearchContent(e.target.value);
  };
  return (
    <TooltipProvider delayDuration={0}>
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={selectedForm}>
          {(transitionStyles) => (
            <Button
              size="md"
              style={transitionStyles}
              component="a"
              href={`/data/form/stand/${selectedForm}`}
              target="_blank"
            >
              <IconExternalLink size={25} />
            </Button>
          )}
        </Transition>
      </Affix>
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
              <EventSwitcher isCollapsed={isCollapsed} events={newEvents} />
            )}
          </div>
          <Separator />
          <FormNav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Forms",
                label: forms?.length,
                icon: Home,
                variant: pathname == "/data/forms" ? "default" : "ghost",
                link: "/data/forms",
              },
              {
                title: "Teams",
                label: teams?.length,
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
            ]}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={30} defaultSize={440}>
          <div className="h-[52px] flex items-center px-4 py-2">
            <h1 className="text-xl font-bold">Forms</h1>
          </div>
          <Separator />
          <div className="h-[4.25rem] bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          <ScrollArea className="h-[calc(100vh-7.85rem-52px)]">
            <FormList
              forms={forms?.filter((form: any) => {
                if (searchContent == "") return true;
                else
                  return (
                    form.teamNumber.toString().includes(searchContent) ||
                    teams
                      .filter(
                        (team: any) => team.teamNumber == form.teamNumber
                      )[0]
                      ?.teamName.toLowerCase()
                      .includes(searchContent.toLowerCase()) ||
                    form.usersName
                      .toString()
                      .toLocaleLowerCase()
                      .includes(searchContent.toLocaleLowerCase())
                  );
              })}
              selectedForm={selectedForm}
              setSelectedForm={setSelectedForm}
              teamsPage={false}
            />
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={30} defaultSize={655}>
          <ScrollArea className="h-full p-10">
            {selectedForm ? (
              <FormView
                formData={
                  forms.filter((form: any) => form._id == selectedForm)[0]
                }
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-4xl font-bold">No form selected</h1>
                <p className="text-xl text-center text-muted-foreground">
                  Select a form from the list to view it
                </p>
              </div>
            )}
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}

export default Forms;
