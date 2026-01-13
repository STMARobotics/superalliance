import { UniqueIdentifier } from "@dnd-kit/core";
import { Modal, Image, Drawer } from "@mantine/core";
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
  Tally5,
  XCircle,
} from "lucide-react";
import SelectionCriticals from "@/components/selection/selection-view-criticals";
import { toast } from "sonner";
import { IconRobot } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { cn, getRobotType } from "@/lib/utils";
import PitFormView from "../pit-form-view";
import TeamMatchGraph from "@/components/graphs/team-match-graph";
import SelectionComments from "@/components/selection/selection-view-comments";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";
import { useSuperAllianceApi } from "@/lib/superallianceapi";

const SelectionTeamView = ({
  teams,
  aggregationData,
  setSelectedTeam,
  pitFormData,
  setFormsOpened,
}: {
  teams: any;
  aggregationData: any;
  setSelectedTeam: (teamId: UniqueIdentifier) => void;
  pitFormData: any;
  setFormsOpened: any;
}) => {
  const [mainOpened, setMainOpened] = useState(false);
  const [imageOpened, setImageOpened] = useState(false);
  const [criticalsOpened, setCriticalsOpened] = useState(false);
  const [commentsOpened, setCommentsOpened] = useState(false);
  const [eventTeamRank, setEventTeamRank] = useState(false);
  const { appSettings } = useSuperAlliance();
  const { getEventTeamRank } = useSuperAllianceApi();

  useEffect(() => {
    if (aggregationData) return setMainOpened(true);
  }, [aggregationData]);

  useEffect(() => {
    (async function() {
      const data = await getEventTeamRank(
        appSettings.event,
        aggregationData._id
      );
      setEventTeamRank(data);
    })();
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
          teams={teams}
          aggregationData={aggregationData}
          rank={eventTeamRank}
          pitFormData={pitFormData}
          setMainOpened={setMainOpened}
          setSelectedTeam={setSelectedTeam}
          setFormsOpened={setFormsOpened}
          setImageOpened={setImageOpened}
          setCriticalsOpened={setCriticalsOpened}
          setCommentsOpened={setCommentsOpened}
          appSettings={appSettings}
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
        <Card className="h-[85vh] w-[85vw] flex justify-center items-center">
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
        size={"md"}
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
            selectedEvent={appSettings?.event}
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
            selectedEvent={appSettings?.event}
            comments={aggregationData?.comments?.sort(
              (a: any, b: any) => a.matchNumber - b.matchNumber
            )}
          />
        )}
      </Drawer>
    </>
  );
};

export const DataDisplay = ({
  teams,
  aggregationData,
  rank,
  pitFormData,
  setMainOpened,
  setSelectedTeam,
  setFormsOpened,
  setImageOpened,
  setCriticalsOpened,
  setCommentsOpened,
  appSettings,
}: {
  teams: any;
  aggregationData: any;
  rank: any;
  pitFormData: any;
  setMainOpened: any;
  setSelectedTeam: any;
  setFormsOpened: any;
  setImageOpened: any;
  setCriticalsOpened: any;
  setCommentsOpened: any;
  appSettings: any;
}) => {
  const averages = [
    { label: "Avg Total Fuel", value: aggregationData?.avgTotalFuel },
    { label: "Avg Auto Fuel", value: aggregationData?.avgAutoFuel },
    { label: "Avg Tele Fuel", value: aggregationData?.avgTeleFuel },
    { label: "Avg Total Score", value: aggregationData?.avgTotalScore },
    { label: "Avg Auto Score", value: aggregationData?.avgAutoScore },
    { label: "Avg Tele Score", value: aggregationData?.avgTeleScore },
    { label: "Avg RP", value: aggregationData?.avgRP },
    { label: "Total Crits", value: aggregationData?.criticalCount },
    { label: "Win Rate", value: aggregationData?.winPercentage + "%" },
    { label: "Auto Rate", value: aggregationData?.autoPercentage + "%" },
    { label: "Bump Rate", value: aggregationData?.bumpPercentage + "%" },
    { label: "Trench Rate", value: aggregationData?.trenchPercentage + "%" },
    { label: "Left Climb L1 Rate", value: aggregationData?.leftClimbLevelOnePercentage + "%" },
    { label: "Center Climb L1 Rate", value: aggregationData?.centerClimbLevelOnePercentage + "%" },
    { label: "Right Climb L1 Rate", value: aggregationData?.rightClimbLevelOnePercentage + "%" },
    { label: "Left Climb L2 Rate", value: aggregationData?.leftClimbLevelTwoPercentage + "%" },
    { label: "Center Climb L2 Rate", value: aggregationData?.centerClimbLevelTwoPercentage + "%" },
    { label: "Right Climb L2 Rate", value: aggregationData?.rightClimbLevelTwoPercentage + "%" },
    { label: "Left Climb L3 Rate", value: aggregationData?.leftClimbLevelThreePercentage + "%" },
    { label: "Center Climb L3 Rate", value: aggregationData?.centerClimbLevelThreePercentage + "%" },
    { label: "Right Climb L3 Rate", value: aggregationData?.rightClimbLevelThreePercentage + "%" },
    { label: "Shuttle Rate", value: aggregationData?.shuttlePercentage > 0 ? "Yes" : "No" },
    { label: "Move and Shoot?", value: aggregationData?.moveWhileShootPercentage > 0 ? "Yes" : "No" },
    { label: "Defense Rate", value: aggregationData?.defensePercentage + "%" },
    {
      label: "Defended Rate",
      value: aggregationData?.defendedAgainstPercentage + "%",
    },
    { label: "Pit Rating", value: pitFormData?.pitRating + "/10"},
    { label: "Robot Rating", value: pitFormData?.robotRating + "/5"},
  ];

  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between space-y-2 mb-3">
        <h2 className="text-3xl font-bold tracking-tight">
          Inspecting Team #{aggregationData?._id} -{" "}
          {
            teams.filter(
              (team: any) => team.teamNumber == aggregationData?._id
            )[0].teamName
          }
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
                    Average Total Fuel
                  </CardTitle>
                  <Tally5 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {aggregationData?.avgTotalFuel} Fuel
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {aggregationData?.totalFuel} fuel across{" "}
                    {aggregationData?.matchCount} matches.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Robot Type
                  </CardTitle>
                  <IconRobot className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {getRobotType(aggregationData)[0]}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {getRobotType(aggregationData)[1]}
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
              {appSettings?.event !== "none" ? (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Event Rank
                    </CardTitle>
                    <Medal className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      Rank # {rank}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Rank{" "}
                      {rank + " "}
                      /{" " + teams.length}
                    </p>
                  </CardContent>
                </Card>
              ) : (
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
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 pt-4">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Image</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
              <Card className="col-span-3 md:col-span-2">
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
          <PitFormView
            pitFormData={pitFormData}
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
