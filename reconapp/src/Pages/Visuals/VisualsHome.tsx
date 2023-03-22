import { UpdatedHeader } from "../Components/UpdatedHeader";
import { Button, Group, Text, useMantineTheme } from "@mantine/core";
import submissionsHomeStyles from "../Styles/SubmissionsHomeStyles";
import { useNavigate } from "react-router-dom";
import { VisualsNavbar } from "../Components/VisualsNavbar";

function VisualsHome() {

    const { classes } = submissionsHomeStyles()
    const navigate = useNavigate();
    const theme = useMantineTheme()

    return (

        <div className="SubmissionsContainer">
            <UpdatedHeader />
            <div className="SubmissionsHomeSection">
                <VisualsNavbar
                    pageIndex={"Home"} />
                <div className="SubmissionsHomeContent">
                    <h1 className={classes.title}>
                        <Text component="span" color={theme.primaryColor} inherit>
                            Super Alliance
                        </Text>{' '}
                        <br />
                        Visuals Dashboard
                    </h1>
                 </div>
            </div>
        </div>
    )
}

export default VisualsHome