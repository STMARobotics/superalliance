import { UpdatedHeader } from "../Components/UpdatedHeader"
import { Button, Grid, Paper, Text, useMantineTheme } from '@mantine/core'
import { useLocalStorage } from "@mantine/hooks";
import moment from "moment";
import { useEffect, useState } from "react";
import GetTeamData from "../Utils/GetTeamData";
import { useParams } from "react-router-dom";

interface SubmissionActionProps {
    submissionNumber: number;
    author: string;
    time: string;
    link: string;
    teamNumber: number;
    win: boolean;
    rankPoints: number;
    matchNumber: number;
}

function UserInfoAction({ matchNumber, author, link, teamNumber, win, rankPoints }: SubmissionActionProps) {

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
                Team #{teamNumber} - Match #{matchNumber}
            </Text>
            <Text align="center" size="xs" color="white">
                {author} • +{rankPoints} RP
            </Text>

            <Button
                color={win ? "green" : "red"}
                variant="filled"
                fullWidth
                mt="md"
                component="a"
                href={link}
            >
                View Form
            </Button>
        </Paper>
    );
}

function SubmissionsUserForms() {

    const theme = useMantineTheme()

    let { author, } = useParams();

    const [userName, setUserName] = useState<any>('')

    const [formData, setFormData] = useState<any>([])

    useEffect(() => {
        (async function () {
            const submissionData = await GetTeamData.getAllFormSorting()
            setFormData(submissionData.data)
        })()
    }, [])

    useEffect(() => {
        setUserName((author)?.replace("+", " "))
    }, [])

    return (
        <div className="LandingContainer">
            <UpdatedHeader />
            <div className="LandingPageHome">
                <h1 style={{ paddingBottom: '25px' }}>
                    <Text component="span" color={theme.primaryColor} inherit>
                        {userName}'s Submissions
                    </Text>
                </h1>

                <Grid justify="center" grow w={"100%"}>
                    {formData.filter((e: any) => {
                        return e.usersName == userName
                    }).map((data: any, index: any) =>
                        <Grid.Col md={4} lg={3} key={index + 1}>
                            <UserInfoAction
                                submissionNumber={index + 1}
                                author={data.usersName}
                                time={moment(data.createdAt).format("hh:mm A")}
                                link={`/submissions/analysis/form/${data._id}`}
                                teamNumber={data.teamNumber}
                                win={data.win}
                                rankPoints={data.rankPointsEarned}
                                matchNumber={data.matchNumber}
                            />
                        </Grid.Col>
                    )}
                </Grid>
            </div>
        </div>
    )
}

export default SubmissionsUserForms