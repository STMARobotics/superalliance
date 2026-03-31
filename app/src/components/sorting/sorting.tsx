import { useMemo, useState } from "react";
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
import {
  ArrowDownUp,
  FileDigit,
  Home,
  ScatterChart,
  Filter,
} from "lucide-react";
import { SortingTeamsTable } from "@/components/sorting/sorting-table";
import { columns } from "@/components/sorting/sorting-columns";
import { ScrollArea } from "@mantine/core";

export default function Sorting({
  forms,
  teams,
  events,
  aggregation,
  setSelectedTeam,
  selectedTeam,
  mode,
}: {
  forms: any;
  teams: any;
  events: any;
  aggregation: any;
  setSelectedTeam: (teamId: any) => void;
  selectedTeam: any;
  mode?: "sorting" | "filter";
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filters, setFilters] = useState({
    trench: false,
    auto: false,
    autoClimb: false,
    bump: false,
    defense: false,
    shuttle: false,
    didClimb: false,
    defendedAgainst: false,
  });
  const pathname = useLocation().pathname;

  const activeFilterKeys = useMemo(
    () => Object.entries(filters).filter(([_, value]) => value).map(([key]) => key),
    [filters]
  );

  const filteredAggregation = useMemo(() => {
    if (mode !== "filter" || !activeFilterKeys.length || !forms?.length) {
      return aggregation;
    }

    const teamIds = new Set<any>();

    forms.forEach((form: any) => {
      if (!form) return;
      const hasAll = activeFilterKeys.every((field) => Boolean(form[field]));
      if (hasAll && form.teamNumber != null) {
        teamIds.add(form.teamNumber);
      }
    });

    return aggregation?.filter((team: any) => teamIds.has(team._id));
  }, [mode, activeFilterKeys, forms, aggregation]);

  const displayAggregation = mode === "filter" ? filteredAggregation : aggregation;

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
                title: "Filtering",
                label: "",
                icon: Filter,
                variant: pathname == "/data/filter" ? "default" : "ghost",
                link: "/data/filter",
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
            <h2 className="text-3xl font-bold tracking-tight">
              {mode === "filter" ? "Team Filtering" : "Team Sorting"}
            </h2>

            {mode === "filter" && (
              <div className="grid gap-3 rounded-md border p-4">
                <div className="flex flex-wrap gap-4">
                  {[
                    { key: "trench", label: "Went under trench" },
                    { key: "defense", label: "Played defense" },
                    { key: "shuttle", label: "Shuttled" },
                    { key: "auto", label: "Auto" },
                    { key: "autoClimb", label: "Auto Climb" },
                    { key: "bump", label: "Bump" },
                    { key: "didClimb", label: "Did Climb" },
                    { key: "defendedAgainst", label: "Was Defended Against" }
                  ].map((option) => (
                    <label
                      key={option.key}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={filters[option.key as keyof typeof filters]}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            [option.key]: e.target.checked,
                          }))
                        }
                        className="h-4 w-4"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {displayAggregation?.length ?? 0} teams match selected criteria
                  </span>
                  <button
                    className="rounded px-2 py-1 text-sm text-primary hover:bg-primary/10"
                    onClick={() =>
                      setFilters({ trench: false, defense: false, shuttle: false, auto: false, autoClimb: false, bump: false, didClimb: false, defendedAgainst: false })
                    }
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            )}

            {teams?.length > 0 && (
              <ScrollArea className="w-full h-screen">
                <SortingTeamsTable
                  data={displayAggregation}
                  columns={columns}
                  setSelectedTeam={setSelectedTeam}
                  selectedTeam={selectedTeam}
                />
              </ScrollArea>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
