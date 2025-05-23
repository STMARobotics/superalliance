import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";
import { NumberInput, em } from "@mantine/core";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SelectionMiddleNotesPath from "@/components/selection/selection-middle-notes-path";
import { useMediaQuery } from "@mantine/hooks";

function DataMiddlePath() {
  const { selectedEvent, eventAggregation } =
    useSuperAlliance();

  const [inputTeam, setInputTeam] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<any>("");
  const [aggregationData, setAggregationData] = useState<any>();

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const handleClick = () => {
    setSelectedTeam(inputTeam);
  };

  useEffect(() => {
    if (!selectedTeam) return;
    const aggregation = eventAggregation.filter((team: any) => team._id == selectedTeam)
    if (!aggregation[0]) return;
    const aggregationData = aggregation[0];
    if (
      !aggregationData?.middleNotes ||
      aggregationData?.middleNotes?.length == 0
    ) {
      toast.error("No Middle Note Data Found!");
      setAggregationData([]);
    } else {
      setAggregationData(aggregationData);
    }
  }, [selectedTeam]);

  return (
    <div className="flex flex-col gap-4 items-center justify-center p-10">
      {selectedEvent && (
        <div className="flex flex-col gap-4 w-screen md:w-[20vw] items-center justify-center">
          event: {selectedEvent}
          <NumberInput
            w={"90%"}
            placeholder="7028"
            label="Team Number"
            value={inputTeam}
            onChange={setInputTeam}
          />
          <Button onClick={handleClick}>Get Auto Middle Path</Button>
        </div>
      )}
      {aggregationData?.middleNotes?.length > 0 && (
        <SelectionMiddleNotesPath
          middleNotes={aggregationData?.middleNotes?.sort(
            (a: any, b: any) => a.matchNumber - b.matchNumber
          )}
          allianceData={[]}
          fullWidth={isMobile ? true : false}
        />
      )}
    </div>
  );
}

export default DataMiddlePath;
