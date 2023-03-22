import { useAuthUser } from "react-auth-kit"
import { UpdatedHeader } from "../Components/UpdatedHeader"
import { Card, createStyles, Group, RingProgress, Text, useMantineTheme } from '@mantine/core'
import { AccessDenied } from "../Components/AccessDenied"
import { AdministrationNavbar } from "../Components/AdministrationNavbar"

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        minWidth: '500px'
    },

    label: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 700,
        lineHeight: 1,
    },

    lead: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 700,
        fontSize: '22px',
        lineHeight: 1,
    },

    inner: {
        display: 'flex',

        [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column',
        },
    },

    ring: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',

        [theme.fn.smallerThan('xs')]: {
            justifyContent: 'center',
            marginTop: theme.spacing.md,
        },
    },
}));

interface StatsRingCardProps {
    title: string;
    completed: number;
    total: number;
    stats: {
        value: number;
        label: string;
    }[];
}

function AdminHomeStats({ title, completed, total, stats }: StatsRingCardProps) {
    const { classes, theme } = useStyles();
    const items = stats.map((stat) => (
        <div key={stat.label}>
            <Text className={classes.label}>{stat.value}</Text>
            <Text size="xs" color="dimmed">
                {stat.label}
            </Text>
        </div>
    ));

    return (
        <Card withBorder p="xl" radius="md" className={classes.card}>
            <div className={classes.inner}>
                <div>
                    <Text fz="xl" className={classes.label}>
                        {title}
                    </Text>
                    <div>
                        <Text className={classes.lead} mt={30}>
                            {completed}
                        </Text>
                        <Text fz="xs" color="dimmed">
                            Completed
                        </Text>
                    </div>
                    <Group mt="lg">{items}</Group>
                </div>

                <div className={classes.ring}>
                    <RingProgress
                        roundCaps
                        thickness={6}
                        size={150}
                        sections={[{ value: (completed / total) * 100, color: theme.primaryColor }]}
                        label={
                            <div>
                                <Text ta="center" fz="lg" className={classes.label}>
                                    {((completed / total) * 100).toFixed(0)}%
                                </Text>
                                <Text ta="center" fz="xs" c="dimmed">
                                    Completed
                                </Text>
                            </div>
                        }
                    />
                </div>
            </div>
        </Card>
    );
}

function AdminHome() {

    const auth = useAuthUser()
    const theme = useMantineTheme()

    return (
        <>
            {auth()?.user === "7028Admin" ? <>
                <div className="AdministrationContainer">

                    <UpdatedHeader />

                    <div className="AdministrationHomeSection">

                        <AdministrationNavbar
                            page="Home" />

                        <div className="AdministrationHomeContent">
                            <Text
                                className="SubmissionsFormDataTeamText"
                                color={theme.primaryColor}
                                ta="center"
                                fz="xl"
                                fw={700}
                            >
                                Administration
                            </Text>

                            <div className="AdminStatsContent">
                                <AdminHomeStats
                                    title="SuperAlliance Tasks"
                                    completed={1}
                                    total={2}
                                    stats={[
                                        { value: 1, label: "Remaining" },
                                        { value: 0, label: "In Progress" }
                                    ]} />
                            </div>
                        </div>
                    </div>
                </div>
            </> : <>
                <AccessDenied />
            </>}
        </>
    )
}

export default AdminHome