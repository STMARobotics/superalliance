"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HC_more from "highcharts/highcharts-more";

import { useEffect, useState } from "react";

const round = (num: number, digits: number = 1) => {
  const factor = 10 ** digits;
  return Math.round(num * factor) / factor;
};

const formatNumber = (num: number) => {
  if (num > 100000) {
    return (
      round(num / 100000, 0).toString() +
      String.fromCharCode(65 + (num % 100000))
    );
  }
  return num.toString();
};

if (typeof Highcharts === "object") {
  HC_more(Highcharts);
}

type ScatterData = {
  x: number;
  y: number;
  z: number;
  num: string; // to handle offseason
  labelInt: number;
};

const ProjectionsGraph = ({
  data,
  selectedTeam,
  setSelectedTeam,
}: {
  data: any[];
  selectedTeam: any;
  setSelectedTeam: any;
}) => {
  const [width, setWidth] = useState(0);

  // update width on resize
  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    window.addEventListener("resize", updateWidth);
    window.addEventListener("orientationchange", updateWidth);
    window.addEventListener("load", updateWidth);
    updateWidth();
    return () => {
      window.removeEventListener("resize", updateWidth);
      window.removeEventListener("orientationchange", updateWidth);
      window.removeEventListener("load", updateWidth);
    };
  }, []);

  const xAxis = {
    label: "Total Auto Notes",
    accessor: (datum: any) => round(datum?.totalAutoNotes),
  };
  const yAxis = {
    label: "Total Teleop Notes",
    accessor: (datum: any) => round(datum?.totalTeleNotes),
  };
  const zAxis = { label: "Constant", accessor: (_datum: any) => 1 };

  /** Maps team num to hex color code */

  const scatterData: ScatterData[] = data.map((datum) => {
    return {
      x: xAxis.accessor(datum),
      y: yAxis.accessor(datum),
      z: zAxis.accessor(datum),
      num: formatNumber(datum._id),
      labelInt: 0,
    };
  });

  const xs = scatterData.map((datum) => datum.x);
  const ys = scatterData.map((datum) => datum.y);
  const zs = scatterData.map((datum) => datum.z);
  const len = Math.min(50, xs.length - 1);
  const xCutoff = xs.sort((a, b) => b - a)[len];
  const yCutoff = ys.sort((a, b) => b - a)[len];
  const zCutoff = zs.sort((a, b) => b - a)[len];

  const xMin = Math.min(Math.min(...xs), 0);
  const yMin = Math.min(Math.min(...ys), 0);

  const xMax = Math.max(...xs);
  const yMax = Math.max(...ys);

  const minSum = Math.min(xMin + yMin, 0);
  const maxSum = Math.max(xMax + yMax, 0);

  const numLines = 20; // 10% each, with 50% buffer on each side
  const values = Array.from(Array(numLines + 1).keys()).map(
    (i) => minSum + (maxSum - minSum) * ((i - 5) / 10)
  );

  const lineSeries: any =
    xAxis?.label === "Auto" && yAxis?.label === "Teleop"
      ? values.map((value) => ({
          type: "line",
          name: value.toString(),
          data: [
            [value - 2 * yMax, 2 * yMax],
            [2 * xMax, value - 2 * xMax],
          ],
          enableMouseTracking: false,
          color: "rgba(0, 0, 0, 0.15)",
        }))
      : [];

  const showGrid = lineSeries.length === 0;

  const filteredDataSubset: ScatterData[] = scatterData.map((datum) => ({
    x: datum.x,
    y: datum.y,
    z: datum.z,
    num: datum.num,
    labelInt:
      datum.x > xCutoff || datum.y > yCutoff || datum.z > zCutoff ? 1 : 0,
  }));

  const options: Highcharts.Options = {
    title: {
      text: "",
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      title: {
        text: xAxis["label"],
        style: {
          color: "#fff",
        },
      },
      labels: {
        style: {
          color: "white",
        },
      },
      tickColor: "#fff",
      min: 0,
      max: xMax + 0.05 * (xMax - xMin),
    },
    yAxis: {
      title: {
        text: yAxis["label"],
        style: {
          color: "#fff",
        },
      },
      labels: {
        style: {
          color: "white",
        },
      },
      tickColor: "#fff",
      min: 0,
      max: yMax + 0.05 * (yMax - yMin),
      gridLineColor: "#5c5c5c",
      gridLineWidth: showGrid ? 1 : 0,
    },
    tooltip: {
      useHTML: true,
      headerFormat: "<table>",
      pointFormat:
        '<tr><th colspan="2"><h3>{point.num}</h3></th></tr>' +
        (xAxis.label !== "Constant"
          ? `<tr><th>${xAxis.label}:</th><td>{point.x}</td></tr>`
          : "") +
        (yAxis.label !== "Constant"
          ? `<tr><th>${yAxis.label}:</th><td>{point.y}</td></tr>`
          : "") +
        (zAxis.label !== "Constant"
          ? `<tr><th>${zAxis.label}:</th><td>{point.z}</td></tr>`
          : ""),
      footerFormat: "</table>",
      followPointer: true,
    },
    chart: {
      reflow: true,
      // responsive width
      width: 0.7 * width,
      height: (9 / 16) * 100 + "%", // 16:9 ratio
      backgroundColor: "transparent",
      type: "bubble",
      plotBorderWidth: 1,
      zooming: {
        type: "xy",
        resetButton: {
          position: {
            align: "right",
            verticalAlign: "top",
            x: -10,
            y: 10,
          },
        },
      },
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: "{point.num}",
          filter: {
            property: "labelInt",
            operator: ">",
            value: 0,
          },
          y: -15,
          borderWidth: 1,
          style: {
            fontSize: "10px",
            color: "white",
            textOutline: "none",
          },
        },
      },
      bubble: {
        minSize: zAxis.label === "Constant" ? 10 : 1,
        maxSize: zAxis.label === "Constant" ? 10 : 15,
        color: "red",
        point: {
          events: {
            click: (event: any) => {
              if (!event?.point?.num) return;
              const team = event.point.num;
              if (selectedTeam == team) return;
              setSelectedTeam(team);
            },
          },
        },
      },
      line: {
        lineWidth: 1,
        color: "#f87171",
        dataLabels: {
          enabled: false,
        },
      },
    },
    series: [
      {
        type: "bubble",
        data: filteredDataSubset,
      },
      ...lineSeries,
    ],
    credits: {
      enabled: false,
    },
    accessibility: {
      enabled: false,
    },
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-center">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default ProjectionsGraph;
