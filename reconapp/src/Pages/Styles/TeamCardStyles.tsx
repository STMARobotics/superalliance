import { createStyles } from "@mantine/core";

const teamCardStyles = createStyles((theme) => {

    return {
        card: {
            position: 'relative',
            height: 100,
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
            boxShadow: theme.shadows.sm,
            color: theme.colors.blue
        },

        overlay: {
            position: 'absolute',
            top: '0%',
            left: 0,
            right: 0,
            bottom: 0,
            background: theme.colors.indigo,
        },

        button: {
            height: "50px",
        },

        content: {
            height: '100%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            zIndex: 1,
        },

        title: {
            color: theme.colorScheme === 'dark' ? "white" : "white",
            marginBottom: 5,
            fontSize: theme.fontSizes.xl
        },

        bodyText: {
            color: theme.colorScheme === 'dark' ? "white" : "white",
            marginLeft: 7,
        },

        number: {
            color: theme.colorScheme === 'dark' ? "white" : "white",
        },
    };
});

export default teamCardStyles