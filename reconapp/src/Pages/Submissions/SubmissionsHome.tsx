import { SubmissionsNavbar } from "../Components/SubmissionsNavbar";
import { UpdatedHeader } from "../Components/UpdatedHeader";
import { Button, Group, Text } from "@mantine/core";
import submissionsHomeStyles from "../Styles/SubmissionsHomeStyles";
import { useNavigate } from "react-router-dom";
import { completeNavigationProgress } from "@mantine/nprogress";

function SubmissionsHome() {

    const { classes } = submissionsHomeStyles()
    const navigate = useNavigate();
    completeNavigationProgress()

    return (

        <div className="SubmissionsContainer">
            <UpdatedHeader />
            <div className="SubmissionsHomeSection">
                <SubmissionsNavbar
                    pageIndex={0} />
                <div className="SubmissionsHomeContent">
                    <h1 className={classes.title}>
                        <Text component="span" color="#ed1c24" inherit>
                            Super Alliance
                        </Text>{' '}
                        <br />
                        Submissions Dashboard
                    </h1>

                    <Group className={classes.controls}>
                        <Button
                            size="xl"
                            className={classes.control}
                            color={"blue"}
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