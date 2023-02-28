import { createStyles, Card, Image, Text, Group, RingProgress } from '@mantine/core';

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },

    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
            }`,
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        lineHeight: 1,
    },
}));

interface CardWithStatsProps {
    title: string;
    author: string;
    formId: string;
    eventName: string;
    stats: {
        title: string;
        value: string;
    }[];
}

export function QuickInfoCard({ title, author, formId, eventName, stats }: CardWithStatsProps) {
    const { classes } = useStyles();

    const items = stats.map((stat) => (
        <div key={stat.title}>
            <Text size="xs" color="dimmed">
                {stat.title}
            </Text>
            <Text weight={500} size="sm">
                {stat.value}
            </Text>
        </div>
    ));

    return (
        <Card withBorder p="lg" className={classes.card}>
            <Text weight={500} size="md" pb={10}>
                Author: {author}
            </Text>
            <Text weight={500} size="md" pb={10}>
                Event: {eventName}
            </Text>
            <Text weight={500} size="md" pb={10}>
                Form ID: {formId}
            </Text>
            <Card.Section className={classes.footer}>{items}</Card.Section>
        </Card>
    );
}