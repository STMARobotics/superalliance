import { Button, Grid, Paper, Text } from "@mantine/core";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SubmissionsNavbar } from "../Components/SubmissionsNavbar";
import { UpdatedHeader } from "../Components/UpdatedHeader";
import GetTeamData from "../Utils/GetTeamData";

interface SubmissionActionProps {
    submissionNumber: number;
    author: string;
    time: string;
    link: string;
    teamNumber: number;
    win: boolean;
    rankPoints: number;
}

function UserInfoAction({ submissionNumber, author, time, link, teamNumber, win, rankPoints }: SubmissionActionProps) {

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
                Team #{teamNumber} - {win ? "Win" : "Loss"}
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

function SubmissionsMatchData() {

    let { eventId, matchId } = useParams();

    const [formData, setFormData] = useState([])
    const [eventName, setEventName] = useState("")

    useEffect(() => {
        (async function () {
            const data = await GetTeamData.getMatchData(eventId, matchId)
            const eventData = await GetTeamData.getEventData(2023, eventId)
            setEventName(eventData.data.short_name)
            setFormData(data.data)
        })()
    }, [])

    return (
        <div className="SubmissionsContainer">
            <UpdatedHeader />
            <div className="SubmissionsHomeSection">
                <SubmissionsNavbar
                    pageIndex={4}
                    eventId={eventId}
                    matchId={matchId} />
                <div className="SubmissionsFormDataContent">
                    <Text
                        className="SubmissionsFormDataTeamText"
                        color="#0066b3"
                        ta="center"
                        fz="xl"
                        fw={700}
                    >
                        {eventName}
                    </Text>

                    <Grid justify="center" align="flex-start">
                        {formData.map((data: any, index) =>
                            <Grid.Col md={4} lg={3} key={index + 1}>
                                <UserInfoAction
                                    submissionNumber={index + 1}
                                    author={data.usersName}
                                    time={moment(data.createdAt).format("hh:mm A")}
                                    link={`/submissions/event/${eventId}/${matchId}`}
                                    teamNumber={data.teamNumber}
                                    win={data.win}
                                    rankPoints={data.rankPointsEarned}
                                />
                            </Grid.Col>
                        )}
                    </Grid>
                </div>
            </div>
        </div>
    )
}

export default SubmissionsMatchData