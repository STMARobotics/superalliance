import { Button, Card, CardProps, Grid, LoadingOverlay, Overlay, Text } from "@mantine/core";
import { completeNavigationProgress } from "@mantine/nprogress";
import { useEffect, useState } from "react";
import { SubmissionsNavbar } from "../Components/SubmissionsNavbar";
import { UpdatedHeader } from "../Components/UpdatedHeader";
import EventContainerStyles from "../Styles/EventContainerStyles";
import GetTeamData from "../Utils/GetTeamData";

interface ImageActionBannerProps {
    title: React.ReactNode;
    description: React.ReactNode;
    image: string;
    action: {
        label: string;
        link: string;
    };
}

function SubmissionsEvents() {

    const [eventData, setEventData] = useState<any>([])
    const [visible, setVisible] = useState(true);

    const images = [
        "https://www.chiefdelphi.com/uploads/default/original/3X/4/c/4c5a3191b92e28e4ca4db2fbeda030b397a5363e.jpeg",
        "https://www.firstinspires.org/sites/all/themes/first/assets/images/2020/frc/event-experience.jpg",
        "https://www.chiefdelphi.com/uploads/default/original/3X/0/8/085dafe27377e80fe5a63cdbadc5637a9fc51679.jpeg",
        "https://www.chiefdelphi.com/uploads/default/optimized/3X/7/9/799271e72f8deda288015298086af1323155cfdb_2_690x388.jpeg"
    ]

    useEffect(() => {
        (async function () {
            setVisible(true)
            var eventArray: any[] = [];
            eventArray.push({
                name: "Testing Event",
                city: "China",
                event_type_string: "Regional",
                event_code: "testing"

            })
            eventArray.push({
                name: "Week 0 Event",
                city: "Wisconsin",
                event_type_string: "Testing",
                event_code: "week0"

            })
            const eventdata = await GetTeamData.getTeamEventData(7028, 2023)
            eventdata.data.map((event: any) => {
                eventArray.push(event)
            })
            setEventData(eventArray)
            setVisible(false)
        })()
    }, [])

    function EventBanner({
        title,
        description,
        image,
        action,
        style,
        className,
        ...others
    }: ImageActionBannerProps & Omit<CardProps, keyof ImageActionBannerProps | 'children'>) {
        const { classes, cx, theme } = EventContainerStyles();

        return (
            <Card
                radius="md"
                style={{ backgroundImage: `url(${image})`, ...style }}
                className={cx(classes.card, className)}
                {...others}
            >
                <Overlay
                    gradient={`linear-gradient(105deg, ${theme.black} 20%, #312f2f 50%, ${theme.colors.gray[9]} 100%)`}
                    opacity={0.55}
                    zIndex={0}
                />

                <div className={classes.content}>
                    <Text size="lg" weight={700} className={classes.title}>
                        {title}
                    </Text>

                    <Text size="sm" className={classes.description}>
                        {description}
                    </Text>

                    <Button
                        className={classes.action}
                        variant="white"
                        color="dark"
                        component="a"
                        size="xs"
                        href={action.link}
                    >
                        {action.label}
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <div className="SubmissionsContainer">
            <UpdatedHeader />
            <div style={{ position: 'relative' }}>
                <LoadingOverlay visible={visible} overlayBlur={2} />
                <div className="SubmissionsHomeSection">
                    <SubmissionsNavbar
                        pageIndex={2} />
                    <div className="SubmissionsFormsContent">
                        <Grid justify="center" align="flex-start">
                            {eventData.map((event: any, index: any) => (
                                <Grid.Col lg={6} sm={12} key={index}>
                                    <EventBanner
                                        title={event.name}
                                        description={`${event.city} • ${event.event_type_string}`}
                                        image={images[index]}
                                        action={{ link: `/submissions/event/${event.event_code}`, label: "Event Data" }}
                                        className="SubmissionsEventCard"
                                    />
                                </Grid.Col>
                            ))}
                        </Grid>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubmissionsEvents