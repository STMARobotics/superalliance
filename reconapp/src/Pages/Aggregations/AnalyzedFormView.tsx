import { useParams } from "react-router-dom";
import { SubmissionsNavbar } from "../Components/SubmissionsNavbar";
import { UpdatedHeader } from "../Components/UpdatedHeader";
import { ActionIcon, Box, Button, Center, Group, MultiSelect, NumberInput, NumberInputHandlers, SegmentedControl, Select, Slider, Text, Textarea, TextInput, useMantineTheme } from '@mantine/core'
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "@mantine/hooks";
import DockedSectionStyles from "../Styles/DockedSection";
import ScoreInputStyles from "../Styles/ScoreInputStyles";
import { IconCheck, IconClick, IconMinus, IconPlus, IconX } from "@tabler/icons";
import GetTeamData from "../Utils/GetTeamData";
import EventSelectStyles from "../Styles/EventSelectStyles";

function AnalyzedFormView() {

    let { submissionId } = useParams();
    const theme = useMantineTheme()

    const scoreInputClasses = ScoreInputStyles().classes
    const dockedSectionClasses = DockedSectionStyles().classes
    const eventSelectClasses = EventSelectStyles().classes

    const [formData, setFormData] = useState<any>({})
    const [scoredDataCubes, setScoredDataCubes] = useState<any>({})
    const [scoredDataCones, setScoredDataCones] = useState<any>({})
    const [scoredExtraPiece, setScoredExtraPiece] = useState<any>({})

    const [dockedType, setDockedType] = useState("Not Docked")
    const [endDockedType, setEndDockedType] = useState("Not Docked")
    const [tippedConesType, setTippedConesType] = useState("dk")
    const [floorConesType, setFloorConesType] = useState("dk")
    const [humanPlayerType, setHumanPlayerType] = useState("dk")
    const [scoreLevel, setScoreLevel] = useState("None")
    const [isTaxi, setIsTaxi] = useState("No Taxi")

    const [eventData, setEventData] = useState<any>([])
    const [selectedEvent, setSelectedEvent] = useState("")

    useEffect(() => {
        (async function () {
            const data = await GetTeamData.getSubmissionById(submissionId)
            const teamData = data.data[0]
            setScoredDataCones(teamData.teleop.scored.cone)
            setScoredDataCubes(teamData.teleop.scored.cube)
            setScoredExtraPiece(teamData.autoExtraPiece.scored)
            setFormData(teamData)

            var eventArray: any[] = [];
            eventArray.push("Testing Event")
            eventArray.push("Week 0 Event")
            const eventdata = await GetTeamData.getTeamEventData(7028, 2023)
            eventdata.data.map((event: any) => {
                eventArray.push(event.name)
            })
            setEventData(eventArray)
            setSelectedEvent(teamData.eventName)

            if (teamData.autoDocked) setDockedType("Docked")
            if (teamData.autoEngaged) setDockedType("Engaged")

            if (teamData.endgameDocked) setEndDockedType("Docked")
            if (teamData.endgameEngaged) setEndDockedType("Engaged")

            if (teamData.pickUpTippedCones == 0) setTippedConesType("true")
            if (teamData.pickUpTippedCones == 1) setTippedConesType("false")
            if (teamData.pickUpTippedCones == 2) setTippedConesType("none")

            if (teamData.pickUpFloorCones == 0) setFloorConesType("true")
            if (teamData.pickUpFloorCones == 1) setFloorConesType("false")
            if (teamData.pickUpFloorCones == 2) setFloorConesType("none")

            if (teamData.humanPlayerStation == 0) setHumanPlayerType("none")
            if (teamData.humanPlayerStation == 1) setHumanPlayerType("single")
            if (teamData.humanPlayerStation == 2) setHumanPlayerType("double")
            if (teamData.humanPlayerStation == 3) setHumanPlayerType("both")
            if (teamData.humanPlayerStation == 4) setHumanPlayerType("dk")

            if (teamData.autoScoreLevel == 1) setScoreLevel("Low")
            if (teamData.autoScoreLevel == 2) setScoreLevel("Mid")
            if (teamData.autoScoreLevel == 3) setScoreLevel("High")

            if (teamData.autoTaxi) setIsTaxi("Taxi")
        })()
    }, [])

    return (
        <div className="SubmissionsContainer">
            <UpdatedHeader />
            <div className="SubmissionsHomeSection">
                <div className="SubmissionsFormDataContent">
                    <Text
                        className="SubmissionsFormDataTeamText"
                        color={theme.primaryColor}
                        ta="center"
                        fz="xl"
                        fw={700}
                    >
                        Recon Submission
                    </Text>

                    <div className="ReconFormContainer">

                        <Text
                            color={theme.primaryColor}
                            ta="center"
                            fz="xl"
                            fw={700}
                            className="FormSubheader"
                        >
                            Pre-Game
                        </Text>

                        <Text
                            color={theme.primaryColor}
                            ta="center"
                            fz="lg"
                            fw={700}
                            className="FormSubheader2"
                        >
                            @ {selectedEvent}
                        </Text>

                        <TextInput
                            type="number"
                            placeholder="7028"
                            label="Team Number"
                            description="The number of your scouting team"
                            required={true}
                            value={formData.teamNumber}
                        />

                        <TextInput
                            type="number"
                            placeholder="1"
                            label="Match Number"
                            required={true}
                            value={formData.matchNumber}
                        />

                        <TextInput
                            type="string"
                            placeholder="Rue Harvey"
                            label="Your Name"
                            description="Type our Your Name"
                            required={true}
                            value={formData.usersName}
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
                                value={formData.auto ? "true" : "false"}
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

                        {formData.auto == true &&
                            <div className="AutoContainer">

                                <div className="DockedLevel">
                                    <Text c="dimmed">Robot Dock Level</Text>
                                    <SegmentedControl
                                        radius="xl"
                                        size="md"
                                        data={['Not Docked', 'Docked', 'Engaged']}
                                        value={dockedType}
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
                                        <NumberInput
                                            variant="filled"
                                            min={0}
                                            max={50}
                                            value={scoredExtraPiece.high}
                                            classNames={{ input: scoreInputClasses.input, disabled: scoreInputClasses.disabled }}
                                            disabled
                                        />
                                    </div>

                                    <Text c="dimmed">Mid Pieces</Text>
                                    <div className={scoreInputClasses.wrapper}>
                                        <NumberInput
                                            variant="filled"
                                            min={0}
                                            max={50}
                                            value={scoredExtraPiece.mid}
                                            classNames={{ input: scoreInputClasses.input, disabled: scoreInputClasses.disabled }}
                                            disabled
                                        />
                                    </div>

                                    <Text c="dimmed">Low Pieces</Text>
                                    <div className={scoreInputClasses.wrapper}>
                                        <NumberInput
                                            variant="filled"
                                            min={0}
                                            max={50}
                                            value={scoredExtraPiece.low}
                                            classNames={{ input: scoreInputClasses.input, disabled: scoreInputClasses.disabled }}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="Taxi">
                                    <Text c="dimmed">Did they leave the community during auto?</Text>
                                    <SegmentedControl
                                        radius="xl"
                                        size="md"
                                        data={[{ label: "No", value: "No Taxi" }, { label: "Yes", value: "Taxi" }]}
                                        value={isTaxi}
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
                                    <NumberInput
                                        variant="filled"
                                        min={0}
                                        max={50}
                                        disabled
                                        value={scoredDataCones.high}
                                        classNames={{ input: scoreInputClasses.input, disabled: scoreInputClasses.disabled }}
                                    />
                                </div>

                                <Text c="dimmed">Mid Cones</Text>
                                <div className={scoreInputClasses.wrapper}>
                                    <NumberInput
                                        variant="filled"
                                        min={0}
                                        max={50}
                                        disabled
                                        value={scoredDataCones.mid}
                                        classNames={{ input: scoreInputClasses.input, disabled: scoreInputClasses.disabled }}
                                    />
                                </div>

                                <Text c="dimmed">Low Cones</Text>
                                <div className={scoreInputClasses.wrapper}>
                                    <NumberInput
                                        variant="filled"
                                        min={0}
                                        max={50}
                                        disabled
                                        value={scoredDataCones.low}
                                        classNames={{ input: scoreInputClasses.input, disabled: scoreInputClasses.disabled }}
                                    />
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
                                    <NumberInput
                                        variant="filled"
                                        min={0}
                                        max={50}
                                        disabled
                                        value={scoredDataCubes.high}
                                        classNames={{ input: scoreInputClasses.input, disabled: scoreInputClasses.disabled }}
                                    />
                                </div>

                                <Text c="dimmed">Mid Cubes</Text>
                                <div className={scoreInputClasses.wrapper}>
                                    <NumberInput
                                        variant="filled"
                                        min={0}
                                        max={50}
                                        disabled
                                        value={scoredDataCubes.mid}
                                        classNames={{ input: scoreInputClasses.input, disabled: scoreInputClasses.disabled }}
                                    />
                                </div>

                                <Text c="dimmed">Low Cubes</Text>
                                <div className={scoreInputClasses.wrapper}>
                                    <NumberInput
                                        variant="filled"
                                        min={0}
                                        max={50}
                                        disabled
                                        value={scoredDataCubes.low}
                                        classNames={{ input: scoreInputClasses.input, disabled: scoreInputClasses.disabled }}
                                    />
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
                                value={endDockedType}
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
                            value={formData.comments}
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
                                value={tippedConesType}
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
                                value={floorConesType}
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
                                value={humanPlayerType}
                                classNames={dockedSectionClasses}
                            />
                        </div>

                        <div className="DockedLevel">
                            <Text c="dimmed">Match Result</Text>
                            <SegmentedControl
                                radius="xl"
                                size="md"
                                data={['Loss', 'Win']}
                                value={formData.win ? "Win" : "Loss"}
                                classNames={dockedSectionClasses}
                            />
                        </div>

                        <TextInput
                            type="number"
                            placeholder="2"
                            label="Rank Points Earned"
                            description="The number of ranking points earned"
                            required={true}
                            value={formData.rankPointsEarned}
                        />

                        <TextInput
                            type="number"
                            placeholder="1"
                            label="Rank Post Match"
                            description="The number of ranking points after the match"
                            required={true}
                            value={formData.rankPostMatch}
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
                            value={formData.userRating}
                        />

                        <Textarea
                            placeholder="Did you see any penalties given to your robot, if so what was it?"
                            label="Penalties (Optional)"
                            autosize
                            minRows={1}
                            className="CommentsTextBox"
                            value={formData.penalties}
                        />

                        <MultiSelect
                            data={['Robot Died', 'Robot Tipped', 'Red Card', 'Mechanism Broke', 'Bumper Malfunction']}
                            label="Criticals"
                            description="Add quick tags to your submission."
                            placeholder="Choose Criticals"
                            searchable
                            value={formData.criticals}
                            disabled
                            nothingFound="Nothing found"
                        />

                        <div className="DockedLevel">
                            <Text c="dimmed">Was the bot a Defense or Cycle bot?</Text>
                            <SegmentedControl
                                radius="xl"
                                size="md"
                                data={['No', 'Yes']}
                                value={formData.defenceOrCycle ? "Yes" : "No"}
                                classNames={dockedSectionClasses}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AnalyzedFormView