import { useState } from 'react';
import { createStyles, Navbar, UnstyledButton, Tooltip, Title, Burger, Group, Affix, Transition, Button, ScrollArea, Divider, Drawer } from '@mantine/core';
import {
    IconHome2,
    IconGauge,
    IconDeviceDesktopAnalytics,
    IconFingerprint,
    IconCalendarStats,
    IconUser,
    IconSettings,
    IconArrowUp,
    IconMenu2,
    IconGraph,
    IconAnalyze,
    IconCalendarEvent,
} from '@tabler/icons';
import { MantineLogo } from '@mantine/ds';
import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import AggregationsNavbarStyles from '../Styles/AggregationsNavbarStyles';
import { useNavigate } from 'react-router-dom';

const mainLinksMockdata = [
    { icon: IconHome2, label: 'Home', url: "/submissions" },
    { icon: IconGraph, label: 'Teams', url: "/submissions/teams" },
    { icon: IconCalendarEvent, label: "Events", url: `/submissions/events` },
    { icon: IconAnalyze, label: `Data Analysis`, url:`/submissions/analysis` }
];

interface AggregationsNavbarProps {
    location: string
}

const linksMockdata = [
    { label: 'Home', link: '/submissions/analysis' },
    { label: 'Averages', link: '/submissions/analysis/averages' },
    { label: 'Sorting', link: '/submissions/analysis/sorting' },
    { label: 'Filtering', link: '/submissions/analysis/filtering' }
];

export function AggregationsNavbar({ location } : AggregationsNavbarProps) {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const { classes, cx, theme } = AggregationsNavbarStyles();
    const [active, setActive] = useState("Data Analysis");
    const [activeLink, setActiveLink] = useState(location);
    const navigate = useNavigate()

    const mainLinks = mainLinksMockdata.map((link) => (
        <Tooltip label={link.label} position="right" withArrow transitionDuration={0} key={link.label}>
            <UnstyledButton
                onClick={() => navigate(link.url)}
                className={cx(classes.mainLink, { [classes.mainLinkActive]: link.label === active })}
            >
                <link.icon stroke={1.5} />
            </UnstyledButton>
        </Tooltip>
    ));

    const links = linksMockdata.map((link) => (
        <a
            className={cx(classes.link, { [classes.linkActive]: activeLink === link.label })}
            href={link.link}
            onClick={(event) => {
                event.preventDefault();
                navigate(link.link)
            }}
            key={link.label}
        >
            {link.label}
        </a>
    ));

    return (
        <>
            <Navbar className={`AggregationsNavbar ${classes.hiddenMobile}`} width={{ sm: 300 }}>
                <Navbar.Section grow className={`${classes.wrapper} ${classes.hiddenMobile}`}>
                    <div className={classes.aside}>
                        
                        {mainLinks}
                    </div>
                    <div className={classes.main}>
                        <Title order={4} className={classes.title}>
                            {active}
                        </Title>

                        {links}
                    </div>
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
                size="100%"
                padding="md"
                title="Aggregation Data"
                className={`${classes.drawer} ${classes.hiddenDesktop}`}
                zIndex={1000000}
            >
                <ScrollArea sx={{ height: 'calc(100vh - 60px)' }} mx="-md">
                    <div className={classes.wrapper}>
                        <div className={classes.aside}>
                            
                            {mainLinks}
                        </div>
                        <div className={classes.main}>
                            <Title order={4} className={classes.title}>
                                {active}
                            </Title>

                            {links}
                        </div>
                    </div>
                </ScrollArea>
            </Drawer>
        </>
    );

}