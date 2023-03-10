import { AggregationsNavbar } from "../Components/AggregationsNavbar"
import { UpdatedHeader } from "../Components/UpdatedHeader"
import { Button, Flex, Grid, Paper, Select, Text, TextInput, useMantineTheme } from '@mantine/core'
import { useEffect, useState } from "react";
import GetTeamData from "../Utils/GetTeamData";
import moment from "moment";
import EventSelectStyles from "../Styles/EventSelectStyles";
import { IconX } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";
import useStateWithCallback from "../Utils/useStateWithCallback";
import { useLocalStorage } from "@mantine/hooks";
import { SortingTeamTable } from "../Components/SortingTeamTable";

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

function UserInfoAction({ matchNumber, author, link, teamNumber, win, rankPoints }: SubmissionActionProps) {

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
            <Text align="center" size="xs" color="white">
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

function AnalyzedFiltering() {

    const [submissionFormData, setSubmissionFormData] = useStateWithCallback([])
    const [submissionAPIData, setSubmissionAPIData] = useState<any[]>([])
    const [teamFormData, setTeamFormData] = useStateWithCallback([])
    const [teamAPIData, setTeamAPIData] = useState<any[]>([])
    const [filterInput, setFilterInput] = useState("")
    const [numberInput, setNumberInput] = useState("")
    const [operatorInput, setOperatorInput] = useState("")
    const [submissionFilterData, setSubmissionFilterData] = useStateWithCallback([])
    const [teamFilterData, setTeamFilterData] = useStateWithCallback([])
    const [selectedType, setSelectedType] = useState("")
    const [selectedSortSubmissions, setSelectedSortSubmissions] = useState("createdAt")
    const [selectedSortTeams, setSelectedSortTeams] = useState("_id")
    const [selectedDirectionSubmissions, setSelectedDirectionSubmissions] = useState("-1")
    const [selectedDirectionTeams, setSelectedDirectionTeams] = useState("1")
    const [eventData, setEventData] = useState<any[]>([])
    const [teamData, setTeamData] = useState<any[]>([])
    const [teamAvatars, setTeamAvatars] = useState<any[]>([])
    const eventSelectClasses = EventSelectStyles().classes

    const [preferenceData, setPreferenceData] = useLocalStorage<any>({
        key: 'saved-preferences',
        getInitialValueInEffect: false,
    });

    const theme = useMantineTheme()

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

    const filterFieldsTeams = [
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

    const filterFieldsSubmissions = [
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

    const operandData = [
        { label: "Less than", value: "<" },
        { label: "Less than or Equal", value: "<=" },
        { label: "Equal", value: "==" },
        { label: "Greater than or Equal", value: ">=" },
        { label: "Greater than", value: ">" }
    ]

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

    const newSubmissionFilter = () => {

        if (!filterInput || !numberInput || !operatorInput) return showNotification({
            title: 'Filtering Error',
            message: 'Values missing or invalid!',
            color: "red",
        })
        setSubmissionFilterData((oldData: any) => [...oldData, { type: filterInput, number: numberInput, operand: operatorInput }])
        setFilterInput("")
        setNumberInput("")
        setOperatorInput("")
    }

    const deleteSubmissionFilter = async (num: any) => {
        const newData = submissionFilterData.filter((e: any, index: any) => index !== num)
        setSubmissionFilterData(newData)
    }

    const newTeamFilter = () => {

        if (!filterInput || !numberInput || !operatorInput) return showNotification({
            title: 'Filtering Error',
            message: 'Values missing or invalid!',
            color: "red",
        })
        setTeamFilterData((oldData: any) => [...oldData, { type: filterInput, number: numberInput, operand: operatorInput }])
        setFilterInput("")
        setNumberInput("")
        setOperatorInput("")
    }

    const deleteTeamFilter = async (num: any) => {
        const newData = teamFilterData.filter((e: any, index: any) => index !== num)
        setTeamFilterData(newData)
    }

    useEffect(() => {
        updateSubmissionFilters(submissionFilterData)
    }, [submissionFilterData]);

    useEffect(() => {
        updateTeamFilters(teamFilterData)
    }, [teamFilterData]);

    useEffect(() => {
        updateSubmissionFilters(submissionFilterData)
    }, [selectedSortSubmissions, selectedDirectionSubmissions])

    useEffect(() => {
        updateTeamFilters(teamFilterData)
    }, [selectedSortTeams, selectedDirectionTeams])

    const updateSubmissionFilters = async (data: any) => {
        const sortData = await GetTeamData.getAllFormsSorted(selectedSortSubmissions, selectedDirectionSubmissions)
        var newSortData: any[] = sortData.data
        if (preferenceData.dataShow !== "all") {
            if (preferenceData.dataShow == 'testing') {
                newSortData = sortData.data.filter((e: any) => {
                    return e.eventName == "Testing Event"
                })
            }
            if (preferenceData.dataShow == 'week0') {
                newSortData = sortData.data.filter((e: any) => {
                    return e.eventName == "Week 0 Event"
                })
            }
            else return newSortData = sortData.data.filter((e: any) => {
                return e.eventName == preferenceData.dataShow
            })
        }

        var filtered: any[] = newSortData;

        data.map((data: any) => {
            const filterMock = { type: data.type, number: data.number, operand: data.operand }

            function calc(a: any, operand: any, b: any) {
                switch (operand) {
                    case "<":
                        return a < b
                    case "<=":
                        return a <= b
                    case "==":
                        return a == b
                    case ">=":
                        return a >= b
                    case ">":
                        return a > b
                }
            }

            filtered = filtered
                .filter((e: any) => {
                    switch (filterMock.type) {
                        case "autoExtraPiece.scored.high":
                            return calc(e.autoExtraPiece.scored.high, filterMock.operand, filterMock.number)
                        case "autoExtraPiece.scored.mid":
                            return calc(e.autoExtraPiece.scored.mid, filterMock.operand, filterMock.number)
                        case "autoExtraPiece.scored.low":
                            return calc(e.autoExtraPiece.scored.low, filterMock.operand, filterMock.number)
                        case "teleop.scored.cube.high":
                            return calc(e.teleop.scored.cube.high, filterMock.operand, filterMock.number)
                        case "teleop.scored.cube.mid":
                            return calc(e.teleop.scored.cube.mid, filterMock.operand, filterMock.number)
                        case "teleop.scored.cube.low":
                            return calc(e.teleop.scored.cube.low, filterMock.operand, filterMock.number)
                        case "teleop.scored.cone.high":
                            return calc(e.teleop.scored.cone.high, filterMock.operand, filterMock.number)
                        case "teleop.scored.cone.mid":
                            return calc(e.teleop.scored.cone.mid, filterMock.operand, filterMock.number)
                        case "teleop.scored.cone.low":
                            return calc(e.teleop.scored.cone.low, filterMock.operand, filterMock.number)
                        default:
                            return calc(e[filterMock.type], filterMock.operand, filterMock.number)
                    }
                })
        })

        setSubmissionFormData(filtered)
    }

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

    const updateTeamFilters = async (data: any) => {
        var sortData: any;

        preferenceData.dataShow == 'all' ? sortData = await GetTeamData.getAllTeamsSorted(selectedSortTeams, selectedDirectionTeams) : sortData = await GetTeamData.getAllTeamsSortedEvent(getEventCode(), selectedSortTeams, selectedDirectionTeams)

        var filtered: any[] = sortData.data;

        data.map((data: any) => {
            const filterMock = { type: data.type, number: data.number, operand: data.operand }

            function calc(a: any, operand: any, b: any) {
                switch (operand) {
                    case "<":
                        return a < b
                    case "<=":
                        return a <= b
                    case "==":
                        return a == b
                    case ">=":
                        return a >= b
                    case ">":
                        return a > b
                }
            }

            filtered = filtered
                .filter((e: any) => {
                    return calc(e[filterMock.type], filterMock.operand, filterMock.number)
                })
        })

        setTeamFormData(filtered)
    }

    useEffect(() => {
        (async function () {
            if (preferenceData.dataShow == 'all') {
                const teamData = await GetTeamData.getAllTeamsSorted(selectedSortTeams, selectedDirectionTeams)
                setTeamAPIData(teamData.data)
                return setTeamFormData(teamData.data)
            } else {
                const teamData = await GetTeamData.getAllTeamsSortedEvent(getEventCode(), selectedSortTeams, selectedDirectionTeams)
                setTeamAPIData(teamData.data)
                return setTeamFormData(teamData.data)
            }
        })()
    }, [])

    useEffect(() => {
        (async function () {
            if (preferenceData.dataShow == 'all') {
                const submissionData = await GetTeamData.getAllFormSorting()
                setSubmissionAPIData(submissionData.data)
                return setSubmissionFormData(submissionData.data)
            } else {
                var eventName: any
                const submissionData = await GetTeamData.getAllFormSorting()
                eventName = preferenceData.dataShow
                if (preferenceData.dataShow === 'week0') eventName = 'Week 0 Event'
                if (preferenceData.dataShow === 'testing') eventName = 'Testing Event'
                const newData = submissionData.data.filter((e: any) => {
                    return e.eventName == eventName
                })
                setSubmissionAPIData(newData)
                return setSubmissionFormData(newData)
            }
        })()
    }, [])

    return (
        <div className="SubmissionsContainer">
            <UpdatedHeader />
            <div className="SubmissionsHomeSection">
                <AggregationsNavbar
                    location={"Filtering"} />
                <div className="AnalyzedAveragesHome">
                    <Text
                        className="SubmissionsEventMatchesText"
                        color={theme.primaryColor}
                        ta="center"
                        fz="xl"
                        fw={700}
                    >
                        Filtering
                    </Text>

                    <Select
                        transition="pop-top-left"
                        transitionDuration={80}
                        transitionTimingFunction="ease"
                        dropdownPosition="bottom"
                        style={{ zIndex: 50 }}
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

                    {selectedType == "Submission" ? <>
                        {submissionFilterData.map((e: any, index: any) =>
                            <Flex
                                key={index}
                                justify="center"
                                align="center"
                                wrap="wrap"
                                gap={"15px"}
                                className="AnalyzeFilteringFlex">
                                <Select
                                    clearable
                                    transition="pop-top-left"
                                    transitionDuration={80}
                                    transitionTimingFunction="ease"
                                    dropdownPosition="bottom"
                                    style={{ zIndex: 40 }}
                                    data={filterFieldsSubmissions}
                                    placeholder="Data Type"
                                    label="Filter By"
                                    classNames={eventSelectClasses}
                                    value={e.type}
                                    readOnly
                                />

                                <Select
                                    clearable
                                    transition="pop-top-left"
                                    transitionDuration={80}
                                    transitionTimingFunction="ease"
                                    dropdownPosition="bottom"
                                    style={{ zIndex: 30 }}
                                    data={operandData}
                                    placeholder="Operator Type"
                                    label="Operator"
                                    classNames={eventSelectClasses}
                                    value={e.operand}
                                    readOnly
                                />

                                <TextInput
                                    placeholder="Number Input"
                                    value={e.number}
                                    label={"Number"}
                                    readOnly
                                />

                                <Button onClick={() => {
                                    deleteSubmissionFilter(index)
                                }}>
                                    <IconX></IconX>
                                </Button>
                            </Flex>
                        )}

                        <Flex
                            justify="center"
                            align="center"
                            wrap="wrap"
                            gap={"15px"}
                            className="AnalyzeFilteringFlex">
                            <Select
                                clearable
                                transition="pop-top-left"
                                transitionDuration={80}
                                transitionTimingFunction="ease"
                                dropdownPosition="bottom"
                                style={{ zIndex: 40 }}
                                data={filterFieldsSubmissions}
                                placeholder="Data Type"
                                label="Filter By"
                                classNames={eventSelectClasses}
                                value={filterInput}
                                onFocus={() => {

                                }}
                                onChange={(event: string) => {
                                    setFilterInput(event)
                                }}
                            />

                            <Select
                                clearable
                                transition="pop-top-left"
                                transitionDuration={80}
                                transitionTimingFunction="ease"
                                dropdownPosition="bottom"
                                style={{ zIndex: 30 }}
                                data={operandData}
                                placeholder="Operator Type"
                                label="Operator"
                                classNames={eventSelectClasses}
                                value={operatorInput}
                                onFocus={() => {

                                }}
                                onChange={(event: string) => {
                                    setOperatorInput(event)
                                }}
                            />

                            <TextInput
                                placeholder="Number Input"
                                value={numberInput}
                                label={"Number"}
                                onChange={(event) => {
                                    setNumberInput(event.currentTarget.value)
                                }}
                            />

                            <Button onClick={() => {
                                newSubmissionFilter()
                            }}>
                                Filter
                            </Button>
                        </Flex>

                        <Flex
                            justify="center"
                            align="center"
                            wrap="wrap"
                            gap={"15px"}
                            className="AnalyzeFilteringFlex">
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
                        </Flex>

                        <Grid justify="center" grow w={"100%"}>
                            {submissionFormData.map((data: any, index: any) =>
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
                        </Grid>
                    </>
                        : null}
                    {selectedType == 'Team' ? <>
                        {teamFilterData.map((e: any, index: any) =>
                            <Flex
                                key={index}
                                justify="center"
                                align="center"
                                wrap="wrap"
                                gap={"15px"}
                                className="AnalyzeFilteringFlex">
                                <Select
                                    clearable
                                    transition="pop-top-left"
                                    transitionDuration={80}
                                    transitionTimingFunction="ease"
                                    dropdownPosition="bottom"
                                    style={{ zIndex: 40 }}
                                    data={filterFieldsTeams}
                                    placeholder="Data Type"
                                    label="Filter By"
                                    classNames={eventSelectClasses}
                                    value={e.type}
                                    readOnly
                                />

                                <Select
                                    clearable
                                    transition="pop-top-left"
                                    transitionDuration={80}
                                    transitionTimingFunction="ease"
                                    dropdownPosition="bottom"
                                    style={{ zIndex: 30 }}
                                    data={operandData}
                                    placeholder="Operator Type"
                                    label="Operator"
                                    classNames={eventSelectClasses}
                                    value={e.operand}
                                    readOnly
                                />

                                <TextInput
                                    placeholder="Number Input"
                                    value={e.number}
                                    label={"Number"}
                                    readOnly
                                />

                                <Button onClick={() => {
                                    deleteTeamFilter(index)
                                }}>
                                    <IconX></IconX>
                                </Button>
                            </Flex>
                        )}

                        <Flex
                            justify="center"
                            align="center"
                            wrap="wrap"
                            gap={"15px"}
                            className="AnalyzeFilteringFlex">
                            <Select
                                clearable
                                transition="pop-top-left"
                                transitionDuration={80}
                                transitionTimingFunction="ease"
                                dropdownPosition="bottom"
                                style={{ zIndex: 40 }}
                                data={filterFieldsTeams}
                                placeholder="Data Type"
                                label="Filter By"
                                classNames={eventSelectClasses}
                                value={filterInput}
                                onFocus={() => {

                                }}
                                onChange={(event: string) => {
                                    setFilterInput(event)
                                }}
                            />

                            <Select
                                clearable
                                transition="pop-top-left"
                                transitionDuration={80}
                                transitionTimingFunction="ease"
                                dropdownPosition="bottom"
                                style={{ zIndex: 30 }}
                                data={operandData}
                                placeholder="Operator Type"
                                label="Operator"
                                classNames={eventSelectClasses}
                                value={operatorInput}
                                onFocus={() => {

                                }}
                                onChange={(event: string) => {
                                    setOperatorInput(event)
                                }}
                            />

                            <TextInput
                                placeholder="Number Input"
                                value={numberInput}
                                label={"Number"}
                                onChange={(event) => {
                                    setNumberInput(event.currentTarget.value)
                                }}
                            />

                            <Button onClick={() => {
                                newTeamFilter()
                            }}>
                                Filter
                            </Button>
                        </Flex>

                        <Flex
                            justify="center"
                            align="center"
                            wrap="wrap"
                            gap={"15px"}
                            className="AnalyzeFilteringFlex">
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
                        </Flex>

                        <SortingTeamTable
                            data={
                                teamFormData.map((data: any, index: any) => {
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
                        />
                    </> : null}
                </div>
            </div>
        </div>
    )
}

export default AnalyzedFiltering