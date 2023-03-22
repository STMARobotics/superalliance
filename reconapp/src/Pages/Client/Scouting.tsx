import '../Global.css'
import { ActionIcon, Avatar, Badge, Button, Card, Center, CloseButton, Container, createStyles, Dialog, Grid, Group, Paper, Progress, Text, useMantineTheme } from '@mantine/core';
import { IconClick, IconUpload } from '@tabler/icons';
import { UpdatedHeader } from '../Components/UpdatedHeader';
import { useEffect, useState } from 'react';
import { config } from '../../Constants';
import { useLocalStorage } from '@mantine/hooks';

const useStyles = createStyles((theme, _params, getRef) => ({
    card: {
        position: 'relative',
        height: `22rem`,
        width: `32rem`,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],

        [`&:hover .${getRef('image')}`]: {
            transform: 'scale(1.10)',
        },

        [theme.fn.smallerThan('sm')]: {
            position: 'relative',
            height: `20rem`,
            width: `18rem`,
        },
    },

    image: {
        ...theme.fn.cover(),
        ref: getRef('image'),
        backgroundSize: 'cover',
        transition: 'transform 500ms ease',
    },

    overlay: {
        position: 'absolute',
        top: '20%',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .85) 90%)',
    },

    content: {
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },

    title: {
        color: theme.white,
        fontWeight: 900,
        fontSize: `6vh`,
        textAlign: 'center',
        [`&:hover`]: {
            color: `${theme.colors[theme.primaryColor][6]}`,
        },
        transition: 'color 500ms ease',

        [theme.fn.smallerThan('sm')]: {
            fontSize: `5vh`,
        },
    },

    bodyText: {
        color: theme.colors.dark[2],
        marginLeft: `7px`,
    },

    author: {
        color: theme.colors.dark[2],
    },
}));

interface ImageCardProps {
    link: string;
    image: string;
    title: string;
}

function ImageCard({ image, title, link }: ImageCardProps) {
    const { classes, theme } = useStyles();

    return (
        <Card
            p="lg"
            shadow="lg"
            className={classes.card}
            radius="md"
            component="a"
            href={link}
        >
            <div className={classes.image} style={{ backgroundImage: `url(${image})` }} />
            <div className={classes.overlay} />

            <div className={classes.content}>
                <div>
                    <Text size="lg" className={classes.title} weight={500}>
                        {title}
                    </Text>
                </div>
            </div>
        </Card>
    );
}


function Scouting() {

    const theme = useMantineTheme()

    const { classes } = useStyles()

    const [preferenceData, setPreferenceData] = useLocalStorage<any>({
        key: 'saved-preferences',
        getInitialValueInEffect: false,
    });

    return (
        <div className="AppScouting">

            <UpdatedHeader />

            <div className="AppScouting-Main">

                <div className="ScoutingPageContainer">

                    <Group position='center'>
                        <ImageCard link={'/newform'} image={'https://www.chiefdelphi.com/uploads/default/original/3X/4/0/40bd651f09bd9316eaea31472e950c6dc8eea029.jpeg'} title={'Stand Scouting'} />

                        <ImageCard link={'/newpitform'} image={'https://www.chiefdelphi.com/uploads/default/original/3X/3/b/3b48d1b87aca0a83892ce9be506e00bb4f7a9817.jpeg'} title={'Pit Scouting'} />
                    </Group>

                </div>

            </div>
        </div>
    );
}

export default Scouting;