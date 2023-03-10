import { AggregationsNavbar } from "../Components/AggregationsNavbar"
import { UpdatedHeader } from "../Components/UpdatedHeader"
import { Button, Grid, Paper, Select, Text, ThemeIcon, useMantineTheme } from '@mantine/core'
import { useEffect, useState } from "react"
import GetTeamData from "../Utils/GetTeamData"
import moment from "moment"
import EventSelectStyles from "../Styles/EventSelectStyles"
import { IconRobot } from "@tabler/icons"
import sortTeamCardStyles from "../Styles/SortTeamCardStyles"
import { SortingTeamTable } from "../Components/SortingTeamTable"
import { useLocalStorage } from "@mantine/hooks"

interface SubmissionActionProps {
    submissionNumber: number;
    author: string;
    time: string;
    link: string;
    teamNumber: number;
    win: boolean;
    rankPoints: number;
    matchNumber: number;
}

function UserInfoAction({ matchNumber, author, time, link, teamNumber, win, rankPoints }: SubmissionActionProps) {

    return (
        <Paper
            radius="md"

            className="SubmissionMatchBox"
            p="sm"
            sx={(theme) => ({
                backgroundColor: win ? theme.colors.green : theme.colors.red,
            })}
        >
            <Text align="center" size="lg" weight={500} color="white">
                Team #{teamNumber} - Match #{matchNumber}
            </Text>
            <Text align="center" size="sm" color="white">
                {author} • +{rankPoints} RP
            </Text>

            <Button
                color={win ? "green" : "red"}
                variant="filled"
                fullWidth
                mt="md"
                component="a"
                href={link}
            >
                View Form
            </Button>
        </Paper>
    );
}

function AnalyzedSorting() {

    const [formData, setFormData] = useState<any[]>([])
    const [averageData, setAverageData] = useState([])
    const [selectedSortSubmissions, setSelectedSortSubmissions] = useState("createdAt")
    const [selectedSortTeams, setSelectedSortTeams] = useState("_id")
    const [selectedDirectionSubmissions, setSelectedDirectionSubmissions] = useState("-1")
    const [selectedDirectionTeams, setSelectedDirectionTeams] = useState("1")
    const [selectedType, setSelectedType] = useState("")
    const [teamData, setTeamData] = useState<any[]>([])
    const [teamAvatars, setTeamAvatars] = useState<any[]>([])
    const [eventData, setEventData] = useState<any[]>([])

    const eventSelectClasses = EventSelectStyles().classes

    const [preferenceData, setPreferenceData] = useLocalStorage<any>({
        key: 'saved-preferences',
        getInitialValueInEffect: false,
    });

    const theme = useMantineTheme()

    interface CardGradientProps {
        title: string;
        description: string;
        link: string;
        teamValue: number;
    }

    function CardGradient({ title, description, link, teamValue }: CardGradientProps) {
        const { classes } = sortTeamCardStyles();
        return (
            <Paper withBorder radius="md" className={classes.card} component={"a"} href={`${link}`} target={"_blank"}>
                <ThemeIcon
                    size="xl"
                    radius="md"
                    color={"#0066b3"}
                >
                    <IconRobot size={28} stroke={1.5} />
                </ThemeIcon>
                <Text size="xl" weight={500} mt="md">
                    {title}
                </Text>
                <Text size="md" weight={400} mt="md">
                    {`${sortFieldsTeams.filter(e => e.value == selectedSortTeams)[0].label}: ${Math.round(100 * teamValue) / 100}`}
                </Text>
                <Text size="sm" mt="sm" color="dimmed">
                    {description}
                </Text>
            </Paper>
        );
    }

    const sortTypeFields = [
        "Submission",
        "Team"
    ]

    const sortDirectionFields = [
        {
            label: "Highest -> Lowest",
            value: "-1"
        },
        {
            label: "Lowest -> Highest",
            value: "1"
        }
    ]

    const sortFieldsSubmissions = [
        {
            label: "Time Submitted",
            value: "createdAt"
        },
        {
            label: "Team Number",
            value: "teamNumber"
        },
        {
            label: "Match Number",
            value: "matchNumber"
        },
        {
            label: "Auto Piece Score",
            value: "autoScoreLevel"
        },
        {
            label: "Auto Extra High",
            value: "autoExtraPiece.scored.high"
        },
        {
            label: "Auto Extra Mid",
            value: "autoExtraPiece.scored.mid"
        },
        {
            label: "Auto Extra Low",
            value: "autoExtraPiece.scored.low"
        },
        {
            label: "Teleop Cubes High",
            value: "teleop.scored.cube.high"
        },
        {
            label: "Teleop Cubes Mid",
            value: "teleop.scored.cube.mid"
        },
        {
            label: "Teleop Cubes Low",
            value: "teleop.scored.cube.low"
        },
        {
            label: "Teleop Cones High",
            value: "teleop.scored.cone.high"
        },
        {
            label: "Teleop Cones Mid",
            value: "teleop.scored.cone.mid"
        },
        {
            label: "Teleop Cones Low",
            value: "teleop.scored.cone.low"
        },
        {
            label: "Rank Points Earned",
            value: "rankPointsEarned"
        },
        {
            label: "Rank Post Match",
            value: "rankPostMatch"
        },
        {
            label: "User Rating",
            value: "userRating"
        }
    ]

    const sortFieldsTeams = [
        {
            label: "Team Number",
            value: "_id"
        },
        {
            label: "Average Score",
            value: "AvgScore"
        },
        {
            label: "Average Endgame Score",
            value: "AvgEndgame"
        },
        {
            label: "Average Auto Score",
            value: "AvgAutoScore"
        },
        {
            label: "Average Teleop Score",
            value: "AvgTeleScore"
        },
        {
            label: "Best Auto Score",
            value: "BestAuto"
        },
        {
            label: "Best Teleop Score",
            value: "BestTele"
        },
        {
            label: "Average RP Per Match",
            value: "RP"
        }
    ]

    useEffect(() => {
        (async function () {
            if (window.localStorage !== undefined) {
                const teamD = window.localStorage.getItem('teamNames');
                if (teamD) {
                    const data = await JSON.parse(teamD)
                    await setTeamData(data.teams)
                }
            }
        })()
    }, []);


    useEffect(() => {
        (async function () {
            if (window.localStorage !== undefined) {
                const teamD = window.localStorage.getItem('teamAvatars');
                if (teamD) {
                    const data = await JSON.parse(teamD)
                    await setTeamAvatars(data)
                }
            }
        })()
    }, []);

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

    useEffect(() => {
        (async function () {
            const teamsData = await GetTeamData.getAggregationData()
            setAverageData(teamsData.data)
        })()
    }, [])

    useEffect(() => {
        sortSubmissions()
    }, [selectedSortSubmissions, selectedDirectionSubmissions])

    useEffect(() => {
        sortTeams()
    }, [selectedSortTeams, selectedDirectionTeams])

    const sortSubmissions = () => {
        (async function () {
            const data = await GetTeamData.getAllFormsSorted(selectedSortSubmissions, selectedDirectionSubmissions)
            if (preferenceData.dataShow == 'all') {
                const newData = data.data
                return setFormData(newData)
            } else {
                var eventName: any
                eventName = preferenceData.dataShow
                if (preferenceData.dataShow === 'week0') eventName = 'Week 0 Event'
                if (preferenceData.dataShow === 'testing') eventName = 'Testing Event'
                const newData = data.data.filter((e: any) => {
                    return e.eventName == eventName
                })
                return setFormData(newData)
            }
        })()
    }

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

    const sortTeams = () => {
        (async function () {
            if (preferenceData.dataShow !== 'all') {
                const data = await GetTeamData.getAllTeamsSortedEvent(getEventCode(), selectedSortTeams, selectedDirectionTeams)
                return setAverageData(data.data)
            }
            const data = await GetTeamData.getAllTeamsSorted(selectedSortTeams, selectedDirectionTeams)
            return setAverageData(data.data)
        })()
    }

    const getAvatar = (teamNum: any) => {
        try {
            return teamAvatars.filter((e: any) => e.number == teamNum)[0].avatar
        } catch {
            return ''
        }
    }

    const getName = (teamNum: any) => {
        try {
            return teamData.filter((e: any) => e.number == teamNum)[0].name
        } catch {
            return `Loading...`
        }
    }

    const convertData = (number: number) => {
        if (!number) return "None"
        const data = Math.round(100 * number) / 100
        if (isNaN(data)) {
            return "None"
        }
        return data
    }

    return (
        <div className="SubmissionsContainer">
            <UpdatedHeader />
            <div className="SubmissionsHomeSection">
                <AggregationsNavbar
                    location={"Sorting"} />
                <div className="AnalyzedAveragesHome">
                    <Text
                        className="SubmissionsEventMatchesText"
                        color={theme.primaryColor}
                        ta="center"
                        fz="xl"
                        fw={700}
                    >
                        Sorting
                    </Text>

                    <div className="SortingSelectGroup">
                        <Select
                            transition="pop-top-left"
                            transitionDuration={80}
                            transitionTimingFunction="ease"
                            dropdownPosition="bottom"
                            style={{ zIndex: 30 }}
                            data={sortTypeFields}
                            placeholder="Data Type"
                            label="Type"
                            classNames={eventSelectClasses}
                            value={selectedType}
                            onFocus={() => {

                            }}
                            onChange={(event: string) => {
                                setSelectedType(event)
                            }}
                        />
                        {
                            (selectedType == "Submission")
                                ?
                                <>
                                    <Select
                                        transition="pop-top-left"
                                        transitionDuration={80}
                                        transitionTimingFunction="ease"
                                        dropdownPosition="bottom"
                                        style={{ zIndex: 20 }}
                                        data={sortFieldsSubmissions}
                                        placeholder="Sort by..."
                                        label="Sorting Field"
                                        classNames={eventSelectClasses}
                                        value={selectedSortSubmissions}
                                        onChange={(event: string) => {
                                            setSelectedSortSubmissions(event)
                                        }}
                                    />
                                    <Select
                                        transition="pop-top-left"
                                        transitionDuration={80}
                                        transitionTimingFunction="ease"
                                        dropdownPosition="bottom"
                                        style={{ zIndex: 10 }}
                                        data={sortDirectionFields}
                                        placeholder="Up or down?"
                                        label="Direction"
                                        classNames={eventSelectClasses}
                                        value={selectedDirectionSubmissions}
                                        onChange={(event: string) => {
                                            setSelectedDirectionSubmissions(event)
                                        }}
                                    />
                                </>
                                :
                                null
                        }

                        {
                            (selectedType == "Team")
                                ?
                                <>
                                    <Select
                                        transition="pop-top-left"
                                        transitionDuration={80}
                                        transitionTimingFunction="ease"
                                        dropdownPosition="bottom"
                                        style={{ zIndex: 20 }}
                                        data={sortFieldsTeams}
                                        placeholder="Sort by..."
                                        label="Sorting Field"
                                        classNames={eventSelectClasses}
                                        value={selectedSortTeams}
                                        onChange={(event: string) => {
                                            setSelectedSortTeams(event)
                                        }}
                                    />
                                    <Select
                                        transition="pop-top-left"
                                        transitionDuration={80}
                                        transitionTimingFunction="ease"
                                        dropdownPosition="bottom"
                                        style={{ zIndex: 10 }}
                                        data={sortDirectionFields}
                                        placeholder="Up or down?"
                                        label="Direction"
                                        classNames={eventSelectClasses}
                                        value={selectedDirectionTeams}
                                        onChange={(event: string) => {
                                            setSelectedDirectionTeams(event)
                                        }}
                                    />
                                </>
                                :
                                null
                        }
                    </div>

                    {(selectedType == "Submission") ? <Grid justify="center" grow w={"100%"}>
                        {formData.map((data: any, index: any) =>
                            <Grid.Col md={4} lg={3} key={index + 1}>
                                <UserInfoAction
                                    submissionNumber={index + 1}
                                    author={data.usersName}
                                    time={moment(data.createdAt).format("hh:mm A")}
                                    link={`/submissions/analysis/form/${data._id}`}
                                    teamNumber={data.teamNumber}
                                    win={data.win}
                                    rankPoints={data.rankPointsEarned}
                                    matchNumber={data.matchNumber}
                                />
                            </Grid.Col>
                        )}
                    </Grid> : null}
                    {/* {(selectedType == "Team") ? <Grid justify="center" style={{ width: '100%' }}>
                        {averageData.map((data: any, index: any) =>
                            <Grid.Col span={12} key={index + 1}>
                                <CardGradient
                                    title={`${teamData ? teamData.filter((e: any) => e.number == data._id)[0].name : `FRC Team`}`}
                                    description={`Team ${data._id}`}
                                    link={`/submissions/teams/${data._id}`}
                                    teamValue={data[selectedSortTeams]}
                                />
                            </Grid.Col>
                        )}
                    </Grid> : null} */}

                    {(selectedType == "Team") ? <SortingTeamTable
                        data={
                            averageData.map((data: any, index: any) => {
                                return {
                                    avatar: `${getAvatar(data._id)}`,
                                    teamNumber: data._id,
                                    teamName: `${getName(data._id)}`,
                                    averageScore: convertData(data.AvgScore),
                                    bestAuto: convertData(data.BestAuto),
                                    bestTele: convertData(data.BestTele),
                                    averageEndgame: convertData(data.AvgEndgame),
                                    averageAutoScore: convertData(data.AvgAutoScore),
                                    averageTeleScore: convertData(data.TeleScore),
                                    rankPoints: convertData(data.RP),
                                    defense: (data.Defense == 1) ? "Yes" : "No",
                                }
                            })
                        }
                    /> : null}
                </div>
            </div>
        </div>
    )
}

export default AnalyzedSorting