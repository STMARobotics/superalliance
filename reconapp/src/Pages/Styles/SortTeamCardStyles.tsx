import { createStyles } from "@mantine/core";

const sortTeamCardStyles = createStyles((theme) => ({
    card: {
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'transform 150ms ease, box-shadow 100ms ease',
        padding: theme.spacing.xl,
        paddingLeft: theme.spacing.xl * 2,
        background: theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[1],

        '&:hover': {
            boxShadow: theme.shadows.md,
            transform: 'scale(1.02)',
        },

        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: 6,
            backgroundImage: theme.fn.linearGradient(0, theme.colors.indigo[6], theme.colors.cyan[6]),
        },
    },
}));

export default sortTeamCardStyles