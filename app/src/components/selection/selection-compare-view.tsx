import { Image, ScrollArea } from "@mantine/core";
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
import SelectionPitFormView from "@/components/selection/selection-pit-form-view";
import TeamMatchGraph from "@/components/graphs/team-match-graph";

const SelectionCompareView = ({
  aggregation,
  pitForm,
  teams,
  statsDifference,
  side,
  opr,
}: {
  aggregation: any;
  pitForm: any;
  teams: any;
  statsDifference: any;
  side: any;
  opr: any;
}) => {
  const averages = [
    {
      label: "Avg Coral",
      value: aggregation?.avgTotalCoral,
      statKey: "avgTotalCoral",
    },
    {
      label: "Avg Auto Coral",
      value: aggregation?.avgAutoCoral,
      statKey: "avgAutoCoral",
    },
    {
      label: "Avg Tele Coral",
      value: aggregation?.avgTeleCoral,
      statKey: "avgTeleCoral",
    },
    {
      label: "Avg Total Algae Score",
      value: aggregation?.avgTotalAlgae,
      statKey: "avgTotalAlgae",
    },
    {
      label: "Avg Processed Algae Score",
      value: aggregation?.avgProcessedAlgae,
      statKey: "avgProcessedAlgae",
    },
    {
      label: "Avg Net Algae Score",
      value: aggregation?.avgNetAlgae,
      statKey: "avgNetAlgae",
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
    },
    {
      label: "Win %",
      value: aggregation?.winPercentage,
      statKey: "winPercentage",
    },
    {
      label: "Leave %",
      value: aggregation?.leavePercentage,
      statKey: "leavePercentage",
    },
    {
      label: "Park %",
      value: aggregation?.parkPercentage,
      statKey: "parkPercentage",
    },
    { label: "Shallow Climb %",
      value: aggregation?.shallowClimbPercentage,
      statKey: "shallowClimbPercentage",
    },
    { label: "Deep Climb %",
      value: aggregation?.deepClimbPercentage,
      statKey: "deepClimbPercentage",
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
        <TabsList>
          <TabsTrigger value="inspector">Inspector</TabsTrigger>
          <TabsTrigger value="pitform">Pit Form</TabsTrigger>
          <TabsTrigger value="graphs">Graphs</TabsTrigger>
        </TabsList>
        <TabsContent value="inspector" className="space-y-4">
          <div>
            <div className="grid gap-4 grid-cols-2">
              {side == "left" && (
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Card className="h-[45vh] flex justify-center items-center">
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
                    </Card>
                  </CardContent>
                </Card>
              )}
              <div className="flex flex-col justify-center items-center gap-4 w-full col-span-1">
                <Card className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average Coral
                    </CardTitle>
                    <Tally5 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex justify-between">
                      {aggregation?.avgTotalCoral} Coral{" "}
                      {Math.sign(statsDifference.avgTotalCoral) == 1 ? (
                        <>
                          {" "}
                          <span className="text-green-500 underline text-[1.2rem]">
                            +{statsDifference.avgTotalCoral}
                          </span>
                        </>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {aggregation?.totalCoral} coral across{" "}
                      {aggregation?.matchCount} matches.
                    </p>
                  </CardContent>
                </Card>
                <Card className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average Auto Coral
                    </CardTitle>
                    <IconRobot className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex justify-between">
                      {aggregation?.avgAutoCoral} Coral
                      {Math.sign(statsDifference.avgAutoCoral) == 1 ? (
                        <>
                          {" "}
                          <span className="text-green-500 underline text-[1.2rem]">
                            +{statsDifference.avgAutoCoral}
                          </span>
                        </>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {aggregation?.totalAutoCoral} coral across{" "}
                      {aggregation?.matchCount} matches.
                    </p>
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
                      {Math.sign(statsDifference.criticalCount) == 1 ? (
                        <>
                          {" "}
                          <span className="text-red-500 underline text-[1.2rem]">
                            +{statsDifference.criticalCount}
                          </span>
                        </>
                      ) : null}
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
                      {Math.sign(statsDifference.avgRP) == 1 ? (
                        <>
                          {" "}
                          <span className="text-green-500 underline text-[1.2rem]">
                            +{statsDifference.avgRP}
                          </span>
                        </>
                      ) : null}
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
                      {Math.sign(statsDifference.teamOPR) == 1 ? (
                        <>
                          {" "}
                          <span className="text-green-500 underline text-[1.2rem]">
                            +{Number.parseFloat(opr).toFixed(2)}
                          </span>
                        </>
                      ) : null}
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
                    <Card className="h-[45vh] flex justify-center items-center">
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
                    </Card>
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
                  <CardContent className="h-[45vh]">
                    <ScrollArea className="h-[45vh] w-full">
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
                              className={cn("text-background dark:text-white")}
                            >
                              {item.value}
                              {Math.sign(statsDifference[item.statKey]) == 1 ? (
                                <>
                                  {" "}
                                  <span className="text-green-500 underline text-[1rem]">
                                    +{statsDifference[item.statKey]}
                                  </span>
                                </>
                              ) : null}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
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
                  <CardContent className="h-[45vh]">
                    <ScrollArea className="h-[45vh] w-full">
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
                              className={cn("text-background dark:text-white")}
                            >
                              {item.value}
                              {Math.sign(statsDifference[item.statKey]) == 1 ? (
                                <>
                                  {" "}
                                  <span className="text-green-500 underline text-[1rem]">
                                    +{statsDifference[item.statKey]}
                                  </span>
                                </>
                              ) : null}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
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
          <SelectionPitFormView
            pitFormData={pitForm}
            aggregationData={aggregation}
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
