import { UniqueIdentifier } from "@dnd-kit/core";
import { Modal, Image, ScrollArea, Drawer } from "@mantine/core";
import { useEffect, useState } from "react";
import { TabsContent, TabsTrigger, Tabs, TabsList } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertCircle,
  BadgeIcon,
  ClipboardCopy,
  ClipboardList,
  ImageIcon,
  Medal,
  MessageCircleMore,
  Route,
  Tally5,
  XCircle,
} from "lucide-react";
import SelectionCriticals from "@/components/selection/selection-view-criticals";
import { toast } from "sonner";
import { IconRobot } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import SelectionPitFormView from "@/components/selection/selection-pit-form-view";
import TeamMatchGraph from "@/components/graphs/team-match-graph";
import SelectionMiddleNotesPath from "@/components/selection/selection-middle-notes-path";
import SelectionComments from "@/components/selection/selection-view-comments";

const SelectionTeamView = ({
  aggregationData,
  setSelectedTeam,
  pitFormData,
  setFormsOpened,
}: {
  aggregationData: any;
  setSelectedTeam: (teamId: UniqueIdentifier) => void;
  pitFormData: any;
  setFormsOpened: any;
}) => {
  const [mainOpened, setMainOpened] = useState(false);
  const [imageOpened, setImageOpened] = useState(false);
  const [criticalsOpened, setCriticalsOpened] = useState(false);
  const [commentsOpened, setCommentsOpened] = useState(false);
  const [middleNotesOpened, setMiddleNotesOpened] = useState(false);

  useEffect(() => {
    if (aggregationData) return setMainOpened(true);
  }, [aggregationData]);

  return (
    <>
      <Modal
        classNames={{
          content: "bg-[#18181b]",
          header: "bg-[#18181b]",
        }}
        opened={mainOpened}
        withCloseButton={false}
        radius={"lg"}
        size={"auto"}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        centered
        onClose={() => {
          setMainOpened(false);
          setSelectedTeam("");
        }}
      >
        <DataDisplay
          aggregationData={aggregationData}
          pitFormData={pitFormData}
          setMainOpened={setMainOpened}
          setSelectedTeam={setSelectedTeam}
          setFormsOpened={setFormsOpened}
          setImageOpened={setImageOpened}
          setCriticalsOpened={setCriticalsOpened}
          setCommentsOpened={setCommentsOpened}
          setMiddleNotesOpened={setMiddleNotesOpened}
        />
      </Modal>
      <Modal
        classNames={{
          content: "bg-[#18181b]",
          header: "bg-[#18181b]",
        }}
        opened={imageOpened}
        withCloseButton={false}
        onClose={() => setImageOpened(false)}
        radius={"lg"}
        size={"auto"}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        centered
      >
        <Card className="h-[85vh] w-[85vw]">
          {pitFormData?.robotImage ? (
            <Image
              fit="contain"
              radius={"md"}
              mah={"100%"}
              src={`${pitFormData?.robotImage}`}
            />
          ) : (
            <div className="flex justify-center items-center h-full">
              <h1 className="text-3xl font-bold tracking-tight text-center">
                No Image Found!
              </h1>
            </div>
          )}
        </Card>
      </Modal>
      <Drawer
        classNames={{
          content: "bg-[#18181b]",
          header: "bg-[#18181b]",
        }}
        opened={criticalsOpened}
        withCloseButton={true}
        title={"Criticals"}
        onClose={() => setCriticalsOpened(false)}
        radius={"md"}
        position="right"
        size={"auto"}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        {aggregationData?.criticals.length > 0 && (
          <SelectionCriticals
            criticals={aggregationData?.criticals?.sort(
              (a: any, b: any) => a.matchNumber - b.matchNumber
            )}
          />
        )}
      </Drawer>
      <Drawer
        classNames={{
          content: "bg-[#18181b]",
          header: "bg-[#18181b]",
        }}
        opened={commentsOpened}
        withCloseButton={true}
        title={"Comments"}
        onClose={() => setCommentsOpened(false)}
        radius={"md"}
        position="right"
        size={"md"}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        {aggregationData?.comments.length > 0 && (
          <SelectionComments
            comments={aggregationData?.comments?.sort(
              (a: any, b: any) => a.matchNumber - b.matchNumber
            )}
          />
        )}
      </Drawer>
      <Drawer
        classNames={{
          content: "bg-[#18181b]",
          header: "bg-[#18181b]",
        }}
        opened={middleNotesOpened}
        withCloseButton={true}
        title={"Middle Notes Path"}
        onClose={() => setMiddleNotesOpened(false)}
        radius={"md"}
        position="right"
        size={"auto"}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        {aggregationData?.middleNotes.length > 0 && (
          <SelectionMiddleNotesPath
            middleNotes={aggregationData?.middleNotes?.sort(
              (a: any, b: any) => a.matchNumber - b.matchNumber
            )}
            alliance="red"
          />
        )}
      </Drawer>
    </>
  );
};

const DataDisplay = ({
  aggregationData,
  pitFormData,
  setMainOpened,
  setSelectedTeam,
  setFormsOpened,
  setImageOpened,
  setCriticalsOpened,
  setCommentsOpened,
  setMiddleNotesOpened,
}: {
  aggregationData: any;
  pitFormData: any;
  setMainOpened: any;
  setSelectedTeam: any;
  setFormsOpened: any;
  setImageOpened: any;
  setCriticalsOpened: any;
  setCommentsOpened: any;
  setMiddleNotesOpened: any;
}) => {
  const averages = [
    { label: "Total Score", value: aggregationData?.totalScore },
    { label: "Total Auto Score", value: aggregationData?.totalAutoScore },
    { label: "Total Tele Score", value: aggregationData?.totalTeleScore },
    { label: "Average Total Score", value: aggregationData?.avgTotalScore },
    { label: "Average Auto Score", value: aggregationData?.avgAutoScore },
    { label: "Average Tele Score", value: aggregationData?.avgTeleScore },
    { label: "Average RP", value: aggregationData?.avgRP },
    { label: "Total Crits", value: aggregationData?.criticalCount },
    { label: "Win Percentage", value: aggregationData?.winPercentage },
    {
      label: "Average Auto Amps Score",
      value: aggregationData?.avgAutoAmpsNotes,
    },
    {
      label: "Average Auto Speakers Score",
      value: aggregationData?.avgAutoSpeakersNotes,
    },
    {
      label: "Average Tele Amps Score",
      value: aggregationData?.avgTeleAmpsNotes,
    },
    {
      label: "Average Tele Speakers Score",
      value: aggregationData?.avgTeleSpeakersNotes,
    },
    {
      label: "Average Tele Amplified Speakers Score",
      value: aggregationData?.avgTeleAmplifiedSpeakersNotes,
    },
    {
      label: "Average Tele Traps Score",
      value: aggregationData?.avgTeleTrapsNotes,
    },
    { label: "Leave Percentage", value: aggregationData?.leavePercentage },
    { label: "Park Percentage", value: aggregationData?.parkPercentage },
    { label: "Onstage Percentage", value: aggregationData?.onstagePercentage },
    {
      label: "Onstage Spotlit Percentage",
      value: aggregationData?.onstageSpotlitPercentage,
    },
    { label: "Harmony Percentage", value: aggregationData?.harmonyPercentage },
    {
      label: "Self Spotlit Percentage",
      value: aggregationData?.selfSpotlitPercentage,
    },
    { label: "Defense Percentage", value: aggregationData?.defensePercentage },
    {
      label: "Defended Against Percentage",
      value: aggregationData?.defendedAgainstPercentage,
    },
    {
      label: "Stockpile Percentage",
      value: aggregationData?.stockpilePercentage,
    },
    {
      label: "Under Stage Percentage",
      value: aggregationData?.underStagePercentage,
    },
  ];

  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between space-y-2 mb-3">
        <h2 className="text-3xl font-bold tracking-tight">
          Inspecting Team #{aggregationData?._id}
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => {
              setMainOpened(false);
              setSelectedTeam("");
            }}
          >
            Close
          </Button>
        </div>
      </div>
      <Tabs defaultValue="inspector" className="space-y-4 w-[85vw]">
        <TabsList>
          <TabsTrigger value="inspector">Inspector</TabsTrigger>
          <TabsTrigger value="pitform">Pit Form</TabsTrigger>
          <TabsTrigger value="graphs">Graphs</TabsTrigger>
        </TabsList>
        <TabsContent
          value="inspector"
          className="space-y-4 w-[calc(100%-1rem)] h-[72vh]"
        >
          <div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Score
                  </CardTitle>
                  <Tally5 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {aggregationData?.avgTotalScore} Points
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {aggregationData?.totalScore} points across{" "}
                    {aggregationData?.matchCount} matches.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Auto Score
                  </CardTitle>
                  <IconRobot className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {aggregationData?.avgAutoScore} Points
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {aggregationData?.totalAutoScore} points across{" "}
                    {aggregationData?.matchCount} matches.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Criticals
                  </CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {aggregationData?.criticalCount}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Broke a Mechanism{" "}
                    {
                      aggregationData?.criticals.filter(
                        ({ criticals }: { criticals: any }) =>
                          criticals.includes("Mechanism Broke")
                      ).length
                    }{" "}
                    times
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Ranking Points
                  </CardTitle>
                  <Medal className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {aggregationData?.avgRP} Points
                  </div>
                  <p className="text-xs text-muted-foreground">
                    (Placeholder for ranking in event)
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 pt-4">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <Card className="h-[45vh] flex justify-center items-center">
                    {pitFormData?.robotImage ? (
                      <Image
                        fit="contain"
                        radius={"md"}
                        mah={"100%"}
                        src={`${pitFormData?.robotImage}`}
                      />
                    ) : (
                      <div className="flex justify-center flex-col gap-5 items-center h-full">
                        <h1 className="text-3xl font-bold tracking-tight text-center">
                          No Image Found!
                        </h1>
                        <Button
                          className="text-lg"
                          onClick={() => navigate("/new/pit")}
                        >
                          <ClipboardCopy className="mr-2 h-6 w-6" />
                          Submit Pit Form
                        </Button>
                      </div>
                    )}
                  </Card>
                </CardContent>
              </Card>
              <Card className="col-span-3 md:col-span-2">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
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
                          <BadgeIcon className="mr-2 h-4 w-4" />
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
              <Card className="col-span-3 md:col-span-2">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-7 flex-col h-[45vh] justify-center">
                    <Button
                      onClick={() => {
                        if (!pitFormData?.robotImage)
                          return toast.error("No Image Found!");
                        setImageOpened(true);
                      }}
                      className="w-full h-14 text-lg font-bold"
                    >
                      <ImageIcon className="mr-2 h-6 w-6" />
                      View Image
                    </Button>
                    <Button
                      onClick={() => {
                        console.log(aggregationData?.comments);
                        if (aggregationData?.comments.length == 0)
                          return toast.error("No Comments Found!");
                        setCommentsOpened(true);
                      }}
                      className="w-full h-14 text-lg font-bold"
                    >
                      <MessageCircleMore className="mr-2 h-6 w-6" />
                      View Comments
                    </Button>
                    <Button
                      onClick={() => setFormsOpened(true)}
                      className="w-full h-14 text-lg font-bold"
                    >
                      <ClipboardList className="mr-2 h-6 w-6" />
                      View Forms
                    </Button>
                    <Button
                      onClick={() => {
                        if (
                          !aggregationData?.middleNotes ||
                          aggregationData?.middleNotes?.length == 0
                        )
                          return toast.error("No Middle Note Data Found!");
                        setMiddleNotesOpened(true);
                      }}
                      className="w-full h-14 text-lg font-bold"
                    >
                      <Route className="mr-2 h-6 w-6" />
                      View Auto Middle Path
                    </Button>
                    <Button
                      onClick={() => {
                        if (aggregationData?.criticals.length == 0)
                          return toast.error("No Criticals Found!");
                        setCriticalsOpened(true);
                      }}
                      className="w-full h-14 text-lg font-bold bg-red-500 hover:bg-red-700 text-white"
                    >
                      <XCircle className="mr-2 h-6 w-6" />
                      View Criticals
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent
          value="pitform"
          className="space-y-4 w-[calc(100%-1rem)] h-[72vh]"
        >
          <SelectionPitFormView
            pitFormData={pitFormData}
            aggregationData={aggregationData}
          />
        </TabsContent>
        <TabsContent
          value="graphs"
          className="space-y-4 w-[calc(100%-1rem)] h-[72vh]"
        >
          {aggregationData?.length !== 0 ? (
            <TeamMatchGraph aggregation={aggregationData} />
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

export default SelectionTeamView;
