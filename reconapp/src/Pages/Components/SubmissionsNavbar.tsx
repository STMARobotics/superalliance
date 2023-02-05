import { useEffect, useState } from 'react';
import { Navbar, Tooltip, UnstyledButton, Stack, Affix, Transition, Button, Drawer, ScrollArea } from '@mantine/core';
import {
    TablerIcon,
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
} from '@tabler/icons';
import SubmissionsNavbarStyles from '../Styles/SubmissionsNavbarStyles';
import { useNavigate } from 'react-router-dom';
import GetTeamData from '../Utils/GetTeamData';
import { useDisclosure } from '@mantine/hooks';
import { resetNavigationProgress, startNavigationProgress } from '@mantine/nprogress';

interface NavbarLinkProps {
    icon: TablerIcon;
    label: string;
    active?: boolean;
    onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
    const { classes, cx } = SubmissionsNavbarStyles()
    return (
        <Tooltip label={label} position="right" transitionDuration={0}>
            <UnstyledButton onClick={onClick} className={cx(classes.link, { [classes.active]: active })}>
                <Icon stroke={1.5} />
            </UnstyledButton>
        </Tooltip>
    );
}

interface SubmissionsNavbarProps {
    pageIndex: number;
    teamName?: string;
    submissionId?: string;
    eventId?: string;
    matchId?: string;
}

export function SubmissionsNavbar({ pageIndex, teamName, submissionId, eventId, matchId }: SubmissionsNavbarProps) {

    const [eventName, setEventName] = useState("")
    const { classes, cx, theme } = SubmissionsNavbarStyles()

    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

    useEffect(() => {
        (async function () {
            const data = await GetTeamData.getEventData(2023, eventId)
            setEventName(data.data.short_name)
        })()
    }, [])

    const [active, setActive] = useState(pageIndex);

    const navigate = useNavigate()

    const mockdata = [
        { icon: IconHome2, label: 'Home', url: "/submissions" },
        { icon: IconGraph, label: 'Teams', url: "/submissions/teams" },
    ];

    if (teamName) {
        mockdata.push({ icon: IconFolder, label: teamName, url: `/submissions/teams/${teamName}` })
    }

    if (submissionId && !eventId) {
        mockdata.push({ icon: IconClipboardCheck, label: `Submission ${submissionId}`, url: `/submissions/teams/${teamName}/${submissionId}` })
    }

    mockdata.push({ icon: IconCalendarEvent, label: "Events", url: `/submissions/events` })

    if (eventId) {
        mockdata.push({ icon: IconCalendarStats, label: `${eventName}`, url: `/submissions/event/${eventId}` })
    }

    if (matchId) {
        mockdata.push({ icon: IconRadar, label: `Match ${matchId}`, url: `/submissions/event/${eventId}/${matchId}` })
    }

    if (eventId && matchId && submissionId) {
        mockdata.push({ icon: IconClipboardCheck, label: `Submission ${submissionId}`, url: `/submissions/event/${eventId}/${matchId}/${submissionId}` })
    }

    mockdata.push({ icon: IconAnalyze, label: `Data Analysis`, url: `/submissions/analysis` })

    const links = mockdata.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => {
                startNavigationProgress()
                setActive(index)
                navigate(link.url)
            }}
        />
    ));

    return (
        <>
            <Navbar
                className={`SubmissionsNavbar ${classes.hiddenMobile}`}
                width={{ base: 80 }}
                p="md"
            >
                <Navbar.Section grow>
                    <Stack justify="center" spacing={0}>
                        {links}
                    </Stack>
                </Navbar.Section>
            </Navbar>

            <Affix position={{ bottom: 20, right: 20 }} className={classes.hiddenDesktop}>
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
            </Drawer>
        </>
    );
}