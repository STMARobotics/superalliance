import { Button, Group, Text } from "@mantine/core"
import { completeNavigationProgress } from "@mantine/nprogress"
import { useNavigate } from "react-router-dom"
import { AggregationsNavbar } from "../Components/AggregationsNavbar"
import { UpdatedHeader } from "../Components/UpdatedHeader"
import submissionsHomeStyles from "../Styles/SubmissionsHomeStyles"

function AnalyzedHome() {

    const navigate = useNavigate()
    const { classes } = submissionsHomeStyles()
    completeNavigationProgress()

    return (
        <div className="SubmissionsContainer">
            <UpdatedHeader />
            <div className="SubmissionsHomeSection">
                <AggregationsNavbar
                    location={"Home"} />
                <div className="SubmissionsHomeContent">
                    <h1 className={classes.title}>
                        <Text component="span" fw={900} color={"#ed1c24"} inherit>
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