import { useEffect, useState } from "react"
import { AggregationsNavbar } from "../Components/AggregationsNavbar"
import { UpdatedHeader } from "../Components/UpdatedHeader"
import GetTeamData from "../Utils/GetTeamData"
import { Button, Group, Select, Text, useMantineTheme } from "@mantine/core"
import EventSelectStyles from "../Styles/EventSelectStyles"
import { AverageStatsRings } from "../Components/AverageStats"
import submissionsHomeStyles from "../Styles/SubmissionsHomeStyles"

function AnalyzedAverages() {

    const [averageData, setAverageData] = useState([])
    const [teamData, setTeamData] = useState<any>([])
    const [selectedData, setSelectedData] = useState<any>()

    const eventSelectClasses = EventSelectStyles().classes
    const submissionsHomeClasses = submissionsHomeStyles().classes

    const theme = useMantineTheme()

    useEffect(() => {
        (async function () {
            const data = await GetTeamData.getAggregationData()
            setAverageData(data.data)
        })()
    }, [])

    useEffect(() => {
        (async function () {
            var teamArray: any[] = [];
            const data = await GetTeamData.getAggregationData()
            data.data.map((average: any) => {
                teamArray.push(average._id.toString())
            })
            setTeamData(teamArray)
        })()
    }, [])

    const getTeamAverage = (num: number) => {
        averageData.map((average: any) => {
            if (average._id == num) return setSelectedData(average)
        })
    }

    return (
        <div className="SubmissionsContainer">
            <UpdatedHeader />
            <div className="SubmissionsHomeSection">
                <AggregationsNavbar
                    location={"Averages"} />
                <div className="AnalyzedAveragesHome">
                    <Text
                        className="SubmissionsEventMatchesText"
                        color={theme.primaryColor}
                        ta="center"
                        fz="xl"
                        fw={700}
                    >
                        Team Averages
                    </Text>

                    <Select
                        transition="pop-top-left"
                        transitionDuration={80}
                        transitionTimingFunction="ease"
                        dropdownPosition="bottom"
                        style={{ zIndex: 2 }}
                        data={teamData}
                        placeholder="Pick one"
                        label="Select Team"
                        classNames={eventSelectClasses}
                        searchable
                        nothingFound="No teams found!"
                        onChange={(event: string) => {
                            getTeamAverage(Number(event))
                        }}
                    />

                    {selectedData ?
                        <>
                            <div className="AverageStats">
                                <AverageStatsRings
                                    data={[
                                        { label: "Average Score", stats: `${Math.round(100 * selectedData.AvgScore) / 100}`, progress: 100, color: "cyan", icon: 'up' },
                                        { label: "Auto Score", stats: `${Math.round(100 * selectedData.AutoScore) / 100}`, progress: 100, color: "green", icon: 'up' },
                                        { label: "Teleop Score", stats: `${Math.round(100 * selectedData.TeleScore) / 100}`, progress: 100, color: "red", icon: 'up' },
                                        { label: "Average Weight", stats: `${Math.round(100 * selectedData.AvgWeight) / 100}`, progress: 100, color: "indigo", icon: 'up' },
                                        { label: "Defense", stats: (selectedData.Defense == 1) ? "Yes" : "No", progress: 100, color: "yellow", icon: 'up' }
                                    ]} />
                            </div>
                            <Group className={submissionsHomeClasses.controls}>
                                <Button
                                    component={"a"}
                                    size="xl"
                                    className={submissionsHomeClasses.control}
                                    color={"blue"}
                                    href={`/submissions/teams/${selectedData._id}`}
                                >
                                    View Team Data
                                </Button>
                            </Group>
                        </> : null}

                </div>
            </div>
        </div>
    )
}

export default AnalyzedAverages