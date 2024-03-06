import { useState } from "react";
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
import { ArrowDownUp, FileDigit, Home } from "lucide-react";
import { SortingTeamsTable } from "@/components/sorting/sorting-table";
import { columns } from "@/components/sorting/sorting-columns";

export default function Sorting({
  forms,
  teams,
  events,
  aggregation,
}: {
  forms: any;
  teams: any;
  events: any;
  aggregation: any;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = useLocation().pathname;
  const newEvents = [{ short_name: "All Events", event_code: "all" }].concat(
    events
  );
  return (
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
        <ResizablePanel minSize={30} defaultSize={1095}>
          <div className="hidden h-full flex-1 flex-col space-y-4 p-8 md:flex">
            <h2 className="text-3xl font-bold tracking-tight">Team Sorting</h2>
            <SortingTeamsTable data={aggregation} columns={columns} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
