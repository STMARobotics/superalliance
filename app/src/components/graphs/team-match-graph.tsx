"use client";

import { useEffect, useState } from "react";
import { Select } from "@mantine/core";
import LineChart from "@/components/graphs/team-match-line-graph";

const TeamMatchGraph = ({ aggregation }: { aggregation: any }) => {
  const [yAxis, setYAxis] = useState("matchTotalNotes");
  const [lineData, setLineData] = useState<any[]>([]);

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
  }, [yAxis]);

  const yAxisOptions = [
    { value: "matchTotalNotes", label: "Total Notes" },
    { value: "matchAutoNotes", label: "Auto Notes" },
    { value: "matchTeleNotes", label: "Teleop Notes" },
    { value: "matchTotalScore", label: "Total Score" },
    { value: "matchAutoScore", label: "Auto Score" },
    { value: "matchTeleScore", label: "Teleop Score" },
    { value: "matchRP", label: "Ranking Points" },
  ];

  return (
    <div className="w-full flex flex-col">
      <div className="md:w-4/5 mx-auto flex flex-row justify-center mb-4">
        <Select
          className="flex-shrink-0 w-auto h-10 text-sm mr-2"
          data={yAxisOptions}
          onChange={(e: any) => setYAxis(e)}
          value={yAxis}
          allowDeselect={false}
          styles={{
            dropdown: {
              zIndex: 10001,
            },
          }}
        />
      </div>
      <div className="flex">
        {lineData.length > 0 && (
          <LineChart
            data={lineData}
            xAxis={"Match Number"}
            yAxis={
              yAxisOptions.filter((option: any) => option.value == yAxis)[0]
                .label
            }
          />
        )}
      </div>
    </div>
  );
};

export default TeamMatchGraph;
