import { AggregationsNavbar } from "../Components/AggregationsNavbar"
import { UpdatedHeader } from "../Components/UpdatedHeader"
import { Avatar, Badge, Button, Center, createStyles, Drawer, Group, LoadingOverlay, Paper, Progress, ScrollArea, Text, ThemeIcon, useMantineTheme, Image, Modal, Transition, Card, Overlay, Flex, Accordion, Table, ActionIcon, Anchor, TextInput, Textarea, Checkbox, Grid } from '@mantine/core'
import { useCallback, useEffect, useState } from "react"
import GetTeamData from "../Utils/GetTeamData"
import { useDisclosure, useElementSize, useLocalStorage, useViewportSize } from "@mantine/hooks"
import { InspectorAverageStatsRings } from "../Components/InspectorAverageStats"

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from 'uuid';
import { IconAdjustments, IconBrandYoutube, IconClipboard, IconClipboardData, IconForms, IconPencil, IconSwimming, IconTrash } from "@tabler/icons"
import { config } from "../../Constants"
import { hideNotification, showNotification } from "@mantine/notifications"

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
        padding: theme.spacing.xl,
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

const onDragEnd = (result: any, columns: any, setColumns: any, setDragging: any, setDragLoading: any) => {
    if (!result.destination) return setDragging(false);
    const { source, destination } = result;

    setDragLoading(true)

    if (source.droppableId !== destination.droppableId) {
        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);
        setColumns({
            ...columns,
            [source.droppableId]: {
                ...sourceColumn,
                items: sourceItems
            },
            [destination.droppableId]: {
                ...destColumn,
                items: destItems
            }
        });
    } else {
        const column = columns[source.droppableId];
        const copiedItems = [...column.items];
        const [removed] = copiedItems.splice(source.index, 1);
        copiedItems.splice(destination.index, 0, removed);
        setColumns({
            ...columns,
            [source.droppableId]: {
                ...column,
                items: copiedItems
            }
        });
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
        { label: "Tipped Cones %", value: `${selectedData?.AvgTippedCone * 100}%` },
        { label: "Floor Cones %", value: `${selectedData?.AvgFloorCone * 100}%` },
        { label: "Total Criticals", value: `${convertData(selectedData?.TotalCrit)}` },
        { label: 'Average RP', value: convertData(selectedData?.RP) },
        { label: 'Defense %', value: `${selectedData?.AvgDefense * 100}%` },
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

            {criticalData.length !== 0 ? <Paper radius="md" className={classes.criticalCard} mt={`calc(${ICON_SIZE} / 3)`}>
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

function AnalyzedTeamSelection() {

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

    const [preferenceData, setPreferenceData] = useLocalStorage<any>({
        key: 'saved-preferences',
        getInitialValueInEffect: false,
    });

    useEffect(() => {
        (async function () {
            if (preferenceData.dataShow == 'all') {
                const data = await GetTeamData.getTeamsFromAPI()
                if (data.data.teams.length == 0) {
                    setVisible(false)
                    return showNotification({
                        title: 'Error!',
                        message: 'No teams found!',
                        color: 'red',
                    })
                }
            } else {
                const data = await GetTeamData.getTeamsInEventFromAPI(preferenceData.dataShow)
                if (data.data.teams.length == 0) {
                    setVisible(false)
                    return showNotification({
                        title: 'Error!',
                        message: 'No teams found!',
                        color: 'red',
                    })
                }
            }
        })()
    }, [])

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
            setColumns({
                ['1']: {
                    name: "Teams",
                    items: itemsFromBackend
                },
                ['2']: {
                    name: "Pick",
                    items: []
                },
                ['3']: {
                    name: "Pls No",
                    items: []
                },
                ['4']: {
                    name: "DNP",
                    items: []
                }
            })
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
    }, [columns])

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
            if (preferenceData.dataShow !== 'all') {
                try {
                    showNotification({
                        loading: true,
                        title: 'Criticals Loading...',
                        message: 'Informtion on team criticals is currently loading!',
                        disallowClose: true,
                        autoClose: false,
                        color: theme.colors.red[6],
                        id: 'crit-loading'
                    })
                    if (preferenceData.dataShow == 'all') return
                    const event = await getEventCode()
                    const data = await GetTeamData.getAllCriticalYoutubeData(event)
                    setCriticalData(data.data)
                    hideNotification('crit-loading')
                    showNotification({
                        title: 'Success!',
                        message: 'All criticals loaded sucessfully!',
                        color: theme.colors.green[6],
                    })
                } catch {
                    hideNotification('crit-loading')
                }
            }
        })()
    }, [eventData])

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
            getTeamAverage()
            await getEventStatus(selectedTeam?.content)
            await getTeamPitScoutingData()
            await getTeamComments(selectedTeam?.content)
            hideNotification('team-loading')
            if (selectedTeam?.content) return open()
        })()
    }, [selectedTeam])

    const getEventStatus = async (team: string | undefined) => {
        if (team) {
            if (preferenceData?.dataShow !== 'all') {
                const data = await GetTeamData.getTeamEventStatus(await getEventCode(), team)
                if (preferenceData.dataShow == 'testing') return
                if (preferenceData.dataShow == 'week0') return
                return setEventStatusData(data.data)
            }
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

    const getTeamPitScoutingData = async () => {
        if (selectedTeam?.content) {
            const data = await GetTeamData.getPitScoutingData(selectedTeam.content)
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
        <div className="SubmissionsContainer">
            <UpdatedHeader />
            <div className="SubmissionsHomeSection">
                <AggregationsNavbar
                    location={"Team Selection"} />
                <div className="SubmissionsHomeContent" style={{ position: 'relative' }}>
                    <LoadingOverlay visible={visible} overlayBlur={15} zIndex={10000} />
                    <Text
                        className="SubmissionsEventMatchesText"
                        color={theme.primaryColor}
                        ta="center"
                        fz="xl"
                        fw={700}
                    >
                        Team Selection
                    </Text>

                    <div className="DrawerContent" style={{ position: 'relative' }}>

                        {pitScoutingData && pitScoutingData?.robotImage && (<Drawer
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
                        </Drawer>)}

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
                                    criticalData={criticalData.filter((crit: any) => {
                                        return crit.teamNumber == selectedTeam?.content
                                    })}
                                    pitScoutingData={pitScoutingData}
                                    eventStatusData={eventStatusData}
                                    commentData={commentData} />
                            </ScrollArea>
                        </Drawer>
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
                        <DragDropContext
                            onDragEnd={result => onDragEnd(result, columns, setColumns, setDragging, setDragLoading)}
                            onDragStart={() => setDragging(true)}
                        >
                            {Object.entries(columns).map(([columnId, column], index) => {
                                return (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center"
                                        }}
                                        key={columnId}
                                    >
                                        <h2>{column.name} ({column.items.length})</h2>
                                        <div style={{ margin: 8 }}>
                                            <Droppable droppableId={columnId} key={columnId}>
                                                {(provided, snapshot) => {
                                                    return (
                                                        <div
                                                            {...provided.droppableProps}
                                                            ref={provided.innerRef}
                                                            style={{
                                                                padding: 4,
                                                                width: 250,
                                                                minHeight: 500
                                                            }}
                                                        >
                                                            {column.items.map((item, index) => {
                                                                return (
                                                                    <Draggable
                                                                        //@ts-ignore
                                                                        key={item.id}
                                                                        //@ts-ignore
                                                                        draggableId={item.id}
                                                                        index={index}
                                                                        isDragDisabled={dragging}
                                                                    >
                                                                        {(provided, snapshot) => {
                                                                            return (
                                                                                <div style={{ position: 'relative' }}>
                                                                                    {/* <LoadingOverlay visible={dragLoading} overlayBlur={2} /> */}
                                                                                    <div
                                                                                        ref={provided.innerRef}
                                                                                        {...provided.draggableProps}
                                                                                        {...provided.dragHandleProps}
                                                                                        className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
                                                                                        onClick={() => {
                                                                                            if (selectedTeam == item) {
                                                                                                open()
                                                                                                setSelectedTeam(item)
                                                                                            } else {
                                                                                                showNotification({
                                                                                                    loading: true,
                                                                                                    title: 'Inspector Loading...',
                                                                                                    message: 'Loading team information!',
                                                                                                    disallowClose: true,
                                                                                                    autoClose: false,
                                                                                                    color: theme.primaryColor,
                                                                                                    id: 'team-loading'
                                                                                                })
                                                                                                //@ts-ignore
                                                                                                setSelectedTeam(item)
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        {/* @ts-ignore */}
                                                                                        <Text className={classes.symbol}>{getInitials(item.name)}</Text>
                                                                                        <div>
                                                                                            {/* @ts-ignore */}
                                                                                            <Text>{item.content}</Text>
                                                                                            <Text color="dimmed" size="sm">
                                                                                                {/* @ts-ignore */}
                                                                                                {item.name}
                                                                                            </Text>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        }}
                                                                    </Draggable>
                                                                );
                                                            })}
                                                            {provided.placeholder}
                                                        </div>
                                                    );
                                                }}
                                            </Droppable>
                                        </div>
                                    </div>
                                );
                            })}
                        </DragDropContext>
                    </div>

                </div>
            </div >
        </div >
    )
}

export default AnalyzedTeamSelection