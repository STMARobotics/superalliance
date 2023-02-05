import {
    createStyles,
    Image,
    Container,
    Title,
    Button,
    Group,
    Text,
    List,
    ThemeIcon,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons';
import { useSignOut } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { UpdatedHeader } from './UpdatedHeader';

const useStyles = createStyles((theme) => ({
    inner: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: theme.spacing.xl * 4,
        paddingBottom: theme.spacing.xl * 4,
    },

    content: {
        maxWidth: 480,
        marginRight: theme.spacing.xl * 3,

        [theme.fn.smallerThan('md')]: {
            maxWidth: '100%',
            marginRight: 0,
        },
    },

    title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontSize: 44,
        lineHeight: 1.2,
        fontWeight: 900,

        [theme.fn.smallerThan('xs')]: {
            fontSize: 28,
        },
    },

    control: {
        [theme.fn.smallerThan('xs')]: {
            flex: 1,
        },
    },

    image: {
        flex: 1,

        [theme.fn.smallerThan('md')]: {
            display: 'none',
        },
    },

    highlight: {
        position: 'relative',
        backgroundColor: theme.fn.variant({ variant: 'filled', color: `red` }).background,
        borderRadius: theme.radius.sm,
        padding: '4px 12px',
    },
}));

export function AccessDenied() {

    const navigate = useNavigate()
    const signOut = useSignOut();
    const logout = () => {
        signOut();
        navigate("/login");
    };

    const { classes } = useStyles();
    return (
        <div className="App">

            <UpdatedHeader />
            <div>
                <Container>
                    <div className={classes.inner}>
                        <div className={classes.content}>
                            <Title className={classes.title}>
                            <span className={classes.highlight}>403</span> <br /> Access <span className={classes.highlight}>Denied</span><br /> Admin Panel
                            </Title>
                            <Text color="dimmed" mt="md">
                                The Administration Dashboard can only be accessed by a user that is logged into the Super Alliance Administration Account. <br />
                                If you think this is a mistake please contact an Administrator or Mentor.
                            </Text>

                            <Group mt={30}>
                                <Button radius="xl" size="md" className={classes.control} component={"a"} href={"/"}>
                                    Go Home
                                </Button>
                                <Button variant="default" radius="xl" size="md" className={classes.control} onClick={() => logout()}>
                                    Switch User
                                </Button>
                            </Group>
                        </div>
                        <Image src={`https://ui.mantine.dev/_next/static/media/image.9a65bd94.svg`} className={classes.image} />
                    </div>
                </Container>
            </div>
        </div>
    );
}
