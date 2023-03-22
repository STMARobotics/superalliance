import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SubmissionsNavbar } from "../Components/SubmissionsNavbar";
import { UpdatedHeader } from "../Components/UpdatedHeader";
import GetTeamData from "../Utils/GetTeamData";
import { Button, Grid, Text, useMantineTheme } from "@mantine/core";
import { completeNavigationProgress, resetNavigationProgress } from "@mantine/nprogress";
import { useLocalStorage } from "@mantine/hooks";

function SubmissionsEventData() {

    let { eventId, matchId } = useParams();
    let navigate = useNavigate()
    const theme = useMantineTheme();

    const [eventMatches, setEventMatches] = useState<any>([])
    const [eventData, setEventData] = useState<any>({})

    function navToMatch(matchNumber: number) {
        navigate(`/submissions/event/${eventId}/${matchNumber}`)
    }

    const [selectedPrefEvent, setSelectedPrefEvent] = useState("")

    const [preferenceData, setPreferenceData] = useLocalStorage<any>({
        key: 'saved-preferences',
        getInitialValueInEffect: false,
    });

    useEffect(() => {
        try {
            setSelectedPrefEvent(preferenceData.dataShow)
        } catch {

        }
    }, [])

    useEffect(() => {
    }, [selectedPrefEvent])

    useEffect(() => {
        (async function () {
            const eventData = await GetTeamData.getEventData(2023, eventId)
            const data = await GetTeamData.getEventMatchData(eventId)
            setEventData(eventData.data)
            setEventMatches(data.data)
        })()
    }, [])

    return (
        <div className="SubmissionsContainer">
            <UpdatedHeader />
            <div className="SubmissionsHomeSection">
                <SubmissionsNavbar
                    pageIndex={"Matches"}
                    matchId={matchId}
                    eventId={eventId} />
                <div className="SubmissionsFormsContent">

                    <Text
                        className="SubmissionsEventMatchesText"
                        color={theme.primaryColor}
                        ta="center"
                        fz="xl"
                        fw={700}
                    >
                        {eventData.name}
                    </Text>

                    <Grid justify="flex-start" align="flex-start">
                        {eventMatches.map((data: any, index: any) =>
                            <Grid.Col md={2} lg={1} sm={3} xs={4} span={6} key={index + 1}>
                                <a href={`/submissions/event/${eventId}/${data.matchNum}`} className="no-decoration">
                                    <Button w={"100%"} h={"100%"} variant={'outline'} color={theme.colors[theme.primaryColor][8]}>
                                        <h2>{data.matchNum}</h2>
                                    </Button>
                                </a>
                            </Grid.Col>)}
                    </Grid>
                </div>
            </div>
        </div>

    )
}

export default SubmissionsEventData