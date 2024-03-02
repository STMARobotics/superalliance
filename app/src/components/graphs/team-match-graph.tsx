import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TeamMatchGraph = ({
  data,
  statistic,
}: {
  data: any;
  statistic: string;
}) => {
  return (
    <ResponsiveContainer width="100%" height={600}>
      {/* <BarChart
        data={data.map((match: any) => {
          return {
            match: `Match ${match.matchNumber}`,
            score: match.teleScore,
          };
        })}
      >
        <XAxis
          dataKey="match"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Bar
          dataKey="score"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart> */}
      <AreaChart
        data={data.map((match: any) => {
          return {
            match: `Match #${match.matchNumber}`,
            score: match.teleScore,
          };
        })}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 20,
        }}
      >
        <Tooltip
          labelStyle={{ color: "black" }}
          itemStyle={{ color: "black" }}
        />
        <CartesianGrid strokeDasharray="3 3" stroke="#000000" />
        <XAxis
          dataKey="match"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value.replace("Match #", "")}
          label={{
            value: "Match Number",
            position: "insideBottom",
            offset: 0,
          }}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Area
          name={statistic}
          type={"monotone"}
          dataKey="score"
          fill="#fff"
          stroke="#fff"
          className="fill-primary"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TeamMatchGraph;
