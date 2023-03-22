import { Anchor, Breadcrumbs, TextInput, Text, SegmentedControl, Group, Center, Box, NumberInput, ActionIcon, NumberInputHandlers, Transition, Affix, Button, Textarea, Slider, Notification, Select, MultiSelect, useMantineTheme } from "@mantine/core";
import { useLocalStorage, useWindowScroll } from "@mantine/hooks";
import { IconArrowUp, IconCheck, IconClick, IconMinus, IconPlus, IconX } from "@tabler/icons";
import { useEffect, useRef, useState } from "react";
import DockedSectionStyles from "../Styles/DockedSection";
import ScoreInputStyles from "../Styles/ScoreInputStyles";
import { useAuthHeader, useSignOut } from 'react-auth-kit'
import { useNavigate } from 'react-router-dom';
import { showNotification } from "@mantine/notifications";
import { UpdatedHeader } from "../Components/UpdatedHeader";
import EventSelectStyles from "../Styles/EventSelectStyles";
import GetTeamData from "../Utils/GetTeamData";
import SendToAPI from "../Utils/FormSubmit";
import { checkToken, getEventLockData } from "../Utils/ReconQueries";

function ReconForm() {

    //All the states
    const coneHighHandler = useRef<NumberInputHandlers>(null);
    const coneMidHandler = useRef<NumberInputHandlers>(null);
    const coneLowHandler = useRef<NumberInputHandlers>(null);

    const cubeHighHandler = useRef<NumberInputHandlers>(null);
    const cubeMidHandler = useRef<NumberInputHandlers>(null);
    const cubeLowHandler = useRef<NumberInputHandlers>(null);

    const extraPieceHighHandler = useRef<NumberInputHandlers>(null);
    const extraPieceMidHandler = useRef<NumberInputHandlers>(null);
    const extraPieceLowHandler = useRef<NumberInputHandlers>(null);

    const [coneHigh, setConeHigh] = useState<number | undefined>(0);
    const [coneMid, setConeMid] = useState<number | undefined>(0);
    const [coneLow, setConeLow] = useState<number | undefined>(0);

    const [cubeHigh, setCubeHigh] = useState<number | undefined>(0);
    const [cubeMid, setCubeMid] = useState<number | undefined>(0);
    const [cubeLow, setCubeLow] = useState<number | undefined>(0);

    const [extraPieceHigh, setExtraPieceHigh] = useState<number | undefined>(0);
    const [extraPieceMid, setExtraPieceMid] = useState<number | undefined>(0);
    const [extraPieceLow, setExtraPieceLow] = useState<number | undefined>(0);

    const [teamNumber, setTeamNumber] = useState("");
    const [matchNumber, setMatchNumber] = useState("");
    const [userName] = useLocalStorage<string>({
        key: 'saved-username',
        defaultValue: ''
    });
    const [isAuto, setIsAuto] = useState("false");
    const [dockedType, setDockedType] = useState("Not Docked")
    const [scoreLevel, setScoreLevel] = useState("None")
    const [taxiOption, setTaxiOption] = useState("No Taxi")
    const [dockedTypeEndgame, setDockedTypeEndgame] = useState("Not Docked")
    const [matchComments, setMatchComments] = useState("")
    const [gameWin, setGameWin] = useState("Loss")
    const [rankPointsEarned, setRankPointsEarned] = useState("")
    const [rankPostMatch, setRankPostMatch] = useState("")
    const [selfRankSliderValue, setSelfRankSliderValue] = useState<number | undefined>(1);
    const [matchPenalties, setMatchPenalties] = useState("");
    const [defenseBot, setDefenseBot] = useState("No");
    const [eventData, setEventData] = useState<any>([])
    const [selectedEvent, setSelectedEvent] = useState("")
    const [criticals, setCriticals] = useState<any[]>([])
    const [pickUpTippedCones, setPickUpTippedCones] = useState<string>("none")
    const [pickUpFloorCones, setPickUpFloorCones] = useState<string>("none")
    const [humanPlayerStation, setHumanPlayerStation] = useState<string>("dk")

    const [sessionExpired, setSessionExpired] = useState<boolean>(false)
    const [lockedEvent, setLockedEvent] = useState("")
    const [matchTeams, setMatchTeams] = useState<any>([])

    const scoreInputClasses = ScoreInputStyles().classes
    const dockedSectionClasses = DockedSectionStyles().classes
    const eventSelectClasses = EventSelectStyles().classes

    //ReactJS Hooks
    const [scroll, scrollTo] = useWindowScroll();
    const authHeader = useAuthHeader()
    const navigate = useNavigate()

    const [selected, setSelectedUser] = useLocalStorage<any>({
        key: 'saved-username',
        getInitialValueInEffect: false,
    });

    const [preferenceData, setPreferenceData] = useLocalStorage<any>({
        key: 'saved-preferences',
        getInitialValueInEffect: false,
    });
    const signOut = useSignOut();
    const theme = useMantineTheme()

    const numberInputOnWheelPreventChange = (e: any) => {
        e.target.blur()

        e.stopPropagation()
        setTimeout(() => {
            e.target.focus()
        }, 0)
    }

    useEffect(() => {
        if(matchNumber == '' && matchTeams.length !== 0) return setMatchTeams([])
    }, [matchTeams])

    useEffect(() => {
        (async function () {
            if (!selectedEvent) return
            if (!matchNumber) return setMatchTeams([])
            if (selectedEvent == 'Testing Event' || selectedEvent == 'Week 0 Event') return
            try {
                const data = await GetTeamData.getTeamsInMatchData(await getEventCode(selectedEvent), matchNumber)
                const teamsArray: any[] = [];
                data.data.red.map((team: any, index: any) => {
                    const struct = {
                        label: `Red ${index + 1} - ${team}`,
                        value: team
                    }
                    teamsArray.push(struct)
                })
                data.data.blue.map((team: any, index: any) => {
                    const struct = {
                        label: `Blue ${index + 1} - ${team}`,
                        value: team
                    }
                    teamsArray.push(struct)
                })
                return setMatchTeams(teamsArray)
            } catch (err) {
                showNotification({
                    title: 'Form Error',
                    message: 'Match not found, is this a future event?',
                    color: "red",
                })
                return setMatchTeams([])
            }
        })()
    }, [matchNumber])

    const getEventCode = async (event: any) => {
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
            const d = eventArray.filter((e: any) => {
                return e.value == event
            })[0]
            return d.eventcode
        } catch {
            return ""
        }
    }

    useEffect(() => {
        (async function () {
            const dbData = await getEventLockData(authHeader())
            if (dbData.data.event == 'none') return
            setLockedEvent(dbData.data.event)
            if (dbData.data.event == 'week0') return setSelectedEvent("Week 0 Event")
            if (dbData.data.event == 'testing') return setSelectedEvent("Testing Event")
            return setSelectedEvent(dbData.data.event)
        })()
    }, [])

    useEffect(() => {
        (async function () {
            var eventArray: any[] = [];
            eventArray.push("Testing Event")
            eventArray.push("Week 0 Event")
            const data = await GetTeamData.getTeamEventData(7028, 2023)
            data.data.map((event: any) => {
                eventArray.push(event.name)
            })
            setEventData(eventArray)
        })()
    }, [])

    useEffect(() => {
        (async function () {
            const res = await checkToken(authHeader()).catch((err) => {
                setSessionExpired(true)
                return showNotification({
                    title: 'Form Error',
                    message: 'Your session has expired! Please re-authenticate.',
                    color: "red",
                })
            })
        })()
    }, [])

    const items = [
        { title: 'Home', href: '/' },
        { title: 'New Form', href: '#' },
    ].map((item, index) => (
        <Anchor href={item.href} key={index}>
            {item.title}
        </Anchor>
    ));

    function SubmitForm(authToken: any) {

        if (!selectedEvent && !lockedEvent) return showNotification({
            title: 'Form Error',
            message: 'You need to select an event!',
            color: "red",
        })

        if (!matchNumber || !teamNumber || !userName || !rankPointsEarned || !rankPostMatch) return showNotification({
            title: 'Form Error',
            message: 'You have not filled out all the required fields!',
            color: "red",
        })

        if (Number(matchNumber) < 0 || Number(teamNumber) < 0 || Number(rankPointsEarned) < 0 || Number(rankPostMatch) < 0) return showNotification({
            title: 'Form Error',
            message: 'No value can be less than 0!',
            color: "red",
        })

        if (Number(rankPointsEarned) > 4) return showNotification({
            title: 'Form Error',
            message: 'The robot cannot earn above 4 ranking points!',
            color: "red",
        })

        const submitTeamNumber = Number(teamNumber)
        const submitMatchNumber = Number(matchNumber)
        const submitUsersName = userName
        var submitAuto = false
        var submitAutoEngaged = false
        var submitAutoDocked = false
        var submitAutoScore = 0
        var submitAutoTaxi = false
        const submitTeleopScoreCubeHigh = cubeHigh
        const submitTeleopScoreCubeMid = cubeMid
        const submitTeleopScoreCubeLow = cubeLow
        const submitTeleopScoreConeHigh = coneHigh
        const submitTeleopScoreConeMid = coneMid
        const submitTeleopScoreConeLow = coneLow
        const submitAutoExtraScoreHigh = extraPieceHigh
        const submitAutoExtraScoreMid = extraPieceMid
        const submitAutoExtraScoreLow = extraPieceLow
        var submitEndgameEngaged = false
        var submitEndgameDocked = false
        const submitComments = matchComments
        const submitRankPostMatch = Number(rankPostMatch)
        var submitWin = false;
        const submitRankPointsEarned = Number(rankPointsEarned)
        const submitPenalties = matchPenalties
        var submitDefenceOrCycle = false;
        const submitUserRating = selfRankSliderValue
        const submitEventName = selectedEvent
        const submitCriticals = criticals
        var submitPickUpTippedCones = 0
        var submitPickUpFloorCones = 0
        var submitHumanPlayerStation = 0

        if (isAuto == "true") submitAuto = true

        switch (pickUpTippedCones) {
            case "true":
                submitPickUpTippedCones = 1
                break;
            case "false":
                submitPickUpTippedCones = 0
                break;
            case "none":
                submitPickUpTippedCones = 2
                break;
        }

        switch (pickUpFloorCones) {
            case "false":
                submitPickUpFloorCones = 0
                break;
            case "true":
                submitPickUpFloorCones = 1
                break;
            case "none":
                submitPickUpFloorCones = 2
                break;
        }

        switch (humanPlayerStation) {
            case "none":
                submitHumanPlayerStation = 0
                break;
            case "single":
                submitHumanPlayerStation = 1
                break;
            case "double":
                submitHumanPlayerStation = 2
                break;
            case "both":
                submitHumanPlayerStation = 3
                break;
            case "dk":
                submitHumanPlayerStation = 4
                break;
        }

        switch (dockedType) {
            case "Docked":
                submitAutoDocked = true
                break;
            case "Engaged":
                submitAutoEngaged = true
                break;
        }

        switch (scoreLevel) {
            case "Low":
                submitAutoScore = 1
                break;
            case "Mid":
                submitAutoScore = 2
                break;
            case "High":
                submitAutoScore = 3
                break;
        }

        if (taxiOption == "Taxi") submitAutoTaxi = true

        switch (dockedTypeEndgame) {
            case "Docked":
                submitEndgameDocked = true
                break;
            case "Engaged":
                submitEndgameEngaged = true
                break;
        }

        if (gameWin == "Win") submitWin = true

        if (defenseBot == "Yes") submitDefenceOrCycle = true

        SendToAPI({
            data: {
                teamNumber: submitTeamNumber,
                matchNumber: submitMatchNumber,
                usersName: submitUsersName,
                auto: submitAuto,
                autoEngaged: submitAutoEngaged,
                autoDocked: submitAutoDocked,
                autoScoreLevel: submitAutoScore,
                autoExtraPiece: {
                    scored: {
                        high: submitAutoExtraScoreHigh,
                        mid: submitAutoExtraScoreMid,
                        low: submitAutoExtraScoreLow
                    }
                },
                autoTaxi: submitAutoTaxi,
                teleop: {
                    scored: {
                        cube: {
                            high: submitTeleopScoreCubeHigh,
                            mid: submitTeleopScoreCubeMid,
                            low: submitTeleopScoreCubeLow
                        },
                        cone: {
                            high: submitTeleopScoreConeHigh,
                            mid: submitTeleopScoreConeMid,
                            low: submitTeleopScoreConeLow
                        }
                    }
                },
                endgameEngaged: submitEndgameEngaged,
                endgameDocked: submitEndgameDocked,
                comments: submitComments,
                rankPostMatch: submitRankPostMatch,
                win: submitWin,
                rankPointsEarned: submitRankPointsEarned,
                penalties: submitPenalties,
                defenceOrCycle: submitDefenceOrCycle,
                userRating: submitUserRating,
                eventName: submitEventName,
                criticals: submitCriticals,
                pickUpTippedCones: submitPickUpTippedCones,
                pickUpFloorCones: submitPickUpFloorCones,
                humanPlayerStation: submitHumanPlayerStation
            }
        }, authToken).catch(() => {
            return showNotification({
                title: 'Form Error',
                message: 'There was an error submitting this form!',
                color: "red",
            })
        })

        navigate('/formsubmitted')

    }

    return (
        <div className="App">

            <UpdatedHeader />

            <div className="App-main">

                <>
                    <Breadcrumbs>{items}</Breadcrumbs>
                </>

                <>
                    <Affix position={{ bottom: 20, right: 20 }}>
                        <Transition transition="slide-up" mounted={scroll.y > 0}>
                            {(transitionStyles) => (
                                <Button
                                    size="sm"
                                    style={transitionStyles}
                                    onClick={() => scrollTo({ y: 0 })}
                                >
                                    <IconArrowUp size={15} />
                                </Button>
                            )}
                        </Transition>
                    </Affix>
                </>

                {sessionExpired == false ? <div className="ReconFormContainer">

                    <Text
                        color={theme.primaryColor}
                        ta="center"
                        fz="xl"
                        fw={700}
                        className="FormSubheader"
                    >
                        Pre-Game
                    </Text>

                    {!lockedEvent ? <Select
                        transition={'pop-top-left'}
                        transitionDuration={80}
                        transitionTimingFunction={'ease'}
                        dropdownPosition="bottom"
                        style={{ zIndex: 2 }}
                        data={eventData}
                        placeholder="Pick one"
                        label="Select Event"
                        classNames={eventSelectClasses}
                        required
                        onChange={(event: string) => {
                            setSelectedEvent(event)
                        }}
                    /> : <TextInput
                        type="string"
                        placeholder="Pick one"
                        label="Event locked in by Administrator."
                        description="You cannot change event selection!"
                        value={lockedEvent == 'week0' ? "Week 0 Event" : lockedEvent}
                        disabled
                        required
                        classNames={{ input: scoreInputClasses.event }}
                    />}

                    {(selectedEvent !== 'Testing Event' && selectedEvent !== 'Week 0 Event' && selectedEvent) ?
                        <>
                            {matchTeams.length !== 0 ?
                                <Select
                                    transition={'pop-top-left'}
                                    transitionDuration={80}
                                    transitionTimingFunction={'ease'}
                                    dropdownPosition="bottom"
                                    style={{ zIndex: 1 }}
                                    data={matchTeams}
                                    placeholder="Pick one"
                                    label="Select Team"
                                    classNames={eventSelectClasses}
                                    required
                                    onChange={(event: string) => {
                                        setTeamNumber(event)
                                    }}
                                /> :
                                <Select
                                    transition={'pop-top-left'}
                                    transitionDuration={80}
                                    transitionTimingFunction={'ease'}
                                    dropdownPosition="bottom"
                                    style={{ zIndex: 1 }}
                                    data={["Enter a Match Number"]}
                                    disabled
                                    value={''}
                                    placeholder="Enter a Match Number"
                                    label="Select Team"
                                    classNames={eventSelectClasses}
                                    required
                                />}
                        </>
                        : <TextInput
                            type="number"
                            placeholder="7028"
                            label="Team Number"
                            description="The number of your scouting team"
                            required={true}
                            value={teamNumber}
                            onChange={(event) => setTeamNumber(event.currentTarget.value)}
                        />}

                    <TextInput
                        onWheel={numberInputOnWheelPreventChange}
                        type="number"
                        placeholder="1"
                        label="Match Number"
                        required={true}
                        value={matchNumber}
                        onChange={(event) => {
                            setMatchNumber(event.currentTarget.value)
                        }}
                    />

                    <TextInput
                        type="string"
                        placeholder="Rue Harvey"
                        label="Your Name"
                        description="Type out Your Name"
                        value={userName}
                        disabled
                    />

                    <Text
                        color={theme.primaryColor}
                        ta="center"
                        fz="xl"
                        fw={700}
                        className="FormSubheader"
                    >
                        Autonomous
                    </Text>

                    <Group position="center" my="xl">
                        <SegmentedControl
                            value={isAuto}
                            onChange={(value: "true" | "false") => setIsAuto(value)}
                            data={[
                                {
                                    value: 'false',
                                    label: (
                                        <Center>
                                            <IconX size={16} stroke={1.5} />
                                            <Box ml={10}>No Auto</Box>
                                        </Center>
                                    ),
                                },
                                {
                                    value: 'true',
                                    label: (
                                        <Center>
                                            <IconCheck size={16} stroke={1.5} />
                                            <Box ml={10}>Auto</Box>
                                        </Center>
                                    ),
                                },
                            ]}
                        />
                    </Group>

                    {isAuto == "true" &&
                        <div className="AutoContainer">

                            <div className="DockedLevel">
                                <Text c="dimmed">Robot Dock Level</Text>
                                <SegmentedControl
                                    radius="xl"
                                    size="md"
                                    data={['Not Docked', 'Docked', 'Engaged']}
                                    value={dockedType}
                                    onChange={(value) => {
                                        setDockedType(value)
                                    }}
                                    classNames={dockedSectionClasses}
                                />
                            </div>
                            <div className="TeleopScoreCones">
                                <Text
                                    color={theme.primaryColor}
                                    ta="center"
                                    fz="xl"
                                    fw={700}
                                    className="ScoreSubHeader"
                                >
                                    Auto Pieces
                                </Text>
                                <Text c="dimmed">High Pieces</Text>
                                <div className={scoreInputClasses.wrapper}>
                                    <ActionIcon<'button'>
                                        size={28}
                                        variant="transparent"
                                        onClick={() => extraPieceHighHandler.current?.decrement()}
                                        disabled={extraPieceHigh === 0}
                                        className={scoreInputClasses.control}
                                        onMouseDown={(event) => event.preventDefault()}
                                    >
                                        <IconMinus size={16} stroke={1.5} />
                                    </ActionIcon>

                                    <NumberInput
                                        variant="unstyled"
                                        min={0}
                                        max={50}
                                        handlersRef={extraPieceHighHandler}
                                        value={extraPieceHigh}
                                        onChange={setExtraPieceHigh}
                                        classNames={{ input: scoreInputClasses.input }}
                                    />

                                    <ActionIcon<'button'>
                                        size={28}
                                        variant="transparent"
                                        onClick={() => extraPieceHighHandler.current?.increment()}
                                        disabled={extraPieceHigh === 50}
                                        className={scoreInputClasses.control}
                                        onMouseDown={(event) => event.preventDefault()}
                                    >
                                        <IconPlus size={16} stroke={1.5} />
                                    </ActionIcon>
                                </div>

                                <Text c="dimmed">Mid Pieces</Text>
                                <div className={scoreInputClasses.wrapper}>
                                    <ActionIcon<'button'>
                                        size={28}
                                        variant="transparent"
                                        onClick={() => extraPieceMidHandler.current?.decrement()}
                                        disabled={extraPieceMid === 0}
                                        className={scoreInputClasses.control}
                                        onMouseDown={(event) => event.preventDefault()}
                                    >
                                        <IconMinus size={16} stroke={1.5} />
                                    </ActionIcon>

                                    <NumberInput
                                        variant="unstyled"
                                        min={0}
                                        max={50}
                                        handlersRef={extraPieceMidHandler}
                                        value={extraPieceMid}
                                        onChange={setExtraPieceMid}
                                        classNames={{ input: scoreInputClasses.input }}
                                    />

                                    <ActionIcon<'button'>
                                        size={28}
                                        variant="transparent"
                                        onClick={() => extraPieceMidHandler.current?.increment()}
                                        disabled={extraPieceMid === 50}
                                        className={scoreInputClasses.control}
                                        onMouseDown={(event) => event.preventDefault()}
                                    >
                                        <IconPlus size={16} stroke={1.5} />
                                    </ActionIcon>
                                </div>

                                <Text c="dimmed">Low Pieces</Text>
                                <div className={scoreInputClasses.wrapper}>
                                    <ActionIcon<'button'>
                                        size={28}
                                        variant="transparent"
                                        onClick={() => extraPieceLowHandler.current?.decrement()}
                                        disabled={extraPieceLow === 0}
                                        className={scoreInputClasses.control}
                                        onMouseDown={(event) => event.preventDefault()}
                                    >
                                        <IconMinus size={16} stroke={1.5} />
                                    </ActionIcon>

                                    <NumberInput
                                        variant="unstyled"
                                        min={0}
                                        max={50}
                                        handlersRef={extraPieceLowHandler}
                                        value={extraPieceLow}
                                        onChange={setExtraPieceLow}
                                        classNames={{ input: scoreInputClasses.input }}
                                    />

                                    <ActionIcon<'button'>
                                        size={28}
                                        variant="transparent"
                                        onClick={() => extraPieceLowHandler.current?.increment()}
                                        disabled={extraPieceLow === 50}
                                        className={scoreInputClasses.control}
                                        onMouseDown={(event) => event.preventDefault()}
                                    >
                                        <IconPlus size={16} stroke={1.5} />
                                    </ActionIcon>
                                </div>
                            </div>
                            <div className="Taxi">
                                <Text c="dimmed">Did they leave the community during auto?</Text>
                                <SegmentedControl
                                    radius="xl"
                                    size="md"
                                    data={[{ label: "No", value: "No Taxi" }, { label: "Yes", value: "Taxi" }]}
                                    value={taxiOption}
                                    onChange={(value) => {
                                        setTaxiOption(value)
                                    }}
                                    classNames={dockedSectionClasses}
                                />
                            </div>
                        </div>
                    }

                    <Text
                        color={theme.primaryColor}
                        ta="center"
                        fz="xl"
                        fw={700}
                        className="FormSubheader"
                    >
                        Teleop
                    </Text>

                    <div className="TeleopScoreBox">
                        <div className="TeleopScoreCones">
                            <Text
                                color={theme.primaryColor}
                                ta="center"
                                fz="xl"
                                fw={700}
                                className="ScoreSubHeader"
                            >
                                Cones
                            </Text>
                            <Text c="dimmed">High Cones</Text>
                            <div className={scoreInputClasses.wrapper}>
                                <ActionIcon<'button'>
                                    size={28}
                                    variant="transparent"
                                    onClick={() => coneHighHandler.current?.decrement()}
                                    disabled={coneHigh === 0}
                                    className={scoreInputClasses.control}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <IconMinus size={16} stroke={1.5} />
                                </ActionIcon>

                                <NumberInput
                                    variant="unstyled"
                                    min={0}
                                    max={50}
                                    handlersRef={coneHighHandler}
                                    value={coneHigh}
                                    onChange={setConeHigh}
                                    classNames={{ input: scoreInputClasses.input }}
                                />

                                <ActionIcon<'button'>
                                    size={28}
                                    variant="transparent"
                                    onClick={() => coneHighHandler.current?.increment()}
                                    disabled={coneHigh === 50}
                                    className={scoreInputClasses.control}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <IconPlus size={16} stroke={1.5} />
                                </ActionIcon>
                            </div>

                            <Text c="dimmed">Mid Cones</Text>
                            <div className={scoreInputClasses.wrapper}>
                                <ActionIcon<'button'>
                                    size={28}
                                    variant="transparent"
                                    onClick={() => coneMidHandler.current?.decrement()}
                                    disabled={coneMid === 0}
                                    className={scoreInputClasses.control}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <IconMinus size={16} stroke={1.5} />
                                </ActionIcon>

                                <NumberInput
                                    variant="unstyled"
                                    min={0}
                                    max={50}
                                    handlersRef={coneMidHandler}
                                    value={coneMid}
                                    onChange={setConeMid}
                                    classNames={{ input: scoreInputClasses.input }}
                                />

                                <ActionIcon<'button'>
                                    size={28}
                                    variant="transparent"
                                    onClick={() => coneMidHandler.current?.increment()}
                                    disabled={coneMid === 50}
                                    className={scoreInputClasses.control}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <IconPlus size={16} stroke={1.5} />
                                </ActionIcon>
                            </div>

                            <Text c="dimmed">Low Cones</Text>
                            <div className={scoreInputClasses.wrapper}>
                                <ActionIcon<'button'>
                                    size={28}
                                    variant="transparent"
                                    onClick={() => coneLowHandler.current?.decrement()}
                                    disabled={coneLow === 0}
                                    className={scoreInputClasses.control}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <IconMinus size={16} stroke={1.5} />
                                </ActionIcon>

                                <NumberInput
                                    variant="unstyled"
                                    min={0}
                                    max={50}
                                    handlersRef={coneLowHandler}
                                    value={coneLow}
                                    onChange={setConeLow}
                                    classNames={{ input: scoreInputClasses.input }}
                                />

                                <ActionIcon<'button'>
                                    size={28}
                                    variant="transparent"
                                    onClick={() => coneLowHandler.current?.increment()}
                                    disabled={coneLow === 50}
                                    className={scoreInputClasses.control}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <IconPlus size={16} stroke={1.5} />
                                </ActionIcon>
                            </div>
                        </div>

                        <div className="TeleopScoreCubes">
                            <Text
                                color={theme.primaryColor}
                                ta="center"
                                fz="xl"
                                fw={700}
                                className="ScoreSubHeader"
                            >
                                Cubes
                            </Text>
                            <Text c="dimmed">High Cubes</Text>
                            <div className={scoreInputClasses.wrapper}>
                                <ActionIcon<'button'>
                                    size={28}
                                    variant="transparent"
                                    onClick={() => cubeHighHandler.current?.decrement()}
                                    disabled={cubeHigh === 0}
                                    className={scoreInputClasses.control}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <IconMinus size={16} stroke={1.5} />
                                </ActionIcon>

                                <NumberInput
                                    variant="unstyled"
                                    min={0}
                                    max={50}
                                    handlersRef={cubeHighHandler}
                                    value={cubeHigh}
                                    onChange={setCubeHigh}
                                    classNames={{ input: scoreInputClasses.input }}
                                />

                                <ActionIcon<'button'>
                                    size={28}
                                    variant="transparent"
                                    onClick={() => cubeHighHandler.current?.increment()}
                                    disabled={cubeHigh === 50}
                                    className={scoreInputClasses.control}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <IconPlus size={16} stroke={1.5} />
                                </ActionIcon>
                            </div>

                            <Text c="dimmed">Mid Cubes</Text>
                            <div className={scoreInputClasses.wrapper}>
                                <ActionIcon<'button'>
                                    size={28}
                                    variant="transparent"
                                    onClick={() => cubeMidHandler.current?.decrement()}
                                    disabled={cubeMid === 0}
                                    className={scoreInputClasses.control}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <IconMinus size={16} stroke={1.5} />
                                </ActionIcon>

                                <NumberInput
                                    variant="unstyled"
                                    min={0}
                                    max={50}
                                    handlersRef={cubeMidHandler}
                                    value={cubeMid}
                                    onChange={setCubeMid}
                                    classNames={{ input: scoreInputClasses.input }}
                                />

                                <ActionIcon<'button'>
                                    size={28}
                                    variant="transparent"
                                    onClick={() => cubeMidHandler.current?.increment()}
                                    disabled={cubeMid === 50}
                                    className={scoreInputClasses.control}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <IconPlus size={16} stroke={1.5} />
                                </ActionIcon>
                            </div>

                            <Text c="dimmed">Low Cubes</Text>
                            <div className={scoreInputClasses.wrapper}>
                                <ActionIcon<'button'>
                                    size={28}
                                    variant="transparent"
                                    onClick={() => cubeLowHandler.current?.decrement()}
                                    disabled={cubeLow === 0}
                                    className={scoreInputClasses.control}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <IconMinus size={16} stroke={1.5} />
                                </ActionIcon>

                                <NumberInput
                                    variant="unstyled"
                                    min={0}
                                    max={50}
                                    handlersRef={cubeLowHandler}
                                    value={cubeLow}
                                    onChange={setCubeLow}
                                    classNames={{ input: scoreInputClasses.input }}
                                />

                                <ActionIcon<'button'>
                                    size={28}
                                    variant="transparent"
                                    onClick={() => cubeLowHandler.current?.increment()}
                                    disabled={cubeLow === 50}
                                    className={scoreInputClasses.control}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <IconPlus size={16} stroke={1.5} />
                                </ActionIcon>
                            </div>
                        </div>
                    </div>

                    <Text
                        color={theme.primaryColor}
                        ta="center"
                        fz="xl"
                        fw={700}
                        className="FormSubheader"
                    >
                        Endgame
                    </Text>

                    <div className="DockedLevel">
                        <Text c="dimmed">Endgame Robot Dock Level</Text>
                        <SegmentedControl
                            radius="xl"
                            size="md"
                            data={['Not Docked', 'Docked', 'Engaged']}
                            value={dockedTypeEndgame}
                            onChange={(value) => {
                                setDockedTypeEndgame(value)
                            }}
                            classNames={dockedSectionClasses}
                        />
                    </div>

                    <Text
                        color={theme.primaryColor}
                        ta="center"
                        fz="xl"
                        fw={700}
                        className="FormSubheader"
                    >
                        Post-Match
                    </Text>

                    <Textarea
                        placeholder="Anything that the robot did that would be helpful to know. Both good and bad."
                        label="Match Comments"
                        autosize
                        minRows={1}
                        className="CommentsTextBox"
                        value={matchComments}
                        onChange={((event) => {
                            setMatchComments(event.currentTarget.value)
                        })}
                    />

                    <div className="DockedLevel">
                        <Text c="dimmed">Did they pick up tipped cones?</Text>
                        <SegmentedControl
                            radius="xl"
                            size="md"
                            data={[
                                { label: "I Don't Know", value: "none" },
                                { label: "Yes", value: "true" },
                                { label: "No", value: "false" },
                            ]}
                            value={pickUpTippedCones}
                            onChange={(value) => {
                                setPickUpTippedCones(value)
                            }}
                            classNames={dockedSectionClasses}
                        />
                    </div>

                    <div className="DockedLevel">
                        <Text c="dimmed">Did they pick cones up off the floor?</Text>
                        <SegmentedControl
                            radius="xl"
                            size="md"
                            data={[
                                { label: "I Don't Know", value: "none" },
                                { label: "Yes", value: "true" },
                                { label: "No", value: "false" },
                            ]}
                            value={pickUpFloorCones}
                            onChange={(value) => {
                                setPickUpFloorCones(value)
                            }}
                            classNames={dockedSectionClasses}
                        />
                    </div>

                    <div className="DockedLevel">
                        <Text c="dimmed">Which Human Player Station did they use?</Text>
                        <SegmentedControl
                            radius="xl"
                            size="md"
                            data={[
                                { label: "I Don't Know", value: "dk" },
                                { label: "None", value: "none" },
                                { label: "Single", value: "single" },
                                { label: "Double", value: "double" },
                                { label: "Both", value: "both" },
                            ]}
                            value={humanPlayerStation}
                            onChange={(value) => {
                                setHumanPlayerStation(value)
                            }}
                            classNames={dockedSectionClasses}
                        />
                    </div>

                    <div className="DockedLevel">
                        <Text c="dimmed">Match Result</Text>
                        <SegmentedControl
                            radius="xl"
                            size="md"
                            data={['Loss', 'Win']}
                            value={gameWin}
                            onChange={(value) => {
                                setGameWin(value)
                            }}
                            classNames={dockedSectionClasses}
                        />
                    </div>

                    <TextInput
                        onWheel={numberInputOnWheelPreventChange}
                        type="number"
                        placeholder="2"
                        label="Rank Points Earned"
                        description="The number of ranking points earned"
                        required={true}
                        value={rankPointsEarned}
                        onChange={(event) => setRankPointsEarned(event.currentTarget.value)}
                    />

                    <TextInput
                        onWheel={numberInputOnWheelPreventChange}
                        type="number"
                        placeholder="1"
                        label="Rank Post Match"
                        description="The robot's post-match rank."
                        required={true}
                        value={rankPostMatch}
                        onChange={(event) => setRankPostMatch(event.currentTarget.value)}
                    />
                    <Text c="dimmed">Self Rank of Robot</Text>

                    <Slider
                        step={1}
                        min={1}
                        max={5}
                        label={(value) => {
                            switch (value) {
                                case 1:
                                    return "(1) Kill it before it lays eggs!"
                                case 2:
                                    return "(2) Grade C Robot"
                                case 3:
                                    return "(3) It's average ig."
                                case 4:
                                    return "(4) Exceeds expectations"
                                case 5:
                                    return "(5) Marry it on the spot."
                                default:
                                    return value
                            }
                        }}
                        labelAlwaysOn
                        className="SelfSlider"
                        value={selfRankSliderValue}
                        onChange={(value) => {
                            setSelfRankSliderValue(value)
                        }}
                    />

                    <Textarea
                        placeholder="Did you see any penalties given to your robot, if so what was it?"
                        label="Penalties (Optional)"
                        autosize
                        minRows={1}
                        className="CommentsTextBox"
                        value={matchPenalties}
                        onChange={((event) => {
                            setMatchPenalties(event.currentTarget.value)
                        })}
                    />

                    <div className="DockedLevel">
                        <Text c="dimmed">Was the bot a Defense bot?</Text>
                        <SegmentedControl
                            radius="xl"
                            size="md"
                            data={['No', 'Yes']}
                            value={defenseBot}
                            onChange={(value) => {
                                setDefenseBot(value)
                            }}
                            classNames={dockedSectionClasses}
                        />
                    </div>

                    <MultiSelect
                        data={['Robot Died', 'Robot Tipped', 'Red Card', 'Mechanism Broke', 'Bumper Malfunction']}
                        label="Criticals"
                        description="Add quick tags to your submission."
                        placeholder="Choose Criticals"
                        searchable
                        value={criticals}
                        onChange={(event) => {
                            setCriticals(event)
                        }}
                        nothingFound="Nothing found"
                    />

                    <div className="FormSubmitButton">
                        <Button
                            variant="light"
                            rightIcon={
                                <IconClick size={20} stroke={1.5} />
                            }
                            radius="xl"
                            size="md"
                            styles={{
                                root: { paddingRight: 14, height: 48 },
                            }}
                            onClick={() => {
                                SubmitForm(authHeader())
                            }}
                        >
                            Submit Form
                        </Button>
                    </div>
                </div>
                    : <div className="ReconFormContainer">

                        <Notification radius={'xl'} icon={<IconX size={18} />} color="red" mt={20} disallowClose>
                            Session Expired! Please Re-Authenticate!
                        </Notification>

                        <Button variant="filled" radius="xl" size="md" color={theme.colors[theme.primaryColor][8]} onClick={() => {
                            signOut();
                            navigate("/login");
                        }}>
                            Logout
                        </Button>
                    </div>}

            </div>
        </div>
    )
}

export default ReconForm;
