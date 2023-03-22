import { useState } from 'react';
import { Navbar, Title, } from '@mantine/core';
import AggregationsNavbarStyles from '../Styles/AggregationsNavbarStyles';
import { useNavigate } from 'react-router-dom';

interface AggregationsNavbarProps {
    location: string
}

const linksMockdata = [
    { label: 'Home', link: '/submissions/analysis' },
    { label: 'Team Overview', link: '/submissions/analysis/averages' },
    { label: 'Sorting', link: '/submissions/analysis/sorting' },
    { label: 'Filtering', link: '/submissions/analysis/filtering' },
    { label: 'Team Selection', link: '/submissions/analysis/selection' }
];

export function AggregationsNavbar({ location } : AggregationsNavbarProps) {
    const { classes, cx } = AggregationsNavbarStyles();
    const [active, setActive] = useState("Data Analysis");
    const [activeLink, setActiveLink] = useState(location);
    const navigate = useNavigate()

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
            </Drawer> */}
        </>
    );

}