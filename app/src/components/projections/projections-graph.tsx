"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/highcharts-more";

import { useEffect, useState } from "react";

const round = (num: number, digits: number = 1) => {
  const factor = 10 ** digits;
  return Math.round(num * factor) / factor;
};

const scaledStdDevPercent = (
  stdDev: number | null,
  average: number | null
) => {
  if (
    stdDev === null ||
    average === null ||
    !Number.isFinite(stdDev) ||
    !Number.isFinite(average) ||
    average <= 0
  ) {
    return null;
  }

  return (stdDev * 100) / average;
};

const toFiniteNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
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

type ScatterData = {
  x: number;
  y: number;
  z: number;
  num: string; // to handle offseason
  rawTeamNumber: string;
  labelInt: number;
  color?: string;
  marker?: {
    lineColor?: string;
    lineWidth?: number;
    fillColor?: string;
  };
};

const bubbleColor = (score: number) => {
  const clamped = Math.max(0, Math.min(1, score));
  const steepened = clamped ** 1.8;
  const r = Math.round(255 - (255 - 34) * steepened);
  const g = Math.round(197 * steepened);
  const b = Math.round(94 * steepened);
  return `rgb(${r}, ${g}, ${b})`;
};

const ProjectionsGraph = ({
  data,
  selectedStat,
  highlightedTeam,
  selectedTeam,
  setSelectedTeam,
}: {
  data: any[];
  selectedStat: any;
  highlightedTeam: any;
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

  const isStandardDeviationView = selectedStat === "standardDeviation";

  const xAxisLabel =
    selectedStat == "averageFuel" ? "Avg Auto Fuel" : "StdDev Auto Fuel (%)";
  const yAxisLabel =
    selectedStat == "averageFuel" ? "Avg Tele Fuel" : "StdDev Tele Fuel (%)";
  const zAxisLabel = "Constant";

  /** Maps team num to hex color code */

  const scatterData: ScatterData[] = data
    .map((datum) => {
      if (isStandardDeviationView) {
        const avgAutoFuel = toFiniteNumber(datum?.avgAutoFuel);
        const avgTeleFuel = toFiniteNumber(datum?.avgTeleFuel);
        const stdDevAutoFuel = toFiniteNumber(datum?.stdDevAutoFuel);
        const stdDevTeleFuel = toFiniteNumber(datum?.stdDevTeleFuel);
        const stdDevAutoPercent = scaledStdDevPercent(stdDevAutoFuel, avgAutoFuel);
        const stdDevTelePercent = scaledStdDevPercent(stdDevTeleFuel, avgTeleFuel);

        if (stdDevAutoPercent === null || stdDevTelePercent === null) {
          return null;
        }

        return {
          x: round(stdDevAutoPercent),
          y: round(stdDevTelePercent),
          z: 1,
          num: formatNumber(datum._id),
          rawTeamNumber: String(datum._id ?? ""),
          labelInt: 0,
        };
      }

      return {
        x: round(Number(datum?.avgAutoFuel ?? 0)),
        y: round(Number(datum?.avgTeleFuel ?? 0)),
        z: 1,
        num: formatNumber(datum._id),
        rawTeamNumber: String(datum._id ?? ""),
        labelInt: 0,
      };
    })
    .filter((datum): datum is ScatterData => datum !== null);

  const getCutoff = (values: number[]) => {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => b - a);
    const cutoffIndex = Math.min(50, sorted.length - 1);
    return sorted[cutoffIndex] ?? 0;
  };

  const xCutoff = getCutoff(scatterData.map((datum) => datum.x));
  const yCutoff = getCutoff(scatterData.map((datum) => datum.y));
  const zCutoff = getCutoff(scatterData.map((datum) => datum.z));

  const xs = scatterData.map((datum) => datum.x);
  const ys = scatterData.map((datum) => datum.y);
  const xMin = xs.length > 0 ? Math.min(0, ...xs) : 0;
  const yMin = ys.length > 0 ? Math.min(0, ...ys) : 0;
  const xMax = xs.length > 0 ? Math.max(...xs) : 1;
  const yMax = ys.length > 0 ? Math.max(...ys) : 1;

  const lineSeries: any = [];

  const showGrid = lineSeries.length === 0;

  const filteredDataSubset: ScatterData[] = scatterData.map((datum) => ({
    x: datum.x,
    y: datum.y,
    z: datum.z,
    num: datum.num,
    rawTeamNumber: datum.rawTeamNumber,
    labelInt: (() => {
      const selectedValue = String(highlightedTeam ?? "").trim();
      const isSelectedTeam =
        selectedValue.length > 0 &&
        (selectedValue === datum.rawTeamNumber || selectedValue === datum.num);

      return isSelectedTeam || datum.x > xCutoff || datum.y > yCutoff || datum.z > zCutoff
        ? 1
        : 0;
    })(),
    color: (() => {
      const xRange = xMax - xMin || 1;
      const yRange = yMax - yMin || 1;
      const xNorm = (datum.x - xMin) / xRange;
      const yNorm = (datum.y - yMin) / yRange;
      const score = isStandardDeviationView
        ? 1 - (xNorm + yNorm) / 2
        : (xNorm + yNorm) / 2;
      return bubbleColor(score);
    })(),
    marker: (() => {
      const selectedValue = String(highlightedTeam ?? "").trim();
      const isSelectedTeam =
        selectedValue.length > 0 &&
        (selectedValue === datum.rawTeamNumber || selectedValue === datum.num);

      if (!isSelectedTeam) return undefined;

      return {
        lineColor: "#ffffff",
        lineWidth: 3,
        fillColor: "#fde047",
      };
    })(),
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
        text: xAxisLabel,
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
      max: xMax + 0.05 * Math.max(xMax - xMin, 1),
      reversed: isStandardDeviationView,
    },
    yAxis: {
      title: {
        text: yAxisLabel,
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
      max: yMax + 0.05 * Math.max(yMax - yMin, 1),
      reversed: isStandardDeviationView,
      gridLineColor: "#5c5c5c",
      gridLineWidth: showGrid ? 1 : 0,
    },
    tooltip: {
      useHTML: true,
      headerFormat: "<table>",
      pointFormat:
        '<tr><th colspan="2"><h3>{point.num}</h3></th></tr>' +
        `<tr><th>${xAxisLabel}:</th><td>{point.x}</td></tr>` +
        `<tr><th>${yAxisLabel}:</th><td>{point.y}</td></tr>`,
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
        minSize: zAxisLabel === "Constant" ? 10 : 1,
        maxSize: zAxisLabel === "Constant" ? 10 : 15,
        color: undefined,
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
