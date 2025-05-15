import { ResponsiveLine } from "@nivo/line";

const round = (num: number, digits: number = 1) => {
  const factor = 10 ** digits;
  return Math.round(num * factor) / factor;
};

const TeamMatchLineGraph = ({
  data,
  xAxis,
  yAxis,
  yMin,
  yMax,
}: {
  data: any[];
  xAxis: string;
  yAxis: string;
  yMin?: number | "auto";
  yMax?: number | "auto";
}) => {
  const xLabels = data.reduce((acc, curr) => {
    const xToLabel = curr.data.reduce((acc: any, curr: any) => {
      acc[curr.x] = curr.label;
      return acc;
    }, {});
    acc[curr.id] = xToLabel;
    return acc;
  }, {});

  const finalYMin = yMin
    ? yMin
    : yAxis.toLowerCase().includes("rp")
    ? -1 / 3
    : yAxis.includes("Norm")
    ? 1200
    : 0;
  const finalYMax = yMax ? yMax : data.length === 0 ? 1 : "auto";

  return (
    <div className="w-full h-[500px] flex">
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", min: finalYMin, max: finalYMax }}
        curve="monotoneX"
        // enableGridX={false}
        // enableGridY={false}
        theme={{
          axis: {
            ticks: {
              text: {
                fill: "#fff",
              },
            },
            legend: {
              text: {
                fill: "#fff",
              },
            },
          },
          grid: {
            line: {
              opacity: 0.25,
            },
          },
        }}
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
        colors={{ scheme: "set1" }}
        pointSize={10}
        enableArea={true}
        areaOpacity={0.1}
        pointLabel="y"
        pointLabelYOffset={-12}
        useMesh={true}
        tooltip={({ point }) => {
          const y: any = point.data.yFormatted;
          //@ts-ignore
          const xLabel = xLabels[point.seriesId][point.data.x];
          return (
            <div
              className="bg-white rounded shadow p-2"
              style={{ color: "black" }}
            >
              <div className="text-sm font-bold">{`Team ${point.seriesId}`}</div>
              <div className="text-xs mb-1">{xLabel}</div>
              <div className="text-sm">{`${yAxis}: ${round(
                parseFloat(y)
              )}`}</div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default TeamMatchLineGraph;
