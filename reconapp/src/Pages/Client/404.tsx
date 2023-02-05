import HeaderComponent from "../Components/Header"
import { Anchor, Breadcrumbs, Card, Progress, Text, useMantineTheme } from '@mantine/core';
import { UpdatedHeader } from "../Components/UpdatedHeader";

function FourOhFour() {

    const theme = useMantineTheme();

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

                <div className="FourOhFourContainer">

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
                </div>
            </div>
        </div>
    )
}

export default FourOhFour