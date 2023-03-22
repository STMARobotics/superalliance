import { Accordion, Avatar, Button, Card, Center, Checkbox, createStyles, Drawer, Flex, Grid, Group, HoverCard, Image, LoadingOverlay, Modal, Paper, ScrollArea, SegmentedControl, Tabs, Text, Textarea, TextInput, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SubmissionsNavbar } from "../Components/SubmissionsNavbar";
import { UpdatedHeader } from "../Components/UpdatedHeader";
import GetTeamData from "../Utils/GetTeamData";
import { useNavigate } from "react-router-dom";
import { useDisclosure, useElementSize, useLocalStorage, useViewportSize } from "@mantine/hooks";
import { IconAlertTriangle, IconBiohazard } from "@tabler/icons";

interface SubmissionActionProps {
    submissionNumber: string;
    author: string;
    time: string;
    link: string;
    matchNumber: number;
    win: boolean;
    rankPoints: number;
    criticals: any;
}

function UserInfoAction({ submissionNumber, author, time, link, matchNumber, win, rankPoints, criticals }: SubmissionActionProps) {

    const navigate = useNavigate();

    const theme = useMantineTheme()

    return (
        <Paper
            radius="md"

            className="SubmissionMatchBox"
            p="sm"
            sx={(theme) => ({
                backgroundColor: win ? theme.colors.green : theme.colors.red,
            })}
        >
            <Group position="center" spacing="xs">
                <Text align="center" size="lg" weight={500} color="white">
                    Match #{matchNumber} - {win ? "Win" : "Loss"}
                </Text>
                {criticals && criticals?.length !== 0 ? <Group spacing="sm" position="center">
                    <Center>
                        <IconAlertTriangle size={24} stroke={1.5} color={"white" /*theme.colors.yellow[3]*/} />
                        <Text size="md" weight={500} style={{
                            color: "white",
                            marginLeft: 3,
                            marginTop: 0,
                        }}>
                            {criticals?.length}
                        </Text>
                    </Center>
                </Group> : null}
            </Group>
            <Text align="center" size="sm" color="white">
                {author} • {time} • +{rankPoints} RP
            </Text>

            <Button component="a" href={link + `/${submissionNumber}`} color={win ? "green" : "red"} variant="filled" fullWidth mt="md">
                View Form
            </Button>
        </Paper>
    );
}

const useStyles = createStyles((theme) => ({
    root: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        borderRadius: theme.radius.sm,
    },

    item: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        border: `1px solid transparent`,
        position: 'relative',
        zIndex: 0,
        transition: 'transform 150ms ease',

        '&[data-active]': {
            transform: 'scale(1.03)',
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            boxShadow: theme.shadows.md,
            borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],
            borderRadius: theme.radius.md,
            zIndex: 1,
        },
    },

    chevron: {
        '&[data-rotate]': {
            transform: 'rotate(-90deg)',
        },
    },
}));

function SubmissionsFormData() {

    let { team } = useParams();
    const [formData, setFormData] = useState([])
    const [pitScoutingData, setPitScoutingData] = useState<any>()
    const [teamName, setTeamName] = useState("")
    const [visible, setVisible] = useState(true);
    const theme = useMantineTheme();
    const { classes } = useStyles();
    const [opened, { open, close }] = useDisclosure(false);

    const [activeTab, setActiveTab] = useState<string | null>('stands');

    const { ref, width, height } = useElementSize();

    const [preferenceData, setPreferenceData] = useLocalStorage<any>({
        key: 'saved-preferences',
        getInitialValueInEffect: false,
    });

    useEffect(() => {
        (async function () {
            const data = await GetTeamData.getPitScoutingData(team)
            setPitScoutingData(data.data)
        })()
    }, [])

    useEffect(() => {
        (async function () {
            setVisible(true)
            const data = await GetTeamData.getTeamSubmissions(Number(team))
            const nameData = await GetTeamData.getTeamNicknameFromAPI(Number(team))
            setTeamName(nameData.data)
            setFormData(data.data)
            setVisible(false)
        })()
    }, [])

    return (

        <div className="SubmissionsContainer">
            <UpdatedHeader />
            <div style={{ position: 'relative' }}>
                <LoadingOverlay visible={visible} overlayBlur={2} />
                <div className="SubmissionsHomeSection">
                    <SubmissionsNavbar
                        pageIndex={`Team ${team}`}
                        teamName={team} />
                    {visible ? null : <div className="SubmissionsFormDataContent">

                        {pitScoutingData && pitScoutingData?.robotImage && (<Modal
                            opened={opened}
                            onClose={close}
                            title="Robot Image"
                            zIndex={10001}
                            size="xl"
                            centered>
                            <Card>
                                <Image fit="contain" radius={'md'} src={`${pitScoutingData?.robotImage}`} />
                            </Card>
                        </Modal>)}

                        <Text
                            className="SubmissionsFormDataTeamText"
                            color={theme.primaryColor}
                            ta="center"
                            fz="xl"
                            fw={700}
                        >
                            {team} • {teamName}
                        </Text>

                        <Tabs value={activeTab} onTabChange={(event) => {
                            if(event === 'robotimage') return open()
                            setActiveTab(`${event}`)
                        }}>
                            <Tabs.List>
                                <Tabs.Tab value="stands">Stands</Tabs.Tab>
                                <Tabs.Tab value="pits">Pits</Tabs.Tab>
                                {pitScoutingData && pitScoutingData?.robotImage && (
                                    <Tabs.Tab value="robotimage">Robot Image</Tabs.Tab>)}
                            </Tabs.List>

                            <Tabs.Panel value="stands">
                                <Grid pt={'25px'} justify="center" align="flex-start">
                                    {preferenceData.dataShow == 'all' ? <>
                                        {formData.map((data: any, index) =>
                                            <Grid.Col md={4} lg={3} key={index + 1}>
                                                <UserInfoAction
                                                    submissionNumber={data.index + 1}
                                                    author={data.author}
                                                    time={data.timestamp}
                                                    link={`/submissions/teams/${team}`}
                                                    matchNumber={data.matchNumber}
                                                    win={data.win}
                                                    rankPoints={data.rankPointsEarned}
                                                    criticals={data.criticals}
                                                />
                                            </Grid.Col>)}
                                    </> : <>
                                        {formData.filter((e: any) => e.eventName == preferenceData.dataShow).map((data: any, index) =>
                                            <Grid.Col md={4} lg={3} key={index + 1}>
                                                <UserInfoAction
                                                    submissionNumber={data.index + 1}
                                                    author={data.author}
                                                    time={data.timestamp}
                                                    link={`/submissions/teams/${team}`}
                                                    matchNumber={data.matchNumber}
                                                    win={data.win}
                                                    rankPoints={data.rankPointsEarned}
                                                    criticals={data.criticals}
                                                />
                                            </Grid.Col>)}
                                    </>}
                                    {preferenceData.dataShow == 'testing' ? <>
                                        {formData.filter((e: any) => e.eventName == "Testing Event").map((data: any, index) =>
                                            <Grid.Col md={4} lg={3} key={index + 1}>
                                                <UserInfoAction
                                                    submissionNumber={data.index + 1}
                                                    author={data.author}
                                                    time={data.timestamp}
                                                    link={`/submissions/teams/${team}`}
                                                    matchNumber={data.matchNumber}
                                                    win={data.win}
                                                    rankPoints={data.rankPointsEarned}
                                                    criticals={data.criticals}
                                                />
                                            </Grid.Col>)}
                                    </> : null}
                                    {preferenceData.dataShow == 'week0' ? <>
                                        {formData.filter((e: any) => e.eventName == "Week 0 Event").map((data: any, index) =>
                                            <Grid.Col md={4} lg={3} key={index + 1}>
                                                <UserInfoAction
                                                    submissionNumber={data.index + 1}
                                                    author={data.author}
                                                    time={data.timestamp}
                                                    link={`/submissions/teams/${team}`}
                                                    matchNumber={data.matchNumber}
                                                    win={data.win}
                                                    rankPoints={data.rankPointsEarned}
                                                    criticals={data.criticals}
                                                />
                                            </Grid.Col>)}
                                    </> : null}
                                </Grid>
                            </Tabs.Panel>
                            <Tabs.Panel value="pits">
                                <Accordion
                                    pt={25}
                                    mx="auto"
                                    variant="filled"
                                    defaultValue={"teaminfo"}
                                    classNames={classes}
                                    className={classes.root}
                                >
                                    {pitScoutingData ? (
                                        <>
                                            <Accordion.Item value="teaminfo">
                                                <Accordion.Control>Team Info</Accordion.Control>
                                                <Accordion.Panel>
                                                    <Group p={12}>
                                                        <TextInput
                                                            type="number"
                                                            placeholder="7028"
                                                            label="Team Number"
                                                            description="The number of your scouting team"
                                                            required={true}
                                                            value={pitScoutingData.teamNumber}
                                                            readOnly
                                                        />

                                                        <TextInput
                                                            type="number"
                                                            placeholder="20"
                                                            label="Student Amount"
                                                            description="The number of students the team has"
                                                            value={pitScoutingData.generalStudentNum}
                                                            readOnly
                                                        />

                                                        <TextInput
                                                            type="number"
                                                            placeholder="6"
                                                            label="Mentor Amount"
                                                            description="The number of mentors the team has"
                                                            value={pitScoutingData.generalMentorNum}
                                                            readOnly
                                                        />

                                                        <TextInput
                                                            type="number"
                                                            placeholder="2"
                                                            label="Robot Amount"
                                                            description="The number of robots the team has"
                                                            value={pitScoutingData.generalRobotNum}
                                                            readOnly
                                                        />
                                                    </Group>
                                                </Accordion.Panel>
                                            </Accordion.Item>
                                            <Accordion.Item value="mechanical">
                                                <Accordion.Control>Mechanical</Accordion.Control>
                                                <Accordion.Panel>
                                                    <Group p={12}>
                                                        <Textarea
                                                            placeholder="Description..."
                                                            label="Drive Train Type?"
                                                            description="What kind of drive train does the team use?"
                                                            autosize
                                                            minRows={1}
                                                            value={pitScoutingData.generalDriveTrain}
                                                            readOnly
                                                        />

                                                        <Textarea
                                                            placeholder="Description..."
                                                            label="Drive Train Brand?"
                                                            description="What brand of drive train does the team use?"
                                                            autosize
                                                            minRows={1}
                                                            value={pitScoutingData.generalDriveTrainBrand}
                                                            readOnly
                                                        />

                                                        <Textarea
                                                            placeholder="Description..."
                                                            label="Manipulation"
                                                            description="Type of mechanism for manipulation?"
                                                            autosize
                                                            minRows={1}
                                                            value={pitScoutingData.driveteamManipulationMech}
                                                            readOnly
                                                        />

                                                        <Textarea
                                                            placeholder="Description..."
                                                            label="Charge Station Size?"
                                                            description="How many inches do they take up on the Charge Station?"
                                                            autosize
                                                            minRows={1}
                                                            value={pitScoutingData.mechanicalChargeStationInches}
                                                            readOnly
                                                        />

                                                        <Textarea
                                                            placeholder="Description..."
                                                            label="Frame Dimensions?"
                                                            description="Robot Frame Dimensions? (No Bumpers)"
                                                            autosize
                                                            minRows={1}
                                                            value={pitScoutingData.mechanicalFrameDimensions}
                                                            readOnly
                                                        />
                                                    </Group>
                                                </Accordion.Panel>
                                            </Accordion.Item>
                                            <Accordion.Item value="programming">
                                                <Accordion.Control>Programming</Accordion.Control>
                                                <Accordion.Panel>
                                                    <Group p={12}>
                                                        <Textarea
                                                            placeholder="Description..."
                                                            label="Programming Language"
                                                            description="What programming language does the team use?"
                                                            autosize
                                                            minRows={1}
                                                            value={pitScoutingData.strategyLanguage}
                                                            readOnly
                                                        />

                                                        <Textarea
                                                            placeholder="Description..."
                                                            label="April Tags"
                                                            description="How do you use the April Tags?"
                                                            autosize
                                                            minRows={1}
                                                            value={pitScoutingData.strategyAprilTags}
                                                            readOnly
                                                        />

                                                        <Checkbox
                                                            size="sm"
                                                            label="Does the team have cameras?"
                                                            checked={pitScoutingData.mechanicalHaveCameras}
                                                            readOnly
                                                        />

                                                        <Textarea
                                                            placeholder="Description..."
                                                            label="Camera Usage?"
                                                            description="How does the team use cameras?"
                                                            autosize
                                                            minRows={1}
                                                            value={pitScoutingData.generalCameraUsage}
                                                            readOnly
                                                        />
                                                    </Group>
                                                </Accordion.Panel>
                                            </Accordion.Item>
                                            <Accordion.Item value="autonomous">
                                                <Accordion.Control>Autonomous</Accordion.Control>
                                                <Accordion.Panel>
                                                    <Group p={12}>
                                                        <Checkbox
                                                            size="sm"
                                                            label="Does the team have auto?"
                                                            checked={pitScoutingData.mechanicalHaveAuto}
                                                            readOnly
                                                        />

                                                        <Textarea
                                                            placeholder="Description..."
                                                            label="Best Autonomous"
                                                            description="What autos do you have? Best Auto?"
                                                            autosize
                                                            minRows={1}
                                                            value={pitScoutingData.mechanicalAutoInfo}
                                                            readOnly
                                                        />

                                                        <Textarea
                                                            placeholder="Description..."
                                                            label="Auto Balancing?"
                                                            description="Do they have any auto balancing tools for the charge station?"
                                                            autosize
                                                            minRows={1}
                                                            value={pitScoutingData.mechanicalAutoBalancingTools}
                                                            readOnly
                                                        />
                                                    </Group>
                                                </Accordion.Panel>
                                            </Accordion.Item>
                                            <Accordion.Item value="scoring">
                                                <Accordion.Control>Scoring</Accordion.Control>
                                                <Accordion.Panel>
                                                    <Group p={12}>
                                                        <Group>
                                                            <Checkbox
                                                                size="sm"
                                                                label="Cubes Low?"
                                                                checked={pitScoutingData.mechanicalCubesLow}
                                                                readOnly
                                                            />
                                                            <Checkbox
                                                                size="sm"
                                                                label="Cones Low?"
                                                                checked={pitScoutingData.mechanicalConesLow}
                                                                readOnly
                                                            />
                                                        </Group>

                                                        <Group>
                                                            <Checkbox
                                                                size="sm"
                                                                label="Cubes Mid?"
                                                                checked={pitScoutingData.mechanicalCubesMid}
                                                                readOnly
                                                            />
                                                            <Checkbox
                                                                size="sm"
                                                                label="Cones Mid?"
                                                                checked={pitScoutingData.mechanicalConesMid}
                                                                readOnly
                                                            />
                                                        </Group>

                                                        <Group>
                                                            <Checkbox
                                                                size="sm"
                                                                label="Cubes High?"
                                                                checked={pitScoutingData.mechanicalCubesHigh}
                                                                readOnly
                                                            />
                                                            <Checkbox
                                                                size="sm"
                                                                label="Cones High?"
                                                                checked={pitScoutingData.mechanicalConesHigh}
                                                                readOnly
                                                            />
                                                        </Group>
                                                    </Group>
                                                </Accordion.Panel>
                                            </Accordion.Item>
                                            <Accordion.Item value="strategy">
                                                <Accordion.Control>Strategy</Accordion.Control>
                                                <Accordion.Panel>
                                                    <Group p={12}>
                                                        <Textarea
                                                            placeholder="Description..."
                                                            label="Overall Strategy"
                                                            description="What was the team's overall strategy?"
                                                            autosize
                                                            minRows={1}
                                                            value={pitScoutingData.strategyOverall}
                                                            readOnly
                                                        />

                                                        <Textarea
                                                            placeholder="Description..."
                                                            label="Robot Compliments"
                                                            description="What type of robot complements them?"
                                                            autosize
                                                            minRows={1}
                                                            value={pitScoutingData.driveteamRobotCompliments}
                                                            readOnly
                                                        />

                                                        <Checkbox
                                                            size="sm"
                                                            label="Same drive team each match?"
                                                            checked={pitScoutingData.driveteamSameTeamMatch}
                                                            readOnly
                                                        />
                                                    </Group>
                                                </Accordion.Panel>
                                            </Accordion.Item>
                                            <Accordion.Item value="electronics">
                                                <Accordion.Control>Electronics</Accordion.Control>
                                                <Accordion.Panel>
                                                    <Group p={12}>
                                                        <Textarea
                                                            placeholder="Description..."
                                                            label="Protected Electronics?"
                                                            description="Are the team's electronics protected? (Look & Ask)"
                                                            autosize
                                                            minRows={1}
                                                            value={pitScoutingData.mechanicalProtectedElectronics}
                                                            readOnly
                                                        />

                                                        <Textarea
                                                            placeholder="Description..."
                                                            label="Battery Secured?"
                                                            description="Is the team's battery secured and how?"
                                                            autosize
                                                            minRows={1}
                                                            value={pitScoutingData.mechanicalSecuredBattery}
                                                            readOnly
                                                        />

                                                        <TextInput
                                                            type="number"
                                                            placeholder="2"
                                                            label="Number of Batteries"
                                                            description="The team's number of batteries"
                                                            value={pitScoutingData.mechanicalBatteryNum}
                                                            readOnly
                                                        />

                                                        <TextInput
                                                            placeholder="Oldest..."
                                                            label="Oldest battery"
                                                            description="The team's oldest battery"
                                                            value={pitScoutingData.mechanicalBatteryOldest}
                                                            readOnly
                                                        />

                                                        <TextInput
                                                            type="number"
                                                            placeholder="4"
                                                            label="Charge Amount"
                                                            description="The number of battery's team can charge"
                                                            value={pitScoutingData.mechanicalBatteryChargeNum}
                                                            readOnly
                                                        />
                                                    </Group>
                                                </Accordion.Panel>
                                            </Accordion.Item>
                                            <Accordion.Item value="other">
                                                <Accordion.Control>Other</Accordion.Control>
                                                <Accordion.Panel>
                                                    <Group p={12}>
                                                        <Textarea
                                                            placeholder="Description..."
                                                            label="Swerve Question"
                                                            description="If swerve, how many years have you used swerve?"
                                                            autosize
                                                            minRows={1}
                                                            value={pitScoutingData.generalSwerveYears}
                                                            readOnly
                                                        />

                                                        <Checkbox
                                                            size="sm"
                                                            label="Fix the loctite on falcons?"
                                                            checked={pitScoutingData.generalSwerveFixLoctite}
                                                            readOnly
                                                        />

                                                        <Checkbox
                                                            size="sm"
                                                            label="Fix Shafts on the Swerve SDS?"
                                                            checked={pitScoutingData.generalSwerveFixShafts}
                                                            readOnly
                                                        />

                                                        <Textarea
                                                            placeholder="Description..."
                                                            label="Issues?"
                                                            description="Are there any issues with the robot?"
                                                            autosize
                                                            minRows={1}
                                                            value={pitScoutingData.mechanicalRobotIssues}
                                                            readOnly
                                                        />

                                                        <Textarea
                                                            placeholder="Description..."
                                                            label="Robot Changes"
                                                            description="Changes since last competition?"
                                                            autosize
                                                            minRows={1}
                                                            value={pitScoutingData.driveteamChanges}
                                                            readOnly
                                                        />

                                                        <Textarea
                                                            placeholder="Description..."
                                                            label="Strongest Value"
                                                            description="What is the robot's strongest aspect?"
                                                            autosize
                                                            minRows={1}
                                                            value={pitScoutingData.driveteamStrongestValue}
                                                            readOnly
                                                        />

                                                        <Textarea
                                                            placeholder="Description..."
                                                            label="Weakest Value"
                                                            description="What is the robot's weakest aspect?"
                                                            autosize
                                                            minRows={1}
                                                            value={pitScoutingData.driveteamWeakestValue}
                                                            readOnly
                                                        />

                                                        <Textarea
                                                            placeholder="Description..."
                                                            label="Extra Comments?"
                                                            description="Any extra comments from them?"
                                                            autosize
                                                            minRows={1}
                                                            value={pitScoutingData.driveteamExtraComments}
                                                            readOnly
                                                        />
                                                    </Group>
                                                </Accordion.Panel>
                                            </Accordion.Item>
                                            <Accordion.Item value="contact">
                                                <Accordion.Control>Contact</Accordion.Control>
                                                <Accordion.Panel>
                                                    <Group p={12}>
                                                        <Textarea
                                                            placeholder="Description..."
                                                            label="Contact Info?"
                                                            description={`Any team contact info for discussing strategy? Include name with contact`}
                                                            autosize
                                                            minRows={1}
                                                            value={pitScoutingData.driveteamDirectContact}
                                                            readOnly
                                                        />
                                                    </Group>
                                                </Accordion.Panel>
                                            </Accordion.Item>
                                        </>
                                    ) :
                                        <Accordion.Item value="pitscouting">
                                            <Accordion.Control>Pit Scouting</Accordion.Control>
                                            <Accordion.Panel>
                                                <Group p={12}>
                                                    <Text align="center" size="lg" weight={500}>
                                                        No Pit Scouting data found!
                                                    </Text>
                                                </Group>
                                            </Accordion.Panel>
                                        </Accordion.Item>}
                                </Accordion>
                            </Tabs.Panel>
                        </Tabs>


                    </div>}
                </div>
            </div>
        </div>
    )
}

export default SubmissionsFormData