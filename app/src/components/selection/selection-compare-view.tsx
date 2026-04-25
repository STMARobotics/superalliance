import { Image } from "@mantine/core";
import { TabsContent, TabsTrigger, Tabs, TabsList } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertCircle,
  ClipboardList,
  ImageIcon,
  Medal,
  MessageCircleMore,
  Tally5,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { IconRobot } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import PitFormView from "../pit-form-view";
import TeamMatchGraph from "@/components/graphs/team-match-graph";

const SelectionCompareView = ({
  aggregation,
  pitForm,
  teams,
  statsDifference,
  side,
  opr,
  moveTeamToColumn,
}: {
  aggregation: any;
  pitForm: any;
  teams: any;
  statsDifference: any;
  side: any;
  opr: any;
  moveTeamToColumn?: (teamId: string, columnId: string) => void;
}) => {
  const averages = [
    {
      label: "Avg Fuel",
      value: aggregation?.avgTotalFuel,
      statKey: "avgTotalFuel",
    },
    {
      label: "Avg Auto Fuel",
      value: aggregation?.avgAutoFuel,
      statKey: "avgAutoFuel",
    },
    {
      label: "Avg Tele Fuel",
      value: aggregation?.avgTeleFuel,
      statKey: "avgTeleFuel",
    },
    {
      label: "StdDev Total Fuel",
      value: aggregation?.stdDevTotalFuel,
      statKey: "stdDevTotalFuel",
      lowerIsBetter: true,
    },
    {
      label: "StdDev Auto Fuel",
      value: aggregation?.stdDevAutoFuel,
      statKey: "stdDevAutoFuel",
      lowerIsBetter: true,
    },
    {
      label: "StdDev Tele Fuel",
      value: aggregation?.stdDevTeleFuel,
      statKey: "stdDevTeleFuel",
      lowerIsBetter: true,
    },
    {
      label: "Avg Total Score",
      value: aggregation?.avgTotalScore,
      statKey: "avgTotalScore",
    },
    {
      label: "Avg Auto Score",
      value: aggregation?.avgAutoScore,
      statKey: "avgAutoScore",
    },
    {
      label: "Avg Tele Score",
      value: aggregation?.avgTeleScore,
      statKey: "avgTeleScore",
    },
    { label: "Avg RP", value: aggregation?.avgRP, statKey: "avgRP" },
    {
      label: "Total Crits",
      value: aggregation?.criticalCount,
      statKey: "criticalCount",
      lowerIsBetter: true,
    },
    {
      label: "Win %",
      value: aggregation?.winPercentage,
      statKey: "winPercentage",
    },
    {
      label: "Auto %",
      value: aggregation?.autoPercentage,
      statKey: "autoPercentage",
    },
    {
      label: "Bump %",
      value: aggregation?.bumpPercentage,
      statKey: "bumpPercentage",
    },
    {
      label: "Trench %",
      value: aggregation?.trenchPercentage,
      statKey: "trenchPercentage",
    },
    {
      label: "Left Climb L1 %",
      value: aggregation?.leftClimbLevelOnePercentage,
      statKey: "leftClimbLevelOnePercentage",
    },
    {
      label: "Center Climb L1 %",
      value: aggregation?.centerClimbLevelOnePercentage,
      statKey: "centerClimbLevelOnePercentage",
    },
    {
      label: "Right Climb L1 %",
      value: aggregation?.rightClimbLevelOnePercentage,
      statKey: "rightClimbLevelOnePercentage",
    },
    {
      label: "Left Climb L2 %",
      value: aggregation?.leftClimbLevelTwoPercentage,
      statKey: "leftClimbLevelTwoPercentage",
    },
    {
      label: "Center Climb L2 %",
      value: aggregation?.centerClimbLevelTwoPercentage,
      statKey: "centerClimbLevelTwoPercentage",
    },
    {
      label: "Right Climb L2 %",
      value: aggregation?.rightClimbLevelTwoPercentage,
      statKey: "rightClimbLevelTwoPercentage",
    },
    {
      label: "Left Climb L3 %",
      value: aggregation?.leftClimbLevelThreePercentage,
      statKey: "leftClimbLevelThreePercentage",
    },
    {
      label: "Center Climb L3 %",
      value: aggregation?.centerClimbLevelThreePercentage,
      statKey: "centerClimbLevelThreePercentage",
    },
    {
      label: "Right Climb L3 %",
      value: aggregation?.rightClimbLevelThreePercentage,
      statKey: "rightClimbLevelThreePercentage",
    },
    {
      label: "Shuttle %",
      value: aggregation?.shuttlePercentage,
      statKey: "shuttlePercentage",
    },
    {
      label: "Move While Shoot %",
      value: aggregation?.moveWhileShootPercentage,
      statKey: "moveWhileShootPercentage",
    },
    {
      label: "Defense %",
      value: aggregation?.defensePercentage,
      statKey: "defensePercentage",
    },
    {
      label: "Defended Against %",
      value: aggregation?.defendedAgainstPercentage,
      statKey: "defendedAgainstPercentage",
    },
  ];

  const formatDifference = (value: any) => {
    if (typeof value !== "number" || Number.isNaN(value) || value === 0) {
      return null;
    }

    return value > 0 ? `+${value}` : `${value}`;
  };

  const getBetterDifference = (statKey: string, invertColors: boolean = false) => {
    const difference = statsDifference?.[statKey];
    const formattedDifference = formatDifference(difference);

    if (!formattedDifference) {
      return null;
    }

    const isBetter = invertColors ? difference < 0 : difference > 0;

    return isBetter ? formattedDifference : null;
  };

  const renderDifference = (
    statKey: string,
    options?: { invertColors?: boolean; className?: string }
  ) => {
    const formattedDifference = getBetterDifference(
      statKey,
      options?.invertColors ?? false
    );

    if (!formattedDifference) {
      return null;
    }

    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full border border-green-500/40 bg-green-500/15 px-2 py-0.5 font-semibold leading-none text-green-500",
          options?.className ?? "text-[0.75rem]"
        )}
      >
        {formattedDifference}
      </span>
    );
  };

  const formatStdDevValue = (value: unknown) => {
    if (typeof value === "number" && Number.isFinite(value)) {
      return `±${value} std dev`;
    }

    return "— std dev";
  };

  const renderDifferenceChip = (statKey: string, invertColors: boolean = false) => {
    const formattedDifference = getBetterDifference(statKey, invertColors);

    if (!formattedDifference) {
      return null;
    }

    return (
      <span className="inline-flex items-center rounded-full border border-green-500/40 bg-green-500/15 px-1.5 py-0.5 text-[0.7rem] font-semibold leading-none text-green-500">
        {formattedDifference}
      </span>
    );
  };

  const handleMoveTeam = (columnId: string) => {
    if (moveTeamToColumn && aggregation?._id) {
      moveTeamToColumn(aggregation._id.toString(), columnId);
      toast.success(`Team ${aggregation._id} moved to ${columnId.toUpperCase()}`);
    }
  };

  const currentTeam = teams?.find((team: any) => team.id === aggregation?._id?.toString());
  const currentColumnId = currentTeam?.columnId;

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h2 className="text-3xl font-bold tracking-tight">
        Team #{aggregation?._id} -{" "}
        {
          teams.filter((team: any) => team.teamNumber == aggregation?._id)[0]
            .teamName
        }
      </h2>
      <Tabs defaultValue="inspector" className="space-y-4 w-full h-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="inspector">Inspector</TabsTrigger>
            <TabsTrigger value="pitform">Pit Form</TabsTrigger>
            <TabsTrigger value="graphs">Graphs</TabsTrigger>
          </TabsList>
          
          {moveTeamToColumn && (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleMoveTeam('r1')}
                variant={currentColumnId === 'r1' ? "default" : "outline"}
                size="sm"
                className="h-8"
              >
                R1
              </Button>
              <Button
                onClick={() => handleMoveTeam('r2')}
                variant={currentColumnId === 'r2' ? "default" : "outline"}
                size="sm"
                className="h-8"
              >
                R2
              </Button>
              <Button
                onClick={() => handleMoveTeam('r3')}
                variant={currentColumnId === 'r3' ? "default" : "outline"}
                size="sm"
                className="h-8"
              >
                R3
              </Button>
            </div>
          )}
        </div>
        <TabsContent value="inspector" className="space-y-4">
          <div>
            <div className="grid gap-4 grid-cols-2">
              {side == "left" && (
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pitForm?.robotImage ? (
                      <Image
                        fit="contain"
                        radius={"md"}
                        mah={"100%"}
                        src={`${pitForm?.robotImage}`}
                      />
                    ) : (
                      <div className="flex justify-center flex-col gap-5 items-center h-full">
                        <h1 className="text-3xl font-bold tracking-tight text-center">
                          No Image Found!
                        </h1>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              <div className="flex flex-col justify-center items-center gap-4 w-full col-span-1">
                <Card className="w-full min-h-36">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average Fuel
                    </CardTitle>
                    <Tally5 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex justify-between">
                      {aggregation?.avgTotalFuel} Fuel
                      {renderDifference("avgTotalFuel", {
                        className: "text-[1.2rem]",
                      })}
                    </div>
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-2 min-h-8 text-xs text-muted-foreground">
                      <span className="min-w-0">
                        {formatStdDevValue(aggregation?.stdDevTotalFuel)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average Auto Fuel
                    </CardTitle>
                    <IconRobot className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex justify-between">
                      {aggregation?.avgAutoFuel} Fuel
                      {renderDifference("avgAutoFuel", {
                        className: "text-[1.2rem]",
                      })}
                    </div>
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-2 min-h-8 text-xs text-muted-foreground">
                      <span className="min-w-0">
                        {formatStdDevValue(aggregation?.stdDevAutoFuel)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Criticals
                    </CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex justify-between">
                      {aggregation?.criticalCount}
                      {renderDifference("criticalCount", {
                        invertColors: true,
                        className: "text-[1.2rem]",
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Broke a Mechanism{" "}
                      {
                        aggregation?.criticals.filter(
                          ({ criticals }: { criticals: any }) =>
                            criticals.includes("Mechanism Broke")
                        ).length
                      }{" "}
                      times
                    </p>
                  </CardContent>
                </Card>
                <Card className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average Ranking Points
                    </CardTitle>
                    <Medal className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex justify-between">
                      {aggregation?.avgRP} Points
                      {renderDifference("avgRP", {
                        className: "text-[1.2rem]",
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      (Placeholder for ranking in event)
                    </p>
                  </CardContent>
                </Card>
                <Card className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      OPR
                    </CardTitle>
                    <Medal className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex justify-between">
                      {Number.parseFloat(opr).toFixed(2)}
                      {renderDifference("teamOPR", {
                        className: "text-[1.2rem]",
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
              {side == "right" && (
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pitForm?.robotImage ? (
                      <Image
                        fit="contain"
                        radius={"md"}
                        mah={"100%"}
                        src={`${pitForm?.robotImage}`}
                      />
                    ) : (
                      <div className="flex justify-center flex-col gap-5 items-center h-full">
                        <h1 className="text-3xl font-bold tracking-tight text-center">
                          No Image Found!
                        </h1>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="grid gap-4 grid-cols-2 pt-4">
              {side == "right" && (
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {averages.map((item: any, index: any) => (
                        <div
                          key={index}
                          className={cn(
                            buttonVariants({
                              variant: "default",
                              size: "sm",
                            }),
                            "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                            "justify-between w-full"
                          )}
                        >
                          {item.label}
                          <span
                            className={cn(
                              "inline-flex items-center gap-2 text-background dark:text-white"
                            )}
                          >
                            {renderDifferenceChip(
                              item.statKey,
                              item.lowerIsBetter ?? false
                            )}
                            <span>{item.value}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-7 flex-col h-[45vh] justify-center">
                    <Button
                      onClick={() => {
                        if (!pitForm?.robotImage)
                          return toast.error("No Image Found!");
                        // setImageOpened(true);
                      }}
                      className="w-full h-14 text-lg font-bold"
                    >
                      <ImageIcon className="mr-2 h-6 w-6" />
                      View Image
                    </Button>
                    <Button
                      onClick={() => {
                        if (aggregation?.comments.length == 0)
                          return toast.error("No Comments Found!");
                        // setCommentsOpened(true);
                      }}
                      className="w-full h-14 text-lg font-bold"
                    >
                      <MessageCircleMore className="mr-2 h-6 w-6" />
                      View Comments
                    </Button>
                    <Button
                      // onClick={() => setFormsOpened(true)}
                      className="w-full h-14 text-lg font-bold"
                    >
                      <ClipboardList className="mr-2 h-6 w-6" />
                      View Forms
                    </Button>
                    <Button
                      onClick={() => {
                        if (aggregation?.criticals.length == 0)
                          return toast.error("No Criticals Found!");
                        // setCriticalsOpened(true);
                      }}
                      className="w-full h-14 text-lg font-bold bg-red-500 hover:bg-red-700 text-white"
                    >
                      <XCircle className="mr-2 h-6 w-6" />
                      View Criticals
                    </Button>
                  </div>
                </CardContent>
              </Card>
              {side == "left" && (
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {averages.map((item: any, index: any) => (
                        <div
                          key={index}
                          className={cn(
                            buttonVariants({
                              variant: "default",
                              size: "sm",
                            }),
                            "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                            "justify-between w-full"
                          )}
                        >
                          {item.label}
                          <span
                            className={cn(
                              "inline-flex items-center gap-2 text-background dark:text-white"
                            )}
                          >
                            {renderDifferenceChip(
                              item.statKey,
                              item.lowerIsBetter ?? false
                            )}
                            <span>{item.value}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent
          value="pitform"
          className="space-y-4 w-[calc(100%-1rem)] h-[72vh]"
        >
          <PitFormView
            pitFormData={pitForm}
          />
        </TabsContent>
        <TabsContent
          value="graphs"
          className="space-y-4 w-[calc(100%-1rem)] h-[72vh]"
        >
          {aggregation?.length !== 0 ? (
            <TeamMatchGraph aggregation={aggregation} />
          ) : (
            <div className="flex justify-center items-center">
              <h1 className="text-3xl font-bold tracking-tight text-center">
                No Match Data Found!
              </h1>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SelectionCompareView;
