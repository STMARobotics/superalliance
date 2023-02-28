import { Avatar, Button, Center, createStyles, Grid, Group, HoverCard, LoadingOverlay, Paper, Text, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SubmissionsNavbar } from "../Components/SubmissionsNavbar";
import { UpdatedHeader } from "../Components/UpdatedHeader";
import GetTeamData from "../Utils/GetTeamData";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@mantine/hooks";
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
    const theme = useMantineTheme();

    const [preferenceData, setPreferenceData] = useLocalStorage<any>({
        key: 'saved-preferences',
        getInitialValueInEffect: false,
    });

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
                            color={theme.primaryColor}
                            ta="center"
                            fz="xl"
                            fw={700}
                            pb={"20px"}
                        >
                            {team} • {teamName}
                        </Text>
                        <Grid justify="center" align="flex-start">
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
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default SubmissionsFormData