import { Card, Center, Grid, Group, LoadingOverlay, Text, useMantineTheme } from "@mantine/core";
import { IconClipboardData } from "@tabler/icons";
import { SubmissionsNavbar } from "../Components/SubmissionsNavbar";
import { UpdatedHeader } from "../Components/UpdatedHeader";
import teamCardStyles from "../Styles/TeamCardStyles";
import GetTeamData from "../Utils/GetTeamData";
import { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "@mantine/hooks";

interface TeamCardProps {
    link: string;
    title: string;
    number: string;
    views: number;
}

function ImageCard({ title, number, views, link }: TeamCardProps) {

    const { classes } = teamCardStyles();

    const theme = useMantineTheme()

    return (
        <Card
            p="lg"
            shadow="lg"
            className={classes.card}
            radius="md"
            component="a"
            href={link}
        >
            <div className={classes.overlay} />

            <div className={classes.content}>
                <div>
                    <Text size="lg" className={classes.title} weight={500}>
                        #{number}
                    </Text>

                    <Group position="apart" spacing="xs">
                        <Text size="sm" className={classes.number}>
                            {title}
                        </Text>

                        <Group spacing="lg">
                            <Center>
                                <IconClipboardData size={16} stroke={1.5} color={theme.colorScheme === 'dark' ? theme.white : theme.black} />
                                <Text size="sm" className={classes.bodyText}>
                                    {views}
                                </Text>
                            </Center>
                        </Group>
                    </Group>
                </div>
            </div>
        </Card>
    );
}

function SubmissionsTeams() {

    const [teams, setTeams] = useState([])
    const [teamNames, setTeamNames] = useState<any>([])
    const [visible, setVisible] = useState(true);
    const theme = useMantineTheme()

    const handleChange = useCallback(() => {
        (async function () {
            const teamD = window.localStorage.getItem('teamNames');
            if (teamD) {
                const data = await JSON.parse(teamD)
                await setTeamNames(data.teams)
            }
        })()
    }, [])

    const [preferenceData, setPreferenceData] = useLocalStorage<any>({
        key: 'saved-preferences',
        getInitialValueInEffect: false,
    });

    useEffect(() => {
        (async function () {
            setVisible(true)
            if (preferenceData.dataShow == 'all') {
                const data = await GetTeamData.getTeamsFromAPI()
                setTeams(data.data.teams)
            } else {
                const data = await GetTeamData.getTeamsInEventFromAPI(preferenceData.dataShow)
                setTeams(data.data.teams)
            }
            setVisible(false)

            if (window.localStorage.getItem('teamNames')) {
                const teamD = window.localStorage.getItem('teamNames');
                if (teamD) {
                    const data = await JSON.parse(teamD)
                    await setTeamNames(data.teams)
                }
            }
        })()
    }, [handleChange]);

    window.addEventListener('storage', handleChange)

    const getName = (team: any) => {
        try {
            return teamNames.filter((e: any) => e.number === team.number)[0].name
        } catch {
            return team.name
        }
    }

    return (
        <>
            <div className="SubmissionsContainer">
                <UpdatedHeader />
                <div style={{ position: 'relative' }}>
                    <LoadingOverlay visible={visible} overlayBlur={2} />
                    <div className="SubmissionsHomeSection">
                        <SubmissionsNavbar
                            pageIndex={"Teams"} />
                        <div className="SubmissionsFormsContent">

                            {preferenceData.dataShow !== "all" && !visible ?
                                <Text
                                    className="SubmissionsFormDataTeamText"
                                    color={theme.primaryColor}
                                    ta="center"
                                    fz="xl"
                                    fw={700}
                                    pb={"20px"}
                                >
                                    Showing data for: {preferenceData.dataShow == 'week0' ? "Week 0 Event" : preferenceData.dataShow}
                                </Text> : null}

                            <Grid justify="center" align="flex-start">
                                {/** Generate an ImageCard element for every team found in the DB */}
                                {preferenceData.dataShow == 'all' ? <>
                                    {teams.map((team: any, index: any) =>
                                        <Grid.Col md={4} lg={3} key={index + 1}>
                                            <ImageCard
                                                title={`${getName(team)}`}
                                                link={`/submissions/teams/${team.number}`}
                                                number={team.number}
                                                views={team.count}
                                            />
                                        </Grid.Col>)}
                                </> : <>
                                    {teams.filter((e: any) => e.eventName == preferenceData.dataShow).map((team: any, index: any) =>
                                        <Grid.Col md={4} lg={3} key={index + 1}>
                                            <ImageCard
                                                title={`${getName(team)}`}
                                                link={`/submissions/teams/${team.number}`}
                                                number={team.number}
                                                views={team.count}
                                            />
                                        </Grid.Col>)}
                                </>}
                                {preferenceData.dataShow == 'testing' ? <>
                                    {teams.filter((e: any) => e.eventName == "Testing Event").map((team: any, index: any) =>
                                        <Grid.Col md={4} lg={3} key={index + 1}>
                                            <ImageCard
                                                title={`${getName(team)}`}
                                                link={`/submissions/teams/${team.number}`}
                                                number={team.number}
                                                views={team.count}
                                            />
                                        </Grid.Col>)}
                                </> : null}
                                {preferenceData.dataShow == 'week0' ? <>
                                    {teams.filter((e: any) => e.eventName == "Week 0 Event").map((team: any, index: any) =>
                                        <Grid.Col md={4} lg={3} key={index + 1}>
                                            <ImageCard
                                                title={`${getName(team)}`}
                                                link={`/submissions/teams/${team.number}`}
                                                number={team.number}
                                                views={team.count}
                                            />
                                        </Grid.Col>)}
                                </> : null}
                            </Grid>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SubmissionsTeams