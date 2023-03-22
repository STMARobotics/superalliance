import { Avatar, Badge, Button, Center, createStyles, Drawer, Group, LoadingOverlay, Paper, Progress, ScrollArea, Text, ThemeIcon, useMantineTheme, Image, Modal, Transition, Card, Overlay, Flex, Accordion, Table, ActionIcon, Anchor, TextInput, Textarea, Checkbox, Grid } from '@mantine/core'
import { useCallback, useEffect, useMemo, useState } from "react"
import { getHotkeyHandler, useDisclosure, useElementSize, useFocusTrap, useLocalStorage, useViewportSize } from "@mantine/hooks"

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from 'uuid';
import { IconAdjustments, IconBrandYoutube, IconCircleNumber1, IconClipboard, IconClipboardData, IconForms, IconPencil, IconSwimming, IconTrash } from "@tabler/icons"
import { hideNotification, showNotification } from "@mantine/notifications"
import GetTeamData from '../../Utils/GetTeamData';

const ICON_SIZE = 60;

const useStyles = createStyles((theme) => ({
    item: {
        ...theme.fn.focusStyles(),
        display: 'flex',
        alignItems: 'center',
        borderRadius: theme.radius.md,
        border: `${1} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
            }`,
        padding: `${theme.spacing.sm}px ${theme.spacing.xl}px`,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
        marginBottom: theme.spacing.sm,
    },

    itemDragging: {
        boxShadow: theme.shadows.sm,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[1]
    },

    symbol: {
        fontSize: 30,
        fontWeight: 700,
        width: 60,
    },
}));

const cardStyles = createStyles((theme) => ({
    card: {
        position: 'relative',
        overflow: 'visible',
        padding: theme.spacing.xs,
        paddingTop: `${theme.spacing.xl * 1.5 + ICON_SIZE / 3}px`,
    },

    criticalCard: {
        position: 'relative',
        overflow: 'visible',
        padding: `${theme.spacing.xl}px`,
    },

    criticalCardContents: {
        position: 'relative',
        overflow: 'visible',
        padding: `${theme.spacing.xs}px !important`,
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        lineHeight: 1,
    },
}));

const columnsFromBackend = {
    [uuidv4()]: {
        name: "Teams",
        items: []
    },
    [uuidv4()]: {
        name: "Pick",
        items: []
    },
    [uuidv4()]: {
        name: "Pls No",
        items: []
    },
    [uuidv4()]: {
        name: "DNP",
        items: []
    }
};

interface SubmissionActionProps {
    matchNumber: number;
    youtubeLink: string;
    submissionId: string;
    criticals: any[];
}

function UserInfoAction({ matchNumber, youtubeLink, submissionId, criticals }: SubmissionActionProps) {

    const { classes, theme } = cardStyles();

    return (
        <div className={classes.criticalCardContents}>
            <Paper
                radius="md"
                p="sm"
                sx={(theme) => ({
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1]
                })}
                className={classes.criticalCardContents}
            >
                <Text align="center" size="lg" weight={500} color={theme.colorScheme === 'light' ? theme.colors.dark[5] : theme.colors.gray[1]}>
                    Match #{matchNumber}
                </Text>

                <Flex
                    gap="xs"
                    justify="center"
                    align="center"
                    direction="row"
                    wrap="wrap"
                    p={5}
                >

                    <ActionIcon
                        color={theme.primaryColor}
                        size={40}
                        radius="md"
                        variant="filled"
                        component="a"
                        href={`/submissions/analysis/form/${submissionId}`}
                        target="_blank"
                    >
                        <IconClipboardData size="1.625rem" />
                    </ActionIcon>

                    <Flex
                        gap="xs"
                        justify="center"
                        align="center"
                        direction="column"
                        wrap="wrap"
                        p={5}
                    >
                        {criticals.map((crit: any, index: any) => {
                            return (
                                <Badge
                                    key={index + 1}
                                    color={theme.colors.red[6]}
                                    variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
                                >
                                    {crit}
                                </Badge>
                            )
                        })}
                    </Flex>

                    <ActionIcon
                        color="red"
                        size={40}
                        radius="md"
                        variant="filled"
                        component="a"
                        href={youtubeLink}
                        target="_blank"
                    >
                        <IconBrandYoutube size="1.625rem" />
                    </ActionIcon>

                    {/* <Button
                    color={theme.primaryColor}
                    variant="outline"
                    fullWidth
                    mt="md"
                    component="a"
                    href={`/submissions/analysis/form/${submissionId}`}
                    target="_blank"
                >
                    View Form
                </Button>

                <Button
                    color={'red'}
                    variant="filled"
                    fullWidth
                    mt="md"
                    component="a"
                    href={youtubeLink}
                    target="_blank"
                >
                    YouTube Link
                </Button> */}
                </Flex>
            </Paper>
        </div>
    );
}

interface StatsCardProps {
    avatarUrl: string | undefined;
    teamNumber: string | undefined;
    teamName: string | undefined;
    formCount: number | undefined;
    selectedData: any | undefined;
    criticalData: any | undefined;
    pitScoutingData: any | undefined;
    eventStatusData: any | undefined;
    commentData: any | undefined;
}

function StatsCard({ avatarUrl, teamNumber, teamName, formCount, selectedData, criticalData, pitScoutingData, eventStatusData, commentData }: StatsCardProps) {

    const { classes, theme } = cardStyles();

    const [opened, { open, close }] = useDisclosure(false);

    const convertData = (number: number) => {
        if (!number) return "No Data"
        const data = Math.round(100 * number) / 100
        if (isNaN(data)) {
            return "No Data"
        }
        return data
    }

    const averageData = [
        { label: 'Average Score', value: convertData(selectedData?.AvgScore) },
        { label: 'Average Auto Score', value: convertData(selectedData?.AvgAutoScore) },
        { label: 'Average Teleop Score', value: convertData(selectedData?.AvgTeleScore) },
        { label: 'Best Auto Score', value: convertData(selectedData?.BestAuto) },
        { label: 'Best Tele Score', value: convertData(selectedData?.BestTele) },
        { label: "Average Cones", value: `${convertData(selectedData?.AvgCones)}` },
        { label: "Average Cubes", value: `${convertData(selectedData?.AvgCubes)}` },
        { label: "Average High Cones", value: `${convertData(selectedData?.AvgHighCone)}` },
        { label: "Average Mid Cones", value: `${convertData(selectedData?.AvgMidCone)}` },
        { label: "Average Low Cones", value: `${convertData(selectedData?.AvgLowCone)}` },
        { label: "Average High Cubes", value: `${convertData(selectedData?.AvgHighCube)}` },
        { label: "Average Mid Cubes", value: `${convertData(selectedData?.AvgMidCube)}` },
        { label: "Average Low Cubes", value: `${convertData(selectedData?.AvgLowCube)}` },
        { label: "Average Single HP Chosen", value: `${convertData(selectedData?.AvgSinglePlayer)}` },
        { label: "Average Double HP Chosen", value: `${convertData(selectedData?.AvgDoublePlayer)}` },
        { label: "Average Both HP Chosen", value: `${convertData(selectedData?.AvgBothPlayer)}` },
        { label: "Picked up 2 Floor Cones?", value: (selectedData?.FloorCone) ? "Yes" : "No" },
        { label: "Picked up 2 Tipped Cones?", value: (selectedData?.TipCone) ? "Yes" : "No" },
        { label: "Total Criticals", value: `${convertData(selectedData?.TotalCrit)}` },
        { label: 'Average RP', value: convertData(selectedData?.RP) },
        { label: 'Defense?', value: (selectedData?.Defense == 1) ? "Yes" : "No" },
    ]

    const rows = averageData.map((item: any, index: any) => (
        <tr key={index + 1}>
            <td>
                <Badge
                    color={theme.primaryColor}
                    variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
                >
                    {item.label}
                </Badge>
            </td>
            <td>
                <Anchor component="button" size="sm">
                    {item.value}
                </Anchor>
            </td>
        </tr>
    ));

    return (
        <div>
            <Paper radius="md" className={classes.card} mt={`calc(${ICON_SIZE} / 3)`}>
                <Center pb={24}><Avatar src={avatarUrl} radius="md" size="lg" /></Center>
                <Text ta="center" fw={700} className={classes.title}>
                    {teamNumber}
                </Text>
                <Text c="dimmed" ta="center" fz="sm">
                    {teamName}
                </Text>

                {eventStatusData ? <>
                    <Group position="apart" mt="xs">
                        <Text fz="sm" color="dimmed">
                            Current Rank
                        </Text>
                        <Text fz="sm" color="dimmed">
                            {eventStatusData.qual.ranking.rank} / {eventStatusData.qual.num_teams}
                        </Text>
                    </Group>

                    <Progress value={(eventStatusData.qual.ranking.rank / eventStatusData.qual.num_teams) * 100} mt={5} />
                </> : <>
                    <Group position="apart" mt="xs">
                        <Text fz="sm" color="dimmed">
                            Form Count
                        </Text>
                        <Text fz="sm" color="dimmed">
                            {formCount}
                        </Text>
                    </Group>

                    <Progress value={100} mt={5} />
                </>}

                <Accordion defaultValue={['teamoverview']} pt={10} multiple variant="contained">
                    <Accordion.Item value="teamoverview">
                        <Accordion.Control>Stats Overview</Accordion.Control>
                        <Accordion.Panel>
                            <ScrollArea>
                                <Table sx={{ maxWidth: '100%' }} verticalSpacing="sm">
                                    <tbody>{rows}</tbody>
                                </Table>
                            </ScrollArea>
                        </Accordion.Panel>
                    </Accordion.Item>
                    {commentData.length !== 0 ? <Accordion.Item value="comments">
                        <Accordion.Control>Comments</Accordion.Control>
                        <Accordion.Panel>
                            <Grid grow>
                                {commentData.map((comment: any, index: any) => {
                                    return (
                                        <Grid.Col span={12} key={index + 1}>
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
                        </Accordion.Panel>
                    </Accordion.Item> : null}
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
            </Paper>

            {criticalData.length !== 0 ? <Paper radius="md" className={classes.criticalCard}>
                <Text ta="center" fw={700} className={classes.title} pb={24}>
                    Team Criticals
                </Text>
                {criticalData.map((critical: any, index: any) => {
                    return (
                        <div key={index + 1}>
                            <UserInfoAction
                                matchNumber={critical.matchNumber}
                                youtubeLink={critical.youtubeLink}
                                submissionId={critical.submissionId}
                                criticals={critical.criticals} />
                        </div>
                    )
                })}
            </Paper> : null}
        </div>
    );
}

interface QuickTeamSearchProps {
    team: any;
}

function InspectorComponent({ team }: QuickTeamSearchProps) {

    const theme = useMantineTheme()
    const { height, width } = useViewportSize();

    const [teams, setTeams] = useState<any>([])
    const [visible, setVisible] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [teamNames, setTeamNames] = useState<any>([])
    const [formData, setFormData] = useState<any[]>([])
    const [dragLoading, setDragLoading] = useState(false);

    const [columns, setColumns] = useState(columnsFromBackend);
    const { classes, cx } = useStyles();
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedTeam, setSelectedTeam] = useState<any>()
    const [teamAvatars, setTeamAvatars] = useState<any>([])
    const [selectedData, setSelectedData] = useState<any>()
    const [eventData, setEventData] = useState<any[]>([])
    const [averageData, setAverageData] = useState([])
    const [criticalData, setCriticalData] = useState<any>([])
    const [selectedCriticalData, setSelectedCriticalData] = useState<any>([])
    const [criticalsLoading, setCriticalsLoading] = useState(true)
    const [pitScoutingData, setPitScoutingData] = useState<any>()
    const [eventStatusData, setEventStatusData] = useState<any>()
    const [commentData, setCommentData] = useState<any[]>([])
    const [eventCode, setEventCode] = useState('')

    const focusTrapRef = useFocusTrap();
    const [searchbyteamnum, setSearchbyteamnum] = useState('')

    const [preferenceData, setPreferenceData] = useLocalStorage<any>({
        key: 'saved-preferences',
        getInitialValueInEffect: false,
    });

    useEffect(() => {
        if (team) {
            setSelectedTeam({ content:team })
        }
    }, [team])

    useEffect(() => {
        (async function () {
            var itemsFromBackend: any = []
            if (preferenceData.dataShow == 'all') {
                const data = await GetTeamData.getTeamsFromAPI()
                setTeams(data.data.teams)
                data.data.teams.map((team: any, index: any) => {
                    const struct = {
                        id: `${index + 1}`,
                        content: team.number,
                        count: team.count,
                        name: getName(team.number)
                    }
                    itemsFromBackend.push(struct)
                })
            } else {
                const data = await GetTeamData.getTeamsInEventFromAPI(preferenceData.dataShow)
                setTeams(data.data.teams)
                data.data.teams.map((team: any, index: any) => {
                    const struct = {
                        id: `${index + 1}`,
                        content: team.number,
                        count: team.count,
                        name: getName(team.number)
                    }
                    itemsFromBackend.push(struct)
                })
            }
            if (teamNames.length !== 0) return setLoaded(true)
        })()
    }, [teamNames]);

    useEffect(() => {
        (async function () {
            const teamD = window.localStorage.getItem('teamNames');
            if (teamD) {
                const data = await JSON.parse(teamD)
                setTeamNames(data.teams)
            }
        })()
    }, [])

    useEffect(() => {
        if (loaded) {
            setVisible(false)
        }
    }, [teams])

    useEffect(() => {
        (async function () {
            if (preferenceData?.dataShow !== 'all') {
                await getEventCode()
            }
        })()
    }, [preferenceData])

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
            return setEventCode(d.eventcode)
        } catch {
            return setEventCode("")
        }
    }

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
        setDragging(false)
        setDragLoading(false)
    }, [columns])

    useEffect(() => {
        (async function () {
            if (preferenceData.dataShow !== 'all' && opened) {
                try {
                    if (preferenceData.dataShow == 'all') return
                    const event = eventCode
                    const data = await GetTeamData.getCriticalYoutubeData(event, selectedTeam?.content)
                    setCriticalData(data.data)
                } catch {

                }
            }
        })()
    }, [opened])

    useEffect(() => {
        (async function () {
            if (eventCode !== '') {
                const data = await GetTeamData.getAggregationDataEvent(eventCode)
                return setAverageData(data.data)
            } else {
                const data = await GetTeamData.getAggregationData()
                return setAverageData(data.data)
            }
        })()
    }, [eventData, eventCode])

    const getName = (num: any) => {
        try {
            const filtered = teamNames.filter((e: any) => {
                return e.number == num
            })[0].name
            return filtered
        } catch {
            return "Loading... Don't Move!"
        }
    }

    const getAvatar = (teamNum: any) => {
        try {
            return teamAvatars.filter((e: any) => e.number == teamNum)[0].avatar
        } catch {
            return ''
        }
    }

    useEffect(() => {
        (async function () {
            if (selectedTeam?.content) {
                getTeamAverage()
                await getEventStatus(selectedTeam.content)
                await getTeamPitScoutingData(selectedTeam.content)
                await getTeamComments(selectedTeam.content)
                hideNotification('team-loading')
                return open()
            }
        })()
    }, [selectedTeam])

    const getEventStatus = async (team: string | undefined) => {
        if (preferenceData?.dataShow !== 'all') {
            const data = await GetTeamData.getTeamEventStatus(eventCode, team)
            if (preferenceData.dataShow == 'testing') return
            if (preferenceData.dataShow == 'week0') return
            return setEventStatusData(data.data)
        }
    }

    useEffect(() => {
        (async function () {
            const data = await GetTeamData.getAllFormSorting()
            setFormData(data.data)
        })()
    }, [])


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

    const getTeamAverage = () => {
        averageData.map((average: any) => {
            if (average._id == selectedTeam.content) return setSelectedData(average)
        })
    }

    const getTeamPitScoutingData = async (team: string | undefined) => {
        if (selectedTeam?.content) {
            const data = await GetTeamData.getPitScoutingData(team)
            setPitScoutingData(data.data)
        }
    }

    const getInitials = (name: any) => {
        let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

        let initials = [...name.matchAll(rgx)] || [];

        initials = (
            (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
        ).toUpperCase();
        if (!initials) return 'NA'
        return initials
    }

    return (
        <>
            <div className="DrawerContent" style={{ position: 'relative' }}>

                {/*{pitScoutingData && pitScoutingData?.robotImage && (<Drawer
                    zIndex={10000}
                    opened={opened}
                    onClose={close}
                    withCloseButton={false}
                    padding="xl"
                    size={'calc(100% - 500px)'}
                    position={'left'}
                    transition="rotate-left"
                    transitionDuration={250}
                    transitionTimingFunction="ease"
                    overlayOpacity={0}
                    styles={{ body: { height: "100%" }, drawer: { backgroundColor: 'rgba(0, 0, 0, 0)' } }}
                    withOverlay={false}
                >
                    <Flex
                        h={"100%"}
                        gap="md"
                        justify="center"
                        align="center"
                        direction="column"
                        wrap="wrap"
                    >
                        <ScrollArea sx={{ height: '100%' }} mx="-md" pt={"44px"}>
                            <Card>
                                <Image fit="contain" height={`${height - 180}px`} radius={'md'} src={`${pitScoutingData?.robotImage}`} />
                            </Card>
                        </ScrollArea>
                    </Flex>
                </Drawer>)}*/}

                <Drawer
                    zIndex={10000}
                    opened={opened}
                    onClose={close}
                    padding="xl"
                    size="xl"
                    position={'right'}
                    overlayOpacity={0.6}
                    shadow="xl"
                >
                    <ScrollArea sx={{ height: '100vh' }} mx="-md" pb={"72px"}>
                        <StatsCard
                            avatarUrl={getAvatar(selectedTeam?.content)}
                            teamNumber={selectedTeam?.content}
                            teamName={getName(selectedTeam?.content)}
                            formCount={selectedTeam?.count}
                            selectedData={selectedData}
                            criticalData={criticalData}
                            pitScoutingData={pitScoutingData}
                            eventStatusData={eventStatusData}
                            commentData={commentData} />
                    </ScrollArea>
                </Drawer>
            </div>
        </>
    )
}

export default InspectorComponent