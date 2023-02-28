import HeaderComponent from "../Components/Header"
import { Image, Anchor, Breadcrumbs, Button, Card, Container, createStyles, Group, Progress, SimpleGrid, Text, Title, useMantineTheme } from '@mantine/core';
import { UpdatedHeader } from "../Components/UpdatedHeader";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
    root: {
        paddingTop: 80,
        paddingBottom: 80,
    },

    title: {
        fontWeight: 900,
        fontSize: 34,
        marginBottom: theme.spacing.md,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,

        [theme.fn.smallerThan('sm')]: {
            fontSize: 32,
        },
    },

    control: {
        [theme.fn.smallerThan('sm')]: {
            width: '100%',
        },
    },

    mobileImage: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    desktopImage: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },
}));

function FourOhFour() {

    const theme = useMantineTheme();
    const { classes } = useStyles();
    const navigate = useNavigate()

    const items = [
        { title: 'Home', href: '/' },
        { title: '404 Page', href: '#' },
    ].map((item, index) => (
        <Anchor href={item.href} key={index}>
            {item.title}
        </Anchor>
    ));

    return (

        <div className="App">

            <UpdatedHeader />

            <div className="App-main">

                <>
                    <Breadcrumbs>{items}</Breadcrumbs>
                </>

                {/* <div className="FourOhFourContainer">

                    <Text
                        className="FourOhFourText"
                        color={"#0066b3"}
                        sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
                        ta="center"
                        fz="xl"
                        fw={700}
                    >
                        404!
                    </Text>

                    <Card
                        className="FourOhFourStatsBox"
                        withBorder
                        radius="md"
                        p="xl"
                        sx={(theme) => ({
                            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                        })}
                    >
                        <Text size="xs" transform="uppercase" weight={700} color="dimmed">
                            Your amount of female companions.
                        </Text>
                        <Text size="lg" weight={500}>
                            0 women / 3,904,727,342 women globally
                        </Text>
                        <Progress value={0} mt="md" size="lg" radius="xl" />
                    </Card>
                </div> */}

                <Container className={classes.root}>
                <SimpleGrid spacing={80} cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 40 }]}>
                    <Image src={"https://ui.mantine.dev/_next/static/media/image.11cd6c19.svg"} className={classes.mobileImage} />
                    <div>
                        <Title className={classes.title}>Something is not right...</Title>
                        <Text color="dimmed" size="lg">
                            Page you are trying to open does not exist. You may have mistyped the address, or the
                            page has been moved to another URL. If you think this is an error contact support.
                        </Text>
                        <Button variant="outline" size="md" mt="xl" className={classes.control} onClick={() => navigate('/')} >
                            Get back to home page
                        </Button>
                    </div>
                    <Image src={"https://ui.mantine.dev/_next/static/media/image.11cd6c19.svg"} className={classes.desktopImage} />
                </SimpleGrid>
            </Container>
            </div>
        </div>
    )
}

export default FourOhFour