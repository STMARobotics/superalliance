import { useEffect, useState } from 'react';
import { Navbar, Tooltip, UnstyledButton, Stack, Affix, Transition, Button, Drawer, ScrollArea, Title } from '@mantine/core';
import {
    IconHome2,
    IconGauge,
    IconFolder,
    IconClipboardCheck,
    IconGraph,
    IconCalendarEvent,
    IconCalendarStats,
    IconNumber,
    IconActivity,
    IconAnalyze,
    IconRadar,
    IconMenu2,
    TablerIcon,
} from '@tabler/icons';
import SubmissionsNavbarStyles from '../Styles/SubmissionsNavbarStyles';
import { useNavigate } from 'react-router-dom';
import GetTeamData from '../Utils/GetTeamData';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { resetNavigationProgress, startNavigationProgress } from '@mantine/nprogress';

interface NavbarLinkProps {
    icon: TablerIcon;
    label: string;
    active?: boolean;
    onClick?(): void;
}

interface SubmissionsNavbarProps {
    pageIndex: string;
    teamName?: string;
    submissionId?: string;
    eventId?: string;
    matchId?: string;
}

export function SubmissionsNavbar({ pageIndex, teamName, submissionId, eventId, matchId }: SubmissionsNavbarProps) {

    const [eventName, setEventName] = useState("")
    const [eventData, setEventData] = useState<any>([])
    const { classes, cx, theme } = SubmissionsNavbarStyles()

    const [eventCode, setEventCode] = useState("#")

    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

    const [active, setActive] = useState("Submissions");
    const [activeLink, setActiveLink] = useState(pageIndex);
    const navigate = useNavigate()

    useEffect(() => {
        (async function () {
            const data = await GetTeamData.getEventData(2023, eventId)
            setEventName(data.data.short_name)
        })()
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
                value: "testing",
                shortCode: "testing"
            })
            eventArray.push({
                label: "Week 0 Event",
                value: "week0",
                shortCode: "week0"
            })
            const eventdata = await GetTeamData.getTeamEventDataLanding(7028, 2023)
            eventdata.data.map((event: any) => {
                eventArray.push(event)
            })
            setEventData(eventArray)
        })()
    }, [])

    const getShortName = () => {
        try {
            const d = eventData.filter((e: any) => {
                return e.value == preferenceData.dataShow
            })[0]
            return d.label
        } catch {
            return ""
        }
    }

    const getEventCode = () => {
        try {
            if (preferenceData.dataShow == 'testing') return setEventCode(`/submissions/event/testing`)
            if (preferenceData.dataShow == 'week0') return setEventCode(`/submissions/event/week0`)
            const d = eventData.filter((e: any) => {
                return e.value == preferenceData.dataShow
            })[0]
            return setEventCode(`/submissions/event/${d.eventcode}`)
        } catch {
            return ""
        }
    }

    useEffect(() => {
        if (preferenceData.dataShow !== 'all') {
            getEventCode()
        }
    }, [eventData])

    const [preferenceData, setPreferenceData] = useLocalStorage<any>({
        key: 'saved-preferences',
        getInitialValueInEffect: false,
    });

    const mockdata = [
        { icon: IconHome2, label: 'Home', url: "/submissions" },
        { icon: IconGraph, label: 'Teams', url: "/submissions/teams" },
    ];

    if (teamName) {
        mockdata.push({ icon: IconFolder, label: `Team ${teamName}`, url: `/submissions/teams/${teamName}` })
    }

    if (submissionId && !eventId) {
        mockdata.push({ icon: IconClipboardCheck, label: `Submission ${submissionId}`, url: `/submissions/teams/${teamName}/${submissionId}` })
    }

    if (preferenceData.dataShow !== 'all') {
        mockdata.push({ icon: IconCalendarEvent, label: "Matches", url: `${eventCode}` })
    } else {
        mockdata.push({ icon: IconCalendarEvent, label: "Events", url: `/submissions/events` })
    }

    if (eventId && preferenceData.dataShow == 'all') {
        mockdata.push({ icon: IconCalendarStats, label: `${eventName}`, url: `/submissions/event/${eventId}` })
    }

    if (matchId) {
        mockdata.push({ icon: IconRadar, label: `Match ${matchId}`, url: `/submissions/event/${eventId}/${matchId}` })
    }

    if (eventId && matchId && submissionId) {
        mockdata.push({ icon: IconClipboardCheck, label: `Submission ${submissionId}`, url: `/submissions/event/${eventId}/${matchId}/${submissionId}` })
    }

    const links = mockdata.map((link) => (
        <a
            className={cx(classes.link, { [classes.linkActive]: activeLink === link.label })}
            href={link.url}
            onClick={(event) => {
                event.preventDefault();
                window.location.href = link.url
            }}
            key={link.label}
        >
            {link.label}
        </a>
    ));

    return (
        <>
            <Navbar className={`AggregationsNavbar ${classes.hiddenMobile}`} width={{ sm: 275 }}>
                <Navbar.Section grow className={`${classes.wrapper} ${classes.hiddenMobile}`}>
                    <div className={classes.main}>
                        <Title order={4} className={classes.title}>
                            {active}
                        </Title>

                        {links}
                    </div>
                </Navbar.Section>
            </Navbar>

            {/* <Affix position={{ bottom: 20, right: 20 }} className={classes.hiddenDesktop}>
                <Transition transition="slide-up" mounted={!drawerOpened}>
                    {(transitionStyles) => (
                        <Button
                            variant="filled"
                            radius="xl"
                            size="xs"
                            styles={{
                                root: { height: 48 },
                            }}
                            onClick={toggleDrawer}
                        >
                            <IconMenu2 size={28}></IconMenu2>
                        </Button>
                    )}
                </Transition>
            </Affix>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="xs"
                padding="md"
                title="Submissions"
                className={`${classes.hiddenDesktop}`}
                zIndex={1000000}
                overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
                overlayOpacity={0.55}
                overlayBlur={3}
            >
                <ScrollArea sx={{ height: 'calc(100vh - 60px)' }} mx="-md">
                    <div className="SubmissionsNavbarMobile">
                        <Stack justify="center" spacing={0}>
                            {links}
                        </Stack>
                    </div>
                </ScrollArea>
            </Drawer> */}
        </>
    );
}