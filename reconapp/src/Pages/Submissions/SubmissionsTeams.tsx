import { Button, Card, Center, Grid, Group, LoadingOverlay, Text } from "@mantine/core";
import { IconAlien, IconClipboardData, IconNumber } from "@tabler/icons";
import { SubmissionsNavbar } from "../Components/SubmissionsNavbar";
import { UpdatedHeader } from "../Components/UpdatedHeader";
import teamCardStyles from "../Styles/TeamCardStyles";
import GetTeamData from "../Utils/GetTeamData";
import { useCallback, useEffect, useState } from "react";
import { getTeamsAndNames } from "../Utils/ReconQueries";
import { registerSpotlightActions, removeSpotlightActions } from "@mantine/spotlight";
import { useNavigate } from "react-router-dom";
import { completeNavigationProgress } from "@mantine/nprogress";

interface TeamCardProps {
    link: string;
    title: string;
    number: string;
    views: number;
}

function ImageCard({ title, number, views, link }: TeamCardProps) {

    const { classes, theme } = teamCardStyles();

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
                        Team {number}
                    </Text>

                    <Group position="apart" spacing="xs">
                        <Text size="sm" className={classes.number}>
                            {title}
                        </Text>

                        <Group spacing="lg">
                            <Center>
                                <IconClipboardData size={16} stroke={1.5} color="white" />
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

    const handleChange = useCallback(() => {
        (async function () {
            const teamD = window.localStorage.getItem('teamNames');
            if (teamD) {
                const data = await JSON.parse(teamD)
                await setTeamNames(data.teams)
            }
        })()
    }, [])

    useEffect(() => {
        (async function () {
            setVisible(true)
            const data = await GetTeamData.getTeamsFromAPI()
            setTeams(data.data.teams)
            setVisible(false)
            completeNavigationProgress()

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
            return teamNames.filter((e: any) => e.number == team.number)[0].name
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
                            pageIndex={1} />
                        <div className="SubmissionsFormsContent">
                            <Grid justify="center" align="flex-start">
                                {/** Generate an ImageCard element for every team found in the DB */}
                                {teams.map((team: any) =>
                                    <Grid.Col md={4} lg={3}>
                                        <ImageCard
                                            title={`${getName(team)}`}
                                            link={`/submissions/teams/${team.number}`}
                                            number={team.number}
                                            views={team.count}
                                        />
                                    </Grid.Col>)}
                            </Grid>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SubmissionsTeams