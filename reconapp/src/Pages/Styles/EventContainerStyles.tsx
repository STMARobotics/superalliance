import { createStyles } from "@mantine/core";

const EventContainerStyles = createStyles((theme) => ({
    card: {
        height: 200,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },

    content: {
        position: 'absolute',
        padding: theme.spacing.xl,
        zIndex: 1,
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },

    action: {
        position: 'absolute',
        bottom: theme.spacing.xl,
        right: theme.spacing.xl,
    },

    title: {
        color: theme.white,
        marginBottom: theme.spacing.xs / 2,
    },

    description: {
        color: theme.white,
        maxWidth: 220,
    },
}));

export default EventContainerStyles