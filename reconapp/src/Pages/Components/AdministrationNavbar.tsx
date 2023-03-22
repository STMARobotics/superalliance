import { useState } from 'react';
import { createStyles, Navbar, Group, Code, Text, useMantineTheme } from '@mantine/core';
import {
    IconBellRinging,
    IconFingerprint,
    IconKey,
    IconSettings,
    Icon2fa,
    IconDatabaseImport,
    IconReceipt2,
    IconSwitchHorizontal,
    IconLogout,
    IconHome2,
    IconForms,
    IconUser
} from '@tabler/icons';
import { config } from '../../Constants';
import { useNavigate } from 'react-router-dom';

const useStyles = createStyles((theme, _params, getRef) => {
    const icon = getRef('icon');
    return {
        header: {
            paddingBottom: theme.spacing.md,
            marginBottom: theme.spacing.md * 1.5,
            borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                }`,
        },

        footer: {
            bottom: 0,
            paddingTop: theme.spacing.md,
            marginTop: theme.spacing.md,
            borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                }`,
        },

        link: {
            ...theme.fn.focusStyles(),
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            fontSize: theme.fontSizes.sm,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
            padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
            borderRadius: theme.radius.sm,
            fontWeight: 500,

            '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                color: theme.colorScheme === 'dark' ? theme.white : theme.black,

                [`& .${icon}`]: {
                    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
                },
            },
        },

        linkIcon: {
            ref: icon,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
            marginRight: theme.spacing.sm,
        },

        linkActive: {
            '&, &:hover': {
                backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
                    .background,
                color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
                [`& .${icon}`]: {
                    color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
                },
            },
        },

        hiddenMobile: {
            [theme.fn.smallerThan('sm')]: {
                display: 'none',
            },
        },
    };
});

interface AdminNavbarProps {
    page: string
}

const data = [
    { link: '/admin', label: 'Home', icon: IconHome2 },
    { link: '/admin/userlookup', label: 'User Lookup', icon: IconUser },
    { link: '/admin/formsettings', label: 'Form Settings', icon: IconSettings },
    { link: '/admin/formmanagement', label: 'Form Management', icon: IconForms },
    // { link: '#', label: 'Security', icon: IconFingerprint },
    // { link: '#', label: 'Database', icon: IconDatabaseImport },
    { link: '/admin/auth', label: 'Authentication', icon: Icon2fa },
];

export function AdministrationNavbar({ page } : AdminNavbarProps) {
    const { classes, cx } = useStyles();
    const [active, setActive] = useState(page);
    const theme = useMantineTheme()
    const navigate = useNavigate()

    const links = data.map((item) => (
        <a
            className={cx(classes.link, { [classes.linkActive]: item.label === active })}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                event.preventDefault();
                setActive(item.label);
                navigate(item.link)
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </a>
    ));

    return (
        <Navbar className={`AdministrationNavbar ${classes.hiddenMobile}`} width={{ sm: 300 }} p="md">
            <Navbar.Section grow>
                <Group className={classes.header} position="apart">
                    <Text
                        color={theme.primaryColor}
                        ta="center"
                        fz="xl"
                        fw={700}
                    >
                        Administration
                    </Text>
                    <Code sx={{ fontWeight: 700 }}>{config.version}</Code>
                </Group>
                {links}
            </Navbar.Section>

            {/* <Navbar.Section className={classes.footer}>
                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span>Logout</span>
                </a>
            </Navbar.Section> */}
        </Navbar>
    );
}