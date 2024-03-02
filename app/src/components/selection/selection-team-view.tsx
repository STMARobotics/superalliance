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
  Route,
  Tally5,
  XCircle,
} from "lucide-react";
import SelectionCriticals from "./selection-view-criticals";
import { toast } from "sonner";
import { IconRobot } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import SelectionPitFormView from "./selection-pit-form-view";
import TeamMatchGraph from "../graphs/team-match-graph";
import SelectionMiddleNotesPath from "./selection-middle-notes-path";

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
        {aggregationData?.Criticals.length > 0 && (
          <SelectionCriticals
            criticals={aggregationData?.Criticals?.sort(
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
  setMiddleNotesOpened,
}: {
  aggregationData: any;
  pitFormData: any;
  setMainOpened: any;
  setSelectedTeam: any;
  setFormsOpened: any;
  setImageOpened: any;
  setCriticalsOpened: any;
  setMiddleNotesOpened: any;
}) => {
  const averages = [
    { label: "Average Score", value: aggregationData?.avgScore },
    { label: "Average Auto Score", value: aggregationData?.AVGAutoScore },
    { label: "Average Tele Score", value: aggregationData?.AVGTeleScore },
    { label: "Average RP", value: aggregationData?.avgRP },
    { label: "Total Crits", value: aggregationData?.TotalCrits },
    { label: "Win Percentage", value: aggregationData?.WinPCT },
    { label: "Average Auto Amp", value: aggregationData?.avgAutoAmp },
    { label: "Average Auto Speaker", value: aggregationData?.avgAutoSpeaker },
    { label: "Average Tele Amp", value: aggregationData?.avgTeleAmp },
    { label: "Average Tele Speaker", value: aggregationData?.avgTeleSpeaker },
    { label: "Average Times Amped", value: aggregationData?.AvgTimesAmped },
    { label: "Average Trap Notes", value: aggregationData?.AvgTrapNotes },
    { label: "Average Under Stage", value: aggregationData?.AvgUnderStage },
    { label: "Onstage Percentage", value: aggregationData?.onstagePCT },
    { label: "Leave Percentage", value: aggregationData?.leavePCT },
    { label: "Park Percentage", value: aggregationData?.parkPCT },
    { label: "Stockpile Percentage", value: aggregationData?.StockpilePCT },
    {
      label: "Self Spotlight Percentage",
      value: aggregationData?.SelfSpotlightPCT,
    },
    { label: "Defense Percentage", value: aggregationData?.DefensePCT },
    {
      label: "Defense Against Percentage",
      value: aggregationData?.DefenseAgainstPCT,
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
                    {aggregationData?.avgScore} Points
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {aggregationData?.totalScore} points across{" "}
                    {aggregationData?.Matches} matches.
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
                    {aggregationData?.AVGAutoScore} Points
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {aggregationData?.totalAutoScore} points across{" "}
                    {aggregationData?.Matches} matches.
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
                    {aggregationData?.TotalCrits}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Broke a Mechanism{" "}
                    {
                      aggregationData?.Criticals.filter(
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
                  <div className="flex items-center gap-12 flex-col h-[45vh] justify-center">
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
                          aggregationData?.middleNotes.length == 0
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
                        if (aggregationData?.Criticals.length == 0)
                          return toast.error("No Criticals Found!");
                        setCriticalsOpened(true);
                      }}
                      className="w-full h-14 text-lg font-bold"
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
          <h1 className="text-xl font-extrabold tracking-tight lg:text-xl text-center">
            Match Graphs - Tele Score
          </h1>
          {aggregationData?.matchTotalScore?.length !== 0 ? (
            <TeamMatchGraph
              data={aggregationData?.matchTeleScore?.sort(
                (a: any, b: any) => a.matchNumber - b.matchNumber
              )}
              statistic="Tele Score"
            />
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
