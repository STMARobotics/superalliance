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

export function VisualsNavbar({ pageIndex, teamName, submissionId, eventId, matchId }: SubmissionsNavbarProps) {

    const { classes, cx, theme } = SubmissionsNavbarStyles()

    const [active, setActive] = useState("Visuals");
    const [activeLink, setActiveLink] = useState(pageIndex);
    const navigate = useNavigate()

    const mockdata = [
        { icon: IconHome2, label: 'Home', url: "/visuals" },
        { icon: IconGraph, label: 'Graphs', url: "/visuals/graphs" },
    ];

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
        </>
    );
}