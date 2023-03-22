import { Text, useMantineTheme } from "@mantine/core"
import { AggregationsNavbar } from "../Components/AggregationsNavbar"
import { UpdatedHeader } from "../Components/UpdatedHeader"
import submissionsHomeStyles from "../Styles/SubmissionsHomeStyles"

function AnalyzedHome() {

    const { classes } = submissionsHomeStyles()
    const theme = useMantineTheme()

    return (
        <div className="SubmissionsContainer">
            <UpdatedHeader />
            <div className="SubmissionsHomeSection">
                <AggregationsNavbar
                    location={"Home"} />
                <div className="SubmissionsHomeContent">
                    <h1 className={classes.title}>
                        <Text component="span" fw={900} color={theme.primaryColor} inherit>
                            Super Alliance
                        </Text>{' '}
                        <br />
                        Analytics Dashboard
                    </h1>
                </div>
            </div>
        </div>

    )
}

export default AnalyzedHome