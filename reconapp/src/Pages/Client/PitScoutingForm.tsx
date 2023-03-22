import { Affix, Anchor, Breadcrumbs, Button, Transition, useMantineTheme, Notification, Text, Group, FileButton, Image, Modal, TextInput, Textarea, NumberInput, Checkbox, SegmentedControl, Box, Center, Paper, Title, Card, AspectRatio } from "@mantine/core";
import { useDisclosure, useWindowScroll } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconArrowUp, IconCheck, IconClick, IconX } from "@tabler/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthHeader, useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { UpdatedHeader } from "../Components/UpdatedHeader";
import PitSendToAPI from "../Utils/PitFormSubmit";
import { checkToken } from "../Utils/ReconQueries";

function PitScoutingForm() {

    const items = [
        { title: 'Home', href: '/' },
        { title: 'New Pit Form', href: '#' },
    ].map((item, index) => (
        <Anchor href={item.href} key={index}>
            {item.title}
        </Anchor>
    ));

    const [sessionExpired, setSessionExpired] = useState<boolean>(false)

    const signOut = useSignOut();
    const theme = useMantineTheme();

    const [scroll, scrollTo] = useWindowScroll();
    const authHeader = useAuthHeader()
    const navigate = useNavigate()

    const [file, setFile] = useState<File | null>(null);

    const [imgFile, setImgFile] = useState<any>();

    const [teamNumber, setTeamNumber] = useState('')
    const [strategyOverall, setStrategyOverall] = useState('')
    const [strategyAprilTags, setStrategyAprilTags] = useState('')
    const [strategyLanguage, setStrategyLanguage] = useState('')
    const [mechanicalProtectedElectronics, setMechanicalProtectedElectronics] = useState('')
    const [mechanicalSecuredBattery, setMechanicalSecuredBattery] = useState('')
    const [mechanicalBatteryNum, setMechanicalBatteryNum] = useState('')
    const [mechanicalBatteryOldest, setMechanicalBatteryOldest] = useState('')
    const [mechanicalBatteryChargeNum, setMechanicalBatteryChargeNum] = useState('')
    const [mechanicalHaveCameras, setMechanicalHaveCameras] = useState(false)
    const [mechanicalHaveAuto, setMechanicalHaveAuto] = useState(false)
    const [mechanicalAutoInfo, setMechanicalAutoInfo] = useState('')
    const [mechanicalCubesLow, setMechanicalCubesLow] = useState(false)
    const [mechanicalCubesMid, setMechanicalCubesMid] = useState(false)
    const [mechanicalCubesHigh, setMechanicalCubesHigh] = useState(false)
    const [mechanicalConesLow, setMechanicalConesLow] = useState(false)
    const [mechanicalConesMid, setMechanicalConesMid] = useState(false)
    const [mechanicalConesHigh, setMechanicalConesHigh] = useState(false)
    const [mechanicalAutoBalancingTools, setMechanicalAutoBalancingTools] = useState('')
    const [mechanicalChargeStationInches, setMechanicalChargeStationInches] = useState('')
    const [mechanicalFrameDimensions, setMechanicalFrameDimensions] = useState('')
    const [mechanicalRobotIssues, setMechanicalRobotIssues] = useState('')
    const [generalStudentNum, setGeneralStudentNum] = useState('')
    const [generalMentorNum, setGeneralMentorNum] = useState('')
    const [generalRobotNum, setGeneralRobotNum] = useState('')
    const [generalCameraUsage, setGeneralCameraUsage] = useState('')
    const [generalDriveTrain, setGeneralDriveTrain] = useState('')
    const [generalDriveTrainBrand, setGeneralDriveTrainBrand] = useState('')
    const [generalSwerveYears, setGeneralSwerveYears] = useState('')
    const [generalSwerveFixLoctite, setGeneralSwerveFixLoctite] = useState(false)
    const [generalSwerveFixShafts, setGeneralSwerveFixShafts] = useState(false)
    const [driveteamRobotCompliments, setDriveteamRobotCompliments] = useState('')
    const [driveteamChanges, setDriveteamChanges] = useState('')
    const [driveteamSameTeamMatch, setDriveteamSameTeamMatch] = useState(false)
    const [driveteamManipulationMech, setDriveteamManipulationMech] = useState('')
    const [driveteamStrongestValue, setDriveteamStrongestValue] = useState('')
    const [driveteamWeakestValue, setDriveteamWeakestValue] = useState('')
    const [driveteamExtraComments, setDriveteamExtraComments] = useState('')
    const [driveteamDirectContact, setDriveteamDirectContact] = useState('')
    const [pictureBool, setPictureBool] = useState('no')
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

    useEffect(() => {
        (async function () {
            if (imgFile && imgFile !== 'none') {
                var FormData = require('form-data');
                var data = new FormData();
                data.append('image', imgFile);

                var config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://api.imgbb.com/1/upload?key=1fa1a436f62b86f55a9ee6cda8cbb393',
                    headers: {
                        'Accept': "application/json"
                    },
                    data: data
                };

                const res = await axios(config)
                try {
                    SubmitPitForm(authHeader(), res.data.data.url)
                    return navigate('/formsubmitted')
                } catch {
                    return showNotification({
                        title: 'Form Error',
                        message: 'There was an error submitting this form!',
                        color: "red",
                    })
                }
            }
            if (imgFile === 'none') {
                try {
                    SubmitPitForm(authHeader(), 'none')
                    return navigate('/formsubmitted')
                } catch {
                    return showNotification({
                        title: 'Form Error',
                        message: 'There was an error submitting this form!',
                        color: "red",
                    })
                }
            }
        })()
    }, [imgFile])

    function SubmitPitForm(authToken: any, imageUrl: any) {

        if (!teamNumber) return showNotification({
            title: 'Form Error',
            message: 'The Team Number cannot be empty!',
            color: "red",
        })

        setImgFile(file)

        PitSendToAPI({
            data: {
                teamNumber: Number(teamNumber),
                strategyOverall: strategyOverall,
                strategyAprilTags: strategyAprilTags,
                strategyLanguage: strategyLanguage,
                mechanicalProtectedElectronics: mechanicalProtectedElectronics,
                mechanicalSecuredBattery: mechanicalSecuredBattery,
                mechanicalBatteryNum: Number(mechanicalBatteryNum),
                mechanicalBatteryOldest: mechanicalBatteryOldest,
                mechanicalBatteryChargeNum: Number(mechanicalBatteryChargeNum),
                mechanicalHaveCameras: mechanicalHaveCameras,
                mechanicalHaveAuto: mechanicalHaveAuto,
                mechanicalAutoInfo: mechanicalAutoInfo,
                mechanicalCubesLow: mechanicalCubesLow,
                mechanicalCubesMid: mechanicalCubesMid,
                mechanicalCubesHigh: mechanicalCubesHigh,
                mechanicalConesLow: mechanicalConesLow,
                mechanicalConesMid: mechanicalConesMid,
                mechanicalConesHigh: mechanicalConesHigh,
                mechanicalAutoBalancingTools: mechanicalAutoBalancingTools,
                mechanicalChargeStationInches: mechanicalChargeStationInches,
                mechanicalFrameDimensions: mechanicalFrameDimensions,
                mechanicalRobotIssues: mechanicalRobotIssues,
                generalStudentNum: Number(generalStudentNum),
                generalMentorNum: Number(generalMentorNum),
                generalRobotNum: Number(generalRobotNum),
                generalCameraUsage: generalCameraUsage,
                generalDriveTrain: generalDriveTrain,
                generalDriveTrainBrand: generalDriveTrainBrand,
                generalSwerveYears: generalSwerveYears,
                generalSwerveFixLoctite: generalSwerveFixLoctite,
                generalSwerveFixShafts: generalSwerveFixShafts,
                driveteamRobotCompliments: driveteamRobotCompliments,
                driveteamChanges: driveteamChanges,
                driveteamSameTeamMatch: driveteamSameTeamMatch,
                driveteamManipulationMech: driveteamManipulationMech,
                driveteamStrongestValue: driveteamStrongestValue,
                driveteamWeakestValue: driveteamWeakestValue,
                driveteamExtraComments: driveteamExtraComments,
                driveteamDirectContact: driveteamDirectContact,
                robotImage: imageUrl,
            }
        }, authToken).catch(() => {
            return showNotification({
                title: 'Form Error',
                message: 'There was an error submitting this form!',
                color: "red",
            })
        })
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
                        Team Info
                    </Text>

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
                        type="number"
                        placeholder="20"
                        label="Student Amount"
                        description="The number of students the team has"
                        value={generalStudentNum}
                        onChange={(event) => setGeneralStudentNum(event.currentTarget.value)}
                    />

                    <TextInput
                        type="number"
                        placeholder="6"
                        label="Mentor Amount"
                        description="The number of mentors the team has"
                        value={generalMentorNum}
                        onChange={(event) => setGeneralMentorNum(event.currentTarget.value)}
                    />

                    <TextInput
                        type="number"
                        placeholder="2"
                        label="Robot Amount"
                        description="The number of robots the team has"
                        value={generalRobotNum}
                        onChange={(event) => setGeneralRobotNum(event.currentTarget.value)}
                    />

                    <Text
                        color={theme.primaryColor}
                        ta="center"
                        fz="xl"
                        fw={700}
                        className="FormSubheader"
                    >
                        Mechanical
                    </Text>

                    <Textarea
                        placeholder="Description..."
                        label="Drive Train Type?"
                        description="What kind of drive train does the team use?"
                        autosize
                        minRows={1}
                        value={generalDriveTrain}
                        onChange={((event) => {
                            setGeneralDriveTrain(event.currentTarget.value)
                        })}
                    />

                    <Textarea
                        placeholder="Description..."
                        label="Drive Train Brand?"
                        description="What brand of drive train does the team use?"
                        autosize
                        minRows={1}
                        value={generalDriveTrainBrand}
                        onChange={((event) => {
                            setGeneralDriveTrainBrand(event.currentTarget.value)
                        })}
                    />

                    <Textarea
                        placeholder="Description..."
                        label="Manipulation"
                        description="Type of mechanism for manipulation?"
                        autosize
                        minRows={1}
                        value={driveteamManipulationMech}
                        onChange={((event) => {
                            setDriveteamManipulationMech(event.currentTarget.value)
                        })}
                    />

                    <Textarea
                        placeholder="Description..."
                        label="Charge Station Size?"
                        description="How many inches do they take up on the Charge Station?"
                        autosize
                        minRows={1}
                        value={mechanicalChargeStationInches}
                        onChange={((event) => {
                            setMechanicalChargeStationInches(event.currentTarget.value)
                        })}
                    />

                    <Textarea
                        placeholder="Description..."
                        label="Frame Dimensions?"
                        description="Robot Frame Dimensions? (No Bumpers)"
                        autosize
                        minRows={1}
                        value={mechanicalFrameDimensions}
                        onChange={((event) => {
                            setMechanicalFrameDimensions(event.currentTarget.value)
                        })}
                    />

                    <Text
                        color={theme.primaryColor}
                        ta="center"
                        fz="xl"
                        fw={700}
                        className="FormSubheader"
                    >
                        Programming
                    </Text>

                    <Textarea
                        placeholder="Description..."
                        label="Programming Language"
                        description="What programming language does the team use?"
                        autosize
                        minRows={1}
                        value={strategyLanguage}
                        onChange={((event) => {
                            setStrategyLanguage(event.currentTarget.value)
                        })}
                    />

                    <Textarea
                        placeholder="Description..."
                        label="April Tags"
                        description="How do you use the April Tags?"
                        autosize
                        minRows={1}
                        value={strategyAprilTags}
                        onChange={((event) => {
                            setStrategyAprilTags(event.currentTarget.value)
                        })}
                    />

                    <Checkbox
                        size="sm"
                        label="Does the team have cameras?"
                        checked={mechanicalHaveCameras}
                        onChange={(event) => setMechanicalHaveCameras(event.currentTarget.checked)}
                    />

                    <Textarea
                        placeholder="Description..."
                        label="Camera Usage?"
                        description="How does the team use cameras?"
                        autosize
                        minRows={1}
                        value={generalCameraUsage}
                        onChange={((event) => {
                            setGeneralCameraUsage(event.currentTarget.value)
                        })}
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

                    <Checkbox
                        size="sm"
                        label="Does the team have auto?"
                        checked={mechanicalHaveAuto}
                        onChange={(event) => setMechanicalHaveAuto(event.currentTarget.checked)}
                    />

                    <Textarea
                        placeholder="Description..."
                        label="Best Autonomous"
                        description="What autos do you have? Best Auto?"
                        autosize
                        minRows={1}
                        value={mechanicalAutoInfo}
                        onChange={((event) => {
                            setMechanicalAutoInfo(event.currentTarget.value)
                        })}
                    />

                    <Textarea
                        placeholder="Description..."
                        label="Auto Balancing?"
                        description="Do they have any auto balancing tools for the charge station?"
                        autosize
                        minRows={1}
                        value={mechanicalAutoBalancingTools}
                        onChange={((event) => {
                            setMechanicalAutoBalancingTools(event.currentTarget.value)
                        })}
                    />

                    <Text
                        color={theme.primaryColor}
                        ta="center"
                        fz="xl"
                        fw={700}
                        className="FormSubheader"
                    >
                        Scoring
                    </Text>

                    <Group>
                        <Checkbox
                            size="sm"
                            label="Cubes Low?"
                            checked={mechanicalCubesLow}
                            onChange={(event) => setMechanicalCubesLow(event.currentTarget.checked)}
                        />
                        <Checkbox
                            size="sm"
                            label="Cones Low?"
                            checked={mechanicalConesLow}
                            onChange={(event) => setMechanicalConesLow(event.currentTarget.checked)}
                        />
                    </Group>

                    <Group>
                        <Checkbox
                            size="sm"
                            label="Cubes Mid?"
                            checked={mechanicalCubesMid}
                            onChange={(event) => setMechanicalCubesMid(event.currentTarget.checked)}
                        />
                        <Checkbox
                            size="sm"
                            label="Cones Mid?"
                            checked={mechanicalConesMid}
                            onChange={(event) => setMechanicalConesMid(event.currentTarget.checked)}
                        />
                    </Group>

                    <Group>
                        <Checkbox
                            size="sm"
                            label="Cubes High?"
                            checked={mechanicalCubesHigh}
                            onChange={(event) => setMechanicalCubesHigh(event.currentTarget.checked)}
                        />
                        <Checkbox
                            size="sm"
                            label="Cones High?"
                            checked={mechanicalConesHigh}
                            onChange={(event) => setMechanicalConesHigh(event.currentTarget.checked)}
                        />
                    </Group>

                    <Text
                        color={theme.primaryColor}
                        ta="center"
                        fz="xl"
                        fw={700}
                        className="FormSubheader"
                    >
                        Strategy
                    </Text>

                    <Textarea
                        placeholder="Description..."
                        label="Overall Strategy"
                        description="What was the team's overall strategy?"
                        autosize
                        minRows={1}
                        value={strategyOverall}
                        onChange={((event) => {
                            setStrategyOverall(event.currentTarget.value)
                        })}
                    />

                    <Textarea
                        placeholder="Description..."
                        label="Robot Compliments"
                        description="What type of robot complements them?"
                        autosize
                        minRows={1}
                        value={driveteamRobotCompliments}
                        onChange={((event) => {
                            setDriveteamRobotCompliments(event.currentTarget.value)
                        })}
                    />

                    <Checkbox
                        size="sm"
                        label="Same drive team each match?"
                        checked={driveteamSameTeamMatch}
                        onChange={(event) => setDriveteamSameTeamMatch(event.currentTarget.checked)}
                    />

                    <Text
                        color={theme.primaryColor}
                        ta="center"
                        fz="xl"
                        fw={700}
                        className="FormSubheader"
                    >
                        Electronics
                    </Text>

                    <Textarea
                        placeholder="Description..."
                        label="Protected Electronics?"
                        description="Are the team's electronics protected? (Look & Ask)"
                        autosize
                        minRows={1}
                        value={mechanicalProtectedElectronics}
                        onChange={((event) => {
                            setMechanicalProtectedElectronics(event.currentTarget.value)
                        })}
                    />

                    <Textarea
                        placeholder="Description..."
                        label="Battery Secured?"
                        description="Is the team's battery secured and how?"
                        autosize
                        minRows={1}
                        value={mechanicalSecuredBattery}
                        onChange={((event) => {
                            setMechanicalSecuredBattery(event.currentTarget.value)
                        })}
                    />

                    <TextInput
                        type="number"
                        placeholder="2"
                        label="Number of Batteries"
                        description="The team's number of batteries"
                        value={mechanicalBatteryNum}
                        onChange={(event) => setMechanicalBatteryNum(event.currentTarget.value)}
                    />

                    <TextInput
                        placeholder="Oldest..."
                        label="Oldest battery"
                        description="The team's oldest battery"
                        value={mechanicalBatteryOldest}
                        onChange={(event) => setMechanicalBatteryOldest(event.currentTarget.value)}
                    />

                    <TextInput
                        type="number"
                        placeholder="4"
                        label="Charge Amount"
                        description="The number of battery's team can charge"
                        value={mechanicalBatteryChargeNum}
                        onChange={(event) => setMechanicalBatteryChargeNum(event.currentTarget.value)}
                    />

                    <Text
                        color={theme.primaryColor}
                        ta="center"
                        fz="xl"
                        fw={700}
                        className="FormSubheader"
                    >
                        Other
                    </Text>

                    <Textarea
                        placeholder="Description..."
                        label="Swerve Question"
                        description="If swerve, how many years have you used swerve?"
                        autosize
                        minRows={1}
                        value={generalSwerveYears}
                        onChange={((event) => {
                            setGeneralSwerveYears(event.currentTarget.value)
                        })}
                    />

                    <Checkbox
                        size="sm"
                        label="Fix the loctite on falcons?"
                        checked={generalSwerveFixLoctite}
                        onChange={(event) => setGeneralSwerveFixLoctite(event.currentTarget.checked)}
                    />

                    <Checkbox
                        size="sm"
                        label="Fix Shafts on the Swerve SDS?"
                        checked={generalSwerveFixShafts}
                        onChange={(event) => setGeneralSwerveFixShafts(event.currentTarget.checked)}
                    />

                    <Textarea
                        placeholder="Description..."
                        label="Issues?"
                        description="Are there any issues with the robot?"
                        autosize
                        minRows={1}
                        value={mechanicalRobotIssues}
                        onChange={((event) => {
                            setMechanicalRobotIssues(event.currentTarget.value)
                        })}
                    />

                    <Textarea
                        placeholder="Description..."
                        label="Robot Changes"
                        description="Changes since last competition?"
                        autosize
                        minRows={1}
                        value={driveteamChanges}
                        onChange={((event) => {
                            setDriveteamChanges(event.currentTarget.value)
                        })}
                    />

                    <Textarea
                        placeholder="Description..."
                        label="Strongest Value"
                        description="What is the robot's strongest aspect?"
                        autosize
                        minRows={1}
                        value={driveteamStrongestValue}
                        onChange={((event) => {
                            setDriveteamStrongestValue(event.currentTarget.value)
                        })}
                    />

                    <Textarea
                        placeholder="Description..."
                        label="Weakest Value"
                        description="What is the robot's weakest aspect?"
                        autosize
                        minRows={1}
                        value={driveteamWeakestValue}
                        onChange={((event) => {
                            setDriveteamWeakestValue(event.currentTarget.value)
                        })}
                    />

                    <Textarea
                        placeholder="Description..."
                        label="Extra Comments?"
                        description="Any extra comments from them?"
                        autosize
                        minRows={1}
                        value={driveteamExtraComments}
                        onChange={((event) => {
                            setDriveteamExtraComments(event.currentTarget.value)
                        })}
                    />

                    <Text
                        color={theme.primaryColor}
                        ta="center"
                        fz="xl"
                        fw={700}
                        className="FormSubheader"
                    >
                        Contact
                    </Text>

                    <Textarea
                        placeholder="Description..."
                        label="Contact Info?"
                        description={`Any team contact info for discussing strategy? Include name with contact`}
                        autosize
                        minRows={1}
                        value={driveteamDirectContact}
                        onChange={((event) => {
                            setDriveteamDirectContact(event.currentTarget.value)
                        })}
                    />

                    <Text
                        color={theme.primaryColor}
                        ta="center"
                        fz="xl"
                        fw={700}
                        className="FormSubheader"
                    >
                        Photo
                    </Text>

                    <Text c="dimmed">Ask if you can take a picture of the bot</Text>

                    <SegmentedControl
                        value={pictureBool}
                        onChange={(value: 'no' | 'yes') => setPictureBool(value)}
                        data={[
                            {
                                value: 'no',
                                label: (
                                    <Center>
                                        <IconX size="1rem" stroke={1.5} color={theme.colors.red[6]} />
                                        <Box ml={10}>No</Box>
                                    </Center>
                                ),
                            },
                            {
                                value: 'yes',
                                label: (
                                    <Center>
                                        <IconCheck size="1rem" stroke={1.5} color={theme.colors.green[6]} />
                                        <Box ml={10}>Yes</Box>
                                    </Center>
                                ),
                            },
                        ]}
                    />

                    {pictureBool == 'yes' && (
                        <Group position="center">
                            {file ? <Button size="lg" onClick={() => { setFile(null) }} color={"red"}>Reset Image</Button> : <FileButton onChange={setFile} accept="image/png,image/jpeg">
                                {(props) => <Button size="lg" {...props}>Upload Image</Button>}
                            </FileButton>}
                        </Group>
                    )}

                    {pictureBool == 'yes' && file && (
                        <Card p="md" radius="md">
                            <Image maw={400} mx="auto" src={URL.createObjectURL(file)} />
                        </Card>
                    )}

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
                                if (!file) return setImgFile('none')
                                return setImgFile(file)
                            }}
                        >
                            Submit Pit Scouting Form
                        </Button>
                    </div>

                </div> : <div className="ReconFormContainer">

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

export default PitScoutingForm