import { Avatar, Button, Grid, LoadingOverlay, Paper, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SubmissionsNavbar } from "../Components/SubmissionsNavbar";
import { UpdatedHeader } from "../Components/UpdatedHeader";
import GetTeamData from "../Utils/GetTeamData";
import { useNavigate } from "react-router-dom";

interface SubmissionActionProps {
    submissionNumber: string;
    author: string;
    time: string;
    link: string;
    matchNumber: number;
    win: boolean;
    rankPoints: number;
}

function UserInfoAction({ submissionNumber, author, time, link, matchNumber, win, rankPoints }: SubmissionActionProps) {

    const navigate = useNavigate();

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
                Match #{matchNumber} - {win ? "Win" : "Loss"}
            </Text>
            <Text align="center" size="sm" color="white">
                {author} • {time} • +{rankPoints} RP
            </Text>

            <Button color={win ? "green" : "red"} variant="filled" fullWidth mt="md" onClick={() => {
                navigate(link + `/${submissionNumber}`)
            }}>
                View Form
            </Button>
        </Paper>
    );
}

function SubmissionsFormData() {

    let { team } = useParams();
    const [formData, setFormData] = useState([])
    const [teamName, setTeamName] = useState("")
    const [visible, setVisible] = useState(true);

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
                        pageIndex={2}
                        teamName={team} />
                    {visible ? null : <div className="SubmissionsFormDataContent">
                        <Text
                            className="SubmissionsFormDataTeamText"
                            color="#0066b3"
                            ta="center"
                            fz="xl"
                            fw={700}
                        >
                            {team} • {teamName}
                        </Text>
                        <Grid justify="center" align="flex-start">
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
                                    />
                                </Grid.Col>)}
                        </Grid>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default SubmissionsFormData