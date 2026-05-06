"use client";

import { useEffect, useState } from "react";
import { Select } from "@mantine/core";
import LineChart from "@/components/graphs/team-match-line-graph";

type TeamMatchGraphProps = {
  aggregation: any;
  selectedMetric?: string;
  hideSelector?: boolean;
  yMin?: number | "auto";
  yMax?: number | "auto";
};

const TeamMatchGraph = ({
  aggregation,
  selectedMetric,
  hideSelector = false,
  yMin,
  yMax,
}: TeamMatchGraphProps) => {
  const [localYAxis, setLocalYAxis] = useState("matchTotalFuel");
  const [lineData, setLineData] = useState<any[]>([]);

  const yAxis = selectedMetric ?? localYAxis;

  useEffect(() => {
    setLineData([
      {
        id: aggregation._id,
        data:
          aggregation[yAxis]
            ?.sort((a: any, b: any) => a.matchNumber - b.matchNumber)
            .map((match: any) => ({
              x: match.matchNumber,
              label: `Match: ${match.matchNumber}`,
              y: match.score,
            })) || [],
      },
    ]);
  }, [aggregation, yAxis]);

  const yAxisOptions = [
    { value: "matchTotalFuel", label: "Total Fuel" },
    { value: "matchAutoFuel", label: "Auto Fuel" },
    { value: "matchTeleFuel", label: "Teleop Fuel" },
    { value: "matchTotalScore", label: "Total Score" },
    { value: "matchAutoScore", label: "Auto Score" },
    { value: "matchTeleScore", label: "Teleop Score" },
    { value: "matchRP", label: "Ranking Points" },
  ];

  return (
    <div className="w-full flex flex-col">
      {!hideSelector && (
        <div className="md:w-4/5 mx-auto flex flex-row justify-center mb-4">
          <Select
            className="shrink-0 w-auto h-10 text-sm mr-2"
            data={yAxisOptions}
            onChange={(value) => value && setLocalYAxis(value)}
            value={yAxis}
            allowDeselect={false}
            styles={{
              dropdown: {
                zIndex: 10001,
              },
            }}
          />
        </div>
      )}
      <div className="flex">
        {lineData.length > 0 && (
          <LineChart
            data={lineData}
            xAxis={"Match Number"}
            yAxis={
              yAxisOptions.filter((option: any) => option.value == yAxis)[0]
                .label
            }
            yMin={yMin}
            yMax={yMax}
          />
        )}
      </div>
    </div>
  );
};

export default TeamMatchGraph;
