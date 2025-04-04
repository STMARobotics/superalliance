import { Modal } from "@mantine/core";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getPitFormByTeam, getOPRData } from "@/lib/superallianceapi";
import SelectionCompareView from "./selection-compare-view";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";

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
}: {
  compareMode?: boolean;
  setCompareMode: (compareMode: boolean) => void;
  aggregation: any;
  teams: any;
  leftTeam: any;
  rightTeam: any;
  setLeftTeam: (leftTeam: any) => void;
  setRightTeam: (rightTeam: any) => void;
}) => {
  const [compareData, setCompareData] = useState<any>();
  const [pitFormData, setPitFormData] = useState<any>();
  const [statsDifference, setStatsDifference] = useState<any>();
  const [opr, setOPRData] = useState<any>();
  const { appSettings } = useSuperAlliance();

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
      "avgTotalCoral",
      "avgAutoCoral",
      "avgTeleCoral",
      "avgTotalScore",
      "avgAutoScore",
      "avgTeleScore",
      "avgRP",
      "criticalCount",
      "winPercentage",
      "avgTotalAlgae",
      "avgProcessedAlgae",
      "avgNetAlgae",
      "leavePercentage",
      "parkPercentage",
      "shallowClimbPercentage",
      "deepClimbPercentage",
      "defensePercentage",
      "defendedAgainstPercentage",
    ];

    const data = {
      left: stats.reduce(function (map: any, stat: any) {
        map[stat] = round(compareData?.left[stat] - compareData?.right[stat]);
        map["teamOPR"] = round(opr?.left - opr?.right);
        return map;
      }, {}),
      right: stats.reduce(function (map: any, stat: any) {
        map[stat] = round(compareData?.right[stat] - compareData?.left[stat]);
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
          setCompareMode(false);
        }}
        title="Team Comparison"
        fullScreen
        withCloseButton={true}
        zIndex={1000}
        radius={"lg"}
        styles={{
          body: {
            width: "100vw",
          },
        }}
      >
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
