import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { EventSwitcher } from "@/components/event-switcher";
import { Separator } from "@/components/ui/separator";
import { FormNav } from "@/components/forms/form-nav";
import { ArrowDownUp, FileDigit, Home, ScatterChart } from "lucide-react";
import ProjectionsGraph from "./projections-graph";
import { Select } from "@mantine/core";

export default function TeamProjections({
  forms,
  teams,
  events,
  aggregation,
  selectedTeam,
  setSelectedTeam,
}: {
  forms: any;
  teams: any;
  events: any;
  aggregation: any;
  selectedTeam: any;
  setSelectedTeam: any;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = useLocation().pathname;
  const [stat, setStat] = useState<string | null>("averages");

  useEffect(() => {
    console.log(stat);
  }, []);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        orientation="horizontal"
        className="h-full items-stretch"
      >
        <ResizablePanel
          collapsible={true}
          minSize={15}
          maxSize={"50%"}
          defaultSize={265}
          onResize={(nextSize) => {
            setIsCollapsed(nextSize.inPixels < 60);
          }}
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
        <ResizablePanel minSize={30} defaultSize={1095}>
          <div className="hidden h-full flex-1 flex-col space-y-4 p-8 md:flex">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Team Projections
              </h2>
              <Select
                data={[
                  { label: "Average Fuel", value: "averageFuel" },
                  { label: "Totals", value: "totals" },
                ]}
                value={stat}
                onChange={setStat}
              />
            </div>
            <Separator />
            <ProjectionsGraph
              selectedStat={stat}
              data={aggregation ?? []}
              selectedTeam={selectedTeam}
              setSelectedTeam={setSelectedTeam}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
