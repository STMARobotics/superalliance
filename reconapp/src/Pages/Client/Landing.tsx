import { Button, Checkbox, createStyles, SimpleGrid, UnstyledButton, Image, Text, Grid, Card, AspectRatio, Container, Paper, useMantineTheme, Select, Stepper, Group, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import { UpdatedHeader } from "../Components/UpdatedHeader";
import submissionsHomeStyles from "../Styles/SubmissionsHomeStyles";
import EventSelectStyles from "../Styles/EventSelectStyles";
import { useLocalStorage } from "@mantine/hooks";
import { config } from '../../Constants'
import GetTeamData from "../Utils/GetTeamData";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import { getUserData } from "../Utils/ReconQueries";
import { showNotification } from "@mantine/notifications";

function Landing() {

    const theme = useMantineTheme()

    const { classes } = submissionsHomeStyles()
    const eventSelectClasses = EventSelectStyles().classes

    const [preferenceData, setPreferenceData] = useLocalStorage<any>({
        key: 'saved-preferences',
        defaultValue: {
            primaryColor: 'blue',
            dataShow: "all",
            landingComplete: false
        },
        getInitialValueInEffect: false,
    });

    const [selectedUser, setSelectedUser] = useLocalStorage<any>({
        key: 'saved-username',
        getInitialValueInEffect: false,
    });

    function changeColorPref(color: string) {
        preferenceData.primaryColor = color
        setPreferenceData({ ...preferenceData })
    }

    function changeDataPref(show: string) {
        preferenceData.dataShow = show
        setPreferenceData({ ...preferenceData })
    }

    useEffect(() => {
        if(selectedUser) {
            return setSelectedUserAutofill(selectedUser)
        }
    }, [selectedUser])

    useEffect(() => {
        try {
            if (preferenceData.landingComplete) window.location.href = "/"
        } catch {

        }
    }, [])

    useEffect(() => {
        (async function () {
            var eventArray: any[] = [];
            eventArray.push({
                label: "All Events",
                value: "all"
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

    const [active, setActive] = useState(0);
    const [loading, setLoading] = useState(false)
    const auth = useAuthUser()
    const authHeader = useAuthHeader()
    const token = authHeader()
    const [eventData, setEventData] = useState<any>([])
    const [userData, setUserData] = useState<any>([])
    const [selectedUserAutofill, setSelectedUserAutofill] = useState('')

    useEffect(() => {
        (async function () {
            const d = await getUserData(token)
            setUserData(d.data.users[0])
        })()
    }, [])
    
    const nextStep = () => {
        if(!selectedUser) return showNotification({
            title: 'Error',
            message: 'You need to select a user!',
            color: "red",
        })
        setActive((current) => (current < 2 ? current + 1 : current))
    };
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    function renderLanding(num: any) {
        switch (num) {
            case 0:
                return (
                    <>
                        <h1>
                            <Text component="span" color={theme.primaryColor} inherit>
                                Select User
                            </Text>
                        </h1>
                        {auth()?.user == '7028Admin' ? <div className="LandingPageContent">
                            <Select
                                transition={'pop-top-left'}
                                transitionDuration={80}
                                transitionTimingFunction={'ease'}
                                dropdownPosition="bottom"
                                style={{ zIndex: 2 }}
                                data={config.adminUsers}
                                placeholder="Pick one"
                                label="Your Name"
                                classNames={eventSelectClasses}
                                value={selectedUserAutofill}
                                onChange={(event: string) => {
                                    setSelectedUser(event)
                                }}
                            />
                        </div> : <div className="LandingPageContent">
                            <Select
                                transition={'pop-top-left'}
                                transitionDuration={80}
                                transitionTimingFunction={'ease'}
                                dropdownPosition="bottom"
                                style={{ zIndex: 2 }}
                                data={userData}
                                value={selectedUserAutofill}
                                placeholder="Pick one"
                                label="Your Name"
                                classNames={eventSelectClasses}
                                onChange={(event: string) => {
                                    setSelectedUser(event)
                                }}
                            />
                        </div>}
                    </>
                )
            case 1:
                return (
                    <>
                        <h1>
                            <Text component="span" color={theme.primaryColor} inherit>
                                Preferences
                            </Text>
                        </h1>

                        <div className="LandingPageContent">
                            <Select
                                transition={'pop-top-left'}
                                transitionDuration={80}
                                transitionTimingFunction={'ease'}
                                dropdownPosition="bottom"
                                style={{ zIndex: 20 }}
                                data={config.colors}
                                value={preferenceData?.primaryColor ? preferenceData.primaryColor : "blue"}
                                placeholder="Pick one"
                                label="Select Color Theme"
                                classNames={eventSelectClasses}
                                onChange={(event: string) => {
                                    changeColorPref(event)
                                }}
                            />

                            <br />

                            <Select
                                transition={'pop-top-left'}
                                transitionDuration={80}
                                transitionTimingFunction={'ease'}
                                dropdownPosition="bottom"
                                style={{ zIndex: 10 }}
                                data={eventData}
                                placeholder="Pick one"
                                label="Select Data To Show"
                                value={preferenceData?.dataShow ? preferenceData.dataShow : "all"}
                                classNames={eventSelectClasses}
                                onChange={(event: string) => {
                                    changeDataPref(event)
                                }}
                            />
                        </div>
                    </>
                )
            case 2:
                return setLoading(true)
        }
    }

    useEffect(() => {
        if (active == 2) {
            if(!preferenceData.dataShow) preferenceData.dataShow = "all"
            if(!preferenceData.primaryColor) preferenceData.primaryColor = "blue"
            window.location.href = '/'
            preferenceData.landingComplete = true
            setPreferenceData({ ...preferenceData })
        }
    }, [active])

    return (
        <div className="LandingContainer">
            <UpdatedHeader />
            <div className="LandingPageHome">

                <div className="LandingStepperTop">
                    <Stepper active={active} breakpoint="sm">
                        <Stepper.Step label="First step" description="Select a User">
                        </Stepper.Step>
                        <Stepper.Step label="Second step" description="Set preferences">
                        </Stepper.Step>
                        <Stepper.Completed>
                        </Stepper.Completed>
                    </Stepper>
                </div>
                {loading ? <Loader color="violet" /> : <>{renderLanding(active)}</>}

                {active !== 2 ? <div className="LandingStepperBottom">
                    <Group position="center" mt="xl">
                        <Button variant="default" onClick={prevStep}>Back</Button>
                        <Button onClick={nextStep}>Next step</Button>
                    </Group>
                </div> : null}

            </div>
        </div>
    )
}

export default Landing