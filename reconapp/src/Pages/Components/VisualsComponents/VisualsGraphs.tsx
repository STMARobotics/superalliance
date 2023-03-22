import { ResponsiveBar } from "@nivo/bar";

const DelayedTooltip = ({ indexBy, id, data, value, color }: any) => {
    const hashId = `bar-tooltip-${data[indexBy]}-${id}`;
    setTimeout(() => {
        const tooltip = document.getElementById(hashId);
        if (tooltip) {
            tooltip.classList.remove("invisible");
        }
    }, 200);
    return (
        <div id={hashId} className={'invisible'} style={{
            color,
            padding: "0.5rem",
            backgroundColor: "#ffffff",
            borderRadius: "0.25rem",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        }}>
            <div style={{
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
                fontWeight: "700",
            }}>{`Team ${data[indexBy]}`}</div>
            <div style={{
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
            }}>{`${id}: ${value}`}</div>
        </div>
    );
};

const sharedConfig: any = (indexBy: string) => ({
    motionConfig: "gentle",
    indexBy: indexBy,
    padding: 0.1,
    tooltip: (args: any) => DelayedTooltip({ indexBy, ...args }),
    groupMode: "stacked",
    colors: { scheme: "category10" },
    borderColor: { from: "color", modifiers: [["darker", 1.6]] },
    axisTop: null,
    axisRight: null,
    axisBottom: null,
    // axisBottom: {
    //     tickSize: 5,
    //     tickPadding: 5,
    //     tickRotation: 0,
    //     legend: "Teams",
    //     legendPosition: "middle",
    //     legendOffset: 32,
    // },
    axisLeft: {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Average",
        legendPosition: "middle",
        legendOffset: -50,
    },
    enableLabel: false,
});

const BarChart = ({
    data,
    indexBy,
    keys,
}: {
    data: any[];
    indexBy: string;
    keys: any[];
}) => {
    return (
        <div style={{
            display: "flex",
            width: "100%",
            height: "500px",
        }}>
            <ResponsiveBar
                {...sharedConfig(indexBy)}
                data={data}
                keys={keys}
                margin={{ top: 20, right: 130, bottom: 50, left: 60 }}
                theme={{
                    "textColor": "#fff"
                }}
                enableGridY={false}
                layout="vertical"
                legends={[
                    {
                        dataFrom: "keys",
                        anchor: "bottom-right",
                        direction: "column",
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: "left-to-right",
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: "hover",
                                style: {
                                    itemOpacity: 1,
                                },
                            },
                        ],
                    },
                ]}
            />
        </div>
    );
};

function VisualsGraphsComponent({
    data,
    keys,
}: {
    data: any;
    keys: any;
}) {
    return (
        <div style={{
            display: 'flex',
            width: '100%',
        }}>
            <BarChart
                data={data}
                indexBy={"_id"}
                keys={keys}
            />
        </div>
    )
}

export default VisualsGraphsComponent