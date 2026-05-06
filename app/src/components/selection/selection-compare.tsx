import { Modal } from "@mantine/core";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSuperAllianceApi } from "@/lib/superallianceapi";
import SelectionCompareView from "./selection-compare-view";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select } from "@mantine/core";

const compareTabs = ["inspector", "pitform", "graphs"] as const;
type CompareTab = (typeof compareTabs)[number];

const round = (num: number, digits: number = 1) => {
  const factor = 100 ** digits;
  return Math.round(num * factor) / factor;
};

const SelectionCompare = ({
  setCompareMode,
  aggregation,
  teams,
  leftTeam,
  rightTeam,
  setLeftTeam,
  setRightTeam,
  moveTeamToColumn,
}: {
  compareMode?: boolean;
  setCompareMode: (compareMode: boolean) => void;
  aggregation: any;
  teams: any;
  leftTeam: any;
  rightTeam: any;
  setLeftTeam: (leftTeam: any) => void;
  setRightTeam: (rightTeam: any) => void;
  moveTeamToColumn?: (teamId: string, columnId: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState<CompareTab>("inspector");
  const [selectedGraphMetric, setSelectedGraphMetric] = useState("matchTotalFuel");
  const [compareData, setCompareData] = useState<any>();
  const [pitFormData, setPitFormData] = useState<any>();
  const [statsDifference, setStatsDifference] = useState<any>();
  const [opr, setOPRData] = useState<any>();
  const { appSettings } = useSuperAlliance();
  const { getPitFormByTeam, getOPRData } = useSuperAllianceApi();

  const handleTabChange = (value: string) => {
    if (compareTabs.includes(value as CompareTab)) {
      setActiveTab(value as CompareTab);
    }
  };

  const graphMetricOptions = [
    { value: "matchTotalFuel", label: "Total Fuel" },
    { value: "matchAutoFuel", label: "Auto Fuel" },
    { value: "matchTeleFuel", label: "Teleop Fuel" },
    { value: "matchTotalScore", label: "Total Score" },
    { value: "matchAutoScore", label: "Auto Score" },
    { value: "matchTeleScore", label: "Teleop Score" },
    { value: "matchRP", label: "Ranking Points" },
  ];

  const getGraphScale = (metric: string) => {
    const leftScores = (compareData?.left?.[metric] ?? []).map((match: any) =>
      Number(match?.score)
    );
    const rightScores = (compareData?.right?.[metric] ?? []).map((match: any) =>
      Number(match?.score)
    );
    const allScores = [...leftScores, ...rightScores].filter((score) =>
      Number.isFinite(score)
    );

    const yMin = metric === "matchRP" ? -1 / 3 : 0;
    const yMax = allScores.length ? Math.max(1, ...allScores) : 1;

    return { yMin, yMax };
  };

  const sharedGraphScale = getGraphScale(selectedGraphMetric);

  const handleSubmit = () => {
    (async function () {
      if (!leftTeam || !rightTeam)
        return toast.error("Please enter both team numbers");
      const aggregationStruct = {
        left: aggregation.filter(
          (aggregation: any) => aggregation._id == Number(leftTeam)
        )[0],
        right: aggregation.filter(
          (aggregation: any) => aggregation._id == Number(rightTeam)
        )[0],
      };
      if (!aggregationStruct.left || !aggregationStruct.right)
        return toast.error("One or both of the teams do not exist");
      setCompareData(aggregationStruct);
      const pitStruct = {
        left: await getPitFormByTeam(appSettings.event, leftTeam).catch(() => null),
        right: await getPitFormByTeam(appSettings.event, rightTeam).catch(() => null),
      };
      setPitFormData(pitStruct);
      const oprStruct = {
        left: await getOPRData(appSettings.event, leftTeam).catch(() => console.log("error getting left")),
        right: await getOPRData(appSettings.event, rightTeam).catch(() => console.log("error getting right")),
      };
      setOPRData(oprStruct);
    })();
  };

  useEffect(() => {
    if (!leftTeam || !rightTeam) return;
    handleSubmit();
  }, [leftTeam, rightTeam]);

  useEffect(() => {
    if (!compareData) return;
    const stats = [
      "avgTotalFuel",
      "avgAutoFuel",
      "avgTeleFuel",
      "stdDevTotalFuel",
      "stdDevAutoFuel",
      "stdDevTeleFuel",
      "avgTotalScore",
      "avgAutoScore",
      "avgTeleScore",
      "avgRP",
      "criticalCount",
      "winPercentage",
      "autoPercentage",
      "bumpPercentage",
      "trenchPercentage",
      "leftClimbLevelOnePercentage",
      "centerClimbLevelOnePercentage",
      "rightClimbLevelOnePercentage",
      "leftClimbLevelTwoPercentage",
      "centerClimbLevelTwoPercentage",
      "rightClimbLevelTwoPercentage",
      "leftClimbLevelThreePercentage",
      "centerClimbLevelThreePercentage",
      "rightClimbLevelThreePercentage",
      "shuttlePercentage",
      "moveWhileShootPercentage",
      "defensePercentage",
      "defendedAgainstPercentage",
    ];

    const numericDiff = (a: any, b: any) => {
      if (typeof a !== "number" || typeof b !== "number") return null;
      return round(a - b);
    };

    const data = {
      left: stats.reduce(function (map: any, stat: any) {
        map[stat] = numericDiff(compareData?.left[stat], compareData?.right[stat]);
        map["teamOPR"] = round(opr?.left - opr?.right);
        return map;
      }, {}),
      right: stats.reduce(function (map: any, stat: any) {
        map[stat] = numericDiff(compareData?.right[stat], compareData?.left[stat]);
        map["teamOPR"] = round(opr?.right - opr?.left);
        return map;
      }, {}),
    };
    setStatsDifference(data);
  }, [compareData, opr]);

  return (
    <>
      <Modal
        opened={compareData}
        onClose={() => {
          setLeftTeam(null);
          setRightTeam(null);
          setCompareData(null);
          setPitFormData(null);
          setStatsDifference(null);
          setActiveTab("inspector");
          setSelectedGraphMetric("matchTotalFuel");
          setCompareMode(false);
        }}
        title="Team Comparison"
        fullScreen
        withCloseButton={false}
        zIndex={1000}
        radius={"lg"}
        styles={{
          body: {
            width: "100vw",
          },
        }}
      >
        <div className="flex justify-end mb-4">
          <Button
            onClick={() => {
              setLeftTeam(null);
              setRightTeam(null);
              setCompareData(null);
              setPitFormData(null);
              setStatsDifference(null);
              setActiveTab("inspector");
              setSelectedGraphMetric("matchTotalFuel");
              setCompareMode(false);
            }}
          >
            Close
          </Button>
        </div>
        <div className="flex justify-between items-center mb-4 px-4 gap-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-auto">
            <TabsList>
              <TabsTrigger value="inspector">Inspector</TabsTrigger>
              <TabsTrigger value="pitform">Pit Form</TabsTrigger>
              <TabsTrigger value="graphs">Graphs</TabsTrigger>
            </TabsList>
          </Tabs>
          {activeTab === "graphs" && (
            <Select
              className="w-52"
              data={graphMetricOptions}
              onChange={(value) => value && setSelectedGraphMetric(value)}
              value={selectedGraphMetric}
              allowDeselect={false}
              styles={{
                dropdown: {
                  zIndex: 10001,
                },
              }}
            />
          )}
        </div>
        <div className="flex flex-row py-2 w-full">
          <div className="w-[50%] px-4">
            {compareData?.left && statsDifference && (
              <>
                <SelectionCompareView
                  aggregation={compareData.left}
                  pitForm={pitFormData?.left}
                  teams={teams}
                  statsDifference={statsDifference.left}
                  side={"left"}
                  opr={opr?.left}
                  moveTeamToColumn={moveTeamToColumn}
                  activeTab={activeTab}
                  selectedGraphMetric={selectedGraphMetric}
                  sharedGraphScale={sharedGraphScale}
                />
              </>
            )}
          </div>
          <div className="w-[50%] px-4">
            {compareData?.right && statsDifference && (
              <>
                <SelectionCompareView
                  aggregation={compareData.right}
                  pitForm={pitFormData?.right}
                  teams={teams}
                  statsDifference={statsDifference.right}
                  side={"right"}
                  opr={opr?.right}
                  moveTeamToColumn={moveTeamToColumn}
                  activeTab={activeTab}
                  selectedGraphMetric={selectedGraphMetric}
                  sharedGraphScale={sharedGraphScale}
                />
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SelectionCompare;
