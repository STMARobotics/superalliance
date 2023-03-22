import { useAuthHeader, useAuthUser } from "react-auth-kit"
import { UpdatedHeader } from "../Components/UpdatedHeader"
import { Button, Flex, MultiSelect, Select, Text, useMantineTheme } from '@mantine/core'
import { AccessDenied } from "../Components/AccessDenied"
import { AdministrationNavbar } from "../Components/AdministrationNavbar"
import { config } from "../../Constants"
import { useEffect, useState } from "react"
import { checkToken, getEventLockData, getUserData } from "../Utils/ReconQueries"
import axios from "axios"
import GetTeamData from "../Utils/GetTeamData"

function AdminFormSettings() {

    const auth = useAuthUser()
    const theme = useMantineTheme()
    const authHeader = useAuthHeader()
    const token = authHeader()

    const [eventData, setEventData] = useState<any>([]);
    const [selectedEvent, setSelectedEvent] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async function () {
            var eventArray: any[] = [];
            eventArray.push({
                label: "None",
                value: "none"
            })
            eventArray.push({
                label: "Testing Event",
                value: "testing"
            })
            eventArray.push({
                label: "Week 0 Event",
                value: "week0"
            })
            const eventdata = await GetTeamData.getTeamEventDataLanding(7028, 2023)
            eventdata.data.map((event: any) => {
                eventArray.push(event)
            })
            setEventData(eventArray)
        })()
    }, [])

    useEffect(() => {
        (async function () {
            const dbData = await getEventLockData(token)
            setSelectedEvent(dbData.data.event)
        })()
    }, [])

    const updateEvent = () => {
        (async function () {
            setLoading(true)
            await axios.post(
                config.api_url + "/api/v1/admin/eventLock/save",
                {
                    token: token,
                    event: selectedEvent
                }
            ).then(() => {
                setLoading(false)
            })
        })()
    }

    return (
        <>
            {auth()?.user == "7028Admin" ? <>
                <div className="AdministrationContainer">

                    <UpdatedHeader />

                    <div className="AdministrationHomeSection">

                        <AdministrationNavbar
                            page="Form Settings" />

                        <div className="AdministrationHomeContent">
                            <Flex justify={'center'} align={'center'} direction={'column'} gap={'25px'}>
                                <Text
                                    className="SubmissionsFormDataTeamText"
                                    color={theme.primaryColor}
                                    ta="center"
                                    fz="xl"
                                    fw={700}
                                >
                                    Form Settings
                                </Text>

                                <Text
                                    color={theme.colors[theme.primaryColor][2]}
                                    ta="center"
                                    size={30}
                                    fw={500}
                                >
                                    Lock Event
                                </Text>

                                <Select
                                    transition={'pop-top-left'}
                                    transitionDuration={80}
                                    transitionTimingFunction={'ease'}
                                    dropdownPosition="bottom"
                                    style={{ zIndex: 2 }}
                                    data={eventData}
                                    placeholder="Pick one"
                                    label="Event Name"
                                    value={selectedEvent}
                                    onChange={(event: string) => setSelectedEvent(event)}
                                />

                                <Button loading={loading} onClick={() => { updateEvent() }}>
                                    Save Event
                                </Button>
                            </Flex>
                        </div>
                    </div>
                </div>
            </> : <>
                <AccessDenied />
            </>}
        </>
    )
}

export default AdminFormSettings