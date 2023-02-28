import { RingProgress, Text, SimpleGrid, Paper, Center, Group, Grid, ThemeIcon } from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight, IconCheck, IconRobot, IconGraph } from '@tabler/icons';

interface StatsRingProps {
    data: {
        label: string;
        stats: string;
        progress: number;
        color: string;
        icon: 'up' | 'down';
    }[];
}

const icons = {
    up: IconArrowUpRight,
    down: IconArrowDownRight,
};

export function AverageStatsRings({ data }: StatsRingProps) {
    const stats = data.map((stat, index: any) => {
        const Icon = icons[stat.icon];
        return (
            <Grid.Col md={4} lg={3} key={index + 1}>
                <Paper withBorder radius="md" p="xs" key={stat.label}>
                    <Group>
                        {/* <RingProgress
                            size={80}
                            roundCaps
                            thickness={8}
                            sections={[{ value: stat.progress, color: stat.color }]}
                            label={
                                <Center>
                                    <Icon size={22} stroke={1.5} />
                                </Center>
                            }
                        /> */}
                        <RingProgress
                            size={80}
                            roundCaps
                            thickness={8}
                            sections={[{ value: stat.progress, color: stat.color }]}
                            label={
                                <Center>
                                    <ThemeIcon color={stat.color} variant="light" radius="xl" size="xl">
                                        <IconGraph size={22} stroke={1.5} />
                                    </ThemeIcon>
                                </Center>
                            }
                        />

                        <div>
                            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                                {stat.label}
                            </Text>
                            <Text weight={700} size="xl">
                                {stat.stats}
                            </Text>
                        </div>
                    </Group>
                </Paper>
            </Grid.Col>
        );
    });
    return (
        <Grid justify="center" align="flex-start">
            {stats}
        </Grid>
    );
}