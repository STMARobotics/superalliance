import { createStyles } from "@mantine/core";

const teamCardStyles = createStyles((theme) => {

    return {
        card: {
            position: 'relative',
            height: 100,
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.white,
            boxShadow: theme.shadows.sm,
            color: theme.primaryColor,
            border: `2px solid ${theme.colors[theme.primaryColor][8]} !important`,
        },

        overlay: {
            position: 'absolute',
            top: '0%',
            left: 0,
            right: 0,
            bottom: 0,
            background: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.white,
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
            color: theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.dark[6],
            marginBottom: 5,
            fontSize: theme.fontSizes.xl
        },

        bodyText: {
            color: theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.dark[6],
            marginLeft: 7,
        },

        number: {
            color: theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.dark[6],
        },
    };
});

export default teamCardStyles