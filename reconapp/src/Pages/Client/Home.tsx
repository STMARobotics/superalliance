import '../Global.css'
import { Button, Grid, Paper, Text } from '@mantine/core';
import { IconClick } from '@tabler/icons';
import HeaderComponent from '../Components/Header';
import { useNavigate } from 'react-router-dom';
import { UpdatedHeader } from '../Components/UpdatedHeader';
import { useEffect, useState } from 'react';
import GetTeamData from '../Utils/GetTeamData';
import moment from 'moment';

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

                    <div className="RecentSubmissions">
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
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Home;