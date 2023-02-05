import {
    createStyles,
    Header,
    Group,
    Button,
    Text,
    Divider,
    Box,
    Burger,
    Drawer,
    ScrollArea,
    useMantineColorScheme
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { completeNavigationProgress, startNavigationProgress } from '@mantine/nprogress';
import { registerSpotlightActions, removeSpotlightActions, useSpotlight } from '@mantine/spotlight';
import { IconDashboard, IconForms, IconHome, IconLogout, IconMoonStars, IconNumber, IconSun } from '@tabler/icons';
import { useCallback, useEffect, useState } from 'react';
import { useAuthUser, useSignOut } from 'react-auth-kit';
import { useLocation, useNavigate } from 'react-router-dom';
import GetTeamData from '../Utils/GetTeamData';

const useStyles = createStyles((theme) => ({
    link: {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontWeight: 500,
        fontSize: theme.fontSizes.sm,

        [theme.fn.smallerThan('sm')]: {
            height: 42,
            display: 'flex',
            alignItems: 'center',
            width: '100%',
        },

        ...theme.fn.hover({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        }),
    },

    subLink: {
        width: '100%',
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        borderRadius: theme.radius.md,

        ...theme.fn.hover({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
        }),

        '&:active': theme.activeStyles,
    },

    dropdownFooter: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
        margin: -theme.spacing.md,
        marginTop: theme.spacing.sm,
        padding: `${theme.spacing.md}px ${theme.spacing.md * 2}px`,
        paddingBottom: theme.spacing.xl,
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
            }`,
    },

    hiddenMobile: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    hiddenDesktop: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },
}));

export function UpdatedHeader() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const { classes, theme } = useStyles();
    const navigate = useNavigate()
    const signOut = useSignOut();
    const logout = () => {
        signOut();
        navigate("/login");
    };
    const location = useLocation();

    const { actions } = useSpotlight()

    const auth = useAuthUser()

    var isOnLoginPage = false;

    if (location.pathname == "/login") {
        isOnLoginPage = true;
    }

    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    const handleChange = useCallback(() => {
        (async function () {
            const teamD = window.localStorage.getItem('teamNames');
            if (teamD) {
                const data = await JSON.parse(teamD)
                removeSpotlightActions(data.teams.map((team: any) => {
                    return `${team.number}`
                }))
                registerSpotlightActions(data.teams.map((team: any) => {
                    return {
                        id: `${team.number}`,
                        title: `Team #${team.number}`,
                        description: `${team.name}`,
                        icon: <IconNumber size={18} />,
                        group: `Team`,
                        onTrigger: () => window.location.href = `/submissions/teams/${team.number}`,
                    }
                }));
            }
        })();
    }, [])

    useEffect(() => {
        if (!isOnLoginPage) {
            (async function () {
                if (window.localStorage.getItem('teamNames')) {
                    const teamD = window.localStorage.getItem('teamNames');
                    if (teamD) {
                        const data = await JSON.parse(teamD)
                        removeSpotlightActions(data.teams.map((team: any) => {
                            return `${team.number}`
                        }))
                        registerSpotlightActions(data.teams.map((team: any) => {
                            return {
                                id: `${team.number}`,
                                title: `Team #${team.number}`,
                                description: `${team.name}`,
                                icon: <IconNumber size={18} />,
                                group: `Team`,
                                onTrigger: () => window.location.href = `/submissions/teams/${team.number}`,
                            }
                        }));
                    }
                } else {
                    const data = await GetTeamData.getTeamsFromAPI()
                    const registerData = data.data.teams.map((team: any) => {
                        return {
                            id: `${team.number}`,
                            title: `Team #${team.number}`,
                            description: `${team.name}`,
                            icon: <IconNumber size={18} />,
                            group: `Team`,
                            onTrigger: () => window.location.href = `/submissions/teams/${team.number}`,
                        }
                    })
                    registerSpotlightActions(registerData);
                }
            })()
        }
    }, [handleChange])

    window.addEventListener('storage', handleChange)

    return (
        <Box
            className='UpdatedHeader'>
            <Header height={60} px="md">
                <Group position="apart" sx={{ height: '100%' }} >
                    <Text
                        color={"#0066b3"}
                        ta="center"
                        fz="xl"
                        fw={700}
                    >
                        <a href='/' className='no-decoration'>
                            <Text component="span" fw={700} color="#ed1c24" inherit>
                                Super
                            </Text>{' '}
                            Alliance
                        </a>
                    </Text>
                    {isOnLoginPage ? null : <Group sx={{ height: '100%' }} spacing={0} className={classes.hiddenMobile}>
                        <a href="/" className={classes.link}>
                            Home
                        </a>
                        <a href="/newform" className={classes.link}>
                            New Form
                        </a>
                        <a href="/submissions" className={classes.link}>
                            Submissions
                        </a>
                        {auth()?.user == "Admin" ? <a href="/admin" className={classes.link}>
                            Admin
                        </a> : null}
                    </Group>}

                    <Group className={classes.hiddenMobile}>
                        <Button variant="default" onClick={() => toggleColorScheme()}>{dark ? <IconSun size={24} /> : <IconMoonStars size={24} />}</Button>
                        {isOnLoginPage ? null : <Button onClick={logout}>{<IconLogout size={24} />}</Button>}
                    </Group>

                    <Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop} />
                </Group>
            </Header>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Navigation"
                className={classes.hiddenDesktop}
                zIndex={1000000}
                position={"right"}
            >
                <ScrollArea sx={{ height: 'calc(100vh - 60px)' }} mx="-md">
                    <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />

                    <a href="/" className={classes.link}>
                        Home
                    </a>
                    <a href="/newform" className={classes.link}>
                        New Form
                    </a>
                    <a href="/submissions" className={classes.link}>
                        Submissions
                    </a>

                    {auth()?.user == "Admin" ? <a href="/admin" className={classes.link}>
                        Admin
                    </a> : null}

                    <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />

                    <Group position="center" grow pb="xl" px="md">
                        <Button variant="default" onClick={() => toggleColorScheme()}>{dark ? <IconSun size={24} /> : <IconMoonStars size={24} />}</Button>
                        <Button onClick={logout}>{<IconLogout size={24} />}</Button>
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box>
    );
}