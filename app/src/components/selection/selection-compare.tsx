import { Modal, NumberInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getPitFormByTeam } from "@/lib/superallianceapi";
import SelectionCompareView from "./selection-compare-view";

const round = (num: number, digits: number = 1) => {
  const factor = 100 ** digits;
  return Math.round(num * factor) / factor;
};

const SelectionCompare = ({
  compareMode,
  setCompareMode,
  aggregation,
  teams,
}: {
  compareMode: boolean;
  setCompareMode: (compareMode: boolean) => void;
  aggregation: any;
  teams: any;
}) => {
  const [leftTeam, setLeftTeam] = useState<any>();
  const [rightTeam, setRightTeam] = useState<any>();
  const [compareData, setCompareData] = useState<any>();
  const [pitFormData, setPitFormData] = useState<any>();
  const [statsDifference, setStatsDifference] = useState<any>();

  const [compareSelectVisible, setCompareSelectVisible] = useState(false);

  useEffect(() => {
    if (compareMode) {
      setCompareSelectVisible(true);
    }
  }, [compareMode]);

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
      setCompareData(aggregationStruct);
      const pitStruct = {
        left: await getPitFormByTeam(leftTeam).catch(() => null),
        right: await getPitFormByTeam(rightTeam).catch(() => null),
      };
      setPitFormData(pitStruct);
    })();
  };

  useEffect(() => {
    if (!compareData) return;
    const stats = [
      "avgTotalScore",
      "avgAutoScore",
      "avgTeleScore",
      "avgRP",
      "criticalCount",
      "winPercentage",
      "avgAutoAmpsNotes",
      "avgAutoSpeakersNotes",
      "avgTeleAmpsNotes",
      "avgTeleSpeakersNotes",
      "avgTeleAmplifiedSpeakersNotes",
      "avgTeleTrapsNotes",
      "leavePercentage",
      "parkPercentage",
      "onstagePercentage",
      "onstageSpotlitPercentage",
      "harmonyPercentage",
      "selfSpotlitPercentage",
      "defensePercentage",
      "defendedAgainstPercentage",
      "stockpilePercentage",
      "underStagePercentage",
    ];

    const data = {
      left: stats.reduce(function (map: any, stat: any) {
        map[stat] = round(compareData?.left[stat] - compareData?.right[stat]);
        return map;
      }, {}),
      right: stats.reduce(function (map: any, stat: any) {
        map[stat] = round(compareData?.right[stat] - compareData?.left[stat]);
        return map;
      }, {}),
    };
    setStatsDifference(data);
  }, [compareData]);

  return (
    <>
      {compareMode && (
        <>
          <Modal
            opened={compareSelectVisible}
            onClose={() => {
              setCompareSelectVisible(false);
              setCompareMode(false);
            }}
            title="Team Comparison"
            size={"xl"}
            radius={"lg"}
            styles={{
              body: {
                backgroundColor: "var(--mantine-color-dark-7)",
              },
              header: {
                backgroundColor: "var(--mantine-color-dark-7)",
              },
            }}
          >
            <div className="flex flex-row gap-4 justify-center items-center w-full pb-4">
              <NumberInput
                label="Left Team Number"
                placeholder="1234"
                className="w-full"
                allowDecimal={false}
                allowNegative={false}
                hideControls
                maxLength={4}
                inputMode="numeric"
                onChange={setLeftTeam}
                value={leftTeam}
              />
              <NumberInput
                label="Right Team Number"
                placeholder="1234"
                className="w-full"
                allowDecimal={false}
                allowNegative={false}
                hideControls
                maxLength={4}
                inputMode="numeric"
                onChange={setRightTeam}
                value={rightTeam}
              />
            </div>
            <div className="flex items-center justify-center">
              <Button onClick={handleSubmit}>Compare Teams</Button>
            </div>
          </Modal>
        </>
      )}
      <Modal
        opened={compareData}
        onClose={() => {
          setCompareData(null);
          setPitFormData(null);
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
            {compareData?.left && pitFormData?.left && statsDifference && (
              <>
                <SelectionCompareView
                  aggregation={compareData.left}
                  pitForm={pitFormData.left}
                  teams={teams}
                  statsDifference={statsDifference.left}
                  side={"left"}
                />
              </>
            )}
          </div>
          <div className="w-[50%] px-4">
            {compareData?.right && pitFormData?.right && statsDifference && (
              <>
                <SelectionCompareView
                  aggregation={compareData.right}
                  pitForm={pitFormData.right}
                  teams={teams}
                  statsDifference={statsDifference.right}
                  side={"right"}
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
