import '../Global.css'
import { ActionIcon, Avatar, Badge, Button, Card, CloseButton, Dialog, Grid, Group, Paper, Progress, Text } from '@mantine/core';
import { IconClick, IconUpload } from '@tabler/icons';
import HeaderComponent from '../Components/Header';
import { useNavigate } from 'react-router-dom';
import { UpdatedHeader } from '../Components/UpdatedHeader';
import { useEffect, useState } from 'react';
import GetTeamData from '../Utils/GetTeamData';
import moment from 'moment';
import { SuperAllianceStatus } from '../Components/SuperAllianceStatus';
import { config } from '../../Constants';

const avatars = [
    'https://avatars.githubusercontent.com/u/74215559?s=48&v=4',
];

interface SubmissionActionProps {
    teamNumber: number;
    time: string;
    matchNumber: number;
    win: boolean;
    rankPoints: number;
}

function UserInfoAction({ teamNumber, time, matchNumber, win, rankPoints }: SubmissionActionProps) {

    return (
        <Paper
            radius="md"

            className="SubmissionMatchBox"
            p="sm"
            sx={(theme) => ({
                backgroundColor: theme.colors.blue,
            })}
        >
            <Text align="center" size="lg" weight={500} color="white">
                Match #{matchNumber} - {win ? "Win" : "Loss"}
            </Text>
            <Text align="center" size="sm" color="white">
                Team #{teamNumber} • {moment(time).format("hh:mm A")} • +{rankPoints} RP
            </Text>
        </Paper>
    );
}

function Home() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState([])

    const [opened, setOpened] = useState(true);

    useEffect(() => {
        (async function () {
            const data = await GetTeamData.getAllFormData()
            setFormData(data.data)
        })()
    }, [])

    function NewForm() {
        navigate('/newform')
    }

    return (
        <div className="App">

            <UpdatedHeader />

            <div className="App-main">

                <div className="HomePageContainer">

                    {/* <div className="RecentSubmissions">
                        <Grid justify="center" align="flex-start">
                            {formData.map((data: any, index) =>
                                <Grid.Col span={12} key={index + 1}>
                                    <UserInfoAction
                                        teamNumber={data.teamNumber}
                                        time={data.createdAt}
                                        matchNumber={data.matchNumber}
                                        win={data.win}
                                        rankPoints={data.rankPointsEarned}
                                    />
                                </Grid.Col>)}
                        </Grid>
                    </div> */}

                    <Card withBorder radius="md">
                        <Group position="apart">
                            <Badge>{Math.floor((Date.parse("2/18/2023") - Date.now()) / 86400000)} Days Left</Badge>
                        </Group>

                        <Text size="lg" weight={500} mt="md">
                            {config.version} major release (February 2023)
                        </Text>
                        <Text size="sm" color="dimmed" mt={5}>
                            Admin Dashboard, Bug Fixes, Event Management, User Management, UI/UX Cleanup, 10+ Other Changes.
                        </Text>

                        <Text color="dimmed" size="sm" mt="md">
                            Tasks completed:{' '}
                            <Text
                                span
                                weight={500}
                                sx={(theme) => ({ color: theme.colorScheme === 'dark' ? theme.white : theme.black })}
                            >
                                4/8
                            </Text>
                        </Text>

                        <Progress value={(23 / 36) * 100} mt={5} />

                        <Group position="apart" mt="md">
                            <Avatar.Group spacing="sm">
                                <Avatar src={avatars[0]} radius="xl" />
                                <Avatar radius="xl">+4</Avatar>
                            </Avatar.Group>
                        </Group>
                    </Card>

                    <div className="NewFormButton">
                        <Button
                            variant="light"
                            rightIcon={
                                <IconClick size={20} stroke={1.5} />
                            }
                            radius="xl"
                            size="md"
                            styles={{
                                root: { paddingRight: 14, height: 48, },
                            }}
                            onClick={NewForm}
                        >
                            New Recon Form
                        </Button>
                    </div>
                    {/* <div className="RecentSubmissions">
                        <Grid justify="center" align="flex-start">
                            {formData.map((data: any, index) =>
                                <Grid.Col span={12} key={index + 1}>
                                    <UserInfoAction
                                        teamNumber={data.teamNumber}
                                        time={data.createdAt}
                                        matchNumber={data.matchNumber}
                                        win={data.win}
                                        rankPoints={data.rankPointsEarned}
                                    />
                                </Grid.Col>)}
                        </Grid>
                    </div> */}

                    {/* <SuperAllianceStatus
                        title='Super Alliance Tasks'
                        completed={4}
                        total={5}
                        stats={[
                            { value: 1, label: "In Progress" },
                            { value: 1, label: "Not Completed" },
                        ]}
                    /> */}

                </div>

            </div>
        </div>
    );
}

export default Home;
