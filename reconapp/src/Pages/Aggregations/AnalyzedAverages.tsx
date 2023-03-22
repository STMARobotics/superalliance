import { useEffect, useState } from "react"
import { AggregationsNavbar } from "../Components/AggregationsNavbar"
import { UpdatedHeader } from "../Components/UpdatedHeader"
import GetTeamData from "../Utils/GetTeamData"
import { Button, Flex, Grid, Group, LoadingOverlay, Modal, Paper, Select, Text, useMantineTheme } from "@mantine/core"
import EventSelectStyles from "../Styles/EventSelectStyles"
import { AverageStatsRings } from "../Components/AverageStats"
import submissionsHomeStyles from "../Styles/SubmissionsHomeStyles"
import { useDisclosure, useLocalStorage } from "@mantine/hooks"

function AnalyzedAverages() {

    const [averageData, setAverageData] = useState([])
    const [teamData, setTeamData] = useState<any>([])
    const [selectedData, setSelectedData] = useState<any>()
    const [selectedNumber, setSelectedNumber] = useState<any>()
    const [formData, setFormData] = useState<any[]>([])
    const [commentData, setCommentData] = useState<any[]>([])

    const [visible, setVisible] = useState(true);

    const eventSelectClasses = EventSelectStyles().classes
    const submissionsHomeClasses = submissionsHomeStyles().classes

    const theme = useMantineTheme()

    const [eventData, setEventData] = useState<any[]>([])

    const [preferenceData, setPreferenceData] = useLocalStorage<any>({
        key: 'saved-preferences',
        getInitialValueInEffect: false,
    });

    const [opened, { open, close }] = useDisclosure(false);

    const getEventCode = async () => {
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
        try {
            if (preferenceData.dataShow == 'testing') return 'testing'
            if (preferenceData.dataShow == 'week0') return 'week0'
            const d = eventArray.filter((e: any) => {
                return e.value == preferenceData.dataShow
            })[0]
            return d.eventcode
        } catch {
            return ""
        }
    }

    const getTeamComments = async (num: number) => {
        var commentArray: any[] = []
        formData.filter((form: any) => form.teamNumber === num).map((form: any) => {
            if (form.comments == '') return
            const struct = {
                comment: form.comments,
                submissionId: form._id,
                matchNumber: form.matchNumber,
                author: form.usersName
            }
            commentArray.push(struct)
        })
        setCommentData(commentArray)
    }

    const getTeamAverage = (num: number) => {
        averageData.map((average: any) => {
            if (average._id == num) return setSelectedData(average)
        })
    }

    const convertData = (number: number) => {
        if (!number) return "No Data"
        const data = Math.round(100 * number) / 100
        if (isNaN(data)) {
            return "No Data"
        }
        return data
    }

    useEffect(() => {
        (async function () {
            getTeamAverage(selectedNumber)
            getTeamComments(selectedNumber)
        })()
    }, [selectedNumber])

    useEffect(() => {
        (async function () {
            if (preferenceData.dataShow !== "all") {
                const data = await GetTeamData.getAggregationDataEvent(await getEventCode())
                return setAverageData(data.data)
            }
            const data = await GetTeamData.getAggregationData()
            return setAverageData(data.data)
        })()
    }, [eventData])

    useEffect(() => {
        (async function () {
            var teamArray: any[] = [];
            if (preferenceData.dataShow !== "all") {
                const data = await GetTeamData.getAggregationDataEvent(await getEventCode())
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
    }, [eventData])

    useEffect(() => {
        (async function () {
            const data = await GetTeamData.getAllFormSorting()
            setFormData(data.data)
            setVisible(false)
        })()
    }, [])

    return (
        <div className="SubmissionsContainer">
            <Modal
                opened={opened}
                onClose={close}
                title={commentData.length === 0
                    ?
                    "No Comments Found!"
                    :
                    `Total Comments: ${commentData.length}`}
                overlayBlur={3}
                overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
                overlayOpacity={0.55}
                zIndex={1000}
                transition={'rotate-left'}
            >
                <Grid grow>
                    {commentData.map((comment: any) => {
                        return (
                            <Grid.Col span={12}>
                                <Paper shadow="xl" radius="md" p="sm" withBorder>
                                    <Text weight={700}>Match {comment.matchNumber} - {comment.author}</Text>
                                    <Text italic weight={400}>"{comment.comment}"</Text>
                                    <Button
                                        variant="outline"
                                        fullWidth
                                        mt="md"
                                        component="a"
                                        target={"_blank"}
                                        href={`/submissions/analysis/form/${comment.submissionId}`}
                                    >
                                        View Form
                                    </Button>
                                </Paper>
                            </Grid.Col>
                        )
                    })}
                </Grid>
            </Modal>
            <UpdatedHeader />
            <div>
                <div className="SubmissionsHomeSection">
                    <AggregationsNavbar
                        location={"Team Overview"} />
                    <div className="AnalyzedAveragesHome" style={{ position: 'relative' }}>
                        <LoadingOverlay visible={visible} overlayBlur={15} zIndex={10000} />
                        <Text
                            className="SubmissionsEventMatchesText"
                            color={theme.primaryColor}
                            ta="center"
                            fz="xl"
                            fw={700}
                        >
                            Team Overview
                        </Text>

                        <Select
                            transition={'pop-top-left'}
                            transitionDuration={80}
                            transitionTimingFunction={'ease'}
                            dropdownPosition="bottom"
                            style={{ zIndex: 2 }}
                            data={teamData}
                            placeholder="Pick a team..."
                            label="Select Team"
                            classNames={eventSelectClasses}
                            searchable
                            nothingFound="No teams found!"
                            onChange={(event: string) => {
                                setSelectedNumber(Number(event))
                            }}
                        />

                        {selectedData ?
                            <>
                                <div className="AverageStats">
                                    <AverageStatsRings
                                        data={[
                                            { label: "Average Score", stats: `${convertData(selectedData.AvgScore)}`, progress: 100, color: theme.colors[theme.primaryColor][6], icon: 'up' },
                                            { label: "Average Auto Score", stats: `${convertData(selectedData.AvgAutoScore)}`, progress: 100, color: theme.colors[theme.primaryColor][6], icon: 'up' },
                                            { label: "Average Teleop Score", stats: `${convertData(selectedData.AvgTeleScore)}`, progress: 100, color: theme.colors[theme.primaryColor][6], icon: 'up' },
                                            { label: "Best Auto Score", stats: `${convertData(selectedData.BestAuto)}`, progress: 100, color: theme.colors[theme.primaryColor][6], icon: 'up' },
                                            { label: "Best Teleop Score", stats: `${convertData(selectedData.BestTele)}`, progress: 100, color: theme.colors[theme.primaryColor][6], icon: 'up' },
                                            { label: "Average Cones", stats: `${convertData(selectedData.AvgCones)}`, progress: 100, color: theme.colors[theme.primaryColor][6], icon: 'up' },
                                            { label: "Average Cubes", stats: `${convertData(selectedData.AvgCubes)}`, progress: 100, color: theme.colors[theme.primaryColor][6], icon: 'up' },
                                            { label: "Average High Cones", stats: `${convertData(selectedData.AvgHighCone)}`, progress: 100, color: theme.colors[theme.primaryColor][6], icon: 'up' },
                                            { label: "Average Mid Cones", stats: `${convertData(selectedData.AvgMidCone)}`, progress: 100, color: theme.colors[theme.primaryColor][6], icon: 'up' },
                                            { label: "Average Low Cones", stats: `${convertData(selectedData.AvgLowCone)}`, progress: 100, color: theme.colors[theme.primaryColor][6], icon: 'up' },
                                            { label: "Average High Cubes", stats: `${convertData(selectedData.AvgHighCube)}`, progress: 100, color: theme.colors[theme.primaryColor][6], icon: 'up' },
                                            { label: "Average Mid Cubes", stats: `${convertData(selectedData.AvgMidCube)}`, progress: 100, color: theme.colors[theme.primaryColor][6], icon: 'up' },
                                            { label: "Average Low Cubes", stats: `${convertData(selectedData.AvgLowCube)}`, progress: 100, color: theme.colors[theme.primaryColor][6], icon: 'up' },
                                            { label: "Average Single HP Chosen", stats: `${convertData(selectedData.AvgSinglePlayer)}`, progress: 100, color: theme.colors[theme.primaryColor][6], icon: 'up' },
                                            { label: "Average Double HP Chosen", stats: `${convertData(selectedData.AvgDoublePlayer)}`, progress: 100, color: theme.colors[theme.primaryColor][6], icon: 'up' },
                                            { label: "Average Both HP Chosen", stats: `${convertData(selectedData.AvgBothPlayer)}`, progress: 100, color: theme.colors[theme.primaryColor][6], icon: 'up' },
                                            { label: "Tipped Cones %", stats: `${(selectedData.AvgTippedCone * 100)}%`, progress: 100, color: theme.colors[theme.primaryColor][6], icon: 'up' },
                                            { label: "Floor Cones %", stats: `${(selectedData.AvgFloorCone * 100)}%`, progress: 100, color: theme.colors[theme.primaryColor][6], icon: 'up' },
                                            { label: "Total Criticals", stats: `${convertData(selectedData.TotalCrit)}`, progress: 100, color: theme.colors[theme.primaryColor][6], icon: 'up' },
                                            { label: "RP Average", stats: `${convertData(selectedData.RP)}`, progress: 100, color: theme.colors[theme.primaryColor][6], icon: 'up' },
                                            { label: "Defense %", stats: `${(selectedData.AvgDefense * 100)}%`, progress: 100, color: theme.colors[theme.primaryColor][6], icon: 'up' }
                                        ]} />
                                </div>
                                <Group className={submissionsHomeClasses.controls}>
                                    <Button
                                        size="xl"
                                        className={submissionsHomeClasses.control}
                                        color={theme.primaryColor}
                                        onClick={open}
                                    >
                                        View Comments
                                    </Button>
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
        </div >
    )
}

export default AnalyzedAverages