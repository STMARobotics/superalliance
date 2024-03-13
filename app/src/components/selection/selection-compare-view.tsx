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
  Route,
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
}: {
  aggregation: any;
  pitForm: any;
  teams: any;
  statsDifference: any;
  side: any;
}) => {
  const averages = [
    { label: "Average Total Score", value: aggregation?.avgTotalScore },
    { label: "Average Auto Score", value: aggregation?.avgAutoScore },
    { label: "Average Tele Score", value: aggregation?.avgTeleScore },
    { label: "Average RP", value: aggregation?.avgRP },
    { label: "Total Crits", value: aggregation?.criticalCount },
    { label: "Win Percentage", value: aggregation?.winPercentage },
    {
      label: "Average Auto Amps Score",
      value: aggregation?.avgAutoAmpsNotes,
    },
    {
      label: "Average Auto Speakers Score",
      value: aggregation?.avgAutoSpeakersNotes,
    },
    {
      label: "Average Tele Amps Score",
      value: aggregation?.avgTeleAmpsNotes,
    },
    {
      label: "Average Tele Speakers Score",
      value: aggregation?.avgTeleSpeakersNotes,
    },
    {
      label: "Average Tele Amplified Speakers Score",
      value: aggregation?.avgTeleAmplifiedSpeakersNotes,
    },
    {
      label: "Average Tele Traps Score",
      value: aggregation?.avgTeleTrapsNotes,
    },
    { label: "Leave Percentage", value: aggregation?.leavePercentage },
    { label: "Park Percentage", value: aggregation?.parkPercentage },
    { label: "Onstage Percentage", value: aggregation?.onstagePercentage },
    {
      label: "Onstage Spotlit Percentage",
      value: aggregation?.onstageSpotlitPercentage,
    },
    { label: "Harmony Percentage", value: aggregation?.harmonyPercentage },
    {
      label: "Self Spotlit Percentage",
      value: aggregation?.selfSpotlitPercentage,
    },
    { label: "Defense Percentage", value: aggregation?.defensePercentage },
    {
      label: "Defended Against Percentage",
      value: aggregation?.defendedAgainstPercentage,
    },
    {
      label: "Stockpile Percentage",
      value: aggregation?.stockpilePercentage,
    },
    {
      label: "Under Stage Percentage",
      value: aggregation?.underStagePercentage,
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
                      Average Score
                    </CardTitle>
                    <Tally5 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex justify-between">
                      {aggregation?.avgTotalScore} Points{" "}
                      {Math.sign(statsDifference.avgTotalScore) == 1 ? (
                        <>
                          {" "}
                          <span className="text-green-500 underline text-[1.2rem]">
                            +{statsDifference.avgTotalScore}
                          </span>
                        </>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {aggregation?.totalScore} points across{" "}
                      {aggregation?.matchCount} matches.
                    </p>
                  </CardContent>
                </Card>
                <Card className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average Auto Score
                    </CardTitle>
                    <IconRobot className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex justify-between">
                      {aggregation?.avgAutoScore} Points
                      {Math.sign(statsDifference.avgAutoScore) == 1 ? (
                        <>
                          {" "}
                          <span className="text-green-500 underline text-[1.2rem]">
                            +{statsDifference.avgAutoScore}
                          </span>
                        </>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {aggregation?.totalAutoScore} points across{" "}
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
                        if (
                          !aggregation?.middleNotes ||
                          aggregation?.middleNotes?.length == 0
                        )
                          return toast.error("No Middle Note Data Found!");
                        // setMiddleNotesOpened(true);
                      }}
                      className="w-full h-14 text-lg font-bold"
                    >
                      <Route className="mr-2 h-6 w-6" />
                      View Auto Middle Path
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
