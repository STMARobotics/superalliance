import { useEffect, useState } from "react"
import { AggregationsNavbar } from "../Components/AggregationsNavbar"
import { UpdatedHeader } from "../Components/UpdatedHeader"
import GetTeamData from "../Utils/GetTeamData"
import { Button, Group, Select, Text, useMantineTheme } from "@mantine/core"
import EventSelectStyles from "../Styles/EventSelectStyles"
import { AverageStatsRings } from "../Components/AverageStats"
import submissionsHomeStyles from "../Styles/SubmissionsHomeStyles"
import { useLocalStorage } from "@mantine/hooks"
import { config } from "../../Constants"

function AnalyzedAverages() {

    const [averageData, setAverageData] = useState([])
    const [teamData, setTeamData] = useState<any>([])
    const [selectedData, setSelectedData] = useState<any>()

    const eventSelectClasses = EventSelectStyles().classes
    const submissionsHomeClasses = submissionsHomeStyles().classes

    const theme = useMantineTheme()

    const [eventData, setEventData] = useState<any>([])

    const [preferenceData, setPreferenceData] = useLocalStorage<any>({
        key: 'saved-preferences',
        getInitialValueInEffect: false,
    });

    useEffect(() => {
        (async function () {
            var eventArray: any[] = [];
            eventArray.push({
                label: "All Events",
                value: "all"
            })
            eventArray.push({
                label: "Testing Event",
                value: "testing",
                shortCode: "testing"
            })
            eventArray.push({
                label: "Week 0 Event",
                value: "week0",
                shortCode: "week0"
            })
            const eventdata = await GetTeamData.getTeamEventDataLanding(7028, 2023)
            eventdata.data.map((event: any) => {
                eventArray.push(event)
            })
            setEventData(eventArray)
        })()
    }, [])

    const getEventCode = () => {
        try {
            if (preferenceData.dataShow == 'testing') return 'testing'
            if (preferenceData.dataShow == 'week0') return 'week0'
            const d = eventData.filter((e: any) => {
                return e.value == preferenceData.dataShow
            })[0]
            return d.eventcode
        } catch {
            return ""
        }
    }

    const getTeamAverage = (num: number) => {
        averageData.map((average: any) => {
            if (average._id == num) return setSelectedData(average)
        })
    }

    const convertData = (number: number) => {
        if(!number) return "None"
        const data = Math.round(100 * number) / 100
        if (isNaN(data)) {
            return "None"
        }
        return data
    }

    useEffect(() => {
        (async function () {
            if (preferenceData.dataShow !== "all") {
                const data = await GetTeamData.getAggregationDataEvent(getEventCode())
                return setAverageData(data.data)
            }
            const data = await GetTeamData.getAggregationData()
            return setAverageData(data.data)
        })()
    }, [])

    useEffect(() => {
        (async function () {
            var teamArray: any[] = [];
            if (preferenceData.dataShow !== "all") {
                const data = await GetTeamData.getAggregationDataEvent(getEventCode())
                data.data.map((average: any) => {
                    teamArray.push(average._id.toString())
                })
                return setTeamData(teamArray)
            }
            const data = await GetTeamData.getAggregationData()
            data.data.map((average: any) => {
                teamArray.push(average._id.toString())
            })
            return setTeamData(teamArray)
        })()
    }, [])

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
                                        { label: "Average Score", stats: `${convertData(selectedData.AvgScore)}`, progress: 100, color: (config.colors[(Math.floor(Math.random() * (config.colors.length - 1 + 1)) + 0)].value), icon: 'up' },
                                        { label: "Average Endgame Score", stats: `${convertData(selectedData.AvgEndgame)}`, progress: 100, color: (config.colors[(Math.floor(Math.random() * (config.colors.length - 1 + 1)) + 0)].value), icon: 'up' },
                                        { label: "Average Auto Score", stats: `${convertData(selectedData.AvgAutoScore)}`, progress: 100, color: (config.colors[(Math.floor(Math.random() * (config.colors.length - 1 + 1)) + 0)].value), icon: 'up' },
                                        { label: "Average Teleop Score", stats: `${convertData(selectedData.AvgTeleScore)}`, progress: 100, color: (config.colors[(Math.floor(Math.random() * (config.colors.length - 1 + 1)) + 0)].value), icon: 'up' },
                                        { label: "Best Auto Score", stats: `${convertData(selectedData.BestAuto)}`, progress: 100, color: (config.colors[(Math.floor(Math.random() * (config.colors.length - 1 + 1)) + 0)].value), icon: 'up' },
                                        { label: "Best Teleop Score", stats: `${convertData(selectedData.BestTele)}`, progress: 100, color: (config.colors[(Math.floor(Math.random() * (config.colors.length - 1 + 1)) + 0)].value), icon: 'up' },
                                        { label: "Rank Points", stats: `${convertData(selectedData.RP)}`, progress: 100, color: (config.colors[(Math.floor(Math.random() * (config.colors.length - 1 + 1)) + 0)].value), icon: 'up' },
                                        { label: "Defense", stats: (selectedData.Defense == 1) ? "Yes" : "No", progress: 100, color: (config.colors[(Math.floor(Math.random() * (config.colors.length - 1 + 1)) + 0)].value), icon: 'up' }
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
