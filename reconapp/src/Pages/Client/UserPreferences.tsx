import { Select, Text, useMantineTheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { config } from "../../Constants";
import { UpdatedHeader } from "../Components/UpdatedHeader"
import EventSelectStyles from "../Styles/EventSelectStyles";
import GetTeamData from "../Utils/GetTeamData";

function UserPreferences() {

    const [preferenceData, setPreferenceData] = useLocalStorage<any>({
        key: 'saved-preferences',
        getInitialValueInEffect: false,
    });
    const [eventData, setEventData] = useState<any>([])

    const eventSelectClasses = EventSelectStyles().classes

    const theme = useMantineTheme()

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

    function changeColorPref(color: string) {
        preferenceData.primaryColor = color
        setPreferenceData({ ...preferenceData })
    }

    function changeDataPref(show: string) {
        preferenceData.dataShow = show
        setPreferenceData({ ...preferenceData })
    }

    return (
        <div className="LandingContainer">
            <UpdatedHeader />
            <div className="LandingPageHome">
                <h1>
                    <Text component="span" color={theme.primaryColor} inherit>
                        Preferences
                    </Text>
                </h1>

                <div className="LandingPageContent">
                    <Select
                        transition="pop-top-left"
                        transitionDuration={80}
                        transitionTimingFunction="ease"
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

                    <Select
                        transition="pop-top-left"
                        transitionDuration={80}
                        transitionTimingFunction="ease"
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
            </div>
        </div>
    )
}

export default UserPreferences