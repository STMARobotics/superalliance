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
    useMantineColorScheme,
    Image,
    UnstyledButton,
    Center,
    Collapse,
    ThemeIcon,
    Menu,
    Avatar
} from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { completeNavigationProgress, startNavigationProgress } from '@mantine/nprogress';
import { registerSpotlightActions, removeSpotlightActions, useSpotlight } from '@mantine/spotlight';
import {
    IconAnalyze,
    IconBook,
    IconCalendarEvent,
    IconChartBar,
    IconCode,
    IconCoin,
    IconDashboard,
    IconFilter,
    IconFingerprint,
    IconForms,
    IconGraph,
    IconHome,
    IconHome2,
    IconHeart,
    IconStar,
    IconMessage,
    IconSettings,
    IconPlayerPause,
    IconTrash,
    IconSwitchHorizontal,
    IconChevronDown, IconLogout, IconMoonStars, IconNumber, IconSortAZ, IconSun, Icon2fa
} from '@tabler/icons';
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

    user: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
        borderRadius: theme.radius.sm,
        transition: 'background-color 100ms ease',

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        },

        [theme.fn.smallerThan('xs')]: {
            display: 'none',
        },
    },

    userActive: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    },
}));

export function UpdatedHeader() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const { classes, theme, cx } = useStyles();
    const navigate = useNavigate()
    const signOut = useSignOut();
    const logout = () => {
        signOut();
        setSelectedUser("")
        setPreferenceData({})
        navigate("/login");
    };
    const location = useLocation();

    const [preferenceData, setPreferenceData] = useLocalStorage<any>({
        key: 'saved-preferences',
        getInitialValueInEffect: false,
    });

    const submissionsMockdata = [
        {
            icon: IconGraph,
            title: 'Teams',
            description: 'View all team form submissions',
            link: '/submissions/teams'
        },
        {
            icon: IconCalendarEvent,
            title: 'Events',
            description: 'View all event form submissions',
            link: '/submissions/events'
        }
    ];

    const analysisMockdata = [
        {
            icon: IconChartBar,
            title: 'Averages',
            description: 'View averages and weight for a team.',
            link: '/submissions/analysis/averages'
        },
        {
            icon: IconSortAZ,
            title: 'Sorting',
            description: 'Sort through submissions.',
            link: '/submissions/analysis/sorting'
        },
        {
            icon: IconFilter,
            title: 'Filtering',
            description: 'Filter submissions and teams by selection.',
            link: '/submissions/analysis/filtering'
        }
    ];

    const userMobileMockdata = [
        {
            icon: IconStar,
            title: 'Submissions',
            description: 'View all your submissions.',
            link: '/user/submissions'
        },
        {
            icon: IconSettings,
            title: 'Preferences',
            description: 'Change your preferences.',
            link: '/user/preferences'
        }
    ];

    const adminMobileMockdata = [
        {
            icon: IconSettings,
            title: 'Form Settings',
            description: 'Settings for forms.',
            link: '/admin/formsettings'
        },
        {
            icon: IconForms,
            title: 'Form Management',
            description: 'Manage submissions.',
            link: '/admin/formmanagement'
        },
        {
            icon: Icon2fa,
            title: 'Authentication',
            description: 'Settings for SuperAlliance Authentication.',
            link: '/admin/auth'
        }
    ];


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

    const [eventData, setEventData] = useState<any>([])

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

    window.addEventListener('storage', handleChange)

    const [submissionsLinksOpened, { toggle: toggleSubmissionsLinks }] = useDisclosure(false);
    const [analysisLinksOpened, { toggle: toggleAnalysisLinks }] = useDisclosure(false);
    const [userMobileOpened, { toggle: toggleUserMobileOpened }] = useDisclosure(false)
    const [adminMobileOpened, { toggle: toggleAdminMobileOpened }] = useDisclosure(false)
    const [userMenuOpened, setUserMenuOpened] = useState(false);

    const [selectedUser, setSelectedUser] = useLocalStorage<any>({
        key: 'saved-username',
        getInitialValueInEffect: false,
    });

    const submissionsLinks = submissionsMockdata.map((item) => (
        <UnstyledButton className={classes.subLink} key={item.title} onClick={() => window.location.href = `${item.link}`}>
            <Group noWrap align="flex-start">
                <ThemeIcon size={34} variant="default" radius="md">
                    <item.icon size={22} color={theme.fn.primaryColor()} />
                </ThemeIcon>
                <div>
                    <Text size="sm" weight={500}>
                        {item.title}
                    </Text>
                    <Text size="xs" color="dimmed">
                        {item.description}
                    </Text>
                </div>
            </Group>
        </UnstyledButton>
    ));

    const analysisLinks = analysisMockdata.map((item) => (
        <UnstyledButton className={classes.subLink} key={item.title} onClick={() => window.location.href = `${item.link}`}>
            <Group noWrap align="flex-start">
                <ThemeIcon size={34} variant="default" radius="md">
                    <item.icon size={22} color={theme.fn.primaryColor()} />
                </ThemeIcon>
                <div>
                    <Text size="sm" weight={500}>
                        {item.title}
                    </Text>
                    <Text size="xs" color="dimmed">
                        {item.description}
                    </Text>
                </div>
            </Group>
        </UnstyledButton>
    ));

    const userMobileLinks = userMobileMockdata.map((item) => (
        <UnstyledButton className={classes.subLink} key={item.title} onClick={() => window.location.href = `${item.link}`}>
            <Group noWrap align="flex-start">
                <ThemeIcon size={34} variant="default" radius="md">
                    <item.icon size={22} color={theme.fn.primaryColor()} />
                </ThemeIcon>
                <div>
                    <Text size="sm" weight={500}>
                        {item.title}
                    </Text>
                    <Text size="xs" color="dimmed">
                        {item.description}
                    </Text>
                </div>
            </Group>
        </UnstyledButton>
    ));

    const adminobileLinks = adminMobileMockdata.map((item) => (
        <UnstyledButton className={classes.subLink} key={item.title} onClick={() => window.location.href = `${item.link}`}>
            <Group noWrap align="flex-start">
                <ThemeIcon size={34} variant="default" radius="md">
                    <item.icon size={22} color={theme.fn.primaryColor()} />
                </ThemeIcon>
                <div>
                    <Text size="sm" weight={500}>
                        {item.title}
                    </Text>
                    <Text size="xs" color="dimmed">
                        {item.description}
                    </Text>
                </div>
            </Group>
        </UnstyledButton>
    ));

    const getEventLabel = (num: any) => {
        try {
            const e = eventData.filter((e: any) => e.value == preferenceData.dataShow)[0]
            return e["label"]
        } catch {
            return "Unknown"
        }
    }

    return (
        <Box
            className='UpdatedHeader'>
            <Header height={60} px="md">
                <Group sx={{ height: '100%', width: '100%' }} position="apart" >
                    <Text
                        color={"#0066b3"}
                        ta="center"
                        fz="xl"
                        fw={700}
                        className={"HeaderText"}
                    >
                        <a href='/' className='no-decoration'>
                            <Text component="span" color={theme.primaryColor} inherit>
                                super
                            </Text>
                            alliance
                        </a>
                    </Text>
                    {isOnLoginPage ? null : <Group sx={{ height: '100%' }} position="center" spacing={0} className={classes.hiddenMobile}>
                        <a href="/" className={classes.link}>
                            Home
                        </a>
                        <a href="/newform" className={classes.link}>
                            New Form
                        </a>
                        <a href="/submissions" className={classes.link}>
                            Submissions
                        </a>
                        <a href="/submissions/analysis" className={classes.link}>
                            Analysis
                        </a>
                        {auth()?.user == "7028Admin" ? <a href="/admin" className={classes.link}>
                            Admin
                        </a> : null}
                    </Group>}

                    {/* <Group className={classes.hiddenMobile} position="right">
                        <Button variant="default" onClick={() => toggleColorScheme()}>{dark ? <IconSun size={24} /> : <IconMoonStars size={24} />}</Button>
                        {isOnLoginPage ? null : <Button onClick={logout}>{<IconLogout size={24} />}</Button>}
                    </Group> */}

                    <Group className={classes.hiddenMobile}>
                        <Menu
                            width={260}
                            position="bottom-end"
                            transition="pop-top-right"
                            onClose={() => setUserMenuOpened(false)}
                            onOpen={() => setUserMenuOpened(true)}
                        >
                            <Menu.Target>
                                <UnstyledButton
                                    className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                                >
                                    <Group spacing={7}>
                                        <Avatar src={"https://avatars.githubusercontent.com/u/74215559?v=4"} alt={selectedUser} radius="xl" size={20} />
                                        <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                                            {selectedUser}
                                        </Text>
                                        <IconChevronDown size={12} stroke={1.5} />
                                    </Group>
                                </UnstyledButton>
                            </Menu.Target>
                            <Menu.Dropdown>

                                <Menu.Label>Selected Theme: {preferenceData?.primaryColor ? preferenceData.primaryColor.charAt(0).toUpperCase() + preferenceData.primaryColor.slice(1) : "Blue"}</Menu.Label>
                                <Menu.Label>Showing Data: {preferenceData?.dataShow ? getEventLabel(preferenceData.dataShow) : "All"}</Menu.Label>

                                <Menu.Divider />

                                <Menu.Item
                                    onClick={() => toggleColorScheme()}
                                    icon={dark ? <IconSun size={14} stroke={1.5} /> : <IconMoonStars size={14} stroke={1.5} />}
                                >Change Theme</Menu.Item>

                                <Menu.Divider />

                                <Menu.Label>Menu</Menu.Label>
                                <Menu.Item onClick={() => {
                                    navigate('/user/submissions')
                                }} icon={<IconStar size={14} color={theme.colors.yellow[6]} stroke={1.5} />}>
                                    Your Submissions
                                </Menu.Item>

                                <Menu.Divider />

                                <Menu.Label>Settings</Menu.Label>
                                <Menu.Item onClick={() => {
                                    window.location.href = '/user/preferences'
                                }} icon={<IconSettings size={14} stroke={1.5} />}>Preferences</Menu.Item>
                                <Menu.Item onClick={() => {
                                    logout()
                                }} icon={<IconLogout size={14} stroke={1.5} />}>Logout</Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
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
                    <UnstyledButton className={classes.link} onClick={toggleSubmissionsLinks}>
                        <Center inline>
                            <Box component="span" mr={5}>
                                Submissions
                            </Box>
                            <IconChevronDown size={16} color={theme.fn.primaryColor()} />
                        </Center>
                    </UnstyledButton>
                    <Collapse in={submissionsLinksOpened}>{submissionsLinks}</Collapse>
                    <UnstyledButton className={classes.link} onClick={toggleAnalysisLinks}>
                        <Center inline>
                            <Box component="span" mr={5}>
                                Analysis
                            </Box>
                            <IconChevronDown size={16} color={theme.fn.primaryColor()} />
                        </Center>
                    </UnstyledButton>
                    <Collapse in={analysisLinksOpened}>{analysisLinks}</Collapse>

                    {auth()?.user == "7028Admin" ?
                        <>
                            <UnstyledButton className={classes.link} onClick={toggleAdminMobileOpened}>
                                <Center inline>
                                    <Box component="span" mr={5}>
                                        Admin
                                    </Box>
                                    <IconChevronDown size={16} color={theme.fn.primaryColor()} />
                                </Center>
                            </UnstyledButton>
                            <Collapse in={adminMobileOpened}>{adminobileLinks}</Collapse>
                        </>
                        : null}

                    <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />

                    <UnstyledButton className={classes.link} onClick={toggleUserMobileOpened}>
                        <Center inline>
                            <Avatar src={"https://avatars.githubusercontent.com/u/74215559?v=4"} alt={selectedUser} radius="xl" size={20} mr={10} />
                            <Box component="span" mr={5}>
                                {selectedUser}
                            </Box>
                            <IconChevronDown size={16} color={theme.fn.primaryColor()} />
                        </Center>
                    </UnstyledButton>
                    <Collapse in={userMobileOpened}>{userMobileLinks}</Collapse>

                    <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />

                    <Group position="center" grow pb="xl" px="md">
                        <Button variant="default" onClick={() => toggleColorScheme()}>{dark ? <IconSun size={24} /> : <IconMoonStars size={24} />}</Button>
                        <Button onClick={logout}>{<IconLogout size={24} />}</Button>
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box >
    );
}
