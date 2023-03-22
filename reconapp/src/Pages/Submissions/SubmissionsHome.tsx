import { SubmissionsNavbar } from "../Components/SubmissionsNavbar";
import { UpdatedHeader } from "../Components/UpdatedHeader";
import { Button, Group, Text, useMantineTheme } from "@mantine/core";
import submissionsHomeStyles from "../Styles/SubmissionsHomeStyles";
import { useNavigate } from "react-router-dom";

function SubmissionsHome() {

    const { classes } = submissionsHomeStyles()
    const navigate = useNavigate();
    const theme = useMantineTheme()

    return (

        <div className="SubmissionsContainer">
            <UpdatedHeader />
            <div className="SubmissionsHomeSection">
                <SubmissionsNavbar
                    pageIndex={"Home"} />
                <div className="SubmissionsHomeContent">
                    <h1 className={classes.title}>
                        <Text component="span" color={theme.primaryColor} inherit>
                            Super Alliance
                        </Text>{' '}
                        <br />
                        Submissions Dashboard
                    </h1>

                    <Group className={classes.controls}>
                        <Button
                            size="xl"
                            className={classes.control}
                            onClick={() => {
                                navigate('/submissions/teams')
                            }}
                        >
                            View Teams
                        </Button>
                    </Group>
                </div>
            </div>
        </div>
    )
}

export default SubmissionsHome