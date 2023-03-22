import { useEffect, useState } from "react";
import { UpdatedHeader } from "../UpdatedHeader"
import Select from "react-select";
import { ResponsiveLine } from "@nivo/line";

const round = (num: number, digits: number = 1) => {
    const factor = 10 ** digits;
    return Math.round(num * factor) / factor;
};

const LineChart = ({
    data,
    xAxis,
    yAxis,
    enableArea,
    xMin,
    xMax,
    yMin,
    yMax,
}: {
    data: {
        id: string;
        data: { x: number; label: string; y: number }[];
    }[];
    xAxis: string;
    yAxis: string;
    enableArea?: boolean;
    xMin?: number;
    xMax?: number;
    yMin?: number | "auto";
    yMax?: number | "auto";
}) => {
    const xLabels = data.reduce((acc: any, curr: any) => {
        const xToLabel = curr.data.reduce((acc: any, curr: any) => {
            acc[curr.x] = curr.label;
            return acc;
        }, {});
        acc[curr.id] = xToLabel;
        return acc;
    }, {});

    const finalXMin = xMin ? xMin : 0;
    const finalXMax = xMax ? xMax : data.length === 0 ? 1 : "auto";

    const finalYMin = yMin
    const finalYMax = yMax ? yMax : data.length === 0 ? 1 : "auto";

    const finalEnableArea = enableArea

    return (
        <div className="w-full h-[500px] flex">
            <ResponsiveLine
                data={data}
                margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
                xScale={{ type: "linear", min: finalXMin, max: finalXMax }}
                yScale={{ type: "linear", min: finalYMin, max: finalYMax }}
                curve="monotoneX"
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: xAxis,
                    legendOffset: 40,
                    legendPosition: "middle",
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: yAxis,
                    legendOffset: -50,
                    legendPosition: "middle",
                }}
                colors={{ scheme: "category10" }}
                pointSize={5}
                enableArea={finalEnableArea && data.length <= 1}
                areaOpacity={0.1}
                pointLabel="y"
                pointLabelYOffset={-12}
                useMesh={true}
                tooltip={({ point }: any) => {
                    const y: any = point.data.yFormatted;
                    const xLabel = xLabels[point.serieId][point.data.x];
                    return (
                        <div className="bg-white rounded shadow p-2" style={{ color: point.color }}>
                            <div className="text-sm font-bold">{`Team ${point.serieId}`}</div>
                            <div className="text-xs mb-1">{xLabel}</div>
                            <div className="text-sm">{`${yAxis}: ${round(parseFloat(y))}`}</div>
                        </div>
                    );
                }}
                legends={[
                    {
                        anchor: "bottom-right",
                        direction: "column",
                        justify: false,
                        translateX: 12,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: "left-to-right",
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: "circle",
                        symbolBorderColor: "rgba(0, 0, 0, .5)",
                        itemBackground: "rgba(255, 255, 255, 1)",
                    },
                ]}
            />
        </div>
    );
};

const TeamLineChart = ({
    teamNum,
    year,
    data,
}: {
    teamNum: number;
    year: number;
    data: any[];
}) => {
    const [yAxis, setYAxis] = useState({ value: "totalTeleop", label: "Total Teleop Pieces" });
    const [splitEvents, setSplitEvents] = useState(false);

    // VARIABLES
    let filteredData = data;

    let arr = filteredData.map((teamMatch: any, i: number) => ({
        x: teamMatch.matchNumber,
        event: teamMatch.eventName,
        label: data[i - 1]?.eventName + ' Match: ' + teamMatch.matchNumber || "Start",
        y: teamMatch[yAxis.value],
    }));

    let teamData: any = [
        {
            id: teamNum.toString(),
            data: arr,
        },
    ];
    // RENDER

    const yAxisOptions =
        year >= 2016
            ? [
                { value: "totalTeleop", label: "Total Teleop Pieces" },
                { value: "totalCubes", label: "Total Teleop Cubes" },
                { value: "totalCones", label: "Total Teleop Cones" },
            ]
            : [{ value: "total_epa", label: "EPA" }];

    return (
        <div className="w-full flex flex-col">
            <div className="w-4/5 mx-auto flex flex-row justify-center">
                <Select
                    instanceId={"y-axis-select"}
                    className="flex-shrink-0 w-36 h-10 text-sm mr-2"
                    styles={{
                        menu: (provided) => ({ ...provided, zIndex: 9999 }),
                    }}
                    options={yAxisOptions}
                    onChange={(e: any) => setYAxis(e)}
                    value={yAxis}
                />
            </div>
            <div className="flex">
                <LineChart data={teamData} xAxis="Match" yAxis={yAxis.label} enableArea />
            </div>
        </div>
    );
};

function VisualsScoreAcrossMatchComponent({
    data,
    teamNumber
}: {
    data: any,
    teamNumber: any
}) {
    return (
        <div className="w-full h-auto flex flex-col justify-center items-center px-2">
            <div className="w-full text-2xl font-bold mb-4">EPA Over Time</div>
            {data.length !== 0 && (
                <TeamLineChart teamNum={teamNumber} year={2023} data={data} />
            )}
        </div>
    )
}

export default VisualsScoreAcrossMatchComponent