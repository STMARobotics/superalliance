import { Anchor, Breadcrumbs, TextInput, Text, SegmentedControl, Group, Center, Box, NumberInput, ActionIcon, NumberInputHandlers, Transition, Affix, Button, Textarea, Slider, Notification, Select, MultiSelect, useMantineTheme, Checkbox } from "@mantine/core";
import { useLocalStorage, useWindowScroll } from "@mantine/hooks";
import { IconAlignLeft, IconArrowUp, IconCheck, IconClick, IconMinus, IconPlus, IconX } from "@tabler/icons";
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
    const autoAmpNotesHandler = useRef<NumberInputHandlers>(null);
    const autoSpeakerNotesHandler = useRef<NumberInputHandlers>(null);

    const ampNotesHandler = useRef<NumberInputHandlers>(null);
    const speakerNotesHandler = useRef<NumberInputHandlers>(null);

    const trapNotesHandler = useRef<NumberInputHandlers>(null);

    const [autoAmpNotes, setAutoAmpNotes] = useState<number | undefined>(0);
    const [autoSpeakerNotes, setAutoSpeakerNotes] = useState<number | undefined>(0);

    const [ampNotes, setAmpNotes] = useState<number | undefined>(0);
    const [speakerNotes, setSpeakerNotes] = useState<number | undefined>(0);

    
    const [trapNotes, setTrapNotes] = useState<number | undefined>(0);


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
    const [pickUpFloorRings, setPickUpFloorRings] = useState<string>("none")
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

    const getMatchTeamsData = () => {
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
    }

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
        const submitAutoAmpScore = autoAmpNotes
        const submitAutoSpeakerScore = autoSpeakerNotes
        const submitTeleopAmpScore = ampNotes
        const submitTeleopSpeakerScore = speakerNotes
        const submitTrapScore = trapNotes
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
        var submitPickUpFloorRings = 0
        var submitHumanPlayerStation = 0

        if (isAuto == "true") submitAuto = true

        switch (pickUpFloorRings) {
            case "false":
                submitPickUpFloorRings = 0
                break;
            case "true":
                submitPickUpFloorRings = 1
                break;
            case "none":
                submitPickUpFloorRings = 2
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
                autoScoreLevel: submitAutoScore,
                autoExtraPiece: {
                    scored: {
                        autoAmp: submitAutoAmpScore,
                        autoSpeaker: submitAutoSpeakerScore,
                    }
                },
                autoTaxi: submitAutoTaxi,
                teleop: {
                    scored: {
                        amp: submitTeleopAmpScore,
                        speaker: submitTeleopSpeakerScore,
                        trap: submitTrapScore
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
                pickUpFloorRings: submitPickUpFloorRings,
                humanPlayerStation: submitHumanPlayerStation,
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
                    <div className="ReconFormInner">
                    
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
                            <Button size="xs" leftIcon={<IconCheck size="1rem" />} onClick={() => getMatchTeamsData()}>
                                Load Teams
                            </Button>
                            {matchTeams.length !== 0 ?
                                <>
                                    <Select
                                        transition={'pop-top-left'}
                                        transitionDuration={80}
                                        transitionTimingFunction={'ease'}
                                        dropdownPosition="bottom"
                                        style={{ zIndex: 10 }}
                                        data={matchTeams}
                                        placeholder="Pick one"
                                        label="Select Team"
                                        classNames={eventSelectClasses}
                                        required
                                        onChange={(event: string) => {
                                            setTeamNumber(event)
                                        }}
                                    />
                                </> :
                                <>
                                    <Select
                                        transition={'pop-top-left'}
                                        transitionDuration={80}
                                        transitionTimingFunction={'ease'}
                                        dropdownPosition="bottom"
                                        style={{ zIndex: 10 }}
                                        data={["Enter a Match Number"]}
                                        disabled
                                        value={''}
                                        placeholder="Enter a Match Number"
                                        label="Select Team"
                                        classNames={eventSelectClasses}
                                        required
                                    />
                                </>}
                        </>
                        : <>
                            <TextInput
                                type="number"
                                placeholder="7028"
                                label="Team Number"
                                description="The number of your scouting team"
                                required={true}
                                value={teamNumber}
                                onChange={(event) => setTeamNumber(event.currentTarget.value)}
                            />
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
                        </>}

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
                                    
                    <div>                
                    <Text c="dimmed">Notes Scored in Amp (auto)</Text>
                            <div className={scoreInputClasses.wrapper}>
                                <ActionIcon<'button'>
                                    size={28}
                                    variant="transparent"
                                    onClick={() => autoAmpNotesHandler.current?.decrement()}
                                    disabled={autoAmpNotes === 0}
                                    className={scoreInputClasses.control}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <IconMinus size={16} stroke={1.5} />
                                </ActionIcon>

                                <NumberInput
                                    variant="unstyled"
                                    min={0}
                                    max={50}
                                    handlersRef={autoAmpNotesHandler}
                                    value={autoAmpNotes}
                                    onChange={setAutoAmpNotes}
                                    classNames={{ input: scoreInputClasses.input }}
                                />

                                <ActionIcon<'button'>
                                    size={28}
                                    variant="transparent"
                                    onClick={() => autoAmpNotesHandler.current?.increment()}
                                    disabled={autoAmpNotes === 50}
                                    className={scoreInputClasses.control}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <IconPlus size={16} stroke={1.5} />
                                </ActionIcon>
                            </div>
                            </div>
                            
                            <div>
                            <Text c="dimmed">Notes Scored in Speaker (auto)</Text>
                            <div className={scoreInputClasses.wrapper}>
                                <ActionIcon<'button'>
                                    size={28}
                                    variant="transparent"
                                    onClick={() => autoSpeakerNotesHandler.current?.decrement()}
                                    disabled={autoSpeakerNotes === 0}
                                    className={scoreInputClasses.control}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <IconMinus size={16} stroke={1.5} />
                                </ActionIcon>

                                <NumberInput
                                    variant="unstyled"
                                    min={0}
                                    max={50}
                                    handlersRef={autoSpeakerNotesHandler}
                                    value={autoSpeakerNotes}
                                    onChange={setAutoSpeakerNotes}
                                    classNames={{ input: scoreInputClasses.input }}
                                />

                                <ActionIcon<'button'>
                                    size={28}
                                    variant="transparent"
                                    onClick={() => autoSpeakerNotesHandler.current?.increment()}
                                    disabled={autoSpeakerNotes === 50}
                                    className={scoreInputClasses.control}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <IconPlus size={16} stroke={1.5} />
                                </ActionIcon>
                            </div>
                        </div>

                <div>
                    <Checkbox label="Did the robot park?"></Checkbox>
                </div>
                    <Text
                        color={theme.primaryColor}
                        ta="center"
                        fz="xl"
                        fw={700}
                        className="FormSubheader"
                    >
                        Teleop
                    </Text>
                    <div>                
                    <Text c="dimmed">Notes Scored in Amp (teleop)</Text>
                            <div className={scoreInputClasses.wrapper}>
                                <ActionIcon<'button'>
                                    size={28}
                                    variant="transparent"
                                    onClick={() => ampNotesHandler.current?.decrement()}
                                    disabled={ampNotes === 0}
                                    className={scoreInputClasses.control}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <IconMinus size={16} stroke={1.5} />
                                </ActionIcon>

                                <NumberInput
                                    variant="unstyled"
                                    min={0}
                                    max={50}
                                    handlersRef={ampNotesHandler}
                                    value={ampNotes}
                                    onChange={setAmpNotes}
                                    classNames={{ input: scoreInputClasses.input }}
                                />

                                <ActionIcon<'button'>
                                    size={28}
                                    variant="transparent"
                                    onClick={() => ampNotesHandler.current?.increment()}
                                    disabled={ampNotes === 50}
                                    className={scoreInputClasses.control}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <IconPlus size={16} stroke={1.5} />
                                </ActionIcon>
                            </div>
                        </div>
                            
                            <div>
                            <Text c="dimmed">Notes Scored in Speaker (teleop)</Text>
                            <div className={scoreInputClasses.wrapper}>
                                <ActionIcon<'button'>
                                    size={28}
                                    variant="transparent"
                                    onClick={() => speakerNotesHandler.current?.decrement()}
                                    disabled={speakerNotes === 0}
                                    className={scoreInputClasses.control}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <IconMinus size={16} stroke={1.5} />
                                </ActionIcon>

                                <NumberInput
                                    variant="unstyled"
                                    min={0}
                                    max={50}
                                    handlersRef={speakerNotesHandler}
                                    value={speakerNotes}
                                    onChange={setSpeakerNotes}
                                    classNames={{ input: scoreInputClasses.input }}
                                />

                                <ActionIcon<'button'>
                                    size={28}
                                    variant="transparent"
                                    onClick={() => speakerNotesHandler.current?.increment()}
                                    disabled={speakerNotes === 50}
                                    className={scoreInputClasses.control}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <IconPlus size={16} stroke={1.5} />
                                </ActionIcon>
                            </div>
                        </div>

                        <div>                
                    <Text c="dimmed">Notes Scored in Trap</Text>
                            <div className={scoreInputClasses.wrapper}>
                                <ActionIcon<'button'>
                                    size={28}
                                    variant="transparent"
                                    onClick={() => trapNotesHandler.current?.decrement()}
                                    disabled={trapNotes === 0}
                                    className={scoreInputClasses.control}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <IconMinus size={16} stroke={1.5} />
                                </ActionIcon>

                                <NumberInput
                                    variant="unstyled"
                                    min={0}
                                    max={50}
                                    handlersRef={trapNotesHandler}
                                    value={trapNotes}
                                    onChange={setTrapNotes}
                                    classNames={{ input: scoreInputClasses.input }}
                                />

                                <ActionIcon<'button'>
                                    size={28}
                                    variant="transparent"
                                    onClick={() => trapNotesHandler.current?.increment()}
                                    disabled={trapNotes === 50}
                                    className={scoreInputClasses.control}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <IconPlus size={16} stroke={1.5} />
                                </ActionIcon>
                            </div>
                        </div>
                               
                                    <Checkbox label="Did the robot go on stage?"></Checkbox>
                                    <Checkbox label="Was their harmony?"></Checkbox>
                                    <Checkbox label="Was your team's human player spotlight?"></Checkbox>
                                

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
                        <Text c="dimmed">Did they pick rings up off the floor?</Text>
                        <SegmentedControl
                            radius="xl"
                            size="md"
                            data={[
                                { label: "I Don't Know", value: "none" },
                                { label: "Yes", value: "true" },
                                { label: "No", value: "false" },
                            ]}
                            value={pickUpFloorRings}
                            onChange={(value) => {
                                setPickUpFloorRings(value)
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

                    <Checkbox label="Was your robot a defense bot?"></Checkbox>
                    <Checkbox label="Was your robot defended against?"></Checkbox>
                    <Checkbox label="Could your robot go under the stage?"></Checkbox>

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
                    </div> {/* end  ReconFormInner */}
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
